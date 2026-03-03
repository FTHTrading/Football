## 4. Scoring Engine and Grade Assignment

### 4.1 Architecture

The scoring engine is a three-stage deterministic pipeline:

$$\text{SignalInputs} \times \text{WeightProfile} \longrightarrow \text{DimensionScores} \longrightarrow \text{Composite} \longrightarrow \text{Grade} + \text{Flags}$$

Each stage is implemented as a pure function. The pipeline accepts an `AthleteSignalInput` object containing all 33 signal scores and a `WeightProfile` specifying dimension-level and optional per-signal weight overrides.

### 4.2 Signal Normalization

Each raw signal score $s_i \in [0, 99]$ is validated against the signal schema and clamped to the valid range. A confidence coefficient $c_i \in [0, 1]$ accompanies each signal, recording data quality. Signals with $c_i = 0$ are treated as missing data and assigned a neutral score of 50 (the dimension median), ensuring that incomplete data degrades gracefully rather than catastrophically.

### 4.3 Dimension Aggregation

Signals are grouped by their dimension assignment $d$. Within each dimension, signals are equally weighted by default:

$$S_d = \sum_{i \in d} w_i \cdot s_i, \quad w_i = \frac{1}{|d|}$$

where $|d|$ is the number of signals in dimension $d$. Per-signal weight overrides may be specified in the weight profile, subject to the constraint that weights within each dimension sum to 1.0.

### 4.4 Composite Scoring

The composite score is the weighted sum of dimension scores:

$$C = \sum_{d=1}^{6} W_d \cdot S_d$$

where $W_d$ is the dimension weight from the instrument weight profile, subject to the normalization constraint:

$$\sum_{d=1}^{6} W_d = 1.0$$

This constraint is enforced programmatically by `validateWeightProfile()`, which rejects any profile whose dimension weights do not sum to 1.0 (within floating-point tolerance).

### 4.5 Weight Profiles

Two default weight profiles ship with the engine:

| Dimension | RPN Weight | PTN Weight |
|---|---|---|
| Revenue Durability | 0.30 | 0.20 |
| Sponsor Concentration | 0.20 | 0.20 |
| Engagement Quality | 0.15 | 0.15 |
| Eligibility Risk | 0.15 | 0.15 |
| Injury & Availability | 0.10 | 0.15 |
| Reputational Volatility | 0.10 | 0.15 |

Table 4: *Default weight profiles.*

The Revenue Participation Note (RPN) profile overweights cash-flow dimensions, reflecting the direct dependence of note holders on athlete revenue. The Portfolio Tranche Note (PTN) profile is more balanced, reflecting diversified portfolio risk where no single dimension dominates.

Custom profiles may override any dimension weight or provide per-signal overrides. Each distinct weight profile produces a distinct genome signature, ensuring that weight changes are tracked as model modifications.

### 4.6 Grade Assignment

The composite score maps to an underwriting grade via a descending threshold table. The first matching threshold determines the grade:

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

Table 5: *Grade thresholds. Descending evaluation—first match wins.*

The grade thresholds are a genome component: any modification to the threshold table produces a new genome ID.

### 4.7 Valuation

The valuation model maps grades to multiplier ranges applied to a reference facility amount. The spread formula incorporates base rate, credit spread (inversely related to composite score), and instrument-specific adjustments. The valuation output includes low, mid, and high estimates in cents, enabling range-based pricing.
