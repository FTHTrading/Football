// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Entity Types
// ═══════════════════════════════════════════════════════════════════

use serde::{Deserialize, Serialize};

/// Every actor in the SCOS ecosystem is one of these types.
/// Type is permanently bound to the DID at creation — cannot change.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EntityType {
    /// Natural person — KYC verified.
    Human,
    /// Corporate entity — KYB verified. Includes collectives, funds, trusts.
    Institution,
    /// Government regulatory body with enforcement authority.
    Regulator,
    /// Asset originator — creates instruments under SCOS standard.
    Issuer,
    /// Trading venue, lending market, or distribution channel.
    Venue,
    /// Autonomous software agent acting under signed mandate.
    Agent,
}

impl EntityType {
    /// Returns the canonical string used in DID derivation.
    /// Must be stable forever — changing this breaks all existing DIDs.
    pub fn canonical_tag(&self) -> &'static str {
        match self {
            EntityType::Human => "HUMAN",
            EntityType::Institution => "INSTITUTION",
            EntityType::Regulator => "REGULATOR",
            EntityType::Issuer => "ISSUER",
            EntityType::Venue => "VENUE",
            EntityType::Agent => "AGENT",
        }
    }

    /// Whether this entity type can issue credentials to other entities.
    pub fn can_issue_credentials(&self) -> bool {
        matches!(self, EntityType::Regulator | EntityType::Issuer | EntityType::Institution)
    }

    /// Whether this entity type can create instruments.
    pub fn can_create_instruments(&self) -> bool {
        matches!(self, EntityType::Issuer)
    }

    /// Whether this entity type requires a mandate to transact.
    pub fn requires_mandate(&self) -> bool {
        matches!(self, EntityType::Agent)
    }

    /// Whether this entity type can perform regulatory forced transfers.
    pub fn can_force_transfer(&self) -> bool {
        matches!(self, EntityType::Regulator)
    }
}

impl std::fmt::Display for EntityType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.canonical_tag())
    }
}

/// Metadata attached to an entity at registration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityMetadata {
    /// Human-readable name (legal name for institutions, display name for agents).
    pub name: String,
    /// Primary jurisdiction (ISO 3166-1 alpha-2 or compound: "US-DE", "CH-ZH").
    pub jurisdiction: String,
    /// Entity classification within its type (e.g., "broker-dealer", "collective", "treasury-bot").
    pub classification: Option<String>,
    /// Registration timestamp (ISO 8601).
    pub registered_at: String,
    /// Optional parent entity DID (for subsidiaries, sub-agents).
    pub parent_did: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_canonical_tags_are_stable() {
        assert_eq!(EntityType::Human.canonical_tag(), "HUMAN");
        assert_eq!(EntityType::Agent.canonical_tag(), "AGENT");
        assert_eq!(EntityType::Regulator.canonical_tag(), "REGULATOR");
    }

    #[test]
    fn test_permission_matrix() {
        assert!(EntityType::Regulator.can_issue_credentials());
        assert!(EntityType::Issuer.can_issue_credentials());
        assert!(!EntityType::Human.can_issue_credentials());
        assert!(!EntityType::Agent.can_issue_credentials());

        assert!(EntityType::Agent.requires_mandate());
        assert!(!EntityType::Human.requires_mandate());

        assert!(EntityType::Regulator.can_force_transfer());
        assert!(!EntityType::Issuer.can_force_transfer());
    }
}
