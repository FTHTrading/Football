// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — DID Registry
// ═══════════════════════════════════════════════════════════════════
//
// In-memory registry for development. Production uses PostgreSQL.
// Tracks active DIDs, revocations, and entity metadata.
// Revoked DIDs can never be re-registered.

use std::collections::HashMap;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use super::did::DID;
use super::entity::{EntityMetadata, EntityType};

/// Status of a DID in the registry.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum DIDStatus {
    /// Active and valid.
    Active,
    /// Revoked — cannot transact, cannot be re-registered.
    Revoked {
        revoked_at: String,
        reason: String,
    },
    /// Suspended — temporarily inactive, can be reactivated.
    Suspended {
        suspended_at: String,
        reason: String,
    },
}

/// A registered entity in the SCOS identity fabric.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegisteredEntity {
    pub did: DID,
    pub entity_type: EntityType,
    pub metadata: EntityMetadata,
    pub status: DIDStatus,
    pub public_key_hex: String,
    pub created_at: String,
}

/// The DID Registry — tracks all entities in the SCOS ecosystem.
///
/// In-memory implementation for Phase 1. Production will use
/// PostgreSQL with the existing `sqlx` infrastructure.
pub struct DIDRegistry {
    entities: HashMap<String, RegisteredEntity>,
    /// Revoked DID hashes — can never be re-registered.
    revoked_hashes: HashMap<String, String>,
}

impl DIDRegistry {
    pub fn new() -> Self {
        Self {
            entities: HashMap::new(),
            revoked_hashes: HashMap::new(),
        }
    }

    /// Register a new entity. Fails if DID already exists or hash was previously revoked.
    pub fn register(
        &mut self,
        did: DID,
        entity_type: EntityType,
        public_key_hex: String,
        metadata: EntityMetadata,
    ) -> Result<&RegisteredEntity, RegistryError> {
        let key = did.as_str().to_string();

        // Check if this DID hash was previously revoked
        if self.revoked_hashes.contains_key(did.hash()) {
            return Err(RegistryError::PreviouslyRevoked);
        }

        // Check for duplicate
        if self.entities.contains_key(&key) {
            return Err(RegistryError::AlreadyRegistered);
        }

        let entity = RegisteredEntity {
            did,
            entity_type,
            metadata,
            status: DIDStatus::Active,
            public_key_hex,
            created_at: Utc::now().to_rfc3339(),
        };

        self.entities.insert(key.clone(), entity);
        Ok(self.entities.get(&key).unwrap())
    }

    /// Look up an entity by DID.
    pub fn resolve(&self, did: &DID) -> Option<&RegisteredEntity> {
        self.entities.get(did.as_str())
    }

    /// Check if a DID is active (registered and not revoked/suspended).
    pub fn is_active(&self, did: &DID) -> bool {
        self.entities
            .get(did.as_str())
            .map(|e| matches!(e.status, DIDStatus::Active))
            .unwrap_or(false)
    }

    /// Revoke a DID. Permanently. Cannot be re-registered.
    pub fn revoke(&mut self, did: &DID, reason: String) -> Result<(), RegistryError> {
        let key = did.as_str().to_string();
        let entity = self.entities.get_mut(&key)
            .ok_or(RegistryError::NotFound)?;

        if matches!(entity.status, DIDStatus::Revoked { .. }) {
            return Err(RegistryError::AlreadyRevoked);
        }

        entity.status = DIDStatus::Revoked {
            revoked_at: Utc::now().to_rfc3339(),
            reason,
        };

        // Mark hash as permanently revoked
        self.revoked_hashes.insert(
            did.hash().to_string(),
            Utc::now().to_rfc3339(),
        );

        Ok(())
    }

    /// Suspend a DID temporarily.
    pub fn suspend(&mut self, did: &DID, reason: String) -> Result<(), RegistryError> {
        let key = did.as_str().to_string();
        let entity = self.entities.get_mut(&key)
            .ok_or(RegistryError::NotFound)?;

        match &entity.status {
            DIDStatus::Revoked { .. } => return Err(RegistryError::AlreadyRevoked),
            DIDStatus::Suspended { .. } => return Err(RegistryError::AlreadySuspended),
            DIDStatus::Active => {}
        }

        entity.status = DIDStatus::Suspended {
            suspended_at: Utc::now().to_rfc3339(),
            reason,
        };

        Ok(())
    }

    /// Reactivate a suspended DID.
    pub fn reactivate(&mut self, did: &DID) -> Result<(), RegistryError> {
        let key = did.as_str().to_string();
        let entity = self.entities.get_mut(&key)
            .ok_or(RegistryError::NotFound)?;

        match &entity.status {
            DIDStatus::Revoked { .. } => return Err(RegistryError::AlreadyRevoked),
            DIDStatus::Active => return Err(RegistryError::AlreadyActive),
            DIDStatus::Suspended { .. } => {}
        }

        entity.status = DIDStatus::Active;
        Ok(())
    }

    /// Total registered entities.
    pub fn count(&self) -> usize {
        self.entities.len()
    }

    /// Count of active entities.
    pub fn active_count(&self) -> usize {
        self.entities.values()
            .filter(|e| matches!(e.status, DIDStatus::Active))
            .count()
    }
}

impl Default for DIDRegistry {
    fn default() -> Self {
        Self::new()
    }
}

/// Registry operation errors.
#[derive(Debug, thiserror::Error)]
pub enum RegistryError {
    #[error("DID already registered")]
    AlreadyRegistered,
    #[error("DID not found in registry")]
    NotFound,
    #[error("DID already revoked — cannot modify")]
    AlreadyRevoked,
    #[error("DID already suspended")]
    AlreadySuspended,
    #[error("DID already active")]
    AlreadyActive,
    #[error("DID hash was previously revoked — cannot re-register")]
    PreviouslyRevoked,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scos::identity::did::DID;
    use crate::scos::identity::entity::{EntityMetadata, EntityType};
    use ed25519_dalek::SigningKey;
    use rand::rngs::OsRng;

    fn make_did(entity_type: EntityType, jurisdiction: &str) -> (DID, String) {
        let sk = SigningKey::generate(&mut OsRng);
        let vk = sk.verifying_key();
        let did = DID::derive(entity_type, &vk, jurisdiction);
        let pk_hex = hex::encode(vk.as_bytes());
        (did, pk_hex)
    }

    fn make_metadata(name: &str, jurisdiction: &str) -> EntityMetadata {
        EntityMetadata {
            name: name.to_string(),
            jurisdiction: jurisdiction.to_string(),
            classification: None,
            registered_at: Utc::now().to_rfc3339(),
            parent_did: None,
        }
    }

    #[test]
    fn test_register_and_resolve() {
        let mut reg = DIDRegistry::new();
        let (did, pk) = make_did(EntityType::Human, "US-TX");
        let meta = make_metadata("Test User", "US-TX");

        reg.register(did.clone(), EntityType::Human, pk, meta).unwrap();
        assert!(reg.is_active(&did));
        assert_eq!(reg.count(), 1);

        let resolved = reg.resolve(&did).unwrap();
        assert_eq!(resolved.entity_type, EntityType::Human);
    }

    #[test]
    fn test_duplicate_registration_fails() {
        let mut reg = DIDRegistry::new();
        let (did, pk) = make_did(EntityType::Institution, "US-DE");
        let meta = make_metadata("FTH Trading", "US-DE");

        reg.register(did.clone(), EntityType::Institution, pk.clone(), meta.clone()).unwrap();
        let err = reg.register(did, EntityType::Institution, pk, meta).unwrap_err();
        assert!(matches!(err, RegistryError::AlreadyRegistered));
    }

    #[test]
    fn test_revoke_prevents_reregistration() {
        let mut reg = DIDRegistry::new();
        let (did, pk) = make_did(EntityType::Venue, "SG");
        let meta = make_metadata("Singapore Venue", "SG");

        reg.register(did.clone(), EntityType::Venue, pk.clone(), meta.clone()).unwrap();
        reg.revoke(&did, "Compliance violation".into()).unwrap();

        assert!(!reg.is_active(&did));

        // New DID with same hash should fail
        let err = reg.register(did, EntityType::Venue, pk, meta).unwrap_err();
        assert!(matches!(err, RegistryError::PreviouslyRevoked));
    }

    #[test]
    fn test_suspend_and_reactivate() {
        let mut reg = DIDRegistry::new();
        let (did, pk) = make_did(EntityType::Agent, "US-CA");
        let meta = make_metadata("Treasury Bot", "US-CA");

        reg.register(did.clone(), EntityType::Agent, pk, meta).unwrap();
        assert!(reg.is_active(&did));

        reg.suspend(&did, "Under review".into()).unwrap();
        assert!(!reg.is_active(&did));

        reg.reactivate(&did).unwrap();
        assert!(reg.is_active(&did));
    }

    #[test]
    fn test_revoked_cannot_suspend() {
        let mut reg = DIDRegistry::new();
        let (did, pk) = make_did(EntityType::Human, "GB");
        let meta = make_metadata("UK User", "GB");

        reg.register(did.clone(), EntityType::Human, pk, meta).unwrap();
        reg.revoke(&did, "Fraud".into()).unwrap();

        let err = reg.suspend(&did, "N/A".into()).unwrap_err();
        assert!(matches!(err, RegistryError::AlreadyRevoked));
    }
}
