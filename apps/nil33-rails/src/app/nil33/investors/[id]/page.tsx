import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCents, formatDate } from "@/lib/utils";
import Link from "next/link";

const KYC_BADGE: Record<string, string> = {
  APPROVED: "badge-green",
  IN_REVIEW: "badge-yellow",
  PENDING: "badge-muted",
  REJECTED: "badge-red",
};

const ACCRED_BADGE: Record<string, string> = {
  VERIFIED: "badge-green",
  PENDING: "badge-muted",
  EXPIRED: "badge-yellow",
  FAILED: "badge-red",
};

const SUB_BADGE: Record<string, string> = {
  FUNDED: "badge-green",
  PENDING: "badge-yellow",
  CANCELLED: "badge-red",
  TRANSFERRED: "badge-cyan",
  MATURED: "badge-muted",
};

export default async function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const investor = await prisma.investor.findUnique({
    where: { id },
    include: {
      subscriptions: {
        include: {
          instrument: {
            select: { id: true, name: true, spv: { select: { legalName: true } } },
          },
        },
        orderBy: { subscribedAt: "desc" },
      },
      complianceChecks: {
        orderBy: { checkedAt: "desc" },
        take: 10,
      },
      wires: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!investor) notFound();

  const totalFunded = investor.subscriptions
    .filter((s) => s.status === "FUNDED")
    .reduce((sum, s) => sum + s.amountCents, 0);
  const activeDeals = investor.subscriptions.filter(
    (s) => s.status === "FUNDED"
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/investors" className="hover:text-rails-text">
          Investors
        </Link>
        <span>/</span>
        <span className="text-rails-text">{investor.legalName}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-rails-text">
          {investor.legalName}
        </h1>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-rails-text-dim">
          <span>{investor.email}</span>
          <span>{investor.entityType}</span>
          <span>
            {investor.jurisdictionCountry}
            {investor.jurisdictionState ? ` / ${investor.jurisdictionState}` : ""}
          </span>
          <span className={`badge ${KYC_BADGE[investor.kycStatus] ?? "badge-muted"}`}>
            KYC: {investor.kycStatus}
          </span>
          <span
            className={`badge ${
              ACCRED_BADGE[investor.accreditationStatus] ?? "badge-muted"
            }`}
          >
            Accred: {investor.accreditationStatus}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Invested",
            value: formatCents(totalFunded),
            color: "text-rails-green",
          },
          {
            label: "Active Deals",
            value: activeDeals.toString(),
            color: "text-rails-cyan",
          },
          {
            label: "Concentration Limit",
            value: `${(investor.concentrationLimitBps / 100).toFixed(0)}%`,
            color: "text-rails-gold",
          },
          {
            label: "Risk Flags",
            value:
              investor.riskFlags.length > 0
                ? investor.riskFlags.join(", ")
                : "None",
            color:
              investor.riskFlags.length > 0
                ? "text-rails-red"
                : "text-rails-text-dim",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="text-xs text-rails-text-dim">{s.label}</div>
            <div className={`mt-1 text-lg font-bold font-mono ${s.color}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          {(
            [
              ["Entity Type", investor.entityType],
              [
                "KYC Completed",
                formatDate(investor.kycCompletedAt),
              ],
              [
                "Accreditation Expires",
                formatDate(investor.accreditationExpiresAt),
              ],
              [
                "Ledger Total",
                formatCents(investor.totalInvestedCents),
              ],
              ["Created", formatDate(investor.createdAt)],
              ["Updated", formatDate(investor.updatedAt)],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-rails-text-dim">{k}</dt>
              <dd className="mt-0.5 font-medium text-rails-text">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Subscriptions */}
      <div className="card overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-rails-text">
            Subscriptions ({investor.subscriptions.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-2 font-medium">Instrument</th>
              <th className="px-4 py-2 font-medium">SPV</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Subscribed</th>
              <th className="px-4 py-2 font-medium">Funded</th>
            </tr>
          </thead>
          <tbody>
            {investor.subscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-surface-border/50 table-row-hover"
              >
                <td className="px-4 py-2 text-rails-text">
                  <Link
                    href={`/nil33/instruments/${sub.instrumentId}`}
                    className="hover:text-rails-green"
                  >
                    {sub.instrument.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-xs text-rails-text-dim">
                  {sub.instrument.spv.legalName}
                </td>
                <td className="px-4 py-2 font-mono text-rails-green">
                  {formatCents(sub.amountCents)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`badge ${
                      SUB_BADGE[sub.status] ?? "badge-muted"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {formatDate(sub.subscribedAt)}
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {formatDate(sub.fundedAt)}
                </td>
              </tr>
            ))}
            {investor.subscriptions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-rails-text-dim"
                >
                  No subscriptions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Compliance Checks */}
      <div className="card overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-rails-text">
            Recent Compliance Checks
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-2 font-medium">Result</th>
              <th className="px-4 py-2 font-medium">Reason</th>
              <th className="px-4 py-2 font-medium">Detail</th>
              <th className="px-4 py-2 font-medium">Checked</th>
            </tr>
          </thead>
          <tbody>
            {investor.complianceChecks.map((cc) => (
              <tr
                key={cc.id}
                className="border-b border-surface-border/50 table-row-hover"
              >
                <td className="px-4 py-2">
                  <span
                    className={`badge ${
                      cc.passed ? "badge-green" : "badge-red"
                    }`}
                  >
                    {cc.passed ? "PASS" : "FAIL"}
                  </span>
                </td>
                <td className="px-4 py-2 font-mono text-xs text-rails-text-dim">
                  {cc.reasonCode ?? "—"}
                </td>
                <td className="px-4 py-2 text-xs text-rails-text-dim max-w-xs truncate">
                  {cc.detail ?? "—"}
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {formatDate(cc.checkedAt)}
                </td>
              </tr>
            ))}
            {investor.complianceChecks.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-rails-text-dim"
                >
                  No compliance checks yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Wire Instructions */}
      {investor.wires.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">
            Wire Instructions
          </h2>
          <ul className="space-y-2">
            {investor.wires.map((w) => (
              <li
                key={w.id}
                className="flex items-center gap-4 text-sm rounded-lg border border-surface-border p-3"
              >
                <span className="text-rails-text font-medium">
                  {w.bankName}
                </span>
                <span className="font-mono text-rails-text-dim text-xs">
                  ****{w.accountLast4}
                </span>
                <span className="font-mono text-rails-text-dim text-xs">
                  Routing: ****{w.routingLast4}
                </span>
                {w.isDefault && (
                  <span className="badge badge-cyan text-[10px]">DEFAULT</span>
                )}
                {w.label && (
                  <span className="text-xs text-rails-text-dim">{w.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
