# Sovereign Capital OS — Executable Blueprint

**System:** SCOS (Sovereign Capital Operating System)
**Classification:** Private sovereign-grade infrastructure (Phase C → B)
**Owner:** FTH Trading
**Status:** Architecture locked. Phase 1 in progress.

---

## Strategic Position

SCOS is a jurisdiction-aware, agent-permissioned, policy-executing governance layer for programmable capital.

Not a chain. Not a wallet. Not a payments rail.

The governance nervous system for regulated asset circulation at machine speed.

**Meta builds distribution pipes. SCOS builds the rulebook that governs pipes globally.**

---

## Architecture Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 6 — Agentic Commerce Layer                               │
│  Agent Mandate Tokens · Capability Scoping · Principal Auth     │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 5 — Continuous Audit & Regulatory Transparency           │
│  Decision hashes · Merkle batches · Regulator dashboard         │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Distribution Control Plane                           │
│  Venue Adapters · Composite Rule Enforcement · Action Gates     │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Enforced Instrument Standard                         │
│  Transfer hooks · Partition support · Freeze domains            │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 2 — Policy Compiler (Governance Kernel)                  │
│  Policy DSL · Deterministic evaluation · Versioned rulesets     │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 1 — Identity & Authority Fabric                          │
│  Global DID · Credential Authority · Delegated Mandates         │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 0 — Settlement Substrate (External)                      │
│  USDC · EVM/L2 · Custodial rails · CBDCs — chain-agnostic      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Existing Infrastructure (Already Built)

The SCOS kernel extends the Under Center engine (`rust-engine/`):

| Component | Status | Maps to SCOS Layer |
|---|---|---|
| Ed25519 signing (ed25519-dalek) | ✅ Production | Layer 1, 5 |
| SHA-256 identity hashing | ✅ Production | Layer 1 |
| Deterministic integer scoring | ✅ Production | Layer 2 |
| 20-state compliance rulesets | ✅ Production | Layer 2 |
| Merkle tree computation | ✅ Production | Layer 5 |
| Blockchain anchoring (stub) | ✅ Scaffolded | Layer 5 |
| Receipt generation + signing | ✅ Production | Layer 5 |
| Axum REST API | ✅ Production | Layer 4 |
| PostgreSQL persistence | ✅ Production | All layers |

**Implication:** 60% of Layer 1, 2, and 5 infrastructure already exists. SCOS is an extension, not a rewrite.

---

## Layer-by-Layer Specification

### LAYER 0 — Settlement Substrate

External. We do not own this layer.

SCOS is enforcement-aware but chain-agnostic. Supported substrates:

- EVM-compatible chains (Ethereum, Arbitrum, Base, Polygon)
- Stablecoins (USDC, USDT, PYUSD)
- Custodial rails (institutional custody providers)
- Future CBDCs

SCOS never directly settles. It authorizes settlement.

---

### LAYER 1 — Identity & Authority Fabric

**Purpose:** Define who can act, what they can do, and under what authority.

#### Entity Types

```rust
enum EntityType {
    Human,
    Institution,
    Regulator,
    Issuer,
    Venue,
    Agent,
}
```

#### 1a. Global DID Registry

Every actor in SCOS has a deterministic identifier:

```
DID = SHA-256(entity_type || root_public_key || jurisdiction)
```

- Hardware-backed root key anchoring (HSM/KMS)
- Chain-agnostic identity proofs
- Revocable but never reusable

**Extends:** `rust-engine/src/hashing/` — SHA-256 + Ed25519 infrastructure already built.

#### 1b. Credential Authority Framework

Credentials are signed attestations about an entity:

| Credential | Issuer | Expiry | Example |
|---|---|---|---|
| KYC/KYB | Licensed provider | 12mo | "Entity is verified individual" |
| Accreditation | Attestor | 12mo | "Qualified purchaser" |
| Jurisdiction | Self-declared + verified | Ongoing | "Domiciled: US-DE" |
| Regulatory class | Regulator | Per-regime | "Registered broker-dealer" |
| Agent mandate | Principal | Time-bounded | "May spend ≤$50K on Treasuries" |

Credentials are:
- Ed25519 signed by issuer
- Timestamped (ISO 8601)
- Hash-anchored to audit chain
- Revocable via real-time revocation list

#### 1c. Delegated Authority Engine

AI agents never act autonomously. They act under signed Mandates:

```rust
struct AgentMandate {
    principal_did: DID,
    agent_did: DID,
    max_spend_per_period_cents: i64,
    period_seconds: u64,
    allowed_asset_classes: Vec<AssetClass>,
    allowed_venues: Vec<VenueId>,
    risk_tolerance: RiskLevel,
    expires_at: DateTime<Utc>,
    requires_human_override: bool,
    signature: Ed25519Signature,
}
```

Agents cannot escalate privileges. Mandate scope is the hard ceiling.

---

### LAYER 2 — Policy Compiler (The Kernel)

**Purpose:** Compile jurisdiction rules, offering restrictions, and risk parameters into deterministic evaluation functions.

This is the core of SCOS.

#### Policy Evaluation Function

```
Evaluate(asset, from, to, amount, venue, timestamp, credentials)
→ PolicyDecision {
    action: Allow | Deny,
    risk_score: i32,        // 0–99, integer arithmetic
    reason_codes: Vec<ReasonCode>,
    policy_version: Hash,
    decision_hash: Hash,
    signature: Ed25519Signature,
}
```

**Extends:** `rust-engine/src/scoring/` — deterministic integer arithmetic scoring already implemented.
**Extends:** `rust-engine/src/compliance/` — state-level rule evaluation already implemented.

#### Policy Input Domains

1. Jurisdiction rules (50-state + international)
2. Offering restrictions (Reg D, Reg S, Reg A+, etc.)
3. Venue risk parameters
4. Investor class eligibility
5. Sanctions lists (OFAC, EU, UN)
6. Time locks
7. Asset-specific logic
8. Cross-border constraints
9. Agent mandate caps

#### Policy Properties (Non-Negotiable)

- **Versioned** — every ruleset has a semantic version and hash
- **Hash-anchored** — policy hash included in every decision
- **Multisig-governed** — policy updates require M-of-N approval
- **Timelocked** — policy changes enforce minimum delay before activation
- **Replayable** — any historical decision can be reconstructed from archived inputs + policy version

#### Policy DSL (Phase 2)

Human-readable policy language compiled to Rust enforcement:

```
RULE "accredited-only-offering" {
  WHEN asset.class == "RegD506c"
  REQUIRE actor.credentials CONTAINS "accredited_investor"
  REQUIRE actor.credentials CONTAINS "kyc_verified"
  REQUIRE actor.jurisdiction IN asset.allowed_jurisdictions
  DENY WITH "non-accredited investor" IF NOT SATISFIED
}
```

Readable by legal teams. Compiled to Rust evaluators. Future: ZK-friendly proof circuits.

---

### LAYER 3 — Enforced Instrument Standard

**Purpose:** Every tokenized asset executes governance rules. No exception.

#### SCOS Instrument Template

Every asset deployed through SCOS must implement:

```rust
trait SCOSInstrument {
    /// Called before every transfer. Returns PolicyDecision.
    fn validate_transfer(&self, from: &DID, to: &DID, amount: u64, ctx: &TransferContext) -> PolicyDecision;

    /// Verify the policy attestation on this instrument.
    fn verify_policy_attestation(&self) -> bool;

    /// Support partitioned holdings (tranches).
    fn partitions(&self) -> Vec<Partition>;

    /// Collateral eligibility for lending markets.
    fn collateral_eligible(&self, venue: &VenueId) -> bool;

    /// Which venues can this asset trade on?
    fn venue_compatibility(&self) -> Vec<VenueId>;

    /// Freeze domains: asset-level, venue-level, jurisdiction-level.
    fn freeze_status(&self, domain: FreezeDomain) -> FreezeState;

    /// Regulatory forced transfer (strict role-controlled).
    fn forced_transfer(&self, authority: &RegulatoryAuthority, to: &DID, amount: u64) -> Result<()>;
}
```

No asset circulates without invoking SCOS policy evaluation. Governance travels with the asset.

---

### LAYER 4 — Distribution Control Plane

**Purpose:** Control how assets flow through venues without trusting any single venue.

#### Venue Types

- Lending markets (isolated collateral pools)
- DEX pools (AMM, CLMM)
- Institutional custody rails
- Agentic payment systems
- OTC flows
- Secondary markets

#### SCOS Venue Adapter Interface

Every venue must call:

```rust
trait VenueAdapter {
    fn validate_participation(
        &self,
        actor: &DID,
        asset: &AssetId,
        action: Action,
        context: &VenueContext,
    ) -> CompositeDecision;
}
```

#### Composite Rule

```
ALLOW = Issuer Policy ∧ Network Policy ∧ Venue Policy
```

All three must pass. No single actor can weaken constraints unilaterally.

One deny at any level = deny at all levels.

---

### LAYER 5 — Continuous Audit & Regulatory Transparency

**Purpose:** Every policy decision produces a verifiable, replayable audit record.

**Extends:** `rust-engine/src/blockchain/` — Merkle tree computation + batch anchoring already implemented.

#### Decision Record

Every `Evaluate()` call produces:

```rust
struct AuditRecord {
    decision_id: Uuid,
    decision_hash: String,        // SHA-256
    policy_version_hash: String,
    input_snapshot: EncryptedBlob, // Replayable
    result: PolicyDecision,
    jurisdiction_tag: String,
    merkle_batch_id: Option<String>,
    anchor_tx: Option<String>,    // On-chain anchor
    timestamp: DateTime<Utc>,
    signature: Ed25519Signature,
}
```

#### Regulator Interface

Regulators get:
- Read-only live compliance dashboard
- Historical replay capability (re-evaluate any decision with archived policy + inputs)
- Policy diff visualization (what changed between rule versions)
- Violation alerting stream (real-time push)

Compliance is not reporting. It is machine-verifiable state.

---

### LAYER 6 — Agentic Commerce Layer

**Purpose:** AI agents transact within SCOS under structured, auditable, revocable authority.

#### Agent Mandate Tokens

A signed capability object:

```rust
struct MandateToken {
    mandate_id: Uuid,
    principal: DID,           // The human/institution authorizing
    agent: DID,               // The AI agent acting
    max_spend_cents: i64,     // Per period
    period: Duration,
    allowed_assets: Vec<AssetClass>,
    allowed_venues: Vec<VenueId>,
    risk_cap: RiskLevel,
    expires_at: DateTime<Utc>,
    human_override: bool,     // Require human approval above threshold
    override_threshold_cents: Option<i64>,
    signature: Ed25519Signature,
}
```

#### Agent Transaction Flow

```
Agent submits action request
  → Verify principal credential (is the human still authorized?)
  → Verify mandate (is this within scope?)
  → Evaluate policy (does this pass all rules?)
  → Execute or deny
  → Log audit record
```

Agents cannot escalate privileges. This is the Meta-level solution: AI transacts without becoming a rogue financial actor.

---

## Governance Structure (Non-Negotiable)

### Three-Tier Governance

| Tier | Controls | Mechanism |
|---|---|---|
| Issuer | Asset-level rules, offering restrictions | Multisig + timelock |
| Network | Global policy, sanctions, DID registry | M-of-N council + timelock |
| Venue | Venue-specific risk, participation rules | Venue operator + SCOS approval |

Each tier has:
- Multisig control (no single-key operations)
- Timelock on policy updates (minimum 48h for non-emergency)
- Emergency scoped freeze (max 72h without governance vote)
- Transparent change logs (every update hash-anchored)

No opaque backdoors. No admin keys.

---

## Security Model

### Mandatory Controls

- HSM/KMS-backed signing for all governance operations
- Key separation per role (signing ≠ admin ≠ operator)
- Upgrade timelocks (no instant deploys)
- Formal verification for enforcement layer (Phase 2)
- Replay attack protection (nonce + timestamp + chain ID)
- Attestation expiration (no perpetual credentials)
- Revocation lists (real-time, hash-anchored)

### Threat Model

| Threat | Mitigation |
|---|---|
| Compromised policy signer | Multisig (M-of-N) + timelock |
| Venue spoofing | DID verification + mutual TLS |
| Credential forgery | Ed25519 signature verification + revocation check |
| Cross-chain replay | Chain ID binding in decision hashes |
| Agent mandate hijacking | Principal re-verification on each action |
| Oracle corruption | Multiple oracle sources + outlier detection |
| Regulatory key compromise | Hardware-backed keys + scoped authority |

---

## Cross-Jurisdiction Control

```
sourceJurisdiction → allowedTransition → targetJurisdiction
```

SCOS tracks per transaction:
- Asset domicile (where was the instrument issued?)
- Investor domicile (where is the actor based?)
- Regulatory zone (which regime applies?)
- Cross-border restriction matrix
- Tax classification tags
- AML/CFT flags (OFAC, EU sanctions, UN lists)

Policy engine handles conflict resolution: strictest rule wins.

---

## Phased Implementation

### Phase 1 — Core Governance Kernel (Current)

| Component | Module | Status |
|---|---|---|
| DID Registry | `scos/identity/` | Building |
| Credential Framework | `scos/credentials/` | Building |
| Policy Engine v1 | `scos/policy/` | Building (extends `compliance/`) |
| Enforced Instrument | `scos/instrument/` | Building |
| Audit Pipeline | `scos/audit/` | Building (extends `blockchain/`) |
| REST API | `scos/api/` | Building (extends `routes/`) |

### Phase 2 — Lending Integration

- Isolated collateral market adapter
- LTV + liquidation constraints via policy engine
- Policy DSL v1 (human-readable rules → compiled enforcement)
- ZK-compliance proof circuits (research)

### Phase 3 — Agent Commerce

- Mandate engine (full mandate lifecycle)
- Escrow + streaming payment adapter
- Automated treasury operations
- Agent monitoring dashboard

### Phase 4 — Cross-Chain Governance

- Policy portability across chains
- Cross-chain attestation bridging
- ZK-compliance proofs (production)
- Multi-chain settlement orchestration

---

## Production Outcomes

When SCOS is fully operational:

- Tokenized Treasuries used as collateral globally — with jurisdiction-aware transfer restrictions
- Stablecoins managed by AI treasurers — under signed mandates with hard spend caps
- 24/7 regulated fund trading — every trade policy-evaluated in <10ms
- Cross-border transfers without manual oversight — policy engine handles conflict resolution
- Regulator-readable machine proofs — not PDFs, not spreadsheets, cryptographic state
- Assets shift from idle → collateral → traded → redeemed — governance travels with the asset

Capital becomes programmable.
Governance becomes automatic.
Compliance becomes cryptographic.

---

## Module Layout

```
rust-engine/src/
├── scos/
│   ├── mod.rs                    # SCOS kernel entry point
│   ├── identity/
│   │   ├── mod.rs                # DID registry
│   │   ├── did.rs                # DID generation + resolution
│   │   ├── entity.rs             # Entity types + metadata
│   │   └── registry.rs           # Registry operations
│   ├── credentials/
│   │   ├── mod.rs                # Credential framework
│   │   ├── credential.rs         # Credential types + validation
│   │   ├── authority.rs          # Credential issuers
│   │   └── revocation.rs         # Real-time revocation list
│   ├── policy/
│   │   ├── mod.rs                # Policy engine
│   │   ├── compiler.rs           # Rule compilation
│   │   ├── evaluator.rs          # Deterministic evaluation
│   │   ├── ruleset.rs            # Versioned rulesets
│   │   └── jurisdiction.rs       # Cross-jurisdiction logic
│   ├── instrument/
│   │   ├── mod.rs                # Enforced instrument standard
│   │   ├── template.rs           # SCOS instrument trait
│   │   ├── partition.rs          # Tranche support
│   │   └── freeze.rs             # Freeze domains
│   ├── venue/
│   │   ├── mod.rs                # Venue adapter interface
│   │   ├── adapter.rs            # Venue integration trait
│   │   └── composite.rs          # Composite rule enforcement
│   ├── audit/
│   │   ├── mod.rs                # Audit pipeline
│   │   ├── record.rs             # Audit record types
│   │   ├── merkle.rs             # Merkle batch anchoring
│   │   └── regulator.rs          # Regulator interface
│   └── agent/
│       ├── mod.rs                # Agentic commerce layer
│       ├── mandate.rs            # Mandate token lifecycle
│       └── executor.rs           # Agent transaction executor
```

---

## Strategic Positioning

**Phase C:** FTH Trading owns the stack. Licenses the kernel. Controls all governance tiers initially.

**Phase B transition:** Once the kernel is proven (live policy enforcement, audit trail, regulator dashboard), invite institutional partners as:
- Venue Operators (integrate via adapter interface)
- Credential Issuers (issue KYC/KYB attestations)
- NOT governors (governance rights earned through integration depth, not purchased)

**Moat:** The policy compiler + enforcement layer + audit chain. Anyone can build a token. Nobody else has a jurisdiction-aware governance kernel that produces machine-verifiable compliance proofs.

---

*Document version: 1.0.0*
*Architecture locked: 2026-03-02*
*Owner: FTH Trading Engineering*
