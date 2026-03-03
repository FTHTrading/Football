import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { SubscriptionPipeline } from "@/components/SubscriptionPipeline";
import { DemandLeaderboard } from "@/components/DemandLeaderboard";

/* ── Data fetchers ──────────────────────────────────────────────────────────── */

async function getMarketDeals() {
  const instruments = await prisma.instrument.findMany({
    where: { status: { in: ["OPEN", "ACTIVE"] } },
    include: {
      spv: { select: { legalName: true } },
      subscriptions: {
        select: { amountCents: true, status: true, subscribedAt: true, fundedAt: true },
      },
      _count: { select: { distributions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return instruments.map((ins) => {
    const funded = ins.subscriptions.filter((s) => s.status === "FUNDED");
    const pending = ins.subscriptions.filter((s) => s.status === "PENDING");
    const totalRaised = funded.reduce((sum, s) => sum + s.amountCents, 0);
    const pendingAmount = pending.reduce((sum, s) => sum + s.amountCents, 0);
    const fillRate = ins.totalIssuanceAmtCents > 0
      ? Math.round((totalRaised / ins.totalIssuanceAmtCents) * 10000) / 100
      : 0;
    const daysToClose = ins.offeringCloseAt
      ? Math.max(0, Math.floor((new Date(ins.offeringCloseAt).getTime() - Date.now()) / 86400000))
      : null;

    return {
      id: ins.id,
      name: ins.name,
      spv: ins.spv.legalName,
      status: ins.status,
      totalIssuanceCents: ins.totalIssuanceAmtCents,
      participationRateBps: ins.participationRateBps,
      genomeId: ins.genomeId,
      genomeVersion: ins.genomeVersion,
      riskRating: ins.riskRating,
      subscriberCount: ins.subscriptions.length,
      fundedCount: funded.length,
      pendingCount: pending.length,
      totalRaisedCents: totalRaised,
      pendingAmountCents: pendingAmount,
      fillRate,
      daysToClose,
      offeringCloseAt: ins.offeringCloseAt,
      distributionCount: ins._count.distributions,
    };
  });
}

async function getSubscriptionPipeline() {
  const subs = await prisma.subscription.findMany({
    select: { amountCents: true, status: true },
  });

  const pipeline: Record<string, { count: number; amountCents: number }> = {};
  for (const sub of subs) {
    if (!pipeline[sub.status]) pipeline[sub.status] = { count: 0, amountCents: 0 };
    pipeline[sub.status].count++;
    pipeline[sub.status].amountCents += sub.amountCents;
  }
  return pipeline;
}

async function getMarketOverview() {
  const [total, open, active, closed, matured] = await Promise.all([
    prisma.instrument.count(),
    prisma.instrument.count({ where: { status: "OPEN" } }),
    prisma.instrument.count({ where: { status: "ACTIVE" } }),
    prisma.instrument.count({ where: { status: "CLOSED" } }),
    prisma.instrument.count({ where: { status: "MATURED" } }),
  ]);
  return { total, open, active, closed, matured };
}

async function getTopInvestors() {
  return prisma.investor.findMany({
    where: { totalInvestedCents: { gt: 0 } },
    select: {
      id: true,
      legalName: true,
      totalInvestedCents: true,
      accreditationStatus: true,
      _count: { select: { subscriptions: true } },
    },
    orderBy: { totalInvestedCents: "desc" },
    take: 10,
  });
}

async function getRecentSubscriptions() {
  return prisma.subscription.findMany({
    take: 12,
    orderBy: { subscribedAt: "desc" },
    select: {
      id: true,
      amountCents: true,
      status: true,
      subscribedAt: true,
      instrument: { select: { name: true } },
      investor: { select: { legalName: true } },
    },
  });
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

const STATUS_BADGE: Record<string, string> = {
  OPEN: "badge-green",
  ACTIVE: "badge-cyan",
  PENDING: "badge-yellow",
  FUNDED: "badge-green",
  CANCELLED: "badge-red",
  TRANSFERRED: "badge-muted",
  MATURED: "badge-yellow",
};

export default async function MarketBoardPage() {
  const [deals, pipeline, overview, topInvestors, recentSubs] = await Promise.all([
    getMarketDeals(),
    getSubscriptionPipeline(),
    getMarketOverview(),
    getTopInvestors(),
    getRecentSubscriptions(),
  ]);

  const totalCapitalRaised = deals.reduce((s, d) => s + d.totalRaisedCents, 0);
  const totalPending = deals.reduce((s, d) => s + d.pendingAmountCents, 0);
  const avgFillRate = deals.length > 0
    ? Math.round(deals.reduce((s, d) => s + d.fillRate, 0) / deals.length * 100) / 100
    : 0;

  const overviewStats = [
    { label: "Total Instruments", value: overview.total, color: "text-rails-text" },
    { label: "Open Offerings", value: overview.open, color: "text-rails-green" },
    { label: "Active Deals", value: overview.active, color: "text-rails-cyan" },
    { label: "Capital Raised", value: formatCents(totalCapitalRaised), color: "text-rails-green" },
    { label: "Pending Capital", value: formatCents(totalPending), color: "text-rails-gold" },
    { label: "Avg Fill Rate", value: `${avgFillRate}%`, color: "text-rails-cyan" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-rails-text">Market Board</h1>
        <p className="mt-1 text-sm text-rails-text-dim">
          Deal flow, subscription pipeline, and investor demand — NIL33 Market Pillar
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {overviewStats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-rails-text-dim">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Subscription Pipeline */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Subscription Pipeline</h2>
        <SubscriptionPipeline pipeline={pipeline} />
      </div>

      {/* Active Deals Board */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">Active Deal Board</h2>
          <Link href="/nil33/instruments" className="text-xs text-rails-green hover:underline">
            All instruments →
          </Link>
        </div>
        {deals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="card py-12 text-center text-sm text-rails-text-dim">
            No open or active deals. <Link href="/nil33/instruments/new" className="text-rails-green hover:underline">Issue an instrument →</Link>
          </div>
        )}
      </div>

      {/* Two-column: Investor Demand + Recent Subscriptions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Investor demand leaderboard */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-rails-text">Investor Demand</h2>
            <Link href="/nil33/investors" className="text-xs text-rails-green hover:underline">
              All investors →
            </Link>
          </div>
          <DemandLeaderboard investors={topInvestors} />
        </div>

        {/* Recent subscription activity */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Recent Subscriptions</h2>
          <div className="space-y-0">
            {recentSubs.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between border-b border-surface-border/50 py-2 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-rails-text">{sub.investor.legalName}</p>
                  <p className="truncate text-[10px] text-rails-text-dim">{sub.instrument.name}</p>
                </div>
                <div className="flex items-center gap-3 pl-3">
                  <span className="font-mono text-xs text-rails-green">{formatCents(sub.amountCents)}</span>
                  <span className={`badge text-[10px] ${STATUS_BADGE[sub.status] ?? "badge-muted"}`}>{sub.status}</span>
                </div>
              </div>
            ))}
            {recentSubs.length === 0 && (
              <p className="py-4 text-center text-xs text-rails-text-dim">No subscriptions yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pillar Authority */}
      <div className="border-t border-surface-border pt-6 text-center">
        <p className="text-[10px] font-medium uppercase tracking-widest text-rails-text-dim">
          Pillar III — Market Board
        </p>
        <p className="mt-1 text-[10px] text-rails-muted">
          Deal flow · Subscription pipeline · Investor demand · Fill-rate analysis
        </p>
      </div>
    </div>
  );
}
