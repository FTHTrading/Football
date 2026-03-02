use axum::{extract::{Query, State}, Json};
use crate::errors::AppResult;
use crate::models::{AppState, ScrapeResult};
use crate::scraping;

#[derive(serde::Deserialize)]
pub struct ScrapeQuery {
    pub source: Option<String>,
}

/// GET /scrape/run?source=rivals
/// Triggers a scrape operation for the given source.
pub async fn run(
    State(state): State<AppState>,
    Query(query): Query<ScrapeQuery>,
) -> AppResult<Json<ScrapeResult>> {
    let source = query.source.unwrap_or_else(|| "rivals".into());
    let result = scraping::run_scrape(&state.db, &source).await?;
    Ok(Json(result))
}
