// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 2 — Policy Ruleset (Versioned, Hash-Anchored)
// ═══════════════════════════════════════════════════════════════════
//
// A PolicyRuleset is immutable once published.
// Every version is hash-anchored and signed.
// Governance upgrades require multisig (Phase 2).
//
// Ruleset versioning follows semver.
// Each ruleset produces a deterministic version hash from its fields.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::credentials::CredentialType;

/// A versioned, hash-anchored policy ruleset.
///
/// Once published, a ruleset is immutable. New versions supersede old.
/// All evaluations reference the exact ruleset version hash.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyRuleset {
    /// Semantic version string (e.g., "1.0.0").
    pub version: String,
    /// Credential types required for any transfer under this ruleset.
    pub required_credentials: Vec<CredentialType>,
    /// Maximum single transaction in cents. None = unlimited.
    pub max_transaction_cents: Option<i64>,
    /// Allowed asset classes. Empty = all allowed.
    pub allowed_asset_classes: Vec<String>,
}

impl PolicyRuleset {
    /// Compute a deterministic version hash from the ruleset's canonical fields.
    ///
    /// Hash = SHA-256(version || sorted_required_creds || max_tx || sorted_asset_classes)
    pub fn version_hash(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(self.version.as_bytes());
        hasher.update(b"|");

        // Sort credential types for determinism
        let mut sorted_creds: Vec<String> = self
            .required_credentials
            .iter()
            .map(|c| format!("{:?}", c))
            .collect();
        sorted_creds.sort();
        for cred in &sorted_creds {
            hasher.update(cred.as_bytes());
            hasher.update(b",");
        }
        hasher.update(b"|");

        match self.max_transaction_cents {
            Some(v) => hasher.update(v.to_le_bytes()),
            None => hasher.update(b"NONE"),
        }
        hasher.update(b"|");

        let mut sorted_classes = self.allowed_asset_classes.clone();
        sorted_classes.sort();
        for class in &sorted_classes {
            hasher.update(class.as_bytes());
            hasher.update(b",");
        }

        hex::encode(hasher.finalize())
    }
}

/// Metadata for a published ruleset version.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RulesetVersion {
    /// Fully computed version hash.
    pub hash: String,
    /// Semantic version.
    pub version: String,
    /// Who published this version (DID string).
    pub publisher_did: String,
    /// ISO 8601 timestamp of publication.
    pub published_at: String,
    /// Optional human-readable change description.
    pub changelog: String,
}

/// Registry of published ruleset versions.
///
/// The latest version is always the active one.
/// All previous versions are retained for audit replay.
pub struct RulesetRegistry {
    versions: Vec<RulesetVersion>,
    rulesets: Vec<PolicyRuleset>,
}

impl RulesetRegistry {
    pub fn new() -> Self {
        Self {
            versions: Vec::new(),
            rulesets: Vec::new(),
        }
    }

    /// Publish a new ruleset version.
    ///
    /// Returns the version hash on success.
    pub fn publish(
        &mut self,
        ruleset: PolicyRuleset,
        publisher_did: String,
        changelog: String,
    ) -> String {
        let hash = ruleset.version_hash();

        let version_meta = RulesetVersion {
            hash: hash.clone(),
            version: ruleset.version.clone(),
            publisher_did,
            published_at: chrono::Utc::now().to_rfc3339(),
            changelog,
        };

        self.versions.push(version_meta);
        self.rulesets.push(ruleset);

        hash
    }

    /// Get the currently active (latest) ruleset.
    pub fn active(&self) -> Option<&PolicyRuleset> {
        self.rulesets.last()
    }

    /// Get a ruleset by its version hash.
    pub fn by_hash(&self, hash: &str) -> Option<&PolicyRuleset> {
        self.rulesets
            .iter()
            .find(|r| r.version_hash() == hash)
    }

    /// Get the version history.
    pub fn history(&self) -> &[RulesetVersion] {
        &self.versions
    }

    /// Number of published versions.
    pub fn version_count(&self) -> usize {
        self.versions.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version_hash_deterministic() {
        let r1 = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified],
            max_transaction_cents: Some(100_000_00),
            allowed_asset_classes: vec!["equity".into(), "debt".into()],
        };
        let r2 = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified],
            max_transaction_cents: Some(100_000_00),
            allowed_asset_classes: vec!["equity".into(), "debt".into()],
        };
        assert_eq!(r1.version_hash(), r2.version_hash());
    }

    #[test]
    fn test_different_version_different_hash() {
        let r1 = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified],
            max_transaction_cents: Some(100_000_00),
            allowed_asset_classes: vec![],
        };
        let r2 = PolicyRuleset {
            version: "2.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified],
            max_transaction_cents: Some(100_000_00),
            allowed_asset_classes: vec![],
        };
        assert_ne!(r1.version_hash(), r2.version_hash());
    }

    #[test]
    fn test_asset_class_order_independent() {
        let r1 = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![],
            max_transaction_cents: None,
            allowed_asset_classes: vec!["equity".into(), "debt".into()],
        };
        let r2 = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![],
            max_transaction_cents: None,
            allowed_asset_classes: vec!["debt".into(), "equity".into()],
        };
        assert_eq!(r1.version_hash(), r2.version_hash(), "Order of asset classes must not affect hash");
    }

    #[test]
    fn test_registry_publish_and_retrieve() {
        let mut registry = RulesetRegistry::new();

        let r1 = PolicyRuleset {
            version: "1.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified],
            max_transaction_cents: Some(1_000_000_00),
            allowed_asset_classes: vec![],
        };

        let hash = registry.publish(r1, "scos:did:publisher".into(), "Initial release".into());
        assert_eq!(registry.version_count(), 1);
        assert!(registry.by_hash(&hash).is_some());

        let r2 = PolicyRuleset {
            version: "2.0.0".into(),
            required_credentials: vec![CredentialType::KycVerified, CredentialType::AccreditedInvestor],
            max_transaction_cents: Some(10_000_000_00),
            allowed_asset_classes: vec!["equity".into()],
        };

        let hash2 = registry.publish(r2, "scos:did:publisher".into(), "Add accredited investor requirement".into());
        assert_eq!(registry.version_count(), 2);
        assert_ne!(hash, hash2);

        // Active is always the latest
        let active = registry.active().unwrap();
        assert_eq!(active.version, "2.0.0");

        // Old version still retrievable
        assert!(registry.by_hash(&hash).is_some());
    }
}
