import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import Link from "next/link";

async function getDashboardStats() {
  const [
    spvCount, instrumentCount, investorCount, distributionCount, auditCount,
    subscriptions, memoCount, memoAvg, portfolioCount,
  ] = await Promise.all([
    prisma.spv.count(),
    prisma.instrument.count(),
    prisma.investor.count(),
    prisma.distribution.count(),
    prisma.ledgerEvent.count(),
    prisma.subscription.findMany({
      where: { status: "FUNDED" },
      select: { amountCents: true },
    }),
    prisma.underwritingMemo.count(),
    prisma.underwritingMemo.aggregate({ _avg: { compositeScore: true } }),
    prisma.portfolioSnapshot.count(),
  ]);

  const totalFundedCents = subscriptions.reduce((s, sub) => s + sub.amountCents, 0);
  const avgScore = memoAvg._avg.compositeScore ?? 0;

  return {
    spvCount, instrumentCount, investorCount, distributionCount, auditCount,
    totalFundedCents, memoCount, avgScore, portfolioCount,
  };
}

async function getRecentAudit() {
  return prisma.ledgerEvent.findMany({
    take: 8,
    orderBy: { occurredAt: "desc" },
    include: { actor: { select: { email: true } } },
  });
}

export default async function DashboardPage() {
  const [stats, recentAudit] = await Promise.all([getDashboardStats(), getRecentAudit()]);

  const statCards = [
    { label: "Underwriting Memos", value: stats.memoCount, href: "/nil33/underwriting", color: "text-rails-green" },
    { label: "Avg Engine Score", value: stats.avgScore > 0 ? stats.avgScore.toFixed(1) : "—", href: "/nil33/underwriting", color: "text-rails-cyan" },
    { label: "Portfolio Snapshots", value: stats.portfolioCount, href: "/nil33/portfolio", color: "text-rails-gold" },
    { label: "Issuers / SPVs", value: stats.spvCount, href: "/nil33/issuers", color: "text-rails-cyan" },
    { label: "Total Funded", value: formatCents(stats.totalFundedCents), href: "/nil33/investors", color: "text-rails-green" },
    { label: "Instruments", value: stats.instrumentCount, href: "/nil33/instruments", color: "text-rails-text" },
    { label: "Investors", value: stats.investorCount, href: "/nil33/investors", color: "text-rails-gold" },
    { label: "Audit Events", value: stats.auditCount, href: "/nil33/audit", color: "text-rails-text-dim" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-rails-text">Dashboard</h1>
        <p className="mt-1 text-sm text-rails-text-dim">
          NIL33 Institutional Rails — SPV revenue participation platform
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} className="stat-card hover:border-rails-muted transition-colors">
            <span className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-rails-text-dim">{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent audit events */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">Recent Audit Events</h2>
          <Link href="/nil33/audit" className="text-xs text-rails-green hover:underline">
            View all →
          </Link>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border text-left text-rails-text-dim">
              <th className="pb-2 pr-4 font-medium">Action</th>
              <th className="pb-2 pr-4 font-medium">Entity</th>
              <th className="pb-2 pr-4 font-medium">Actor</th>
              <th className="pb-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentAudit.map((evt) => (
              <tr key={evt.id} className="border-b border-surface-border/50 table-row-hover">
                <td className="py-2 pr-4 font-mono text-rails-cyan">{evt.action}</td>
                <td className="py-2 pr-4 text-rails-text-dim">
                  {evt.entityType}/{evt.entityId.slice(0, 8)}…
                </td>
                <td className="py-2 pr-4 text-rails-text-dim">{evt.actor?.email ?? "system"}</td>
                <td className="py-2 text-rails-text-dim">
                  {new Date(evt.occurredAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {recentAudit.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-rails-text-dim">
                  No audit events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
