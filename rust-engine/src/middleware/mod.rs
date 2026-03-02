use axum::{
    extract::Request,
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use hmac::{Hmac, Mac};
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

/// HMAC authentication middleware.
/// Expects header `X-UC-Signature` containing HMAC-SHA256(request_path, secret).
/// The Next.js frontend computes this before calling the Rust engine.
pub async fn verify_hmac(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    // Extract HMAC secret from app state extension
    let hmac_secret = request
        .extensions()
        .get::<HmacSecret>()
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;

    let signature = request
        .headers()
        .get("X-UC-Signature")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let path = request.uri().path().to_string();

    // Verify HMAC
    let mut mac = HmacSha256::new_from_slice(hmac_secret.0.as_bytes())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    mac.update(path.as_bytes());

    let expected = hex::encode(mac.finalize().into_bytes());

    if !constant_time_eq(signature.as_bytes(), expected.as_bytes()) {
        tracing::warn!(path = %path, "HMAC verification failed");
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(next.run(request).await)
}

/// Constant-time comparison to prevent timing attacks.
fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    a.iter()
        .zip(b.iter())
        .fold(0u8, |acc, (x, y)| acc | (x ^ y))
        == 0
}

/// Wrapper type to inject HMAC secret into request extensions.
#[derive(Clone)]
pub struct HmacSecret(pub String);

/// Rate limiting configuration — applied at the router level via Governor.
/// See router.rs for integration.
pub fn rate_limit_layer(
    rpm: u32,
) -> governor::GovernorLayer<
    governor::middleware::NoOpMiddleware<governor::clock::QuantaInstant>,
> {
    let config = governor::GovernorConfigBuilder::default()
        .per_second(60 / rpm.max(1) as u64)
        .burst_size(rpm.max(1))
        .finish()
        .expect("Failed to build rate limiter config");

    governor::GovernorLayer {
        config: std::sync::Arc::new(config),
    }
}
