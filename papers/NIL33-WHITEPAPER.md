# NIL33: A Deterministic Multi-Signal Underwriting Engine for Structured NIL Securities

**Version 1.0.0** · March 2026

**Authors:** Kevan Fehr, FTH Trading

---

## Abstract

We present NIL33, an open-architecture underwriting engine for structured securities backed by collegiate athlete Name, Image, and Likeness (NIL) revenue streams. The system introduces a 33-signal, 6-dimension scoring framework that deterministically maps observable athlete characteristics to composite creditworthiness grades. Every output—scores, valuations, covenants, stress tests—is reproducible given identical inputs and a cryptographic model fingerprint (the _Genome Signature_). We describe the signal taxonomy, dimension weighting system, covenant generation rules, multi-scenario stress testing framework, and seeded Monte Carlo VaR engine. The model is implemented as pure functions with zero side effects, enabling independent verification. A research snapshot exporter packages the full model specification—including synthetic verification samples—for DOI registration and peer review. To our knowledge, this is the first published deterministic underwriting framework for athlete-backed structured finance with formal model versioning and reproducibility guarantees.

---

## 1. Introduction

### 1.1 The NIL Market Gap

The 2021 NCAA NIL policy created a new asset class: athlete endorsement and revenue streams. As of 2026, the market exceeds $1.1 billion annually, yet no standardized underwriting framework exists for securitizing these cash flows. Traditional credit models fail because:

1. **No credit history.** Athletes are 18–22 years old with no FICO-equivalent score.
2. **Non-linear career risk.** Injury, transfer, draft—each discretely reshapes revenue.
3. **Sponsor concentration.** Revenue often depends on 2–3 relationships.
4. **Eligibility entanglement.** NCAA compliance creates unique regulatory risk absent in conventional lending.
5. **Reputational alpha.** Social engagement and brand safety materially affect deal flow.

### 1.2 Contribution

NIL33 addresses these gaps with five contributions:

| # | Contribution | Section |
|---|---|---|
| 1 | A 33-signal, 6-dimension scoring taxonomy covering the full credit surface of athlete revenue | §2 |
| 2 | Instrument-sensitive dimension weighting with per-signal override capability | §3 |
| 3 | Automated covenant generation and stress testing tied to the scoring engine | §4–5 |
| 4 | Seeded Monte Carlo VaR with correlated dimension shocks | §6 |
| 5 | Cryptographic model identity (Genome Signature) enabling bit-exact reproducibility | §7 |

### 1.3 Design Principles

The engine is built on four invariants:

- **Pure.** Every function is a pure function. No side effects, no network calls, no mutable state.
- **Deterministic.** Same inputs + same genome → same outputs. Always.
- **Hashable.** The entire model specification reduces to a single 128-bit genome ID via SHA-256 component hashing.
- **Testable.** 67 automated tests validate every layer, including synthetic verification samples that detect any behavioral drift.

---

## 2. Signal Taxonomy

### 2.1 Design Rationale

Traditional credit models use 5–10 factors. Athlete NIL revenue has a wider risk surface because risk originates from six distinct domains (physical, regulatory, financial, social, institutional, reputational) that interact non-linearly. We decompose this surface into exactly 33 observable signals organized into 6 dimensions.

The number 33 is not arbitrary—it represents the minimum set of orthogonal signals needed to cover the observed failure modes in NIL deals during 2021–2025. Each signal was selected because it independently explains variance in deal performance that is not captured by other signals in the same dimension.

### 2.2 The Six Dimensions

| Dimension | Signals | Weight (RPN) | Coverage |
|---|---|---|---|
| Revenue Durability | 7 | 0.30 | Cash flow stability, diversification, trajectory |
| Sponsor Concentration | 5 | 0.20 | Dependency risk, renewal, credit quality |
| Engagement Quality | 6 | 0.15 | Authentic reach, conversion, platform risk |
| Eligibility Risk | 5 | 0.15 | NCAA status, transfer, draft, academic standing |
| Injury & Availability | 5 | 0.10 | Position-specific risk, history, workload |
| Reputational Volatility | 5 | 0.10 | Sentiment, controversy, brand safety |

Table 1: *Dimension taxonomy with RPN (Revenue Participation Note) weights.*

### 2.3 Complete Signal Registry

| # | Signal ID | Dimension | Description |
|---|---|---|---|
| 1 | `contract_tenure_renewal` | Revenue Durability | Weighted average contract length and renewal probability |
| 2 | `earning_trajectory_vs_cohort` | Revenue Durability | Year-over-year earnings growth relative to position/conference cohort |
| 3 | `market_depth_demand` | Revenue Durability | Number of competing offers and sponsorship demand pipeline |
| 4 | `revenue_source_diversification` | Revenue Durability | Herfindahl index of revenue sources (sponsorship, merch, appearances, digital) |
| 5 | `season_adjusted_earnings` | Revenue Durability | Earnings normalized for seasonal fluctuations and sport calendar |
| 6 | `off_field_revenue_stability` | Revenue Durability | Non-athletic revenue consistency (media, licensing, appearances) |
| 7 | `post_career_transition` | Revenue Durability | Post-eligibility earning potential and career transition readiness |
| 8 | `top3_sponsor_dependency` | Sponsor Concentration | Revenue share from top 3 sponsors (inverse — higher = less concentrated) |
| 9 | `category_diversity_index` | Sponsor Concentration | Sponsor category diversity (food, apparel, tech, finance, etc.) |
| 10 | `renewal_rate_vs_industry` | Sponsor Concentration | Historical sponsor renewal rate relative to NIL industry average |
| 11 | `sponsor_credit_quality` | Sponsor Concentration | Weighted average credit quality of sponsor counterparties |
| 12 | `contract_duration_distribution` | Sponsor Concentration | Distribution of contract durations (longer = more stable) |
| 13 | `authentic_reach_vs_followers` | Engagement Quality | Ratio of genuine engagement to follower count (bot-adjusted) |
| 14 | `conversion_clickthrough` | Engagement Quality | Measured conversion/click-through rate on sponsored content |
| 15 | `audience_demographic_alignment` | Engagement Quality | Audience demographic match to sponsor target demographics |
| 16 | `content_consistency` | Engagement Quality | Content production frequency and quality consistency |
| 17 | `platform_diversification` | Engagement Quality | Presence across multiple platforms (reduces single-platform risk) |
| 18 | `brand_safety_index` | Engagement Quality | Content risk classification for brand partnership suitability |
| 19 | `ncaa_eligibility_status` | Eligibility Risk | Current NCAA eligibility standing and compliance status |
| 20 | `transfer_portal_probability` | Eligibility Risk | Estimated probability of entering the transfer portal |
| 21 | `draft_timeline_declaration` | Eligibility Risk | Proximity to draft declaration and professional transition |
| 22 | `academic_standing` | Eligibility Risk | Academic eligibility and GPA trajectory |
| 23 | `conference_realignment_impact` | Eligibility Risk | Impact of conference realignment on visibility and revenue |
| 24 | `position_specific_injury_rate` | Injury & Availability | Baseline injury risk for athlete's position |
| 25 | `historical_medical_record` | Injury & Availability | Personal injury history and recovery record |
| 26 | `workload_snap_count_trends` | Injury & Availability | Playing time trends and workload management |
| 27 | `recovery_timeline_model` | Injury & Availability | Expected recovery timeline if injured (position-adjusted) |
| 28 | `insurance_availability` | Injury & Availability | Availability and cost of loss-of-value insurance |
| 29 | `sentiment_analysis` | Reputational Volatility | Real-time public sentiment score from social and media sources |
| 30 | `controversy_exposure_index` | Reputational Volatility | Exposure to current or historical controversy |
| 31 | `brand_safety_classification` | Reputational Volatility | Brand safety tier classification by independent agencies |
| 32 | `media_cycle_resilience` | Reputational Volatility | Ability to recover from negative media cycles |
| 33 | `community_standing` | Reputational Volatility | Community engagement, charity work, and public standing |

Table 2: *Complete 33-signal registry with dimension assignments.*

---

## 3. Scoring Engine

### 3.1 Architecture

The scoring engine is a three-stage pipeline:

```
SignalInputs × WeightProfile → DimensionScores → Composite → Grade + Flags
```

**Stage 1: Signal Normalization.** Each raw signal score $s_i \in [0, 99]$ is validated and clamped. A confidence coefficient $c_i \in [0, 1]$ accompanies each signal, recording data quality.

**Stage 2: Dimension Aggregation.** Signals are grouped by dimension $d$. Within each dimension, signals are equally weighted by default (with per-signal overrides available):

$$S_d = \sum_{i \in d} w_i \cdot s_i, \quad w_i = \frac{1}{|d|}$$

where $|d|$ is the number of signals in dimension $d$.

**Stage 3: Composite Scoring.** The composite score is the weighted sum of dimension scores:

$$C = \sum_{d=1}^{6} W_d \cdot S_d$$

where $W_d$ is the dimension weight from the instrument weight profile, subject to

$$\sum_{d=1}^{6} W_d = 1.0$$

### 3.2 Weight Profiles

Two default profiles ship with the engine:

| Dimension | RPN Weight | PTN Weight |
|---|---|---|
| Revenue Durability | 0.30 | 0.20 |
| Sponsor Concentration | 0.20 | 0.20 |
| Engagement Quality | 0.15 | 0.15 |
| Eligibility Risk | 0.15 | 0.15 |
| Injury & Availability | 0.10 | 0.15 |
| Reputational Volatility | 0.10 | 0.15 |

The RPN (Revenue Participation Note) profile overweights cash-flow dimensions. The PTN (Portfolio Tranche Note) profile is more balanced, reflecting diversified portfolio risk.

Custom profiles can override any dimension weight or provide per-signal overrides, subject to the sum-to-one constraint enforced by `validateWeightProfile()`.

### 3.3 Grade Assignment

The composite score maps to an underwriting grade:

| Grade | Minimum Score | Interpretation |
|---|---|---|
| A+ | 95 | Exceptional creditworthiness |
| A | 90 | Very strong |
| A− | 85 | Strong |
| B+ | 80 | Above average |
| B | 75 | Average / acceptable |
| B− | 70 | Below average |
| C+ | 65 | Marginal |
| C | 55 | Weak |
| C− | 45 | Very weak |
| D | 30 | Distressed |
| F | 0 | Not investable |

Table 3: *Grade thresholds. Descending evaluation — first match wins.*

### 3.4 Risk Flag Detection

Ten flag rules operate in parallel to the composite score. Flags fire when individual signals or dimension-level averages breach thresholds. Each flag has a severity (`critical`, `caution`, `watch`), a diagnostic code, and a human-readable recommendation.

Flag rules are encoded in a canonical form (`FLAG_RULES_CANONICAL`) that is part of the genome hash. Changes to flag thresholds, additions, or removals are automatically detected by the genome drift checker.

---

## 4. Covenant Generation Engine

### 4.1 Architecture

Covenants are generated deterministically from the composite score, dimension scores, and risk flags. The covenant engine evaluates 13 canonical rules, each with:

- **Trigger condition:** A score threshold or flag match
- **Covenant type:** `financial`, `reporting`, `behavioral`, or `compliance`
- **Enforcement:** `hard` (breach = default) or `soft` (breach = watch list)

The engine also appends a mandatory morality clause when a `REPUTATION_RISK` flag is present.

### 4.2 Rule Structure

```
Rule: IF score.composite < threshold AND/OR flag.code ∈ triggers
      THEN emit Covenant { type, enforcement, description }
```

The full set of 13 rules plus the morality clause forms a closed set—no covenant can appear that is not defined by a canonical rule. This is essential for reproducibility: given the same score and flags, the same covenants are always generated.

---

## 5. Stress Testing Framework

### 5.1 Scenario Design

Six built-in stress scenarios model acute risk events:

| Scenario | Type | Shocked Dimensions | Max Shock |
|---|---|---|---|
| Major injury (ACL) | `injury` | Injury, Revenue Durability | −40% |
| Sponsor exodus | `market` | Sponsor Concentration, Engagement | −50% |
| Transfer portal entry | `regulatory` | Eligibility Risk | −60% |
| Social media crisis | `reputational` | Reputational Volatility, Engagement | −45% |
| Conference realignment | `regulatory` | Eligibility, Revenue, Engagement | −25% |
| Full market downturn | `macro` | All six dimensions | −15% to −20% |

Table 4: *Built-in stress scenarios.*

### 5.2 Shock Application

For each scenario, dimension-level shocks are applied to the original signal scores:

$$s_i^{\text{shocked}} = \max(0, \; s_i \cdot (1 + \text{shockPct}_d))$$

where $\text{shockPct}_d < 0$ is the shock magnitude for dimension $d$. The shocked signals are re-scored through the full pipeline, producing a stressed composite, grade, and valuation. The NAV impact is the change in portfolio valuation.

### 5.3 Shock Contribution Maps

The `buildShockContributionMap()` function isolates the impact of each shocked dimension by applying shocks one dimension at a time, holding all others constant. This produces a decomposition:

$$\Delta\text{NAV}_{\text{total}} \approx \sum_{d \in \text{shocked}} \Delta\text{NAV}_d$$

where each $\Delta\text{NAV}_d$ represents the marginal contribution of dimension $d$'s shock to the total NAV decline.

---

## 6. Seeded Monte Carlo VaR

### 6.1 PRNG Selection

The engine uses Mulberry32, a 32-bit seeded pseudo-random number generator. Properties:

- **Deterministic.** Identical seeds produce identical sequences.
- **Quality.** Passes SmallCrush and most of BigCrush.
- **Speed.** Single multiplication + bit shifts per sample.
- **Portability.** Pure integer arithmetic—no platform-dependent floating-point.

The PRNG is explicitly **not** cryptographically secure. It is used only for simulation path generation.

### 6.2 Normal Distribution via Box-Muller

Standard normal samples are generated via the Box-Muller transform:

$$Z = \sqrt{-2 \ln U_1} \cdot \cos(2\pi U_2)$$

where $U_1, U_2$ are uniform samples from the seeded PRNG.

### 6.3 Correlated Dimension Shocks

The Monte Carlo engine generates correlated shocks across the six dimensions. Each path $p$:

1. Draws 6 independent $N(0,1)$ samples $\{z_d\}$
2. Adjusts for pairwise correlation: $z_d^{\text{adj}} = \bar{z} \cdot \rho_d + z_d \cdot \sqrt{1 - \rho_d^2}$, where $\bar{z}$ is the average of all draws and $\rho_d$ is the cross-dimension correlation coefficient
3. Scales to the dimension's annualized volatility and horizon: $\text{shock}_d = z_d^{\text{adj}} \cdot \sigma_d \cdot \sqrt{T/252}$
4. Re-scores all athletes under the shocked scenario
5. Computes the portfolio valuation change

### 6.4 Risk Metrics

From $N$ simulation paths, the engine reports:

- **VaR** (Value at Risk) at confidence level $\alpha$: the $(1 - \alpha)$-th percentile of losses
- **CVaR** (Conditional VaR / Expected Shortfall): the mean of losses exceeding VaR
- **Component VaR:** each athlete's contribution to portfolio VaR
- **Percentile distribution:** p1, p5, p10, p25, p50, p75, p90, p95, p99

Every result embeds the seed used, enabling exact reproduction:

```typescript
const result = runMonteCarloVaR(athletes, profile, {
  seed: 937263,   // deterministic
  paths: 10_000,
  confidenceLevel: 0.95,
  horizonDays: 30,
});
// result.seed === 937263
```

---

## 7. Genome Signature (Cryptographic Model Identity)

### 7.1 Motivation

A published memo is only reproducible if the exact model state is known. The Genome Signature captures the complete model configuration in a single cryptographic fingerprint.

### 7.2 Components

Seven SHA-256 hashes are computed over canonical representations of each model component:

| Component | What It Captures |
|---|---|
| Signal Schema | The 33 signal IDs and their dimension assignments |
| Weight Profile | Dimension weights, signal overrides, instrument type |
| Grade Thresholds | The 11 grade boundaries (A+ through F) |
| Stress Matrix | The 6 built-in stress scenarios and their shock vectors |
| Covenant Rules | The 13 canonical covenant rules and their structural parameters |
| Flag Rules | The 10 flag rules, thresholds, severities, and codes |
| Valuation Model | The multiplier curve segments and spread formula |

Table 5: *Genome Signature components.*

### 7.3 Genome ID Derivation

The genome ID is a 128-bit identifier derived from all seven component hashes:

$$\text{genomeId} = \text{SHA-256}(h_1 \mathbin\| h_2 \mathbin\| h_3 \mathbin\| h_4 \mathbin\| h_5 \mathbin\| h_6 \mathbin\| h_7)[0..32]$$

where $h_i$ is the full 256-bit hash of component $i$ and $\|$ denotes colon-separated concatenation. The result is truncated to 128 bits (32 hex characters), providing collision resistance sufficient for model identification.

### 7.4 Canonical Serialization

All inputs are serialized via deep-canonical JSON: keys sorted recursively, arrays preserved in order, no whitespace, no undefined coercion. This ensures:

- Same object graphs always produce the same hash
- Cross-platform reproducibility (no platform-dependent serialization)
- Independence from property insertion order in JavaScript objects

### 7.5 Drift Detection

`verifyGenome(genome, weightProfile)` recomputes the genome from the current codebase and compares it to a stored genome. `diffGenomes(a, b)` enumerates which components changed, enabling precise attribution of model drift.

---

## 8. Reproducibility Architecture

### 8.1 Replay Underwriting

The `replayUnderwriting(record)` function takes a sealed `UnderwritingReplayRecord`—containing the original inputs, weight profile, and genome—and re-executes the full scoring + memo pipeline. It then:

1. Verifies the genome matches the current model
2. Regenerates the memo
3. Compares core outputs (composite, grade, valuation, covenants, narrative)

If any discrepancy is found, `reproducible: false` is returned with `genomeDrift: true` indicating model changes.

### 8.2 Sealed Records

`sealReplayRecord(input, memoId, genome)` creates an archival-ready record containing:

- The complete `AthleteSignalInput` (all 33 signals, metadata)
- The weight profile used
- Optional configuration (reference facility, methodology, analyst notes)
- The genome signature at time of generation
- The memo ID linking to the produced output
- A generation timestamp

This record is sufficient for any party to independently reproduce the exact score, grade, valuation, and covenant set.

### 8.3 Dimension Contribution Maps

`buildDimensionContributionMap(score)` decomposes the composite score into per-dimension signed contributions relative to an equal-weight baseline:

$$\text{contribution}_d = (W_d - \tfrac{1}{6}) \cdot S_d$$

Positive contributions indicate the weighting scheme helps that dimension's influence; negative contributions indicate suppression. The total weighting effect equals the difference between the actual composite and the equal-weight composite.

### 8.4 Research Snapshot Exporter

`generateResearchSnapshot(genome, metadata?)` produces a complete model archive containing:

- Genome signature with all component hashes
- Signal schema with human-readable descriptions
- Both weight profiles (RPN and PTN) with full dimension weights
- Grade threshold table
- All 6 stress scenarios with shock vectors
- Covenant rule summary (13 rules)
- Flag rule summary (10 rules)
- 5 synthetic verification samples spanning all grade bands

The synthetic samples are athletes with known base scores (92, 78, 60, 45, 28) that produce deterministic outputs. Any independent implementation of the NIL33 engine can verify correctness by checking that these samples produce the expected composite, grade, and flag count.

---

## 9. Implementation

### 9.1 Technology

The engine is implemented in TypeScript under strict mode, targeting ES2022. Type safety is enforced via the `strict` compiler flag, and the module is built as both CJS and type-annotated source.

### 9.2 Module Structure

| Module | Lines | Purpose |
|---|---|---|
| `types.ts` | ~950 | All shared domain types (33 signal IDs, 6 dimensions, SPV, portfolio, genome) |
| `scoring.ts` | 505 | 33-signal scoring engine, weight profiles, grade assignment, flag detection |
| `covenants.ts` | ~290 | 13 covenant rules + canonical form + generation logic |
| `stress.ts` | ~350 | 6 built-in scenarios, shock application, stress test execution |
| `memo.ts` | ~310 | Memo orchestrator, valuation model, risk narrative |
| `genome.ts` | 247 | SHA-256 genome hashing, drift detection, verification |
| `montecarlo.ts` | 275 | Seeded PRNG, Box-Muller, correlated MC VaR |
| `reproducibility.ts` | 429 | Replay, contribution maps, research snapshot |
| **Total** | **~3,356** | |

Table 6: *Module inventory.*

### 9.3 Dependency Footprint

- **Runtime:** `zod` (schema validation only)
- **Standard library:** `crypto` (Node.js — SHA-256 only)
- **DevDeps:** `typescript`, `vitest`

No external ML libraries. No databases. No network calls. The engine is a pure computation graph.

### 9.4 Test Coverage

| Suite | Tests | Coverage |
|---|---|---|
| Engine tests | 34 | Scoring, grading, validation, flags, covenants, stress, memo, valuation, pipeline |
| Hardening tests | 33 | Genome determinism, PRNG reproducibility, MC VaR, replay, contributions, snapshot, E2E |
| **Total** | **67** | |

All tests run in <500ms with zero mocks.

---

## 10. Security Considerations

- **Genome signatures use SHA-256**, not for security but for collision resistance. An attacker who can modify the codebase can also modify the genome computation, so the hash provides integrity verification, not tamper-proofing.
- **The PRNG (Mulberry32) is not cryptographically secure.** It is used only for Monte Carlo simulation paths. Knowing the seed reveals the entire sequence. Seeds should be treated as model parameters, not secrets.
- **Signal scores are not encrypted at rest.** In a production deployment, athlete data should be encrypted and access-controlled independently of the engine.

---

## 11. Limitations and Future Work

1. **Volatility calibration.** The dimension-level volatility assumptions in the Monte Carlo engine are currently expert estimates, not historically calibrated. As the NIL market matures, empirical calibration from deal performance data will improve accuracy.

2. **Correlation estimation.** Cross-dimension correlations are currently pairwise constants. A dynamic correlation model (e.g., DCC-GARCH) would better capture regime shifts.

3. **Signal weighting optimization.** The signal-to-dimension assignment is deterministic (equal weight within dimension). Bayesian or regularized regression on deal outcomes could optimize intra-dimension weights.

4. **Portfolio optimization.** The current framework scores and stresses portfolios but does not optimize allocation. Mean-variance or CVaR optimization is a natural extension.

5. **Temporal dynamics.** Signal scores are point-in-time snapshots. A Kalman filter or state-space model could incorporate temporal evolution of signal quality.

---

## 12. Conclusion

NIL33 provides the first formally specified, deterministic, and reproducible underwriting engine for athlete-backed structured securities. The 33-signal taxonomy covers the full credit surface of NIL revenue streams. The Genome Signature system enables any memo to be independently verified to the bit level. The seeded Monte Carlo engine produces reproducible risk analytics. Together, these capabilities establish a foundation for institutional-grade NIL securitization with full model transparency.

The implementation is open-source, fully tested, and DOI-ready. We invite peer review of the signal taxonomy, weighting methodology, and risk model calibration.

---

## Appendix A: Genome Signature Example

```
{
  "genomeId": "a3b7c9d1e5f2a4b6c8d0e2f4a6b8c0d2",
  "signalSchemaHash": "sha256:abc123...",
  "weightProfileHash": "sha256:def456...",
  "thresholdHash": "sha256:789abc...",
  "stressMatrixHash": "sha256:012def...",
  "covenantRulesHash": "sha256:345678...",
  "flagRulesHash": "sha256:9abcde...",
  "valuationModelHash": "sha256:f01234...",
  "version": "1.0.0",
  "createdAt": "2026-03-03T00:00:00.000Z"
}
```

## Appendix B: Reproduction Protocol

To independently verify any NIL33 underwriting memo:

1. Obtain the `UnderwritingReplayRecord` for the memo
2. Install `@nil33/core` at the version matching the record's genome version
3. Call `replayUnderwriting(record)`
4. Verify `reproducible === true` and `genomeDrift === false`
5. Compare `memo.compositeScore.composite`, `memo.compositeScore.grade`, and `memo.valuation.midCents`

If the genome has drifted, `diffGenomes()` will identify exactly which model components changed.

## Appendix C: Synthetic Verification Vectors

Five synthetic athletes serve as regression anchors:

| Tier | Base Score | Expected Grade | Description |
|---|---|---|---|
| Elite | 92 | A | Top-tier athlete, all signals strong |
| Strong | 78 | B+ | Above-average with minor gaps |
| Average | 60 | C | Mid-range across all dimensions |
| Below Average | 45 | C− | Weaknesses in multiple areas |
| Weak | 28 | F | Distressed across all dimensions |

Each sample's expected composite, grade, and flag count are embedded in the research snapshot. Any implementation producing different outputs for these inputs has diverged from the canonical model.

---

*© 2026 FTH Trading. All rights reserved.*
