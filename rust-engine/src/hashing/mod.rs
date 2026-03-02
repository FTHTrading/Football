use ed25519_dalek::{Signer, SigningKey, VerifyingKey};
use sha2::{Digest, Sha256};
use std::path::Path;

/// Load an Ed25519 signing key from disk, or generate and persist a new one.
pub fn load_or_generate_keypair(path: &str) -> anyhow::Result<SigningKey> {
    let key_path = Path::new(path);

    if key_path.exists() {
        let bytes = std::fs::read(key_path)?;
        if bytes.len() != 32 {
            anyhow::bail!("Signing key file must be exactly 32 bytes, got {}", bytes.len());
        }
        let secret: [u8; 32] = bytes.try_into().unwrap();
        let key = SigningKey::from_bytes(&secret);
        tracing::info!("Loaded Ed25519 signing key from {path}");
        Ok(key)
    } else {
        // Ensure parent directory exists
        if let Some(parent) = key_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let mut csprng = rand::rngs::OsRng;
        let key = SigningKey::generate(&mut csprng);
        std::fs::write(key_path, key.to_bytes())?;
        tracing::info!("Generated new Ed25519 signing key at {path}");
        Ok(key)
    }
}

/// Produce a deterministic canonical JSON string from key-value pairs.
/// Keys are sorted alphabetically, values lowercased and trimmed.
pub fn canonicalize_json(fields: &[(&str, &str)]) -> String {
    let mut sorted: Vec<(&str, &str)> = fields.to_vec();
    sorted.sort_by_key(|(k, _)| *k);

    let pairs: Vec<String> = sorted
        .iter()
        .map(|(k, v)| format!("\"{}\":\"{}\"", k, v.trim().to_lowercase()))
        .collect();

    format!("{{{}}}", pairs.join(","))
}

/// SHA-256 hash of arbitrary bytes, returned as hex string.
pub fn hash_sha256(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hex::encode(hasher.finalize())
}

/// Sign arbitrary bytes with Ed25519, returning the signature as hex.
pub fn sign_ed25519(key: &SigningKey, data: &[u8]) -> String {
    let signature = key.sign(data);
    hex::encode(signature.to_bytes())
}

/// Get the public key as hex from a signing key.
pub fn public_key_hex(key: &SigningKey) -> String {
    let verifying: VerifyingKey = key.verifying_key();
    hex::encode(verifying.to_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_canonicalize_json() {
        let fields = [("name", "John Doe"), ("school", "Alabama"), ("dob", "2005-03-15")];
        let result = canonicalize_json(&fields);
        assert_eq!(result, r#"{"dob":"2005-03-15","name":"john doe","school":"alabama"}"#);
    }

    #[test]
    fn test_hash_sha256() {
        let hash = hash_sha256(b"hello");
        assert_eq!(hash.len(), 64); // 32 bytes = 64 hex chars
    }

    #[test]
    fn test_sign_and_verify() {
        let mut csprng = rand::rngs::OsRng;
        let key = SigningKey::generate(&mut csprng);
        let sig = sign_ed25519(&key, b"test data");
        assert_eq!(sig.len(), 128); // 64 bytes = 128 hex chars
    }

    #[test]
    fn test_public_key_hex() {
        let mut csprng = rand::rngs::OsRng;
        let key = SigningKey::generate(&mut csprng);
        let pk = public_key_hex(&key);
        assert_eq!(pk.len(), 64); // 32 bytes = 64 hex chars
    }
}
