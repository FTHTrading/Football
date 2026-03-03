import { prisma } from "@/lib/prisma";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { page?: string; action?: string; entityType?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (searchParams.action) where.action = { contains: searchParams.action };
  if (searchParams.entityType) where.entityType = searchParams.entityType;

  const [events, total] = await Promise.all([
    prisma.ledgerEvent.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { occurredAt: "desc" },
      include: { actor: { select: { email: true } } },
    }),
    prisma.ledgerEvent.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-rails-text">Audit Ledger</h1>
        <p className="text-sm text-rails-text-dim">
          Immutable append-only event log — {total.toLocaleString()} total events
        </p>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-3">
        <input
          name="action"
          defaultValue={searchParams.action}
          className="input w-48"
          placeholder="Filter by action…"
        />
        <input
          name="entityType"
          defaultValue={searchParams.entityType}
          className="input w-40"
          placeholder="Entity type…"
        />
        <button type="submit" className="btn-outline">Filter</button>
        <a href="/nil33/audit" className="btn-outline">Clear</a>
      </form>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-rails-text-dim">
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Entity</th>
              <th className="px-4 py-3 font-medium">Entity ID</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Before Hash</th>
              <th className="px-4 py-3 font-medium">After Hash</th>
              <th className="px-4 py-3 font-medium">Occurred At</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id} className="border-b border-surface-border/50 hover:bg-surface-muted/40">
                <td className="px-4 py-2 text-rails-cyan">{evt.action}</td>
                <td className="px-4 py-2 text-rails-text-dim">{evt.entityType}</td>
                <td className="px-4 py-2 text-rails-text-dim">{evt.entityId.slice(0, 12)}…</td>
                <td className="px-4 py-2 text-rails-text-dim">{evt.actor?.email ?? "system"}</td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {evt.beforeHash ? evt.beforeHash.slice(0, 10) + "…" : "—"}
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {evt.afterHash ? evt.afterHash.slice(0, 10) + "…" : "—"}
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {new Date(evt.occurredAt).toISOString().replace("T", " ").slice(0, 19)}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-rails-text-dim">No events match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-rails-text-dim">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`?page=${page - 1}&action=${searchParams.action ?? ""}&entityType=${searchParams.entityType ?? ""}`}
                className="btn-outline py-1">← Prev</a>
            )}
            {page < totalPages && (
              <a href={`?page=${page + 1}&action=${searchParams.action ?? ""}&entityType=${searchParams.entityType ?? ""}`}
                className="btn-outline py-1">Next →</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
