# UNDER CENTER

### Verified Quarterback Identity System

> Verified metrics. Real recruiting data. Institutional-grade quarterback intelligence.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Rating Engines](#4-rating-engines)
5. [Core Modules](#5-core-modules)
6. [NIL Infrastructure](#6-nil-infrastructure)
7. [Data Model](#7-data-model)
8. [Rust Engine](#8-rust-engine)
9. [Security & Hardening](#9-security--hardening)
10. [Analytics & Observability](#10-analytics--observability)
11. [Documentation](#11-documentation)
12. [Deployment Guide](#12-deployment-guide)
13. [Environment Variables](#13-environment-variables)
14. [Development Workflow](#14-development-workflow)
15. [Roadmap](#15-roadmap)

---

## 1. System Overview

Under Center is a full-stack quarterback identity and verification platform. It takes raw athlete data — velocity, release time, spin rate, accuracy, mechanics — and transforms it into verified, standardized profiles that coaches, scouts, and NIL partners can trust.

**46 page routes · 2 API routes · 16 data models · 61 compiled pages**

The system is not a template. It is a purpose-built platform with real business logic:

- **QB Index** — 8 weighted performance inputs → 0-99 composite score
- **Genetic Athletic Index (GAI)** — 6-gene profile with tier classification and archetype assignment
- **NIL Valuation** — Exponential formula translating verified metrics into dollar projections
- **NIL Infrastructure** — Compliance engine, agreement tracking, state law mapping, resource hub
- **Verified Card System** — Canvas-rendered athlete cards (1080×1350, 3 themes, shareable)
- **Rust Engine** — High-performance backend for identity hashing, ranking, compliance, and scraping
- **Stripe Checkout** — $149 verification tier with webhook-driven status management
- **Role-Based Access** — Athlete, Coach, Admin with middleware-enforced route protection

---

## 2. Architecture

```
┌───────────────────────────────────────────────────────┐
│                      FRONTEND                         │
│  Next.js 16 · React 19 · Tailwind 4 · Three.js       │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │Homepage  │Profiles  │Card Lab  │Demo      │        │
│  │10 sect.  │/athlete  │/card-gen │8 sect.   │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
├───────────────────────────────────────────────────────┤
│                       BACKEND                         │
│  API Routes · Prisma ORM · NextAuth · Stripe          │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │Checkout  │Webhooks  │Auth      │Admin     │        │
│  │/api/co.. │/api/wh.. │Sessions  │Verify    │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
├───────────────────────────────────────────────────────┤
│                     RUST ENGINE                       │
│  Axum 0.8 · SQLx 0.8 · Ed25519 · Tokio               │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │Identity  │Ranking   │Compliance│Scraping  │        │
│  │Hashing   │Pipeline  │Engine    │Service   │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
├───────────────────────────────────────────────────────┤
│                     DATA LAYER                        │
│  PostgreSQL · 16 Models · 4 Enums                     │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │Users     │Athletes  │Metrics   │NIL Data  │        │
│  │Sessions  │Films     │Cards     │Compliance│        │
│  └──────────┴──────────┴──────────┴──────────┘        │
├───────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                     │
│  Upstash Redis · PostHog · Pino Logger                │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │Rate Limit│Analytics │Logging   │Env Valid.│        │
│  │10/10s    │10 events │4 domains │Fail-fast │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
└───────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | App Router + Turbopack |
| React | 19.2.3 | Component framework |
| Tailwind CSS | 4.x | Utility-first styling with custom design tokens |
| Three.js / React Three Fiber | Latest | 3D card preview rendering |
| Framer Motion | 12.x | Animations and transitions |
| Zustand | 5.x | Client state management |
| Recharts | 2.x | Data visualization (radial gauges, bar charts) |
| Lucide React | Latest | Icon system |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Prisma | 7.4.2 | ORM + PostgreSQL migrations |
| PostgreSQL | - | Primary database |
| NextAuth | 4.24.x | Authentication (OAuth + credentials) |
| Stripe | 20.4.x | Payment processing + webhooks |
| Zod | 4.3.x | Runtime schema validation |

### Rust Engine

| Technology | Version | Purpose |
|---|---|---|
| Axum | 0.8 | HTTP framework |
| SQLx | 0.8 | Async PostgreSQL driver |
| Tokio | 1.x | Async runtime |
| Ed25519-dalek | 2.x | Cryptographic identity signing |
| SHA2 / HMAC | Latest | Metric hashing and integrity |
| Governor | Latest | Rate limiting |
| Tower-HTTP | Latest | CORS, tracing middleware |

### Infrastructure

| Technology | Purpose |
|---|---|
| Upstash Redis | Rate limiting (sliding window) |
| PostHog | User analytics (10 custom events) |
| Pino | Structured JSON logging (4 domains) |
| Docker | Rust engine containerization |
| Vercel / Netlify | Frontend hosting |

---

## 4. Rating Engines

Under Center runs two independent rating systems and one valuation formula. All math is deterministic with no random variation.

### QB Index

**File:** `lib/qb-index.ts`

8 weighted inputs → 0-99 composite score:

| Input | Weight |
|---|---|
| Accuracy | 20% |
| Velocity | 18% |
| Mechanics | 16% |
| Release | 14% |
| Footwork | 10% |
| Poise | 8% |
| Field Vision | 8% |
| Clutch Factor | 6% |

**Tiers:**

| Range | Tier |
|---|---|
| 90-99 | Elite |
| 80-89 | Premium |
| 70-79 | Verified |
| 60-69 | Developing |
| 0-59 | Emerging |

### Genetic Athletic Index (GAI)

**File:** `lib/gai.ts`

6 genes → 4 coefficients → composite score:

| Gene | Symbol | Source |
|---|---|---|
| Arm Velocity | VEL-α | `velocity` |
| Accuracy | ACC-γ | `accuracy` |
| Release | REL-β | `releaseTime` |
| Mechanics | MECH-δ | `mechanics` |
| Decision | DEC-ε | `poise` |
| Spatial | SPR-ζ | `fieldVision` |

**Formula:** `Base × Activation × Growth × Fit`

- Base = weighted average of 6 gene scores
- Activation = `1 + (consistency − 50) / 200`
- Growth = trajectory modifier
- Fit = `1 + (programFit − 50) / 250`

**6 Archetypes:** Gunslinger · Field General · Dual-Threat · Pocket Passer · Improviser · Game Manager

**14 Program Profiles:** Alabama, Ohio State, Georgia, Clemson, Oklahoma, LSU, Michigan, Texas, USC, Oregon, Notre Dame, Penn State, Florida, Florida State

### NIL Valuation

**File:** `app/nil/marketplace/page.tsx`

```
NIL Value = 1.065^composite × 12
```

Monthly exposure is `nilValue / 12`. Trend is deterministic based on the composite score (not random).

---

## 5. Core Modules

### Homepage (`/`)

10-section cinematic landing page:

1. Hero — Animated title with gradient text
2. Live Metrics — Velocity, release, accuracy from verified data
3. Platform Pillars — Card system, verification, intelligence, NIL
4. Film Room Preview — Video overlay with metric telemetry
5. QB Comparison — Side-by-side verified comparisons
6. Verified Card — Full-size card preview with 3D rotation
7. Recruiting Timeline — Interactive event timeline
8. NIL Preview — Valuation teaser with market positioning
9. Coach Access — Portal entry with role-based preview
10. Final CTA — Verification call-to-action

### Athlete Profile (`/athlete/[id]`)

Dynamic route with `generateStaticParams` for 6 demo athletes:

- Hero section with verified badge
- Radial gauge visualization (QB Index)
- GAI gene chart with archetype display
- Performance metrics table
- Film gallery with overlay controls
- Recruiting timeline
- NIL valuation section

### Card Generator (`/card-generator`)

Canvas-rendered shareable verification card:

- 3 themes: Dark, Light, Neon
- 1080×1350 output resolution
- Real-time 3D preview (Three.js)
- Download as PNG
- QR code linking to profile

### Demo Walkthrough (`/demo`)

8-section guided tour designed for partnership pitches:

1. System Architecture
2. Rating Engine
3. Profile System
4. Card Generator
5. NIL Valuation
6. Recruiting Intelligence
7. Coach Portal
8. Call-to-Action

### Leaderboard (`/leaderboard`)

Ranked athlete table with QB Index scores, tier badges, and filtering.

### Scout View (`/scout`)

Scouting-focused athlete browser with metric comparisons and notes.

### Genome (`/genome`)

Full GAI visualization — gene charts, archetype classifier, program fit radar.

### Awards (`/awards`)

Tier-based award display from GAI archetype and gene classifications.

### Admin Panel (`/admin`)

Role-protected admin interface (`ADMIN` only):

- Athlete verification status toggle
- Payment confirmation tracking
- User management

### Dashboard (`/dashboard`)

Authenticated athlete dashboard:

- Profile overview
- Verification status
- Card downloads
- NIL dashboard (`/dashboard/nil`)

### Analytics (`/analytics`)

Platform analytics visualization with Recharts.

---

## 6. NIL Infrastructure

Under Center includes a full NIL infrastructure layer — not just a marketplace page, but a compliance-ready system with legal awareness.

### Hub (`/nil`)

Central NIL navigation hub linking to marketplace, compliance, agreements, and resources.

### Marketplace (`/nil/marketplace`)

Active NIL marketplace with valuation display, deal tracking, and brand matching interface. Uses the exponential formula (`1.065^composite × 12`) for all valuations.

### Compliance (`/nil/compliance`)

State-by-state compliance engine:

- State law lookup and display
- Institution-specific rule overlays
- Compliance record tracking
- Eligibility verification checkpoints

### Agreements (`/nil/agreements`)

Contract management interface:

- Agreement templates
- Version tracking
- Status management (Draft → Active → Completed)
- Value and counterparty recording

### Resources (`/nil/resources`)

Educational hub for athletes navigating NIL:

- Compliance guides
- Financial literacy resources
- Legal overview content
- Platform onboarding materials

### NIL Layout (`/nil/layout.tsx`)

Shared layout with sub-navigation across all NIL pages.

---

## 7. Data Model

### Prisma Schema — 16 Models · 4 Enums

**Core Entities:**

| Model | Purpose |
|---|---|
| `User` | Authentication, role assignment (Athlete/Coach/Admin) |
| `Account` | OAuth account linking |
| `Session` | Active session management |
| `VerificationToken` | Email verification tokens |
| `Athlete` | Profile, bio, school, grad year, verification status |
| `AthleteMetrics` | Performance data (10 fields: velocity, release, spin, accuracy, mechanics, footwork, poise, fieldVision, clutchFactor, compositeScore) |
| `Film` | Video assets with metric overlay data |
| `TimelineEvent` | Recruiting events (offers, visits, commitments, camps) |
| `Card` | Generated shareable card records |
| `NilProfile` | NIL valuation and brand readiness data |
| `NilDeal` | Individual NIL deal tracking |
| `ProfileView` | View analytics per athlete |
| `StateLaw` | State-level NIL legislation reference |
| `InstitutionRule` | School-specific NIL compliance rules |
| `ComplianceRecord` | Athlete compliance check history |
| `ContractVersion` | NIL agreement version tracking |

**Enums:** `Role` · `VerificationStatus` · `EventType` · `CardTheme`

### Client-Side State (`lib/store.ts`)

Zustand store with `AthleteMetrics` type matching the Prisma model:

```typescript
interface AthleteMetrics {
  velocity: number;      // MPH
  releaseTime: number;   // Seconds
  spinRate: number;      // RPM
  accuracy: number;      // Percentage
  mechanics: number;     // 0-100
  footwork: number;      // 0-100
  poise: number;         // 0-100
  fieldVision: number;   // 0-100
  clutchFactor: number;  // 0-100
  compositeScore: number; // QB Index output
}
```

---

## 8. Rust Engine

A standalone Rust backend (`rust-engine/`) designed for high-performance operations that exceed what Node.js can efficiently handle.

**25 files · 19 source modules · Dockerized**

### Module Inventory

| Module | File | Purpose |
|---|---|---|
| Config | `src/config.rs` | Environment loading, database URL, JWT secrets |
| Errors | `src/errors.rs` | Unified error handling with Axum `IntoResponse` |
| Router | `src/router.rs` | Route tree assembly with middleware layers |
| Models | `src/models/mod.rs` | Shared request/response structs |
| Database | `src/db/mod.rs` | SQLx connection pool + migrations |
| Identity Hashing | `src/hashing/mod.rs` | SHA-256 metric hashing, Ed25519 signing |
| Compliance | `src/compliance/mod.rs` | State law lookup, eligibility checks |
| Ranking | `src/ranking/mod.rs` | Percentile computation, cohort ranking |
| Scraping | `src/scraping/mod.rs` | External data ingestion service |
| Blockchain | `src/blockchain/mod.rs` | On-chain verification anchoring |
| Middleware | `src/middleware/mod.rs` | Auth extraction, rate limiting |
| Services | `src/services/mod.rs` | Business logic orchestration |

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/health` | GET | Liveness + readiness checks |
| `/identity/hash` | POST | Hash athlete metrics with SHA-256 |
| `/identity/verify` | POST | Ed25519 signature verification |
| `/nil/valuation` | POST | Server-side NIL valuation computation |
| `/nil/compliance` | GET | State law compliance check |
| `/ranking/compute` | POST | Percentile ranking pipeline |
| `/ranking/leaderboard` | GET | Sorted leaderboard output |
| `/scrape/trigger` | POST | External data ingestion trigger |

### Infrastructure

- **Dockerfile** — Multi-stage build (builder → runtime)
- **docker-compose.yml** — Engine + PostgreSQL orchestration
- **Migrations** — SQLx migration directory
- **.env.example** — All required environment variables documented

---

## 9. Security & Hardening

### Rate Limiting (Upstash Redis)

| Tier | Limit | Scope |
|---|---|---|
| Standard | 10 requests / 10 seconds | General routes |
| Strict | 5 requests / 60 seconds | Auth + payment routes |

### Route Protection

- Middleware enforced on `/admin/*` and `/dashboard/*`
- JWT validation on all protected routes
- `ADMIN` role required for `/admin` access
- `ATHLETE` role required for `/dashboard` access

### Input Validation

- Zod schemas on all critical POST endpoints
- Type-safe request parsing with runtime validation

### Webhook Security

- Stripe signature verification on all webhook events
- Raw body parsing for HMAC validation
- Idempotency-safe event handling

### Structured Logging (Pino)

Domain-specific loggers:

- `authLogger` — Authentication events
- `stripeLogger` — Payment lifecycle
- `adminLogger` — Verification actions
- `analyticsLogger` — Event tracking

### Environment Validation

- Fail-fast on missing critical environment variables
- Type-checked env access via `lib/env.ts`

---

## 10. Analytics & Observability

| Layer | Technology | Coverage |
|---|---|---|
| User Analytics | PostHog | 10 custom events, session replay ready |
| Structured Logs | Pino | Domain-specific, JSON-formatted |
| Payment Events | Stripe | Full checkout + webhook lifecycle |
| Error Handling | Error boundaries | Production-safe rendering |
| Env Validation | Fail-fast startup | Missing vars caught at boot |
| Rust Health | Axum `/health` | Liveness + readiness probes |

### PostHog Events

| Event | Trigger |
|---|---|
| `page_view` | Route navigation |
| `profile_view` | Athlete profile loaded |
| `card_generated` | Card export completed |
| `card_downloaded` | Card PNG saved |
| `demo_started` | Demo walkthrough entered |
| `demo_section_viewed` | Demo section navigation |
| `checkout_initiated` | Stripe checkout started |
| `verification_started` | Verification flow entered |
| `coach_portal_viewed` | Coach access page loaded |
| `nil_marketplace_viewed` | NIL marketplace loaded |

---

## 11. Documentation

### Repository Docs

| Document | Purpose |
|---|---|
| `README.md` | This file — system overview and technical reference |
| `TECHNICAL-OVERVIEW.md` | Deep-dive into architecture, data flow, and components |
| `AUDIT.md` | Full system audit: rating math, bugs fixed, data model gaps, production readiness |

### Platform Docs (`/docs`)

7 institutional documents accessible at `/docs` with print-to-PDF support:

| Page | Route |
|---|---|
| Documentation Hub | `/docs` |
| Platform Overview | `/docs/platform-overview` |
| Capabilities | `/docs/capabilities` |
| Coach Onboarding | `/docs/coach-onboarding` |
| NIL Expansion | `/docs/nil-expansion` |
| Recruiting Intelligence | `/docs/recruiting-intelligence` |
| Security Hardening | `/docs/security-hardening` |
| Design System | `/docs/design-system` |

---

## 12. Deployment Guide

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (test or live keys)
- Upstash Redis instance
- PostHog project

### Build & Deploy (Next.js)

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

### Build & Deploy (Rust Engine)

```bash
cd rust-engine
docker compose up -d
```

Or without Docker:

```bash
cd rust-engine
cargo build --release
./target/release/under-center-engine
```

### Hosting Options

| Platform | Layer | Status |
|---|---|---|
| Vercel | Frontend | Recommended (edge functions, preview deploys) |
| Netlify | Frontend | Supported |
| Docker | Rust Engine | Recommended (multi-stage build) |
| Self-hosted | Both | Supported (Node.js + Rust runtimes) |

---

## 13. Environment Variables

### Next.js Application

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/undercenter

# Auth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.com

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Rust Engine

See `rust-engine/.env.example` for all required variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/undercenter
JWT_SECRET=<your-jwt-secret>
ED25519_PRIVATE_KEY=<base64-encoded-private-key>
RUST_LOG=info
HOST=0.0.0.0
PORT=8080
```

---

## 14. Development Workflow

```bash
# Start Next.js dev server
npm run dev

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Production build
npm run build

# Stripe webhook testing
stripe listen --forward-to localhost:3000/api/webhook

# Start Rust engine (Docker)
cd rust-engine && docker compose up -d

# Start Rust engine (local)
cd rust-engine && cargo run
```

---

## 15. Roadmap

### Phase 1 — Verified MVP ✅

- Cinematic homepage (10 sections) with verified metrics
- Individual athlete profile pages with dynamic routing
- Shareable verified card (1080×1350, 3 themes)
- QB Index (8 weighted inputs, 0-99 score, 5 tiers)
- GAI (6 genes, 4 coefficients, 6 archetypes, 14 program profiles)
- Demo walkthrough (8 sections, partnership-ready)
- Stripe checkout ($149 verification)
- Security hardening (rate limiting, middleware, validation, logging)
- Institutional documentation suite (7 pages)
- NIL infrastructure layer (hub, marketplace, compliance, agreements, resources)
- System audit with full math verification (AUDIT.md)

### Phase 2 — Rust Engine ✅

- Axum 0.8 HTTP framework with SQLx
- Identity hashing (SHA-256) and signing (Ed25519)
- Ranking pipeline with percentile computation
- Compliance engine with state law lookup
- Scraping service for external data ingestion
- Docker containerization with multi-stage builds
- Health check endpoints (liveness + readiness)

### Phase 3 — Data Intelligence

- Coach filtering and discovery dashboard
- Athlete ranking engine with percentile cohorts
- Advanced recruiting signal processing
- Automated verification pipeline

### Phase 4 — NIL & Monetization

- Live NIL marketplace with brand matching
- Premium coach subscriptions
- Deal tracking with compliance audit trail
- Analytics reporting dashboard

---

## Application Flow

```
Landing (/)
├── View QBs (/leaderboard, /scout, /search)
│   └── Select Athlete → /athlete/[id]
│       ├── View Metrics (QB Index + GAI)
│       ├── View Film
│       ├── View Timeline
│       └── View NIL Valuation
│
├── NIL (/nil)
│   ├── Marketplace (/nil/marketplace)
│   ├── Compliance (/nil/compliance)
│   ├── Agreements (/nil/agreements)
│   └── Resources (/nil/resources)
│
├── Card Lab (/card-generator)
│   └── Generate → Preview 3D → Download PNG
│
├── Get Verified (/pricing)
│   ├── Stripe Checkout → /api/checkout
│   ├── Webhook Confirms → Status: PENDING
│   └── Admin Approves → Status: VERIFIED
│
├── View Demo (/demo)
│   └── 8-section guided walkthrough
│
└── Documentation (/docs)
    └── 8 institutional documents with print-to-PDF
```

---

## Route Map

All 46 page routes + 2 API routes:

```
/                          Homepage (10 sections)
/admin                     Admin panel (role-protected)
/analytics                 Platform analytics
/athlete/[id]              Athlete profile (6 static paths)
/awards                    GAI-based awards
/board                     Board view
/card-generator            Verified card builder
/coach                     Coach portal
/collectibles              Collectibles gallery
/combine                   Combine data
/community                 Community hub
/compare                   Athlete comparison
/dashboard                 Athlete dashboard
/dashboard/nil             NIL dashboard
/demo                      Partnership demo (8 sections)
/docs                      Documentation hub
/docs/capabilities         Capabilities overview
/docs/coach-onboarding     Coach onboarding guide
/docs/design-system        Design system reference
/docs/nil-expansion        NIL expansion plan
/docs/platform-overview    Platform overview
/docs/recruiting-intelligence  Recruiting intel
/docs/security-hardening   Security hardening
/draft                     Draft board
/film-room                 Film analysis
/gameday                   Game day view
/genome                    GAI visualization
/highlights                Highlight reel
/lab                       Lab experiments
/leaderboard               Ranked athlete table
/login                     Authentication
/map                       Geographic view
/nil                       NIL infrastructure hub
/nil/agreements            Contract management
/nil/compliance            State law compliance
/nil/marketplace           NIL marketplace
/nil/resources             NIL resources
/offers                    Offers tracker
/portal                    Portal entry
/pricing                   Verification pricing
/product                   Product overview
/profile/[id]              Public profile (6 static paths)
/scout                     Scouting view
/search                    Athlete search
/stats                     Statistics
/training                  Training data

/api/checkout              Stripe checkout session
/api/webhook               Stripe webhook handler
```

---

## Positioning

Under Center is a purpose-built quarterback identity system — not a theme, not a template, and not a static profile generator.

It is engineered for verified metrics, recruiting workflows, NIL compliance, and scalable athlete identity infrastructure.

The system was architected to scale without structural redesign.

---

## License

Proprietary — Under Center LLC. All rights reserved.
