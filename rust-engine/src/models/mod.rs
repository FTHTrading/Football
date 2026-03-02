use crate::config::AppConfig;
use ed25519_dalek::SigningKey;
use sqlx::PgPool;
use std::sync::Arc;

// ── Shared application state ──────────────────────────────────
#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub config: AppConfig,
    pub keypair: Arc<SigningKey>,
}

// ── Identity ──────────────────────────────────────────────────
#[derive(Debug, serde::Deserialize)]
pub struct IdentityHashRequest {
    pub athlete_id: String,
    pub full_name: String,
    pub dob: String,
    pub school: String,
}

#[derive(Debug, serde::Serialize)]
pub struct IdentityHashResponse {
    pub athlete_id: String,
    pub identity_hash: String,
    pub signature: String,
    pub public_key: String,
    pub timestamp: String,
}

// ── NIL Receipts ──────────────────────────────────────────────
#[derive(Debug, serde::Deserialize)]
pub struct NilReceiptRequest {
    pub athlete_id: String,
    pub brand: String,
    pub amount_cents: i64,
    pub deal_type: String,
    pub state: String,
    pub duration_days: i32,
}

#[derive(Debug, serde::Serialize)]
pub struct NilReceiptResponse {
    pub receipt_id: String,
    pub athlete_id: String,
    pub deal_hash: String,
    pub signature: String,
    pub compliance: ComplianceResult,
    pub timestamp: String,
}

// ── Compliance ────────────────────────────────────────────────
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ComplianceResult {
    pub status: ComplianceStatus,
    pub state: String,
    pub warnings: Vec<String>,
    pub blocked_reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum ComplianceStatus {
    Pass,
    Warn,
    Fail,
}

// ── Ranking ───────────────────────────────────────────────────
#[derive(Debug, serde::Serialize)]
pub struct RankingSnapshot {
    pub metric: String,
    pub total_athletes: i64,
    pub percentiles: Vec<PercentileEntry>,
    pub computed_at: String,
}

#[derive(Debug, serde::Serialize)]
pub struct PercentileEntry {
    pub athlete_id: String,
    pub value: f64,
    pub percentile: f64,
    pub rank: i64,
}

// ── Scraping ──────────────────────────────────────────────────
#[derive(Debug, serde::Serialize)]
pub struct ScrapeResult {
    pub source: String,
    pub articles_found: usize,
    pub articles_stored: usize,
    pub errors: Vec<String>,
}

// ── Health ────────────────────────────────────────────────────
#[derive(Debug, serde::Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub version: String,
    pub database: String,
}

// ── Scoring / Valuation (33-factor engine) ────────────────────
#[derive(Debug, serde::Deserialize)]
pub struct ScoringRequest {
    pub athlete_id: String,
    pub name: String,
    pub position: String,
    pub school: String,
    pub state: String,
    pub conference: String,
    /// Social media followers across platforms
    pub followers: i64,
    /// Average engagement rate (0.0–1.0)
    pub engagement_rate: f64,
    /// Proposed deal amount in cents
    pub proposed_amount_cents: i64,
    /// Optional: position-specific stats (JSON object)
    pub stats: Option<serde_json::Value>,
}

#[derive(Debug, serde::Serialize)]
pub struct ScoringResponse {
    pub athlete_id: String,
    pub name: String,
    pub composite_score: i32,
    pub factors: ScoringFactors,
    pub valuation: ValuationBand,
    pub proposed_amount_cents: i64,
    pub overpay_cents: i64,
    pub compliance: ComplianceResult,
    pub receipt_id: String,
    pub signature: String,
    pub timestamp: String,
}

#[derive(Debug, serde::Serialize)]
pub struct ScoringFactors {
    pub social: i32,
    pub athletic: i32,
    pub market: i32,
    pub brand: i32,
}

#[derive(Debug, serde::Serialize)]
pub struct ValuationBand {
    pub low_cents: i64,
    pub high_cents: i64,
}

// ── Receipt Verification ──────────────────────────────────────
#[derive(Debug, serde::Deserialize)]
pub struct VerifyReceiptRequest {
    pub receipt_id: String,
    pub deal_hash: String,
    pub signature: String,
}

#[derive(Debug, serde::Serialize)]
pub struct VerifyReceiptResponse {
    pub valid: bool,
    pub receipt_id: String,
    pub verified_at: String,
    pub reason: Option<String>,
}

// ── Database row types ────────────────────────────────────────
#[derive(Debug, sqlx::FromRow)]
pub struct ProfileLedgerRow {
    pub id: uuid::Uuid,
    pub athlete_id: String,
    pub identity_hash: String,
    pub signature: String,
    pub public_key: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct NilReceiptRow {
    pub id: uuid::Uuid,
    pub athlete_id: String,
    pub brand: String,
    pub amount_cents: i64,
    pub deal_type: String,
    pub state: String,
    pub deal_hash: String,
    pub signature: String,
    pub compliance_status: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct ScrapedEventRow {
    pub id: uuid::Uuid,
    pub source: String,
    pub title: String,
    pub url: String,
    pub summary: Option<String>,
    pub scraped_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct RankingSnapshotRow {
    pub id: uuid::Uuid,
    pub metric: String,
    pub athlete_id: String,
    pub value: f64,
    pub percentile: f64,
    pub rank: i64,
    pub computed_at: chrono::DateTime<chrono::Utc>,
}
