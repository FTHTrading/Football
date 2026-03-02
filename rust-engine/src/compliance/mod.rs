use crate::models::{ComplianceResult, ComplianceStatus};

/// State-level NIL rules for validation.
#[derive(Debug, Clone)]
pub struct StateRule {
    pub state: String,
    pub nil_allowed: bool,
    pub max_deal_amount_cents: Option<i64>,
    pub requires_disclosure: bool,
    pub min_age: Option<i32>,
    pub banned_categories: Vec<String>,
}

/// Default rules for states without specific legislation.
fn default_rule(state: &str) -> StateRule {
    StateRule {
        state: state.to_uppercase(),
        nil_allowed: true,
        max_deal_amount_cents: None,
        requires_disclosure: false,
        min_age: None,
        banned_categories: vec![],
    }
}

/// Lookup state rules. In production this would query the database;
/// here we encode a representative subset of known restrictive states.
pub fn get_state_rules(state: &str) -> StateRule {
    match state.to_uppercase().as_str() {
        "CA" => StateRule {
            state: "CA".into(),
            nil_allowed: true,
            max_deal_amount_cents: None,
            requires_disclosure: true,
            min_age: Some(18),
            banned_categories: vec!["gambling".into(), "tobacco".into(), "cannabis".into()],
        },
        "TX" => StateRule {
            state: "TX".into(),
            nil_allowed: true,
            max_deal_amount_cents: None,
            requires_disclosure: true,
            min_age: Some(18),
            banned_categories: vec!["gambling".into(), "alcohol".into()],
        },
        "NY" => StateRule {
            state: "NY".into(),
            nil_allowed: true,
            max_deal_amount_cents: Some(500_000_00), // $500K cap
            requires_disclosure: true,
            min_age: Some(18),
            banned_categories: vec!["gambling".into(), "tobacco".into()],
        },
        "FL" => StateRule {
            state: "FL".into(),
            nil_allowed: true,
            max_deal_amount_cents: None,
            requires_disclosure: false,
            min_age: None,
            banned_categories: vec!["gambling".into()],
        },
        "AL" => StateRule {
            state: "AL".into(),
            nil_allowed: true,
            max_deal_amount_cents: None,
            requires_disclosure: true,
            min_age: None,
            banned_categories: vec!["gambling".into(), "tobacco".into()],
        },
        _ => default_rule(state),
    }
}

/// Validate an NIL deal against state rules.
pub fn validate_nil_deal(
    state: &str,
    amount_cents: i64,
    deal_type: &str,
) -> ComplianceResult {
    let rules = get_state_rules(state);
    let mut warnings: Vec<String> = Vec::new();
    let mut blocked_reason: Option<String> = None;

    // Check if NIL is allowed at all
    if !rules.nil_allowed {
        return ComplianceResult {
            status: ComplianceStatus::Fail,
            state: rules.state,
            warnings: vec![],
            blocked_reason: Some("NIL deals are not permitted in this state".into()),
        };
    }

    // Check deal amount cap
    if let Some(cap) = rules.max_deal_amount_cents {
        if amount_cents > cap {
            blocked_reason = Some(format!(
                "Deal amount ${:.2} exceeds state cap of ${:.2}",
                amount_cents as f64 / 100.0,
                cap as f64 / 100.0
            ));
        }
    }

    // Check banned categories
    let deal_lower = deal_type.to_lowercase();
    for banned in &rules.banned_categories {
        if deal_lower.contains(banned) {
            blocked_reason = Some(format!(
                "Deal category '{}' is banned in {}",
                deal_type, rules.state
            ));
        }
    }

    // Disclosure warning
    if rules.requires_disclosure {
        warnings.push(format!(
            "{} requires deal disclosure to institution within 72 hours",
            rules.state
        ));
    }

    // Age warning
    if let Some(min_age) = rules.min_age {
        warnings.push(format!(
            "{} requires athlete to be at least {} years old",
            rules.state, min_age
        ));
    }

    let status = if blocked_reason.is_some() {
        ComplianceStatus::Fail
    } else if !warnings.is_empty() {
        ComplianceStatus::Warn
    } else {
        ComplianceStatus::Pass
    };

    ComplianceResult {
        status,
        state: rules.state,
        warnings,
        blocked_reason,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ca_disclosure_warning() {
        let result = validate_nil_deal("CA", 10_000_00, "sponsorship");
        assert_eq!(result.status, ComplianceStatus::Warn);
        assert!(result.warnings.iter().any(|w| w.contains("disclosure")));
    }

    #[test]
    fn test_ny_over_cap() {
        let result = validate_nil_deal("NY", 600_000_00, "sponsorship");
        assert_eq!(result.status, ComplianceStatus::Fail);
        assert!(result.blocked_reason.is_some());
    }

    #[test]
    fn test_ca_banned_gambling() {
        let result = validate_nil_deal("CA", 5_000_00, "gambling promotion");
        assert_eq!(result.status, ComplianceStatus::Fail);
    }

    #[test]
    fn test_fl_clean_pass() {
        let result = validate_nil_deal("FL", 10_000_00, "sponsorship");
        // FL has no disclosure, no age req, only gambling banned
        assert_eq!(result.status, ComplianceStatus::Pass);
    }

    #[test]
    fn test_unknown_state_defaults() {
        let result = validate_nil_deal("ZZ", 1_000_00, "anything");
        assert_eq!(result.status, ComplianceStatus::Pass);
    }
}
