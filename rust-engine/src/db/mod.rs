use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

/// Create a PostgreSQL connection pool.
pub async fn connect(database_url: &str) -> anyhow::Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url)
        .await?;

    tracing::info!("Database connection pool established");
    Ok(pool)
}
