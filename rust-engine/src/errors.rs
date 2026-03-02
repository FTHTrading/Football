use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("signing error: {0}")]
    Signing(String),

    #[error("validation error: {0}")]
    Validation(String),

    #[error("unauthorized: {0}")]
    Unauthorized(String),

    #[error("not found: {0}")]
    NotFound(String),

    #[error("internal error: {0}")]
    Internal(#[from] anyhow::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::Database(e) => {
                tracing::error!("Database error: {e}");
                (StatusCode::INTERNAL_SERVER_ERROR, "database error".to_string())
            }
            AppError::Signing(msg) => {
                tracing::error!("Signing error: {msg}");
                (StatusCode::INTERNAL_SERVER_ERROR, msg.clone())
            }
            AppError::Validation(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg.clone()),
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
            AppError::Internal(e) => {
                tracing::error!("Internal error: {e}");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
        };

        let body = json!({
            "error": true,
            "message": message,
        });

        (status, Json(body)).into_response()
    }
}

pub type AppResult<T> = Result<T, AppError>;
