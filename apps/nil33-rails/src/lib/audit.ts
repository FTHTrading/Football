import { buildLedgerEvent, hashSnapshot } from "@nil33/audit-ledger";
import { prisma } from "@/lib/prisma";

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
 * Build a LedgerEvent from input, compute hashes, and persist via Prisma.
 * This is the single integration point between @nil33/audit-ledger and the DB.
 */
export async function appendAuditEvent(opts: AppendAuditOptions) {
  const event = buildLedgerEvent({
    action: opts.action,
    entityType: opts.entityType,
    entityId: opts.entityId,
    actorId: opts.actorId ?? undefined,
    correlationId: opts.correlationId ?? undefined,
    snapshotBefore: opts.snapshotBefore ?? undefined,
    snapshotAfter: opts.snapshotAfter ?? undefined,
    metadata: opts.metadata ?? undefined,
  });

  const beforeHash = opts.snapshotBefore
    ? hashSnapshot(opts.snapshotBefore)
    : null;
  const afterHash = opts.snapshotAfter
    ? hashSnapshot(opts.snapshotAfter)
    : null;

  return prisma.ledgerEvent.create({
    data: {
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      actorId: event.actorId ?? null,
      correlationId: event.correlationId ?? null,
      snapshotBefore: event.snapshotBefore ?? undefined,
      snapshotAfter: event.snapshotAfter ?? undefined,
      beforeHash,
      afterHash,
      metadata: opts.metadata ?? undefined,
    },
  });
}
