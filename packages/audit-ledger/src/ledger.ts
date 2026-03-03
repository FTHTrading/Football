import { createHash } from "crypto";
import type { LedgerEvent, LedgerActor } from "@nil33/core";

// ─── Input shape ──────────────────────────────────────────────────────────────

export interface AppendEventInput {
  correlationId: string;
  actor: LedgerActor;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  snapshotBefore?: unknown;
  snapshotAfter?: unknown;
  meta?: Record<string, unknown>;
}

// ─── Hashing ──────────────────────────────────────────────────────────────────

export function hashSnapshot(snapshot: unknown): string | null {
  if (snapshot === undefined || snapshot === null) return null;
  const json = JSON.stringify(snapshot, Object.keys(snapshot as object).sort());
  return createHash("sha256").update(json).digest("hex");
}

// ─── Ledger builder ───────────────────────────────────────────────────────────

/**
 * Builds an immutable LedgerEvent record.
 * Actual persistence is done by the caller (Prisma / DB layer).
 *
 * The audit ledger is append-only. Never delete or update ledger events.
 */
export function buildLedgerEvent(
  input: AppendEventInput
): Omit<LedgerEvent, "id"> {
  const beforeHash = hashSnapshot(input.snapshotBefore);
  const afterHash = hashSnapshot(input.snapshotAfter);

  return {
    correlationId: input.correlationId,
    actor: input.actor,
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    beforeHash,
    afterHash,
    snapshotBefore: input.snapshotBefore ?? null,
    snapshotAfter: input.snapshotAfter ?? null,
    meta: input.meta ?? {},
    createdAt: new Date(),
  };
}

/**
 * Verify that a stored snapshot matches its hash.
 * Used for audit integrity checks.
 */
export function verifySnapshotHash(
  snapshot: unknown,
  storedHash: string | null
): boolean {
  if (storedHash === null && snapshot === null) return true;
  const computed = hashSnapshot(snapshot);
  return computed === storedHash;
}
