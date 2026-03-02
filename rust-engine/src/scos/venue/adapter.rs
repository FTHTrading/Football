// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 4 — Venue Adapter
// ═══════════════════════════════════════════════════════════════════
//
// A VenueAdapter normalizes different execution venues into the SCOS
// governance model. Every venue is a DID-bearing entity with its own
// policies, which must align with issuer and network policies.
//
// Phase 1: in-process adapters
// Phase 2: gRPC/REST adapter protocol for external venues

use serde::{Deserialize, Serialize};

use crate::scos::identity::DID;

/// Type of venue.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum VenueType {
    /// Alternative Trading System (SEC regulated).
    ATS,
    /// Decentralized exchange.
    DEX,
    /// Over-the-counter desk.
    OTC,
    /// Bulletin board / marketplace.
    BulletinBoard,
    /// Direct peer-to-peer (governed but decentralized).
    PeerToPeer,
    /// Custom venue type.
    Custom(String),
}

/// Configuration for a registered venue.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VenueConfig {
    /// Venue DID.
    pub venue_did: DID,
    /// Human-readable venue name.
    pub name: String,
    /// Venue classification.
    pub venue_type: VenueType,
    /// Jurisdictions this venue is licensed in.
    pub licensed_jurisdictions: Vec<String>,
    /// Whether this venue enforces its own KYC/AML.
    pub has_own_kyc: bool,
    /// Maximum trade size in cents. None = unlimited.
    pub max_trade_cents: Option<i64>,
    /// Supported asset classes. Empty = all.
    pub supported_asset_classes: Vec<String>,
    /// Whether this venue is currently active.
    pub active: bool,
}

impl VenueConfig {
    /// Check if this venue is licensed in a given jurisdiction.
    pub fn is_licensed_in(&self, jurisdiction: &str) -> bool {
        if self.licensed_jurisdictions.is_empty() {
            return false; // Must have at least one license
        }
        self.licensed_jurisdictions
            .iter()
            .any(|j| j.eq_ignore_ascii_case(jurisdiction))
    }

    /// Check if this venue supports a given asset class.
    pub fn supports_asset_class(&self, asset_class: &str) -> bool {
        if self.supported_asset_classes.is_empty() {
            return true; // Empty = all supported
        }
        self.supported_asset_classes
            .iter()
            .any(|c| c.eq_ignore_ascii_case(asset_class))
    }
}

/// The VenueAdapter trait — every venue must implement this.
///
/// Phase 1: In-process. Phase 2: gRPC/REST external protocol.
pub trait VenueAdapter: Send + Sync {
    /// Venue's DID.
    fn did(&self) -> &DID;

    /// Venue's name.
    fn name(&self) -> &str;

    /// Whether the venue approves this specific transfer.
    ///
    /// The venue may apply its own local rules (trading hours,
    /// minimum lot sizes, venue-specific compliance, etc.)
    fn approve_transfer(
        &self,
        asset_id: &str,
        from: &DID,
        to: &DID,
        amount_cents: i64,
    ) -> VenueDecision;

    /// Whether the venue is currently operational.
    fn is_operational(&self) -> bool;
}

/// Result of a venue-level transfer approval.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct VenueDecision {
    pub approved: bool,
    pub reason: String,
}

/// A basic in-process venue adapter backed by VenueConfig.
pub struct ConfigBasedVenue {
    config: VenueConfig,
}

impl ConfigBasedVenue {
    pub fn new(config: VenueConfig) -> Self {
        Self { config }
    }
}

impl VenueAdapter for ConfigBasedVenue {
    fn did(&self) -> &DID {
        &self.config.venue_did
    }

    fn name(&self) -> &str {
        &self.config.name
    }

    fn approve_transfer(
        &self,
        _asset_id: &str,
        _from: &DID,
        _to: &DID,
        amount_cents: i64,
    ) -> VenueDecision {
        if !self.config.active {
            return VenueDecision {
                approved: false,
                reason: "Venue is not active".into(),
            };
        }

        if let Some(max) = self.config.max_trade_cents {
            if amount_cents > max {
                return VenueDecision {
                    approved: false,
                    reason: format!("Amount {} exceeds venue max {}", amount_cents, max),
                };
            }
        }

        VenueDecision {
            approved: true,
            reason: "Venue-level checks passed".into(),
        }
    }

    fn is_operational(&self) -> bool {
        self.config.active
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_venue_did() -> DID {
        DID::from_raw("scos:did:".to_string() + &"v".repeat(64))
    }

    fn make_config(active: bool, max: Option<i64>) -> VenueConfig {
        VenueConfig {
            venue_did: make_venue_did(),
            name: "Test ATS".into(),
            venue_type: VenueType::ATS,
            licensed_jurisdictions: vec!["US-DE".into(), "SG".into()],
            has_own_kyc: true,
            max_trade_cents: max,
            supported_asset_classes: vec!["equity".into()],
            active,
        }
    }

    #[test]
    fn test_venue_approves_within_limit() {
        let venue = ConfigBasedVenue::new(make_config(true, Some(1_000_000_00)));
        let from = DID::from_raw("scos:did:".to_string() + &"a".repeat(64));
        let to = DID::from_raw("scos:did:".to_string() + &"b".repeat(64));

        let decision = venue.approve_transfer("INST-001", &from, &to, 500_000_00);
        assert!(decision.approved);
    }

    #[test]
    fn test_venue_denies_over_limit() {
        let venue = ConfigBasedVenue::new(make_config(true, Some(100_000_00)));
        let from = DID::from_raw("scos:did:".to_string() + &"a".repeat(64));
        let to = DID::from_raw("scos:did:".to_string() + &"b".repeat(64));

        let decision = venue.approve_transfer("INST-001", &from, &to, 500_000_00);
        assert!(!decision.approved);
    }

    #[test]
    fn test_inactive_venue_denies() {
        let venue = ConfigBasedVenue::new(make_config(false, None));
        let from = DID::from_raw("scos:did:".to_string() + &"a".repeat(64));
        let to = DID::from_raw("scos:did:".to_string() + &"b".repeat(64));

        let decision = venue.approve_transfer("INST-001", &from, &to, 100_00);
        assert!(!decision.approved);
    }

    #[test]
    fn test_jurisdiction_licensing() {
        let config = make_config(true, None);
        assert!(config.is_licensed_in("US-DE"));
        assert!(config.is_licensed_in("sg")); // case insensitive
        assert!(!config.is_licensed_in("GB"));
    }
}
