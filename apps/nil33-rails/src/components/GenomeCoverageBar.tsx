/**
 * Genome Coverage Bar — shows what fraction of a capital object type
 * carries a genome stamp.
 *
 * Server component. Pure CSS progress bar.
 */

interface GenomeCoverageBarProps {
  label: string;
  total: number;
  stamped: number;
  pct: number;
}

export function GenomeCoverageBar({ label, total, stamped, pct }: GenomeCoverageBarProps) {
  const pctDisplay = (pct * 100).toFixed(0);
  const barColor =
    pct >= 0.9
      ? "bg-rails-green"
      : pct >= 0.5
        ? "bg-rails-gold"
        : pct > 0
          ? "bg-rails-red"
          : "bg-surface-muted";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-rails-text">{label}</span>
        <span className="text-rails-text-dim">
          <span className="font-mono text-rails-cyan">{stamped}</span>
          <span className="mx-0.5">/</span>
          <span className="font-mono">{total}</span>
          <span className="ml-1.5 font-mono text-rails-green">{pctDisplay}%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.max(pct * 100, total > 0 ? 1 : 0)}%` }}
        />
      </div>
    </div>
  );
}
