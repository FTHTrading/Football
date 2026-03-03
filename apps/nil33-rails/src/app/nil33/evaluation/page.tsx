import { prisma } from "@/lib/prisma";
import { formatCents, formatDate } from "@/lib/utils";
import Link from "next/link";
import { EvalFunnel } from "@/components/EvalFunnel";
import { EvalStageCard } from "@/components/EvalStageCard";

// ─── Data Fetchers ──────────────────────────────────────────────────────────

async function getPipelineMetrics() {
  const [
    totalAthletes,
    activeAthletes,
    totalMemos,
    draftMemos,
    submittedMemos,
    approvedMemos,
    rejectedMemos,
    totalInstruments,
    draftInstruments,
    openInstruments,
    activeInstruments,
    totalSubscriptions,
    fundedSubscriptions,
    totalDistributions,
    completedDistributions,
    totalRuns,
  ] = await Promise.all([
    prisma.athlete.count(),
    prisma.athlete.count({ where: { status: "ACTIVE" } }),
    prisma.underwritingMemo.count(),
    prisma.underwritingMemo.count({ where: { status: "DRAFT" } }),
    prisma.underwritingMemo.count({ where: { status: "SUBMITTED" } }),
    prisma.underwritingMemo.count({ where: { status: "APPROVED" } }),
    prisma.underwritingMemo.count({ where: { status: "REJECTED" } }),
    prisma.instrument.count(),
    prisma.instrument.count({ where: { status: "DRAFT" } }),
    prisma.instrument.count({ where: { status: "OPEN" } }),
    prisma.instrument.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: "FUNDED" } }),
    prisma.distribution.count(),
    prisma.distribution.count({ where: { status: "COMPLETE" } }),
    prisma.underwritingRun.count(),
  ]);

  const fundedSubs = await prisma.subscription.findMany({
    where: { status: "FUNDED" },
    select: { amountCents: true },
  });
  const totalFundedCents = fundedSubs.reduce((s, sub) => s + sub.amountCents, 0);

  const completedDists = await prisma.distribution.findMany({
    where: { status: "COMPLETE" },
    select: { netDistributableCents: true },
  });
  const totalDistributedCents = completedDists.reduce((s, d) => s + d.netDistributableCents, 0);

  const avgScore = await prisma.underwritingMemo.aggregate({ _avg: { compositeScore: true } });

  return {
    athletes: { total: totalAthletes, active: activeAthletes },
    memos: { total: totalMemos, draft: draftMemos, submitted: submittedMemos, approved: approvedMemos, rejected: rejectedMemos, avgScore: avgScore._avg.compositeScore ?? 0 },
    instruments: { total: totalInstruments, draft: draftInstruments, open: openInstruments, active: activeInstruments },
    subscriptions: { total: totalSubscriptions, funded: fundedSubscriptions, totalFundedCents },
    distributions: { total: totalDistributions, completed: completedDistributions, totalDistributedCents },
    runs: totalRuns,
  };
}

async function getRecentMemos() {
  return prisma.underwritingMemo.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      athlete: { select: { displayName: true, sport: true } },
    },
  });
}

async function getRecentDistributions() {
  return prisma.distribution.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      instrument: { select: { name: true } },
    },
  });
}

function gradeBadge(grade: string) {
  const g = grade.replace("+", "").replace("-", "");
  if (g === "A") return "badge-green";
  if (g === "B") return "badge-cyan";
  if (g === "C") return "badge-yellow";
  return "badge-red";
}

function statusBadge(status: string) {
  switch (status) {
    case "APPROVED": case "COMPLETE": case "FUNDED": case "ACTIVE":
      return "badge-green";
    case "SUBMITTED": case "OPEN": case "PENDING":
      return "badge-cyan";
    case "DRAFT":
      return "badge-muted";
    case "REJECTED": case "FAILED": case "CANCELLED":
      return "badge-red";
    default:
      return "badge-muted";
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function EvaluationPage() {
  const [metrics, recentMemos, recentDists] = await Promise.all([
    getPipelineMetrics(),
    getRecentMemos(),
    getRecentDistributions(),
  ]);

  // Funnel stages
  const funnelStages = [
    { label: "Athletes", count: metrics.athletes.active, color: "bg-rails-cyan" },
    { label: "Underwriting Runs", count: metrics.runs, color: "bg-rails-green" },
    { label: "Memos Approved", count: metrics.memos.approved, color: "bg-rails-gold" },
    { label: "Instruments Active", count: metrics.instruments.active, color: "bg-emerald-500" },
    { label: "Subscriptions Funded", count: metrics.subscriptions.funded, color: "bg-rails-cyan" },
    { label: "Distributions Complete", count: metrics.distributions.completed, color: "bg-rails-green" },
  ];

  const conversionRates = [
    { from: "Athletes", to: "Runs", rate: metrics.athletes.active > 0 ? metrics.runs / metrics.athletes.active : 0 },
    { from: "Runs", to: "Approved", rate: metrics.runs > 0 ? metrics.memos.approved / metrics.runs : 0 },
    { from: "Approved", to: "Issued", rate: metrics.memos.approved > 0 ? metrics.instruments.active / metrics.memos.approved : 0 },
    { from: "Issued", to: "Funded", rate: metrics.instruments.active > 0 ? metrics.subscriptions.funded / metrics.instruments.active : 0 },
    { from: "Funded", to: "Distributed", rate: metrics.subscriptions.funded > 0 ? metrics.distributions.completed / metrics.subscriptions.funded : 0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl text-rails-green">◈</span>
          <div>
            <h1 className="text-2xl font-bold text-rails-text">Evaluation Pipeline Console</h1>
            <p className="mt-0.5 text-sm text-rails-text-dim">
              Capital lifecycle — from athlete intake through distribution execution
            </p>
          </div>
        </div>
      </div>

      {/* ── Pipeline Funnel ─────────────────────────────────────────────── */}
      <EvalFunnel stages={funnelStages} />

      {/* ── Stage Cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Genome / Underwriting */}
        <EvalStageCard
          icon="⧬"
          title="Genome → Underwriting"
          description="Signal intake, 33-signal scoring, covenant generation"
          stats={[
            { label: "Active Athletes", value: String(metrics.athletes.active) },
            { label: "Total Runs", value: String(metrics.runs) },
            { label: "Total Memos", value: String(metrics.memos.total) },
            { label: "Avg Score", value: metrics.memos.avgScore > 0 ? metrics.memos.avgScore.toFixed(1) : "—" },
          ]}
          href="/nil33/underwriting"
          linkLabel="View Underwriting →"
        />

        {/* Evaluation / Approval */}
        <EvalStageCard
          icon="◆"
          title="Evaluation → Approval"
          description="Memo review, compliance gate, risk committee sign-off"
          stats={[
            { label: "Draft", value: String(metrics.memos.draft) },
            { label: "Submitted", value: String(metrics.memos.submitted) },
            { label: "Approved", value: String(metrics.memos.approved) },
            { label: "Rejected", value: String(metrics.memos.rejected) },
          ]}
          statusBreakdown={[
            { label: "Approval Rate", value: metrics.memos.total > 0 ? `${((metrics.memos.approved / metrics.memos.total) * 100).toFixed(0)}%` : "—", color: "text-rails-green" },
            { label: "Rejection Rate", value: metrics.memos.total > 0 ? `${((metrics.memos.rejected / metrics.memos.total) * 100).toFixed(0)}%` : "—", color: "text-rails-red" },
          ]}
          href="/nil33/underwriting"
          linkLabel="Review Queue →"
        />

        {/* Market / Issuance */}
        <EvalStageCard
          icon="⬢"
          title="Market → Issuance"
          description="Instrument structuring, subscription management, funding"
          stats={[
            { label: "Instruments", value: String(metrics.instruments.total) },
            { label: "Open", value: String(metrics.instruments.open) },
            { label: "Active", value: String(metrics.instruments.active) },
            { label: "Total Funded", value: formatCents(metrics.subscriptions.totalFundedCents) },
          ]}
          href="/nil33/instruments"
          linkLabel="View Instruments →"
        />
      </div>

      {/* ── Capital Flow ────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Conversion rates */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Pipeline Conversion</h2>
          <div className="space-y-3">
            {conversionRates.map((cr) => (
              <div key={`${cr.from}-${cr.to}`}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-rails-text-dim">
                    {cr.from} → {cr.to}
                  </span>
                  <span className={`font-mono font-bold ${cr.rate >= 0.5 ? "text-rails-green" : cr.rate >= 0.2 ? "text-rails-gold" : "text-rails-red"}`}>
                    {(cr.rate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full transition-all ${cr.rate >= 0.5 ? "bg-rails-green" : cr.rate >= 0.2 ? "bg-rails-gold" : "bg-rails-red"}`}
                    style={{ width: `${Math.max(cr.rate * 100, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capital summary */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Capital Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-rails-text-dim">Total Subscriptions Funded</span>
              <span className="font-mono text-lg font-bold text-rails-green">
                {formatCents(metrics.subscriptions.totalFundedCents)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-rails-text-dim">Total Distributions Completed</span>
              <span className="font-mono text-lg font-bold text-rails-cyan">
                {formatCents(metrics.distributions.totalDistributedCents)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-rails-text-dim">Distribution Completion Rate</span>
              <span className="font-mono text-lg font-bold text-rails-gold">
                {metrics.distributions.total > 0
                  ? `${((metrics.distributions.completed / metrics.distributions.total) * 100).toFixed(0)}%`
                  : "—"}
              </span>
            </div>
            <div className="mt-3 border-t border-surface-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-rails-text">Net Capital Velocity</span>
                <span className="font-mono text-lg font-bold text-rails-green">
                  {metrics.subscriptions.totalFundedCents > 0
                    ? `${((metrics.distributions.totalDistributedCents / metrics.subscriptions.totalFundedCents) * 100).toFixed(1)}%`
                    : "—"}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-rails-text-dim">
                Ratio of capital distributed to capital raised
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Underwriting Memos ───────────────────────────────────── */}
      {recentMemos.length > 0 && (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-rails-text">Recent Underwriting Memos</h2>
            <Link href="/nil33/underwriting" className="text-xs text-rails-green hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border text-left text-rails-text-dim">
                  <th className="pb-2 pr-4 font-medium">Athlete</th>
                  <th className="pb-2 pr-4 font-medium">Score</th>
                  <th className="pb-2 pr-4 font-medium">Grade</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 pr-4 font-medium">Genome</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMemos.map((memo) => (
                  <tr key={memo.id} className="border-b border-surface-border/50 table-row-hover">
                    <td className="py-2 pr-4">
                      <Link href={`/nil33/underwriting/${memo.id}`} className="text-rails-text hover:text-rails-green">
                        {memo.athlete.displayName}
                      </Link>
                      <span className="ml-2 text-rails-text-dim">{memo.athlete.sport}</span>
                    </td>
                    <td className="py-2 pr-4 font-mono text-rails-cyan">{memo.compositeScore.toFixed(1)}</td>
                    <td className="py-2 pr-4">
                      <span className={`badge ${gradeBadge(memo.grade)} text-[10px]`}>{memo.grade}</span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`badge ${statusBadge(memo.status)} text-[10px]`}>{memo.status}</span>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-rails-text-dim" title={memo.genomeId}>
                      {memo.genomeId.slice(0, 8)}…
                    </td>
                    <td className="py-2 text-rails-text-dim">{formatDate(memo.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Recent Distributions ────────────────────────────────────────── */}
      {recentDists.length > 0 && (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-rails-text">Recent Distributions</h2>
            <Link href="/nil33/distributions" className="text-xs text-rails-green hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border text-left text-rails-text-dim">
                  <th className="pb-2 pr-4 font-medium">Instrument</th>
                  <th className="pb-2 pr-4 font-medium">Period</th>
                  <th className="pb-2 pr-4 font-medium">Net Distributable</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDists.map((dist) => (
                  <tr key={dist.id} className="border-b border-surface-border/50 table-row-hover">
                    <td className="py-2 pr-4 text-rails-text">{dist.instrument.name}</td>
                    <td className="py-2 pr-4 text-rails-text-dim">
                      {formatDate(dist.periodStart)} – {formatDate(dist.periodEnd)}
                    </td>
                    <td className="py-2 pr-4 font-mono text-rails-green">
                      {formatCents(dist.netDistributableCents)}
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`badge ${statusBadge(dist.status)} text-[10px]`}>{dist.status}</span>
                    </td>
                    <td className="py-2 text-rails-text-dim">{formatDate(dist.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pipeline Authority Footer ──────────────────────────────────── */}
      <div className="rounded-xl border border-surface-border bg-surface-muted/50 p-5">
        <div className="flex items-start gap-3">
          <span className="font-mono text-lg text-rails-green">◈</span>
          <div>
            <p className="text-xs font-semibold text-rails-text">Four Pillars. One Capital Engine.</p>
            <p className="mt-1 text-xs text-rails-text-dim">
              Genome → Evaluation → Market → Capital.
              Every dollar flows through a deterministic pipeline: signal intake, 33-dimensional scoring,
              covenant generation, instrument structuring, subscription management, and distribution execution.
              Nothing exits the system without a genome stamp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
