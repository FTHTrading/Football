// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 6 — Agentic Commerce
// ═══════════════════════════════════════════════════════════════════
//
// AI agents can execute on behalf of entities, but ONLY within
// the boundaries of a MandateToken.
//
// Agents are NOT trusted. They are permissioned.
// Every agent action is policy-evaluated, mandate-bounded, and audited.

pub mod mandate;
pub mod executor;

pub use mandate::{MandateToken, RiskLevel, MandateScope};
pub use executor::AgentExecutor;
