# UNDER CENTER

## Verified Quarterback Identity System

> **Under Center is a purpose-built quarterback identity platform engineered for verified performance metrics, recruiting intelligence, and long-term NIL scalability.**
> This is not a template. This is a modular, data-driven system designed for growth.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Core Modules](#4-core-modules)
5. [Application Flow Tree](#5-application-flow-tree)
6. [Data Model](#6-data-model)
7. [Security & Hardening](#7-security--hardening)
8. [Scaling Strategy](#8-scaling-strategy)
9. [NIL Expansion Layer](#9-nil-expansion-layer)
10. [Analytics & Observability](#10-analytics--observability)
11. [Deployment Guide](#11-deployment-guide)
12. [Environment Variables](#12-environment-variables)
13. [Development Workflow](#13-development-workflow)
14. [Roadmap](#14-roadmap)

---

## 1. System Overview

Under Center is a full-stack web application designed specifically for:

- Verified quarterback performance metrics
- Coach-facing recruiting intelligence
- Athlete-controlled identity profiles
- Social-ready verification assets (shareable cards, QR-linked profiles)

The platform architecture prioritizes:

- Modular, reusable component systems
- Scalable, database-driven data structures
- Secure API routes with rate limiting
- Role-based access control (Athlete / Coach / Admin)
- Production observability (structured logging + analytics)

**Current build:** 38 page routes · 2 API routes · 12 data models · 53 compiled pages

---

## 2. Architecture Overview

```
Frontend (Next.js 16 / App Router)
│
├── Homepage ─────────── Cinematic entry, verified metrics, profile preview
├── Athlete Profile ──── Dynamic route with radial gauges, film, recruiting timeline
├── Card Generator ───── Shareable verified card export (1080×1350)
├── Demo Walkthrough ─── Guided partnership pitch with live platform preview
├── Dashboard ────────── Authenticated athlete home
├── Admin Panel ──────── Role-protected verification control
├── Docs Suite ───────── 7 institutional documents (print-to-PDF)
│
Backend (API Routes)
│
├── Auth ─────────────── NextAuth.js (JWT / credentials / RBAC)
├── Stripe Checkout ──── $149 verification flow
├── Stripe Webhook ───── checkout.session.completed → PENDING verification
│
Data Layer
│
├── Prisma 7 ORM ─────── 12 models across 5 enums
├── PostgreSQL ────────── Relational store with full athlete graph
│
Infrastructure
│
├── Upstash Redis ─────── Rate limiting (standard 10/10s · strict 5/60s)
├── PostHog ───────────── Event analytics (10 custom events)
├── Pino ──────────────── Structured domain-specific logging
├── Zod ───────────────── Runtime validation on all critical routes
```

---

## 3. Technology Stack

### Frontend

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router + Turbopack) | 16.1.6 |
| Language | TypeScript | 5.x |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS + custom design tokens | 4.x |
| 3D | Three.js via @react-three/fiber + drei | 0.183 |
| Animation | Framer Motion + GSAP | 12.x / 3.14 |
| Charts | Recharts (radial gauges, percentile bars) | 3.7 |
| State | Zustand | 5.x |
| Card Export | html-to-image + qrcode.react | — |

### Backend

| Layer | Technology | Version |
|---|---|---|
| ORM | Prisma | 7.4.2 |
| Database | PostgreSQL | — |
| Auth | NextAuth.js (credentials + JWT) | 4.24 |
| Payments | Stripe (checkout + webhooks) | 20.4 |
| Validation | Zod | 4.3 |

### Infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Rate Limiting | Upstash Redis | Token bucket (standard + strict tiers) |
| Analytics | PostHog | 10 custom events, user identification |
| Logging | Pino | Domain-specific structured logs |
| Hosting | Vercel / Netlify | Edge-ready deployment |

---

## 4. Core Modules

### Cinematic Homepage

- Animated counting metric cards (velocity, release time, accuracy)
- Profile preview with radial gauges and school badges
- Verified education section ("What Verified Means")
- Social growth positioning and training locations
- 3D WebGL tunnel background (Three.js)

### Athlete Profile Engine

- Identity header with verified badge and star rating
- 6 radial metric gauges (Velocity, Release, Spin, Mechanics, Accuracy, Decision)
- Percentile ranking bars
- NFL pro comparison module (side-by-side)
- Film overlay engine with real-time metric HUD
- Genome Activation Index (GAI) with component score breakdown
- Recruiting timeline (offers, visits, commitments)
- NIL valuation section
- Digital collectible preview
- Shareable card export CTA

### Verified Card Generator

- 1080×1350 Instagram-optimized export format
- 3 themes: Dark, Holographic, DNA
- QR code linking to full profile
- Dynamic metric rendering
- PNG download via html-to-image

### Demo Walkthrough

- Guided scroll-through partnership pitch
- 8 sections: Problem → Current State → Platform → Live Preview → Social Layer → Revenue → Phase Rollout → Tech Stack
- Live profile preview with working gauges
- Phase status indicator
- "Let's Talk" CTA

### Admin Panel

- Athlete verification toggle (Approve / Revoke)
- Role-based protection (ADMIN only)
- Audit-ready structured logging

### Analytics Engine

Tracked PostHog events:

| Event | Trigger |
|---|---|
| `profile_viewed` | Athlete profile opened |
| `verified_card_downloaded` | Card exported as PNG |
| `film_played` | Film overlay player started |
| `verification_started` | Stripe checkout initiated |
| `verification_completed` | Webhook confirms payment |
| `nil_deal_created` | NIL deal recorded |
| `search_performed` | Coach search executed |
| `comparison_viewed` | NFL comparison opened |
| `card_shared` | Card share action triggered |
| `profile_shared` | Profile share action triggered |

---

## 5. Application Flow Tree

```
User Lands on Homepage
│
├── Explore Verified QBs (/search)
│   └── Open Athlete Profile (/athlete/[id])
│       ├── View Radial Metrics
│       ├── Watch Film with Overlay
│       ├── View Recruiting Timeline
│       ├── View NFL Comparison
│       └── Share Verified Card → Download PNG
│
├── Get Verified (/pricing)
│   ├── Select Plan → Stripe Checkout ($149)
│   ├── Webhook Confirms → Status: PENDING
│   └── Admin Approves → Status: VERIFIED
│
├── View Demo (/demo)
│   └── Guided walkthrough of platform capabilities
│
└── Documentation (/docs)
    └── 7 institutional documents with print-to-PDF
```

---

## 6. Data Model

### Prisma Schema — 12 Models · 5 Enums

**Core Entities:**

| Model | Purpose |
|---|---|
| `User` | Authentication, role assignment (Athlete/Coach/Admin) |
| `Account` | OAuth account linking |
| `Session` | Active session management |
| `VerificationToken` | Email verification tokens |
| `Athlete` | Athlete profile, bio, school, grad year, verification status |
| `AthleteMetrics` | Performance data (velocity, release, spin, accuracy, mechanics) |
| `Film` | Video assets with metric overlay data |
| `TimelineEvent` | Recruiting events (offers, visits, commitments, camps) |
| `Card` | Generated shareable card records |
| `NilProfile` | NIL valuation and brand readiness data |
| `NilDeal` | Individual NIL deal tracking |
| `ProfileView` | View analytics per athlete |

**Enums:** `Role` · `VerificationStatus` · `EventType` · `CardTheme`

**Designed for:**

- Unlimited athlete profiles with full metric histories
- Percentile ranking computation across cohorts
- Regional filtering (state, school, grad year)
- Recruiting event timeline reconstruction
- NIL valuation and deal pipeline tracking

---

## 7. Security & Hardening

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

## 8. Scaling Strategy

The system was architected to scale without structural redesign.

| Dimension | Current | Growth Path |
|---|---|---|
| Athletes | 6 demo profiles | Thousands via database |
| Geography | FL + WI | Nationwide (state filtering built in) |
| Verification | Manual admin toggle | Automated pipeline ready |
| Rankings | Percentile bars | Full ranking engine (schema ready) |
| Access | Public profiles | Coach portal with premium filtering |

**No template limitations.** Component-driven architecture with database-backed content.

---

## 9. NIL Expansion Layer

### Current Implementation

- NIL valuation display on athlete profiles
- `NilProfile` and `NilDeal` data models in schema
- NIL marketplace page (`/nil`)
- NIL dashboard (`/dashboard/nil`)

### Future-Ready Architecture

- Deal tracking with brand, value, and status fields
- Athlete value indexing based on verified metrics
- Brand engagement dashboard structure
- Social reach integration points
- Compliance-ready deal recording

---

## 10. Analytics & Observability

| Layer | Technology | Coverage |
|---|---|---|
| User Analytics | PostHog | 10 custom events, session replay ready |
| Structured Logs | Pino | Domain-specific, JSON-formatted |
| Payment Events | Stripe | Full checkout + webhook lifecycle |
| Error Handling | Error boundaries | Production-safe rendering |
| Env Validation | Fail-fast startup | Missing vars caught at boot |

---

## 11. Deployment Guide

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (test or live keys)
- Upstash Redis instance
- PostHog project

### Build & Deploy

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

### Hosting Options

| Platform | Status |
|---|---|
| Vercel | Recommended (edge functions, preview deploys) |
| Netlify | Supported (current deployment) |
| Self-hosted | Supported (Node.js runtime) |

---

## 12. Environment Variables

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

---

## 13. Development Workflow

```bash
# Start dev server
npm run dev

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Production build
npm run build

# Stripe webhook testing
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 14. Roadmap

### Phase 1 — Verified MVP ✅

- Cinematic homepage with verified metrics
- Individual athlete profile pages
- Shareable verified card (1080×1350, 3 themes)
- Stripe checkout ($149 verification)
- Security hardening (rate limiting, middleware, validation, logging)
- Institutional documentation suite

### Phase 2 — Data Intelligence

- Coach filtering and discovery dashboard
- Athlete ranking engine with percentile cohorts
- Advanced recruiting signal processing
- Automated verification pipeline

### Phase 3 — NIL & Monetization

- NIL marketplace with brand matching
- Athlete valuation index
- Premium coach subscriptions
- Deal tracking and compliance layer
- Analytics reporting dashboard

---

## Positioning

Under Center is a purpose-built quarterback identity system — not a theme, not a template, and not a static profile generator.

It is engineered for verified metrics, recruiting workflows, and scalable athlete identity infrastructure.

The system was architected to scale without structural redesign.

---

## License

Proprietary — Under Center LLC. All rights reserved.
