// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Identity & Authority Fabric
// ═══════════════════════════════════════════════════════════════════
//
// Every actor in SCOS has a deterministic identifier (DID).
// DIDs are derived from entity type + root public key + jurisdiction.
// Hardware-backed key anchoring. Chain-agnostic. Revocable but never reusable.

pub mod did;
pub mod entity;
pub mod registry;

pub use did::DID;
pub use entity::EntityType;
pub use registry::DIDRegistry;
