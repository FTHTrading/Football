# NIL33 Identity Protocol

## Cryptographic Athlete Identity for NIL Transactions

**Authors:** Kevan Burns  
**Affiliation:** NIL33 — A UnyKorn Company, Norcross, GA 30092  
**Version:** 1.0 (Draft)  
**DOI:** Pending (Zenodo)

---

## Abstract

This paper presents a deterministic identity protocol for college and high school athletes engaged in Name, Image, and Likeness (NIL) transactions. The NIL33 Identity Protocol uses SHA-256 hashing and Ed25519 digital signatures to create tamper-evident, versioned athlete identity records. The protocol is designed to be university-friendly, requiring no cryptocurrency wallet, while providing optional blockchain anchoring for institutions that require immutable proof of existence.

## 1. Introduction

The NIL industry lacks a standardized identity verification layer. Athletes transact across multiple platforms without a portable, verified identity record. Current identity solutions are fragmented — spreadsheet-based, platform-locked, and non-verifiable.

NIL33 addresses this by introducing a deterministic identity hash that:
- Is computed from canonical athlete fields
- Is signed with Ed25519 server keys
- Is versioned across profile updates
- Optionally anchors to public blockchains (XRPL, Polygon, Ethereum)

## 2. Protocol Design

### 2.1 Identity Hash Generation

```
canonical_input = normalize(name, dob, school, sport, position, state)
athlete_hash = SHA-256(canonical_input)
signature = Ed25519.sign(athlete_hash, server_private_key)
```

### 2.2 Verification

```
valid = Ed25519.verify(athlete_hash, signature, server_public_key)
```

### 2.3 Versioning

Each profile update generates a new hash version. Previous versions are retained for audit trail purposes.

### 2.4 Blockchain Anchoring (Optional)

Institutions may elect to anchor identity hash Merkle roots to public blockchains:
- XRPL (low-cost, fast finality)
- Polygon (EVM-compatible, institutional adoption)
- Ethereum L1 (maximum decentralization)

## 3. Security Properties

- **Deterministic**: Same inputs always produce same hash
- **Tamper-Evident**: Any field change produces different hash
- **Non-Reversible**: Cannot derive athlete data from hash
- **Auditable**: Full version history with timestamps
- **Portable**: Not locked to any single platform

## 4. Implementation

The identity protocol is implemented in the NIL33 Rust engine using:
- `sha2` crate for SHA-256
- `ed25519-dalek` crate for Ed25519 signing
- `sqlx` for PostgreSQL persistence
- `axum` for HTTP API exposure

## 5. Conclusion

The NIL33 Identity Protocol provides a standards-based, cryptographically verifiable identity layer for the NIL industry. It is designed for institutional adoption — no wallet, no tokens, no speculation — just verifiable identity infrastructure.

---

## References

- Bernstein, D.J., et al. (2012). "High-speed high-security signatures." *Journal of Cryptographic Engineering*.
- NIST. (2015). "SHA-256 Standard (FIPS 180-4)."

---

© 2026 NIL33 — A UnyKorn Company
