# NIL33

### The Athlete Intelligence Platform

> AI-powered NIL valuation, compliance, and deal intelligence for every sport, every athlete, every state.

**nil33.com** · **qbdna.nil33.com**

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Applications](#3-applications)
4. [Shared Packages](#4-shared-packages)
5. [AI / MCP / Agentic / RAG](#5-ai--mcp--agentic--rag)
6. [Scraping Pipeline](#6-scraping-pipeline)
7. [Rust Engine](#7-rust-engine)
8. [Data Model](#8-data-model)
9. [Sports Coverage](#9-sports-coverage)
10. [Getting Started](#10-getting-started)
11. [Deployment](#11-deployment)
12. [License](#12-license)

---

## 1. Platform Overview

NIL33 is a full-stack athlete intelligence platform built for the NIL (Name, Image, Likeness) era of collegiate athletics. It provides:

- **AI-Powered Valuations** — Multi-provider LLM pipeline (OpenAI + Anthropic) estimates athlete market value across 14 sports
- **National Deal Tracker** — Scraping pipeline monitors public sources for NIL deals in real time
- **Compliance Engine** — Automated checks against NCAA bylaws, 50-state legislation, and institutional rules
- **Agreement Infrastructure** — Digital contract generation, version control, and cryptographic signatures
- **Agentic Intelligence** — Autonomous AI agents for deal monitoring, compliance checking, and market analysis
- **RAG Knowledge Base** — Retrieval-augmented generation grounded in NCAA regulations and state law

### Products

| Product | Domain | Status | Description |
|---------|--------|--------|-------------|
| **NIL33** | `nil33.com` | Active | All-sports NIL intelligence hub |
| **QB DNA** | `qbdna.nil33.com` | Active | Quarterback-specific rating & recruiting platform |
| **Court IQ** | — | Planned | Basketball intelligence vertical |
| **Diamond Edge** | — | Planned | Baseball/softball intelligence vertical |
| **Pitch Control** | — | Planned | Soccer intelligence vertical |

---

## 2. Monorepo Structure

```
nil33/
├── apps/
│   ├── qbdna/              # QB DNA — Next.js 16, React 19, Prisma 7
│   │   ├── app/             # 46 page routes, 61 compiled pages
│   │   ├── components/      # 30+ React components
│   │   ├── lib/             # Rating engines, utilities, auth
│   │   ├── prisma/          # 16-model schema (Postgres)
│   │   └── public/          # Static assets
│   └── nil33/               # NIL33 Hub — Next.js 16, React 19
│       └── app/             # All-sports homepage, deal tracker
├── packages/
│   ├── ai/                  # Multi-provider AI engine
│   │   └── src/
│   │       ├── providers.ts # OpenAI + Anthropic + fallback chain
│   │       ├── mcp.ts       # MCP tool registry (4 built-in tools)
│   │       ├── rag.ts       # RAG pipeline with NCAA bylaws
│   │       ├── agents.ts    # ReAct agents (Deal, Compliance, Valuation)
│   │       └── valuation.ts # Sport-agnostic NIL valuation model
│   ├── scraping/            # Deal scraping pipeline
│   │   └── src/
│   │       ├── scraper.ts   # RSS + HTML + API scraping
│   │       ├── parsers.ts   # NLP deal extraction
│   │       ├── scheduler.ts # Periodic scraping with dedup
│   │       └── sources.ts   # 5 pre-configured public sources
│   ├── types/               # Shared TypeScript types
│   │   └── src/
│   │       ├── sports.ts    # 14 sports, conferences, positions
│   │       ├── athletes.ts  # Profiles, metrics, social, valuations
│   │       ├── deals.ts     # Deal records, agreements, payments
│   │       └── compliance.ts# State laws, rules, audit trail
│   └── ui/                  # Shared React components
│       └── src/
│           └── components/  # Logo, StatCard, Badge, GlowCard
├── rust-engine/             # Axum 0.8 + Ed25519 verification engine
│   ├── src/
│   │   ├── main.rs          # Server entry (port 4000)
│   │   ├── handlers/        # HTTP handlers
│   │   ├── models/          # Domain models
│   │   ├── rating/          # Composite rating + DNA engine
│   │   ├── crypto/          # Ed25519 signatures
│   │   └── middleware/       # Auth, CORS, rate limiting
│   └── Cargo.toml
├── turbo.json               # Turborepo task runner
├── package.json             # npm workspaces root
└── README.md
```

**Tooling:** npm workspaces · Turborepo 2.5 · TypeScript 5.8 · ESLint 9

---

## 3. Applications

### QB DNA (`apps/qbdna/`)

The original quarterback intelligence platform — verified metrics, real recruiting data, institutional-grade QB analysis.

| Metric | Value |
|--------|-------|
| Page routes | 46 |
| Compiled pages | 61 |
| API routes | 2 |
| Prisma models | 16 |
| React components | 30+ |

**Key features:**
- **QB Index** — 8-input weighted composite (Pass Yds, TDs, Comp%, Rush Yds, Rush TDs, INTs, Games, Wins)
- **Genetic Athletic Index (GAI)** — 6-gene composite (Speed, Arm Strength, Accuracy, Football IQ, Leadership, Durability)
- **NIL Valuation** — `$12 × 1.065^composite` per-player revenue model
- **Prospect Profiles** — 200+ mock profiles with position-specific stats
- **Institutional Demo** — 8-section guided walkthrough for partnership pitches
- **NIL Infrastructure** — Marketplace, compliance hub, agreement templates, resource library

**Stack:** Next.js 16.1.6 · React 19.2.3 · Prisma 7.4.2 · Tailwind CSS 4 · NextAuth 5 · Framer Motion

### NIL33 Hub (`apps/nil33/`)

The all-sports NIL intelligence platform at nil33.com.

**Homepage sections:**
1. **Hero** — Animated gradient title, live stats, deal count badge
2. **Sports Grid** — 14 sports with athlete/deal counts
3. **Live Deals** — National NIL deal feed with value, brand, school
4. **Intelligence** — 6 AI capabilities with architecture diagram
5. **Verticals** — QB DNA (live), Court IQ, Diamond Edge, Pitch Control
6. **Compliance** — 50-state coverage map preview
7. **Footer** — UnyKorn company branding

**Stack:** Next.js 16.1.6 · React 19.2.3 · Tailwind CSS 4

---

## 4. Shared Packages

### `@nil33/ai` — AI Engine

Multi-provider LLM abstraction with MCP tools, ReAct agents, and RAG pipeline.

```typescript
import { createProvider, Providers } from "@nil33/ai";

// Quick: use a pre-configured provider
const fast = Providers.fast();           // gpt-4o-mini, temp 0.3
const reasoning = Providers.reasoning(); // Claude Sonnet w/ GPT-4o fallback

// Custom: build your own with fallback chain
const provider = createProvider({
  provider: "anthropic",
  model: "claude-sonnet-4-20250514",
  fallback: [{ provider: "openai", model: "gpt-4o" }],
});

const response = await provider.complete({
  messages: [{ role: "user", content: "Estimate NIL value for a D1 QB..." }],
});
```

### `@nil33/types` — Type System

Canonical TypeScript types for 14 sports, athlete profiles, NIL deals, and compliance records.

- `SportId` — 14 sport identifiers with positions, conferences, market weights
- `AthleteProfile` — Full player profiles with social presence and performance metrics
- `NILDeal` — Deal records with value, type, brand, compliance status, and source attribution
- `ComplianceCheckResult` — Rule-by-rule compliance validation with severity levels

### `@nil33/scraping` — Deal Scraping

Public-source NIL deal monitoring pipeline.

- **5 pre-configured sources** — ESPN, The Athletic, Sports Illustrated, NCAA Official, Google News
- **3 scraping strategies** — RSS, HTML (Cheerio), JSON API
- **NLP deal extraction** — Value patterns, sport/deal-type classification, confidence scoring
- **Scheduler** — Configurable intervals, deduplication, error recovery

### `@nil33/ui` — Shared Components

React components used across both apps:

- `NIL33Logo` — Branded logo with green/white split
- `StatCard` — Metric display with trend indicators
- `Badge` — Status badges with pulse animation
- `GlowCard` — Hover-glow card containers

---

## 5. AI / MCP / Agentic / RAG

### Multi-Provider AI

The `@nil33/ai` package provides a unified interface across LLM providers:

| Provider | Models | Use Case |
|----------|--------|----------|
| OpenAI | gpt-4o, gpt-4o-mini | Fast completions, structured extraction |
| Anthropic | Claude Sonnet | Deep reasoning, compliance analysis |

Features: automatic fallback chains, rate limiting, cost tracking, latency metrics.

### MCP Tool Registry

4 built-in tools following the Model Context Protocol:

| Tool | Description |
|------|-------------|
| `nil33.athlete.lookup` | Search athletes by name, sport, school |
| `nil33.deals.search` | Query national deals by sport, value, brand |
| `nil33.compliance.check` | Validate deals against NCAA/state rules |
| `nil33.valuation.estimate` | Estimate athlete market value |

### Agentic Framework

ReAct (Reason + Act) loop agents with tool access:

- **Deal Monitor** — Watches for new deals, identifies notable transactions, detects trends
- **Compliance Checker** — Validates activities against NCAA bylaws and state legislation
- **Valuation Engine** — Estimates and tracks athlete value with sport-specific models

### RAG Pipeline

Retrieval-augmented generation grounded in:
- NCAA NIL bylaws and interpretations
- State NIL legislation (50 states)
- Historical deal data and market trends
- Athlete profiles and performance data

---

## 6. Scraping Pipeline

```
Public Sources → Scraper → Parser → Dedup → Store
     ↓              ↓         ↓              ↓
  RSS/HTML      cheerio    NLP extract    Database
  5 sources     Fetch      confidence     Webhook
```

Sources are scraped on configurable intervals (15-120 min). Each item is run through the `DealParser` which uses regex patterns and keyword matching to extract structured deal data with confidence scores.

---

## 7. Rust Engine

High-performance verification and rating engine (`rust-engine/`):

| Component | Technology |
|-----------|------------|
| Web Framework | Axum 0.8 |
| Database | SQLx 0.8 (Postgres) |
| Cryptography | Ed25519 (ed25519-dalek) |
| Runtime | Tokio (async) |
| Port | 4000 |

**Modules:**
- `rating/` — Composite rating engine + DNA genetic model
- `crypto/` — Ed25519 keypair generation, signing, verification
- `handlers/` — Player CRUD, rating calculation, signature verification
- `middleware/` — JWT auth, CORS, rate limiting

---

## 8. Data Model

16 Prisma models powering the QB DNA application:

```
User ─→ Account / Session / VerificationToken
Player ─→ GameLog / RatingSnapshot
       ─→ DraftProjection
StateLaw ─→ ComplianceRecord
InstitutionRule
ContractVersion
```

Key models: `Player` (55 fields), `GameLog` (per-game stats), `RatingSnapshot` (historical ratings), `ComplianceRecord` (audit trail), `ContractVersion` (agreement versioning).

---

## 9. Sports Coverage

| Sport | Positions | Market Weight | Season |
|-------|-----------|---------------|--------|
| Football | QB, RB, WR, TE, OL, DL, LB, DB, K, P | 1.00 | Fall |
| Basketball | PG, SG, SF, PF, C | 0.85 | Winter |
| Gymnastics | Vault, Bars, Beam, Floor, AA | 0.55 | Winter |
| Baseball | P, C, 1B, 2B, 3B, SS, LF, CF, RF, DH | 0.50 | Spring |
| Hockey | C, LW, RW, D, G | 0.45 | Winter |
| Soccer | GK, CB, FB, CDM, CM, CAM, LW, RW, ST | 0.45 | Fall |
| Volleyball | S, OH, MB, OPP, L, DS | 0.45 | Fall |
| Golf | — | 0.40 | Spring |
| Softball | P, C, 1B, 2B, 3B, SS, LF, CF, RF | 0.40 | Spring |
| Tennis | Singles, Doubles | 0.40 | Spring |
| Lacrosse | A, M, D, G, FO, LSM | 0.35 | Spring |
| Track & Field | Sprints, Distance, Hurdles, Jumps, Throws | 0.35 | Spring |
| Swimming | Free, Back, Breast, Fly, IM, Diving | 0.35 | Winter |
| Wrestling | 125–285 (10 weight classes) | 0.30 | Winter |

---

## 10. Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Rust 1.70+ (optional, for rust-engine)
- PostgreSQL 15+ (for QB DNA data layer)

### Install

```bash
# Clone
git clone https://github.com/FTHTrading/Football.git nil33
cd nil33

# Install all workspace dependencies
npm install --legacy-peer-deps

# Generate Prisma client (QB DNA)
cd apps/qbdna && npx prisma generate && cd ../..
```

### Development

```bash
# Run both apps simultaneously (Turborepo)
npm run dev

# Run individually
npm run dev:qbdna   # → localhost:3000
npm run dev:nil33   # → localhost:3001

# Build all
npm run build

# Build individually
npm run build:qbdna
npm run build:nil33
```

### Environment Variables

Create `apps/qbdna/.env`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

---

## 11. Deployment

| App | Domain | Platform |
|-----|--------|----------|
| NIL33 Hub | `nil33.com` | Cloudflare Pages |
| QB DNA | `qbdna.nil33.com` | Cloudflare Pages |
| Rust Engine | — | Docker / Fly.io |

Domain `nil33.com` is registered on Cloudflare (auto-renew March 2027).

---

## 12. License

Proprietary — UnyKorn · Norcross, GA

Copyright © 2025 UnyKorn. All rights reserved.
