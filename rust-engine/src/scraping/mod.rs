use crate::errors::AppResult;
use crate::models::{ScrapedEventRow, ScrapeResult};
use sqlx::PgPool;

/// Stub scraper that will eventually pull from recruiting news sources.
/// Currently returns an empty result — real implementation will use
/// reqwest + HTML parsing (scraper crate) to ingest articles.
pub async fn run_scrape(db: &PgPool, source: &str) -> AppResult<ScrapeResult> {
    tracing::info!("Scrape requested for source: {source}");

    // In production, this would:
    // 1. Fetch RSS/HTML from source URL
    // 2. Parse articles with titles, URLs, summaries
    // 3. Dedup against existing scraped_events
    // 4. Insert new events

    let existing: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM scraped_events WHERE source = $1")
        .bind(source)
        .fetch_one(db)
        .await?;

    Ok(ScrapeResult {
        source: source.to_string(),
        articles_found: 0,
        articles_stored: 0,
        errors: vec![format!(
            "Scraper not yet implemented. {existing} existing articles from this source."
        )],
    })
}
