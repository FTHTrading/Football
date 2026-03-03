## 2. Background and Related Work

### 2.1 NIL Policy Landscape

The NCAA's 2021 interim NIL policy emerged after the Supreme Court's unanimous decision in *NCAA v. Alston* (2021), which ruled that the NCAA's restrictions on education-related benefits violated antitrust law. While *Alston* did not directly address NIL rights, the decision catalyzed the NCAA's adoption of an interim policy permitting athletes to monetize their name, image, and likeness without jeopardizing eligibility [@ncaa_nil_2021].

As of 2026, over 30 states have enacted NIL legislation, with significant variation in permissible deal structures, institutional involvement, and disclosure requirements. The SPARTA (Supporting the Passage of Athletic Revenue Through Academics) Act and similar proposals seek federal uniformity but remain pending [@sparta_2023]. This regulatory fragmentation creates compliance risk that is unique to the NIL asset class and must be captured by any underwriting framework.

### 2.2 Structured Finance Fundamentals

Structured finance instruments—asset-backed securities, collateralized debt obligations, revenue participation notes—rely on quantitative models to assess the creditworthiness of underlying cash flows. The 2008 financial crisis revealed that opacity in model assumptions (particularly in mortgage-backed securities) can produce systemic risk [@gorton_2010]. Post-crisis reforms emphasized model transparency, independent validation, and audit trails.

NIL-backed securities share structural features with entertainment royalty securitizations (e.g., Bowie Bonds) and sports revenue bonds but differ in several respects: the underlying asset is an individual rather than a catalog, career duration is short and discontinuous, and regulatory risk is acute and evolving.

### 2.3 Credit Scoring Models

Traditional credit scoring (FICO, VantageScore) uses 5–10 factors derived from repayment history. Corporate credit models (Altman Z-Score, Moody's KMV) incorporate financial statements and market data. Neither framework applies directly to collegiate athletes, who lack credit history, financial statements, and publicly traded equity.

Recent work in alternative credit scoring uses social media activity, mobile phone metadata, and psychometric data to assess creditworthiness in thin-file populations [@berg_2020]. NIL33 draws on this tradition by incorporating engagement quality and reputational signals, but extends it with sport-specific dimensions (injury risk, eligibility status, transfer portal probability) that have no analog in consumer credit.

### 2.4 Model Risk Management

Regulatory guidance on model risk management (SR 11-7 / OCC 2011-12) requires that quantitative models used in financial decision-making be independently validated, version-controlled, and auditable. The genome signature system described in this paper directly addresses these requirements by providing a cryptographic fingerprint that uniquely identifies each model version and enables bit-exact output reproduction.

### 2.5 Reproducibility in Quantitative Finance

The reproducibility crisis in computational science [@baker_2016] has parallels in quantitative finance, where model outputs depend on software versions, numerical precision, random seeds, and data transformations. The NIL33 engine addresses reproducibility through three mechanisms: (1) pure functions with no side effects, (2) a seeded PRNG for Monte Carlo simulation, and (3) a genome signature that captures the complete model state. The research snapshot exporter packages all model parameters and synthetic verification vectors into a single archival artifact suitable for DOI registration.

### 2.6 Software Citation

We follow the FORCE11 Software Citation Principles [@smith_2016], which recommend that software be cited with sufficient metadata to identify the exact version used. The `CITATION.cff` file accompanying this paper provides machine-readable citation metadata conforming to the Citation File Format specification.
