import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "badge-green",
  DRAFT: "badge-muted",
  SUSPENDED: "badge-red",
  DISSOLVED: "badge-muted",
};

export default async function IssuersPage() {
  const spvs = await prisma.spv.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { instruments: true, athletes: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rails-text">Issuers / SPVs</h1>
          <p className="text-sm text-rails-text-dim">Special purpose vehicles that issue instruments</p>
        </div>
        <a href="/nil33/issuers/new" className="btn-primary">+ New SPV</a>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-3 font-medium">Legal Name</th>
              <th className="px-4 py-3 font-medium">EIN</th>
              <th className="px-4 py-3 font-medium">Jurisdiction</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Instruments</th>
              <th className="px-4 py-3 font-medium">Athletes</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {spvs.map((spv) => (
              <tr key={spv.id} className="border-b border-surface-border/50 table-row-hover">
                <td className="px-4 py-3">
                  <Link href={`/nil33/issuers/${spv.id}`} className="font-medium text-rails-text hover:text-rails-green">
                    {spv.legalName}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-rails-text-dim">{spv.ein ?? "—"}</td>
                <td className="px-4 py-3 text-rails-text-dim">{spv.jurisdiction}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_BADGE[spv.status] ?? "badge-muted"}`}>
                    {spv.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-rails-cyan">{spv._count.instruments}</td>
                <td className="px-4 py-3 font-mono text-rails-text-dim">{spv._count.athletes}</td>
                <td className="px-4 py-3 text-rails-text-dim">{formatDate(spv.createdAt)}</td>
              </tr>
            ))}
            {spvs.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-rails-text-dim">No SPVs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
