// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 6 — Mandate Token
// ═══════════════════════════════════════════════════════════════════
//
// A MandateToken is a time-bounded, scope-limited, risk-capped
// permission grant from a principal (Human/Institution) to an Agent.
//
// Properties:
// - Scoped: what actions the agent can perform
// - Bounded: maximum amount, max trades, time window
// - Risk-capped: maximum risk score threshold
// - Revocable: principal can revoke at any time
// - Hash-anchored: mandate is content-hashed for audit

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::identity::DID;

/// Risk level cap for agent operations.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum RiskLevel {
    /// Risk score ≤ 10.
    Low,
    /// Risk score ≤ 30.
    Medium,
    /// Risk score ≤ 60.
    High,
    /// Risk score ≤ 99 (only for institutional mandates).
    Critical,
}

impl RiskLevel {
    /// Maximum risk score allowed at this level.
    pub fn max_score(&self) -> i32 {
        match self {
            RiskLevel::Low => 10,
            RiskLevel::Medium => 30,
            RiskLevel::High => 60,
            RiskLevel::Critical => 99,
        }
    }
}

/// What actions the mandate permits.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum MandateScope {
    /// Can execute transfers.
    Transfer,
    /// Can submit orders to venues.
    Order,
    /// Can query balances and positions.
    ReadOnly,
    /// Can rebalance a portfolio (transfer + order combined).
    Rebalance,
    /// Custom scope.
    Custom(String),
}

/// A time-bounded, scope-limited mandate token.
///
/// An agent may hold multiple mandates from different principals.
/// Each mandate is independently evaluated and revocable.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MandateToken {
    /// Unique mandate identifier.
    pub mandate_id: String,
    /// DID of the principal (grantor).
    pub principal_did: DID,
    /// DID of the agent (grantee).
    pub agent_did: DID,
    /// Permitted scopes.
    pub scopes: Vec<MandateScope>,
    /// Maximum amount per single operation (cents).
    pub max_amount_cents: i64,
    /// Maximum number of operations.
    pub max_operations: u32,
    /// Operations consumed so far.
    pub operations_used: u32,
    /// Maximum cumulative amount (cents). 0 = use max_amount_cents per op.
    pub max_cumulative_cents: i64,
    /// Cumulative amount consumed so far (cents).
    pub cumulative_used_cents: i64,
    /// Risk level cap.
    pub risk_level: RiskLevel,
    /// ISO 8601 start time.
    pub valid_from: String,
    /// ISO 8601 expiry time.
    pub valid_until: String,
    /// Whether this mandate has been revoked.
    pub revoked: bool,
    /// Content hash for audit anchoring.
    pub content_hash: String,
}

impl MandateToken {
    /// Compute content hash for a mandate.
    pub fn compute_content_hash(
        mandate_id: &str,
        principal_did: &DID,
        agent_did: &DID,
        scopes: &[MandateScope],
        max_amount_cents: i64,
        max_operations: u32,
        risk_level: &RiskLevel,
        valid_from: &str,
        valid_until: &str,
    ) -> String {
        let mut hasher = Sha256::new();
        hasher.update(mandate_id.as_bytes());
        hasher.update(b"|");
        hasher.update(principal_did.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(agent_did.as_str().as_bytes());
        hasher.update(b"|");
        let mut sorted_scopes: Vec<String> = scopes.iter().map(|s| format!("{:?}", s)).collect();
        sorted_scopes.sort();
        for scope in &sorted_scopes {
            hasher.update(scope.as_bytes());
            hasher.update(b",");
        }
        hasher.update(b"|");
        hasher.update(max_amount_cents.to_le_bytes());
        hasher.update(b"|");
        hasher.update(max_operations.to_le_bytes());
        hasher.update(b"|");
        hasher.update(format!("{:?}", risk_level).as_bytes());
        hasher.update(b"|");
        hasher.update(valid_from.as_bytes());
        hasher.update(b"|");
        hasher.update(valid_until.as_bytes());
        hex::encode(hasher.finalize())
    }

    /// Is this mandate currently valid (not expired, not revoked,
    /// not exhausted)?
    pub fn is_valid(&self, now: &str) -> bool {
        if self.revoked {
            return false;
        }
        if now < self.valid_from.as_str() || now > self.valid_until.as_str() {
            return false;
        }
        if self.operations_used >= self.max_operations {
            return false;
        }
        true
    }

    /// Check if a specific scope is permitted.
    pub fn has_scope(&self, scope: &MandateScope) -> bool {
        self.scopes.contains(scope)
    }

    /// Check if an amount is within the mandate's per-operation limit.
    pub fn amount_within_limit(&self, amount_cents: i64) -> bool {
        amount_cents <= self.max_amount_cents
    }

    /// Check if cumulative spend would remain within limit.
    pub fn cumulative_within_limit(&self, amount_cents: i64) -> bool {
        if self.max_cumulative_cents == 0 {
            return true; // No cumulative limit
        }
        self.cumulative_used_cents + amount_cents <= self.max_cumulative_cents
    }

    /// Record an operation against this mandate.
    ///
    /// Returns false if the mandate is exhausted.
    pub fn consume_operation(&mut self, amount_cents: i64) -> bool {
        if self.operations_used >= self.max_operations {
            return false;
        }
        self.operations_used += 1;
        self.cumulative_used_cents += amount_cents;
        true
    }

    /// Revoke this mandate.
    pub fn revoke(&mut self) {
        self.revoked = true;
    }

    /// Remaining operations.
    pub fn remaining_operations(&self) -> u32 {
        self.max_operations.saturating_sub(self.operations_used)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_did(label: &str) -> DID {
        DID::from_raw(format!("scos:did:{}", &label.repeat(65)[..64]))
    }

    fn make_mandate() -> MandateToken {
        let principal = make_did("principal");
        let agent = make_did("agent001");
        let scopes = vec![MandateScope::Transfer, MandateScope::ReadOnly];

        let hash = MandateToken::compute_content_hash(
            "MND-001",
            &principal,
            &agent,
            &scopes,
            100_000_00,
            100,
            &RiskLevel::Medium,
            "2026-01-01T00:00:00Z",
            "2026-12-31T23:59:59Z",
        );

        MandateToken {
            mandate_id: "MND-001".into(),
            principal_did: principal,
            agent_did: agent,
            scopes,
            max_amount_cents: 100_000_00,   // $100K per op
            max_operations: 100,
            operations_used: 0,
            max_cumulative_cents: 1_000_000_00, // $1M total
            cumulative_used_cents: 0,
            risk_level: RiskLevel::Medium,
            valid_from: "2026-01-01T00:00:00Z".into(),
            valid_until: "2026-12-31T23:59:59Z".into(),
            revoked: false,
            content_hash: hash,
        }
    }

    #[test]
    fn test_mandate_valid_within_window() {
        let mandate = make_mandate();
        assert!(mandate.is_valid("2026-06-15T12:00:00Z"));
    }

    #[test]
    fn test_mandate_expired() {
        let mandate = make_mandate();
        assert!(!mandate.is_valid("2027-01-01T00:00:00Z"));
    }

    #[test]
    fn test_mandate_not_yet_active() {
        let mandate = make_mandate();
        assert!(!mandate.is_valid("2025-12-31T23:59:59Z"));
    }

    #[test]
    fn test_mandate_revoked() {
        let mut mandate = make_mandate();
        mandate.revoke();
        assert!(!mandate.is_valid("2026-06-15T12:00:00Z"));
    }

    #[test]
    fn test_scope_check() {
        let mandate = make_mandate();
        assert!(mandate.has_scope(&MandateScope::Transfer));
        assert!(mandate.has_scope(&MandateScope::ReadOnly));
        assert!(!mandate.has_scope(&MandateScope::Order));
    }

    #[test]
    fn test_amount_limits() {
        let mandate = make_mandate();
        assert!(mandate.amount_within_limit(50_000_00)); // $50K < $100K
        assert!(!mandate.amount_within_limit(200_000_00)); // $200K > $100K
    }

    #[test]
    fn test_consume_operations() {
        let mut mandate = make_mandate();
        assert_eq!(mandate.remaining_operations(), 100);

        assert!(mandate.consume_operation(10_000_00));
        assert_eq!(mandate.remaining_operations(), 99);
        assert_eq!(mandate.cumulative_used_cents, 10_000_00);
    }

    #[test]
    fn test_cumulative_limit() {
        let mut mandate = make_mandate();
        // $1M cumulative limit
        assert!(mandate.cumulative_within_limit(500_000_00));
        mandate.cumulative_used_cents = 900_000_00;
        assert!(!mandate.cumulative_within_limit(200_000_00)); // Would exceed $1M
    }

    #[test]
    fn test_content_hash_deterministic() {
        let principal = make_did("principal");
        let agent = make_did("agent001");
        let scopes = vec![MandateScope::Transfer, MandateScope::ReadOnly];

        let h1 = MandateToken::compute_content_hash(
            "MND-001", &principal, &agent, &scopes, 100_000_00, 100, &RiskLevel::Medium,
            "2026-01-01T00:00:00Z", "2026-12-31T23:59:59Z",
        );
        let h2 = MandateToken::compute_content_hash(
            "MND-001", &principal, &agent, &scopes, 100_000_00, 100, &RiskLevel::Medium,
            "2026-01-01T00:00:00Z", "2026-12-31T23:59:59Z",
        );
        assert_eq!(h1, h2);
    }
}
