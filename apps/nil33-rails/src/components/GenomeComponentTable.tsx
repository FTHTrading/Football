/**
 * Genome Component Hash Table — displays the 7 deterministic component hashes
 * that compose the genome fingerprint.
 *
 * Server component.
 */

interface Component {
  key: string;
  label: string;
  hash: string;
  description: string;
}

export function GenomeComponentTable({ components }: { components: Component[] }) {
  return (
    <div className="card">
      <h2 className="mb-4 text-sm font-semibold text-rails-text">
        Component Hash Breakdown
      </h2>
      <p className="mb-4 text-xs text-rails-text-dim">
        The Genome ID is a SHA-256 composite of these 7 deterministic component hashes.
        A change in any component produces a new genome identity.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border text-left text-rails-text-dim">
              <th className="pb-2 pr-4 font-medium w-8">#</th>
              <th className="pb-2 pr-4 font-medium">Component</th>
              <th className="pb-2 pr-4 font-medium">SHA-256</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => (
              <tr
                key={c.key}
                className="border-b border-surface-border/50 table-row-hover"
              >
                <td className="py-2.5 pr-4 font-mono text-rails-text-dim">
                  {i + 1}
                </td>
                <td className="py-2.5 pr-4">
                  <span className="font-medium text-rails-text">{c.label}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <code
                    className="font-mono text-[11px] text-rails-cyan"
                    title={c.hash}
                  >
                    {c.hash.slice(0, 16)}…{c.hash.slice(-8)}
                  </code>
                </td>
                <td className="py-2.5 text-rails-text-dim">{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual hash chain */}
      <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-2">
        {components.map((c, i) => (
          <div key={c.key} className="flex items-center gap-1">
            <div
              className="rounded bg-rails-cyan/10 px-2 py-1 text-[10px] font-mono text-rails-cyan whitespace-nowrap"
              title={`${c.label}: ${c.hash}`}
            >
              {c.hash.slice(0, 6)}
            </div>
            {i < components.length - 1 && (
              <span className="text-rails-text-dim text-[10px]">:</span>
            )}
          </div>
        ))}
        <span className="text-rails-text-dim text-[10px] mx-1">→</span>
        <div className="rounded bg-rails-green/10 px-2 py-1 text-[10px] font-mono text-rails-green font-bold whitespace-nowrap">
          SHA-256 → genomeId
        </div>
      </div>
    </div>
  );
}
