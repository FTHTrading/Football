import { formatCents } from "@/lib/utils";

interface PipelineData {
  [status: string]: { count: number; amountCents: number };
}

const STAGE_ORDER = ["PENDING", "FUNDED", "TRANSFERRED", "MATURED", "CANCELLED"];

const STAGE_COLORS: Record<string, string> = {
  PENDING: "bg-rails-gold",
  FUNDED: "bg-rails-green",
  TRANSFERRED: "bg-rails-cyan",
  MATURED: "bg-rails-text-dim",
  CANCELLED: "bg-rails-red",
};

const STAGE_TEXT: Record<string, string> = {
  PENDING: "text-rails-gold",
  FUNDED: "text-rails-green",
  TRANSFERRED: "text-rails-cyan",
  MATURED: "text-rails-text-dim",
  CANCELLED: "text-rails-red",
};

export function SubscriptionPipeline({ pipeline }: { pipeline: PipelineData }) {
  const total = Object.values(pipeline).reduce((s, v) => s + v.amountCents, 0);
  const stages = STAGE_ORDER.filter((s) => pipeline[s]);

  if (stages.length === 0) {
    return <p className="py-4 text-center text-xs text-rails-text-dim">No subscription data.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="flex h-6 w-full overflow-hidden rounded-lg bg-surface-muted">
        {stages.map((status) => {
          const data = pipeline[status];
          const pct = total > 0 ? (data.amountCents / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={status}
              className={`${STAGE_COLORS[status] ?? "bg-rails-muted"} flex items-center justify-center transition-all`}
              style={{ width: `${pct}%` }}
              title={`${status}: ${formatCents(data.amountCents)} (${data.count})`}
            >
              {pct > 8 && (
                <span className="text-[9px] font-bold text-surface">{Math.round(pct)}%</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {stages.map((status) => {
          const data = pipeline[status];
          return (
            <div key={status} className="flex items-center gap-2 text-xs">
              <div className={`h-2.5 w-2.5 rounded-sm ${STAGE_COLORS[status] ?? "bg-rails-muted"}`} />
              <span className="text-rails-text-dim">{status}</span>
              <span className={`font-mono font-medium ${STAGE_TEXT[status] ?? "text-rails-text"}`}>
                {formatCents(data.amountCents)}
              </span>
              <span className="text-rails-muted">({data.count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
