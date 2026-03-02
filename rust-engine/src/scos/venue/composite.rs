// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 4 — Composite Decision Engine
// ═══════════════════════════════════════════════════════════════════
//
// ALLOW = Issuer Policy ∧ Network Policy ∧ Venue Policy
//
// A transfer is only approved if ALL three gates agree.
// Each gate produces its own decision, and the composite merges them.
//
// This is the final enforcement checkpoint before a transfer executes.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::policy::PolicyDecision;
use super::adapter::VenueDecision;

/// The three gates that must all agree for a transfer to proceed.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompositeGate {
    /// Gate label ("ISSUER", "NETWORK", "VENUE").
    pub gate: String,
    /// Whether this gate approved.
    pub approved: bool,
    /// Reason string from this gate.
    pub reason: String,
}

/// The composite decision across all three governance layers.
///
/// ALLOW = Issuer ∧ Network ∧ Venue
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompositeDecision {
    /// Whether the transfer is ultimately approved.
    pub approved: bool,
    /// Individual gate decisions.
    pub gates: Vec<CompositeGate>,
    /// Hash of the composite decision for audit.
    pub decision_hash: String,
    /// ISO 8601 timestamp.
    pub decided_at: String,
}

impl CompositeDecision {
    /// Build a composite decision from the three governance gates.
    ///
    /// - `issuer_decision`: Policy decision from the instrument's issuer policy.
    /// - `network_decision`: Policy decision from the SCOS network policy.
    /// - `venue_decision`: Decision from the venue adapter.
    pub fn compose(
        issuer_decision: &PolicyDecision,
        network_decision: &PolicyDecision,
        venue_decision: &VenueDecision,
    ) -> Self {
        let issuer_gate = CompositeGate {
            gate: "ISSUER".into(),
            approved: issuer_decision.action == crate::scos::policy::PolicyAction::Allow,
            reason: format!("{:?}", issuer_decision.reason_codes),
        };

        let network_gate = CompositeGate {
            gate: "NETWORK".into(),
            approved: network_decision.action == crate::scos::policy::PolicyAction::Allow,
            reason: format!("{:?}", network_decision.reason_codes),
        };

        let venue_gate = CompositeGate {
            gate: "VENUE".into(),
            approved: venue_decision.approved,
            reason: venue_decision.reason.clone(),
        };

        let approved = issuer_gate.approved && network_gate.approved && venue_gate.approved;

        let gates = vec![issuer_gate, network_gate, venue_gate];

        // Compute composite decision hash
        let mut hasher = Sha256::new();
        for gate in &gates {
            hasher.update(gate.gate.as_bytes());
            hasher.update(b"|");
            hasher.update(if gate.approved { b"1" } else { b"0" });
            hasher.update(b"|");
            hasher.update(gate.reason.as_bytes());
            hasher.update(b"||");
        }
        hasher.update(issuer_decision.decision_hash.as_bytes());
        hasher.update(b"|");
        hasher.update(network_decision.decision_hash.as_bytes());
        let decision_hash = hex::encode(hasher.finalize());

        let decided_at = chrono::Utc::now().to_rfc3339();

        Self {
            approved,
            gates,
            decision_hash,
            decided_at,
        }
    }

    /// Count how many gates denied.
    pub fn denial_count(&self) -> usize {
        self.gates.iter().filter(|g| !g.approved).count()
    }

    /// Get all denying gate names.
    pub fn denying_gates(&self) -> Vec<&str> {
        self.gates
            .iter()
            .filter(|g| !g.approved)
            .map(|g| g.gate.as_str())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scos::policy::{PolicyAction, PolicyDecision, ReasonCode};

    fn allow_decision() -> PolicyDecision {
        PolicyDecision {
            action: PolicyAction::Allow,
            risk_score: 5,
            reason_codes: vec![ReasonCode::AllClear],
            policy_version_hash: "v1hash".into(),
            decision_hash: "abc123".into(),
            evaluated_at: "2026-01-01T00:00:00Z".into(),
        }
    }

    fn deny_decision() -> PolicyDecision {
        PolicyDecision {
            action: PolicyAction::Deny,
            risk_score: 80,
            reason_codes: vec![ReasonCode::SanctionsMatch],
            policy_version_hash: "v1hash".into(),
            decision_hash: "def456".into(),
            evaluated_at: "2026-01-01T00:00:00Z".into(),
        }
    }

    #[test]
    fn test_all_approve() {
        let composite = CompositeDecision::compose(
            &allow_decision(),
            &allow_decision(),
            &VenueDecision { approved: true, reason: "OK".into() },
        );
        assert!(composite.approved);
        assert_eq!(composite.denial_count(), 0);
    }

    #[test]
    fn test_one_deny_blocks() {
        let composite = CompositeDecision::compose(
            &allow_decision(),
            &deny_decision(), // Network denies
            &VenueDecision { approved: true, reason: "OK".into() },
        );
        assert!(!composite.approved);
        assert_eq!(composite.denial_count(), 1);
        assert_eq!(composite.denying_gates(), vec!["NETWORK"]);
    }

    #[test]
    fn test_all_deny() {
        let composite = CompositeDecision::compose(
            &deny_decision(),
            &deny_decision(),
            &VenueDecision { approved: false, reason: "Venue offline".into() },
        );
        assert!(!composite.approved);
        assert_eq!(composite.denial_count(), 3);
    }

    #[test]
    fn test_decision_hash_exists() {
        let composite = CompositeDecision::compose(
            &allow_decision(),
            &allow_decision(),
            &VenueDecision { approved: true, reason: "OK".into() },
        );
        assert!(!composite.decision_hash.is_empty());
        assert_eq!(composite.decision_hash.len(), 64); // SHA-256 hex
    }
}
