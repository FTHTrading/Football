import { hashSnapshot } from "@nil33/audit-ledger";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface AppendAuditOptions {
  action: string;
  entityType: string;
  entityId: string;
  actorId?: string | null;
  correlationId?: string | null;
  snapshotBefore?: Record<string, unknown> | null;
  snapshotAfter?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Build a LedgerEvent and persist via Prisma.
 * This is the single integration point between @nil33/audit-ledger and the DB.
 */
export async function appendAuditEvent(opts: AppendAuditOptions) {
  const beforeHash = opts.snapshotBefore
    ? hashSnapshot(opts.snapshotBefore)
    : null;
  const afterHash = opts.snapshotAfter
    ? hashSnapshot(opts.snapshotAfter)
    : null;

  const toJson = (v: unknown): Prisma.InputJsonValue | undefined =>
    v == null ? undefined : JSON.parse(JSON.stringify(v));

  return prisma.ledgerEvent.create({
    data: {
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId,
      actorId: opts.actorId ?? null,
      correlationId: opts.correlationId ?? null,
      snapshotBefore: toJson(opts.snapshotBefore),
      snapshotAfter: toJson(opts.snapshotAfter),
      beforeHash,
      afterHash,
      metadata: toJson(opts.metadata),
    },
  });
}
