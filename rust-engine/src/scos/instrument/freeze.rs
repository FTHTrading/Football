// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 3 — Freeze Control
// ═══════════════════════════════════════════════════════════════════
//
// Regulators and compliance officers can freeze instruments at
// multiple domains:
//
//   - Global: entire instrument frozen, no transfers
//   - Holder: specific holder's position frozen
//   - Partition: specific partition frozen
//   - Jurisdiction: all holdings in a jurisdiction frozen
//
// Freeze operations are hash-anchored and create audit records.

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

/// Domain at which a freeze is applied.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum FreezeDomain {
    /// Entire instrument is frozen.
    Global,
    /// Specific holder's position is frozen.
    Holder(String),
    /// Specific partition is frozen.
    Partition(String),
    /// All positions in a jurisdiction are frozen.
    Jurisdiction(String),
}

/// Current state of a freeze.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum FreezeState {
    /// No freeze in effect.
    Active,
    /// Frozen — no transfers permitted.
    Frozen,
    /// Thawed (was frozen, now released).
    Thawed,
}

/// A freeze order applied to an instrument.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FreezeOrder {
    /// Unique freeze order identifier.
    pub order_id: String,
    /// Instrument being frozen.
    pub instrument_id: String,
    /// Domain of the freeze.
    pub domain: FreezeDomain,
    /// Current state.
    pub state: FreezeState,
    /// DID of the authority issuing the freeze.
    pub authority_did: String,
    /// Reason for the freeze.
    pub reason: String,
    /// ISO 8601 timestamp when freeze was issued.
    pub issued_at: String,
    /// ISO 8601 timestamp when freeze was lifted (if applicable).
    pub lifted_at: Option<String>,
}

impl FreezeOrder {
    /// Compute the order hash for audit anchoring.
    pub fn content_hash(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(self.order_id.as_bytes());
        hasher.update(b"|");
        hasher.update(self.instrument_id.as_bytes());
        hasher.update(b"|");
        hasher.update(format!("{:?}", self.domain).as_bytes());
        hasher.update(b"|");
        hasher.update(self.authority_did.as_bytes());
        hasher.update(b"|");
        hasher.update(self.reason.as_bytes());
        hasher.update(b"|");
        hasher.update(self.issued_at.as_bytes());
        hex::encode(hasher.finalize())
    }
}

/// Manages all freeze orders across instruments.
pub struct FreezeManager {
    /// Map: instrument_id → Vec<FreezeOrder>
    orders: HashMap<String, Vec<FreezeOrder>>,
}

impl FreezeManager {
    pub fn new() -> Self {
        Self {
            orders: HashMap::new(),
        }
    }

    /// Issue a freeze order.
    pub fn freeze(
        &mut self,
        order_id: String,
        instrument_id: String,
        domain: FreezeDomain,
        authority_did: String,
        reason: String,
    ) -> FreezeOrder {
        let order = FreezeOrder {
            order_id,
            instrument_id: instrument_id.clone(),
            domain,
            state: FreezeState::Frozen,
            authority_did,
            reason,
            issued_at: chrono::Utc::now().to_rfc3339(),
            lifted_at: None,
        };

        self.orders
            .entry(instrument_id)
            .or_insert_with(Vec::new)
            .push(order.clone());

        order
    }

    /// Lift a freeze order by order_id.
    pub fn thaw(&mut self, instrument_id: &str, order_id: &str) -> bool {
        if let Some(orders) = self.orders.get_mut(instrument_id) {
            for order in orders.iter_mut() {
                if order.order_id == order_id && order.state == FreezeState::Frozen {
                    order.state = FreezeState::Thawed;
                    order.lifted_at = Some(chrono::Utc::now().to_rfc3339());
                    return true;
                }
            }
        }
        false
    }

    /// Check if an instrument has any active global freeze.
    pub fn is_globally_frozen(&self, instrument_id: &str) -> bool {
        self.orders
            .get(instrument_id)
            .map(|orders| {
                orders.iter().any(|o| {
                    o.domain == FreezeDomain::Global && o.state == FreezeState::Frozen
                })
            })
            .unwrap_or(false)
    }

    /// Check if a holder's position is frozen on a specific instrument.
    pub fn is_holder_frozen(&self, instrument_id: &str, holder_did: &str) -> bool {
        self.orders
            .get(instrument_id)
            .map(|orders| {
                orders.iter().any(|o| {
                    o.state == FreezeState::Frozen
                        && matches!(&o.domain, FreezeDomain::Holder(d) if d == holder_did)
                })
            })
            .unwrap_or(false)
    }

    /// Check if any freeze (global, holder, partition, or jurisdiction)
    /// blocks a transfer for a given holder in a given jurisdiction.
    pub fn is_blocked(
        &self,
        instrument_id: &str,
        holder_did: &str,
        partition_id: Option<&str>,
        jurisdiction: Option<&str>,
    ) -> bool {
        if self.is_globally_frozen(instrument_id) {
            return true;
        }
        if self.is_holder_frozen(instrument_id, holder_did) {
            return true;
        }

        if let Some(orders) = self.orders.get(instrument_id) {
            for order in orders {
                if order.state != FreezeState::Frozen {
                    continue;
                }
                match &order.domain {
                    FreezeDomain::Partition(pid) => {
                        if partition_id == Some(pid.as_str()) {
                            return true;
                        }
                    }
                    FreezeDomain::Jurisdiction(j) => {
                        if jurisdiction.map(|jur| jur.eq_ignore_ascii_case(j)).unwrap_or(false) {
                            return true;
                        }
                    }
                    _ => {}
                }
            }
        }

        false
    }

    /// Get all active freeze orders for an instrument.
    pub fn active_orders(&self, instrument_id: &str) -> Vec<&FreezeOrder> {
        self.orders
            .get(instrument_id)
            .map(|orders| {
                orders.iter().filter(|o| o.state == FreezeState::Frozen).collect()
            })
            .unwrap_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_global_freeze_blocks_all() {
        let mut manager = FreezeManager::new();
        manager.freeze(
            "FRZ-001".into(),
            "INST-001".into(),
            FreezeDomain::Global,
            "scos:did:regulator".into(),
            "SEC investigation".into(),
        );

        assert!(manager.is_globally_frozen("INST-001"));
        assert!(manager.is_blocked("INST-001", "anyone", None, None));
    }

    #[test]
    fn test_holder_freeze() {
        let mut manager = FreezeManager::new();
        manager.freeze(
            "FRZ-002".into(),
            "INST-001".into(),
            FreezeDomain::Holder("scos:did:badactor".into()),
            "scos:did:regulator".into(),
            "Fraud investigation".into(),
        );

        assert!(manager.is_holder_frozen("INST-001", "scos:did:badactor"));
        assert!(!manager.is_holder_frozen("INST-001", "scos:did:goodactor"));
    }

    #[test]
    fn test_thaw_unfreezes() {
        let mut manager = FreezeManager::new();
        manager.freeze(
            "FRZ-003".into(),
            "INST-001".into(),
            FreezeDomain::Global,
            "scos:did:regulator".into(),
            "Temporary halt".into(),
        );

        assert!(manager.is_globally_frozen("INST-001"));

        let thawed = manager.thaw("INST-001", "FRZ-003");
        assert!(thawed);
        assert!(!manager.is_globally_frozen("INST-001"));
    }

    #[test]
    fn test_jurisdiction_freeze() {
        let mut manager = FreezeManager::new();
        manager.freeze(
            "FRZ-004".into(),
            "INST-001".into(),
            FreezeDomain::Jurisdiction("RU".into()),
            "scos:did:regulator".into(),
            "Sanctions compliance".into(),
        );

        assert!(manager.is_blocked("INST-001", "anyone", None, Some("RU")));
        assert!(!manager.is_blocked("INST-001", "anyone", None, Some("US-DE")));
    }

    #[test]
    fn test_order_hash_deterministic() {
        let order = FreezeOrder {
            order_id: "FRZ-005".into(),
            instrument_id: "INST-001".into(),
            domain: FreezeDomain::Global,
            state: FreezeState::Frozen,
            authority_did: "scos:did:regulator".into(),
            reason: "Test".into(),
            issued_at: "2026-01-01T00:00:00Z".into(),
            lifted_at: None,
        };

        let h1 = order.content_hash();
        let h2 = order.content_hash();
        assert_eq!(h1, h2);
    }
}
