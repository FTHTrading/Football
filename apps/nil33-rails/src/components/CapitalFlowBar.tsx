import { formatCents } from "@/lib/utils";

interface CapitalFlowBarProps {
  deployed: number;
  gross: number;
  participation: number;
  fees: number;
  net: number;
}

export function CapitalFlowBar({ deployed, gross, participation, fees, net }: CapitalFlowBarProps) {
  const stages = [
    { label: "Capital Deployed", value: deployed, color: "bg-rails-text-dim", textColor: "text-rails-text" },
    { label: "Gross Revenue", value: gross, color: "bg-surface-muted", textColor: "text-rails-text-dim" },
    { label: "Participation", value: participation, color: "bg-rails-cyan", textColor: "text-rails-cyan" },
    { label: "Mgmt Fees", value: fees, color: "bg-rails-gold", textColor: "text-rails-gold" },
    { label: "Net Distributed", value: net, color: "bg-rails-green", textColor: "text-rails-green" },
  ];

  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        const pct = (stage.value / maxValue) * 100;
        return (
          <div key={stage.label} className="flex items-center gap-3">
            <span className="w-28 text-right text-xs text-rails-text-dim">{stage.label}</span>
            <div className="flex-1">
              <div className="h-6 w-full overflow-hidden rounded bg-surface-muted">
                <div
                  className={`flex h-full items-center rounded ${stage.color} transition-all`}
                  style={{ width: `${pct}%` }}
                >
                  {pct > 12 && (
                    <span className="px-2 text-[10px] font-bold text-surface">
                      {formatCents(stage.value)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {pct <= 12 && (
              <span className={`font-mono text-xs ${stage.textColor}`}>{formatCents(stage.value)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
