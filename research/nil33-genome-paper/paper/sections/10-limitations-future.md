## 10. Limitations and Future Work

### 10.1 Volatility Calibration

The dimension-level volatility assumptions in the Monte Carlo engine ($\sigma_d$ values) are currently expert estimates, not historically calibrated. As the NIL market matures and deal performance data accumulates, empirical calibration from observed revenue variance, default rates, and recovery patterns will improve the accuracy of VaR estimates. Until sufficient historical data is available, the current volatility parameters should be treated as scenario assumptions rather than empirical measures.

### 10.2 Correlation Estimation

Cross-dimension correlations ($\rho_d$) are currently pairwise constants. In practice, correlations between dimensions (e.g., the relationship between injury events and sponsor departure) are regime-dependent: they increase during market stress and decrease during stable periods. A dynamic correlation model such as DCC-GARCH (Dynamic Conditional Correlation) would better capture these regime shifts but adds calibration complexity and departs from the pure-function architecture.

### 10.3 Signal Weighting Optimization

Within each dimension, signals are equally weighted by default. This is a conservative choice that avoids overfitting to limited historical data. As deal performance data grows, Bayesian or regularized regression on deal outcomes could optimize intra-dimension signal weights. Any such optimization would produce a new genome, ensuring that the change is tracked and the prior model remains reproducible.

### 10.4 Portfolio Optimization

The current framework scores and stresses portfolios but does not optimize allocation. Mean-variance optimization using the component VaR decomposition, or CVaR-constrained optimization, is a natural extension. The genome-stamped instrument schema provides the provenance infrastructure needed to track which model version was used for each optimization run.

### 10.5 Temporal Dynamics

Signal scores are point-in-time snapshots. A state-space model (e.g., Kalman filter) could incorporate temporal evolution of signal quality, producing smoothed estimates that account for observation noise and seasonal patterns. This would require extending the engine's input model from a single `AthleteSignalInput` snapshot to a time series of observations.

### 10.6 Cross-Genome Comparison Engine

The current `diffGenomes()` function identifies which components changed between two genomes but does not quantify the impact of those changes on portfolio-level risk metrics. A cross-genome comparison engine would: (a) re-score all positions under a new genome, (b) compute the aggregate impact on portfolio VaR, grades, and covenant triggers, and (c) generate a transition report suitable for risk committee review. This extension would leverage the lifecycle integration described in Section 7 to identify affected positions efficiently.

### 10.7 Audit Ledger Anchoring

The genome signature provides model identity, but it does not anchor events to an immutable external log. Integrating the audit ledger package (append-only event log with cryptographic chaining) would provide a tamper-evident record of every genome publication, underwriting run, and model modification, suitable for regulatory examination.

### 10.8 Security Considerations

Several security properties are noted for implementers:

- **SHA-256 usage.** Genome signatures use SHA-256 for collision resistance, not for security against adversarial modification. An attacker with write access to the codebase can modify both the model and the genome computation.
- **PRNG limitations.** Mulberry32 is not cryptographically secure. Seeds should be treated as model parameters, not secrets.
- **Data protection.** Signal scores are not encrypted at rest by the engine. Production deployments must implement encryption and access control independently of the underwriting engine.
