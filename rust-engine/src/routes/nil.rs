use axum::{extract::State, Json};
use crate::errors::AppResult;
use crate::models::{AppState, NilReceiptRequest, NilReceiptResponse};
use crate::services;

/// POST /nil/receipt
/// Creates a signed NIL deal receipt with compliance validation.
pub async fn create_receipt(
    State(state): State<AppState>,
    Json(req): Json<NilReceiptRequest>,
) -> AppResult<Json<NilReceiptResponse>> {
    let response = services::create_nil_receipt(&state.db, &state.keypair, req).await?;
    Ok(Json(response))
}
