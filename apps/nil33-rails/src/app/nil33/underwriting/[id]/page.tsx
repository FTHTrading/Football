import { prisma } from "@/lib/prisma";
import { formatCents, formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModelIdentityBadge } from "@/components/ModelIdentityBadge";

function gradeBadge(grade: string) {
  const g = grade.replace("+", "").replace("-", "");
  if (g === "A") return "badge-green";
  if (g === "B") return "badge-cyan";
  if (g === "C") return "badge-yellow";
  return "badge-red";
}

function statusBadge(status: string) {
  switch (status) {
    case "APPROVED": return "badge-green";
    case "SUBMITTED": return "badge-cyan";
    case "DRAFT": return "badge-muted";
    case "REJECTED": return "badge-red";
    default: return "badge-muted";
  }
}

function scoreColor(score: number) {
  if (score >= 80) return "text-rails-green";
  if (score >= 60) return "text-rails-cyan";
  if (score >= 40) return "text-rails-gold";
  return "text-rails-red";
}

type DimensionScore = { dimension: string; score: number; weight: number; weighted: number };
type Flag = { signal: string; label: string; severity: string; message: string };
type Covenant = { id: string; label: string; clause: string; triggered: boolean; severity: string };
type StressResult = { scenarioId: string; label: string; stressedScore: number; delta: number; grade: string };
type DimContribution = { dimension: string; rawScore: number; weight: number; contribution: number; pctOfTotal: number };
type Explainability = { dimensionContributions: DimContribution[] };

export default async function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const memo = await prisma.underwritingMemo.findUnique({
    where: { id },
    include: {
      athlete: { select: { displayName: true, sport: true, school: true, position: true, classYear: true } },
      spv: { select: { legalName: true } },
      createdBy: { select: { email: true } },
    },
  });

  if (!memo) notFound();

  const dimensionScores = (memo.dimensionScores as DimensionScore[] | null) ?? [];
  const flags = (memo.flags as Flag[] | null) ?? [];
  const covenants = (memo.covenants as Covenant[] | null) ?? [];
  const stressResults = (memo.stressResults as StressResult[] | null) ?? [];
  const explainability = memo.explainability as Explainability | null;
  const dimContributions = explainability?.dimensionContributions ?? [];

  return (
    <div className="max-w-5xl space-y-8 animate-fade-in">
      {/* Breadcrumb + header */}
      <div>
        <Link href="/nil33/underwriting" className="text-xs text-rails-muted hover:text-rails-text">
          ← Underwriting
        </Link>
        <div className="mt-2 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-rails-text">{memo.athlete.displayName}</h1>
          <span className={`text-lg ${gradeBadge(memo.grade)}`}>{memo.grade}</span>
          <span className={statusBadge(memo.status)}>{memo.status}</span>
          <ModelIdentityBadge
            genomeId={memo.genomeId}
            genomeVersion={memo.genomeVersion}
          />
        </div>
        <p className="mt-1 text-sm text-rails-text-dim">
          {memo.athlete.sport} · {memo.athlete.school}
          {memo.athlete.position && ` · ${memo.athlete.position}`}
          {memo.athlete.classYear && ` · ${memo.athlete.classYear}`}
        </p>
      </div>

      {/* Top-line stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="stat-card">
          <span className={`font-mono text-2xl font-bold ${scoreColor(memo.compositeScore)}`}>
            {memo.compositeScore.toFixed(1)}
          </span>
          <span className="text-xs text-rails-text-dim">Composite Score</span>
        </div>
        <div className="stat-card">
          <span className="font-mono text-2xl font-bold text-rails-gold">
            {formatCents(memo.valuationMidCents)}
          </span>
          <span className="text-xs text-rails-text-dim">Valuation (Mid)</span>
        </div>
        <div className="stat-card">
          <span className="font-mono text-lg font-bold text-rails-text-dim">
            {formatCents(memo.valuationLowCents)} – {formatCents(memo.valuationHighCents)}
          </span>
          <span className="text-xs text-rails-text-dim">Range (Low – High)</span>
        </div>
        <div className="stat-card">
          <span className={`font-mono text-2xl font-bold ${memo.criticalFlagCount > 0 ? "text-rails-red" : "text-rails-text-dim"}`}>
            {memo.flagCount}
          </span>
          <span className="text-xs text-rails-text-dim">
            Flags ({memo.criticalFlagCount} critical)
          </span>
        </div>
        <div className="stat-card">
          <span className="font-mono text-2xl font-bold text-rails-cyan">{memo.covenantCount}</span>
          <span className="text-xs text-rails-text-dim">Covenants</span>
        </div>
      </div>

      {/* Risk Narrative */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-rails-text">Risk Narrative</h2>
        <p className="text-sm leading-relaxed text-rails-text-dim whitespace-pre-wrap">
          {memo.riskNarrative}
        </p>
      </div>

      {/* Two-column: Dimension Contributions + Dimension Scores */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dimension Contribution (Explainability) */}
        {dimContributions.length > 0 && (
          <div className="card">
            <h2 className="mb-3 text-sm font-semibold text-rails-text">Dimension Contributions</h2>
            <div className="space-y-2">
              {dimContributions
                .sort((a, b) => b.pctOfTotal - a.pctOfTotal)
                .map((dc) => (
                  <div key={dc.dimension}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-rails-text-dim capitalize">
                        {dc.dimension.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-rails-text">
                        {dc.contribution.toFixed(1)} ({dc.pctOfTotal.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="mt-0.5 h-1.5 w-full rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-rails-green"
                        style={{ width: `${Math.min(dc.pctOfTotal, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Dimension Scores */}
        {dimensionScores.length > 0 && (
          <div className="card">
            <h2 className="mb-3 text-sm font-semibold text-rails-text">Dimension Scores</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border text-left text-rails-text-dim">
                  <th className="pb-2 pr-4 font-medium">Dimension</th>
                  <th className="pb-2 pr-4 font-medium text-right">Score</th>
                  <th className="pb-2 pr-4 font-medium text-right">Weight</th>
                  <th className="pb-2 font-medium text-right">Weighted</th>
                </tr>
              </thead>
              <tbody>
                {dimensionScores.map((ds) => (
                  <tr key={ds.dimension} className="border-b border-surface-border/50">
                    <td className="py-1.5 pr-4 capitalize text-rails-text-dim">
                      {ds.dimension.replace(/_/g, " ")}
                    </td>
                    <td className={`py-1.5 pr-4 text-right font-mono ${scoreColor(ds.score)}`}>
                      {ds.score.toFixed(1)}
                    </td>
                    <td className="py-1.5 pr-4 text-right font-mono text-rails-text-dim">
                      {(ds.weight * 100).toFixed(0)}%
                    </td>
                    <td className="py-1.5 text-right font-mono text-rails-text">
                      {ds.weighted.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-rails-text">Risk Flags</h2>
          <div className="space-y-2">
            {flags.map((flag, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-surface-border/50 bg-surface-bg px-4 py-3"
              >
                <span className={flag.severity === "critical" ? "badge-red" : "badge-yellow"}>
                  {flag.severity}
                </span>
                <div>
                  <p className="text-xs font-medium text-rails-text">{flag.label}</p>
                  <p className="text-xs text-rails-text-dim">{flag.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Covenants */}
      {covenants.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-rails-text">Covenant Recommendations</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border text-left text-rails-text-dim">
                <th className="pb-2 pr-4 font-medium">Rule</th>
                <th className="pb-2 pr-4 font-medium">Clause</th>
                <th className="pb-2 pr-4 font-medium">Severity</th>
                <th className="pb-2 font-medium">Triggered</th>
              </tr>
            </thead>
            <tbody>
              {covenants.map((c) => (
                <tr key={c.id} className="border-b border-surface-border/50">
                  <td className="py-1.5 pr-4 font-medium text-rails-text">{c.label}</td>
                  <td className="py-1.5 pr-4 text-rails-text-dim max-w-xs truncate">{c.clause}</td>
                  <td className="py-1.5 pr-4">
                    <span className={c.severity === "critical" ? "badge-red" : c.severity === "major" ? "badge-yellow" : "badge-muted"}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-1.5">
                    {c.triggered ? (
                      <span className="badge-red">Yes</span>
                    ) : (
                      <span className="text-rails-text-dim">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stress Test Results */}
      {stressResults.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-rails-text">Stress Test Scenarios</h2>
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
              {stressResults.map((sr) => (
                <tr key={sr.scenarioId} className="border-b border-surface-border/50">
                  <td className="py-1.5 pr-4 text-rails-text">{sr.label}</td>
                  <td className={`py-1.5 pr-4 text-right font-mono ${scoreColor(sr.stressedScore)}`}>
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

      {/* Metadata */}
      <div className="card">
        <h2 className="mb-3 text-sm font-semibold text-rails-text">Memo Metadata</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-3">
          <div>
            <span className="text-rails-text-dim">Memo ID</span>
            <p className="font-mono text-rails-text">{memo.id}</p>
          </div>
          <div>
            <span className="text-rails-text-dim">Genome ID</span>
            <p className="font-mono text-rails-text truncate" title={memo.genomeId}>
              {memo.genomeId.slice(0, 16)}…
            </p>
          </div>
          <div>
            <span className="text-rails-text-dim">Genome Version</span>
            <p className="font-mono text-rails-text">{memo.genomeVersion}</p>
          </div>
          <div>
            <span className="text-rails-text-dim">Weight Profile</span>
            <p className="font-mono text-rails-text capitalize">
              {memo.weightProfileType.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <span className="text-rails-text-dim">SPV</span>
            <p className="text-rails-text">{memo.spv?.legalName ?? "—"}</p>
          </div>
          <div>
            <span className="text-rails-text-dim">Analyst</span>
            <p className="text-rails-text">{memo.createdBy?.email ?? "system"}</p>
          </div>
          <div>
            <span className="text-rails-text-dim">Created</span>
            <p className="text-rails-text">{formatDate(memo.createdAt)}</p>
          </div>
          <div>
            <span className="text-rails-text-dim">Updated</span>
            <p className="text-rails-text">{formatDate(memo.updatedAt)}</p>
          </div>
        </div>
        {memo.analystNotes && (
          <div className="mt-4 rounded-lg border border-surface-border/50 bg-surface-bg p-3">
            <span className="text-xs text-rails-text-dim">Analyst Notes</span>
            <p className="mt-1 text-xs text-rails-text whitespace-pre-wrap">{memo.analystNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
