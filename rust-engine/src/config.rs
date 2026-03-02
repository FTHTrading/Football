use anyhow::{Context, Result};

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub database_url: String,
    pub hmac_secret: String,
    pub signing_key_path: String,
    pub cors_origin: String,
    pub rate_limit_rpm: u32,
}

impl AppConfig {
    pub fn from_env() -> Result<Self> {
        Ok(Self {
            host: std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into()),
            port: std::env::var("PORT")
                .unwrap_or_else(|_| "8080".into())
                .parse()
                .context("PORT must be a valid u16")?,
            database_url: std::env::var("DATABASE_URL")
                .context("DATABASE_URL is required")?,
            hmac_secret: std::env::var("HMAC_SECRET")
                .context("HMAC_SECRET is required")?,
            signing_key_path: std::env::var("SIGNING_KEY_PATH")
                .unwrap_or_else(|_| "./keys/signing.key".into()),
            cors_origin: std::env::var("CORS_ORIGIN")
                .unwrap_or_else(|_| "http://localhost:3000".into()),
            rate_limit_rpm: std::env::var("RATE_LIMIT_RPM")
                .unwrap_or_else(|_| "120".into())
                .parse()
                .unwrap_or(120),
        })
    }
}
