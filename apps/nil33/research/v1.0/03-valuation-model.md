# The 33-Signal Valuation Model

## A Deterministic Approach to Athlete NIL Pricing

**Authors:** Kevan Burns  
**Affiliation:** NIL33 — A UnyKorn Company, Norcross, GA 30092  
**Version:** 1.0 (Draft)  
**DOI:** Pending (Zenodo)

---

## Abstract

This paper presents the 33-Signal Valuation Model — a deterministic, reproducible framework for calculating the NIL (Name, Image, and Likeness) value of college and high school athletes. The model uses 33 independent, measurable signals grouped into 6 scoring buckets to produce a composite index (0–100), which maps to a dollar valuation via exponential function. The approach eliminates subjectivity and provides auditable, defensible pricing.

## 1. Motivation

Current NIL valuation is subjective — based on social media followers, agent intuition, and marketplace dynamics. There is no industry-standard formula. NIL33 introduces a deterministic alternative built from verifiable inputs.

## 2. The 33 Signals

### 2.1 Identity & Verification (5 signals)

1. KYC / Guardian Status
2. Verification Tier Level
3. Audit Trail Completeness
4. Document Integrity Score
5. Dispute Risk Score

### 2.2 Performance Proof (7 signals)

6. Sport-Specific Verified Metrics
7. Consistency Delta (Trend Stability)
8. Injury / Availability Factor
9. Role & Usage Factor
10. Training Progression Factor
11. Peer Percentile Factor
12. Volatility Penalty (Anti-Fluke)

### 2.3 Recruiting & Exposure (6 signals)

13. Offers Quality Score
14. Visits & Contact Intensity
15. Coach Views & Saves
16. Verified Profile Shares
17. Highlight / Film Engagement
18. Geographic Recruiting Demand Index

### 2.4 Market & Reach (6 signals)

19. Social Graph Signals
20. Engagement Quality
21. Content Output Consistency
22. Audience Geography Fit
23. Brand Category Affinity
24. Reputation Safety Score

### 2.5 Compliance & Eligibility (5 signals)

25. State NIL Law Compatibility
26. School Policy Compatibility
27. Restricted Category Blocks
28. Disclosure & Reporting Completeness
29. Pay-for-Play Risk Score

### 2.6 Deal Execution & Reliability (4 signals)

30. Contract Completeness Score
31. Deliverable Fulfillment Rate
32. Payment Performance Score
33. Dispute / Chargeback Risk

## 3. Composite Scoring

Each signal is normalized to 0–1. Signals are weighted by bucket priority:

```
composite = Σ (signal_i × weight_i) × 100
```

Bucket weights are configurable by sport and conference.

## 4. Valuation Formula

```
NIL_Value = 1.065^composite × 12
```

- **Exponential curve**: Elite athletes (90+) command exponentially higher valuations
- **Monthly multiplier**: Annualized projection
- **Deterministic**: Same inputs → same output, every time

### Example Outputs

| Composite | Annual NIL Value |
|-----------|-----------------|
| 30 | ~$80 |
| 50 | ~$280 |
| 70 | ~$990 |
| 80 | ~$1,860 |
| 90 | ~$3,500 |
| 95 | ~$4,800 |
| 100 | ~$6,600 |

*(Values scaled by sport-specific multipliers in production)*

## 5. Properties

- **Reproducible**: Any auditor can verify the computation
- **Explainable**: Every input and weight is documented
- **Sport-agnostic**: Works across all 14 supported sports
- **Geography-adjusted**: Accounts for recruiting region demand

## 6. Implementation

Computed server-side in the NIL33 Rust engine with validation constraints:
- All inputs must be non-null
- Composite must fall within 0–100
- Valuation must be positive
- Computation is logged for audit trail

---

© 2026 NIL33 — A UnyKorn Company
