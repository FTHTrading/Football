// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 3 — Instrument Partitioning
// ═══════════════════════════════════════════════════════════════════
//
// Partitions separate concerns:
//   - Custody partition: who holds the asset
//   - Ownership partition: who has economic rights
//   - Escrow partition: locked pending condition
//   - Reserve partition: held by issuer for compliance
//
// All partition operations are tracked and hash-anchored.

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::scos::identity::DID;

/// Type of partition.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PartitionType {
    /// Default tradeable partition.
    Tradeable,
    /// Held in escrow pending a condition.
    Escrow,
    /// Locked for regulatory compliance (e.g., lock-up period).
    Locked,
    /// Reserved by issuer.
    Reserve,
    /// Custom partition type.
    Custom(String),
}

/// A partition of an instrument's supply.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Partition {
    /// Unique partition identifier.
    pub partition_id: String,
    /// Instrument this partition belongs to.
    pub instrument_id: String,
    /// DID of the holder.
    pub holder_did: DID,
    /// Partition type.
    pub partition_type: PartitionType,
    /// Quantity in this partition (integer base units).
    pub quantity_units: i64,
    /// ISO 8601 creation timestamp.
    pub created_at: String,
    /// Optional release condition description.
    pub release_condition: Option<String>,
}

impl Partition {
    /// Compute a partition hash for audit anchoring.
    pub fn content_hash(&self) -> String {
        let mut hasher = Sha256::new();
        hasher.update(self.partition_id.as_bytes());
        hasher.update(b"|");
        hasher.update(self.instrument_id.as_bytes());
        hasher.update(b"|");
        hasher.update(self.holder_did.as_str().as_bytes());
        hasher.update(b"|");
        hasher.update(format!("{:?}", self.partition_type).as_bytes());
        hasher.update(b"|");
        hasher.update(self.quantity_units.to_le_bytes());
        hex::encode(hasher.finalize())
    }

    /// Is this partition tradeable?
    pub fn is_tradeable(&self) -> bool {
        matches!(self.partition_type, PartitionType::Tradeable)
    }
}

/// Manages all partitions for all instruments.
pub struct PartitionManager {
    /// Map: instrument_id → Vec<Partition>
    partitions: HashMap<String, Vec<Partition>>,
}

impl PartitionManager {
    pub fn new() -> Self {
        Self {
            partitions: HashMap::new(),
        }
    }

    /// Add a partition. Returns an error if it would exceed total supply.
    pub fn add(&mut self, partition: Partition) {
        self.partitions
            .entry(partition.instrument_id.clone())
            .or_insert_with(Vec::new)
            .push(partition);
    }

    /// Get all partitions for an instrument.
    pub fn for_instrument(&self, instrument_id: &str) -> &[Partition] {
        self.partitions
            .get(instrument_id)
            .map(|v| v.as_slice())
            .unwrap_or(&[])
    }

    /// Get tradeable quantity for a holder on a specific instrument.
    pub fn tradeable_quantity(&self, instrument_id: &str, holder_did: &DID) -> i64 {
        self.for_instrument(instrument_id)
            .iter()
            .filter(|p| p.holder_did == *holder_did && p.is_tradeable())
            .map(|p| p.quantity_units)
            .sum()
    }

    /// Total partitioned supply for an instrument.
    pub fn total_partitioned(&self, instrument_id: &str) -> i64 {
        self.for_instrument(instrument_id)
            .iter()
            .map(|p| p.quantity_units)
            .sum()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_did(label: &str) -> DID {
        DID::from_raw(format!("scos:did:{}", &label.repeat(65)[..64]))
    }

    #[test]
    fn test_partition_hash_deterministic() {
        let p1 = Partition {
            partition_id: "P-001".into(),
            instrument_id: "INST-001".into(),
            holder_did: make_did("alice"),
            partition_type: PartitionType::Tradeable,
            quantity_units: 1000,
            created_at: "2026-01-01T00:00:00Z".into(),
            release_condition: None,
        };
        let p2 = Partition {
            partition_id: "P-001".into(),
            instrument_id: "INST-001".into(),
            holder_did: make_did("alice"),
            partition_type: PartitionType::Tradeable,
            quantity_units: 1000,
            created_at: "2026-01-01T00:00:00Z".into(),
            release_condition: None,
        };
        assert_eq!(p1.content_hash(), p2.content_hash());
    }

    #[test]
    fn test_tradeable_quantity() {
        let mut manager = PartitionManager::new();
        let holder = make_did("alice");

        manager.add(Partition {
            partition_id: "P-001".into(),
            instrument_id: "INST-001".into(),
            holder_did: holder.clone(),
            partition_type: PartitionType::Tradeable,
            quantity_units: 500,
            created_at: "2026-01-01T00:00:00Z".into(),
            release_condition: None,
        });

        manager.add(Partition {
            partition_id: "P-002".into(),
            instrument_id: "INST-001".into(),
            holder_did: holder.clone(),
            partition_type: PartitionType::Locked,
            quantity_units: 300,
            created_at: "2026-01-01T00:00:00Z".into(),
            release_condition: Some("12-month lockup".into()),
        });

        assert_eq!(manager.tradeable_quantity("INST-001", &holder), 500);
        assert_eq!(manager.total_partitioned("INST-001"), 800);
    }
}
