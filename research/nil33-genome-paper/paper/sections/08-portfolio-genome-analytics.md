## 8. Portfolio Genome Analytics

While Section 7 addressed genome propagation at the individual object level, portfolio management requires aggregate genome intelligence. This section describes the portfolio genome analytics module, which computes homogeneity metrics, detects pairwise drift, and scores mutation risk across a book of genome-stamped positions.

### 8.1 Motivation

A portfolio of NIL-backed instruments originated over time will inevitably contain positions underwritten under different genome versions. Model updates—recalibrated weights, new stress scenarios, modified flag thresholds—produce new genomes, but existing positions retain their originating genomes. This creates model heterogeneity within the portfolio.

Model heterogeneity poses three risks:

1. **Inconsistent risk assessment.** Two instruments with identical underlying athletes may carry different grades if originated under different genomes.
2. **Stale underwriting.** Positions originated under an outdated genome may not reflect current risk model improvements.
3. **Audit complexity.** Regulators and investors require assurance that the portfolio's risk metrics are computed under a consistent methodology.

Portfolio genome analytics quantifies these risks and identifies positions requiring re-underwriting.

### 8.2 Input Structure

The `aggregatePortfolioGenomeMetrics()` function accepts an array of `PortfolioGenomeEntry` objects, each containing:

- `instrumentId`: Unique position identifier.
- `instrumentName`: Human-readable label.
- `exposureCents`: Notional or NAV exposure in cents (integer arithmetic to avoid floating-point rounding).
- `genome`: The full `GenomeSignature` object from the instrument record.

### 8.3 Genome Clustering

Positions are grouped by `genomeId` into clusters. Each cluster records:

- The genome ID and version.
- The count of instruments in the cluster.
- The total exposure in cents.
- The weight as a fraction of total portfolio exposure.

Clusters are sorted by total exposure in descending order. The first cluster represents the dominant genome—the model version with the largest portfolio footprint.

### 8.4 Homogeneity Index

Portfolio genome homogeneity is measured by the Herfindahl–Hirschman Index (HHI) of genome cluster weights:

$$\text{HHI} = \sum_{k=1}^{K} w_k^2$$

where $w_k$ is the exposure weight of genome cluster $k$ and $K$ is the number of distinct genomes. The HHI has the following interpretation:

- $\text{HHI} = 1.0$: All positions use the same genome (perfect homogeneity).
- $\text{HHI} = 1/K$: Exposure is uniformly distributed across $K$ genomes (maximum fragmentation for $K$ genomes).
- $\text{HHI} \to 0$: Many genomes with small weights (high fragmentation).

The HHI provides a single scalar summary of how concentrated the portfolio is around a single model version.

### 8.5 Pairwise Drift Detection

For every pair of distinct genomes in the portfolio, `diffGenomes()` is invoked to produce a `GenomeDiff` identifying which of the seven components changed. Each drift edge records:

- The two genome IDs.
- The structured diff (list of changed components with old and new hash values).
- The combined exposure of the two clusters, indicating the financial significance of the drift.

Drift edges enable targeted investigation: if a pair of genomes differs only in the stress matrix, the portfolio manager can assess whether the stress scenario change materially affects the positions originated under the older genome.

### 8.6 Mutation Risk Scoring

Mutation risk is a composite indicator $\mu \in [0, 1]$ that combines genome fragmentation and drift intensity:

$$\mu = \min\!\left(1, \; \frac{\bar{\delta} + (1 - \text{HHI})}{2}\right)$$

where $\bar{\delta}$ is the average fraction of changed components across all pairwise drift edges:

$$\bar{\delta} = \frac{1}{|\mathcal{E}|} \sum_{e \in \mathcal{E}} \frac{|\text{changedComponents}(e)|}{7}$$

and $|\mathcal{E}|$ is the number of pairwise edges. The mutation risk indicator has the following interpretation:

- $\mu = 0$: The portfolio is genome-homogeneous (single genome, no drift).
- $\mu \to 0.5$: Moderate fragmentation or moderate drift (but not both).
- $\mu \to 1$: High fragmentation with high component-level drift across all genome pairs.

### 8.7 Dominant Genome Identification

The dominant genome is the genome cluster with the largest exposure weight. The output includes:

- `dominantGenomeId`: The genome ID of the largest cluster, or `null` if the portfolio is empty.
- `dominantGenomeWeight`: The fraction of total exposure under the dominant genome.

A low dominant genome weight (e.g., below 0.5) indicates that no single model version accounts for a majority of the portfolio's exposure—a condition that may warrant systematic re-underwriting under the current production genome.

### 8.8 Operational Use Cases

Portfolio genome analytics supports several operational workflows:

1. **Model upgrade cadence:** Monitor mutation risk over time to determine when re-underwriting should be triggered.
2. **Regulatory reporting:** Report the number of distinct model versions in the portfolio and the fraction of exposure under each version.
3. **Investor transparency:** Provide genome distribution breakdowns in investor reports, demonstrating model governance.
4. **Risk committee review:** Flag genome pairs with high drift intensity and significant combined exposure for risk committee attention.
