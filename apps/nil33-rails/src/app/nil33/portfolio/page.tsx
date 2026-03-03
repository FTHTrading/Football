import { prisma } from "@/lib/prisma";
import { formatCents, formatDate, parsePageParam } from "@/lib/utils";
import Link from "next/link";

const PAGE_SIZE = 20;

function gradeBadge(grade: string) {
  const g = grade.replace("+", "").replace("-", "");
  if (g === "A") return "badge-green";
  if (g === "B") return "badge-cyan";
  if (g === "C") return "badge-yellow";
  return "badge-red";
}

function riskLevel(hhi: number | null) {
  if (hhi === null) return { label: "—", cls: "text-rails-text-dim" };
  if (hhi < 1500) return { label: "Low", cls: "badge-green" };
  if (hhi < 2500) return { label: "Moderate", cls: "badge-yellow" };
  return { label: "High", cls: "badge-red" };
}

function formatPct(val: number) {
  return val.toFixed(1) + "%";
}

type StressResult = { scenarioId: string; label: string; stressedScore: number; delta: number; grade: string };
type PortfolioEntry = { athleteId: string; athleteName: string; sport: string; score: number; grade: string; weight: number; valuationMidCents: number };

async function getSpvs() {
  return prisma.spv.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, legalName: true },
    orderBy: { legalName: "asc" },
  });
}

async function getSnapshots(page: number, spvId?: string) {
  const where = spvId ? { spvId } : {};

  const [snapshots, count] = await Promise.all([
    prisma.portfolioSnapshot.findMany({
      where,
      include: { spv: { select: { legalName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.portfolioSnapshot.count({ where }),
  ]);

  return { snapshots, count, totalPages: Math.ceil(count / PAGE_SIZE) };
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePageParam(typeof params.page === "string" ? params.page : null);
  const spvId = typeof params.spvId === "string" ? params.spvId : undefined;
  const expandId = typeof params.expand === "string" ? params.expand : undefined;

  const [spvs, { snapshots, count, totalPages }] = await Promise.all([
    getSpvs(),
    getSnapshots(page, spvId),
  ]);

  // Get expanded snapshot detail
  const expanded = expandId ? snapshots.find((s) => s.id === expandId) : null;
  const expandedStress = (expanded?.stressResults as StressResult[] | null) ?? [];
  const expandedDetail = (expanded?.portfolioDetail as PortfolioEntry[] | null) ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-rails-text">Portfolio Intelligence</h1>
        <p className="mt-1 text-sm text-rails-text-dim">
          SPV-level portfolio analytics — stress testing, Monte Carlo VaR, concentration risk
        </p>
      </div>

      {/* Filter */}
      <div className="card">
        <form className="flex flex-wrap items-end gap-3" method="GET">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-rails-text-dim">SPV</label>
            <select name="spvId" defaultValue={spvId ?? ""} className="input text-xs w-56">
              <option value="">All SPVs</option>
              {spvs.map((s) => (
                <option key={s.id} value={s.id}>{s.legalName}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-outline text-xs">Apply</button>
          {spvId && (
            <Link href="/nil33/portfolio" className="text-xs text-rails-muted hover:text-rails-text">
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Snapshots table */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">
            {count} Snapshot{count !== 1 ? "s" : ""}
          </h2>
          <span className="text-xs text-rails-text-dim">Page {page} of {totalPages || 1}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border text-left text-rails-text-dim">
                <th className="pb-2 pr-4 font-medium">SPV</th>
                <th className="pb-2 pr-4 font-medium text-right">Athletes</th>
                <th className="pb-2 pr-4 font-medium text-right">NAV</th>
                <th className="pb-2 pr-4 font-medium text-right">Avg Score</th>
                <th className="pb-2 pr-4 font-medium">Avg Grade</th>
                <th className="pb-2 pr-4 font-medium text-right">HHI</th>
                <th className="pb-2 pr-4 font-medium">Concentration</th>
                <th className="pb-2 pr-4 font-medium text-right">VaR (95%)</th>
                <th className="pb-2 pr-4 font-medium text-right">CVaR</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snap) => {
                const rl = riskLevel(snap.concentrationHhi);
                const isExpanded = snap.id === expandId;
                return (
                  <tr
                    key={snap.id}
                    className={`border-b border-surface-border/50 ${isExpanded ? "bg-surface-muted" : "table-row-hover"}`}
                  >
                    <td className="py-2 pr-4">
                      <Link
                        href={`/nil33/portfolio?${spvId ? `spvId=${spvId}&` : ""}page=${page}&expand=${isExpanded ? "" : snap.id}`}
                        className="font-medium text-rails-green hover:underline"
                      >
                        {snap.spv.legalName}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-rails-text">{snap.athleteCount}</td>
                    <td className="py-2 pr-4 text-right font-mono text-rails-gold">
                      {formatCents(snap.totalNavCents)}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-rails-cyan">
                      {snap.weightedAvgScore.toFixed(1)}
                    </td>
                    <td className="py-2 pr-4">
                      <span className={gradeBadge(snap.weightedAvgGrade)}>{snap.weightedAvgGrade}</span>
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-rails-text-dim">
                      {snap.concentrationHhi?.toFixed(0) ?? "—"}
                    </td>
                    <td className="py-2 pr-4">
                      <span className={rl.cls}>{rl.label}</span>
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-rails-red">
                      {snap.monteCarloVarCents ? formatCents(snap.monteCarloVarCents) : "—"}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-rails-red">
                      {snap.monteCarloCvarCents ? formatCents(snap.monteCarloCvarCents) : "—"}
                    </td>
                    <td className="py-2 text-rails-text-dim">{formatDate(snap.createdAt)}</td>
                  </tr>
                );
              })}
              {snapshots.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-rails-text-dim">
                    No portfolio snapshots yet. Run a portfolio analysis via the API.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/nil33/portfolio?page=${page - 1}${spvId ? `&spvId=${spvId}` : ""}`}
                className="btn-outline text-xs"
              >
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/nil33/portfolio?page=${page + 1}${spvId ? `&spvId=${spvId}` : ""}`}
                className="btn-outline text-xs"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <>
          {/* Stress test results */}
          {expandedStress.length > 0 && (
            <div className="card">
              <h2 className="mb-3 text-sm font-semibold text-rails-text">
                Stress Test Scenarios — {expanded.spv.legalName}
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-left text-rails-text-dim">
                    <th className="pb-2 pr-4 font-medium">Scenario</th>
                    <th className="pb-2 pr-4 font-medium text-right">Stressed Score</th>
                    <th className="pb-2 pr-4 font-medium text-right">Delta</th>
                    <th className="pb-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {expandedStress.map((sr) => (
                    <tr key={sr.scenarioId} className="border-b border-surface-border/50">
                      <td className="py-1.5 pr-4 text-rails-text">{sr.label}</td>
                      <td className={`py-1.5 pr-4 text-right font-mono ${sr.stressedScore >= 60 ? "text-rails-cyan" : "text-rails-red"}`}>
                        {sr.stressedScore.toFixed(1)}
                      </td>
                      <td className="py-1.5 pr-4 text-right font-mono text-rails-red">
                        {sr.delta.toFixed(1)}
                      </td>
                      <td className="py-1.5">
                        <span className={gradeBadge(sr.grade)}>{sr.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Per-athlete breakdown */}
          {expandedDetail.length > 0 && (
            <div className="card">
              <h2 className="mb-3 text-sm font-semibold text-rails-text">
                Portfolio Composition — {expanded.spv.legalName}
              </h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-left text-rails-text-dim">
                    <th className="pb-2 pr-4 font-medium">Athlete</th>
                    <th className="pb-2 pr-4 font-medium">Sport</th>
                    <th className="pb-2 pr-4 font-medium text-right">Score</th>
                    <th className="pb-2 pr-4 font-medium">Grade</th>
                    <th className="pb-2 pr-4 font-medium text-right">Valuation</th>
                    <th className="pb-2 font-medium text-right">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {expandedDetail
                    .sort((a, b) => b.weight - a.weight)
                    .map((entry) => (
                      <tr key={entry.athleteId} className="border-b border-surface-border/50">
                        <td className="py-1.5 pr-4 text-rails-text">{entry.athleteName}</td>
                        <td className="py-1.5 pr-4 text-rails-text-dim">{entry.sport}</td>
                        <td className="py-1.5 pr-4 text-right font-mono text-rails-cyan">
                          {entry.score.toFixed(1)}
                        </td>
                        <td className="py-1.5 pr-4">
                          <span className={gradeBadge(entry.grade)}>{entry.grade}</span>
                        </td>
                        <td className="py-1.5 pr-4 text-right font-mono text-rails-gold">
                          {formatCents(entry.valuationMidCents)}
                        </td>
                        <td className="py-1.5 text-right font-mono text-rails-text">
                          {formatPct(entry.weight * 100)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Monte Carlo metadata */}
          {expanded.monteCarloSeed && (
            <div className="card">
              <h2 className="mb-3 text-sm font-semibold text-rails-text">Monte Carlo Configuration</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-rails-text-dim">Seed</span>
                  <p className="font-mono text-rails-text">{expanded.monteCarloSeed}</p>
                </div>
                <div>
                  <span className="text-rails-text-dim">Genome ID</span>
                  <p className="font-mono text-rails-text truncate" title={expanded.genomeId}>
                    {expanded.genomeId.slice(0, 16)}…
                  </p>
                </div>
                <div>
                  <span className="text-rails-text-dim">VaR (95%)</span>
                  <p className="font-mono text-rails-red">{formatCents(expanded.monteCarloVarCents ?? 0)}</p>
                </div>
                <div>
                  <span className="text-rails-text-dim">CVaR (Expected Shortfall)</span>
                  <p className="font-mono text-rails-red">{formatCents(expanded.monteCarloCvarCents ?? 0)}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
