// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 3 — Enforced Instruments
// ═══════════════════════════════════════════════════════════════════
//
// Every instrument carries its rules WITH it.
// An SCOSInstrument is a self-enforcing asset standard.
//
// - Policy-aware: instruments know their jurisdictional constraints
// - Freezable: regulator-initiated freeze at multiple domains
// - Partitionable: instruments can be split into custody/ownership partitions

pub mod template;
pub mod partition;
pub mod freeze;

pub use template::{SCOSInstrument, AssetClass, InstrumentConfig};
pub use partition::{Partition, PartitionType, PartitionManager};
pub use freeze::{FreezeOrder, FreezeDomain, FreezeState, FreezeManager};
