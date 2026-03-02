use axum::{extract::State, Json};
use crate::errors::AppResult;
use crate::models::{AppState, ScoringRequest, ScoringResponse};
use crate::scoring;

/// POST /scoring/evaluate
/// Runs the 33-factor deterministic scoring engine on an athlete deal.
/// Returns composite score, factor breakdown, valuation band, overpay amount,
/// compliance result, and an Ed25519-signed receipt.
pub async fn evaluate(
    State(state): State<AppState>,
    Json(req): Json<ScoringRequest>,
) -> AppResult<Json<ScoringResponse>> {
    let response = scoring::evaluate_deal(&state.db, &state.keypair, req).await?;
    Ok(Json(response))
}
