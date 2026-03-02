/**
 * Compliance Type Definitions
 *
 * Structures for NCAA bylaws, state legislation,
 * institutional rules, and compliance checking.
 */

// ---------------------------------------------------------------------------
// State Law
// ---------------------------------------------------------------------------

export interface StateLaw {
  /** Two-letter state code */
  state: string;
  /** State full name */
  stateName: string;
  /** Whether the state has NIL legislation */
  hasNILLaw: boolean;
  /** Effective date of the law (ISO) */
  effectiveDate?: string;
  /** Key provisions summary */
  provisions: string[];
  /** Disclosure requirements */
  disclosureRequired: boolean;
  /** Agent registration required */
  agentRegistrationRequired: boolean;
  /** Institutional involvement restrictions */
  institutionalRestrictions: string[];
  /** URL to official statute text */
  statuteUrl?: string;
  /** Last review date */
  lastReviewedAt: string;
}

// ---------------------------------------------------------------------------
// Institution Rules
// ---------------------------------------------------------------------------

export interface InstitutionRule {
  id: string;
  /** School name */
  institution: string;
  /** Conference */
  conference: string;
  /** Rule category */
  category: "disclosure" | "branding" | "scheduling" | "academic" | "conduct" | "other";
  /** Rule description */
  description: string;
  /** Whether this is more restrictive than NCAA/state requirements */
  moreRestrictive: boolean;
  /** Enforcement level */
  enforcement: "mandatory" | "recommended" | "advisory";
  /** Effective date */
  effectiveDate: string;
}

// ---------------------------------------------------------------------------
// Compliance Check
// ---------------------------------------------------------------------------

export interface ComplianceCheckInput {
  /** Athlete identifier */
  athleteId: string;
  /** Athlete's school */
  school: string;
  /** Athlete's conference */
  conference: string;
  /** Athlete's state (school location) */
  state: string;
  /** Deal value */
  dealValue: number;
  /** Deal type */
  dealType: string;
  /** Brand / entity involved */
  brand: string;
  /** Deal description */
  description?: string;
  /** Whether the deal involves a booster / collective */
  involvesBooster?: boolean;
  /** Whether used as recruiting inducement */
  recruitingRelated?: boolean;
}

export interface ComplianceCheckResult {
  /** Overall compliance status */
  status: "compliant" | "non_compliant" | "review_required" | "insufficient_data";
  /** Confidence in the assessment */
  confidence: number;
  /** Individual rule check results */
  checks: ComplianceRuleCheck[];
  /** Required actions before deal can proceed */
  requiredActions: string[];
  /** Warnings (not blocking but should be addressed) */
  warnings: string[];
  /** Applicable regulations cited */
  regulations: string[];
  /** Timestamp of check */
  checkedAt: string;
}

export interface ComplianceRuleCheck {
  /** Rule identifier */
  ruleId: string;
  /** Rule source */
  source: "ncaa" | "state" | "conference" | "institution";
  /** Rule description */
  description: string;
  /** Pass/fail/warning */
  result: "pass" | "fail" | "warning" | "not_applicable";
  /** Explanation of the result */
  explanation: string;
  /** Severity if failed */
  severity?: "low" | "medium" | "high" | "critical";
}

// ---------------------------------------------------------------------------
// Compliance Record (audit trail)
// ---------------------------------------------------------------------------

export interface ComplianceRecord {
  id: string;
  /** Deal ID this check relates to */
  dealId: string;
  /** Athlete ID */
  athleteId: string;
  /** Check input */
  input: ComplianceCheckInput;
  /** Check result */
  result: ComplianceCheckResult;
  /** Who initiated the check */
  initiatedBy: string;
  /** ISO timestamps */
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Compliance Dashboard Aggregates
// ---------------------------------------------------------------------------

export interface ComplianceDashboard {
  totalChecks: number;
  compliantCount: number;
  nonCompliantCount: number;
  reviewRequiredCount: number;
  complianceRate: number;
  /** Checks by state */
  byState: Record<string, { total: number; compliant: number }>;
  /** Most common violations */
  topViolations: Array<{ rule: string; count: number; severity: string }>;
  /** Recent checks */
  recentChecks: ComplianceRecord[];
}
