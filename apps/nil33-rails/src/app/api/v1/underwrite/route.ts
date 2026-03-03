/**
 * POST /api/v1/underwrite  — Run the 33-Signal underwriting engine
 * GET  /api/v1/underwrite  — List memos (paginated, filterable)
 *
 * Consumes @nil33/core scoring + memo + genome + reproducibility engines.
 * Persists the complete memo + sealed replay record to Postgres.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appendAuditEvent } from "@/lib/audit";
import { z } from "zod";
import {
  scoreAthlete,
  generateMemo,
  computeGenomeSignature,
  sealReplayRecord,
  buildDimensionContributionMap,
  RPN_WEIGHT_PROFILE,
  PTN_WEIGHT_PROFILE,
  runAllScenarios,
  ALL_SIGNAL_IDS,
  type AthleteSignalInput,
  type SignalId,
} from "@nil33/core";

// ─── Input Validation ───────────────────────────────────────────────────────

const SignalInputSchema = z.object({
  signalId: z.string(),
  rawScore: z.number().min(0).max(99),
  confidence: z.number().min(0).max(1).default(0.8),
  dataSource: z.string().default("manual"),
});

const UnderwriteRequestSchema = z.object({
  athleteId: z.string().min(1, "athleteId is required"),
  spvId: z.string().optional(),
  signals: z.array(SignalInputSchema).min(33).max(33),
  weightProfileType: z.enum(["revenue_participation_note", "portfolio_tranche_note"]).default("revenue_participation_note"),
  analystNotes: z.string().optional(),
  runStressTests: z.boolean().default(true),
});

// ─── POST: Run underwriting ─────────────────────────────────────────────────

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

  const parsed = UnderwriteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { athleteId, spvId, signals, weightProfileType, analystNotes, runStressTests } = parsed.data;

  // ── 1. Validate athlete exists ──────────────────────────────────────────
  const athlete = await prisma.athlete.findUnique({
    where: { id: athleteId },
    select: {
      id: true,
      displayName: true,
      sport: true,
      school: true,
      position: true,
      classYear: true,
    },
  });

  if (!athlete) {
    return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
  }

  // ── 2. Build engine input ───────────────────────────────────────────────
  const weightProfile = weightProfileType === "portfolio_tranche_note"
    ? PTN_WEIGHT_PROFILE
    : RPN_WEIGHT_PROFILE;

  const nameParts = athlete.displayName.split(" ");
  const athleteInput: AthleteSignalInput = {
    athleteId: athlete.id,
    athlete: {
      firstName: nameParts[0] || athlete.displayName,
      lastName: nameParts.slice(1).join(" ") || "",
      sport: athlete.sport,
      school: athlete.school,
      position: athlete.position || "Unknown",
      gradYear: parseInt(athlete.classYear || "2027"),
    },
    signals: signals.map((s) => ({
      signalId: s.signalId as SignalId,
      rawScore: s.rawScore,
      confidence: s.confidence,
      dataSource: s.dataSource,
    })),
    observedAt: new Date(),
  };

  // ── 3. Compute genome ──────────────────────────────────────────────────
  const genome = computeGenomeSignature(weightProfile, "1.0.0");

  // ── 4. Run engine ──────────────────────────────────────────────────────
  const memoInput = {
    athleteInput,
    weightProfile,
    modelVersionId: genome.genomeId,
    analystNotes,
  };

  const { memo, explainability } = generateMemo(memoInput);

  // ── 5. Explainability map ──────────────────────────────────────────────
  const dimensionContribMap = buildDimensionContributionMap(memo.compositeScore);

  // ── 6. Stress tests (optional) ─────────────────────────────────────────
  let stressResults: Record<string, unknown>[] | null = null;
  if (runStressTests) {
    const portfolioEntry = {
      input: athleteInput,
      valuation: memo.valuation,
      exposureCents: memo.valuation.midCents,
    };
    stressResults = runAllScenarios(
      `spv-${spvId || "standalone"}`,
      [portfolioEntry],
      weightProfile
    ).map((r) => ({
      scenarioId: r.scenarioId,
      baselineNavCents: r.baselineNavCents,
      stressedNavCents: r.stressedNavCents,
      navImpactPct: r.navImpactPct,
      baselineVaRCents: r.baselineVaRCents,
      stressedVaRCents: r.stressedVaRCents,
    }));
  }

  // ── 7. Seal replay record ──────────────────────────────────────────────
  const replayRecord = sealReplayRecord(memoInput, memo.id, genome);

  // ── 8. Persist to database ─────────────────────────────────────────────
  const savedMemo = await prisma.underwritingMemo.create({
    data: {
      athleteId: athlete.id,
      spvId: spvId || null,
      genomeId: genome.genomeId,
      genomeVersion: genome.version,
      compositeScore: memo.compositeScore.composite,
      grade: memo.compositeScore.grade,
      weightProfileType,
      dimensionScores: JSON.parse(JSON.stringify(memo.compositeScore.dimensions)),
      signalScores: JSON.parse(JSON.stringify(
        memo.compositeScore.dimensions.flatMap((d) => d.signals)
      )),
      flags: JSON.parse(JSON.stringify(
        memo.compositeScore.dimensions.flatMap((d) => d.flags)
      )),
      flagCount: memo.compositeScore.totalFlags,
      criticalFlagCount: memo.compositeScore.criticalFlags,
      covenants: JSON.parse(JSON.stringify(memo.covenantRecommendations)),
      covenantCount: memo.covenantRecommendations.length,
      valuationLowCents: memo.valuation.lowCents,
      valuationMidCents: memo.valuation.midCents,
      valuationHighCents: memo.valuation.highCents,
      riskNarrative: memo.riskNarrative,
      stressResults: stressResults ? JSON.parse(JSON.stringify(stressResults)) : undefined,
      explainability: JSON.parse(JSON.stringify(dimensionContribMap)),
      replayRecord: JSON.parse(JSON.stringify(replayRecord)),
      analystNotes: analystNotes || null,
      status: "DRAFT",
      createdById: session.user.id,
    },
  });

  // ── 9. Audit trail ─────────────────────────────────────────────────────
  await appendAuditEvent({
    action: "underwriting.memo_created",
    entityType: "underwriting_memo",
    entityId: savedMemo.id,
    actorId: session.user.id,
    snapshotAfter: {
      memoId: savedMemo.id,
      athleteId: athlete.id,
      genomeId: genome.genomeId,
      compositeScore: memo.compositeScore.composite,
      grade: memo.compositeScore.grade,
      valuationMidCents: memo.valuation.midCents,
    },
  });

  // ── 10. Return ─────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      id: savedMemo.id,
      athleteId: athlete.id,
      athleteName: athlete.displayName,
      genomeId: genome.genomeId,
      compositeScore: memo.compositeScore.composite,
      grade: memo.compositeScore.grade,
      dimensionScores: memo.compositeScore.dimensions,
      flags: memo.compositeScore.dimensions.flatMap((d) => d.flags),
      valuation: memo.valuation,
      covenants: memo.covenantRecommendations,
      riskNarrative: memo.riskNarrative,
      stressResults,
      explainability: dimensionContribMap,
      status: "DRAFT",
      createdAt: savedMemo.createdAt,
    },
    { status: 201 }
  );
}

// ─── GET: List memos ────────────────────────────────────────────────────────

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  athleteId: z.string().optional(),
  spvId: z.string().optional(),
  grade: z.string().optional(),
  status: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 422 });
  }

  const { page, pageSize, athleteId, spvId, grade, status } = parsed.data;

  const where: Record<string, unknown> = {};
  if (athleteId) where.athleteId = athleteId;
  if (spvId) where.spvId = spvId;
  if (grade) where.grade = grade;
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.underwritingMemo.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        athleteId: true,
        genomeId: true,
        compositeScore: true,
        grade: true,
        weightProfileType: true,
        flagCount: true,
        criticalFlagCount: true,
        covenantCount: true,
        valuationMidCents: true,
        status: true,
        createdAt: true,
        athlete: {
          select: { displayName: true, sport: true, school: true, position: true },
        },
      },
    }),
    prisma.underwritingMemo.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
