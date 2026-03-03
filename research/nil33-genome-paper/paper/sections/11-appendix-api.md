## Appendix A: Public API Surface and JSON Schemas

This appendix documents the primary public functions and representative JSON schemas for the key data structures. The full TypeScript type definitions are available in the `@nil33/core` package source.

### A.1 Core Functions

```
computeGenomeSignature(weightProfile: WeightProfile): GenomeSignature
```
Computes the genome signature from the current codebase state and the provided weight profile. Returns a `GenomeSignature` containing seven component hashes, the derived genome ID, version, and creation timestamp.

```
verifyGenome(genome: GenomeSignature, weightProfile: WeightProfile): boolean
```
Recomputes the genome from the current codebase and compares it to the provided genome. Returns `true` if all component hashes match.

```
diffGenomes(a: GenomeSignature, b: GenomeSignature): GenomeDiff
```
Compares two genome signatures and returns a structured diff listing changed components with their old and new hash values.

```
scoreAthlete(input: AthleteSignalInput, profile: WeightProfile): CompositeScore
```
Executes the three-stage scoring pipeline (signal normalization, dimension aggregation, composite scoring) and returns the composite score, dimension scores, grade, and risk flags.

```
generateCovenants(score: CompositeScore, flags: RiskFlag[]): Covenant[]
```
Evaluates the 13 canonical covenant rules against the composite score and flags, returning the applicable covenant set.

```
runStressTest(athletes: AthleteSignalInput[], profile: WeightProfile, scenario: StressScenario): StressTestResult
```
Applies a stress scenario's shock vectors to athlete signals, re-scores through the full pipeline, and returns the stressed valuations and NAV impact.

```
runMonteCarloVaR(athletes: AthleteSignalInput[], profile: WeightProfile, config: MonteCarloConfig): MonteCarloVaRResult
```
Executes seeded Monte Carlo simulation with correlated dimension shocks and returns VaR, CVaR, component VaR, and the full percentile distribution.

```
sealReplayRecord(input: AthleteSignalInput, memoId: string, genome: GenomeSignature): UnderwritingReplayRecord
```
Creates a sealed archival record linking inputs, model identity, and output for future replay.

```
replayUnderwriting(record: UnderwritingReplayRecord): ReplayResult
```
Re-executes the underwriting pipeline from a sealed record and verifies output equivalence.

```
generateResearchSnapshot(genome: GenomeSignature, metadata?: object): ResearchSnapshot
```
Packages the complete model specification into an archival artifact including synthetic verification vectors.

```
aggregatePortfolioGenomeMetrics(entries: PortfolioGenomeEntry[]): PortfolioGenomeMetrics
```
Computes genome distribution, homogeneity index, pairwise drift, and mutation risk across a portfolio of genome-stamped positions.

### A.2 GenomeSignature Schema

```json
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

### A.3 ResearchSnapshot Schema (Abbreviated)

```json
{
  "genome": { "genomeId": "...", "version": "1.0.0", "...": "..." },
  "metadata": { "exportedAt": "2026-03-15T...", "engineVersion": "1.0.0" },
  "signalSchema": [
    { "id": "contract_tenure_renewal", "dimension": "revenue_durability", "description": "..." }
  ],
  "weightProfiles": [
    { "name": "RPN", "weights": { "revenue_durability": 0.30, "...": "..." } }
  ],
  "gradeThresholds": [
    { "grade": "A+", "minScore": 95 }
  ],
  "stressScenarios": [
    { "name": "Major Injury (ACL)", "type": "injury", "shocks": { "...": "..." } }
  ],
  "covenantRuleSummary": [
    { "id": "rule_01", "type": "financial", "enforcement": "hard", "description": "..." }
  ],
  "flagRuleSummary": [
    { "code": "SINGLE_SPONSOR_DEPENDENCY", "severity": "critical", "threshold": "..." }
  ],
  "syntheticSamples": [
    { "tier": "Elite", "baseScore": 92, "expectedGrade": "A", "signalInputs": { "...": "..." } }
  ]
}
```

### A.4 PortfolioGenomeMetrics Schema

```json
{
  "totalPositions": 25,
  "totalExposureCents": 500000000,
  "distinctGenomes": 3,
  "clusters": [
    {
      "genomeId": "a3b7c9d1...",
      "genomeVersion": "1.0.0",
      "instrumentCount": 18,
      "totalExposureCents": 380000000,
      "weightPct": 0.76,
      "instrumentIds": ["inst_001", "inst_002", "..."]
    }
  ],
  "driftEdges": [
    {
      "genomeIdA": "a3b7c9d1...",
      "genomeIdB": "f8e7d6c5...",
      "diff": { "identical": false, "changedComponents": ["stressMatrixHash"] },
      "combinedExposureCents": 450000000
    }
  ],
  "homogeneityIndex": 0.62,
  "mutationRisk": 0.15,
  "dominantGenomeId": "a3b7c9d1...",
  "dominantGenomeWeight": 0.76
}
```

### A.5 UnderwritingReplayRecord Schema

```json
{
  "genome": { "genomeId": "...", "version": "1.0.0" },
  "athleteInput": {
    "athleteId": "ath_001",
    "athleteName": "Synthetic Elite",
    "sport": "football",
    "position": "QB",
    "conference": "SEC",
    "signals": {
      "contract_tenure_renewal": { "score": 92, "confidence": 0.95 },
      "...": "..."
    }
  },
  "weightProfile": "RPN",
  "referenceFacilityCents": 100000000,
  "valuationMethodology": "standard",
  "complianceClearance": true,
  "analystNotes": "",
  "monteCarloSeed": 937263,
  "memoId": "memo_uuid_here",
  "generatedAt": "2026-03-15T00:00:00.000Z"
}
```

### A.6 Implementation Summary

| Module | Lines | Purpose |
|---|---|---|
| `types.ts` | ~970 | All shared domain types, signal IDs, genome, snapshot |
| `scoring.ts` | 505 | 33-signal scoring, weight profiles, grades, flags |
| `covenants.ts` | ~290 | 13 covenant rules, canonical form, generation |
| `stress.ts` | ~350 | 6 stress scenarios, shock application, contribution maps |
| `memo.ts` | ~310 | Memo orchestrator, valuation model, risk narrative |
| `genome.ts` | 247 | SHA-256 genome hashing, drift detection, verification |
| `montecarlo.ts` | 275 | Seeded PRNG (Mulberry32), Box-Muller, correlated MC VaR |
| `reproducibility.ts` | 429 | Replay, contribution maps, research snapshot |
| `portfolioGenome.ts` | 213 | Portfolio genome metrics, HHI, mutation risk |
| `schemas.ts` | 138 | Zod validation schemas |
| `constants.ts` | — | Shared constants |
| `index.ts` | 12 | Barrel exports |
| **Total** | **~3,739** | |

Table A.1: *Module inventory.*

| Test Suite | Tests | Coverage |
|---|---|---|
| Engine tests | 34 | Scoring, grading, validation, flags, covenants, stress, memo, valuation |
| Hardening tests | 33 | Genome determinism, PRNG, MC VaR, replay, contributions, snapshot |
| Portfolio genome tests | 8 | Clustering, HHI, drift edges, mutation risk, edge cases |
| **Total** | **75** | |

Table A.2: *Test coverage summary. All tests execute in <500 ms with zero mocks.*

### A.7 Reproduction Protocol

To independently verify any NIL33 underwriting memo:

1. Obtain the `UnderwritingReplayRecord` for the memo.
2. Install `@nil33/core` at the version matching the record's genome version.
3. Call `replayUnderwriting(record)`.
4. Verify that `reproducible === true` and `genomeDrift === false`.
5. Compare `memo.compositeScore.composite`, `memo.compositeScore.grade`, and `memo.valuation.midCents`.

If the genome has drifted, `diffGenomes()` identifies exactly which model components changed.
