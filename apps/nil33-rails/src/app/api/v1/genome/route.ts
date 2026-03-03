/**
 * GET /api/v1/genome
 *
 * Genome Identity Console API — returns the live genome signature,
 * component hash breakdown, portfolio genome distribution, drift edges,
 * mutation risk, and version lineage from UnderwritingRun history.
 *
 * This is the institutional transparency endpoint: everything the model IS.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  computeGenomeSignature,
  FLAG_RULES_CANONICAL,
  VALUATION_MODEL_CANONICAL,
} from "@nil33/core";
import { RPN_WEIGHT_PROFILE, PTN_WEIGHT_PROFILE } from "@nil33/core";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ── 1. Compute the live genome for both instrument types ────────────
    const rpnGenome = computeGenomeSignature(RPN_WEIGHT_PROFILE, "1.0.0");
    const ptnGenome = computeGenomeSignature(PTN_WEIGHT_PROFILE, "1.0.0");

    // ── 2. Component hash breakdown ─────────────────────────────────────
    const components = [
      { key: "signalSchemaHash", label: "Signal Schema", hash: rpnGenome.signalSchemaHash, description: "Ordered set of 33 signal IDs mapped to 6 dimensions" },
      { key: "weightProfileHash", label: "Weight Profile (RPN)", hash: rpnGenome.weightProfileHash, description: "Dimension & signal weights for Revenue Participation Notes" },
      { key: "thresholdHash", label: "Grade Thresholds", hash: rpnGenome.thresholdHash, description: "A+ through F grade boundary scores" },
      { key: "stressMatrixHash", label: "Stress Matrix", hash: rpnGenome.stressMatrixHash, description: "Built-in stress scenarios & shock vectors" },
      { key: "covenantRulesHash", label: "Covenant Rules", hash: rpnGenome.covenantRulesHash, description: "Covenant generation logic & triggers" },
      { key: "flagRulesHash", label: "Flag Rules", hash: rpnGenome.flagRulesHash, description: "Risk flag threshold & severity configuration" },
      { key: "valuationModelHash", label: "Valuation Model", hash: rpnGenome.valuationModelHash, description: "Score-to-multiplier curve & spread formula" },
    ];

    // ── 3. Portfolio genome distribution (from stamped instruments) ──────
    const instruments = await prisma.instrument.findMany({
      where: { genomeId: { not: null } },
      select: {
        id: true,
        name: true,
        genomeId: true,
        genomeVersion: true,
        totalIssuanceAmtCents: true,
        status: true,
      },
    });

    // Group by genomeId
    const clusterMap = new Map<string, {
      genomeId: string;
      genomeVersion: string | null;
      instruments: typeof instruments;
      totalExposureCents: number;
    }>();

    for (const inst of instruments) {
      const gid = inst.genomeId!;
      const existing = clusterMap.get(gid);
      if (existing) {
        existing.instruments.push(inst);
        existing.totalExposureCents += inst.totalIssuanceAmtCents;
      } else {
        clusterMap.set(gid, {
          genomeId: gid,
          genomeVersion: inst.genomeVersion,
          instruments: [inst],
          totalExposureCents: inst.totalIssuanceAmtCents,
        });
      }
    }

    const totalExposureCents = instruments.reduce((s, i) => s + i.totalIssuanceAmtCents, 0);
    const clusters = Array.from(clusterMap.values())
      .map((c) => ({
        genomeId: c.genomeId,
        genomeVersion: c.genomeVersion,
        instrumentCount: c.instruments.length,
        totalExposureCents: c.totalExposureCents,
        weightPct: totalExposureCents > 0 ? c.totalExposureCents / totalExposureCents : 0,
      }))
      .sort((a, b) => b.totalExposureCents - a.totalExposureCents);

    // Homogeneity (HHI of genome weights)
    const homogeneityIndex = clusters.reduce((s, c) => s + c.weightPct * c.weightPct, 0) || 1;

    // ── 4. Version lineage from UnderwritingRuns ────────────────────────
    const runs = await prisma.underwritingRun.findMany({
      select: {
        id: true,
        genomeId: true,
        genomeVersion: true,
        snapshotHash: true,
        createdAt: true,
        athlete: { select: { displayName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Distinct genome versions seen in runs
    const versionHistory = new Map<string, {
      genomeId: string;
      genomeVersion: string;
      firstSeen: Date;
      lastSeen: Date;
      runCount: number;
    }>();

    for (const run of runs) {
      const existing = versionHistory.get(run.genomeId);
      if (existing) {
        existing.runCount++;
        if (run.createdAt < existing.firstSeen) existing.firstSeen = run.createdAt;
        if (run.createdAt > existing.lastSeen) existing.lastSeen = run.createdAt;
      } else {
        versionHistory.set(run.genomeId, {
          genomeId: run.genomeId,
          genomeVersion: run.genomeVersion,
          firstSeen: run.createdAt,
          lastSeen: run.createdAt,
          runCount: 1,
        });
      }
    }

    // ── 5. Drift check: is current genome in-sync with latest stamped? ──
    const latestStampedGenomeId = runs[0]?.genomeId ?? null;
    const driftDetected = latestStampedGenomeId
      ? latestStampedGenomeId !== rpnGenome.genomeId
      : false;

    // ── 6. Underwriting memo genome coverage ────────────────────────────
    const [totalMemos, memosWithGenome] = await Promise.all([
      prisma.underwritingMemo.count(),
      prisma.underwritingMemo.count({ where: { genomeId: { not: "" } } }),
    ]);

    const genomeCoverage = totalMemos > 0 ? memosWithGenome / totalMemos : 0;

    // ── 7. Distribution genome coverage ─────────────────────────────────
    const [totalDists, distsWithGenome] = await Promise.all([
      prisma.distribution.count(),
      prisma.distribution.count({ where: { genomeId: { not: null } } }),
    ]);

    const distGenomeCoverage = totalDists > 0 ? distsWithGenome / totalDists : 0;

    // ── 8. Flag & valuation canonical counts ────────────────────────────
    const flagRuleCount = FLAG_RULES_CANONICAL.length;
    const valuationBands = VALUATION_MODEL_CANONICAL.multiplierCurve.length;

    return NextResponse.json({
      liveGenome: {
        rpn: rpnGenome,
        ptn: ptnGenome,
        driftDetected,
        latestStampedGenomeId,
      },
      components,
      portfolio: {
        stampedInstruments: instruments.length,
        totalExposureCents,
        distinctGenomes: clusters.length,
        clusters,
        homogeneityIndex,
        mutationRisk: clusters.length > 1 ? Math.min(1, (1 - homogeneityIndex) * 1.5) : 0,
      },
      versionHistory: Array.from(versionHistory.values()).sort(
        (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime()
      ),
      recentRuns: runs.slice(0, 20).map((r) => ({
        id: r.id,
        genomeId: r.genomeId,
        genomeVersion: r.genomeVersion,
        athleteName: r.athlete.displayName,
        createdAt: r.createdAt,
      })),
      coverage: {
        memos: { total: totalMemos, stamped: memosWithGenome, pct: genomeCoverage },
        distributions: { total: totalDists, stamped: distsWithGenome, pct: distGenomeCoverage },
      },
      modelMeta: {
        signalCount: 33,
        dimensionCount: 6,
        flagRuleCount,
        valuationBands,
        stressScenarios: 5,
        covenantTypes: 4,
      },
    });
  } catch (err) {
    console.error("Genome API error:", err);
    return NextResponse.json(
      { error: "Failed to compute genome state", detail: String(err) },
      { status: 500 }
    );
  }
}
