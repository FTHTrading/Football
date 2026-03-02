/// Blockchain anchoring module — future-ready stub.
///
/// When activated, this module will:
/// 1. Collect identity hashes and NIL receipt hashes into batches
/// 2. Compute a Merkle root over each batch
/// 3. Anchor the root to an on-chain contract (Ethereum L2 or Solana)
/// 4. Store the transaction hash as proof-of-existence
///
/// For now, all functions return placeholder values so the rest of the
/// engine can reference this module without compilation errors.

use sha2::{Digest, Sha256};

/// Compute a Merkle root from a list of hex-encoded hashes.
pub fn compute_merkle_root(hashes: &[String]) -> String {
    if hashes.is_empty() {
        return "0".repeat(64);
    }
    if hashes.len() == 1 {
        return hashes[0].clone();
    }

    let mut layer: Vec<String> = hashes.to_vec();

    while layer.len() > 1 {
        let mut next_layer = Vec::new();
        for chunk in layer.chunks(2) {
            let combined = if chunk.len() == 2 {
                format!("{}{}", chunk[0], chunk[1])
            } else {
                format!("{}{}", chunk[0], chunk[0]) // duplicate odd leaf
            };
            let mut hasher = Sha256::new();
            hasher.update(combined.as_bytes());
            next_layer.push(hex::encode(hasher.finalize()));
        }
        layer = next_layer;
    }

    layer.into_iter().next().unwrap_or_default()
}

/// Stub: anchor a Merkle root on-chain. Returns a fake tx hash.
pub async fn anchor_batch(hashes: &[String]) -> anyhow::Result<String> {
    let root = compute_merkle_root(hashes);
    tracing::info!(merkle_root = %root, batch_size = hashes.len(), "Blockchain anchor requested (stub)");

    // In production: submit root to smart contract, return real tx hash
    Ok(format!("stub-tx-{}", &root[..16]))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_merkle() {
        let root = compute_merkle_root(&[]);
        assert_eq!(root.len(), 64);
        assert!(root.chars().all(|c| c == '0'));
    }

    #[test]
    fn test_single_hash() {
        let hash = "abcd1234".repeat(8);
        let root = compute_merkle_root(&[hash.clone()]);
        assert_eq!(root, hash);
    }

    #[test]
    fn test_two_hashes() {
        let h1 = "aa".repeat(32);
        let h2 = "bb".repeat(32);
        let root = compute_merkle_root(&[h1, h2]);
        assert_eq!(root.len(), 64);
    }
}
