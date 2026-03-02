// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 3 — Instrument Template
// ═══════════════════════════════════════════════════════════════════
//
// An SCOSInstrument is a self-enforcing asset standard.
// Every transfer, partition, or lifecycle event must pass through
// the policy evaluator.
//
// Key properties:
// - Deterministic ID (hash of canonical fields)
// - Embedded jurisdiction constraints
// - Linked to issuer DID and policy version
// - Integer quantities only

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::identity::DID;

/// Classification of the underlying asset.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AssetClass {
    Equity,
    Debt,
    RealEstate,
    Fund,
    RevenueShare,
    Derivative,
    Commodity,
    Custom(String),
}

impl AssetClass {
    pub fn canonical_tag(&self) -> &str {
        match self {
            AssetClass::Equity => "EQUITY",
            AssetClass::Debt => "DEBT",
            AssetClass::RealEstate => "REAL_ESTATE",
            AssetClass::Fund => "FUND",
            AssetClass::RevenueShare => "REVENUE_SHARE",
            AssetClass::Derivative => "DERIVATIVE",
            AssetClass::Commodity => "COMMODITY",
            AssetClass::Custom(s) => s.as_str(),
        }
    }
}

/// Configuration baked into an instrument at creation time.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstrumentConfig {
    /// Maximum number of holders at any time. None = unlimited.
    pub max_holders: Option<u32>,
    /// Whether fractional units are allowed.
    pub fractional_allowed: bool,
    /// Minimum transfer quantity (in base units). 0 = no minimum.
    pub min_transfer_units: i64,
    /// Jurisdictions where this instrument may legally exist.
    pub allowed_jurisdictions: Vec<String>,
    /// Lock-up period end (ISO 8601). None = no lock-up.
    pub lockup_until: Option<String>,
    /// Whether the instrument requires accredited investors only.
    pub accredited_only: bool,
}

/// A self-enforcing SCOS Instrument.
///
/// Every instrument embeds its governance rules.
/// The instrument_id is a deterministic SHA-256 hash of its canonical fields.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SCOSInstrument {
    /// Deterministic instrument identifier (SHA-256).
    pub instrument_id: String,
    /// Human-readable name.
    pub name: String,
    /// Asset classification.
    pub asset_class: AssetClass,
    /// Issuer DID.
    pub issuer_did: DID,
    /// Total supply in base units (integer).
    pub total_supply_units: i64,
    /// Denomination currency (ISO 4217 or "BTC", "ETH", etc.).
    pub denomination: String,
    /// Price per unit in cents (integer arithmetic).
    pub unit_price_cents: i64,
    /// ISO 8601 creation timestamp.
    pub created_at: String,
    /// Policy ruleset version hash this instrument was created under.
    pub policy_version_hash: String,
    /// Embedded instrument configuration.
    pub config: InstrumentConfig,
    /// Content hash of the instrument (for integrity verification).
    pub content_hash: String,
}

impl SCOSInstrument {
    /// Compute the deterministic content hash.
    ///
    /// Hash = SHA-256(name || asset_class || issuer_did || total_supply || denomination || unit_price || policy_version || config fields)
    pub fn compute_content_hash(
        name: &str,
        asset_class: &AssetClass,
        issuer_did: &DID,
        total_supply_units: i64,
        denomination: &str,
        unit_price_cents: i64,
        policy_version_hash: &str,
        config: &InstrumentConfig,
    ) -> String {
        let mut hasher = Sha256::new();
        hasher.update(name.as_bytes());
        hasher.update(b"|");
        hasher.update(asset_class.canonical_tag().as_bytes());
        hasher.update(b"|");
        hasher.update(issuer_did.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(total_supply_units.to_le_bytes());
        hasher.update(b"|");
        hasher.update(denomination.as_bytes());
        hasher.update(b"|");
        hasher.update(unit_price_cents.to_le_bytes());
        hasher.update(b"|");
        hasher.update(policy_version_hash.as_bytes());
        hasher.update(b"|");
        // Config fields
        match config.max_holders {
            Some(v) => hasher.update(v.to_le_bytes()),
            None => hasher.update(b"NONE"),
        }
        hasher.update(b"|");
        hasher.update(if config.fractional_allowed { b"1" } else { b"0" });
        hasher.update(b"|");
        hasher.update(config.min_transfer_units.to_le_bytes());
        hasher.update(b"|");
        let mut sorted_jurisdictions = config.allowed_jurisdictions.clone();
        sorted_jurisdictions.sort();
        for j in &sorted_jurisdictions {
            hasher.update(j.as_bytes());
            hasher.update(b",");
        }
        hasher.update(b"|");
        hasher.update(if config.accredited_only { b"1" } else { b"0" });

        hex::encode(hasher.finalize())
    }

    /// Total value of all units in cents (integer arithmetic).
    pub fn total_value_cents(&self) -> i64 {
        self.total_supply_units * self.unit_price_cents
    }

    /// Check if a jurisdiction is allowed for this instrument.
    pub fn is_jurisdiction_allowed(&self, jurisdiction: &str) -> bool {
        if self.config.allowed_jurisdictions.is_empty() {
            return true; // Empty list = all allowed
        }
        self.config.allowed_jurisdictions
            .iter()
            .any(|j| j.eq_ignore_ascii_case(jurisdiction))
    }

    /// Check if this instrument is currently in lock-up.
    pub fn is_locked_up(&self, now: &str) -> bool {
        match &self.config.lockup_until {
            Some(lockup_end) => now < lockup_end.as_str(),
            None => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_issuer() -> DID {
        DID::from_raw("scos:did:".to_string() + &"a".repeat(64))
    }

    fn make_config() -> InstrumentConfig {
        InstrumentConfig {
            max_holders: Some(500),
            fractional_allowed: false,
            min_transfer_units: 1,
            allowed_jurisdictions: vec!["US-DE".into(), "SG".into()],
            lockup_until: None,
            accredited_only: true,
        }
    }

    #[test]
    fn test_content_hash_deterministic() {
        let config = make_config();
        let issuer = make_issuer();

        let h1 = SCOSInstrument::compute_content_hash(
            "Series A", &AssetClass::Equity, &issuer, 1_000_000, "USD", 10_00, "v1hash", &config,
        );
        let h2 = SCOSInstrument::compute_content_hash(
            "Series A", &AssetClass::Equity, &issuer, 1_000_000, "USD", 10_00, "v1hash", &config,
        );
        assert_eq!(h1, h2);
    }

    #[test]
    fn test_different_name_different_hash() {
        let config = make_config();
        let issuer = make_issuer();

        let h1 = SCOSInstrument::compute_content_hash(
            "Series A", &AssetClass::Equity, &issuer, 1_000_000, "USD", 10_00, "v1hash", &config,
        );
        let h2 = SCOSInstrument::compute_content_hash(
            "Series B", &AssetClass::Equity, &issuer, 1_000_000, "USD", 10_00, "v1hash", &config,
        );
        assert_ne!(h1, h2);
    }

    #[test]
    fn test_total_value_integer() {
        let instrument = SCOSInstrument {
            instrument_id: "test".into(),
            name: "Test Fund".into(),
            asset_class: AssetClass::Fund,
            issuer_did: make_issuer(),
            total_supply_units: 10_000,
            denomination: "USD".into(),
            unit_price_cents: 100_00, // $100.00
            created_at: "2026-01-01T00:00:00Z".into(),
            policy_version_hash: "v1hash".into(),
            config: make_config(),
            content_hash: String::new(),
        };
        // 10,000 units × $100.00 = $1,000,000.00 = 100_000_000 cents
        assert_eq!(instrument.total_value_cents(), 1_000_000_00);
    }

    #[test]
    fn test_jurisdiction_allowed() {
        let instrument = SCOSInstrument {
            instrument_id: "test".into(),
            name: "Test".into(),
            asset_class: AssetClass::Equity,
            issuer_did: make_issuer(),
            total_supply_units: 1000,
            denomination: "USD".into(),
            unit_price_cents: 1_00,
            created_at: "2026-01-01T00:00:00Z".into(),
            policy_version_hash: "v1hash".into(),
            config: make_config(),
            content_hash: String::new(),
        };
        assert!(instrument.is_jurisdiction_allowed("US-DE"));
        assert!(instrument.is_jurisdiction_allowed("sg")); // case insensitive
        assert!(!instrument.is_jurisdiction_allowed("GB"));
    }

    #[test]
    fn test_lockup_period() {
        let mut config = make_config();
        config.lockup_until = Some("2027-06-01T00:00:00Z".into());

        let instrument = SCOSInstrument {
            instrument_id: "test".into(),
            name: "Locked Fund".into(),
            asset_class: AssetClass::Fund,
            issuer_did: make_issuer(),
            total_supply_units: 1000,
            denomination: "USD".into(),
            unit_price_cents: 1_00,
            created_at: "2026-01-01T00:00:00Z".into(),
            policy_version_hash: "v1hash".into(),
            config,
            content_hash: String::new(),
        };
        assert!(instrument.is_locked_up("2026-06-01T00:00:00Z"));
        assert!(!instrument.is_locked_up("2027-12-01T00:00:00Z"));
    }
}
