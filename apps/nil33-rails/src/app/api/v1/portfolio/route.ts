/**
 * POST /api/v1/portfolio  — Run portfolio-level analysis (stress + MC VaR)
 * GET  /api/v1/portfolio  — List portfolio snapshots
 *
 * Takes an SPV, gathers its latest memos, and runs:
 *   1. All-scenario stress tests across the portfolio
 *   2. Seeded Monte Carlo VaR
 *   3. Concentration analysis (HHI)
 *   4. Weighted-average composite + grade
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";
import { z } from "zod";
import {
  computeGenomeSignature,
  runAllScenarios,
  runMonteCarloVaR,
  assignGrade,
  RPN_WEIGHT_PROFILE,
  PTN_WEIGHT_PROFILE,
  type AthleteSignalInput,
  type SignalId,
} from "@nil33/core";

// ─── Input Validation ───────────────────────────────────────────────────────

const PortfolioRequestSchema = z.object({
  spvId: z.string().min(1),
  weightProfileType: z.enum(["revenue_participation_note", "portfolio_tranche_note"]).default("portfolio_tranche_note"),
  monteCarloSeed: z.number().int().optional(),
  monteCarloPaths: z.number().int().min(100).max(50000).default(1000),
  monteCarloConfidence: z.number().min(0.9).max(0.999).default(0.95),
  monteCarloHorizonDays: z.number().int().min(1).max(365).default(30),
});

// ─── POST: Run portfolio analysis ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = PortfolioRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const {
    spvId,
    weightProfileType,
    monteCarloSeed,
    monteCarloPaths,
    monteCarloConfidence,
    monteCarloHorizonDays,
  } = parsed.data;

  // ── 1. Validate SPV ────────────────────────────────────────────────────
  const spv = await prisma.spv.findUnique({ where: { id: spvId } });
  if (!spv) {
    return NextResponse.json({ error: "SPV not found" }, { status: 404 });
  }

  // ── 2. Get latest memo per athlete in this SPV ─────────────────────────
  const memos = await prisma.underwritingMemo.findMany({
    where: { spvId, status: { in: ["DRAFT", "SUBMITTED", "APPROVED"] } },
    orderBy: { createdAt: "desc" },
    distinct: ["athleteId"],
    include: {
      athlete: { select: { displayName: true, sport: true, school: true, position: true, classYear: true } },
    },
  });

  if (memos.length === 0) {
    return NextResponse.json(
      { error: "No underwriting memos found for this SPV. Run individual underwriting first." },
      { status: 422 }
    );
  }

  const weightProfile = weightProfileType === "portfolio_tranche_note"
    ? PTN_WEIGHT_PROFILE
    : RPN_WEIGHT_PROFILE;

  // ── 3. Reconstruct portfolio entries from memos ────────────────────────
  const portfolioEntries = memos.map((m) => {
    const nameParts = m.athlete.displayName.split(" ");
    const signalScores = m.signalScores as { signalId: string; rawScore: number; confidence: number; dataSource: string }[];

    const athleteInput: AthleteSignalInput = {
      athleteId: m.athleteId,
      athlete: {
        firstName: nameParts[0] || m.athlete.displayName,
        lastName: nameParts.slice(1).join(" ") || "",
        sport: m.athlete.sport,
        school: m.athlete.school,
        position: m.athlete.position || "Unknown",
        gradYear: parseInt(m.athlete.classYear || "2027"),
      },
      signals: signalScores.map((s) => ({
        signalId: s.signalId as SignalId,
        rawScore: s.rawScore,
        confidence: s.confidence,
        dataSource: s.dataSource,
      })),
      observedAt: new Date(m.createdAt),
    };

    return {
      input: athleteInput,
      valuation: {
        lowCents: m.valuationLowCents,
        midCents: m.valuationMidCents,
        highCents: m.valuationHighCents,
        confidenceInterval: 0.9,
        methodology: "hybrid" as const,
        assumptions: [],
      },
      exposureCents: m.valuationMidCents,
    };
  });

  // ── 4. Portfolio metrics ───────────────────────────────────────────────
  const totalNavCents = portfolioEntries.reduce((sum, e) => sum + e.valuation.midCents, 0);
  const weightedAvgScore = totalNavCents > 0
    ? memos.reduce((sum, m) => sum + m.compositeScore * m.valuationMidCents, 0) / totalNavCents
    : 0;
  const weightedAvgGrade = assignGrade(Math.round(weightedAvgScore));

  // HHI concentration
  const weights = portfolioEntries.map((e) => e.valuation.midCents / totalNavCents);
  const hhi = weights.reduce((sum, w) => sum + w * w, 0);

  // ── 5. Stress tests ───────────────────────────────────────────────────
  const stressResults = runAllScenarios(spvId, portfolioEntries, weightProfile).map((r) => ({
    scenarioId: r.scenarioId,
    baselineNavCents: r.baselineNavCents,
    stressedNavCents: r.stressedNavCents,
    navImpactPct: r.navImpactPct,
    baselineVaRCents: r.baselineVaRCents,
    stressedVaRCents: r.stressedVaRCents,
  }));

  // ── 6. Monte Carlo VaR ────────────────────────────────────────────────
  const seed = monteCarloSeed ?? Math.floor(Math.random() * 1_000_000);
  const mcConfig = {
    seed,
    paths: monteCarloPaths,
    confidenceLevel: monteCarloConfidence,
    horizonDays: monteCarloHorizonDays,
  };

  const mcResult = runMonteCarloVaR(portfolioEntries, weightProfile, mcConfig);

  // ── 7. Genome ─────────────────────────────────────────────────────────
  const genome = computeGenomeSignature(weightProfile, "1.0.0");

  // ── 8. Per-athlete detail ─────────────────────────────────────────────
  const portfolioDetail = memos.map((m, i) => ({
    athleteId: m.athleteId,
    athleteName: m.athlete.displayName,
    sport: m.athlete.sport,
    school: m.athlete.school,
    compositeScore: m.compositeScore,
    grade: m.grade,
    valuationMidCents: m.valuationMidCents,
    weight: weights[i],
    flagCount: m.flagCount,
    criticalFlagCount: m.criticalFlagCount,
    memoId: m.id,
  }));

  // ── 9. Persist snapshot ───────────────────────────────────────────────
  const snapshot = await prisma.portfolioSnapshot.create({
    data: {
      spvId,
      genomeId: genome.genomeId,
      totalNavCents,
      athleteCount: memos.length,
      weightedAvgScore,
      weightedAvgGrade,
      concentrationHhi: hhi,
      stressResults: JSON.parse(JSON.stringify(stressResults)),
      monteCarloVarCents: mcResult.varCents,
      monteCarloCvarCents: mcResult.cvarCents,
      monteCarloSeed: seed,
      monteCarloConfig: JSON.parse(JSON.stringify(mcConfig)),
      portfolioDetail: JSON.parse(JSON.stringify(portfolioDetail)),
    },
  });

  // ── 10. Audit trail ───────────────────────────────────────────────────
  await appendAuditEvent({
    action: "portfolio.snapshot_created",
    entityType: "portfolio_snapshot",
    entityId: snapshot.id,
    actorId: session.user.id,
    snapshotAfter: {
      snapshotId: snapshot.id,
      spvId,
      athleteCount: memos.length,
      totalNavCents,
      weightedAvgScore: Math.round(weightedAvgScore * 100) / 100,
      varCents: mcResult.varCents,
    },
  });

  // ── 11. Return ────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      id: snapshot.id,
      spvId,
      genomeId: genome.genomeId,
      summary: {
        totalNavCents,
        athleteCount: memos.length,
        weightedAvgScore: Math.round(weightedAvgScore * 100) / 100,
        weightedAvgGrade,
        concentrationHhi: Math.round(hhi * 10000) / 10000,
      },
      stressResults,
      monteCarlo: {
        varCents: mcResult.varCents,
        cvarCents: mcResult.cvarCents,
        seed: mcResult.seed,
        paths: mcResult.paths,
        confidenceLevel: mcResult.confidenceLevel,
        percentiles: mcResult.percentiles,
        componentVaR: mcResult.componentVaR,
      },
      portfolio: portfolioDetail,
      createdAt: snapshot.createdAt,
    },
    { status: 201 }
  );
}

// ─── GET: List portfolio snapshots ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spvId = req.nextUrl.searchParams.get("spvId");
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(req.nextUrl.searchParams.get("pageSize") ?? "20")));

  const where: Record<string, unknown> = {};
  if (spvId) where.spvId = spvId;

  const [items, total] = await Promise.all([
    prisma.portfolioSnapshot.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        spvId: true,
        genomeId: true,
        totalNavCents: true,
        athleteCount: true,
        weightedAvgScore: true,
        weightedAvgGrade: true,
        concentrationHhi: true,
        monteCarloVarCents: true,
        monteCarloCvarCents: true,
        createdAt: true,
        spv: { select: { legalName: true } },
      },
    }),
    prisma.portfolioSnapshot.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
