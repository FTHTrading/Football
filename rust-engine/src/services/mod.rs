//! Business logic layer — coordinates between routes, database, and domain modules.

use crate::compliance;
use crate::errors::AppResult;
use crate::hashing;
use crate::models::*;
use ed25519_dalek::SigningKey;
use sqlx::PgPool;

/// Create an identity hash for an athlete profile.
pub async fn create_identity_hash(
    db: &PgPool,
    keypair: &SigningKey,
    req: IdentityHashRequest,
) -> AppResult<IdentityHashResponse> {
    let canonical = hashing::canonicalize_json(&[
        ("athlete_id", &req.athlete_id),
        ("full_name", &req.full_name),
        ("dob", &req.dob),
        ("school", &req.school),
    ]);

    let identity_hash = hashing::hash_sha256(canonical.as_bytes());
    let signature = hashing::sign_ed25519(keypair, identity_hash.as_bytes());
    let public_key = hashing::public_key_hex(keypair);
    let now = chrono::Utc::now();

    // Persist to ledger
    sqlx::query(
        r#"
        INSERT INTO profile_ledger (id, athlete_id, identity_hash, signature, public_key, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(uuid::Uuid::new_v4())
    .bind(&req.athlete_id)
    .bind(&identity_hash)
    .bind(&signature)
    .bind(&public_key)
    .bind(now)
    .execute(db)
    .await?;

    Ok(IdentityHashResponse {
        athlete_id: req.athlete_id,
        identity_hash,
        signature,
        public_key,
        timestamp: now.to_rfc3339(),
    })
}

/// Create and sign an NIL deal receipt with compliance check.
pub async fn create_nil_receipt(
    db: &PgPool,
    keypair: &SigningKey,
    req: NilReceiptRequest,
) -> AppResult<NilReceiptResponse> {
    // Run compliance validation
    let compliance_result = compliance::validate_nil_deal(
        &req.state,
        req.amount_cents,
        &req.deal_type,
    );

    // Build deal hash
    let deal_data = hashing::canonicalize_json(&[
        ("athlete_id", &req.athlete_id),
        ("brand", &req.brand),
        ("amount_cents", &req.amount_cents.to_string()),
        ("deal_type", &req.deal_type),
        ("state", &req.state),
        ("duration_days", &req.duration_days.to_string()),
    ]);

    let deal_hash = hashing::hash_sha256(deal_data.as_bytes());
    let signature = hashing::sign_ed25519(keypair, deal_hash.as_bytes());
    let receipt_id = uuid::Uuid::new_v4();
    let now = chrono::Utc::now();

    // Persist receipt
    sqlx::query(
        r#"
        INSERT INTO nil_receipts
            (id, athlete_id, brand, amount_cents, deal_type, state, deal_hash, signature, compliance_status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        "#,
    )
    .bind(receipt_id)
    .bind(&req.athlete_id)
    .bind(&req.brand)
    .bind(req.amount_cents)
    .bind(&req.deal_type)
    .bind(&req.state)
    .bind(&deal_hash)
    .bind(&signature)
    .bind(format!("{:?}", compliance_result.status))
    .bind(now)
    .execute(db)
    .await?;

    Ok(NilReceiptResponse {
        receipt_id: receipt_id.to_string(),
        athlete_id: req.athlete_id,
        deal_hash,
        signature,
        compliance: compliance_result,
        timestamp: now.to_rfc3339(),
    })
}
