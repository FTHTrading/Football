// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 6 — Agent Executor
// ═══════════════════════════════════════════════════════════════════
//
// The AgentExecutor validates agent actions against mandates
// before forwarding to the policy evaluator.
//
// Flow:
//   Agent → Mandate Check → Policy Evaluator → Venue → Audit
//
// The executor never trusts the agent. Every action is:
//   1. Mandate-validated (scope, amount, operations, time, risk)
//   2. Policy-evaluated (full SCOS governance)
//   3. Audit-recorded

use serde::{Deserialize, Serialize};

use super::mandate::{MandateScope, MandateToken, RiskLevel};
use crate::scos::identity::DID;

/// Result of a mandate validation check.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum MandateCheckResult {
    /// Mandate is valid for this action.
    Approved,
    /// Mandate is invalid for this action.
    Denied(MandateDenialReason),
}

/// Why a mandate check failed.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum MandateDenialReason {
    /// Mandate expired or not yet active.
    Expired,
    /// Mandate has been revoked.
    Revoked,
    /// Operation count exhausted.
    OperationsExhausted,
    /// Amount exceeds per-operation limit.
    AmountExceedsLimit { max_cents: i64, requested_cents: i64 },
    /// Cumulative amount would exceed limit.
    CumulativeExceeded { max_cents: i64, total_cents: i64 },
    /// Scope not permitted.
    ScopeNotPermitted(MandateScope),
    /// Risk score exceeds mandate cap.
    RiskExceeded { max_score: i32, actual_score: i32 },
    /// No mandate found for this agent.
    NoMandateFound,
}

/// The Agent Executor — validates mandates and orchestrates agent actions.
pub struct AgentExecutor {
    /// Active mandates indexed by agent DID.
    mandates: Vec<MandateToken>,
}

impl AgentExecutor {
    pub fn new() -> Self {
        Self {
            mandates: Vec::new(),
        }
    }

    /// Register a mandate.
    pub fn register_mandate(&mut self, mandate: MandateToken) {
        self.mandates.push(mandate);
    }

    /// Revoke a mandate by ID.
    pub fn revoke_mandate(&mut self, mandate_id: &str) -> bool {
        for mandate in &mut self.mandates {
            if mandate.mandate_id == mandate_id {
                mandate.revoke();
                return true;
            }
        }
        false
    }

    /// Get a mandate by ID (immutable ref).
    pub fn get_mandate(&self, mandate_id: &str) -> Option<&MandateToken> {
        self.mandates.iter().find(|m| m.mandate_id == mandate_id)
    }

    /// Validate whether an agent can perform an action under a specific mandate.
    ///
    /// Checks (in order):
    /// 1. Mandate exists
    /// 2. Mandate is valid (not expired, not revoked, not exhausted)
    /// 3. Scope is permitted
    /// 4. Amount is within per-operation limit
    /// 5. Cumulative amount is within limit
    /// 6. Risk score is within mandate cap
    pub fn validate_action(
        &self,
        agent_did: &DID,
        scope: &MandateScope,
        amount_cents: i64,
        risk_score: i32,
        now: &str,
    ) -> MandateCheckResult {
        // Find an active mandate for this agent with the required scope
        let mandate = self.mandates.iter().find(|m| {
            m.agent_did == *agent_did && !m.revoked && m.has_scope(scope)
        });

        let mandate = match mandate {
            Some(m) => m,
            None => return MandateCheckResult::Denied(MandateDenialReason::NoMandateFound),
        };

        // Time validity
        if !mandate.is_valid(now) {
            if mandate.revoked {
                return MandateCheckResult::Denied(MandateDenialReason::Revoked);
            }
            if mandate.operations_used >= mandate.max_operations {
                return MandateCheckResult::Denied(MandateDenialReason::OperationsExhausted);
            }
            return MandateCheckResult::Denied(MandateDenialReason::Expired);
        }

        // Per-operation amount
        if !mandate.amount_within_limit(amount_cents) {
            return MandateCheckResult::Denied(MandateDenialReason::AmountExceedsLimit {
                max_cents: mandate.max_amount_cents,
                requested_cents: amount_cents,
            });
        }

        // Cumulative amount
        if !mandate.cumulative_within_limit(amount_cents) {
            return MandateCheckResult::Denied(MandateDenialReason::CumulativeExceeded {
                max_cents: mandate.max_cumulative_cents,
                total_cents: mandate.cumulative_used_cents + amount_cents,
            });
        }

        // Risk level
        if risk_score > mandate.risk_level.max_score() {
            return MandateCheckResult::Denied(MandateDenialReason::RiskExceeded {
                max_score: mandate.risk_level.max_score(),
                actual_score: risk_score,
            });
        }

        MandateCheckResult::Approved
    }

    /// Consume an operation on a mandate after successful validation + execution.
    pub fn consume(
        &mut self,
        agent_did: &DID,
        scope: &MandateScope,
        amount_cents: i64,
    ) -> bool {
        for mandate in &mut self.mandates {
            if mandate.agent_did == *agent_did && !mandate.revoked && mandate.has_scope(scope) {
                return mandate.consume_operation(amount_cents);
            }
        }
        false
    }

    /// Get all active mandates for an agent.
    pub fn mandates_for_agent(&self, agent_did: &DID) -> Vec<&MandateToken> {
        self.mandates
            .iter()
            .filter(|m| m.agent_did == *agent_did && !m.revoked)
            .collect()
    }

    /// Total registered mandates.
    pub fn mandate_count(&self) -> usize {
        self.mandates.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_did(label: &str) -> DID {
        DID::from_raw(format!("scos:did:{}", &label.repeat(65)[..64]))
    }

    fn make_mandate(agent: &DID) -> MandateToken {
        let principal = make_did("principal");
        let scopes = vec![MandateScope::Transfer, MandateScope::ReadOnly];

        let hash = MandateToken::compute_content_hash(
            "MND-001", &principal, agent, &scopes, 100_000_00, 10, &RiskLevel::Medium,
            "2026-01-01T00:00:00Z", "2026-12-31T23:59:59Z",
        );

        MandateToken {
            mandate_id: "MND-001".into(),
            principal_did: principal,
            agent_did: agent.clone(),
            scopes,
            max_amount_cents: 100_000_00,
            max_operations: 10,
            operations_used: 0,
            max_cumulative_cents: 500_000_00,
            cumulative_used_cents: 0,
            risk_level: RiskLevel::Medium,
            valid_from: "2026-01-01T00:00:00Z".into(),
            valid_until: "2026-12-31T23:59:59Z".into(),
            revoked: false,
            content_hash: hash,
        }
    }

    #[test]
    fn test_valid_action_approved() {
        let agent = make_did("agent001");
        let mut executor = AgentExecutor::new();
        executor.register_mandate(make_mandate(&agent));

        let result = executor.validate_action(
            &agent,
            &MandateScope::Transfer,
            50_000_00, // $50K
            15,        // Low-medium risk
            "2026-06-15T12:00:00Z",
        );
        assert_eq!(result, MandateCheckResult::Approved);
    }

    #[test]
    fn test_no_mandate_denied() {
        let agent = make_did("unknown");
        let executor = AgentExecutor::new();

        let result = executor.validate_action(
            &agent,
            &MandateScope::Transfer,
            50_000_00,
            5,
            "2026-06-15T12:00:00Z",
        );
        assert_eq!(result, MandateCheckResult::Denied(MandateDenialReason::NoMandateFound));
    }

    #[test]
    fn test_scope_not_permitted() {
        let agent = make_did("agent001");
        let mut executor = AgentExecutor::new();
        executor.register_mandate(make_mandate(&agent));

        let result = executor.validate_action(
            &agent,
            &MandateScope::Order, // Not in mandate scopes
            50_000_00,
            5,
            "2026-06-15T12:00:00Z",
        );
        assert_eq!(result, MandateCheckResult::Denied(MandateDenialReason::NoMandateFound));
    }

    #[test]
    fn test_amount_exceeds_limit() {
        let agent = make_did("agent001");
        let mut executor = AgentExecutor::new();
        executor.register_mandate(make_mandate(&agent));

        let result = executor.validate_action(
            &agent,
            &MandateScope::Transfer,
            200_000_00, // $200K exceeds $100K limit
            5,
            "2026-06-15T12:00:00Z",
        );
        assert!(matches!(result, MandateCheckResult::Denied(MandateDenialReason::AmountExceedsLimit { .. })));
    }

    #[test]
    fn test_risk_exceeded() {
        let agent = make_did("agent001");
        let mut executor = AgentExecutor::new();
        executor.register_mandate(make_mandate(&agent));

        let result = executor.validate_action(
            &agent,
            &MandateScope::Transfer,
            50_000_00,
            50, // Exceeds Medium cap (30)
            "2026-06-15T12:00:00Z",
        );
        assert!(matches!(result, MandateCheckResult::Denied(MandateDenialReason::RiskExceeded { .. })));
    }

    #[test]
    fn test_consume_and_exhaust() {
        let agent = make_did("agent001");
        let mut executor = AgentExecutor::new();
        executor.register_mandate(make_mandate(&agent)); // max_operations = 10

        for i in 0..10 {
            let consumed = executor.consume(&agent, &MandateScope::Transfer, 10_000_00);
            assert!(consumed, "Operation {} should succeed", i);
        }

        // 11th operation should fail
        let consumed = executor.consume(&agent, &MandateScope::Transfer, 10_000_00);
        assert!(!consumed, "Should be exhausted after 10 operations");
    }

    #[test]
    fn test_revoke_mandate() {
        let agent = make_did("agent001");
        let mut executor = AgentExecutor::new();
        executor.register_mandate(make_mandate(&agent));

        assert!(executor.revoke_mandate("MND-001"));

        let result = executor.validate_action(
            &agent, &MandateScope::Transfer, 50_000_00, 5, "2026-06-15T12:00:00Z",
        );
        assert_eq!(result, MandateCheckResult::Denied(MandateDenialReason::NoMandateFound));
    }
}
