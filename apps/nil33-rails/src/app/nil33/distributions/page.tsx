import { prisma } from "@/lib/prisma";
import { formatCents, formatDate } from "@/lib/utils";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  COMPLETE: "badge-green",
  EXECUTING: "badge-cyan",
  APPROVED: "badge-yellow",
  PENDING_APPROVAL: "badge-yellow",
  DRAFT: "badge-muted",
  FAILED: "badge-red",
};

export default async function DistributionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const distributions = await prisma.distribution.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      instrument: { select: { name: true } },
      _count: { select: { lines: true } },
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rails-text">Distributions</h1>
          <p className="text-sm text-rails-text-dim">Revenue waterfall runs across funded subscriptions</p>
        </div>
        <Link href="/nil33/distributions/new" className="btn-primary">+ New Distribution</Link>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3">
        <select name="status" className="input w-44" defaultValue={status ?? ""}>
          <option value="">All Statuses</option>
          {["DRAFT", "PENDING_APPROVAL", "APPROVED", "EXECUTING", "COMPLETE", "FAILED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="btn-outline px-4">Filter</button>
        {status && (
          <Link href="/nil33/distributions" className="text-xs text-rails-text-dim self-center hover:text-rails-text">
            Clear
          </Link>
        )}
      </form>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-3 font-medium">Instrument</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium">Gross Revenue</th>
              <th className="px-4 py-3 font-medium">Participation</th>
              <th className="px-4 py-3 font-medium">Net Distributable</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Lines</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {distributions.map((d) => (
              <tr key={d.id} className="border-b border-surface-border/50 table-row-hover">
                <td className="px-4 py-3 font-medium text-rails-text max-w-[200px] truncate">
                  <Link href={`/nil33/distributions/${d.id}`} className="hover:text-rails-green">{d.instrument.name}</Link>
                </td>
                <td className="px-4 py-3 text-xs text-rails-text-dim">
                  {formatDate(d.periodStart)} – {formatDate(d.periodEnd)}
                </td>
                <td className="px-4 py-3 font-mono text-rails-text-dim">{formatCents(d.grossRevenueCents)}</td>
                <td className="px-4 py-3 font-mono text-rails-cyan">{formatCents(d.participationCents)}</td>
                <td className="px-4 py-3 font-mono text-rails-green">{formatCents(d.netDistributableCents)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_BADGE[d.status] ?? "badge-muted"}`}>{d.status}</span>
                </td>
                <td className="px-4 py-3 font-mono text-rails-text-dim">{d._count.lines}</td>
                <td className="px-4 py-3 text-rails-text-dim">{formatDate(d.createdAt)}</td>
              </tr>
            ))}
            {distributions.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-rails-text-dim">No distributions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
