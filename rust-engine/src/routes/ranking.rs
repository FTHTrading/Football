use axum::{extract::{Query, State}, Json};
use crate::errors::AppResult;
use crate::models::{AppState, RankingSnapshot};
use crate::ranking;

#[derive(serde::Deserialize)]
pub struct RankingQuery {
    pub metric: String,
}

/// GET /ranking/recompute?metric=qb_index
/// Recomputes percentile rankings for the specified metric.
pub async fn recompute(
    State(state): State<AppState>,
    Query(query): Query<RankingQuery>,
) -> AppResult<Json<RankingSnapshot>> {
    let snapshot = ranking::compute_percentiles(&state.db, &query.metric).await?;
    Ok(Json(snapshot))
}
