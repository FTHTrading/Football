import { formatCents, formatDate } from "@/lib/utils";

interface MaturityItem {
  id: string;
  name: string;
  maturityDate: Date;
  holdingPeriodDays: number;
  totalIssuanceCents: number;
  daysToMaturity: number;
  urgency: "MATURING" | "APPROACHING" | "ON_TRACK";
}

const URGENCY_STYLES: Record<string, { badge: string; bar: string }> = {
  MATURING: { badge: "badge-red", bar: "bg-rails-red" },
  APPROACHING: { badge: "badge-yellow", bar: "bg-rails-gold" },
  ON_TRACK: { badge: "badge-green", bar: "bg-rails-green" },
};

export function MaturityTimeline({ schedule }: { schedule: MaturityItem[] }) {
  if (schedule.length === 0) {
    return <p className="py-4 text-center text-xs text-rails-text-dim">No upcoming maturities.</p>;
  }

  const maxDays = Math.max(...schedule.map((s) => s.daysToMaturity), 1);

  return (
    <div className="space-y-2">
      {schedule.map((item) => {
        const styles = URGENCY_STYLES[item.urgency];
        const pct = maxDays > 0 ? ((maxDays - item.daysToMaturity) / maxDays) * 100 : 100;

        return (
          <div key={item.id} className="flex items-center gap-3 border-b border-surface-border/50 py-2 last:border-0">
            {/* Urgency badge */}
            <span className={`badge text-[9px] w-20 text-center ${styles.badge}`}>
              {item.urgency === "MATURING" ? "NOW" : `${item.daysToMaturity}d`}
            </span>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate font-medium text-rails-text">{item.name}</span>
                <span className="text-rails-text-dim ml-2">{formatDate(item.maturityDate)}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full rounded-full ${styles.bar} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Issuance */}
            <span className="shrink-0 font-mono text-xs text-rails-text-dim">
              {formatCents(item.totalIssuanceCents)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
