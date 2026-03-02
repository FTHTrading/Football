// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 2 — Policy Compiler (Governance Kernel)
// ═══════════════════════════════════════════════════════════════════
//
// The core of SCOS. Compiles jurisdiction rules, offering restrictions,
// and risk parameters into deterministic evaluation functions.
//
// Properties:
// - Deterministic: same inputs always produce same output
// - Versioned: every ruleset has a semantic version and hash
// - Replayable: any historical decision can be reconstructed
// - Integer arithmetic only: no floating-point drift

pub mod evaluator;
pub mod ruleset;
pub mod jurisdiction;

pub use evaluator::{PolicyDecision, PolicyAction, ReasonCode, PolicyEvaluator};
pub use ruleset::{PolicyRuleset, RulesetVersion};
pub use jurisdiction::JurisdictionRegistry;
