/**
 * Model Identity Badge — Genome provenance display
 *
 * Shows the cryptographic genome fingerprint that was active
 * when a financial object (instrument, distribution, memo) was created.
 *
 * Server component — no "use client" needed.
 */

interface ModelIdentityBadgeProps {
  genomeId: string | null | undefined;
  genomeVersion?: string | null;
  snapshotHash?: string | null;
  /** Optional label override, defaults to "Model Identity" */
  label?: string;
  /** Compact = inline badge, full = card panel */
  variant?: "compact" | "full";
}

export function ModelIdentityBadge({
  genomeId,
  genomeVersion,
  snapshotHash,
  label = "Model Identity",
  variant = "compact",
}: ModelIdentityBadgeProps) {
  if (!genomeId) {
    return (
      <span className="badge badge-muted text-[10px]">
        No genome stamped
      </span>
    );
  }

  const shortId = genomeId.slice(0, 8) + "…" + genomeId.slice(-4);

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 rounded border border-surface-border bg-surface-card px-2.5 py-1">
        <span className="text-[10px] uppercase tracking-wider text-rails-text-dim">
          {label}
        </span>
        <span className="font-mono text-xs text-rails-cyan" title={genomeId}>
          {shortId}
        </span>
        {genomeVersion && (
          <span className="badge badge-green text-[10px]">
            v{genomeVersion}
          </span>
        )}
      </div>
    );
  }

  // Full variant — card panel
  return (
    <div className="card">
      <h2 className="mb-3 text-sm font-semibold text-rails-text">{label}</h2>
      <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-3 sm:gap-x-6">
        <div>
          <dt className="text-xs text-rails-text-dim">Genome ID</dt>
          <dd
            className="mt-0.5 font-mono text-xs text-rails-cyan break-all"
            title={genomeId}
          >
            {genomeId}
          </dd>
        </div>
        {genomeVersion && (
          <div>
            <dt className="text-xs text-rails-text-dim">Model Version</dt>
            <dd className="mt-0.5 font-mono text-xs text-rails-green">
              v{genomeVersion}
            </dd>
          </div>
        )}
        {snapshotHash && (
          <div>
            <dt className="text-xs text-rails-text-dim">Snapshot Hash</dt>
            <dd
              className="mt-0.5 font-mono text-xs text-rails-gold break-all"
              title={snapshotHash}
            >
              0x{snapshotHash.slice(0, 12)}…
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
