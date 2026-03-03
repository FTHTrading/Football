import { formatCents } from "@/lib/utils";

interface WaterfallRow {
  instrumentId: string;
  name: string;
  gross: number;
  participation: number;
  fees: number;
  net: number;
  count: number;
}

export function WaterfallChart({ waterfall }: { waterfall: WaterfallRow[] }) {
  const maxGross = Math.max(...waterfall.map((w) => w.gross), 1);

  return (
    <div className="space-y-3">
      {waterfall.map((row) => {
        const grossPct = (row.gross / maxGross) * 100;
        const partPct = row.gross > 0 ? (row.participation / row.gross) * 100 : 0;
        const feesPct = row.gross > 0 ? (row.fees / row.gross) * 100 : 0;
        const netPct = row.gross > 0 ? (row.net / row.gross) * 100 : 0;

        return (
          <div key={row.instrumentId} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="truncate text-rails-text font-medium max-w-[200px]">{row.name}</span>
              <span className="text-rails-text-dim">{row.count} dist{row.count !== 1 ? "s" : ""}</span>
            </div>

            {/* Stacked waterfall bar */}
            <div className="flex h-5 overflow-hidden rounded bg-surface-muted" style={{ width: `${grossPct}%` }}>
              {/* Participation portion */}
              <div
                className="flex h-full items-center bg-rails-cyan transition-all"
                style={{ width: `${partPct}%` }}
                title={`Participation: ${formatCents(row.participation)}`}
              />
              {/* Fees portion */}
              <div
                className="flex h-full items-center bg-rails-gold transition-all"
                style={{ width: `${feesPct}%` }}
                title={`Mgmt fees: ${formatCents(row.fees)}`}
              />
              {/* Net distributable */}
              <div
                className="flex h-full items-center bg-rails-green transition-all"
                style={{ width: `${netPct}%` }}
                title={`Net: ${formatCents(row.net)}`}
              />
            </div>

            {/* Values */}
            <div className="flex gap-4 text-[10px]">
              <span className="text-rails-text-dim">Gross: <span className="font-mono text-rails-text">{formatCents(row.gross)}</span></span>
              <span className="text-rails-text-dim">Part: <span className="font-mono text-rails-cyan">{formatCents(row.participation)}</span></span>
              <span className="text-rails-text-dim">Fees: <span className="font-mono text-rails-gold">{formatCents(row.fees)}</span></span>
              <span className="text-rails-text-dim">Net: <span className="font-mono text-rails-green">{formatCents(row.net)}</span></span>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex gap-4 border-t border-surface-border/50 pt-3">
        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="h-2 w-2 rounded-sm bg-rails-cyan" />
          <span className="text-rails-text-dim">Participation</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="h-2 w-2 rounded-sm bg-rails-gold" />
          <span className="text-rails-text-dim">Mgmt Fees</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="h-2 w-2 rounded-sm bg-rails-green" />
          <span className="text-rails-text-dim">Net Distributable</span>
        </div>
      </div>
    </div>
  );
}
