/**
 * Evaluation Stage Card — a pipeline stage summary card
 * with key metrics and a navigation link.
 *
 * Server component.
 */

import Link from "next/link";

interface Stat {
  label: string;
  value: string;
}

interface StatusEntry {
  label: string;
  value: string;
  color: string;
}

interface EvalStageCardProps {
  icon: string;
  title: string;
  description: string;
  stats: Stat[];
  statusBreakdown?: StatusEntry[];
  href: string;
  linkLabel: string;
}

export function EvalStageCard({
  icon,
  title,
  description,
  stats,
  statusBreakdown,
  href,
  linkLabel,
}: EvalStageCardProps) {
  return (
    <div className="card flex flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-lg text-rails-green">{icon}</span>
        <div>
          <h3 className="text-sm font-semibold text-rails-text">{title}</h3>
          <p className="text-[10px] text-rails-text-dim">{description}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-surface-muted p-2 text-center">
            <span className="font-mono text-sm font-bold text-rails-cyan">{s.value}</span>
            <p className="text-[9px] uppercase tracking-wider text-rails-text-dim">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Optional status breakdown */}
      {statusBreakdown && statusBreakdown.length > 0 && (
        <div className="mb-3 flex items-center gap-4 border-t border-surface-border pt-3">
          {statusBreakdown.map((entry) => (
            <div key={entry.label} className="text-center">
              <span className={`font-mono text-sm font-bold ${entry.color}`}>{entry.value}</span>
              <p className="text-[9px] uppercase tracking-wider text-rails-text-dim">{entry.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Link */}
      <div className="mt-auto pt-2 border-t border-surface-border">
        <Link href={href} className="text-xs text-rails-green hover:underline">
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
