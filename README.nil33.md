# NIL33 Rails

Institutional finance platform for SPV-issued revenue participation notes — built into the `under-center` monorepo.

---

## Architecture

```
under-center/
├── apps/
│   └── nil33-rails/          ← This app (Next.js 15, port 3100)
│
├── packages/
│   ├── nil33-core/           ← Domain types, Zod schemas, constants
│   ├── compliance-gate/      ← Rules-based compliance engine (KYC, accreditation, jurisdiction)
│   └── audit-ledger/         ← Append-only ledger builder + sha256 hash utilities
│
└── docker-compose.nil33.yml  ← PostgreSQL + Redis
```

---

## Quick Start

### 1. Start infrastructure

```bash
docker compose -f docker-compose.nil33.yml up -d
```

### 2. Configure environment

```bash
cp apps/nil33-rails/.env.example apps/nil33-rails/.env.local
# Edit .env.local — set NEXTAUTH_SECRET (openssl rand -base64 32)
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run migrations + seed

```bash
cd apps/nil33-rails
npm run db:migrate     # prisma migrate dev
npm run db:seed        # loads [SAMPLE] demo data
```

### 5. Start dev server

```bash
# From monorepo root:
npm run dev:nil33-rails

# Or from app directory:
cd apps/nil33-rails && npm run dev
```

App runs at **http://localhost:3100**

Default login (seeded):
- Email: `admin@nil33.dev`
- Password: `nil33dev2025!`

---

## Data Model

| Model | Description |
|-------|-------------|
| `User` | Platform users with roles (SUPER_ADMIN, COMPLIANCE_OFFICER, etc.) |
| `Spv` | Special Purpose Vehicles — the legal issuers |
| `Athlete` | Athletes linked to SPVs with NIL contracts |
| `Instrument` | Revenue participation notes — terms, participation rate, issuance |
| `Investor` | Accredited investors with KYC/AML status |
| `Subscription` | Investor ↔ Instrument funding records |
| `Distribution` | Revenue waterfall runs — gross → net → per-investor lines |
| `ComplianceCheck` | Persisted compliance gate results |
| `LedgerEvent` | Immutable audit trail with sha256 snapshot hashing |
| `Document` | Document storage references (PPM, K-1, subscription agreements) |

---

## API Routes

All under `/api/v1/`:

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/spvs` | List / create SPVs |
| GET/PATCH | `/spvs/:id` | Get / update SPV |
| GET/POST | `/instruments` | List / create instruments |
| GET/POST | `/investors` | List / create investors |
| POST | `/investors/:id/compliance` | Run compliance gate check |
| GET/POST | `/distributions` | List / create (waterfall) distributions |
| GET | `/audit/search` | Search audit ledger |

---

## Compliance Engine

The `@nil33/compliance-gate` package runs 6 ordered rules, short-circuiting on first failure:

1. **KYC Approved** — investor.kycStatus must be `APPROVED`
2. **Accreditation** — verified and not expired
3. **Jurisdiction** — not in restricted jurisdictions
4. **Instrument Status** — instrument must be `OPEN` or `ACTIVE`
5. **Risk Flags** — investor must have no risk flags
6. **Concentration Limit** — position must stay under basis-point cap

---

## Audit Integrity

Every create/update action emits a `LedgerEvent` via `appendAuditEvent()` in `src/lib/audit.ts`.

Snapshots are sha256-hashed using sorted JSON key serialization — deterministic regardless of insertion order. Stored as `beforeHash` / `afterHash` on each event row.

---

## ⚠️ Sample Data Notice

All seeded data is clearly labeled `[SAMPLE]` and is for demonstration only. It does not represent real athletes, investors, SPVs, or financial instruments.
