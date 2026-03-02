use axum::{extract::State, Json};
use crate::errors::AppResult;
use crate::models::{AppState, HealthResponse};

pub async fn health(State(state): State<AppState>) -> AppResult<Json<HealthResponse>> {
    Ok(Json(HealthResponse {
        status: "ok".into(),
        version: env!("CARGO_PKG_VERSION").into(),
        database: "connected".into(),
    }))
}

pub async fn ready(State(state): State<AppState>) -> AppResult<Json<HealthResponse>> {
    // Verify database connectivity
    sqlx::query("SELECT 1")
        .execute(&state.db)
        .await?;

    Ok(Json(HealthResponse {
        status: "ready".into(),
        version: env!("CARGO_PKG_VERSION").into(),
        database: "connected".into(),
    }))
}
