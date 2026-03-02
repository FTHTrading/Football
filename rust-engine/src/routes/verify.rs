use axum::{extract::State, Json};
use crate::errors::AppResult;
use crate::hashing;
use crate::models::{AppState, VerifyReceiptRequest, VerifyReceiptResponse};
use crate::scoring;

/// POST /receipt/verify
/// Verifies the Ed25519 signature on a previously issued deal receipt.
/// Returns whether the signature is valid, along with verification metadata.
pub async fn verify(
    State(state): State<AppState>,
    Json(req): Json<VerifyReceiptRequest>,
) -> AppResult<Json<VerifyReceiptResponse>> {
    let is_valid = scoring::verify_receipt_signature(
        &state.keypair,
        &req.deal_hash,
        &req.signature,
    );

    let public_key = hashing::public_key_hex(&state.keypair);

    let response = VerifyReceiptResponse {
        valid: is_valid,
        receipt_id: req.receipt_id,
        verified_at: chrono::Utc::now().to_rfc3339(),
        reason: if is_valid {
            Some(format!(
                "Signature verified against public key {}...{}",
                &public_key[..8],
                &public_key[public_key.len() - 8..]
            ))
        } else {
            Some("Signature verification failed — deal hash or signature may be tampered".into())
        },
    };

    Ok(Json(response))
}
