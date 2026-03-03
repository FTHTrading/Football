## 9. Reproducibility Architecture

### 9.1 Design Goals

The reproducibility architecture ensures that any underwriting memo produced by the NIL33 engine can be independently verified to the bit level by any party with access to the engine source code and the archived inputs. This is achieved through three mechanisms: sealed replay records, dimension contribution maps, and the research snapshot exporter.

### 9.2 Replay Underwriting

The `replayUnderwriting(record)` function accepts a sealed `UnderwritingReplayRecord` and re-executes the full scoring, covenant, stress, and memo pipeline. The replay procedure:

1. Verifies that the genome embedded in the record matches the genome computed from the current codebase and weight profile.
2. Regenerates the complete memo from the archived inputs.
3. Compares core outputs: composite score, grade, valuation (low/mid/high in cents), covenant set, and narrative text.

If any discrepancy is found, the function returns `reproducible: false` with `genomeDrift: true`, indicating that the model has changed since the original underwriting. The `diffGenomes()` function can then identify exactly which components drifted.

### 9.3 Sealed Replay Records

The `sealReplayRecord()` function creates an archival-ready record containing:

| Field | Purpose |
|---|---|
| `genome` | The genome signature at time of original underwriting |
| `athleteInput` | The complete `AthleteSignalInput` (all 33 signals, metadata) |
| `weightProfile` | The weight profile used (RPN, PTN, or custom) |
| `referenceFacilityCents` | The reference facility amount for valuation |
| `valuationMethodology` | The valuation approach identifier |
| `complianceClearance` | Compliance status at time of underwriting |
| `analystNotes` | Free-text analyst commentary |
| `monteCarloSeed` | The PRNG seed used for any Monte Carlo analysis |
| `memoId` | UUID linking to the produced memo output |
| `generatedAt` | ISO 8601 timestamp of record creation |

Table 7: *Sealed replay record fields.*

This record is sufficient for any party to independently reproduce the exact score, grade, valuation, covenant set, and risk flags. The record is self-contained: no external state or database queries are required beyond the engine source code at the matching genome version.

### 9.4 Dimension Contribution Maps

The `buildDimensionContributionMap(score)` function decomposes the composite score into per-dimension signed contributions relative to an equal-weight baseline:

$$\text{contribution}_d = \left(W_d - \frac{1}{6}\right) \cdot S_d$$

Positive contributions indicate that the weight profile amplifies the dimension's influence relative to equal weighting; negative contributions indicate suppression. The total weighting effect equals $C - C_{\text{equal}}$, the difference between the actual composite and the equal-weight composite.

This decomposition provides an explainability layer: analysts and investors can see not only the composite score but how the chosen weight profile shifts it relative to a neutral baseline.

### 9.5 Research Snapshot Exporter

The `generateResearchSnapshot(genome, metadata?)` function produces a complete model archive containing:

- **Genome signature** with all seven component hashes.
- **Signal schema** with human-readable descriptions of all 33 signals.
- **Weight profiles** (both RPN and PTN) with full dimension weights.
- **Grade threshold table** (11 grades from A+ through F).
- **Stress scenarios** (all 6 scenarios with shock vectors).
- **Covenant rule summary** (13 canonical rules).
- **Flag rule summary** (10 flag rules with thresholds and severities).
- **Synthetic verification samples** (5 synthetic athletes spanning all grade bands).

The synthetic samples have known base scores (92, 78, 60, 45, 28) that produce deterministic outputs under the canonical weight profiles. Any independent implementation of the NIL33 engine can verify correctness by checking that these samples produce the expected composite score, grade, and flag count. This serves the same function as test vectors in cryptographic standards.

### 9.6 Archival and DOI Registration

The research snapshot, combined with the sealed replay record format and the genome signature, constitutes a complete archival package for DOI registration. A researcher receiving this package can:

1. Install the engine at the specified genome version.
2. Load the research snapshot to verify the model specification.
3. Run the synthetic verification samples to confirm behavioral equivalence.
4. Replay any sealed underwriting record to verify reproducibility.

This workflow satisfies the reproducibility requirements outlined in the FORCE11 Software Citation Principles [@smith_2016] and provides a stronger guarantee than source code archival alone, because the synthetic test vectors detect behavioral drift even in the presence of functionally equivalent refactoring.
