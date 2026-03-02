// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Credential Types & Validation
// ═══════════════════════════════════════════════════════════════════

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::identity::DID;

/// Categories of credentials in the SCOS ecosystem.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CredentialType {
    /// KYC — Know Your Customer (natural person).
    KycVerified,
    /// KYB — Know Your Business (corporate entity).
    KybVerified,
    /// Accredited investor (SEC definition or equivalent).
    AccreditedInvestor,
    /// Qualified purchaser ($5M+ investable assets).
    QualifiedPurchaser,
    /// Jurisdiction claim — domicile attestation.
    JurisdictionClaim,
    /// Regulatory classification (broker-dealer, investment advisor, etc.).
    RegulatoryClassification,
    /// Agent mandate — scoped authorization for AI agents.
    AgentMandate,
    /// Sanctions clearance — passed OFAC/EU/UN screening.
    SanctionsClearance,
    /// AML verification — anti-money laundering check passed.
    AmlVerified,
    /// Custom credential type (extensible).
    Custom(String),
}

/// Credential status.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CredentialStatus {
    Valid,
    Expired,
    Revoked,
}

/// A signed attestation about an entity in the SCOS ecosystem.
///
/// Credentials are:
/// - Issued by authorized entities (regulators, institutions, issuers)
/// - Ed25519 signed by the issuer
/// - Time-bounded (issued_at → expires_at)
/// - Hash-anchored to the audit chain
/// - Independently revocable via RevocationList
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Credential {
    /// Unique credential identifier.
    pub credential_id: String,
    /// The entity this credential is about.
    pub subject_did: DID,
    /// The entity that issued this credential.
    pub issuer_did: DID,
    /// What kind of credential this is.
    pub credential_type: CredentialType,
    /// When this credential was issued (ISO 8601).
    pub issued_at: String,
    /// When this credential expires (ISO 8601).
    pub expires_at: String,
    /// Jurisdiction scope (ISO 3166-1 or compound).
    pub jurisdiction: String,
    /// Additional claims (key-value pairs specific to credential type).
    pub claims: Vec<(String, String)>,
    /// SHA-256 hash of the canonical credential content.
    pub content_hash: String,
    /// Ed25519 signature by the issuer over the content hash.
    pub signature: String,
}

impl Credential {
    /// Compute the canonical content hash for this credential.
    ///
    /// Hash = SHA-256(credential_id || subject_did || issuer_did || type || issued_at || expires_at || jurisdiction || sorted_claims)
    pub fn compute_content_hash(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(self.credential_id.as_bytes());
        hasher.update(b"|");
        hasher.update(self.subject_did.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(self.issuer_did.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(format!("{:?}", self.credential_type).as_bytes());
        hasher.update(b"|");
        hasher.update(self.issued_at.as_bytes());
        hasher.update(b"|");
        hasher.update(self.expires_at.as_bytes());
        hasher.update(b"|");
        hasher.update(self.jurisdiction.as_bytes());
        // Sort claims for deterministic hashing
        let mut sorted_claims = self.claims.clone();
        sorted_claims.sort_by(|a, b| a.0.cmp(&b.0));
        for (k, v) in &sorted_claims {
            hasher.update(b"|");
            hasher.update(k.as_bytes());
            hasher.update(b"=");
            hasher.update(v.as_bytes());
        }
        hex::encode(hasher.finalize())
    }

    /// Verify that the stored content hash matches the computed hash.
    pub fn verify_content_hash(&self) -> bool {
        self.content_hash == self.compute_content_hash()
    }

    /// Check if the credential is expired based on current time.
    pub fn is_expired(&self) -> bool {
        if let Ok(exp) = self.expires_at.parse::<DateTime<Utc>>() {
            Utc::now() > exp
        } else {
            true // Invalid expiry = treat as expired
        }
    }

    /// Get current status considering expiry (does NOT check revocation list).
    pub fn status(&self) -> CredentialStatus {
        if self.is_expired() {
            CredentialStatus::Expired
        } else {
            CredentialStatus::Valid
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_credential() -> Credential {
        Credential {
            credential_id: "CRED-001".into(),
            subject_did: DID::from_raw("scos:did:".to_string() + &"aa".repeat(32)),
            issuer_did: DID::from_raw("scos:did:".to_string() + &"bb".repeat(32)),
            credential_type: CredentialType::KycVerified,
            issued_at: "2026-01-01T00:00:00Z".into(),
            expires_at: "2027-01-01T00:00:00Z".into(),
            jurisdiction: "US-DE".into(),
            claims: vec![
                ("verification_level".into(), "enhanced".into()),
                ("provider".into(), "jumio".into()),
            ],
            content_hash: String::new(),
            signature: String::new(),
        }
    }

    #[test]
    fn test_deterministic_hash() {
        let cred = test_credential();
        let hash1 = cred.compute_content_hash();
        let hash2 = cred.compute_content_hash();
        assert_eq!(hash1, hash2);
        assert_eq!(hash1.len(), 64);
    }

    #[test]
    fn test_claim_order_independence() {
        let mut cred1 = test_credential();
        cred1.claims = vec![
            ("a".into(), "1".into()),
            ("b".into(), "2".into()),
        ];
        let mut cred2 = test_credential();
        cred2.claims = vec![
            ("b".into(), "2".into()),
            ("a".into(), "1".into()),
        ];
        assert_eq!(
            cred1.compute_content_hash(),
            cred2.compute_content_hash(),
            "Claim order should not affect hash"
        );
    }

    #[test]
    fn test_expiry_check() {
        let mut cred = test_credential();
        cred.expires_at = "2020-01-01T00:00:00Z".into();
        assert!(cred.is_expired());
        assert_eq!(cred.status(), CredentialStatus::Expired);
    }
}
