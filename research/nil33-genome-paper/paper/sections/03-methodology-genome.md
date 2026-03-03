## 3. Methodology: Genome Identity System

The Genome Signature is the central organizing concept of the NIL33 architecture. It provides a cryptographic fingerprint that uniquely identifies the complete model configuration, enabling deterministic reproduction of any underwriting output. This section describes the signal ontology, canonical serialization, component hashing, and genome ID derivation.

### 3.1 Signal Ontology

NIL33 decomposes athlete creditworthiness into exactly 33 observable signals organized across six dimensions. The number 33 represents the minimum set of orthogonal signals needed to cover the observed failure modes in NIL deals during 2021–2025. Each signal was selected because it independently explains variance in deal performance that is not captured by other signals in the same dimension.

The six dimensions and their signal allocations are:

| Dimension | Signal Count | Default RPN Weight | Coverage |
|---|---|---|---|
| Revenue Durability | 7 | 0.30 | Cash flow stability, diversification, trajectory |
| Sponsor Concentration | 5 | 0.20 | Dependency risk, renewal rates, counterparty credit |
| Engagement Quality | 6 | 0.15 | Authentic reach, conversion, platform diversification |
| Eligibility Risk | 5 | 0.15 | NCAA status, transfer portal, draft timeline, academics |
| Injury & Availability | 5 | 0.10 | Position-specific risk, history, workload, recovery |
| Reputational Volatility | 5 | 0.10 | Sentiment, controversy, brand safety, resilience |

Table 1: *Dimension taxonomy with Revenue Participation Note (RPN) weights.*

The complete signal registry is provided in Table 2.

| # | Signal ID | Dimension |
|---|---|---|
| 1 | `contract_tenure_renewal` | Revenue Durability |
| 2 | `earning_trajectory_vs_cohort` | Revenue Durability |
| 3 | `market_depth_demand` | Revenue Durability |
| 4 | `revenue_source_diversification` | Revenue Durability |
| 5 | `season_adjusted_earnings` | Revenue Durability |
| 6 | `off_field_revenue_stability` | Revenue Durability |
| 7 | `post_career_transition` | Revenue Durability |
| 8 | `top3_sponsor_dependency` | Sponsor Concentration |
| 9 | `category_diversity_index` | Sponsor Concentration |
| 10 | `renewal_rate_vs_industry` | Sponsor Concentration |
| 11 | `sponsor_credit_quality` | Sponsor Concentration |
| 12 | `contract_duration_distribution` | Sponsor Concentration |
| 13 | `authentic_reach_vs_followers` | Engagement Quality |
| 14 | `conversion_clickthrough` | Engagement Quality |
| 15 | `audience_demographic_alignment` | Engagement Quality |
| 16 | `content_consistency` | Engagement Quality |
| 17 | `platform_diversification` | Engagement Quality |
| 18 | `brand_safety_index` | Engagement Quality |
| 19 | `ncaa_eligibility_status` | Eligibility Risk |
| 20 | `transfer_portal_probability` | Eligibility Risk |
| 21 | `draft_timeline_declaration` | Eligibility Risk |
| 22 | `academic_standing` | Eligibility Risk |
| 23 | `conference_realignment_impact` | Eligibility Risk |
| 24 | `position_specific_injury_rate` | Injury & Availability |
| 25 | `historical_medical_record` | Injury & Availability |
| 26 | `workload_snap_count_trends` | Injury & Availability |
| 27 | `recovery_timeline_model` | Injury & Availability |
| 28 | `insurance_availability` | Injury & Availability |
| 29 | `sentiment_analysis` | Reputational Volatility |
| 30 | `controversy_exposure_index` | Reputational Volatility |
| 31 | `brand_safety_classification` | Reputational Volatility |
| 32 | `media_cycle_resilience` | Reputational Volatility |
| 33 | `community_standing` | Reputational Volatility |

Table 2: *Complete 33-signal registry.*

### 3.2 Canonical Serialization

All model components are serialized via deep-canonical JSON before hashing. The serialization algorithm:

1. Traverses the object graph recursively.
2. Sorts object keys lexicographically at every level.
3. Preserves array element order (arrays are not sorted).
4. Omits `undefined` values; retains `null`.
5. Emits no whitespace (compact JSON).

This ensures that identical object graphs always produce identical byte sequences regardless of property insertion order or JavaScript engine implementation. Cross-platform reproducibility is guaranteed because the serialization is defined in terms of Unicode code points and IEEE 754 number formatting.

### 3.3 Component Hashing

Seven SHA-256 hashes are computed over the canonical representations of each model component:

| Component | Hash Input | What It Captures |
|---|---|---|
| Signal Schema | Array of `{id, dimension}` objects | The 33 signal IDs and their dimension assignments |
| Weight Profile | Dimension weights + per-signal overrides | Instrument-specific weighting configuration |
| Grade Thresholds | Array of `{grade, minScore}` pairs | The 11 grade boundaries (A+ through F) |
| Stress Matrix | Array of scenario definitions with shock vectors | The 6 built-in stress scenarios |
| Covenant Rules | Array of rule definitions with trigger conditions | The 13 canonical covenant rules |
| Flag Rules | Array of flag definitions with thresholds | The 10 flag rules, severities, and diagnostic codes |
| Valuation Model | Multiplier curve segments and spread formula | The grade-to-multiplier and spread mappings |

Table 3: *Genome signature components and their hash inputs.*

Each component hash is the full 64-character hexadecimal SHA-256 digest prefixed with `sha256:`.

### 3.4 Genome ID Derivation

The genome ID is a 128-bit identifier derived by hashing the concatenation of all seven component hashes:

$$\text{genomeId} = \text{SHA-256}(h_1 \mathbin\| h_2 \mathbin\| h_3 \mathbin\| h_4 \mathbin\| h_5 \mathbin\| h_6 \mathbin\| h_7)[0..32]$$

where $h_i$ is the full 256-bit hash of component $i$ and $\|$ denotes colon-separated string concatenation. The result is truncated to 128 bits (32 hexadecimal characters), providing $2^{64}$ collision resistance via the birthday bound—more than sufficient for model identification within a single organization.

### 3.5 Drift Detection

Two functions support genome comparison:

- `verifyGenome(genome, weightProfile)` recomputes the genome from the current codebase state and the provided weight profile, then compares the result to the stored genome. Returns a boolean indicating whether the model has drifted.
- `diffGenomes(a, b)` accepts two genome signatures and returns a structured diff enumerating which of the seven components changed, along with the old and new hash values. This enables precise attribution of model drift to specific subsystems.

Together, drift detection and component-level diffing provide the audit trail required by model risk management standards (SR 11-7).
