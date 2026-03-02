# NIL33 — Deterministic NIL Infrastructure

> **IDENTITY · VALUE · LEGACY**

The 33-Signal NIL Valuation & Compliance Infrastructure Layer.

**NIL33** is not a marketplace. It is the operating system behind NIL — a deterministic valuation engine, compliance routing layer, identity verification system, and verifiable receipt infrastructure built for athletes, coaches, brands, and institutions.

---

## System Legend

| Color | Layer | Purpose |
|-------|-------|---------|
| 🟢 `#00ff88` | Core Engine | Valuation, identity computation, Rust microservice |
| 🔵 `#00d4ff` | Infrastructure | Data ingestion, scraping, RAG pipeline, embeddings |
| 🟣 `#a855f7` | AI Agents | Multi-agent orchestration, agentic tool use, MCP |
| 🟡 `#f59e0b` | Web3 Layer | Ed25519 signing, SHA-256 hashing, receipt anchoring |
| 🔴 `#ef4444` | Compliance | 50-state law routing, institutional rules, audit trail |
| 🔷 `#3b82f6` | Deal Layer | Contract templates, deliverable tracking, settlement |

---

## What NIL33 Is

NIL33 is a deterministic NIL infrastructure system — the verified operating layer that sits behind athlete profiles and turns NIL into:

- **Verified Identity** — Every athlete gets a signed, versioned identity hash
- **Verified Performance Proof** — Sport-specific metrics, not vibes
- **Verified Deal Receipts** — Cryptographic proof of deal existence
- **Compliance-Aware Workflows** — State law + school rules + NCAA bylaws

Think of it as **Stripe + Experian + a compliance engine + an athlete ledger**, purpose-built for NIL.

### What NIL33 Does (10-Point)

| # | Capability |
|---|-----------|
| 01 | Calculates athlete NIL value using verified performance metrics |
| 02 | Tracks recruiting signals and percentile cohorts |
| 03 | Validates NIL deals against state compliance rules |
| 04 | Generates signed identity hashes for athlete verification |
| 05 | Creates compliance-ready NIL agreement records |
| 06 | Enables brand–athlete valuation matching |
| 07 | Supports Web3-based receipt anchoring |
| 08 | Provides coach-facing ranking intelligence |
| 09 | Stores structured NIL deal data across 14 sports |
| 10 | Scales nationwide from Norcross, Georgia |

### What NIL33 Is NOT

- Not a marketplace template
- Not a collective tool
- Not a recruiting app
- Not a compliance consultant

---

## The 33-Signal Athlete Index

**3 Layers × 3 Dimensions = 9 core concepts → 33 measurable signals**

The number "33" is the structural identity of the system:
- **3 Pillars:** Identity · Performance · Market
- **3 Layers:** Verification · Computation · Output

33 independent, measurable signals grouped into 6 scoring buckets:

### Signal Architecture

| Bucket | Count | Signals |
|--------|-------|---------|
| **Identity & Verification** | 5 | KYC/Guardian Status · Verification Tier · Audit Trail Completeness · Document Integrity · Dispute Risk |
| **Performance Proof** | 7 | Sport-Specific Metrics · Consistency Delta · Injury Factor · Role/Usage · Training Progression · Peer Percentile · Volatility Penalty |
| **Recruiting & Exposure** | 6 | Offers Quality · Visits/Contact Intensity · Coach Views · Profile Shares · Film Engagement · Geographic Demand Index |
| **Market & Reach** | 6 | Social Graph · Engagement Quality · Content Consistency · Audience Geography · Brand Affinity · Reputation Safety |
| **Compliance & Eligibility** | 5 | State Law Compatibility · School Policy · Restricted Categories · Disclosure Completeness · Pay-for-Play Risk |
| **Deal Execution** | 4 | Contract Completeness · Deliverable Fulfillment · Payment Performance · Dispute/Chargeback Risk |
| **Total** | **33** | |

### Valuation Formula

```
Value = 1.065^composite × 12
```

- Composite: weighted score from all 33 signals (0–100)
- Exponential curve: separates elite from average
- Monthly multiplier (×12): annualized projection
- Server-side validated in Rust — deterministic, reproducible

### Output Per Athlete

| Output | Type |
|--------|------|
| NIL33 Composite Score | 0–100 index |
| Valuation Band | Dollar range |
| Compliance Status | Green / Yellow / Red |
| Deal Readiness Level | Tier classification |
| Eligible Deal Types | Category matching |

---

## AI Agent Architecture

NIL33 operates a multi-agent AI system — not a chatbot, but an orchestration engine.

### Active Agents

| Agent | Role | Key Functions |
|-------|------|--------------|
| 🟢 **Valuation Agent** | Computes deterministic NIL value | 33-signal composite, exponential model, geography adjustment |
| 🔴 **Compliance Agent** | Validates deal legality | State law lookup, minor consent, restricted categories, audit trail |
| 🔵 **Identity Hash Agent** | Generates athlete identity | SHA-256 fingerprint, Ed25519 signing, Merkle anchoring |
| 🟣 **Recruiting Signal Agent** | Analyzes recruiting data | GAI/QB Index, percentile cohort, conference fit, offer quality |
| 🟡 **Brand Matching Agent** | Matches athlete ↔ brand | Engagement scoring, vertical alignment, projected ROI, compliance filter |

### Infrastructure Stack

| Layer | Technology |
|-------|-----------|
| Multi-Provider LLM | GPT · Claude · Gemini (switchable) |
| Agentic Framework | MCP · Tool Use · ReAct pattern |
| RAG Pipeline | Embeddings · Vector DB · Contextual retrieval |
| Live Scraping | Deals · Social media · News · Recruiting |
| Rust Engine | Axum 0.8 · SQLx 0.8 · Ed25519-dalek · Tokio |

---

## Web3 Integration

Web3 done correctly — not crypto hype, but infrastructure.

### Identity Anchoring

Every verified athlete receives a deterministic identity hash:

```
athlete_hash = SHA-256(canonical_fields)
signature = Ed25519.sign(athlete_hash, server_key)
```

- Optional anchor to XRPL, Polygon, or Ethereum
- University-friendly — no wallet required
- Tamper-evident verification with version history

### NIL Receipt Tokenization

Every NIL deal generates a verifiable receipt:

- Hash receipt per deal (SHA-256)
- Signed contract fingerprint (Ed25519)
- Optional ERC-721 receipt NFT
- Immutable proof of deal existence and timestamp

### Future Settlement Rails

- Stablecoin settlement capability
- On-chain escrow for deal payments
- Public NIL value index oracle

---

## Rust Engine

The cryptographic and computation layer runs on a purpose-built Rust microservice.

### Tech Stack

| Crate | Purpose |
|-------|---------|
| `axum` 0.8 | HTTP framework |
| `sqlx` 0.8 | Async database (PostgreSQL) |
| `ed25519-dalek` | Cryptographic signing |
| `sha2` | Identity hashing |
| `tokio` | Async runtime |
| `governor` | Rate limiting |
| `tower-http` | CORS, tracing middleware |
| `serde` / `serde_json` | Serialization |
| `uuid` | Unique identifiers |

### API Endpoints

```
POST /identity/hash          — Generate athlete identity hash
POST /identity/verify         — Verify identity hash
POST /nil/receipt             — Generate NIL deal receipt
POST /nil/valuation           — Compute NIL valuation
POST /compliance/check        — Run compliance validation
POST /ranking/compute         — Compute athlete ranking
GET  /ranking/leaderboard     — Retrieve rankings
GET  /health                  — System health check
```

---

## Compliance Engine

50-state NIL law database with institutional rule overlays.

### Deal Compliance Flow

```
Deal Submitted
  → State Law Lookup
    → Institution Rule Overlay
      → Restriction Detection
        → Disclosure Requirement Check
          → Compliance Receipt Logged
```

### Coverage

- **50 states** mapped with active NIL law definitions
- **1,100+ institutions** with school-specific rule overlays
- **Minor consent** workflows for pre-18 athletes
- **Restricted category** blocking (alcohol, gambling, etc.)
- **Immutable audit trail** for every compliance check

---

## Sport Verticals

Each sport gets a dedicated subdomain with position-specific analytics:

| Vertical | Domain | Sport | Status |
|----------|--------|-------|--------|
| **QB DNA** | `qbdna.nil33.com` | Football — QB | 🟢 Live |
| **Court IQ** | `courtiq.nil33.com` | Basketball | 🟡 Coming Soon |
| **Diamond Edge** | `diamond.nil33.com` | Baseball / Softball | 🟡 Coming Soon |
| **Pitch Control** | `pitch.nil33.com` | Soccer | 🟡 Coming Soon |

### 14 Sports Covered

Football · Basketball · Baseball · Soccer · Softball · Volleyball · Track & Field · Swimming · Golf · Tennis · Lacrosse · Hockey · Wrestling · Gymnastics

---

## Data Model

### Prisma Schema (16 Models)

| Model | Purpose |
|-------|---------|
| `Athlete` | Core athlete profile |
| `AthleteIdentity` | Identity hash, verification tier |
| `PerformanceRecord` | Sport-specific metrics |
| `NILDeal` | Deal record with valuation |
| `ComplianceRecord` | Compliance check results |
| `StateLaw` | State NIL law definitions |
| `InstitutionRule` | School-specific policy overlays |
| `ContractVersion` | Versioned agreement tracking |
| `Brand` | Brand profiles for matching |
| `Receipt` | Cryptographic deal receipts |
| `ValuationSnapshot` | Point-in-time valuations |
| `RecruitingSignal` | Recruiting data points |
| `AuditLog` | System audit trail |
| `User` | Platform users (athletes, coaches, brands) |
| `School` | Institution profiles |
| `Conference` | Athletic conference data |

---

## Industry Integration

NIL33 is designed as interoperable infrastructure — not a competitor to existing platforms.

### Compatibility Layer

| Platform | Integration Type |
|----------|-----------------|
| **Opendorse** | Valuation feed, compliance routing |
| **INFLCR** | Deal record sync, compliance data |
| **Athliance** | Compliance rule sharing, audit trail |
| **NIL Go** | Collective deal infrastructure |
| **ARMS** | Recruiting signal ingestion |
| **Hudl** | Performance data import |

### Integration Model

```
Existing Platform → NIL33 API → Valuation + Compliance + Receipt
                                         ↓
                                  Athlete NIL Record
```

---

## Deployment

| Component | Stack | Host |
|-----------|-------|------|
| `nil33.com` | Next.js 16.1 + React 19 | Vercel |
| `qbdna.nil33.com` | Next.js 16.1 + React 19 | Vercel |
| Rust Engine | Axum + PostgreSQL | AWS / Railway |
| DNS | Cloudflare | Cloudflare |
| Database | PostgreSQL + Prisma | Supabase / AWS RDS |
| Vector DB | Embeddings + RAG | Pinecone / pgvector |

---

## Repository Structure

```
nil33/
├── apps/
│   ├── nil33/                   # nil33.com — main homepage
│   │   ├── app/
│   │   │   ├── layout.tsx       # SEO metadata + Schema.org JSON-LD
│   │   │   ├── page.tsx         # 8-section SEO homepage
│   │   │   └── globals.css      # Design tokens + animations
│   │   ├── public/              # Logos, OG images
│   │   └── package.json
│   └── qbdna/                   # qbdna.nil33.com — QB DNA Live
│       ├── app/                 # 61 compiled pages
│       └── prisma/              # 16-model schema
├── packages/
│   ├── ai/                      # AI agent orchestration
│   ├── types/                   # Shared TypeScript types
│   ├── scraping/                # Data ingestion pipeline
│   └── ui/                      # Shared UI components
├── rust-engine/                 # Axum Rust microservice
│   ├── src/
│   │   ├── handlers/            # API route handlers
│   │   ├── models/              # Data models
│   │   ├── services/            # Business logic
│   │   └── crypto/              # Ed25519 + SHA-256
│   └── Cargo.toml
├── research/                    # Academic publications
│   └── v1.0/
├── docs/                        # Documentation
├── turbo.json                   # Turborepo config
└── package.json                 # Workspace root
```

---

## Research & Publications

NIL33 is building an academic foundation for NIL infrastructure:

### Planned Papers

| # | Title | DOI Target |
|---|-------|-----------|
| 1 | NIL33 Identity Protocol — Cryptographic Athlete Identity for NIL Transactions | Zenodo |
| 2 | 50-State NIL Compliance Framework — Structured Legal Routing for NIL Agreements | Zenodo |
| 3 | The 33-Signal Valuation Model — A Deterministic Approach to Athlete NIL Pricing | Zenodo |
| 4 | NIL33 Infrastructure Architecture — Multi-Agent AI with Web3 Receipts | Zenodo |
| 5 | NIL Interoperability Proposal — How NIL33 Connects Opendorse, INFLCR, and Athliance | Zenodo |

---

## Valuation Assessment

### IP Inventory

| Asset | Type |
|-------|------|
| 33-Signal NIL Index | Proprietary methodology |
| Deterministic Valuation Formula | Algorithm IP |
| Compliance Routing Engine | Rules database + logic |
| Ed25519 Identity Hashing | Crypto infrastructure |
| Multi-Agent AI System | Agentic architecture |
| QB DNA Live Application | Production software |
| Rust Microservice Engine | Backend infrastructure |
| 50-State Law Database | Legal data asset |
| 14-Sport Data Model | Structured schema |
| Institutional README & Docs | Knowledge base |

### Comparable Positioning

| Company | Category | Funding |
|---------|----------|---------|
| Opendorse | NIL marketplace | $5.5M Series A |
| INFLCR | Athlete branding | Acquired by Teamworks |
| Athliance | Compliance | $3M Seed |
| NIL33 | Infrastructure layer | Pre-seed |

---

## Location

**5655 Peachtree Parkway, Norcross, GA 30092**

- UnyKorn — Parent Company
- SEC-level recruiting territory
- Serving athletes and institutions nationwide
- Domain: `nil33.com` (Cloudflare DNS)
- Contact: kevanbtc@gmail.com

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.1, React 19, Tailwind 4, Framer Motion |
| Backend | Rust (Axum 0.8), Node.js API routes |
| Database | PostgreSQL, Prisma ORM |
| AI | GPT / Claude / Gemini, MCP, RAG, Embeddings |
| Crypto | Ed25519, SHA-256, Optional blockchain anchoring |
| Infra | Vercel, Cloudflare, Turborepo, npm workspaces |
| Scraping | Cheerio, Playwright, Cron scheduler |
| Charts | Recharts, D3 |

---

## License

Proprietary. All rights reserved.

© 2026 NIL33 — A UnyKorn Company. Norcross, Georgia.
