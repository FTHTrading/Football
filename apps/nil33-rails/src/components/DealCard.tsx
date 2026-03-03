import { formatCents, formatBps } from "@/lib/utils";
import Link from "next/link";

interface Deal {
  id: string;
  name: string;
  spv: string;
  status: string;
  totalIssuanceCents: number;
  participationRateBps: number;
  genomeId: string | null;
  genomeVersion: string | null;
  riskRating: string | null;
  subscriberCount: number;
  fundedCount: number;
  pendingCount: number;
  totalRaisedCents: number;
  pendingAmountCents: number;
  fillRate: number;
  daysToClose: number | null;
  offeringCloseAt: Date | null;
  distributionCount: number;
}

export function DealCard({ deal }: { deal: Deal }) {
  const fillColor =
    deal.fillRate >= 90 ? "bg-rails-green" :
    deal.fillRate >= 50 ? "bg-rails-gold" :
    "bg-rails-red";

  return (
    <Link href={`/nil33/instruments/${deal.id}`} className="card group transition-colors hover:border-rails-muted">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-rails-text group-hover:text-rails-green transition-colors">
            {deal.name}
          </h3>
          <p className="text-[10px] text-rails-text-dim">{deal.spv}</p>
        </div>
        <span className={`badge ml-2 shrink-0 ${deal.status === "OPEN" ? "badge-green" : "badge-cyan"}`}>
          {deal.status}
        </span>
      </div>

      {/* Fill rate bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[10px]">
          <span className="text-rails-text-dim">Fill rate</span>
          <span className="font-mono font-medium text-rails-text">{deal.fillRate}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={`h-full rounded-full ${fillColor} transition-all`}
            style={{ width: `${Math.min(deal.fillRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <span className="text-rails-text-dim">Issuance</span>
          <p className="font-mono text-rails-text">{formatCents(deal.totalIssuanceCents)}</p>
        </div>
        <div>
          <span className="text-rails-text-dim">Raised</span>
          <p className="font-mono text-rails-green">{formatCents(deal.totalRaisedCents)}</p>
        </div>
        <div>
          <span className="text-rails-text-dim">Participation</span>
          <p className="font-mono text-rails-cyan">{formatBps(deal.participationRateBps)}</p>
        </div>
        <div>
          <span className="text-rails-text-dim">Subscribers</span>
          <p className="font-mono text-rails-text">
            {deal.fundedCount} funded{deal.pendingCount > 0 ? ` · ${deal.pendingCount} pending` : ""}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-surface-border/50 pt-2 text-[10px]">
        {deal.daysToClose !== null ? (
          <span className={deal.daysToClose <= 7 ? "text-rails-red" : "text-rails-text-dim"}>
            {deal.daysToClose === 0 ? "Closing today" : `${deal.daysToClose}d to close`}
          </span>
        ) : (
          <span className="text-rails-text-dim">No close date</span>
        )}

        {deal.genomeId ? (
          <span className="font-mono text-rails-green" title={deal.genomeId}>
            ⧬ {deal.genomeId.slice(0, 8)}
          </span>
        ) : (
          <span className="text-rails-text-dim">No genome stamp</span>
        )}
      </div>
    </Link>
  );
}
