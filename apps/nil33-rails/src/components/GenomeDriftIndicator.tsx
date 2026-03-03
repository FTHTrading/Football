/**
 * Genome Drift Indicator — shows whether the live model matches
 * the most recently stamped genome in the database.
 *
 * Green = in sync. Red = drift detected.
 *
 * Server component.
 */

interface GenomeDriftIndicatorProps {
  driftDetected: boolean;
  currentGenomeId: string;
  lastStampedGenomeId: string | null;
}

export function GenomeDriftIndicator({
  driftDetected,
  currentGenomeId,
  lastStampedGenomeId,
}: GenomeDriftIndicatorProps) {
  if (!lastStampedGenomeId) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border bg-surface-muted/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted">
            <span className="text-sm text-rails-text-dim">—</span>
          </div>
          <div>
            <p className="text-sm font-medium text-rails-text-dim">No Genome History</p>
            <p className="text-xs text-rails-muted">
              No underwriting runs have been recorded. The live genome has no baseline to compare against.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!driftDetected) {
    return (
      <div className="rounded-xl border border-rails-green/30 bg-rails-green/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rails-green/20">
            <span className="text-sm text-rails-green">✓</span>
          </div>
          <div>
            <p className="text-sm font-medium text-rails-green">Model In Sync</p>
            <p className="text-xs text-rails-text-dim">
              The live genome matches the most recently stamped genome.
              All new underwriting runs will produce identical results.
            </p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Active Genome</span>
            <p className="mt-0.5 font-mono text-xs text-rails-cyan">
              {currentGenomeId.slice(0, 12)}…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rails-red/30 bg-rails-red/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rails-red/20">
          <span className="text-sm text-rails-red">⚠</span>
        </div>
        <div>
          <p className="text-sm font-medium text-rails-red">Genome Drift Detected</p>
          <p className="text-xs text-rails-text-dim">
            The live model has changed since the last underwriting run.
            New runs will produce a different genome fingerprint.
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-surface-muted p-2.5">
          <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Current Model</span>
          <p className="mt-0.5 font-mono text-rails-cyan" title={currentGenomeId}>
            {currentGenomeId.slice(0, 16)}…
          </p>
        </div>
        <div className="rounded-lg bg-surface-muted p-2.5">
          <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">Last Stamped</span>
          <p className="mt-0.5 font-mono text-rails-gold" title={lastStampedGenomeId}>
            {lastStampedGenomeId.slice(0, 16)}…
          </p>
        </div>
      </div>
    </div>
  );
}
