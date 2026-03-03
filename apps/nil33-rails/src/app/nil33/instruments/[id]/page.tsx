import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCents, formatDate, formatBps } from "@/lib/utils";
import Link from "next/link";
import { ModelIdentityBadge } from "@/components/ModelIdentityBadge";

const SUB_BADGE: Record<string, string> = {
  FUNDED: "badge-green",
  PENDING: "badge-yellow",
  CANCELLED: "badge-red",
  TRANSFERRED: "badge-cyan",
  MATURED: "badge-muted",
};

export default async function InstrumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const instrument = await prisma.instrument.findUnique({
    where: { id },
    include: {
      spv: { select: { id: true, legalName: true } },
      subscriptions: {
        include: { investor: { select: { legalName: true } } },
        orderBy: { subscribedAt: "desc" },
      },
      distributions: {
        orderBy: { periodStart: "desc" },
        include: { _count: { select: { lines: true } } },
      },
    },
  });

  if (!instrument) notFound();

  const totalFunded = instrument.subscriptions
    .filter((s) => s.status === "FUNDED")
    .reduce((sum, s) => sum + s.amountCents, 0);
  const subscriberCount = instrument.subscriptions.filter(
    (s) => s.status === "FUNDED"
  ).length;
  const totalDistributed = instrument.distributions.reduce(
    (sum, d) => sum + d.netDistributableCents,
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/instruments" className="hover:text-rails-text">
          Instruments
        </Link>
        <span>/</span>
        <span className="text-rails-text">{instrument.name}</span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-rails-text">{instrument.name}</h1>
          <ModelIdentityBadge
            genomeId={instrument.genomeId}
            genomeVersion={instrument.genomeVersion}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-rails-text-dim">
          <Link
            href={`/nil33/issuers/${instrument.spv.id}`}
            className="hover:text-rails-green"
          >
            SPV: {instrument.spv.legalName}
          </Link>
          <span>{instrument.instrumentType}</span>
          <span
            className={`badge ${
              instrument.status === "OPEN" || instrument.status === "ACTIVE"
                ? "badge-green"
                : instrument.status === "DRAFT"
                ? "badge-muted"
                : "badge-yellow"
            }`}
          >
            {instrument.status}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Offering Size",
            value: formatCents(instrument.totalIssuanceAmtCents),
            color: "text-rails-green",
          },
          {
            label: "Total Funded",
            value: formatCents(totalFunded),
            color: "text-rails-cyan",
          },
          {
            label: "Participation Rate",
            value: formatBps(instrument.participationRateBps),
            color: "text-rails-gold",
          },
          {
            label: "Subscribers",
            value: subscriberCount.toString(),
            color: "text-rails-text",
          },
          {
            label: "Total Distributed",
            value: formatCents(totalDistributed),
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

      {/* Instrument details */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
          {(
            [
              ["CUSIP", instrument.cusip ?? "—"],
              ["ISIN", instrument.isin ?? "—"],
              ["Min Subscription", formatCents(instrument.minSubscriptionCents)],
              ["Holding Period", `${instrument.holdingPeriodDays}d`],
              ["Hurdle", `${instrument.hurdle} bps`],
              [
                "Capped Return",
                instrument.cappedReturnBps != null
                  ? formatBps(instrument.cappedReturnBps)
                  : "Uncapped",
              ],
              ["Risk Rating", instrument.riskRating ?? "—"],
              ["Offering Opens", formatDate(instrument.offeringOpenAt)],
              ["Offering Closes", formatDate(instrument.offeringCloseAt)],
              ["Maturity", formatDate(instrument.maturityDate)],
              ["Created", formatDate(instrument.createdAt)],
              ["Updated", formatDate(instrument.updatedAt)],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-rails-text-dim">{k}</dt>
              <dd className="mt-0.5 font-medium text-rails-text font-mono">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Subscriptions */}
      <div className="card overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-rails-text">
            Subscriptions ({instrument.subscriptions.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-2 font-medium">Investor</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Subscribed</th>
              <th className="px-4 py-2 font-medium">Funded</th>
            </tr>
          </thead>
          <tbody>
            {instrument.subscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-surface-border/50 table-row-hover"
              >
                <td className="px-4 py-2 text-rails-text">
                  <Link
                    href={`/nil33/investors/${sub.investorId}`}
                    className="hover:text-rails-green"
                  >
                    {sub.investor.legalName}
                  </Link>
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
            {instrument.subscriptions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-rails-text-dim"
                >
                  No subscriptions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Distributions */}
      <div className="card overflow-hidden p-0">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-rails-text">
            Distributions ({instrument.distributions.length})
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted/40 text-left text-xs text-rails-text-dim">
              <th className="px-4 py-2 font-medium">Period</th>
              <th className="px-4 py-2 font-medium">Gross</th>
              <th className="px-4 py-2 font-medium">Net Distributable</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Lines</th>
              <th className="px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {instrument.distributions.map((dist) => (
              <tr
                key={dist.id}
                className="border-b border-surface-border/50 table-row-hover"
              >
                <td className="px-4 py-2 text-rails-text">
                  <Link
                    href={`/nil33/distributions/${dist.id}`}
                    className="hover:text-rails-green"
                  >
                    {formatDate(dist.periodStart)} – {formatDate(dist.periodEnd)}
                  </Link>
                </td>
                <td className="px-4 py-2 font-mono text-rails-text-dim">
                  {formatCents(dist.grossRevenueCents)}
                </td>
                <td className="px-4 py-2 font-mono text-rails-green">
                  {formatCents(dist.netDistributableCents)}
                </td>
                <td className="px-4 py-2">
                  <span className="badge badge-muted">{dist.status}</span>
                </td>
                <td className="px-4 py-2 font-mono text-rails-text-dim">
                  {dist._count.lines}
                </td>
                <td className="px-4 py-2 text-rails-text-dim">
                  {formatDate(dist.createdAt)}
                </td>
              </tr>
            ))}
            {instrument.distributions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-rails-text-dim"
                >
                  No distributions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
