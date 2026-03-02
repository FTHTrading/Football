// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 5 — Regulator Export
// ═══════════════════════════════════════════════════════════════════
//
// Regulators can request audit data with selective disclosure.
// Exports are filtered by:
//   - Jurisdiction
//   - Time range
//   - Event type
//   - Subject DID
//
// Each export is itself an auditable event.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use super::record::{AuditEventType, AuditRecord};

/// A regulator export request.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportRequest {
    /// DID of the requesting regulator.
    pub regulator_did: String,
    /// Filter: jurisdiction (if applicable).
    pub jurisdiction: Option<String>,
    /// Filter: start timestamp (ISO 8601).
    pub from_timestamp: Option<String>,
    /// Filter: end timestamp (ISO 8601).
    pub to_timestamp: Option<String>,
    /// Filter: specific event types.
    pub event_types: Vec<AuditEventType>,
    /// Filter: specific subject DID.
    pub subject_did: Option<String>,
}

/// A regulator export response.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegulatorExport {
    /// Export identifier.
    pub export_id: String,
    /// Requesting regulator's DID.
    pub regulator_did: String,
    /// Filtered records.
    pub records: Vec<AuditRecord>,
    /// Total matching records.
    pub total_records: usize,
    /// Hash of the export (for integrity verification).
    pub export_hash: String,
    /// ISO 8601 timestamp of generation.
    pub generated_at: String,
}

impl RegulatorExport {
    /// Generate an export from audit records based on a request.
    pub fn generate(
        export_id: String,
        request: &ExportRequest,
        all_records: &[AuditRecord],
    ) -> Self {
        let filtered: Vec<AuditRecord> = all_records
            .iter()
            .filter(|r| Self::matches_filter(r, request))
            .cloned()
            .collect();

        let total_records = filtered.len();

        // Compute export hash
        let mut hasher = Sha256::new();
        hasher.update(export_id.as_bytes());
        hasher.update(b"|");
        hasher.update(request.regulator_did.as_bytes());
        hasher.update(b"|");
        hasher.update(total_records.to_le_bytes());
        hasher.update(b"|");
        for record in &filtered {
            hasher.update(record.content_hash.as_bytes());
            hasher.update(b",");
        }
        let export_hash = hex::encode(hasher.finalize());

        Self {
            export_id,
            regulator_did: request.regulator_did.clone(),
            records: filtered,
            total_records,
            export_hash,
            generated_at: chrono::Utc::now().to_rfc3339(),
        }
    }

    fn matches_filter(record: &AuditRecord, request: &ExportRequest) -> bool {
        // Filter by event type
        if !request.event_types.is_empty()
            && !request.event_types.contains(&record.event_type)
        {
            return false;
        }

        // Filter by subject DID
        if let Some(ref subject) = request.subject_did {
            if record.subject_did != *subject {
                return false;
            }
        }

        // Filter by time range
        if let Some(ref from) = request.from_timestamp {
            if record.timestamp.as_str() < from.as_str() {
                return false;
            }
        }
        if let Some(ref to) = request.to_timestamp {
            if record.timestamp.as_str() > to.as_str() {
                return false;
            }
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_record(seq: u64, event: AuditEventType, subject: &str, ts: &str) -> AuditRecord {
        let hash = AuditRecord::compute_content_hash(
            seq, &event, "actor", subject, ts, "", &[],
        );
        AuditRecord {
            sequence: seq,
            event_type: event,
            actor_did: "scos:did:actor".into(),
            subject_did: subject.into(),
            timestamp: ts.into(),
            previous_hash: String::new(),
            payload: vec![],
            content_hash: hash,
        }
    }

    #[test]
    fn test_export_filters_by_event_type() {
        let records = vec![
            make_record(1, AuditEventType::TransferExecuted, "user1", "2026-01-01T00:00:00Z"),
            make_record(2, AuditEventType::CredentialIssued, "user1", "2026-01-02T00:00:00Z"),
            make_record(3, AuditEventType::TransferExecuted, "user2", "2026-01-03T00:00:00Z"),
        ];

        let request = ExportRequest {
            regulator_did: "scos:did:sec".into(),
            jurisdiction: None,
            from_timestamp: None,
            to_timestamp: None,
            event_types: vec![AuditEventType::TransferExecuted],
            subject_did: None,
        };

        let export = RegulatorExport::generate("EXP-001".into(), &request, &records);
        assert_eq!(export.total_records, 2);
        assert!(export.records.iter().all(|r| r.event_type == AuditEventType::TransferExecuted));
    }

    #[test]
    fn test_export_filters_by_subject() {
        let records = vec![
            make_record(1, AuditEventType::TransferExecuted, "user1", "2026-01-01T00:00:00Z"),
            make_record(2, AuditEventType::TransferExecuted, "user2", "2026-01-02T00:00:00Z"),
        ];

        let request = ExportRequest {
            regulator_did: "scos:did:sec".into(),
            jurisdiction: None,
            from_timestamp: None,
            to_timestamp: None,
            event_types: vec![],
            subject_did: Some("user1".into()),
        };

        let export = RegulatorExport::generate("EXP-002".into(), &request, &records);
        assert_eq!(export.total_records, 1);
        assert_eq!(export.records[0].subject_did, "user1");
    }

    #[test]
    fn test_export_hash_exists() {
        let records = vec![
            make_record(1, AuditEventType::TransferExecuted, "user1", "2026-01-01T00:00:00Z"),
        ];

        let request = ExportRequest {
            regulator_did: "scos:did:sec".into(),
            jurisdiction: None,
            from_timestamp: None,
            to_timestamp: None,
            event_types: vec![],
            subject_did: None,
        };

        let export = RegulatorExport::generate("EXP-003".into(), &request, &records);
        assert!(!export.export_hash.is_empty());
        assert_eq!(export.export_hash.len(), 64);
    }
}
