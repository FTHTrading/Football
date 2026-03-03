import { prisma } from "@/lib/prisma";
import { formatCents, formatDate } from "@/lib/utils";
import Link from "next/link";
import { WaterfallChart } from "@/components/WaterfallChart";
import { CapitalFlowBar } from "@/components/CapitalFlowBar";
import { MaturityTimeline } from "@/components/MaturityTimeline";

/* ── Data fetchers ──────────────────────────────────────────────────────────── */

async function getCapitalOverview() {
  const [fundedSubs, distributions] = await Promise.all([
    prisma.subscription.findMany({
      where: { status: "FUNDED" },
      select: { amountCents: true },
    }),
    prisma.distribution.findMany({
      select: {
        grossRevenueCents: true,
        participationCents: true,
        managementFeeCents: true,
        netDistributableCents: true,
        status: true,
        genomeId: true,
      },
    }),
  ]);

  const totalDeployed = fundedSubs.reduce((s, sub) => s + sub.amountCents, 0);
  const totalGross = distributions.reduce((s, d) => s + d.grossRevenueCents, 0);
  const totalParticipation = distributions.reduce((s, d) => s + d.participationCents, 0);
  const totalFees = distributions.reduce((s, d) => s + d.managementFeeCents, 0);
  const totalNet = distributions.reduce((s, d) => s + d.netDistributableCents, 0);
  const completed = distributions.filter((d) => d.status === "COMPLETE").length;
  const returnRate = totalDeployed > 0 ? Math.round((totalNet / totalDeployed) * 10000) / 100 : 0;

  return {
    totalDeployed,
    totalGross,
    totalParticipation,
    totalFees,
    totalNet,
    returnRate,
    distributionCount: distributions.length,
    completedCount: completed,
    genomeCoverage: distributions.length > 0
      ? Math.round((distributions.filter((d) => d.genomeId).length / distributions.length) * 10000) / 100
      : 0,
  };
}

async function getDistributionPipeline() {
  const counts = await Promise.all([
    prisma.distribution.count({ where: { status: "DRAFT" } }),
    prisma.distribution.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.distribution.count({ where: { status: "APPROVED" } }),
    prisma.distribution.count({ where: { status: "EXECUTING" } }),
    prisma.distribution.count({ where: { status: "COMPLETE" } }),
    prisma.distribution.count({ where: { status: "FAILED" } }),
  ]);
  return [
    { stage: "Draft", count: counts[0], color: "bg-rails-muted" },
    { stage: "Pending Approval", count: counts[1], color: "bg-rails-gold" },
    { stage: "Approved", count: counts[2], color: "bg-rails-cyan" },
    { stage: "Executing", count: counts[3], color: "bg-rails-green" },
    { stage: "Complete", count: counts[4], color: "bg-rails-green" },
    { stage: "Failed", count: counts[5], color: "bg-rails-red" },
  ];
}

async function getWaterfallByInstrument() {
  const distributions = await prisma.distribution.findMany({
    select: {
      grossRevenueCents: true,
      participationCents: true,
      managementFeeCents: true,
      netDistributableCents: true,
      instrument: { select: { id: true, name: true } },
    },
  });

  const byInstrument = new Map<string, {
    name: string;
    gross: number;
    participation: number;
    fees: number;
    net: number;
    count: number;
  }>();

  for (const d of distributions) {
    const existing = byInstrument.get(d.instrument.id);
    if (existing) {
      existing.gross += d.grossRevenueCents;
      existing.participation += d.participationCents;
      existing.fees += d.managementFeeCents;
      existing.net += d.netDistributableCents;
      existing.count++;
    } else {
      byInstrument.set(d.instrument.id, {
        name: d.instrument.name,
        gross: d.grossRevenueCents,
        participation: d.participationCents,
        fees: d.managementFeeCents,
        net: d.netDistributableCents,
        count: 1,
      });
    }
  }

  return Array.from(byInstrument.entries()).map(([id, data]) => ({
    instrumentId: id,
    ...data,
  }));
}

async function getWireExecution() {
  const [total, wired, failed] = await Promise.all([
    prisma.distributionLine.count(),
    prisma.distributionLine.count({ where: { status: "WIRED" } }),
    prisma.distributionLine.count({ where: { status: "FAILED" } }),
  ]);
  return {
    total,
    wired,
    failed,
    pending: total - wired - failed,
    successRate: total > 0 ? Math.round((wired / total) * 10000) / 100 : 0,
  };
}

async function getMaturitySchedule() {
  const instruments = await prisma.instrument.findMany({
    where: { status: { in: ["ACTIVE", "OPEN"] }, maturityDate: { not: null } },
    select: {
      id: true,
      name: true,
      maturityDate: true,
      holdingPeriodDays: true,
      totalIssuanceAmtCents: true,
    },
    orderBy: { maturityDate: "asc" },
  });

  return instruments.map((i) => {
    const daysToMaturity = Math.max(
      0,
      Math.floor((new Date(i.maturityDate!).getTime() - Date.now()) / 86400000)
    );
    return {
      id: i.id,
      name: i.name,
      maturityDate: i.maturityDate!,
      holdingPeriodDays: i.holdingPeriodDays,
      totalIssuanceCents: i.totalIssuanceAmtCents,
      daysToMaturity,
      urgency: daysToMaturity === 0 ? "MATURING" as const : daysToMaturity < 30 ? "APPROACHING" as const : "ON_TRACK" as const,
    };
  });
}

async function getRecentDistributions() {
  return prisma.distribution.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      grossRevenueCents: true,
      netDistributableCents: true,
      status: true,
      periodStart: true,
      periodEnd: true,
      genomeId: true,
      createdAt: true,
      instrument: { select: { name: true } },
      _count: { select: { lines: true } },
    },
  });
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

const DIST_STATUS_BADGE: Record<string, string> = {
  COMPLETE: "badge-green",
  EXECUTING: "badge-cyan",
  APPROVED: "badge-yellow",
  PENDING_APPROVAL: "badge-yellow",
  DRAFT: "badge-muted",
  FAILED: "badge-red",
};

export default async function CapitalLifecyclePage() {
  const [overview, pipeline, waterfall, wires, maturity, recentDists] = await Promise.all([
    getCapitalOverview(),
    getDistributionPipeline(),
    getWaterfallByInstrument(),
    getWireExecution(),
    getMaturitySchedule(),
    getRecentDistributions(),
  ]);

  const overviewStats = [
    { label: "Capital Deployed", value: formatCents(overview.totalDeployed), color: "text-rails-green" },
    { label: "Gross Revenue", value: formatCents(overview.totalGross), color: "text-rails-text" },
    { label: "Net Distributed", value: formatCents(overview.totalNet), color: "text-rails-cyan" },
    { label: "Return on Deployed", value: `${overview.returnRate}%`, color: "text-rails-gold" },
    { label: "Distributions", value: `${overview.completedCount}/${overview.distributionCount}`, color: "text-rails-text" },
    { label: "Genome Coverage", value: `${overview.genomeCoverage}%`, color: "text-rails-green" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-rails-text">Capital Lifecycle</h1>
        <p className="mt-1 text-sm text-rails-text-dim">
          Revenue waterfall, distribution pipeline, wire execution, and maturity schedule — NIL33 Capital Pillar
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

      {/* Capital Flow */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Capital Flow</h2>
        <CapitalFlowBar
          deployed={overview.totalDeployed}
          gross={overview.totalGross}
          participation={overview.totalParticipation}
          fees={overview.totalFees}
          net={overview.totalNet}
        />
      </div>

      {/* Two-column: Distribution Pipeline + Wire Execution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribution pipeline */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Distribution Pipeline</h2>
          <div className="space-y-2">
            {pipeline.map((stage) => {
              const max = Math.max(...pipeline.map((p) => p.count), 1);
              return (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="w-28 text-right text-xs text-rails-text-dim">{stage.stage}</span>
                  <div className="flex-1">
                    <div className="h-5 w-full overflow-hidden rounded bg-surface-muted">
                      <div
                        className={`flex h-full items-center rounded ${stage.color} transition-all`}
                        style={{ width: `${(stage.count / max) * 100}%` }}
                      >
                        {stage.count > 0 && (
                          <span className="px-2 text-[10px] font-bold text-surface">{stage.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wire execution */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Wire Execution</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <span className="font-mono text-2xl font-bold text-rails-text">{wires.total}</span>
              <span className="text-xs text-rails-text-dim">Total Lines</span>
            </div>
            <div className="stat-card">
              <span className="font-mono text-2xl font-bold text-rails-green">{wires.wired}</span>
              <span className="text-xs text-rails-text-dim">Wired</span>
            </div>
            <div className="stat-card">
              <span className="font-mono text-2xl font-bold text-rails-gold">{wires.pending}</span>
              <span className="text-xs text-rails-text-dim">Pending</span>
            </div>
            <div className="stat-card">
              <span className="font-mono text-2xl font-bold text-rails-red">{wires.failed}</span>
              <span className="text-xs text-rails-text-dim">Failed</span>
            </div>
          </div>
          {wires.total > 0 && (
            <div className="mt-4 border-t border-surface-border/50 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rails-text-dim">Success rate</span>
                <span className="font-mono font-medium text-rails-green">{wires.successRate}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-rails-green"
                  style={{ width: `${wires.successRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Waterfall by instrument */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">Revenue Waterfall by Instrument</h2>
          <Link href="/nil33/distributions" className="text-xs text-rails-green hover:underline">
            All distributions →
          </Link>
        </div>
        {waterfall.length > 0 ? (
          <WaterfallChart waterfall={waterfall} />
        ) : (
          <p className="py-6 text-center text-xs text-rails-text-dim">No distribution data yet.</p>
        )}
      </div>

      {/* Maturity schedule */}
      {maturity.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Maturity Schedule</h2>
          <MaturityTimeline schedule={maturity} />
        </div>
      )}

      {/* Recent distributions */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">Recent Distributions</h2>
          <Link href="/nil33/distributions" className="text-xs text-rails-green hover:underline">
            View all →
          </Link>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border text-left text-rails-text-dim">
              <th className="pb-2 pr-4 font-medium">Instrument</th>
              <th className="pb-2 pr-4 font-medium">Period</th>
              <th className="pb-2 pr-4 font-medium">Gross</th>
              <th className="pb-2 pr-4 font-medium">Net</th>
              <th className="pb-2 pr-4 font-medium">Lines</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 font-medium">Genome</th>
            </tr>
          </thead>
          <tbody>
            {recentDists.map((d) => (
              <tr key={d.id} className="border-b border-surface-border/50 table-row-hover">
                <td className="py-2 pr-4 text-rails-text max-w-[160px] truncate">
                  <Link href={`/nil33/distributions/${d.id}`} className="hover:text-rails-green">
                    {d.instrument.name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-rails-text-dim">
                  {formatDate(d.periodStart)} – {formatDate(d.periodEnd)}
                </td>
                <td className="py-2 pr-4 font-mono text-rails-text-dim">{formatCents(d.grossRevenueCents)}</td>
                <td className="py-2 pr-4 font-mono text-rails-green">{formatCents(d.netDistributableCents)}</td>
                <td className="py-2 pr-4 font-mono text-rails-text-dim">{d._count.lines}</td>
                <td className="py-2 pr-4">
                  <span className={`badge ${DIST_STATUS_BADGE[d.status] ?? "badge-muted"}`}>{d.status}</span>
                </td>
                <td className="py-2 text-rails-text-dim">
                  {d.genomeId ? (
                    <span className="font-mono text-rails-green" title={d.genomeId}>⧬ {d.genomeId.slice(0, 8)}</span>
                  ) : "—"}
                </td>
              </tr>
            ))}
            {recentDists.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-rails-text-dim">No distributions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pillar Authority */}
      <div className="border-t border-surface-border pt-6 text-center">
        <p className="text-[10px] font-medium uppercase tracking-widest text-rails-text-dim">
          Pillar IV — Capital Lifecycle
        </p>
        <p className="mt-1 text-[10px] text-rails-muted">
          Revenue waterfall · Distribution pipeline · Wire execution · Maturity schedule · Genome provenance
        </p>
      </div>
    </div>
  );
}
