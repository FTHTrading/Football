import { formatCents } from "@/lib/utils";

interface InvestorRow {
  id: string;
  legalName: string;
  totalInvestedCents: number;
  accreditationStatus: string;
  _count: { subscriptions: number };
}

const ACCRED_BADGE: Record<string, string> = {
  VERIFIED: "badge-green",
  PENDING: "badge-yellow",
  EXPIRED: "badge-red",
  FAILED: "badge-red",
};

export function DemandLeaderboard({ investors }: { investors: InvestorRow[] }) {
  if (investors.length === 0) {
    return <p className="py-4 text-center text-xs text-rails-text-dim">No investor activity yet.</p>;
  }

  const maxInvested = Math.max(...investors.map((i) => i.totalInvestedCents), 1);

  return (
    <div className="space-y-0">
      {investors.map((inv, idx) => {
        const barWidth = (inv.totalInvestedCents / maxInvested) * 100;
        return (
          <div key={inv.id} className="flex items-center gap-3 border-b border-surface-border/50 py-2 last:border-0">
            {/* Rank */}
            <span className="w-5 text-right font-mono text-[10px] text-rails-muted">{idx + 1}</span>

            {/* Bar + name */}
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between">
                <span className="truncate text-xs font-medium text-rails-text">{inv.legalName}</span>
                <span className={`badge ml-2 text-[9px] ${ACCRED_BADGE[inv.accreditationStatus] ?? "badge-muted"}`}>
                  {inv.accreditationStatus}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-rails-green transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="shrink-0 text-right">
              <p className="font-mono text-xs text-rails-green">{formatCents(inv.totalInvestedCents)}</p>
              <p className="text-[9px] text-rails-text-dim">{inv._count.subscriptions} sub{inv._count.subscriptions !== 1 ? "s" : ""}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
