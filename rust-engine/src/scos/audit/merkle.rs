// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 5 — Merkle Tree for Audit Anchoring
// ═══════════════════════════════════════════════════════════════════
//
// Extends the existing blockchain/mod.rs Merkle infrastructure.
// Batches audit record hashes into Merkle roots for periodic anchoring.
//
// Merkle roots can be anchored to:
//   - PostgreSQL (Phase 1)
//   - Public blockchain (Phase 2)
//   - Certificate transparency logs (Phase 3)

use sha2::{Digest, Sha256};

/// SCOS Audit Merkle Tree.
///
/// Takes a batch of record content hashes and computes a Merkle root.
/// Compatible with the existing blockchain::compute_merkle_root() but
/// with batch management and anchoring metadata.
pub struct AuditMerkleTree {
    /// Pending hashes not yet anchored.
    pending: Vec<String>,
    /// Anchored batch roots with metadata.
    anchored: Vec<AnchoredBatch>,
    /// Maximum batch size before auto-anchor.
    batch_size: usize,
}

/// Record of an anchored Merkle batch.
#[derive(Debug, Clone)]
pub struct AnchoredBatch {
    /// The Merkle root of this batch.
    pub root: String,
    /// Number of records in this batch.
    pub record_count: usize,
    /// ISO 8601 timestamp of anchoring.
    pub anchored_at: String,
    /// Sequence range: (first_sequence, last_sequence).
    pub sequence_range: (u64, u64),
}

impl AuditMerkleTree {
    /// Create a new Merkle tree with a given batch size.
    pub fn new(batch_size: usize) -> Self {
        Self {
            pending: Vec::new(),
            anchored: Vec::new(),
            batch_size: if batch_size == 0 { 100 } else { batch_size },
        }
    }

    /// Add a record hash to the pending batch.
    ///
    /// Returns Some(root) if the batch is full and was auto-anchored.
    pub fn add_hash(&mut self, hash: String, sequence: u64) -> Option<String> {
        self.pending.push(hash);

        if self.pending.len() >= self.batch_size {
            let root = self.anchor_batch(sequence);
            return Some(root);
        }
        None
    }

    /// Force-anchor the current pending batch.
    pub fn anchor_batch(&mut self, last_sequence: u64) -> String {
        if self.pending.is_empty() {
            return String::new();
        }

        let root = compute_merkle_root(&self.pending);
        let record_count = self.pending.len();
        let first_sequence = last_sequence - (record_count as u64) + 1;

        self.anchored.push(AnchoredBatch {
            root: root.clone(),
            record_count,
            anchored_at: chrono::Utc::now().to_rfc3339(),
            sequence_range: (first_sequence, last_sequence),
        });

        self.pending.clear();
        root
    }

    /// Get all anchored batch records.
    pub fn anchored_batches(&self) -> &[AnchoredBatch] {
        &self.anchored
    }

    /// Number of pending (un-anchored) hashes.
    pub fn pending_count(&self) -> usize {
        self.pending.len()
    }

    /// Total number of anchored batches.
    pub fn batch_count(&self) -> usize {
        self.anchored.len()
    }
}

/// Compute a SHA-256 Merkle root from a list of hex-encoded hashes.
///
/// This is the canonical SCOS Merkle computation, matching the pattern
/// from blockchain/mod.rs.
///
/// - Empty input → hash of empty string
/// - Single hash → hash of that hash
/// - Multiple → pair-wise SHA-256 up the tree, duplicating odd leaves
pub fn compute_merkle_root(hashes: &[String]) -> String {
    if hashes.is_empty() {
        let hasher = Sha256::new();
        return hex::encode(hasher.finalize());
    }

    let mut current_level: Vec<Vec<u8>> = hashes
        .iter()
        .map(|h| hex::decode(h).unwrap_or_else(|_| h.as_bytes().to_vec()))
        .collect();

    while current_level.len() > 1 {
        let mut next_level = Vec::new();
        let mut i = 0;
        while i < current_level.len() {
            let left = &current_level[i];
            let right = if i + 1 < current_level.len() {
                &current_level[i + 1]
            } else {
                left // Duplicate odd leaf
            };

            let mut hasher = Sha256::new();
            hasher.update(left);
            hasher.update(right);
            next_level.push(hasher.finalize().to_vec());
            i += 2;
        }
        current_level = next_level;
    }

    hex::encode(&current_level[0])
}

#[cfg(test)]
mod tests {
    use super::*;

    fn hash_str(s: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(s.as_bytes());
        hex::encode(hasher.finalize())
    }

    #[test]
    fn test_merkle_root_single() {
        let hashes = vec![hash_str("record1")];
        let root = compute_merkle_root(&hashes);
        assert!(!root.is_empty());
        assert_eq!(root.len(), 64);
    }

    #[test]
    fn test_merkle_root_pair() {
        let hashes = vec![hash_str("record1"), hash_str("record2")];
        let root = compute_merkle_root(&hashes);
        assert_eq!(root.len(), 64);
    }

    #[test]
    fn test_merkle_root_deterministic() {
        let hashes = vec![
            hash_str("a"),
            hash_str("b"),
            hash_str("c"),
        ];
        let r1 = compute_merkle_root(&hashes);
        let r2 = compute_merkle_root(&hashes);
        assert_eq!(r1, r2);
    }

    #[test]
    fn test_auto_anchor_on_batch_full() {
        let mut tree = AuditMerkleTree::new(3);

        assert!(tree.add_hash(hash_str("r1"), 1).is_none());
        assert!(tree.add_hash(hash_str("r2"), 2).is_none());
        let root = tree.add_hash(hash_str("r3"), 3);
        assert!(root.is_some()); // Batch full → auto-anchor

        assert_eq!(tree.batch_count(), 1);
        assert_eq!(tree.pending_count(), 0);
    }

    #[test]
    fn test_force_anchor_partial_batch() {
        let mut tree = AuditMerkleTree::new(100);

        tree.add_hash(hash_str("r1"), 1);
        tree.add_hash(hash_str("r2"), 2);
        assert_eq!(tree.pending_count(), 2);

        let root = tree.anchor_batch(2);
        assert!(!root.is_empty());
        assert_eq!(tree.batch_count(), 1);
        assert_eq!(tree.pending_count(), 0);
    }
}
