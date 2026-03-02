// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Credential Authority Framework
// ═══════════════════════════════════════════════════════════════════
//
// Credentials are signed attestations about an entity.
// Issued by authorized credential issuers (regulators, institutions, issuers).
// Ed25519 signed, timestamped, hash-anchored, revocable.

pub mod credential;
pub mod authority;
pub mod revocation;

pub use credential::{Credential, CredentialType, CredentialStatus};
pub use authority::CredentialAuthority;
pub use revocation::RevocationList;
