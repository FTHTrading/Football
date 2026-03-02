// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 4 — Distribution Control (Venue Management)
// ═══════════════════════════════════════════════════════════════════
//
// Venues are the execution points: ATS, DEX, OTC desks, bulletin boards.
// The SCOS kernel does not choose the venue — it governs the venue.
//
// Every venue must implement the VenueAdapter interface.
// Every transfer produces a CompositeDecision:
//   ALLOW = Issuer Policy ∧ Network Policy ∧ Venue Policy

pub mod adapter;
pub mod composite;

pub use adapter::{VenueAdapter, VenueConfig, VenueType};
pub use composite::{CompositeDecision, CompositeGate};
