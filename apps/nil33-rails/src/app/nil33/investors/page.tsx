import { prisma } from "@/lib/prisma";
import { formatCents, formatDate } from "@/lib/utils";
import Link from "next/link";

const KYC_BADGE: Record<string, string> = {
  APPROVED: "badge-green",
  REJECTED: "badge-red",
  IN_REVIEW: "badge-yellow",
  PENDING: "badge-muted",
};

const ACC_BADGE: Record<string, string> = {
  VERIFIED: "badge-green",
  EXPIRED: "badge-red",
  FAILED: "badge-red",
  PENDING: "badge-muted",
};

export default async function InvestorsPage() {
  const investors = await prisma.investor.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { subscriptions: true, complianceChecks: true } },
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rails-text">Investors</h1>
          <p className="text-sm text-rails-text-dim">Accredited investors with KYC/compliance tracking</p>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">KYC</th>
              <th className="px-4 py-3 font-medium">Accreditation</th>
              <th className="px-4 py-3 font-medium">Total Invested</th>
              <th className="px-4 py-3 font-medium">Subs</th>
              <th className="px-4 py-3 font-medium">Jurisdiction</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv) => (
              <tr key={inv.id} className="border-b border-surface-border/50 table-row-hover">
                <td className="px-4 py-3 font-medium text-rails-text">
                  <Link href={`/nil33/investors/${inv.id}`} className="hover:text-rails-green">{inv.legalName}</Link>
                </td>
                <td className="px-4 py-3 text-rails-text-dim text-xs">{inv.email}</td>
                <td className="px-4 py-3 text-rails-text-dim">{inv.entityType}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${KYC_BADGE[inv.kycStatus] ?? "badge-muted"}`}>{inv.kycStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${ACC_BADGE[inv.accreditationStatus] ?? "badge-muted"}`}>
                    {inv.accreditationStatus}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-rails-green">{formatCents(inv.totalInvestedCents)}</td>
                <td className="px-4 py-3 font-mono text-rails-text-dim">{inv._count.subscriptions}</td>
                <td className="px-4 py-3 text-rails-text-dim">
                  {inv.jurisdictionCountry}{inv.jurisdictionState ? `-${inv.jurisdictionState}` : ""}
                </td>
                <td className="px-4 py-3 text-rails-text-dim">{formatDate(inv.createdAt)}</td>
              </tr>
            ))}
            {investors.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-rails-text-dim">No investors yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
