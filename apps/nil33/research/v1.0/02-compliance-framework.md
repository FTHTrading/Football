# 50-State NIL Compliance Framework

## Structured Legal Routing for NIL Agreements

**Authors:** Kevan Burns  
**Affiliation:** NIL33 — A UnyKorn Company, Norcross, GA 30092  
**Version:** 1.0 (Draft)  
**DOI:** Pending (Zenodo)

---

## Abstract

This paper describes the NIL33 compliance routing framework — a structured, rules-based system for validating Name, Image, and Likeness (NIL) agreements against state laws, institutional policies, and NCAA bylaws. The framework covers all 50 U.S. states and supports institutional-specific rule overlays for 1,100+ schools. It addresses the key compliance challenges: state law variation, minor athlete protections, restricted category blocking, and disclosure requirements.

## 1. Problem Statement

NIL compliance is fragmented. Each state has different laws. Each school has different policies. Minor athletes (under 18) face additional restrictions. Brands risk legal exposure. Schools risk NCAA violations. There is no standardized compliance routing engine.

## 2. Framework Architecture

### 2.1 State Law Layer

Each state is modeled with:
- Active NIL law status
- Effective date
- Restriction level (Low / Medium / High)
- Minor consent requirements
- Mandatory disclosure rules
- Restricted industry categories

### 2.2 Institution Rule Overlay

Each institution adds school-specific rules:
- Athletic department approval requirements
- Conflict-of-interest policies
- Use of university marks / logos
- Reporting and disclosure timelines
- Boosted collective restrictions

### 2.3 Compliance Flow

```
Deal Submitted
  → State Law Lookup (by athlete state)
  → Institution Rule Overlay (by athlete school)
  → Restriction Detection (category blocking)
  → Disclosure Requirement Check
  → Minor Consent Validation (if under 18)
  → Compliance Receipt Logged (immutable)
```

## 3. Data Model

The compliance framework uses 3 core Prisma models:
- `StateLaw` — State-level law definitions
- `InstitutionRule` — School-specific policy overlays
- `ComplianceRecord` — Per-deal compliance check results

## 4. Output

Each compliance check produces:
- **Status:** Green (clear) / Yellow (conditional) / Red (blocked)
- **Reason codes:** Specific violation or restriction details
- **Audit trail:** Timestamped, immutable record

## 5. Coverage

- 50 states mapped
- 1,100+ institution rules
- 12 restricted industry categories
- Minor consent workflows for all states with under-18 provisions

---

© 2026 NIL33 — A UnyKorn Company
