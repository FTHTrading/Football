// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 5 — Audit Record
// ═══════════════════════════════════════════════════════════════════
//
// Every SCOS action (transfer, freeze, credential issuance, policy
// evaluation) produces an immutable AuditRecord.
//
// Records are append-only. Each record has a SHA-256 content hash
// and references the previous record's hash (chain linking).

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

/// Type of auditable event.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AuditEventType {
    /// DID registered.
    IdentityRegistered,
    /// DID revoked.
    IdentityRevoked,
    /// Credential issued.
    CredentialIssued,
    /// Credential revoked.
    CredentialRevoked,
    /// Policy evaluation performed.
    PolicyEvaluated,
    /// Transfer executed.
    TransferExecuted,
    /// Transfer denied.
    TransferDenied,
    /// Instrument created.
    InstrumentCreated,
    /// Freeze order issued.
    FreezeIssued,
    /// Freeze order lifted.
    FreezeLifted,
    /// Ruleset published.
    RulesetPublished,
    /// Agent mandate created.
    MandateCreated,
    /// Agent mandate revoked.
    MandateRevoked,
    /// Regulator export generated.
    RegulatorExport,
}

/// An immutable audit record.
///
/// Records are chain-linked: each references the previous record's hash.
/// This creates a tamper-evident append-only log.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditRecord {
    /// Unique record identifier (sequential).
    pub sequence: u64,
    /// Event type.
    pub event_type: AuditEventType,
    /// DID of the actor who triggered the event.
    pub actor_did: String,
    /// DID of the subject (affected entity).
    pub subject_did: String,
    /// ISO 8601 timestamp.
    pub timestamp: String,
    /// Hash of the previous record (chain linking). Empty for first record.
    pub previous_hash: String,
    /// Key-value payload (event-specific data).
    pub payload: Vec<(String, String)>,
    /// SHA-256 content hash of this record.
    pub content_hash: String,
}

impl AuditRecord {
    /// Compute the content hash for an audit record.
    ///
    /// Hash = SHA-256(sequence || event_type || actor || subject || timestamp || previous_hash || sorted_payload)
    pub fn compute_content_hash(
        sequence: u64,
        event_type: &AuditEventType,
        actor_did: &str,
        subject_did: &str,
        timestamp: &str,
        previous_hash: &str,
        payload: &[(String, String)],
    ) -> String {
        let mut hasher = Sha256::new();
        hasher.update(sequence.to_le_bytes());
        hasher.update(b"|");
        hasher.update(format!("{:?}", event_type).as_bytes());
        hasher.update(b"|");
        hasher.update(actor_did.as_bytes());
        hasher.update(b"|");
        hasher.update(subject_did.as_bytes());
        hasher.update(b"|");
        hasher.update(timestamp.as_bytes());
        hasher.update(b"|");
        hasher.update(previous_hash.as_bytes());
        hasher.update(b"|");

        // Sort payload for determinism
        let mut sorted: Vec<(String, String)> = payload.to_vec();
        sorted.sort_by(|a, b| a.0.cmp(&b.0));
        for (k, v) in &sorted {
            hasher.update(k.as_bytes());
            hasher.update(b"=");
            hasher.update(v.as_bytes());
            hasher.update(b",");
        }

        hex::encode(hasher.finalize())
    }
}

/// Append-only audit log.
///
/// Phase 1: In-memory.
/// Phase 2: PostgreSQL-backed with WAL guarantees.
pub struct AuditLog {
    records: Vec<AuditRecord>,
    next_sequence: u64,
}

impl AuditLog {
    pub fn new() -> Self {
        Self {
            records: Vec::new(),
            next_sequence: 1,
        }
    }

    /// Append a new audit record.
    ///
    /// The record's content hash is computed automatically.
    /// The previous_hash is set to the last record's hash (or empty string).
    pub fn append(
        &mut self,
        event_type: AuditEventType,
        actor_did: String,
        subject_did: String,
        payload: Vec<(String, String)>,
    ) -> &AuditRecord {
        let previous_hash = self
            .records
            .last()
            .map(|r| r.content_hash.clone())
            .unwrap_or_default();

        let timestamp = chrono::Utc::now().to_rfc3339();
        let sequence = self.next_sequence;

        let content_hash = AuditRecord::compute_content_hash(
            sequence,
            &event_type,
            &actor_did,
            &subject_did,
            &timestamp,
            &previous_hash,
            &payload,
        );

        let record = AuditRecord {
            sequence,
            event_type,
            actor_did,
            subject_did,
            timestamp,
            previous_hash,
            payload,
            content_hash,
        };

        self.records.push(record);
        self.next_sequence += 1;

        self.records.last().unwrap()
    }

    /// Get all records.
    pub fn records(&self) -> &[AuditRecord] {
        &self.records
    }

    /// Get a record by sequence number.
    pub fn get(&self, sequence: u64) -> Option<&AuditRecord> {
        self.records.iter().find(|r| r.sequence == sequence)
    }

    /// Total number of records.
    pub fn count(&self) -> u64 {
        self.records.len() as u64
    }

    /// Verify chain integrity: each record's previous_hash matches the preceding record.
    pub fn verify_chain(&self) -> bool {
        for i in 1..self.records.len() {
            if self.records[i].previous_hash != self.records[i - 1].content_hash {
                return false;
            }
        }
        true
    }

    /// Get all record content hashes (for Merkle tree computation).
    pub fn hashes(&self) -> Vec<String> {
        self.records.iter().map(|r| r.content_hash.clone()).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_content_hash_deterministic() {
        let h1 = AuditRecord::compute_content_hash(
            1,
            &AuditEventType::TransferExecuted,
            "scos:did:actor",
            "scos:did:subject",
            "2026-01-01T00:00:00Z",
            "",
            &[("key".into(), "value".into())],
        );
        let h2 = AuditRecord::compute_content_hash(
            1,
            &AuditEventType::TransferExecuted,
            "scos:did:actor",
            "scos:did:subject",
            "2026-01-01T00:00:00Z",
            "",
            &[("key".into(), "value".into())],
        );
        assert_eq!(h1, h2);
    }

    #[test]
    fn test_append_and_chain_linking() {
        let mut log = AuditLog::new();

        log.append(
            AuditEventType::IdentityRegistered,
            "scos:did:admin".into(),
            "scos:did:user1".into(),
            vec![("type".into(), "HUMAN".into())],
        );

        log.append(
            AuditEventType::CredentialIssued,
            "scos:did:issuer".into(),
            "scos:did:user1".into(),
            vec![("credential_type".into(), "KYC".into())],
        );

        assert_eq!(log.count(), 2);

        // Chain integrity
        let r1 = log.get(1).unwrap();
        let r2 = log.get(2).unwrap();
        assert!(r1.previous_hash.is_empty()); // First record
        assert_eq!(r2.previous_hash, r1.content_hash); // Chain link
        assert!(log.verify_chain());
    }

    #[test]
    fn test_payload_order_independent_hash() {
        let h1 = AuditRecord::compute_content_hash(
            1,
            &AuditEventType::TransferExecuted,
            "actor",
            "subject",
            "ts",
            "",
            &[("b".into(), "2".into()), ("a".into(), "1".into())],
        );
        let h2 = AuditRecord::compute_content_hash(
            1,
            &AuditEventType::TransferExecuted,
            "actor",
            "subject",
            "ts",
            "",
            &[("a".into(), "1".into()), ("b".into(), "2".into())],
        );
        assert_eq!(h1, h2, "Payload order must not affect hash");
    }
}
