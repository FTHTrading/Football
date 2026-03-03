import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ── Capital deployed ──
    const fundedSubs = await prisma.subscription.findMany({
      where: { status: "FUNDED" },
      select: { amountCents: true, fundedAt: true, instrumentId: true },
    });
    const totalDeployedCents = fundedSubs.reduce((s, sub) => s + sub.amountCents, 0);

    // ── Capital returned (distributions) ──
    const distributions = await prisma.distribution.findMany({
      select: {
        id: true,
        grossRevenueCents: true,
        participationCents: true,
        managementFeeCents: true,
        netDistributableCents: true,
        status: true,
        periodStart: true,
        periodEnd: true,
        genomeId: true,
        genomeVersion: true,
        executedAt: true,
        createdAt: true,
        instrument: { select: { name: true, id: true } },
        _count: { select: { lines: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalGrossRevenueCents = distributions.reduce((s, d) => s + d.grossRevenueCents, 0);
    const totalParticipationCents = distributions.reduce((s, d) => s + d.participationCents, 0);
    const totalMgmtFeesCents = distributions.reduce((s, d) => s + d.managementFeeCents, 0);
    const totalNetDistributedCents = distributions.reduce((s, d) => s + d.netDistributableCents, 0);
    const completedDists = distributions.filter((d) => d.status === "COMPLETE");
    const executingDists = distributions.filter((d) => d.status === "EXECUTING");

    // ── Wire execution lines ──
    const [totalLines, wiredLines, failedLines] = await Promise.all([
      prisma.distributionLine.count(),
      prisma.distributionLine.count({ where: { status: "WIRED" } }),
      prisma.distributionLine.count({ where: { status: "FAILED" } }),
    ]);

    // ── Waterfall breakdown by instrument ──
    const instrumentIds = [...new Set(distributions.map((d) => d.instrument.id))];
    const waterfallByInstrument = instrumentIds.map((instId) => {
      const dists = distributions.filter((d) => d.instrument.id === instId);
      const name = dists[0]?.instrument.name ?? "Unknown";
      return {
        instrumentId: instId,
        instrumentName: name,
        distributionCount: dists.length,
        grossRevenueCents: dists.reduce((s, d) => s + d.grossRevenueCents, 0),
        participationCents: dists.reduce((s, d) => s + d.participationCents, 0),
        mgmtFeeCents: dists.reduce((s, d) => s + d.managementFeeCents, 0),
        netDistributableCents: dists.reduce((s, d) => s + d.netDistributableCents, 0),
        latestPeriodEnd: dists[0]?.periodEnd ?? null,
      };
    });

    // ── Capital velocity ──
    // Time from funding to first distribution across instruments
    const instrumentFirstDist = await prisma.distribution.groupBy({
      by: ["instrumentId"],
      where: { status: "COMPLETE" },
      _min: { executedAt: true },
    });

    const instrumentFirstFund = await prisma.subscription.groupBy({
      by: ["instrumentId"],
      where: { status: "FUNDED" },
      _min: { fundedAt: true },
    });

    const velocities: { instrumentId: string; daysToFirstReturn: number }[] = [];
    for (const dist of instrumentFirstDist) {
      const fund = instrumentFirstFund.find((f) => f.instrumentId === dist.instrumentId);
      if (fund?._min.fundedAt && dist._min.executedAt) {
        const days = Math.floor(
          (new Date(dist._min.executedAt).getTime() - new Date(fund._min.fundedAt).getTime()) / 86400000
        );
        velocities.push({ instrumentId: dist.instrumentId, daysToFirstReturn: days });
      }
    }
    const avgDaysToReturn = velocities.length > 0
      ? Math.round(velocities.reduce((s, v) => s + v.daysToFirstReturn, 0) / velocities.length)
      : null;

    // ── Holding period / maturity schedule ──
    const instruments = await prisma.instrument.findMany({
      where: { status: { in: ["ACTIVE", "OPEN"] } },
      select: {
        id: true,
        name: true,
        holdingPeriodDays: true,
        maturityDate: true,
        status: true,
        createdAt: true,
      },
      orderBy: { maturityDate: "asc" },
    });

    const maturitySchedule = instruments
      .filter((i) => i.maturityDate)
      .map((i) => {
        const daysToMaturity = Math.max(
          0,
          Math.floor((new Date(i.maturityDate!).getTime() - Date.now()) / 86400000)
        );
        return {
          instrumentId: i.id,
          instrumentName: i.name,
          maturityDate: i.maturityDate,
          holdingPeriodDays: i.holdingPeriodDays,
          daysToMaturity,
          status: daysToMaturity === 0 ? "MATURING" : daysToMaturity < 30 ? "APPROACHING" : "ON_TRACK",
        };
      });

    // ── Distribution status pipeline ──
    const distPipeline = {
      draft: distributions.filter((d) => d.status === "DRAFT").length,
      pendingApproval: distributions.filter((d) => d.status === "PENDING_APPROVAL").length,
      approved: distributions.filter((d) => d.status === "APPROVED").length,
      executing: executingDists.length,
      complete: completedDists.length,
      failed: distributions.filter((d) => d.status === "FAILED").length,
    };

    // ── Genome stamp audit ──
    const genomePenetration = {
      stamped: distributions.filter((d) => d.genomeId).length,
      total: distributions.length,
      coverage: distributions.length > 0
        ? Math.round((distributions.filter((d) => d.genomeId).length / distributions.length) * 10000) / 100
        : 0,
    };

    return NextResponse.json({
      overview: {
        totalDeployedCents,
        totalGrossRevenueCents,
        totalParticipationCents,
        totalMgmtFeesCents,
        totalNetDistributedCents,
        returnOnDeployed: totalDeployedCents > 0
          ? Math.round((totalNetDistributedCents / totalDeployedCents) * 10000) / 100
          : 0,
        avgDaysToReturn,
      },
      distPipeline,
      wireExecution: {
        totalLines,
        wiredLines,
        failedLines,
        pendingLines: totalLines - wiredLines - failedLines,
        successRate: totalLines > 0
          ? Math.round((wiredLines / totalLines) * 10000) / 100
          : 0,
      },
      waterfallByInstrument,
      maturitySchedule,
      genomePenetration,
      recentDistributions: distributions.slice(0, 10),
    });
  } catch (err) {
    console.error("[capital] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
