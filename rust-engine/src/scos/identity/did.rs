// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Decentralized Identifier (DID)
// ═══════════════════════════════════════════════════════════════════
//
// DID = SHA-256(entity_type || root_public_key || jurisdiction)
//
// Properties:
// - Deterministic: same inputs always produce same DID
// - Chain-agnostic: no chain reference in the identifier
// - Permanently bound to entity type at creation
// - Revocable but never reusable (revoked DIDs cannot be re-registered)

use ed25519_dalek::VerifyingKey;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use super::entity::EntityType;

/// A Sovereign Capital OS decentralized identifier.
///
/// Format: `scos:did:<hex-encoded SHA-256 hash>`
///
/// The hash is derived from:
///   SHA-256(entity_type_tag || ":" || hex(public_key) || ":" || jurisdiction)
///
/// Once created, a DID is permanently bound to its entity type,
/// public key, and jurisdiction. Changing any of these requires
/// a new DID (and revocation of the old one).
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct DID(String);

impl DID {
    /// Derive a new DID from component parts.
    ///
    /// This is a pure function — same inputs always produce the same DID.
    /// Uses integer-safe SHA-256 hashing. No floating point.
    pub fn derive(
        entity_type: EntityType,
        public_key: &VerifyingKey,
        jurisdiction: &str,
    ) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(entity_type.canonical_tag().as_bytes());
        hasher.update(b":");
        hasher.update(hex::encode(public_key.as_bytes()).as_bytes());
        hasher.update(b":");
        hasher.update(jurisdiction.to_uppercase().as_bytes());
        let hash = hex::encode(hasher.finalize());
        DID(format!("scos:did:{hash}"))
    }

    /// Create a DID from a raw string (deserialization, database load).
    /// Does NOT validate the hash — use `validate()` for verification.
    pub fn from_raw(raw: String) -> Self {
        DID(raw)
    }

    /// Returns the full DID string including prefix.
    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// Returns just the hex hash portion (after "scos:did:").
    pub fn hash(&self) -> &str {
        self.0
            .strip_prefix("scos:did:")
            .unwrap_or(&self.0)
    }

    /// Validate that a DID matches expected component parts.
    /// Used for identity verification — re-derive and compare.
    pub fn validate(
        &self,
        entity_type: EntityType,
        public_key: &VerifyingKey,
        jurisdiction: &str,
    ) -> bool {
        let expected = Self::derive(entity_type, public_key, jurisdiction);
        self.0 == expected.0
    }

    /// Check if this is a well-formed SCOS DID (syntactic check only).
    pub fn is_well_formed(&self) -> bool {
        if let Some(hash) = self.0.strip_prefix("scos:did:") {
            hash.len() == 64 && hash.chars().all(|c| c.is_ascii_hexdigit())
        } else {
            false
        }
    }
}

impl std::fmt::Display for DID {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

impl AsRef<str> for DID {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ed25519_dalek::SigningKey;
    use rand::rngs::OsRng;

    fn test_keypair() -> (SigningKey, VerifyingKey) {
        let sk = SigningKey::generate(&mut OsRng);
        let vk = sk.verifying_key();
        (sk, vk)
    }

    #[test]
    fn test_deterministic_derivation() {
        let (_, vk) = test_keypair();
        let did1 = DID::derive(EntityType::Human, &vk, "US-DE");
        let did2 = DID::derive(EntityType::Human, &vk, "US-DE");
        assert_eq!(did1, did2, "Same inputs must produce same DID");
    }

    #[test]
    fn test_different_type_different_did() {
        let (_, vk) = test_keypair();
        let human = DID::derive(EntityType::Human, &vk, "US-DE");
        let agent = DID::derive(EntityType::Agent, &vk, "US-DE");
        assert_ne!(human, agent, "Different entity types must produce different DIDs");
    }

    #[test]
    fn test_different_jurisdiction_different_did() {
        let (_, vk) = test_keypair();
        let us = DID::derive(EntityType::Institution, &vk, "US-DE");
        let ch = DID::derive(EntityType::Institution, &vk, "CH-ZH");
        assert_ne!(us, ch, "Different jurisdictions must produce different DIDs");
    }

    #[test]
    fn test_validation() {
        let (_, vk) = test_keypair();
        let did = DID::derive(EntityType::Issuer, &vk, "US-NY");
        assert!(did.validate(EntityType::Issuer, &vk, "US-NY"));
        assert!(!did.validate(EntityType::Issuer, &vk, "US-CA"));
        assert!(!did.validate(EntityType::Human, &vk, "US-NY"));
    }

    #[test]
    fn test_well_formed() {
        let (_, vk) = test_keypair();
        let did = DID::derive(EntityType::Human, &vk, "US-TX");
        assert!(did.is_well_formed());
        assert!(!DID::from_raw("bad".into()).is_well_formed());
        assert!(!DID::from_raw("scos:did:tooshort".into()).is_well_formed());
    }

    #[test]
    fn test_case_insensitive_jurisdiction() {
        let (_, vk) = test_keypair();
        let lower = DID::derive(EntityType::Human, &vk, "us-de");
        let upper = DID::derive(EntityType::Human, &vk, "US-DE");
        assert_eq!(lower, upper, "Jurisdiction should be case-insensitive");
    }

    #[test]
    fn test_prefix_format() {
        let (_, vk) = test_keypair();
        let did = DID::derive(EntityType::Venue, &vk, "SG");
        assert!(did.as_str().starts_with("scos:did:"));
        assert_eq!(did.hash().len(), 64);
    }
}
