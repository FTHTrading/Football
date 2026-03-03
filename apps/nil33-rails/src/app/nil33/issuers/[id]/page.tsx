import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCents, formatDate, formatBps } from "@/lib/utils";
import Link from "next/link";

export default async function SpvDetailPage({ params }: { params: { id: string } }) {
  const spv = await prisma.spv.findUnique({
    where: { id: params.id },
    include: {
      athletes: { include: { nilContracts: { where: { status: "ACTIVE" } } } },
      instruments: {
        include: { _count: { select: { subscriptions: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!spv) notFound();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-rails-text-dim">
        <Link href="/nil33/issuers" className="hover:text-rails-text">Issuers</Link>
        <span>/</span>
        <span className="text-rails-text">{spv.legalName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rails-text">{spv.legalName}</h1>
          <div className="mt-2 flex gap-4 text-xs text-rails-text-dim">
            {spv.ein && <span>EIN: <span className="font-mono">{spv.ein}</span></span>}
            <span>{spv.jurisdiction} · {spv.formationType}</span>
            <span className="badge badge-green">{spv.status}</span>
          </div>
        </div>
      </div>

      {/* Two-column */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Instruments */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Instruments</h2>
          {spv.instruments.length === 0 ? (
            <p className="text-sm text-rails-text-dim">No instruments yet.</p>
          ) : (
            <ul className="space-y-3">
              {spv.instruments.map((ins) => (
                <li key={ins.id} className="rounded-lg border border-surface-border p-3">
                  <div className="flex justify-between">
                    <Link href={`/nil33/instruments`} className="font-medium text-rails-text hover:text-rails-green text-sm">
                      {ins.name}
                    </Link>
                    <span className="badge badge-cyan text-[10px]">{ins.status}</span>
                  </div>
                  <div className="mt-1 flex gap-4 text-xs text-rails-text-dim">
                    <span>{formatCents(ins.totalIssuanceAmtCents)} total</span>
                    <span>{formatBps(ins.participationRateBps)} participation</span>
                    <span>{ins._count.subscriptions} subscribers</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Athletes */}
        <div className="card">
          <h2 className="mb-4 text-sm font-semibold text-rails-text">Athletes</h2>
          {spv.athletes.length === 0 ? (
            <p className="text-sm text-rails-text-dim">No athletes yet.</p>
          ) : (
            <ul className="space-y-3">
              {spv.athletes.map((a) => (
                <li key={a.id} className="rounded-lg border border-surface-border p-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-rails-text text-sm">{a.displayName}</span>
                    <span className="badge badge-muted text-[10px]">{a.sport}</span>
                  </div>
                  <div className="mt-1 text-xs text-rails-text-dim">
                    {a.school} {a.position ? `· ${a.position}` : ""} · {a.nilContracts.length} active deals
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="card">
        <h2 className="mb-4 text-sm font-semibold text-rails-text">Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          {[
            ["Custodian", spv.custodianName ?? "—"],
            ["Registered Agent", spv.registeredAgentName ?? "—"],
            ["Bank Account", spv.bankAccountLast4 ? `****${spv.bankAccountLast4}` : "—"],
            ["Created", formatDate(spv.createdAt)],
            ["Updated", formatDate(spv.updatedAt)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-rails-text-dim">{k}</dt>
              <dd className="mt-0.5 font-medium text-rails-text">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
