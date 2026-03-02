// ═══════════════════════════════════════════════════════════════════
// SCOS Layer 1 — Credential Authority
// ═══════════════════════════════════════════════════════════════════
//
// Manages which entities are authorized to issue which credential types.
// Only entities with EntityType::Regulator, Issuer, or Institution
// may issue credentials.

use std::collections::HashMap;

use crate::scos::identity::DID;
use super::credential::CredentialType;

/// An authorized credential issuer in the SCOS ecosystem.
#[derive(Debug, Clone)]
pub struct CredentialAuthority {
    /// Which DIDs are authorized to issue which credential types.
    authorized_issuers: HashMap<String, Vec<CredentialType>>,
}

impl CredentialAuthority {
    pub fn new() -> Self {
        Self {
            authorized_issuers: HashMap::new(),
        }
    }

    /// Register an entity as authorized to issue specific credential types.
    pub fn authorize(&mut self, issuer_did: &DID, credential_types: Vec<CredentialType>) {
        self.authorized_issuers
            .insert(issuer_did.as_str().to_string(), credential_types);
    }

    /// Check if an issuer is authorized to issue a specific credential type.
    pub fn is_authorized(&self, issuer_did: &DID, credential_type: &CredentialType) -> bool {
        self.authorized_issuers
            .get(issuer_did.as_str())
            .map(|types| types.contains(credential_type))
            .unwrap_or(false)
    }

    /// Revoke an issuer's authority for all credential types.
    pub fn revoke_all(&mut self, issuer_did: &DID) {
        self.authorized_issuers.remove(issuer_did.as_str());
    }

    /// List all credential types an issuer is authorized for.
    pub fn authorized_types(&self, issuer_did: &DID) -> &[CredentialType] {
        self.authorized_issuers
            .get(issuer_did.as_str())
            .map(|v| v.as_slice())
            .unwrap_or(&[])
    }
}

impl Default for CredentialAuthority {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scos::identity::DID;

    fn did(label: &str) -> DID {
        DID::from_raw(format!("scos:did:{}", "a".repeat(64 - label.len()).to_string() + label))
    }

    #[test]
    fn test_authorize_and_check() {
        let mut ca = CredentialAuthority::new();
        let issuer = did("issuer01");
        ca.authorize(&issuer, vec![
            CredentialType::KycVerified,
            CredentialType::AmlVerified,
        ]);

        assert!(ca.is_authorized(&issuer, &CredentialType::KycVerified));
        assert!(ca.is_authorized(&issuer, &CredentialType::AmlVerified));
        assert!(!ca.is_authorized(&issuer, &CredentialType::AccreditedInvestor));
    }

    #[test]
    fn test_unauthorized_issuer() {
        let ca = CredentialAuthority::new();
        let unknown = did("unknown1");
        assert!(!ca.is_authorized(&unknown, &CredentialType::KycVerified));
    }

    #[test]
    fn test_revoke_authority() {
        let mut ca = CredentialAuthority::new();
        let issuer = did("issuer02");
        ca.authorize(&issuer, vec![CredentialType::SanctionsClearance]);
        assert!(ca.is_authorized(&issuer, &CredentialType::SanctionsClearance));

        ca.revoke_all(&issuer);
        assert!(!ca.is_authorized(&issuer, &CredentialType::SanctionsClearance));
    }
}
