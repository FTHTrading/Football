use crate::errors::AppResult;
use crate::models::{PercentileEntry, RankingSnapshot, RankingSnapshotRow};
use sqlx::PgPool;

/// Compute percentile rankings for a given metric by reading values from
/// the ranking_snapshots table and assigning percentile positions.
pub async fn compute_percentiles(
    db: &PgPool,
    metric: &str,
) -> AppResult<RankingSnapshot> {
    // Fetch all values for this metric, ordered descending
    let rows: Vec<RankingSnapshotRow> = sqlx::query_as::<_, RankingSnapshotRow>(
        r#"
        SELECT DISTINCT ON (athlete_id)
            id, metric, athlete_id, value, percentile, rank, computed_at
        FROM ranking_snapshots
        WHERE metric = $1
        ORDER BY athlete_id, computed_at DESC
        "#,
    )
    .bind(metric)
    .fetch_all(db)
    .await?;

    if rows.is_empty() {
        return Ok(RankingSnapshot {
            metric: metric.to_string(),
            total_athletes: 0,
            percentiles: vec![],
            computed_at: chrono::Utc::now().to_rfc3339(),
        });
    }

    // Sort by value descending for ranking
    let mut entries: Vec<(String, f64)> = rows
        .iter()
        .map(|r| (r.athlete_id.clone(), r.value))
        .collect();
    entries.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

    let total = entries.len() as f64;
    let percentiles: Vec<PercentileEntry> = entries
        .iter()
        .enumerate()
        .map(|(i, (id, val))| {
            let percentile = ((total - i as f64) / total) * 100.0;
            PercentileEntry {
                athlete_id: id.clone(),
                value: *val,
                percentile: (percentile * 10.0).round() / 10.0,
                rank: (i + 1) as i64,
            }
        })
        .collect();

    // Persist updated percentiles
    for p in &percentiles {
        sqlx::query(
            r#"
            INSERT INTO ranking_snapshots (id, metric, athlete_id, value, percentile, rank, computed_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            "#,
        )
        .bind(uuid::Uuid::new_v4())
        .bind(metric)
        .bind(&p.athlete_id)
        .bind(p.value)
        .bind(p.percentile)
        .bind(p.rank)
        .execute(db)
        .await?;
    }

    Ok(RankingSnapshot {
        metric: metric.to_string(),
        total_athletes: percentiles.len() as i64,
        percentiles,
        computed_at: chrono::Utc::now().to_rfc3339(),
    })
}
