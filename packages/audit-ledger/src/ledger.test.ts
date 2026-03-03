import { describe, it, expect } from "vitest";
import { buildLedgerEvent, hashSnapshot, verifySnapshotHash } from "../src/ledger";

describe("buildLedgerEvent", () => {
  it("builds a complete event with hashes", () => {
    const before = { status: "draft", name: "Test SPV" };
    const after = { status: "active", name: "Test SPV" };

    const event = buildLedgerEvent({
      correlationId: "corr-001",
      actor: "user",
      actorId: "user-001",
      action: "spv.activated",
      entityType: "SPV",
      entityId: "spv-001",
      snapshotBefore: before,
      snapshotAfter: after,
      meta: { ip: "127.0.0.1" },
    });

    expect(event.action).toBe("spv.activated");
    expect(event.entityType).toBe("SPV");
    expect(event.beforeHash).not.toBeNull();
    expect(event.afterHash).not.toBeNull();
    expect(event.beforeHash).not.toBe(event.afterHash);
    expect(event.meta).toEqual({ ip: "127.0.0.1" });
  });

  it("sets null hashes when snapshots are undefined", () => {
    const event = buildLedgerEvent({
      correlationId: "corr-002",
      actor: "system",
      actorId: "system",
      action: "spv.created",
      entityType: "SPV",
      entityId: "spv-002",
    });

    expect(event.beforeHash).toBeNull();
    expect(event.snapshotBefore).toBeNull();
  });
});

describe("hashSnapshot", () => {
  it("produces the same hash for identical objects regardless of key order", () => {
    const a = { z: 1, a: 2 };
    const b = { a: 2, z: 1 };
    expect(hashSnapshot(a)).toBe(hashSnapshot(b));
  });

  it("returns null for null input", () => {
    expect(hashSnapshot(null)).toBeNull();
  });
});

describe("verifySnapshotHash", () => {
  it("verifies a correct snapshot", () => {
    const snapshot = { status: "active", amount: 1000 };
    const hash = hashSnapshot(snapshot);
    expect(verifySnapshotHash(snapshot, hash)).toBe(true);
  });

  it("fails on tampered snapshot", () => {
    const original = { status: "active", amount: 1000 };
    const hash = hashSnapshot(original);
    const tampered = { status: "active", amount: 9999 };
    expect(verifySnapshotHash(tampered, hash)).toBe(false);
  });

  it("passes null-null check", () => {
    expect(verifySnapshotHash(null, null)).toBe(true);
  });
});
