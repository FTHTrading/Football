## 6. Stress Testing and Monte Carlo VaR

### 6.1 Deterministic Stress Scenarios

Six built-in stress scenarios model acute risk events that affect athlete-backed securities:

| Scenario | Type | Shocked Dimensions | Maximum Shock |
|---|---|---|---|
| Major injury (ACL) | `injury` | Injury & Availability, Revenue Durability | −40% |
| Sponsor exodus | `market` | Sponsor Concentration, Engagement Quality | −50% |
| Transfer portal entry | `regulatory` | Eligibility Risk | −60% |
| Social media crisis | `reputational` | Reputational Volatility, Engagement Quality | −45% |
| Conference realignment | `regulatory` | Eligibility Risk, Revenue Durability, Engagement Quality | −25% |
| Full market downturn | `macro` | All six dimensions | −15% to −20% |

Table 6: *Built-in stress scenarios with shock vectors.*

Each scenario is defined in the `STRESS_SCENARIOS_CANONICAL` array, which is a genome component. Modifications to any scenario definition—including the addition of new scenarios—produce a new genome ID.

### 6.2 Shock Application

For each scenario, dimension-level shocks are applied to the original signal scores:

$$s_i^{\text{shocked}} = \max\!\bigl(0, \; s_i \cdot (1 + \delta_d)\bigr)$$

where $\delta_d < 0$ is the shock magnitude for dimension $d$, and the $\max(0, \cdot)$ clamp ensures scores remain non-negative. The shocked signals are re-scored through the full scoring pipeline, producing a stressed composite, stressed grade, and stressed valuation. The NAV impact is computed as the difference between the base and stressed valuations.

### 6.3 Shock Contribution Maps

The `buildShockContributionMap()` function isolates the marginal impact of each shocked dimension by applying shocks one dimension at a time while holding all other dimensions at their base values. This produces a first-order decomposition:

$$\Delta\text{NAV}_{\text{total}} \approx \sum_{d \in \mathcal{D}_{\text{shocked}}} \Delta\text{NAV}_d$$

where each $\Delta\text{NAV}_d$ represents the marginal contribution of dimension $d$'s shock to the total NAV decline. This decomposition enables analysts to identify which risk dimension drives the majority of the stressed loss, supporting targeted risk mitigation.

### 6.4 Seeded Monte Carlo VaR

#### 6.4.1 PRNG Selection

The engine uses Mulberry32, a 32-bit seeded pseudo-random number generator with the following properties:

- **Deterministic.** Identical seeds produce identical sequences across all platforms.
- **Statistical quality.** Passes SmallCrush and most of BigCrush in the TestU01 suite.
- **Performance.** Single multiplication plus bit shifts per sample—suitable for 10,000+ path simulations.
- **Portability.** Pure integer arithmetic with no platform-dependent floating-point operations.

The PRNG is explicitly not cryptographically secure and is used solely for simulation path generation. Seeds are model parameters, not secrets.

#### 6.4.2 Normal Distribution via Box-Muller

Standard normal samples are generated via the Box-Muller transform:

$$Z = \sqrt{-2 \ln U_1} \cdot \cos(2\pi U_2)$$

where $U_1, U_2 \sim \text{Uniform}(0, 1)$ are drawn from the seeded PRNG. This provides exact normal deviates without rejection sampling, ensuring deterministic output counts.

#### 6.4.3 Correlated Dimension Shocks

The Monte Carlo engine generates correlated shocks across the six dimensions. For each simulation path $p$:

1. Draw six independent standard normal samples $\{z_d\}_{d=1}^{6}$.
2. Compute the cross-dimension correlation adjustment: $z_d^{\text{adj}} = \bar{z} \cdot \rho_d + z_d \cdot \sqrt{1 - \rho_d^2}$, where $\bar{z} = \frac{1}{6}\sum_{d} z_d$ is the mean of all draws and $\rho_d$ is the cross-dimension correlation coefficient for dimension $d$.
3. Scale to annualized volatility and horizon: $\text{shock}_d = z_d^{\text{adj}} \cdot \sigma_d \cdot \sqrt{T / 252}$, where $\sigma_d$ is the annualized volatility for dimension $d$ and $T$ is the horizon in trading days.
4. Apply shocks to all athlete signal scores and re-score through the full pipeline.
5. Compute the portfolio valuation change for path $p$.

#### 6.4.4 Risk Metrics

From $N$ simulation paths, the engine reports:

- **VaR** (Value at Risk) at confidence level $\alpha$: the $(1 - \alpha)$-th percentile of the loss distribution.
- **CVaR** (Conditional VaR / Expected Shortfall): the mean of losses exceeding VaR, capturing tail risk.
- **Component VaR:** each athlete's marginal contribution to portfolio VaR, enabling position-level risk attribution.
- **Percentile distribution:** p1, p5, p10, p25, p50, p75, p90, p95, p99 of the portfolio value distribution.

Every result embeds the seed used for generation, enabling exact reproduction:

```typescript
const result = runMonteCarloVaR(athletes, profile, {
  seed: 937263,
  paths: 10_000,
  confidenceLevel: 0.95,
  horizonDays: 30,
});
// result.seed === 937263 — deterministic replay guaranteed
```
