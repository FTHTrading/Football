import { prisma } from "@/lib/prisma";
import { formatCents, formatDate, formatBps } from "@/lib/utils";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  OPEN: "badge-green",
  ACTIVE: "badge-cyan",
  DRAFT: "badge-muted",
  CLOSED: "badge-muted",
  MATURED: "badge-yellow",
  CANCELLED: "badge-red",
};

export default async function InstrumentsPage() {
  const instruments = await prisma.instrument.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      spv: { select: { legalName: true } },
      _count: { select: { subscriptions: true } },
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rails-text">Instruments</h1>
          <p className="text-sm text-rails-text-dim">Revenue participation notes issued by SPVs</p>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SPV</th>
              <th className="px-4 py-3 font-medium">Total Issuance</th>
              <th className="px-4 py-3 font-medium">Participation</th>
              <th className="px-4 py-3 font-medium">Min Sub</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Subscribers</th>
              <th className="px-4 py-3 font-medium">Offering Closes</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((ins) => (
              <tr key={ins.id} className="border-b border-surface-border/50 table-row-hover">
                <td className="px-4 py-3 font-medium text-rails-text max-w-xs truncate">
                  <Link href={`/nil33/instruments/${ins.id}`} className="hover:text-rails-green">{ins.name}</Link>
                </td>
                <td className="px-4 py-3 text-rails-text-dim text-xs">{ins.spv.legalName}</td>
                <td className="px-4 py-3 font-mono text-rails-green">{formatCents(ins.totalIssuanceAmtCents)}</td>
                <td className="px-4 py-3 font-mono text-rails-cyan">{formatBps(ins.participationRateBps)}</td>
                <td className="px-4 py-3 font-mono text-rails-text-dim">{formatCents(ins.minSubscriptionCents)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_BADGE[ins.status] ?? "badge-muted"}`}>{ins.status}</span>
                </td>
                <td className="px-4 py-3 font-mono text-rails-text-dim">{ins._count.subscriptions}</td>
                <td className="px-4 py-3 text-rails-text-dim">{formatDate(ins.offeringCloseAt)}</td>
              </tr>
            ))}
            {instruments.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-rails-text-dim">No instruments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
