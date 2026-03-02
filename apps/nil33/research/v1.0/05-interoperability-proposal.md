# NIL Industry Interoperability Proposal

## Open Standards for NIL Data Exchange

**Authors:** Kevan Burns  
**Affiliation:** NIL33 — A UnyKorn Company, Norcross, GA 30092  
**Version:** 1.0 (Draft)  
**DOI:** Pending (Zenodo)

---

## Abstract

The NIL industry currently operates in fragmented silos — Opendorse, INFLCR, Athliance, and institutional compliance offices each maintain proprietary data formats with no interoperability. This paper proposes an open data exchange standard for NIL transactions, compliance checks, and athlete identity verification. NIL33 is designed from inception to support these open standards as both producer and consumer.

## 1. Problem Statement

The current NIL ecosystem suffers from:

1. **No universal athlete identifier** — Each platform assigns its own internal IDs
2. **Incompatible deal formats** — Transaction records differ across systems
3. **Redundant compliance checks** — Institutions re-verify the same athlete data
4. **No audit portability** — Compliance records are trapped in vendor databases
5. **No valuation standard** — Every platform uses a different methodology

## 2. Proposed Standards

### 2.1 Universal Athlete Identifier (UAI)

A cryptographically derived identifier based on immutable athlete attributes:

```
UAI = SHA-256(lastName + firstName + dateOfBirth + enrollmentInstitution)
```

Properties:
- Deterministic: same inputs always produce the same ID
- Collision-resistant: SHA-256 provides 256-bit output space
- Privacy-preserving: one-way hash, cannot be reversed
- Platform-agnostic: any system can compute the same UAI

### 2.2 NIL Transaction Schema (NTS)

A standardized JSON schema for NIL deal records:

```json
{
  "$schema": "https://nil33.com/schemas/nts/v1.json",
  "version": "1.0",
  "transaction": {
    "id": "uuid-v4",
    "uai": "sha256-hash",
    "type": "endorsement | appearance | merchandise | social | camp",
    "value": {
      "amount": 5000,
      "currency": "USD",
      "structure": "lump-sum | installment | royalty"
    },
    "parties": {
      "athlete": { "uai": "...", "institution": "..." },
      "brand": { "name": "...", "ein": "..." }
    },
    "compliance": {
      "stateJurisdiction": "GA",
      "institutionApproved": true,
      "disclosureComplete": true,
      "timestamp": "ISO-8601"
    },
    "signatures": {
      "athlete": "ed25519-signature",
      "platform": "ed25519-signature"
    }
  }
}
```

### 2.3 Compliance Exchange Format (CEF)

A standardized format for sharing compliance verification results between platforms and institutions:

```json
{
  "$schema": "https://nil33.com/schemas/cef/v1.json",
  "version": "1.0",
  "verification": {
    "uai": "sha256-hash",
    "jurisdiction": "GA",
    "checks": [
      {
        "rule": "GA-SB-NIL-001",
        "description": "Georgia NIL disclosure requirement",
        "result": "pass",
        "timestamp": "ISO-8601",
        "verifier": "nil33"
      }
    ],
    "overallStatus": "compliant",
    "validUntil": "ISO-8601"
  }
}
```

### 2.4 Valuation Signal Schema (VSS)

A standardized format for sharing valuation signals across platforms:

```json
{
  "$schema": "https://nil33.com/schemas/vss/v1.json",
  "version": "1.0",
  "valuation": {
    "uai": "sha256-hash",
    "timestamp": "ISO-8601",
    "composite_score": 0.85,
    "buckets": {
      "identity": { "score": 0.92, "signals": 5 },
      "performance": { "score": 0.88, "signals": 7 },
      "recruiting": { "score": 0.79, "signals": 6 },
      "market": { "score": 0.83, "signals": 6 },
      "compliance": { "score": 0.95, "signals": 5 },
      "execution": { "score": 0.71, "signals": 4 }
    },
    "methodology": "nil33-33signal-v1",
    "confidence": 0.91
  }
}
```

## 3. Platform Compatibility

### 3.1 Opendorse Integration

Opendorse is the dominant marketplace for NIL activities. NIL33 proposes:
- UAI mapping to Opendorse athlete profiles
- NTS import/export for deal records
- CEF exchange for pre-verified compliance status

### 3.2 INFLCR Integration

INFLCR (now part of TeamWorks) provides institutional management:
- CEF export for institutional compliance teams
- VSS import for enriching INFLCR's internal valuations
- Shared audit trail via cryptographic receipts

### 3.3 Athliance / COMPASS Integration

Athliance provides compliance monitoring:
- CEF bidirectional exchange
- Shared state law rule databases
- Compliance check deduplication

### 3.4 NIL Go Integration

NIL Go provides fan engagement:
- NTS import for marketplace transactions
- VSS integration for pricing guidance

## 4. API Specification

NIL33 exposes RESTful endpoints for interoperability:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/athlete/{uai}` | GET | Retrieve athlete identity hash verification |
| `/api/v1/athlete/{uai}/valuation` | GET | Retrieve current 33-signal valuation |
| `/api/v1/transaction` | POST | Submit NTS-formatted transaction |
| `/api/v1/compliance/{uai}` | GET | Retrieve CEF compliance status |
| `/api/v1/compliance/check` | POST | Request compliance verification |
| `/api/v1/schemas/{type}` | GET | Retrieve JSON Schema definitions |

### Authentication

All API endpoints use:
- Bearer token (JWT) for platform authentication
- Ed25519 request signing for cryptographic verification
- Rate limiting via token bucket algorithm

## 5. Adoption Roadmap

| Phase | Timeline | Scope |
|-------|----------|-------|
| Phase 1 | Q3 2026 | Publish schemas, open RFC process |
| Phase 2 | Q4 2026 | Reference implementation in NIL33 |
| Phase 3 | Q1 2027 | Partner integration (1-2 platforms) |
| Phase 4 | Q2 2027 | Industry working group formation |
| Phase 5 | Q4 2027 | Formal standard proposal (IEEE / W3C) |

## 6. Governance

The proposed standards would be governed by:
- Open RFC process on GitHub
- Industry advisory board (universities, platforms, legal)
- Versioned schemas with backward compatibility guarantees
- Reference implementations in multiple languages

---

© 2026 NIL33 — A UnyKorn Company
