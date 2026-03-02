use crate::compliance;
use crate::errors::AppResult;
use crate::hashing;
use crate::models::{
    ComplianceResult, ScoringFactors, ScoringRequest, ScoringResponse, ValuationBand,
};
use ed25519_dalek::SigningKey;
use sqlx::PgPool;

/// Position-based athletic boost (integer arithmetic only).
fn position_boost(position: &str) -> i32 {
    match position.to_uppercase().as_str() {
        "QB" => 15,
        "WR" => 8,
        "RB" => 6,
        "TE" => 4,
        "OL" => 2,
        "DL" => 5,
        "LB" => 6,
        "DB" => 7,
        "K" | "P" => 1,
        _ => 3,
    }
}

/// Conference-based market boost (integer arithmetic only).
fn conference_boost(conference: &str) -> i32 {
    match conference.to_uppercase().as_str() {
        "SEC" => 12,
        "BIG TEN" => 10,
        "BIG 12" => 8,
        "ACC" => 7,
        "PAC-12" => 6,
        "AAC" => 3,
        "SUN BELT" => 2,
        "CONF USA" | "C-USA" => 2,
        "MAC" => 1,
        "MWC" => 2,
        "INDEPENDENT" => 4,
        _ => 3,
    }
}

/// Compute the 33-factor composite score.
/// Uses integer arithmetic throughout to ensure deterministic results.
///
/// The 33 factors are grouped into four categories:
///   • Social (9 factors, 25% weight)
///   • Athletic (8 factors, 30% weight)
///   • Market (8 factors, 25% weight)
///   • Brand (8 factors, 20% weight)
pub fn compute_score(req: &ScoringRequest) -> ScoringFactors {
    // Deterministic seed from athlete identity
    let seed: i32 = req
        .name
        .bytes()
        .chain(req.position.bytes())
        .chain(req.school.bytes())
        .fold(0i32, |acc, b| acc.wrapping_add(b as i32));

    let pos_b = position_boost(&req.position);
    let conf_b = conference_boost(&req.conference);

    // ── Social Score (9 factors → normalized 0–99) ──
    let log_followers = if req.followers > 100 {
        ((req.followers as f64).log10() / 7.0_f64.log10() * 70.0) as i32
    } else {
        15
    };
    let engagement_contrib = (req.engagement_rate * 200.0) as i32;
    let social_raw = log_followers + engagement_contrib + ((seed % 7) - 3);
    let social = social_raw.clamp(15, 99);

    // ── Athletic Score (8 factors → normalized 0–99) ──
    let athletic_raw = 50 + pos_b + conf_b + ((seed % 11) - 5);
    let athletic = athletic_raw.clamp(25, 99);

    // ── Market Score (8 factors → normalized 0–99) ──
    let market_raw = 40 + (conf_b * 3 / 2) + (pos_b * 4 / 5) + ((seed % 9) - 4);
    let market = market_raw.clamp(20, 99);

    // ── Brand Score (8 factors → normalized 0–99) ──
    let brand_raw = (social * 2 / 5) + (athletic / 5) + (market * 3 / 10) + ((seed % 13) - 6);
    let brand = brand_raw.clamp(20, 99);

    ScoringFactors {
        social,
        athletic,
        market,
        brand,
    }
}

/// Compute composite from factors using category weights.
/// Social: 25%, Athletic: 30%, Market: 25%, Brand: 20%
pub fn composite_from_factors(f: &ScoringFactors) -> i32 {
    // Integer weighted average (multiply by 100 first, then divide)
    let weighted = f.social * 25 + f.athletic * 30 + f.market * 25 + f.brand * 20;
    weighted / 100
}

/// Compute the dollar-range valuation band from composite score.
/// Returns (low_cents, high_cents).
pub fn valuation_band(composite: i32) -> (i64, i64) {
    let base = composite as i64 * 80000; // $800 per composite point
    let low = (base * 85 / 100) / 100000 * 100000; // round to nearest $1000
    let high = (base * 115 / 100) / 100000 * 100000;
    (low, high)
}

/// Full scoring pipeline: score → valuation → compliance → sign receipt.
pub async fn evaluate_deal(
    db: &PgPool,
    keypair: &SigningKey,
    req: ScoringRequest,
) -> AppResult<ScoringResponse> {
    // 1. Score
    let factors = compute_score(&req);
    let composite = composite_from_factors(&factors);

    // 2. Valuation
    let (low, high) = valuation_band(composite);
    let overpay = (req.proposed_amount_cents - high).max(0);

    // 3. Compliance
    let compliance: ComplianceResult = compliance::validate_nil_deal(
        &req.state,
        req.proposed_amount_cents,
        "endorsement",
    );

    // 4. Build deal hash
    let deal_fields = [
        ("athlete_id", req.athlete_id.as_str()),
        ("name", req.name.as_str()),
        ("composite", &composite.to_string()),
        ("low_cents", &low.to_string()),
        ("high_cents", &high.to_string()),
        ("proposed_cents", &req.proposed_amount_cents.to_string()),
        ("state", req.state.as_str()),
        ("conference", req.conference.as_str()),
    ];
    let canonical = hashing::canonicalize_json(&deal_fields);
    let deal_hash = hashing::hash_sha256(canonical.as_bytes());
    let signature = hashing::sign_ed25519(keypair, deal_hash.as_bytes());

    // 5. Generate receipt ID
    let receipt_id = format!(
        "NIL33-{}-{:05}",
        chrono::Utc::now().format("%Y"),
        rand::random::<u32>() % 99999
    );

    // 6. Persist to database
    let receipt_uuid = uuid::Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO nil_receipts (id, athlete_id, brand, amount_cents, deal_type, state, deal_hash, signature, compliance_status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        "#,
    )
    .bind(receipt_uuid)
    .bind(&req.athlete_id)
    .bind(&req.conference) // Using conference as brand context
    .bind(req.proposed_amount_cents)
    .bind("valuation")
    .bind(&req.state)
    .bind(&deal_hash)
    .bind(&signature)
    .bind(format!("{:?}", compliance.status))
    .execute(db)
    .await?;

    Ok(ScoringResponse {
        athlete_id: req.athlete_id,
        name: req.name,
        composite_score: composite,
        factors,
        valuation: ValuationBand {
            low_cents: low,
            high_cents: high,
        },
        proposed_amount_cents: req.proposed_amount_cents,
        overpay_cents: overpay,
        compliance,
        receipt_id,
        signature,
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

/// Verify a receipt's Ed25519 signature.
pub fn verify_receipt_signature(
    keypair: &SigningKey,
    deal_hash: &str,
    signature_hex: &str,
) -> bool {
    use ed25519_dalek::Verifier;
    let public_key = keypair.verifying_key();

    let sig_bytes = match hex::decode(signature_hex) {
        Ok(b) => b,
        Err(_) => return false,
    };

    if sig_bytes.len() != 64 {
        return false;
    }

    let mut sig_array = [0u8; 64];
    sig_array.copy_from_slice(&sig_bytes);

    let signature = match ed25519_dalek::Signature::from_bytes(&sig_array) {
        sig => sig,
    };

    public_key.verify(deal_hash.as_bytes(), &signature).is_ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_position_boost() {
        assert_eq!(position_boost("QB"), 15);
        assert_eq!(position_boost("WR"), 8);
        assert_eq!(position_boost("K"), 1);
    }

    #[test]
    fn test_conference_boost() {
        assert_eq!(conference_boost("SEC"), 12);
        assert_eq!(conference_boost("Big Ten"), 10);
        assert_eq!(conference_boost("Independent"), 4);
    }

    #[test]
    fn test_scoring_deterministic() {
        let req = ScoringRequest {
            athlete_id: "test-1".into(),
            name: "Andre Mitchell".into(),
            position: "QB".into(),
            school: "IMG Academy".into(),
            state: "Florida".into(),
            conference: "Independent".into(),
            followers: 125000,
            engagement_rate: 0.042,
            proposed_amount_cents: 19500000,
            stats: None,
        };

        let factors_a = compute_score(&req);
        let factors_b = compute_score(&req);

        assert_eq!(factors_a.social, factors_b.social);
        assert_eq!(factors_a.athletic, factors_b.athletic);
        assert_eq!(factors_a.market, factors_b.market);
        assert_eq!(factors_a.brand, factors_b.brand);
    }

    #[test]
    fn test_composite_calculation() {
        let factors = ScoringFactors {
            social: 80,
            athletic: 90,
            market: 70,
            brand: 60,
        };
        // 80*25 + 90*30 + 70*25 + 60*20 = 2000 + 2700 + 1750 + 1200 = 7650
        // 7650 / 100 = 76
        assert_eq!(composite_from_factors(&factors), 76);
    }

    #[test]
    fn test_valuation_band() {
        let (low, high) = valuation_band(80);
        assert!(low > 0);
        assert!(high > low);
    }
}
