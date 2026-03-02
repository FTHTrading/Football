// ═══════════════════════════════════════════════════════════════════
// SCOS — Sovereign Capital Operating System
// Governance kernel for programmable capital coordination
// ═══════════════════════════════════════════════════════════════════
//
// Layer 1: Identity & Authority Fabric
// Layer 2: Policy Compiler (Governance Kernel)
// Layer 3: Enforced Instrument Standard
// Layer 4: Distribution Control Plane (Venue Adapters)
// Layer 5: Continuous Audit & Regulatory Transparency
// Layer 6: Agentic Commerce Layer

pub mod identity;
pub mod credentials;
pub mod policy;
pub mod instrument;
pub mod venue;
pub mod audit;
pub mod agent;

/// SCOS version — all decisions embed this for reproducibility.
pub const SCOS_VERSION: &str = "0.1.0";

/// Re-export core types for ergonomic access.
pub use identity::{DID, EntityType};
pub use credentials::{Credential, CredentialType};
pub use policy::{PolicyDecision, PolicyAction, ReasonCode};
pub use instrument::{SCOSInstrument, AssetClass, FreezeDomain, FreezeState};
pub use venue::{VenueAdapter, CompositeDecision};
pub use audit::AuditRecord;
pub use agent::{MandateToken, RiskLevel};
