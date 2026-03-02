# Under Center — Rust Identity & NIL Engine

Production-grade Rust microservice providing cryptographic identity hashing, NIL deal receipt signing, state compliance validation, ranking computation, and future blockchain anchoring for the Under Center platform.

## Architecture

```
Next.js Frontend ──HMAC──▶ Rust Engine ──▶ PostgreSQL
                              │
                              ├── /identity/hash    (POST)  Ed25519-signed identity hashes
                              ├── /nil/receipt      (POST)  Signed NIL deal receipts + compliance
                              ├── /ranking/recompute (GET)  Percentile ranking snapshots
                              ├── /scrape/run       (GET)   Recruiting news ingestion (stub)
                              ├── /health           (GET)   Liveness probe
                              └── /ready            (GET)   Readiness probe (DB check)
```

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Rust 1.82+, Tokio |
| HTTP | Axum 0.8 |
| Database | PostgreSQL 16 via SQLx 0.8 |
| Crypto | Ed25519-dalek 2, SHA-256, HMAC-SHA256 |
| Auth | HMAC header verification per request |
| Rate Limiting | Governor (token bucket) |
| Serialization | Serde JSON |
| Observability | Tracing (structured JSON logs) |

## Quick Start

### With Docker Compose (recommended)

```bash
cd rust-engine
docker compose up --build
```

Engine starts at `http://localhost:8080`. PostgreSQL at `localhost:5432`.

### Local Development

```bash
# 1. Start PostgreSQL
docker run -d --name uc-pg -e POSTGRES_USER=uc_engine -e POSTGRES_PASSWORD=password -e POSTGRES_DB=uc_engine -p 5432:5432 postgres:16-alpine

# 2. Configure environment  
cp .env.example .env
# Edit .env with your values

# 3. Run
cargo run
```

## API Reference

### POST /identity/hash

Create a canonical identity hash for an athlete profile.

```json
{
  "athlete_id": "ATH-001",
  "full_name": "Jaxon Smith",
  "dob": "2006-03-15",
  "school": "Mater Dei"
}
```

Response:
```json
{
  "athlete_id": "ATH-001",
  "identity_hash": "a1b2c3...",
  "signature": "d4e5f6...",
  "public_key": "789abc...",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### POST /nil/receipt

Create a signed NIL deal receipt with state compliance validation.

```json
{
  "athlete_id": "ATH-001",
  "brand": "Nike",
  "amount_cents": 5000000,
  "deal_type": "sponsorship",
  "state": "CA",
  "duration_days": 365
}
```

Response includes compliance result with PASS/WARN/FAIL status.

### GET /ranking/recompute?metric=qb_index

Recompute percentile rankings for the specified metric.

### GET /health

Returns `{"status": "ok"}` — no DB check.

### GET /ready

Returns `{"status": "ready"}` — verifies DB connectivity.

## Authentication

All mutating endpoints require HMAC-SHA256 authentication via the `X-UC-Signature` header:

```
X-UC-Signature: HMAC-SHA256(request_path, HMAC_SECRET)
```

The Next.js backend computes this before proxying requests to the engine.

## Database Schema

Managed via SQLx migrations in `migrations/`:

- **profile_ledger** — Identity hashes with Ed25519 signatures
- **nil_receipts** — Signed deal receipts with compliance status
- **compliance_checks** — Audit log of compliance validations
- **scraped_events** — Ingested recruiting news articles
- **ranking_snapshots** — Percentile computations per metric

## Project Structure

```
rust-engine/
├── Cargo.toml
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── migrations/
│   └── 20240101000001_initial.sql
└── src/
    ├── main.rs            # Entry point, bootstrap
    ├── config.rs          # Environment config
    ├── errors.rs          # Error types + Axum IntoResponse
    ├── router.rs          # Route registration
    ├── models/mod.rs      # AppState, request/response types, DB rows
    ├── db/mod.rs           # Connection pool
    ├── hashing/mod.rs      # SHA-256, Ed25519, canonical JSON
    ├── compliance/mod.rs   # State law validation engine
    ├── ranking/mod.rs      # Percentile computation
    ├── scraping/mod.rs     # News scraper (stub)
    ├── blockchain/mod.rs   # Merkle root anchoring (stub)
    ├── middleware/mod.rs    # HMAC auth, rate limiting
    ├── services/mod.rs     # Business logic coordination
    └── routes/
        ├── mod.rs
        ├── health.rs
        ├── identity.rs
        ├── nil.rs
        ├── ranking.rs
        └── scrape.rs
```
