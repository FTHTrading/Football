use axum::{extract::State, Json};
use crate::errors::AppResult;
use crate::models::{AppState, IdentityHashRequest, IdentityHashResponse};
use crate::services;

/// POST /identity/hash
/// Creates a canonical identity hash for an athlete profile and signs it.
pub async fn create_hash(
    State(state): State<AppState>,
    Json(req): Json<IdentityHashRequest>,
) -> AppResult<Json<IdentityHashResponse>> {
    let response = services::create_identity_hash(&state.db, &state.keypair, req).await?;
    Ok(Json(response))
}
