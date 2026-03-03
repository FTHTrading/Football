## 7. Lifecycle Integration

Prior sections describe the genome as a static fingerprint computed at model specification time. This section presents the architectural extension that propagates genome identity through the capital lifecycle: from underwriting run to instrument creation to distribution allocation. This extension transforms the genome from a verification tool into a provenance system.

### 7.1 Motivation

In structured finance, the model used to originate an instrument may differ from the model used to evaluate it months later. Weight profiles may be recalibrated. Stress scenarios may be added. Flag thresholds may be tuned. Without explicit provenance, it is impossible to determine whether a valuation discrepancy reflects genuine credit deterioration or model drift.

The lifecycle integration solves this by stamping every capital object with the genome that produced it, creating an immutable lineage from origination through distribution.

### 7.2 The UnderwritingRun Object

Each execution of the underwriting pipeline is recorded as an `UnderwritingRun` with the following fields:

| Field | Type | Purpose |
|---|---|---|
| `id` | UUID | Unique run identifier |
| `athleteId` | FK | The athlete being underwritten |
| `genomeId` | string | The 128-bit genome ID at time of execution |
| `genomeVersion` | string | The semantic version (e.g., `1.0.0`) |
| `snapshotHash` | string | SHA-256 of the full research snapshot at time of run |
| `modelConfig` | JSON | Serialized weight profile and Monte Carlo configuration |
| `createdAt` | timestamp | When the run was executed |

The `UnderwritingRun` captures the complete model identity at the moment of decision. If the model is subsequently modified (producing a new genome), the historical run retains its original genome stamp, enabling retrospective analysis of model evolution.

### 7.3 Instrument Genome Stamping

When an instrument (e.g., a Revenue Participation Note) is created from an underwriting run, the genome identity propagates to the instrument record:

| Field | Type | Source |
|---|---|---|
| `genomeId` | string | Inherited from the originating `UnderwritingRun` |
| `genomeVersion` | string | Inherited from the originating `UnderwritingRun` |
| `underwritingRunId` | FK | Link to the full run record |

A database index on `genomeId` enables efficient queries such as "find all instruments originated under genome version X" or "identify instruments whose originating genome differs from the current production genome."

### 7.4 Distribution Genome Stamping

Distributions allocate cash flows from instruments to investors. Each distribution inherits its genome identity from the parent instrument:

$$\text{UnderwritingRun} \xrightarrow{\text{genomeId}} \text{Instrument} \xrightarrow{\text{genomeId}} \text{Distribution}$$

This inheritance is automatic: the distribution creation API reads the parent instrument's genome fields and copies them to the distribution record. No manual genome specification is required, and the provenance chain is maintained without analyst intervention.

### 7.5 Querying the Genome Lineage

The genome-stamped schema supports several operationally significant queries:

1. **Model vintage analysis:** Group instruments by `genomeId` to assess portfolio exposure to each model version.
2. **Drift detection:** Compare the `genomeId` on existing positions against the current production genome to identify stale underwriting.
3. **Regulatory audit:** For any distribution payment, trace back through the instrument to the underwriting run and retrieve the exact model configuration that produced the original credit assessment.
4. **Re-underwriting candidates:** Identify instruments whose originating genome has drifted in specific components (e.g., stress matrix changes) that may materially affect their risk profile.

### 7.6 UI Surfacing

The `ModelIdentityBadge` component renders genome identity in two variants:

- **Compact:** An inline badge displaying the truncated genome ID (8 characters) and version, suitable for list views and table cells.
- **Full:** An expanded panel showing the complete genome ID, version, snapshot hash, and a link to the originating underwriting run, suitable for detail pages.

Both variants are rendered on instrument detail pages, distribution detail pages, underwriting run views, and portfolio-level dashboards, ensuring that genome provenance is visible at every stage of the capital lifecycle.
