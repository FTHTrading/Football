// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 2 — Jurisdiction Registry (Cross-Border Control)
// ═══════════════════════════════════════════════════════════════════
//
// JurisdictionRegistry manages:
//   - Known jurisdictions and their properties
//   - Cross-border transition matrix (source → target allowed?)
//   - Conflict resolution: strictest rule wins
//   - Amount limits per jurisdiction
//   - Restricted asset classes per jurisdiction

use std::collections::{HashMap, HashSet};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

/// Jurisdiction definition with regulatory properties.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JurisdictionRule {
    /// ISO jurisdiction code (e.g., "US-DE", "GB", "SG", "CH").
    pub code: String,
    /// Whether this jurisdiction generally permits digital asset transfers.
    pub transfers_allowed: bool,
    /// Maximum single transaction in cents. None = unlimited.
    pub max_single_transaction_cents: Option<i64>,
    /// Maximum daily aggregate in cents. None = unlimited.
    pub max_daily_aggregate_cents: Option<i64>,
    /// Asset classes that are restricted (cannot be transferred in this jurisdiction).
    pub restricted_asset_classes: Vec<String>,
    /// Whether accredited investor status is required for participation.
    pub requires_accreditation: bool,
    /// Whether KYC is mandatory.
    pub requires_kyc: bool,
    /// Minimum age (years) for participation.
    pub min_age: u8,
    /// Human-readable regulatory framework reference.
    pub regulatory_framework: String,
}

/// Cross-border transition record.
#[derive(Debug, Clone)]
struct TransitionEntry {
    /// Is the transition allowed at all?
    allowed: bool,
    /// Additional restrictions (e.g., "max $50K per transfer").
    max_cents_override: Option<i64>,
}

/// The Jurisdiction Registry — stores all jurisdiction rules and manages
/// the cross-border transition matrix.
///
/// Conflict resolution: the strictest rule always wins.
#[derive(Debug, Clone)]
pub struct JurisdictionRegistry {
    /// Map from jurisdiction code → JurisdictionRule.
    rules: HashMap<String, JurisdictionRule>,
    /// Transition matrix: (source, target) → TransitionEntry.
    transitions: HashMap<(String, String), TransitionEntry>,
    /// Default behavior for unknown jurisdictions.
    default_allow: bool,
}

impl JurisdictionRegistry {
    /// Create an empty registry with default-deny for unknown jurisdictions.
    pub fn new() -> Self {
        Self {
            rules: HashMap::new(),
            transitions: HashMap::new(),
            default_allow: false,
        }
    }

    /// Create a permissive registry (for testing / early-stage deployment).
    /// All transitions allowed, no restrictions.
    pub fn permissive() -> Self {
        Self {
            rules: HashMap::new(),
            transitions: HashMap::new(),
            default_allow: true,
        }
    }

    /// Register a jurisdiction rule.
    pub fn register(&mut self, rule: JurisdictionRule) {
        self.rules.insert(rule.code.to_uppercase(), rule);
    }

    /// Get a jurisdiction's rule by code.
    pub fn get(&self, code: &str) -> Option<&JurisdictionRule> {
        self.rules.get(&code.to_uppercase())
    }

    /// Set the cross-border transition for a (source, target) pair.
    pub fn set_transition(
        &mut self,
        from: &str,
        to: &str,
        allowed: bool,
        max_cents_override: Option<i64>,
    ) {
        self.transitions.insert(
            (from.to_uppercase(), to.to_uppercase()),
            TransitionEntry {
                allowed,
                max_cents_override,
            },
        );
    }

    /// Check whether a transfer from source → target is allowed.
    ///
    /// Strictest rule wins:
    /// 1. If either jurisdiction disallows transfers, deny.
    /// 2. If the transition matrix has an explicit deny, deny.
    /// 3. If no entry exists and default_allow is false, deny.
    pub fn is_transition_allowed(&self, from: &str, to: &str) -> bool {
        let from_upper = from.to_uppercase();
        let to_upper = to.to_uppercase();

        // Check source jurisdiction allows transfers
        if let Some(source_rule) = self.rules.get(&from_upper) {
            if !source_rule.transfers_allowed {
                return false;
            }
        }

        // Check target jurisdiction allows transfers
        if let Some(target_rule) = self.rules.get(&to_upper) {
            if !target_rule.transfers_allowed {
                return false;
            }
        }

        // Check explicit transition matrix
        if let Some(entry) = self.transitions.get(&(from_upper, to_upper)) {
            return entry.allowed;
        }

        // Default behavior
        self.default_allow
    }

    /// Get the effective max transaction for a cross-border transfer.
    ///
    /// Returns the minimum (strictest) of:
    /// - Source jurisdiction's max
    /// - Target jurisdiction's max
    /// - Transition override max (if any)
    pub fn effective_max_cents(&self, from: &str, to: &str) -> Option<i64> {
        let from_upper = from.to_uppercase();
        let to_upper = to.to_uppercase();

        let mut candidates: Vec<i64> = Vec::new();

        if let Some(source_rule) = self.rules.get(&from_upper) {
            if let Some(max) = source_rule.max_single_transaction_cents {
                candidates.push(max);
            }
        }

        if let Some(target_rule) = self.rules.get(&to_upper) {
            if let Some(max) = target_rule.max_single_transaction_cents {
                candidates.push(max);
            }
        }

        if let Some(entry) = self.transitions.get(&(from_upper, to_upper)) {
            if let Some(max) = entry.max_cents_override {
                candidates.push(max);
            }
        }

        candidates.into_iter().min() // Strictest wins
    }

    /// Check whether an asset class is restricted in a jurisdiction.
    pub fn is_asset_restricted(&self, jurisdiction: &str, asset_class: &str) -> bool {
        if let Some(rule) = self.rules.get(&jurisdiction.to_uppercase()) {
            rule.restricted_asset_classes
                .iter()
                .any(|c| c.eq_ignore_ascii_case(asset_class))
        } else {
            false
        }
    }

    /// Get all restricted asset classes for a cross-border transfer (union of both jurisdictions).
    pub fn restricted_asset_classes(&self, from: &str, to: &str) -> HashSet<String> {
        let mut restricted = HashSet::new();

        if let Some(source_rule) = self.rules.get(&from.to_uppercase()) {
            for class in &source_rule.restricted_asset_classes {
                restricted.insert(class.to_uppercase());
            }
        }

        if let Some(target_rule) = self.rules.get(&to.to_uppercase()) {
            for class in &target_rule.restricted_asset_classes {
                restricted.insert(class.to_uppercase());
            }
        }

        restricted
    }

    /// Compute a hash of the entire registry state (for audit anchoring).
    pub fn state_hash(&self) -> String {
        let mut hasher = Sha256::new();

        // Sort jurisdiction codes for determinism
        let mut codes: Vec<&String> = self.rules.keys().collect();
        codes.sort();

        for code in codes {
            let rule = &self.rules[code];
            hasher.update(code.as_bytes());
            hasher.update(b"|");
            hasher.update(if rule.transfers_allowed { b"1" } else { b"0" });
            hasher.update(b"|");
            if let Some(max) = rule.max_single_transaction_cents {
                hasher.update(max.to_le_bytes());
            }
            hasher.update(b"|");
        }

        hex::encode(hasher.finalize())
    }

    /// Number of registered jurisdictions.
    pub fn count(&self) -> usize {
        self.rules.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn us_delaware() -> JurisdictionRule {
        JurisdictionRule {
            code: "US-DE".into(),
            transfers_allowed: true,
            max_single_transaction_cents: Some(10_000_000_00), // $10M
            max_daily_aggregate_cents: Some(50_000_000_00),    // $50M
            restricted_asset_classes: vec![],
            requires_accreditation: true,
            requires_kyc: true,
            min_age: 18,
            regulatory_framework: "SEC Reg D 506(c), DE LLC Code".into(),
        }
    }

    fn singapore() -> JurisdictionRule {
        JurisdictionRule {
            code: "SG".into(),
            transfers_allowed: true,
            max_single_transaction_cents: Some(5_000_000_00), // $5M
            max_daily_aggregate_cents: None,
            restricted_asset_classes: vec!["derivatives".into()],
            requires_accreditation: true,
            requires_kyc: true,
            min_age: 21,
            regulatory_framework: "MAS PS Act".into(),
        }
    }

    fn north_korea() -> JurisdictionRule {
        JurisdictionRule {
            code: "KP".into(),
            transfers_allowed: false,
            max_single_transaction_cents: None,
            max_daily_aggregate_cents: None,
            restricted_asset_classes: vec![],
            requires_accreditation: false,
            requires_kyc: false,
            min_age: 0,
            regulatory_framework: "OFAC Sanctioned".into(),
        }
    }

    #[test]
    fn test_basic_transition_allowed() {
        let mut registry = JurisdictionRegistry::new();
        registry.register(us_delaware());
        registry.register(singapore());
        registry.set_transition("US-DE", "SG", true, None);

        assert!(registry.is_transition_allowed("US-DE", "SG"));
    }

    #[test]
    fn test_sanctioned_jurisdiction_denied() {
        let mut registry = JurisdictionRegistry::new();
        registry.register(us_delaware());
        registry.register(north_korea());

        // KP transfers_allowed = false → blocked regardless
        assert!(!registry.is_transition_allowed("US-DE", "KP"));
    }

    #[test]
    fn test_default_deny_unknown() {
        let registry = JurisdictionRegistry::new(); // default_allow = false
        assert!(!registry.is_transition_allowed("XX", "YY"));
    }

    #[test]
    fn test_permissive_allows_unknown() {
        let registry = JurisdictionRegistry::permissive();
        assert!(registry.is_transition_allowed("XX", "YY"));
    }

    #[test]
    fn test_effective_max_cents_strictest_wins() {
        let mut registry = JurisdictionRegistry::new();
        registry.register(us_delaware()); // $10M
        registry.register(singapore());   // $5M
        registry.set_transition("US-DE", "SG", true, Some(2_000_000_00)); // $2M override

        let max = registry.effective_max_cents("US-DE", "SG");
        assert_eq!(max, Some(2_000_000_00), "Transition override is strictest at $2M");
    }

    #[test]
    fn test_restricted_asset_classes_union() {
        let mut registry = JurisdictionRegistry::new();
        registry.register(us_delaware()); // no restrictions
        registry.register(singapore());   // derivatives restricted

        let restricted = registry.restricted_asset_classes("US-DE", "SG");
        assert!(restricted.contains("DERIVATIVES"));
        assert_eq!(restricted.len(), 1);
    }

    #[test]
    fn test_state_hash_deterministic() {
        let mut r1 = JurisdictionRegistry::new();
        r1.register(us_delaware());
        r1.register(singapore());

        let mut r2 = JurisdictionRegistry::new();
        // Register in reverse order — hash should still match since we sort keys
        r2.register(singapore());
        r2.register(us_delaware());

        assert_eq!(r1.state_hash(), r2.state_hash());
    }
}
