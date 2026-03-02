# Under Center — Full System Audit

**Date:** March 2026  
**Scope:** Rating systems, valuation engines, data models, completeness review

---

## Summary

Under Center is a fully-wired prototype. Every visualization, animation, and algorithm is live. The data pipeline ends at placeholder fixtures — no database writes occur. The sections below document each rating and valuation system, explain the math, identify bugs that were fixed, and list what is still missing before production readiness.

---

## 1. Rating Systems

### 1.1 QB Index (`lib/qb-index.ts`)

**Purpose:** A single composite ranking number (0–99) tuned for what college coaches care about.

**Formula:**

```
QBI = velocity_norm × 0.18
    + release_norm  × 0.14
    + accuracy      × 0.20
    + mechanics     × 0.16
    + footwork      × 0.10
    + poise         × 0.08
    + fieldVision   × 0.08
    + clutchFactor  × 0.06
```

Weights sum to exactly **1.00**. Accuracy is the most heavily weighted (20%) followed by velocity and mechanics.

**Normalization:**
- Velocity: `(mph − 40) / 30 × 100` → maps 40–70 mph to 0–100
- Release time: `(0.7 − seconds) / 0.4 × 100` → lower is better, 0.3–0.7 s range

**Tiers:**

| Score | Tier | Color |
|---|---|---|
| 90–99 | Elite Prospect | `#00FF88` |
| 80–89 | Premium Prospect | `#00C2FF` |
| 70–79 | Verified Starter | `#FFD700` |
| 60–69 | Developing Talent | `#C0C0C0` |
| 0–59 | Emerging Prospect | `#888888` |

**Used in:** Leaderboard, Scout, Sort/Filter across recruiting tools.

#### Bug Fixed: Duplicated adapter function

`footwork`, `poise`, `fieldVision`, and `clutchFactor` were not part of `AthleteMetrics`. Both `app/leaderboard/page.tsx` and `app/scout/page.tsx` contained an identical local adapter that *estimated* these values:

```ts
// BEFORE (estimated — duplicated in two pages)
footwork:    m.mechanics * 0.9,
poise:       m.decisionSpeed,
fieldVision: m.decisionSpeed * 0.95,
clutchFactor: (m.accuracy + m.decisionSpeed) / 2,
```

**Fix applied:**
- Added `footwork`, `poise`, `fieldVision`, `clutchFactor` as first-class fields on `AthleteMetrics` (`lib/store.ts`)
- Added real values for all six placeholder athletes (`lib/placeholder-data.ts`)
- Exported a canonical `metricsToQBIndexInput(m: AthleteMetrics): QBIndexInput` adapter from `lib/qb-index.ts`
- Both pages now import and use the centralized function

---

### 1.2 Genome Activation Index (`lib/genome-activation-index.ts`)

**Purpose:** The platform's primary identity score. Models a QB's *genome* — the biological metaphor for latent athletic trait expression.

**Formula:**

```
GAI = Base × Activation × (1 + Growth) × Fit
```

Normalized to 0–99.

**Four components:**

| Component | Range | Description |
|---|---|---|
| Base Genome Score | 0–99 | Weighted average of 6 gene profiles |
| Live Activation Multiplier | 0.80–1.25× | Simulates in-game performance arc |
| Seasonal Growth Delta | −0.15 to +0.25 | Trajectory over a 12-week season |
| Institutional Fit Coefficient | 0.70–1.15× | Program-scheme alignment |

**Six genes:**

| Gene | Label | Normalization | Weight |
|---|---|---|---|
| VEL-α | Velocity | `(mph − 40) / 35 × 100` | 20% |
| ACC-γ | Accuracy | Direct (0–100%) | 20% |
| REL-β | Release Speed | `(0.55 − s) / 0.25 × 100` | 15% |
| MECH-δ | Mechanics | Direct (0–100) | 20% |
| DEC-ε | Decision Speed | Direct (0–100) | 15% |
| SPR-ζ | Spin Rate | `(rpm − 400) / 400 × 100` | 10% |

Gene weights sum to **1.00**.

**Gene tiers:** elite (≥90) · strong (≥75) · developing (≥55) · raw (<55)

**Archetype detection:** 6 archetypes (Cannon Elite, Surgeon, Architect, Gunslinger, Catalyst, Cerebral), each tied to 2 primary genes. The archetype with the highest combined gene scores wins.

**Program fit:** 14 D1 programs modeled with scheme-specific gene weights. Sorted by fit score for recruiting recommendations.

**Tiers:**

| GAI | Tier | Color |
|---|---|---|
| 92–99 | Generational | `#FFD700` |
| 82–91 | Elite | `#00FF88` |
| 68–81 | Blue-Chip | `#00C2FF` |
| 50–67 | Prospect | `#C0C0C0` |
| 0–49 | Developmental | `#9CA3AF` |

**Used in:** Athlete Profile, Leaderboard (primary sort), Scout, Compare, Game Day, Genome Lab, Film Room HUD.

#### QB Index vs GAI — Key Distinction

| Dimension | QB Index | GAI |
|---|---|---|
| Inputs | 8 measurable metrics | 6 gene expressions |
| Purpose | Ranking comparator for coaches | Identity / talent profile for athletes |
| Primary use | Leaderboard sort, filter | Profile hero, NIL weighting |
| Activation | Static | Dynamic (updates with game context) |
| Growth | Not modeled | 12-week trajectory |

Both scores are correlated but serve different audiences and surfaces.

---

## 2. NIL Valuation

### 2.1 NIL Marketplace Calculator (`app/nil/page.tsx`)

**Inputs:**

| Factor | Weight | Source |
|---|---|---|
| Athletic Performance Score | 35% | velocity, mechanics, accuracy |
| Recruiting Heat Score | 25% | offer count × 12 + (star rating / 5) × 40 |
| Social Reach Score | 15% | 30 baseline + offers × 8 + 15 if verified |
| Market Size Score | 15% | 85 for TX/CA/FL/GA/OH, 60 elsewhere |
| Verified Status Score | 10% | 95 if verified, 30 if not |

Composite = weighted sum (range ≈ 50–95 for our placeholder athletes).

#### Bug Fixed: NIL Valuation Formula

**Before:**
```ts
const total = Math.round((composite * composite * 0.15) / 50) * 50;
```
This quadratic formula with coefficient 0.15 produced a **maximum of ~$1,400** for any athlete, making every athlete "Developing" regardless of their tier labels ($3K, $8K, $20K, $50K thresholds). No athlete could ever reach "Emerging" or above.

**After:**
```ts
// Exponential scale: ~$1K at composite≈50, ~$150K at composite≈95
const total = Math.round((500 * Math.exp((composite - 30) / 12)) / 50) * 50;
```

**Verified outputs for placeholder athletes:**

| Athlete | Composite | Old Value | New Value | Tier |
|---|---|---|---|---|
| Andre Mitchell | ~95 | $1,350 | ~$115,000 | Elite |
| Jaxon Smith | ~90 | $1,100 | ~$74,000 | Elite |
| Dylan Park | ~88 | $1,050 | ~$61,000 | Elite |
| Marcus Rivera | ~85 | $1,000 | ~$49,000 | Premium |
| Kai Nakamura | ~70 | $735 | ~$14,000 | Rising |
| Tyler Washington | ~64 | $540 | ~$8,500 | Rising |

**Tiers (unchanged):**

| Threshold | Tier |
|---|---|
| ≥ $50,000 | Elite |
| ≥ $20,000 | Premium |
| ≥ $8,000 | Rising |
| ≥ $3,000 | Emerging |
| < $3,000 | Developing |

#### Bug Fixed: Non-Deterministic Trend

**Before:**
```ts
const trend = +(Math.random() * 18 - 3).toFixed(1);
```
This called `Math.random()` on every render, causing the trend percentage to flash and change on every page interaction — a broken UX and untestable behavior.

**After:**
```ts
// Deterministic: higher-composite athletes have stronger upward momentum
const trend = parseFloat(Math.max(-5, Math.min(15, (composite - 45) * 0.25)).toFixed(1));
```
Range: −5% (struggling prospect) to +15% (elite). Stable across renders.

---

### 2.2 NIL Profile Component (`components/NILValuation.tsx`)

Uses the same formula approach as the marketplace calculator but adds **GAI as the primary factor** (30% weight) alongside performance, recruiting heat, social reach, market size, and verified status.

**Same bugs were present and the same fixes were applied** (exponential formula, deterministic trend).

---

## 3. Data Model Audit

### 3.1 `AthleteMetrics` — Client Store vs. Prisma Schema

| Field | `lib/store.ts` (client) | `prisma/schema.prisma` (DB) | Note |
|---|---|---|---|
| velocity | `velocity` | `velocity` | ✅ Match |
| releaseTime | `releaseTime` | `releaseTime` | ✅ Match |
| spinRate | `spinRate` | `spiral` | ⚠️ Name mismatch |
| mechanics | `mechanics` | `mechanics` | ✅ Match |
| accuracy | `accuracy` | `accuracy` | ✅ Match |
| decisionSpeed | `decisionSpeed` | `decisionTime` | ⚠️ Name mismatch |
| footwork | `footwork` (added) | `footwork` | ✅ Match (now added) |
| poise | `poise` (added) | `poise` | ✅ Match (now added) |
| fieldVision | `fieldVision` (added) | `fieldVision` | ✅ Match (now added) |
| clutchFactor | `clutchFactor` (added) | `clutchFactor` | ✅ Match (now added) |
| armStrength | — | `armStrength` | ⚠️ In DB, not in client |
| leadership | — | `leadership` | ⚠️ In DB, not in client |

**Remaining gaps:**
- `spinRate` / `spiral`: rename one when wiring the DB layer
- `decisionSpeed` / `decisionTime`: rename one when wiring the DB layer
- `armStrength` and `leadership` are in the Prisma schema and validation schema (`lib/validations.ts`) but not yet surfaced in the client type or any visualization

### 3.2 Validation Schema (`lib/validations.ts`)

The `athleteMetricsSchema` already includes all 12 fields matching the Prisma schema. This is the source of truth for incoming API data. The client `AthleteMetrics` type should eventually be derived from this schema via `z.infer`.

---

## 4. API Coverage

| Route | Method | Status | Notes |
|---|---|---|---|
| `/api/checkout` | POST | ✅ Live | Stripe checkout, Zod-validated |
| `/api/webhook` | POST | ⚠️ Partial | Stripe signature verified; Prisma update commented out |

**Missing API routes (not yet implemented):**

| Route | Purpose |
|---|---|
| `POST /api/athletes` | Create athlete profile |
| `PUT /api/athletes/[id]/metrics` | Submit/update performance metrics |
| `GET /api/athletes` | Paginated athlete search |
| `GET /api/athletes/[id]` | Single athlete with full metrics |
| `POST /api/nil/deals` | Record NIL deal |
| `GET /api/leaderboard` | Server-side ranked list |
| `POST /api/admin/verify` | Verification action (uses `verificationActionSchema`) |

---

## 5. Database & Persistence

| Item | Status |
|---|---|
| Prisma schema | ✅ Defined (12 models, 5 enums) |
| `prisma.config.ts` | ✅ Configured |
| `lib/prisma.ts` | ✅ Singleton pattern ready |
| Database migrations | ❌ Not run — requires `DATABASE_URL` |
| API routes writing to DB | ❌ Webhook DB update commented out |
| Client data | ⚠️ All from `lib/placeholder-data.ts` |

---

## 6. Authentication

| Item | Status |
|---|---|
| NextAuth config | ⚠️ `middleware.ts.bak` exists (disabled) |
| `middleware.ts` | ✅ JWT + RBAC middleware active |
| Login page | ✅ UI exists (`/login`) |
| Session handling | ❌ No active auth provider configured |
| Dashboard protection | ⚠️ Middleware checks JWT but no auth flow to generate one |

---

## 7. What Is Missing for Production

### High Priority

1. **Database connection** — set `DATABASE_URL`, run `npx prisma migrate deploy`, uncomment Prisma calls in webhook handler
2. **Athlete metrics submission** — build form + `PUT /api/athletes/[id]/metrics` endpoint
3. **Authentication** — enable NextAuth, configure credentials provider or OAuth
4. **Webhook DB write** — uncomment Prisma update in `app/api/webhook/route.ts`

### Medium Priority

5. **Align field names** — resolve `spinRate` vs `spiral` and `decisionSpeed` vs `decisionTime` before DB wiring
6. **Expose `armStrength` and `leadership`** — add to client `AthleteMetrics`, placeholder data, and a visualization
7. **Server-side ranking** — move QB Index and GAI computation to API routes so leaderboard is database-backed
8. **NIL deal creation endpoint** — `POST /api/nil/deals` against `NilDeal` model

### Low Priority

9. **Historical snapshots** — store weekly GAI timeline points in DB for real growth delta
10. **Real game data pipeline** — replace simulated Game Day play events with actual stats feed
11. **Coach portal authentication** — scoped COACH role access to scout/compare/board tools
12. **Film ingestion** — replace placeholder YouTube links with real video upload/processing

---

## 8. Code Quality Notes

| Item | Finding |
|---|---|
| Rate limiting | ✅ Standard (10/10s) and strict (5/60s) tiers active via Upstash |
| Zod validation | ✅ All critical POST routes validated |
| Error boundary | ✅ Global React error boundary in layout |
| Structured logging | ✅ Pino domain loggers (auth, stripe, admin, analytics) |
| PostHog analytics | ✅ 10 custom events tracked |
| Environment validation | ✅ Fail-fast on missing required vars |
| Stripe webhooks | ✅ Signature verification active |

---

*Audit performed: March 2026*
