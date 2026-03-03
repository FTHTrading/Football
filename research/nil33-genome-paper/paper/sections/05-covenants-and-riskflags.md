## 5. Covenant Generation and Risk Flags

### 5.1 Covenant Engine Architecture

Covenants are generated deterministically from the composite score, dimension scores, and risk flags. The covenant engine evaluates 13 canonical rules, each defined by:

- **Trigger condition:** A score threshold, dimension-level condition, or flag match.
- **Covenant type:** One of `financial`, `reporting`, `behavioral`, or `compliance`.
- **Enforcement level:** `hard` (breach constitutes an event of default) or `soft` (breach triggers watchlist monitoring and heightened reporting).
- **Description:** A human-readable narrative of the covenant obligation.

The rule evaluation is closed-form: no covenant can appear in the output that is not defined by a canonical rule. This property is essential for reproducibility—given the same score, flags, and genome, the identical covenant set is always generated.

### 5.2 Rule Structure

Each rule follows the general form:

$$\text{IF} \quad C < \tau \quad \text{AND/OR} \quad f \in \mathcal{F}_{\text{triggers}} \quad \text{THEN EMIT} \quad \text{Covenant}(\textit{type}, \textit{enforcement}, \textit{description})$$

where $C$ is the composite score, $\tau$ is the rule-specific threshold, $f$ is a flag code, and $\mathcal{F}_{\text{triggers}}$ is the set of triggering flags for the rule.

A mandatory morality clause is appended whenever a `REPUTATION_RISK` flag is present in the risk flag output, regardless of the composite score. This reflects institutional practice in athlete-backed finance, where reputational events can impair asset value independently of quantitative credit metrics.

### 5.3 Canonical Form

The full set of 13 rules plus the conditional morality clause is serialized into a canonical form (`COVENANT_RULES_CANONICAL`) that is included in the genome hash computation. This means that any change to a covenant trigger threshold, enforcement level, or rule description produces a new genome ID and is detectable via `diffGenomes()`.

### 5.4 Risk Flag Detection

Ten flag rules operate in parallel to the composite score computation. Flags detect conditions that warrant attention even when the composite score is adequate. Each flag specifies:

- **Severity:** `critical` (immediate intervention required), `caution` (elevated monitoring), or `watch` (informational).
- **Diagnostic code:** A machine-readable identifier (e.g., `SINGLE_SPONSOR_DEPENDENCY`, `REPUTATION_RISK`).
- **Triggered by:** A single-signal threshold breach, a dimension-level average, or a cross-dimension condition.
- **Recommendation:** A human-readable action item for the analyst.

Flag rules are encoded in the `FLAG_RULES_CANONICAL` array, which is a genome component. Adding, removing, or modifying any flag rule produces a new genome, ensuring that the risk detection surface is versioned alongside the scoring model.

### 5.5 Interaction Between Flags and Covenants

The flag and covenant systems interact in a single pass: the scoring engine produces flags, which are then available as inputs to the covenant engine. This creates a dependency chain:

$$\text{Signals} \rightarrow \text{Scores} + \text{Flags} \rightarrow \text{Covenants}$$

The interaction is unidirectional (covenants never affect scores or flags), preserving the pure-function contract.
