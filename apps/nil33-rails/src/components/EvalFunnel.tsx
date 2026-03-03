/**
 * Evaluation Funnel — horizontal pipeline funnel visualization
 * showing conversion from athletes through distribution.
 *
 * Server component. Pure CSS.
 */

interface FunnelStage {
  label: string;
  count: number;
  color: string;
}

export function EvalFunnel({ stages }: { stages: FunnelStage[] }) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="card">
      <h2 className="mb-4 text-sm font-semibold text-rails-text">Capital Pipeline Funnel</h2>

      {/* Horizontal funnel */}
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const widthPct = Math.max((stage.count / maxCount) * 100, 8);
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="w-40 text-right text-xs text-rails-text-dim shrink-0">
                {stage.label}
              </span>
              <div className="flex-1">
                <div className="relative h-7 overflow-hidden rounded">
                  <div
                    className={`h-full rounded ${stage.color} transition-all flex items-center px-3`}
                    style={{ width: `${widthPct}%`, opacity: 1 - i * 0.08 }}
                  >
                    <span className="font-mono text-xs font-bold text-white drop-shadow-sm">
                      {stage.count}
                    </span>
                  </div>
                </div>
              </div>
              {i < stages.length - 1 && (
                <span className="text-[10px] text-rails-text-dim w-6 text-center shrink-0">↓</span>
              )}
              {i === stages.length - 1 && <span className="w-6 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Flow arrows */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-rails-text-dim">
        <span className="font-mono text-rails-cyan">GENOME</span>
        <span>→</span>
        <span className="font-mono text-rails-green">EVALUATION</span>
        <span>→</span>
        <span className="font-mono text-rails-gold">MARKET</span>
        <span>→</span>
        <span className="font-mono text-rails-cyan">CAPITAL</span>
      </div>
    </div>
  );
}
