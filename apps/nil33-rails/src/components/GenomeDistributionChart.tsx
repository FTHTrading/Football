/**
 * Genome Distribution Chart — horizontal bar visualization of genome
 * clusters across the portfolio, showing exposure concentration.
 *
 * Server component. Pure CSS bars, no JS charting library.
 */

import { formatCents } from "@/lib/utils";

interface Cluster {
  genomeId: string;
  genomeVersion: string | null;
  instrumentCount: number;
  totalExposureCents: number;
  weightPct: number;
}

interface GenomeDistributionChartProps {
  clusters: Cluster[];
  totalExposureCents: number;
}

const BAR_COLORS = [
  "bg-rails-green",
  "bg-rails-cyan",
  "bg-rails-gold",
  "bg-rails-red",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
];

export function GenomeDistributionChart({
  clusters,
  totalExposureCents,
}: GenomeDistributionChartProps) {
  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-6 overflow-hidden rounded-lg border border-surface-border">
        {clusters.map((c, i) => (
          <div
            key={c.genomeId}
            className={`${BAR_COLORS[i % BAR_COLORS.length]} transition-all`}
            style={{ width: `${Math.max(c.weightPct * 100, 1)}%` }}
            title={`${c.genomeId.slice(0, 8)}… — ${(c.weightPct * 100).toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border text-left text-rails-text-dim">
              <th className="pb-2 pr-3 font-medium w-5" />
              <th className="pb-2 pr-4 font-medium">Genome ID</th>
              <th className="pb-2 pr-4 font-medium">Version</th>
              <th className="pb-2 pr-4 font-medium text-right">Instruments</th>
              <th className="pb-2 pr-4 font-medium text-right">Exposure</th>
              <th className="pb-2 font-medium text-right">Weight</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c, i) => (
              <tr key={c.genomeId} className="border-b border-surface-border/50">
                <td className="py-2 pr-3">
                  <div className={`h-3 w-3 rounded-sm ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                </td>
                <td className="py-2 pr-4 font-mono text-rails-cyan" title={c.genomeId}>
                  {c.genomeId.slice(0, 12)}…{c.genomeId.slice(-4)}
                </td>
                <td className="py-2 pr-4 font-mono text-rails-green">
                  v{c.genomeVersion ?? "—"}
                </td>
                <td className="py-2 pr-4 text-right font-mono text-rails-text">
                  {c.instrumentCount}
                </td>
                <td className="py-2 pr-4 text-right text-rails-text-dim">
                  {formatCents(c.totalExposureCents)}
                </td>
                <td className="py-2 text-right font-mono text-rails-gold">
                  {(c.weightPct * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-rails-text-dim border-t border-surface-border pt-3">
        <span>
          {clusters.length} distinct genome{clusters.length !== 1 ? "s" : ""} across{" "}
          {clusters.reduce((s, c) => s + c.instrumentCount, 0)} instruments
        </span>
        <span className="font-mono">{formatCents(totalExposureCents)} total exposure</span>
      </div>
    </div>
  );
}
