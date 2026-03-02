// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Real-Time Revocation List
// ═══════════════════════════════════════════════════════════════════
//
// Credentials can be revoked independently of their expiry.
// Revocation is immediate and hash-anchored.
// Every policy evaluation checks the revocation list.

use std::collections::HashMap;
use chrono::Utc;
use serde::{Deserialize, Serialize};

/// A revocation entry.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RevocationEntry {
    pub credential_id: String,
    pub revoked_at: String,
    pub reason: String,
    pub revoked_by: String, // DID of the revoker
}

/// Real-time credential revocation list.
///
/// In production, this is backed by PostgreSQL with a
/// hash-anchored changelog. In-memory for Phase 1.
pub struct RevocationList {
    entries: HashMap<String, RevocationEntry>,
}

impl RevocationList {
    pub fn new() -> Self {
        Self {
            entries: HashMap::new(),
        }
    }

    /// Revoke a credential. Idempotent — revoking twice is a no-op.
    pub fn revoke(&mut self, credential_id: &str, reason: String, revoked_by: String) {
        if self.entries.contains_key(credential_id) {
            return; // Already revoked
        }
        self.entries.insert(
            credential_id.to_string(),
            RevocationEntry {
                credential_id: credential_id.to_string(),
                revoked_at: Utc::now().to_rfc3339(),
                reason,
                revoked_by,
            },
        );
    }

    /// Check if a credential has been revoked.
    pub fn is_revoked(&self, credential_id: &str) -> bool {
        self.entries.contains_key(credential_id)
    }

    /// Get the revocation entry for a credential, if revoked.
    pub fn get_entry(&self, credential_id: &str) -> Option<&RevocationEntry> {
        self.entries.get(credential_id)
    }

    /// Total revoked credentials.
    pub fn count(&self) -> usize {
        self.entries.len()
    }
}

impl Default for RevocationList {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_revoke_and_check() {
        let mut rl = RevocationList::new();
        assert!(!rl.is_revoked("CRED-001"));

        rl.revoke("CRED-001", "Fraud detected".into(), "scos:did:admin".into());
        assert!(rl.is_revoked("CRED-001"));
        assert_eq!(rl.count(), 1);

        let entry = rl.get_entry("CRED-001").unwrap();
        assert_eq!(entry.reason, "Fraud detected");
    }

    #[test]
    fn test_idempotent_revocation() {
        let mut rl = RevocationList::new();
        rl.revoke("CRED-002", "Reason 1".into(), "admin".into());
        rl.revoke("CRED-002", "Reason 2".into(), "admin".into());
        assert_eq!(rl.count(), 1);
        // First reason should persist
        assert_eq!(rl.get_entry("CRED-002").unwrap().reason, "Reason 1");
    }
}
