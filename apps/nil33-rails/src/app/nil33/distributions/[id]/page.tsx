import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCents, formatDate, formatBps } from "@/lib/utils";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  COMPLETE: "badge-green",
  APPROVED: "badge-cyan",
  EXECUTING: "badge-yellow",
  PENDING_APPROVAL: "badge-yellow",
  DRAFT: "badge-muted",
  FAILED: "badge-red",
};

const LINE_BADGE: Record<string, string> = {
  PAID: "badge-green",
  PENDING: "badge-yellow",
  FAILED: "badge-red",
};

export default async function DistributionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const distribution = await prisma.distribution.findUnique({
    where: { id },
    include: {
      instrument: {
        select: {
          id: true,
          name: true,
          participationRateBps: true,
          spv: { select: { id: true, legalName: true } },
        },
      },
      lines: {
        orderBy: { amountCents: "desc" },
        include: {
          subscription: {
            select: {
              investorId: true,
              investor: { select: { legalName: true } },
            },
          },
        },
      },
    },
  });

  if (!distribution) notFound();

  const paidLines = distribution.lines.filter((l) => l.status === "PAID");
  const totalPaid = paidLines.reduce((sum, l) => sum + l.amountCents, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/distributions" className="hover:text-rails-text">
          Distributions
        </Link>
        <span>/</span>
        <span className="text-rails-text">
          {formatDate(distribution.periodStart)} –{" "}
          {formatDate(distribution.periodEnd)}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-rails-text">
          Distribution Run
        </h1>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-rails-text-dim">
          <Link
            href={`/nil33/instruments/${distribution.instrument.id}`}
            className="hover:text-rails-green"
          >
            {distribution.instrument.name}
          </Link>
          <Link
            href={`/nil33/issuers/${distribution.instrument.spv.id}`}
            className="hover:text-rails-green"
          >
            SPV: {distribution.instrument.spv.legalName}
          </Link>
          <span
            className={`badge ${
              STATUS_BADGE[distribution.status] ?? "badge-muted"
            }`}
          >
            {distribution.status}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Gross Revenue",
            value: formatCents(distribution.grossRevenueCents),
            color: "text-rails-text",
          },
          {
            label: "Participation",
            value: formatCents(distribution.participationCents),
            color: "text-rails-cyan",
          },
          {
            label: "Mgmt Fee",
            value: formatCents(distribution.managementFeeCents),
            color: "text-rails-gold",
          },
          {
            label: "Net Distributable",
            value: formatCents(distribution.netDistributableCents),
            color: "text-rails-green",
          },
          {
            label: "Total Paid",
            value: formatCents(totalPaid),
            color: "text-rails-green",
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

      {/* Waterfall summary */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">
          Waterfall
        </h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          {(
            [
              [
                "Period",
                `${formatDate(distribution.periodStart)} – ${formatDate(
                  distribution.periodEnd
                )}`,
              ],
              [
                "Participation Rate",
                formatBps(distribution.instrument.participationRateBps),
              ],
              ["Approved By", distribution.approvedBy ?? "—"],
              ["Approved At", formatDate(distribution.approvedAt)],
              ["Executed At", formatDate(distribution.executedAt)],
              ["Created", formatDate(distribution.createdAt)],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-rails-text-dim">{k}</dt>
              <dd className="mt-0.5 font-medium text-rails-text">{v}</dd>
            </div>
          ))}
        </dl>
        {distribution.notes && (
          <div className="mt-4 rounded-lg border border-surface-border p-3 text-sm text-rails-text-dim">
            {distribution.notes}
          </div>
        )}
      </div>

      {/* Distribution Lines */}
      <div className="card overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-rails-text">
            Distribution Lines ({distribution.lines.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-2 font-medium">Investor</th>
              <th className="px-4 py-2 font-medium">Ownership</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Wired</th>
            </tr>
          </thead>
          <tbody>
            {distribution.lines.map((line) => (
              <tr
                key={line.id}
                className="border-b border-surface-border/50 table-row-hover"
              >
                <td className="px-4 py-2 text-rails-text">
                  <Link
                    href={`/nil33/investors/${line.subscription.investorId}`}
                    className="hover:text-rails-green"
                  >
                    {line.investorName}
                  </Link>
                </td>
                <td className="px-4 py-2 font-mono text-rails-cyan">
                  {formatBps(line.ownershipBps)}
                </td>
                <td className="px-4 py-2 font-mono text-rails-green">
                  {formatCents(line.amountCents)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`badge ${
                      LINE_BADGE[line.status] ?? "badge-muted"
                    }`}
                  >
                    {line.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {formatDate(line.wiredAt)}
                </td>
              </tr>
            ))}
            {distribution.lines.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-rails-text-dim"
                >
                  No distribution lines.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
