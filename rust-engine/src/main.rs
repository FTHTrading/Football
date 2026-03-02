use std::net::SocketAddr;
use std::sync::Arc;
use tracing::info;

mod config;
mod errors;
mod router;

mod blockchain;
mod compliance;
mod db;
mod hashing;
mod middleware;
mod models;
mod ranking;
mod routes;
mod scoring;
mod scraping;
mod services;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load .env
    dotenvy::dotenv().ok();

    // Initialize structured logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "under_center_engine=info,tower_http=info".into()),
        )
        .json()
        .init();

    // Load and validate configuration
    let config = config::AppConfig::from_env()?;
    info!(
        host = %config.host,
        port = %config.port,
        "Starting Under Center Engine"
    );

    // Connect to database
    let pool = db::connect(&config.database_url).await?;
    info!("Database connected");

    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;
    info!("Migrations applied");

    // Load signing keypair
    let keypair = hashing::load_or_generate_keypair(&config.signing_key_path)?;
    info!("Signing keypair loaded");

    // Build application state
    let state = models::AppState {
        db: pool,
        config: config.clone(),
        keypair: Arc::new(keypair),
    };

    // Build router
    let app = router::build(state);

    // Bind and serve
    let addr: SocketAddr = format!("{}:{}", config.host, config.port).parse()?;
    info!(%addr, "Listening");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    info!("Server shut down gracefully");
    Ok(())
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("Failed to install CTRL+C signal handler");
    info!("Shutdown signal received");
}
