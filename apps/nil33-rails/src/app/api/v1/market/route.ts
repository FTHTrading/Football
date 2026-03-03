import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ── Active Market: instruments currently open or active ──
    const instruments = await prisma.instrument.findMany({
      where: { status: { in: ["OPEN", "ACTIVE"] } },
      include: {
        spv: { select: { legalName: true, status: true } },
        subscriptions: {
          select: { amountCents: true, status: true, subscribedAt: true, fundedAt: true },
        },
        _count: { select: { distributions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // ── Subscription pipeline across all instruments ──
    const allSubscriptions = await prisma.subscription.findMany({
      select: {
        amountCents: true,
        status: true,
        subscribedAt: true,
        fundedAt: true,
        instrumentId: true,
      },
    });

    const pipeline = {
      pending: { count: 0, amountCents: 0 },
      funded: { count: 0, amountCents: 0 },
      cancelled: { count: 0, amountCents: 0 },
      transferred: { count: 0, amountCents: 0 },
      matured: { count: 0, amountCents: 0 },
      total: { count: 0, amountCents: 0 },
    };

    for (const sub of allSubscriptions) {
      const key = sub.status.toLowerCase() as keyof typeof pipeline;
      if (pipeline[key]) {
        pipeline[key].count++;
        pipeline[key].amountCents += sub.amountCents;
      }
      pipeline.total.count++;
      pipeline.total.amountCents += sub.amountCents;
    }

    // ── Deal board: per-instrument market data ──
    const deals = instruments.map((ins) => {
      const subs = ins.subscriptions;
      const funded = subs.filter((s) => s.status === "FUNDED");
      const pending = subs.filter((s) => s.status === "PENDING");
      const totalRaised = funded.reduce((sum, s) => sum + s.amountCents, 0);
      const pendingAmount = pending.reduce((sum, s) => sum + s.amountCents, 0);
      const fillRate = ins.totalIssuanceAmtCents > 0
        ? Math.round((totalRaised / ins.totalIssuanceAmtCents) * 10000) / 100
        : 0;

      // Days since offering opened
      const daysOpen = ins.offeringOpenAt
        ? Math.floor((Date.now() - new Date(ins.offeringOpenAt).getTime()) / 86400000)
        : null;

      // Days until close
      const daysToClose = ins.offeringCloseAt
        ? Math.max(0, Math.floor((new Date(ins.offeringCloseAt).getTime() - Date.now()) / 86400000))
        : null;

      // Velocity: avg days from subscription to funding
      const fundedSubs = subs.filter((s) => s.status === "FUNDED" && s.fundedAt);
      const avgFundingDays = fundedSubs.length > 0
        ? Math.round(
            fundedSubs.reduce((sum, s) => {
              const diff = new Date(s.fundedAt!).getTime() - new Date(s.subscribedAt).getTime();
              return sum + diff / 86400000;
            }, 0) / fundedSubs.length
          )
        : null;

      return {
        id: ins.id,
        name: ins.name,
        spv: ins.spv.legalName,
        instrumentType: ins.instrumentType,
        status: ins.status,
        totalIssuanceCents: ins.totalIssuanceAmtCents,
        participationRateBps: ins.participationRateBps,
        minSubscriptionCents: ins.minSubscriptionCents,
        genomeId: ins.genomeId,
        genomeVersion: ins.genomeVersion,
        riskRating: ins.riskRating,
        offeringOpenAt: ins.offeringOpenAt,
        offeringCloseAt: ins.offeringCloseAt,
        maturityDate: ins.maturityDate,
        subscriberCount: subs.length,
        fundedCount: funded.length,
        pendingCount: pending.length,
        totalRaisedCents: totalRaised,
        pendingAmountCents: pendingAmount,
        fillRate,
        daysOpen,
        daysToClose,
        avgFundingDays,
        distributionCount: ins._count.distributions,
      };
    });

    // ── Market overview stats ──
    const [totalInstruments, openInstruments, activeInstruments, closedInstruments] =
      await Promise.all([
        prisma.instrument.count(),
        prisma.instrument.count({ where: { status: "OPEN" } }),
        prisma.instrument.count({ where: { status: "ACTIVE" } }),
        prisma.instrument.count({ where: { status: { in: ["CLOSED", "MATURED"] } } }),
      ]);

    // ── Investor demand: top investors by capital deployed ──
    const topInvestors = await prisma.investor.findMany({
      where: { totalInvestedCents: { gt: 0 } },
      select: {
        id: true,
        legalName: true,
        totalInvestedCents: true,
        accreditationStatus: true,
        kycStatus: true,
        _count: { select: { subscriptions: true } },
      },
      orderBy: { totalInvestedCents: "desc" },
      take: 10,
    });

    // ── Recent subscription activity ──
    const recentSubscriptions = await prisma.subscription.findMany({
      take: 15,
      orderBy: { subscribedAt: "desc" },
      select: {
        id: true,
        amountCents: true,
        status: true,
        subscribedAt: true,
        fundedAt: true,
        instrument: { select: { name: true } },
        investor: { select: { legalName: true } },
      },
    });

    return NextResponse.json({
      overview: {
        totalInstruments,
        openInstruments,
        activeInstruments,
        closedInstruments,
        totalCapitalRaisedCents: pipeline.funded.amountCents,
        totalPendingCents: pipeline.pending.amountCents,
        averageFillRate: deals.length > 0
          ? Math.round(deals.reduce((sum, d) => sum + d.fillRate, 0) / deals.length * 100) / 100
          : 0,
      },
      pipeline,
      deals,
      topInvestors,
      recentSubscriptions,
    });
  } catch (err) {
    console.error("[market] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
