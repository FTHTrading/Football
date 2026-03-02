use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use crate::models::AppState;
use crate::routes;

/// Build the complete Axum router with all routes and middleware.
pub fn build(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(
            state
                .config
                .cors_origin
                .parse::<axum::http::HeaderValue>()
                .unwrap_or_else(|_| "http://localhost:3000".parse().unwrap()),
        )
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        // Health & readiness
        .route("/health", get(routes::health::health))
        .route("/ready", get(routes::health::ready))
        // Identity
        .route("/identity/hash", post(routes::identity::create_hash))
        // NIL
        .route("/nil/receipt", post(routes::nil::create_receipt))
        // Ranking
        .route("/ranking/recompute", get(routes::ranking::recompute))
        // Scraping
        .route("/scrape/run", get(routes::scrape::run))
        // Middleware
        .layer(cors)
        .with_state(state)
}
