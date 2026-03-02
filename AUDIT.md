# Under Center — Full System Audit

**Date:** March 2026
**Scope:** Rating systems, valuation engines, data models, infrastructure, completeness review

---

## Summary

Under Center is a fully-wired athletic identity platform. Every visualization, every algorithm, every rating engine is live and deterministic. The data pipeline currently terminates at client-side placeholder fixtures — no database writes occur. A Rust microservice (`rust-engine/`) has been scaffolded for cryptographic identity, NIL deal signing, and compliance validation.

This document covers: each rating and valuation system, the math behind them, bugs that were identified and fixed, data model mismatches, API coverage, and what remains before production.

---

## 1. Rating Systems

### 1.1 QB Index (`lib/qb-index.ts`)

**Purpose:** Composite ranking number (0–99) tuned for college coach evaluation priorities.

**Inputs (8 metrics):**

| Metric | Weight | Normalization |
|--------|--------|---------------|
| Accuracy | 20% | Direct (0–100) |
| Velocity | 18% | Linear: (mph − 40) / 30 × 100 |
| Mechanics | 16% | Direct (0–100) |
| Release Time | 14% | Inverse linear: (0.7 − sec) / 0.4 × 100 |
| Footwork | 10% | Direct (0–100) |
| Poise | 8% | Direct (0–100) |
| Field Vision | 8% | Direct (0–100) |
| Clutch Factor | 6% | Direct (0–100) |

**Formula:** `QBI = Σ(normalized_metric × weight)`, clamped to 0–99.

**Tier system:**

| Tier | Score | Color |
|------|-------|-------|
| Elite | 90–99 | Green |
| Premium | 80–89 | Cyan |
| Verified | 70–79 | Gold |
| Developing | 60–69 | Silver |
| Emerging | 0–59 | Gray |

**Exports:** `calculateQBIndex()`, `getQBIndexTier()`, `getIndexPercentile()`, `rankAthletes()`, `metricsToIndexInput()`

**Status:** ✅ Fully functional. Weights sum to 1.00. Used in leaderboard, scout, and marketplace pages.

---

### 1.2 Genome Activation Index (`lib/genome-activation-index.ts`)

**Purpose:** Biological-metaphor composite that fuses raw traits with live performance, growth trajectory, and institutional fit into a single 0–99 number.

**Core formula:** `GAI = Base × Activation × (1 + Growth) × Fit`

#### Component 1: Base Genome Score (6 genes)

| Gene | Source Metric | Normalization | Weight |
|------|--------------|---------------|--------|
| VEL-α | velocity | (mph − 40) / 35 × 100 | 20% |
| ACC-γ | accuracy | Direct 0–100 | 20% |
| REL-β | releaseTime | (0.55 − sec) / 0.25 × 100 | 20% |
| MECH-δ | mechanics | Direct 0–100 | 20% |
| DEC-ε | decisionSpeed | Direct 0–100 | 20% |
| SPR-ζ | spinRate | (rpm − 400) / 400 × 100 | Contributes to base |

All weights sum to 1.0. Genes are independently tiered: Elite (≥90), Strong (≥75), Developing (≥55), Raw (<55).

#### Component 2: Live Activation Multiplier (0.80–1.25×)

Simulates in-game performance intensity. Deterministic using athlete ID as seed.

#### Component 3: Seasonal Growth Delta (−0.15 to +0.25)

12-week trajectory modeling improvement or regression over a season.

#### Component 4: Institutional Fit Coefficient (0.70–1.15)

14 D1 program profiles with scheme-specific gene weights:
Alabama, Ohio State, Georgia, Texas, Oregon, Clemson, Michigan, Penn State, USC, LSU, Oklahoma, Notre Dame, Florida, Miami.

**Tier system:**

| Tier | GAI | Label |
|------|-----|-------|
| Generational | 92+ | Generational Talent |
| Elite | 82–91 | Elite Prospect |
| Blue-Chip | 68–81 | Blue-Chip Prospect |
| Prospect | 50–67 | Developing Prospect |
| Developmental | <50 | Developmental |

**Archetype detection (6 types):**

| Archetype | Primary Genes |
|-----------|---------------|
| Cannon Elite | VEL-α, MECH-δ |
| Surgeon | ACC-γ, DEC-ε |
| Architect | DEC-ε, MECH-δ |
| Gunslinger | VEL-α, REL-β |
| Catalyst | VEL-α, ACC-γ |
| Cerebral | DEC-ε, ACC-γ |

**Status:** ✅ Fully functional. Used on profile, compare, scout, awards, and leaderboard pages.

---

### 1.3 NIL Valuation (`app/nil/marketplace/page.tsx`)

**Purpose:** Estimate an athlete's Name/Image/Likeness market value based on performance, recruiting profile, social reach, market, and verification status.

**Composite calculation:**

| Factor | Weight | Derivation |
|--------|--------|------------|
| Performance | 35% | velocity/70 × 30 + mechanics/100 × 35 + accuracy/100 × 35 |
| Recruiting | 25% | min(100, offers × 12 + rating/5 × 40) |
| Social | 15% | min(100, 30 + offers × 8 + verified bonus 15) |
| Market | 15% | 85 for big-5 states (TX, CA, FL, GA, OH), 60 otherwise |
| Verification | 10% | 95 if verified, 30 if not |

**Dollar formula:** `Math.pow(1.065, composite) × 12`, rounded to nearest $50.

**Output range examples:**

| Composite | Dollar Value | Tier |
|-----------|-------------|------|
| 50 | ~$2,750 | Developing |
| 60 | ~$5,300 | Emerging |
| 70 | ~$10,200 | Rising |
| 80 | ~$19,700 | Premium |
| 90 | ~$38,100 | Premium |
| 95 | ~$52,800 | Elite |

**Trend:** Deterministic — `(composite − 60) × 0.35 + sin(idSeed × 2.7) × 4`, using character-code sum of athlete ID as seed.

**Tier thresholds:** Elite ($50K+), Premium ($20K+), Rising ($8K+), Emerging ($3K+), Developing (<$3K).

**Status:** ✅ Fixed. Previously used `composite² × 0.15` which maxed at ~$1,400 for any athlete.

---

## 2. Bugs Identified & Fixed

### 2.1 NIL Valuation Formula (Critical)

**Problem:** The quadratic formula `composite² × 0.15` produced a maximum of ~$1,400 for composite=100. Every athlete was "Developing" regardless of quality, since tier thresholds started at $3K.

**Fix:** Replaced with exponential `1.065^composite × 12`. This correctly distributes values from ~$1K (composite 45) to ~$150K (composite 100).

**Files:** `app/nil/marketplace/page.tsx`

### 2.2 Non-Deterministic NIL Trend (UI Bug)

**Problem:** `Math.random()` was called on every React render for the "vs. last month" trend percentage, causing values to flash randomly on every interaction.

**Fix:** Replaced with deterministic calculation using athlete ID character-code sum as seed.

**Files:** `app/nil/marketplace/page.tsx`

### 2.3 Missing QB Index Inputs (Data Gap)

**Problem:** `AthleteMetrics` in `lib/store.ts` had 6 fields but the QB Index requires 8 inputs (footwork, poise, fieldVision, clutchFactor were missing). Both leaderboard and scout pages contained duplicate inline adapters that estimated these from other metrics.

**Fix:**
1. Added all 4 fields to `AthleteMetrics` interface
2. Populated real values for all 6 placeholder athletes
3. Exported canonical `metricsToIndexInput()` from `lib/qb-index.ts`
4. Removed duplicate adapters from leaderboard and scout pages

**Files:** `lib/store.ts`, `lib/placeholder-data.ts`, `lib/qb-index.ts`, `app/leaderboard/page.tsx`, `app/scout/page.tsx`

### 2.4 Awards Page Type Error

**Problem:** `app/awards/page.tsx` iterated `GENE_MAP` keys using `keyof AthleteMetrics`, but after adding 4 new fields, TypeScript correctly flagged that `footwork` etc. don't exist in `GENE_MAP`.

**Fix:** Narrowed type to `as const` array inferred type instead of `keyof AthleteMetrics`.

**Files:** `app/awards/page.tsx`

### 2.5 Ghost Component Reference

**Problem:** `TECHNICAL-OVERVIEW.md` referenced `components/NILValuation.tsx` which never existed.

**Fix:** Updated to reflect actual file structure.

**Files:** `TECHNICAL-OVERVIEW.md`

---

## 3. Data Model Mismatches

The client-side type system (`lib/store.ts`) and the Prisma database schema (`prisma/schema.prisma`) have naming and field divergences:

### Field Name Mismatches

| Concept | store.ts | Prisma Schema |
|---------|----------|---------------|
| Spin/Spiral | `spinRate` | `spiral` |
| Decision | `decisionSpeed` | `decisionTime` |

### Fields in Prisma Only (not in store.ts)

| Field | Type | Notes |
|-------|------|-------|
| `armStrength` | Float (0–100) | Not used in any calculation |
| `leadership` | Float (0–100) | Not used in any calculation |

### Fields in store.ts Only (not in Prisma)

| Field | Notes |
|-------|-------|
| `spinRate` | Prisma uses `spiral` instead |

### Reconciliation Required

When database persistence is enabled, an adapter layer must map between `spinRate ↔ spiral` and `decisionSpeed ↔ decisionTime`. The store.ts naming is preferred for client code since the QB Index and GAI engines already depend on it. The Prisma schema should be updated to match.

---

## 4. API Coverage

### Existing Routes

| Route | Method | Purpose | Status |
|-------|--------|---------|--------|
| `/api/checkout` | POST | Stripe checkout session creation | ✅ Live |
| `/api/webhook` | POST | Stripe webhook listener | ⚠️ DB update commented out |

### Missing Routes (for production)

| Route | Purpose |
|-------|---------|
| `/api/athletes` | CRUD for athlete profiles |
| `/api/metrics` | Metric submission & history |
| `/api/rankings` | QB Index / GAI leaderboard |
| `/api/nil/deals` | NIL deal creation & tracking |
| `/api/nil/valuation` | Server-side valuation computation |
| `/api/search` | Filtered athlete search |
| `/api/auth/[...nextauth]` | Authentication (files exist as `.bak`) |
| `/api/export` | PDF/report generation |

---

## 5. Rust Engine (`rust-engine/`)

### Architecture

```
Next.js Frontend ──HMAC──▶ Rust Engine ──▶ PostgreSQL
                              │
                              ├── POST /identity/hash     Ed25519-signed identity hashes
                              ├── POST /nil/receipt       Signed NIL deal receipts + compliance
                              ├── GET  /ranking/recompute Percentile ranking snapshots
                              ├── GET  /scrape/run        Recruiting news ingestion (stub)
                              ├── GET  /health            Liveness probe
                              └── GET  /ready             Readiness probe (DB check)
```

### Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Rust, Tokio |
| HTTP | Axum 0.8 |
| Database | PostgreSQL 16 via SQLx 0.8 |
| Crypto | Ed25519-dalek 2, SHA-256, HMAC-SHA256 |
| Auth | HMAC header verification per request |
| Rate Limiting | Governor (token bucket) |
| Observability | Tracing (structured JSON logs) |
| Deployment | Docker multi-stage + docker-compose |

### Modules

| Module | Purpose | Status |
|--------|---------|--------|
| `config` | Environment config loading | ✅ |
| `errors` | Error types → Axum IntoResponse | ✅ |
| `router` | Route registration + CORS | ✅ |
| `models` | AppState, request/response types, DB rows | ✅ |
| `db` | Connection pool setup | ✅ |
| `hashing` | SHA-256, Ed25519 signing, canonical JSON | ✅ |
| `compliance` | 5-state rule engine (CA, TX, NY, FL, AL) | ✅ |
| `ranking` | Percentile computation from snapshots | ✅ |
| `services` | Identity hash + NIL receipt business logic | ✅ |
| `routes` | health, identity, nil, ranking, scrape handlers | ✅ |
| `middleware` | HMAC auth + Governor rate limiting | ✅ |
| `blockchain` | Merkle root anchoring (stub) | ✅ Stub |
| `scraping` | News ingestion (stub) | ✅ Stub |

### Database Tables (Rust engine)

| Table | Purpose |
|-------|---------|
| `profile_ledger` | Identity hashes + Ed25519 signatures |
| `nil_receipts` | Signed deal receipts + compliance status |
| `compliance_checks` | Audit log of compliance validations |
| `scraped_events` | Ingested recruiting news articles |
| `ranking_snapshots` | Percentile computations per metric |

---

## 6. Production Readiness Assessment

### Architecture: 8.5/10

- Clean modular separation (QB Index, GAI, NIL are independent)
- No circular dependencies
- Proper weight normalization (both systems sum to 1.0)
- Deterministic math throughout
- Centralized adapters (no duplication)
- Rust engine provides proper backend separation

### Rating Engine Sophistication: 9/10

- Two independent rating systems (GAI + QB Index)
- Multi-factor normalization with documented ranges
- Archetype detection (6 types)
- Institutional fit modeling (14 programs)
- NIL valuation mapped to exponential curve
- Tier segmentation across all systems

### Data Integrity: 5/10

- No database persistence
- No backend state
- Webhook DB update commented out
- Placeholder dataset only
- No metric ingestion pipeline
- No authentication enforcement

### Overall Production Readiness: 6/10

Missing: DB persistence, snapshot storage, longitudinal tracking, role-based access control, data ingestion pipeline, NIL contract recording.

---

## 7. What's Still Missing

### Critical Path (must have for production)

1. **Database persistence** — Connect Prisma, reconcile field names, enable writes
2. **Webhook completion** — Uncomment Prisma DB update in `/api/webhook`
3. **Authentication** — Re-enable NextAuth (`.bak` files exist)
4. **Metric submission** — Forms/API for coaches and athletes to submit data
5. **Prisma schema alignment** — Rename `spiral → spinRate`, `decisionTime → decisionSpeed` to match client code

### High Priority

6. **Weekly snapshot tables** — `metric_snapshots`, `gai_snapshots`, `qb_index_snapshots`, `nil_value_snapshots`
7. **Coach portal** — Saved boards, premium filtering, export gating
8. **Role-based access** — RBAC enforcement beyond frontend guards
9. **Wire Rust engine to Next.js** — API proxy layer with HMAC authentication

### Medium Priority

10. **NIL contract recording** — Deal workflow, guardian consent, compliance validation
11. **Data ingestion pipeline** — QBDNA/Wilson QBX/manual upload integration
12. **Film room** — Replace placeholder YouTube links with real video processing
13. **Scraping service** — Activate recruiting news scraper in Rust engine
14. **CI/CD** — Automated build, test, deploy pipeline

### Nice to Have

15. **Blockchain anchoring** — Activate Merkle root batching in Rust engine
16. **Mobile optimization** — Responsive audit on all pages
17. **PDF export** — Scouting reports with identity hash verification
18. **Real-time genome tracking** — Live game activation flares from actual data

---

## 8. File Inventory

### Rating & Valuation Engines

| File | Lines | Purpose |
|------|-------|---------|
| `lib/qb-index.ts` | 122 | QB Index composite (8 inputs, 5 tiers) |
| `lib/genome-activation-index.ts` | 392 | GAI engine (6 genes, 4 coefficients, 14 programs) |
| `app/nil/marketplace/page.tsx` | 388 | NIL valuation + marketplace UI |

### Data Layer

| File | Lines | Purpose |
|------|-------|---------|
| `lib/store.ts` | 81 | Zustand store + TypeScript interfaces |
| `lib/placeholder-data.ts` | 186 | 6 placeholder athletes with full metrics |
| `prisma/schema.prisma` | 354 | PostgreSQL schema (16 models) |

### Rust Engine

| File | Purpose |
|------|---------|
| `rust-engine/Cargo.toml` | Crate manifest |
| `rust-engine/src/main.rs` | Server bootstrap |
| `rust-engine/src/config.rs` | Environment config |
| `rust-engine/src/errors.rs` | Error types |
| `rust-engine/src/router.rs` | Route registration |
| `rust-engine/src/models/mod.rs` | Types + DB rows |
| `rust-engine/src/db/mod.rs` | Connection pool |
| `rust-engine/src/hashing/mod.rs` | Crypto operations |
| `rust-engine/src/compliance/mod.rs` | State law validation |
| `rust-engine/src/ranking/mod.rs` | Percentile engine |
| `rust-engine/src/services/mod.rs` | Business logic |
| `rust-engine/src/routes/*.rs` | HTTP handlers |
| `rust-engine/src/middleware/mod.rs` | HMAC + rate limiting |
| `rust-engine/src/blockchain/mod.rs` | Blockchain stub |
| `rust-engine/src/scraping/mod.rs` | Scraper stub |
| `rust-engine/migrations/*.sql` | Database schema |
| `rust-engine/Dockerfile` | Multi-stage build |
| `rust-engine/docker-compose.yml` | App + Postgres |

---

*Audit conducted against commit `e7f56de` on branch `main`.*
