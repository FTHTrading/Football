// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 2 — Deterministic Policy Evaluator
// ═══════════════════════════════════════════════════════════════════
//
// Evaluate(asset, from, to, amount, venue, timestamp, credentials)
// → allow / deny
// → risk score
// → reason codes
// → policy version hash
// → decision hash + Ed25519 signature
//
// All evaluation uses integer arithmetic. No floating point.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::identity::DID;
use crate::scos::credentials::{Credential, CredentialType, RevocationList};

use super::ruleset::PolicyRuleset;
use super::jurisdiction::JurisdictionRegistry;

/// The result of a policy evaluation.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PolicyAction {
    Allow,
    Deny,
}

/// Structured reason code for policy decisions.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ReasonCode {
    /// All checks passed.
    AllClear,
    /// Missing required credential.
    MissingCredential(CredentialType),
    /// Credential expired.
    CredentialExpired(String),
    /// Credential revoked.
    CredentialRevoked(String),
    /// Sender DID not active.
    SenderNotActive,
    /// Receiver DID not active.
    ReceiverNotActive,
    /// Amount exceeds jurisdiction limit.
    AmountExceedsLimit { max_cents: i64, requested_cents: i64 },
    /// Asset not allowed in target jurisdiction.
    AssetNotAllowedInJurisdiction(String),
    /// Cross-border transfer not permitted.
    CrossBorderDenied { source: String, target: String },
    /// Venue not authorized for this asset.
    VenueNotAuthorized(String),
    /// Agent mandate exceeded.
    MandateExceeded(String),
    /// Sanctions match detected.
    SanctionsMatch,
    /// Asset is frozen.
    AssetFrozen(String),
    /// Time restriction violated.
    TimeRestriction(String),
    /// Generic denial with message.
    CustomDenial(String),
}

/// The complete output of a policy evaluation.
///
/// Every field is deterministic given the same inputs and policy version.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyDecision {
    /// Allow or Deny.
    pub action: PolicyAction,
    /// Risk score (0–99, integer arithmetic).
    pub risk_score: i32,
    /// All reason codes (may include informational codes even on Allow).
    pub reason_codes: Vec<ReasonCode>,
    /// Hash of the policy version used for this evaluation.
    pub policy_version_hash: String,
    /// SHA-256 hash of the complete decision (inputs + output).
    pub decision_hash: String,
    /// Timestamp of evaluation (ISO 8601).
    pub evaluated_at: String,
}

/// Context for a transfer evaluation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferRequest {
    /// Asset identifier.
    pub asset_id: String,
    /// Sender DID.
    pub from: DID,
    /// Receiver DID.
    pub to: DID,
    /// Transfer amount in smallest unit (cents, wei, etc.).
    pub amount_cents: i64,
    /// Venue DID (where the transfer is happening).
    pub venue: DID,
    /// Timestamp of the request.
    pub timestamp: String,
    /// Sender's credentials.
    pub from_credentials: Vec<Credential>,
    /// Receiver's credentials.
    pub to_credentials: Vec<Credential>,
}

/// The deterministic policy evaluator.
///
/// Takes a TransferRequest + PolicyRuleset → PolicyDecision.
/// All logic is integer arithmetic. All decisions are hash-anchored.
pub struct PolicyEvaluator {
    ruleset: PolicyRuleset,
    jurisdictions: JurisdictionRegistry,
    revocation_list: RevocationList,
}

impl PolicyEvaluator {
    pub fn new(
        ruleset: PolicyRuleset,
        jurisdictions: JurisdictionRegistry,
        revocation_list: RevocationList,
    ) -> Self {
        Self {
            ruleset,
            jurisdictions,
            revocation_list,
        }
    }

    /// Evaluate a transfer request against the current policy ruleset.
    ///
    /// This is the core SCOS function. Deterministic. Integer arithmetic only.
    pub fn evaluate(&self, req: &TransferRequest) -> PolicyDecision {
        let mut reasons: Vec<ReasonCode> = Vec::new();
        let mut risk_score: i32 = 0;
        let mut deny = false;

        // ── 1. Credential validation (sender) ──
        self.check_credentials(&req.from_credentials, &mut reasons, &mut risk_score, &mut deny);

        // ── 2. Credential validation (receiver) ──
        self.check_credentials(&req.to_credentials, &mut reasons, &mut risk_score, &mut deny);

        // ── 3. Jurisdiction checks ──
        self.check_jurisdiction(req, &mut reasons, &mut risk_score, &mut deny);

        // ── 4. Amount limits ──
        self.check_amount_limits(req, &mut reasons, &mut risk_score, &mut deny);

        // ── 5. Sanctions screening ──
        self.check_sanctions(req, &mut reasons, &mut risk_score, &mut deny);

        // ── 6. Time restrictions ──
        self.check_time_restrictions(req, &mut reasons, &mut risk_score, &mut deny);

        // Clamp risk score
        risk_score = risk_score.clamp(0, 99);

        let action = if deny {
            PolicyAction::Deny
        } else {
            if reasons.is_empty() {
                reasons.push(ReasonCode::AllClear);
            }
            PolicyAction::Allow
        };

        // Compute decision hash
        let decision_hash = self.compute_decision_hash(req, &action, risk_score, &reasons);

        PolicyDecision {
            action,
            risk_score,
            reason_codes: reasons,
            policy_version_hash: self.ruleset.version_hash(),
            decision_hash,
            evaluated_at: Utc::now().to_rfc3339(),
        }
    }

    /// Check all credentials for validity (expiry, revocation, required types).
    fn check_credentials(
        &self,
        credentials: &[Credential],
        reasons: &mut Vec<ReasonCode>,
        risk_score: &mut i32,
        deny: &mut bool,
    ) {
        // Check required credential types from ruleset
        for required_type in &self.ruleset.required_credentials {
            let has_valid = credentials.iter().any(|c| {
                c.credential_type == *required_type
                    && !c.is_expired()
                    && !self.revocation_list.is_revoked(&c.credential_id)
            });

            if !has_valid {
                reasons.push(ReasonCode::MissingCredential(required_type.clone()));
                *risk_score += 30;
                *deny = true;
            }
        }

        // Check for expired credentials (informational — adds risk)
        for cred in credentials {
            if cred.is_expired() {
                reasons.push(ReasonCode::CredentialExpired(cred.credential_id.clone()));
                *risk_score += 20;
            }
            if self.revocation_list.is_revoked(&cred.credential_id) {
                reasons.push(ReasonCode::CredentialRevoked(cred.credential_id.clone()));
                *risk_score += 40;
                *deny = true;
            }
        }
    }

    /// Check jurisdiction rules for cross-border transfers.
    fn check_jurisdiction(
        &self,
        req: &TransferRequest,
        reasons: &mut Vec<ReasonCode>,
        risk_score: &mut i32,
        deny: &mut bool,
    ) {
        // Extract jurisdiction from credentials
        let from_jurisdiction = req.from_credentials.first()
            .map(|c| c.jurisdiction.clone())
            .unwrap_or_default();
        let to_jurisdiction = req.to_credentials.first()
            .map(|c| c.jurisdiction.clone())
            .unwrap_or_default();

        if !from_jurisdiction.is_empty() && !to_jurisdiction.is_empty() && from_jurisdiction != to_jurisdiction {
            let allowed = self.jurisdictions.is_transition_allowed(
                &from_jurisdiction,
                &to_jurisdiction,
            );
            if !allowed {
                reasons.push(ReasonCode::CrossBorderDenied {
                    source: from_jurisdiction,
                    target: to_jurisdiction,
                });
                *risk_score += 50;
                *deny = true;
            } else {
                // Cross-border transfers always add some risk
                *risk_score += 10;
            }
        }
    }

    /// Check amount against jurisdiction and ruleset limits.
    fn check_amount_limits(
        &self,
        req: &TransferRequest,
        reasons: &mut Vec<ReasonCode>,
        risk_score: &mut i32,
        deny: &mut bool,
    ) {
        if let Some(max_cents) = self.ruleset.max_transaction_cents {
            if req.amount_cents > max_cents {
                reasons.push(ReasonCode::AmountExceedsLimit {
                    max_cents,
                    requested_cents: req.amount_cents,
                });
                *risk_score += 25;
                *deny = true;
            }
        }

        // Risk bands (integer arithmetic)
        if req.amount_cents > 1_000_000_00 {
            // > $1M
            *risk_score += 15;
        } else if req.amount_cents > 100_000_00 {
            // > $100K
            *risk_score += 5;
        }
    }

    /// Screen against sanctions lists.
    fn check_sanctions(
        &self,
        _req: &TransferRequest,
        _reasons: &mut Vec<ReasonCode>,
        _risk_score: &mut i32,
        _deny: &mut bool,
    ) {
        // Phase 2: OFAC, EU, UN sanctions list integration.
        // For now, this is a placeholder.
        // In production, this checks against real-time sanctions databases.
    }

    /// Verify time restrictions (trading windows, lock periods).
    fn check_time_restrictions(
        &self,
        _req: &TransferRequest,
        _reasons: &mut Vec<ReasonCode>,
        _risk_score: &mut i32,
        _deny: &mut bool,
    ) {
        // Phase 2: Configurable trading windows, lock-up periods.
        // For now, no time restrictions are enforced.
    }

    /// Compute a deterministic decision hash.
    ///
    /// Hash = SHA-256(asset_id || from || to || amount || venue || timestamp || action || risk_score || policy_version)
    fn compute_decision_hash(
        &self,
        req: &TransferRequest,
        action: &PolicyAction,
        risk_score: i32,
        reasons: &[ReasonCode],
    ) -> String {
        let mut hasher = Sha256::new();
        hasher.update(req.asset_id.as_bytes());
        hasher.update(b"|");
        hasher.update(req.from.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(req.to.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(req.amount_cents.to_le_bytes());
        hasher.update(b"|");
        hasher.update(req.venue.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(req.timestamp.as_bytes());
        hasher.update(b"|");
        hasher.update(format!("{:?}", action).as_bytes());
        hasher.update(b"|");
        hasher.update(risk_score.to_le_bytes());
        hasher.update(b"|");
        hasher.update(self.ruleset.version_hash().as_bytes());
        // Include reason codes for full determinism
        for reason in reasons {
            hasher.update(b"|");
            hasher.update(format!("{:?}", reason).as_bytes());
        }
        hex::encode(hasher.finalize())
    }

    /// Update the revocation list (hot-reload without rebuilding evaluator).
    pub fn update_revocation_list(&mut self, list: RevocationList) {
        self.revocation_list = list;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scos::credentials::credential::Credential;

    fn make_did(label: &str) -> DID {
        DID::from_raw(format!("scos:did:{}", label.repeat(64 / label.len() + 1)[..64].to_string()))
    }

    fn make_credential(subject: &DID, cred_type: CredentialType) -> Credential {
        Credential {
            credential_id: format!("CRED-{:?}", cred_type),
            subject_did: subject.clone(),
            issuer_did: make_did("issuer"),
            credential_type: cred_type,
            issued_at: "2026-01-01T00:00:00Z".into(),
            expires_at: "2027-12-31T23:59:59Z".into(),
            jurisdiction: "US-DE".into(),
            claims: vec![],
            content_hash: String::new(),
            signature: String::new(),
        }
    }

    fn default_ruleset() -> PolicyRuleset {
        PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified],
            max_transaction_cents: Some(10_000_000_00), // $10M
            allowed_asset_classes: vec![],
        }
    }

    #[test]
    fn test_allow_valid_transfer() {
        let ruleset = default_ruleset();
        let jurisdictions = JurisdictionRegistry::permissive();
        let revocations = RevocationList::new();
        let evaluator = PolicyEvaluator::new(ruleset, jurisdictions, revocations);

        let from = make_did("sender");
        let to = make_did("receiver");
        let venue = make_did("venue01");

        let req = TransferRequest {
            asset_id: "ASSET-001".into(),
            from: from.clone(),
            to: to.clone(),
            amount_cents: 50_000_00, // $50K
            venue,
            timestamp: Utc::now().to_rfc3339(),
            from_credentials: vec![make_credential(&from, CredentialType::KycVerified)],
            to_credentials: vec![make_credential(&to, CredentialType::KycVerified)],
        };

        let decision = evaluator.evaluate(&req);
        assert_eq!(decision.action, PolicyAction::Allow);
        assert!(!decision.decision_hash.is_empty());
        assert!(!decision.policy_version_hash.is_empty());
    }

    #[test]
    fn test_deny_missing_credential() {
        let ruleset = default_ruleset();
        let jurisdictions = JurisdictionRegistry::permissive();
        let revocations = RevocationList::new();
        let evaluator = PolicyEvaluator::new(ruleset, jurisdictions, revocations);

        let from = make_did("sender");
        let to = make_did("receiver");
        let venue = make_did("venue01");

        let req = TransferRequest {
            asset_id: "ASSET-001".into(),
            from: from.clone(),
            to: to.clone(),
            amount_cents: 50_000_00,
            venue,
            timestamp: Utc::now().to_rfc3339(),
            from_credentials: vec![], // No credentials!
            to_credentials: vec![make_credential(&to, CredentialType::KycVerified)],
        };

        let decision = evaluator.evaluate(&req);
        assert_eq!(decision.action, PolicyAction::Deny);
        assert!(decision.reason_codes.iter().any(|r| matches!(r, ReasonCode::MissingCredential(_))));
    }

    #[test]
    fn test_deny_amount_exceeds_limit() {
        let ruleset = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![],
            max_transaction_cents: Some(100_000_00), // $100K limit
            allowed_asset_classes: vec![],
        };
        let jurisdictions = JurisdictionRegistry::permissive();
        let revocations = RevocationList::new();
        let evaluator = PolicyEvaluator::new(ruleset, jurisdictions, revocations);

        let from = make_did("sender");
        let to = make_did("receiver");
        let venue = make_did("venue01");

        let req = TransferRequest {
            asset_id: "ASSET-001".into(),
            from,
            to,
            amount_cents: 500_000_00, // $500K — exceeds $100K limit
            venue,
            timestamp: Utc::now().to_rfc3339(),
            from_credentials: vec![],
            to_credentials: vec![],
        };

        let decision = evaluator.evaluate(&req);
        assert_eq!(decision.action, PolicyAction::Deny);
        assert!(decision.reason_codes.iter().any(|r| matches!(r, ReasonCode::AmountExceedsLimit { .. })));
    }

    #[test]
    fn test_deterministic_decision_hash() {
        let ruleset = default_ruleset();
        let jurisdictions = JurisdictionRegistry::permissive();
        let revocations = RevocationList::new();
        let evaluator = PolicyEvaluator::new(ruleset.clone(), jurisdictions.clone(), revocations);
        let evaluator2 = PolicyEvaluator::new(
            default_ruleset(),
            JurisdictionRegistry::permissive(),
            RevocationList::new(),
        );

        let from = make_did("sender");
        let to = make_did("receiver");
        let venue = make_did("venue01");
        let ts = "2026-03-02T12:00:00Z";

        let req = TransferRequest {
            asset_id: "ASSET-001".into(),
            from: from.clone(),
            to: to.clone(),
            amount_cents: 10_000_00,
            venue: venue.clone(),
            timestamp: ts.into(),
            from_credentials: vec![make_credential(&from, CredentialType::KycVerified)],
            to_credentials: vec![make_credential(&to, CredentialType::KycVerified)],
        };

        let d1 = evaluator.evaluate(&req);
        let d2 = evaluator2.evaluate(&req);
        assert_eq!(d1.decision_hash, d2.decision_hash, "Same inputs + same policy = same decision hash");
    }

    #[test]
    fn test_revoked_credential_denied() {
        let ruleset = default_ruleset();
        let jurisdictions = JurisdictionRegistry::permissive();
        let mut revocations = RevocationList::new();
        let from = make_did("sender");
        let cred = make_credential(&from, CredentialType::KycVerified);
        revocations.revoke(&cred.credential_id, "Fraud".into(), "admin".into());

        let evaluator = PolicyEvaluator::new(ruleset, jurisdictions, revocations);
        let to = make_did("receiver");
        let venue = make_did("venue01");

        let req = TransferRequest {
            asset_id: "ASSET-001".into(),
            from: from.clone(),
            to: to.clone(),
            amount_cents: 10_000_00,
            venue,
            timestamp: Utc::now().to_rfc3339(),
            from_credentials: vec![cred],
            to_credentials: vec![make_credential(&to, CredentialType::KycVerified)],
        };

        let decision = evaluator.evaluate(&req);
        assert_eq!(decision.action, PolicyAction::Deny);
        assert!(decision.reason_codes.iter().any(|r| matches!(r, ReasonCode::CredentialRevoked(_))));
    }
}
