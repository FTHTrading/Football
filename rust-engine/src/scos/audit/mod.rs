// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 5 — Cryptographic Audit
// ═══════════════════════════════════════════════════════════════════
//
// Every SCOS action produces an AuditRecord.
// Records are Merkle-anchored and exportable to regulators.
//
// Key properties:
// - Append-only
// - SHA-256 content hash per record
// - Merkle root computed over batches
// - Regulator export with selective disclosure

pub mod record;
pub mod merkle;
pub mod regulator;

pub use record::{AuditRecord, AuditEventType};
pub use merkle::AuditMerkleTree;
pub use regulator::RegulatorExport;
