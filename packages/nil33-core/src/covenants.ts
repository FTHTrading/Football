/**
 * @nil33/core — Covenant Rule Engine
 *
 * Deterministic covenant recommendation generator.
 * Given a CompositeScore + risk flags, produces structured covenant recommendations
 * that should be attached to the underwriting memo.
 *
 * Pure functions. No side effects.
 */

import {
  type CompositeScore,
  type CovenantRecommendation,
  type RiskFlag,
  type RiskFlagSeverity,
  type SignalDimension,
} from "./types";

// ─── Covenant Rule Definitions ──────────────────────────────────────────────

interface CovenantRule {
  /** What triggers this covenant */
  trigger: CovenantTrigger;
  /** The covenant to recommend */
  covenant: Omit<CovenantRecommendation, "triggerCondition">;
  /** Dynamic trigger condition text */
  conditionText: (ctx: RuleContext) => string;
  /** Priority: lower = more important */
  priority: number;
}

type CovenantTrigger =
  | { type: "composite_below"; threshold: number }
  | { type: "dimension_below"; dimension: SignalDimension; threshold: number }
  | { type: "flag_code"; code: string }
  | { type: "flag_severity_count"; severity: RiskFlagSeverity; minCount: number }
  | { type: "critical_flags_any" };

interface RuleContext {
  score: CompositeScore;
  flags: RiskFlag[];
}

// ─── Rules ──────────────────────────────────────────────────────────────────

/**
 * Canonical covenant rule descriptions for genome hashing.
 * This captures the structural identity of the rules without runtime functions.
 */
export const COVENANT_RULES_CANONICAL = [
  { type: "financial", triggerType: "composite_below", threshold: 60, description: "Early redemption at par" },
  { type: "financial", triggerType: "composite_below", threshold: 75, description: "Facility size cap" },
  { type: "financial", triggerType: "dimension_below", dimension: "revenue_durability", threshold: 50, description: "Revenue monitoring" },
  { type: "financial", triggerType: "flag_code", code: "HIGH_SPONSOR_CONCENTRATION", description: "Sponsor diversification" },
  { type: "behavioral", triggerType: "flag_code", code: "REPUTATION_RISK", description: "Morality clause" },
  { type: "behavioral", triggerType: "flag_code", code: "BRAND_SAFETY_CONCERN", description: "Content review protocol" },
  { type: "behavioral", triggerType: "dimension_below", dimension: "reputational_volatility", threshold: 50, description: "Reputational monitoring" },
  { type: "eligibility", triggerType: "flag_code", code: "ELIGIBILITY_AT_RISK", description: "NCAA eligibility attestation" },
  { type: "eligibility", triggerType: "flag_code", code: "TRANSFER_PORTAL_RISK", description: "Transfer clause" },
  { type: "eligibility", triggerType: "flag_code", code: "HIGH_INJURY_RISK", description: "Insurance requirement" },
  { type: "reporting", triggerType: "critical_flags_any", description: "Enhanced reporting" },
  { type: "reporting", triggerType: "flag_severity_count", severity: "caution", minCount: 2, description: "Caution-level reporting" },
  { type: "reporting", triggerType: "composite_below", threshold: 70, description: "Watchlist reporting" },
];

const COVENANT_RULES: CovenantRule[] = [
  // ── Financial covenants ──────────────────────────────────────────────────

  {
    trigger: { type: "composite_below", threshold: 60 },
    covenant: {
      type: "financial",
      description: "Early redemption at par if composite score drops below 55 for two consecutive quarters",
      consequence: "Facility accelerates; outstanding principal returned at par value",
    },
    conditionText: (ctx) => `Composite score ${ctx.score.composite} < 60`,
    priority: 1,
  },
  {
    trigger: { type: "composite_below", threshold: 75 },
    covenant: {
      type: "financial",
      description: "Facility size capped at conservative valuation band (low estimate)",
      consequence: "Maximum advance reduced to low-end valuation",
    },
    conditionText: (ctx) => `Composite score ${ctx.score.composite} < 75`,
    priority: 3,
  },
  {
    trigger: { type: "dimension_below", dimension: "revenue_durability", threshold: 50 },
    covenant: {
      type: "financial",
      description: "Revenue monitoring covenant: quarterly revenue attestation required",
      consequence: "Missed attestation triggers review period; two misses trigger acceleration",
    },
    conditionText: () => "Revenue durability dimension below 50",
    priority: 2,
  },
  {
    trigger: { type: "flag_code", code: "HIGH_SPONSOR_CONCENTRATION" },
    covenant: {
      type: "financial",
      description: "Sponsor diversification covenant: no single sponsor may exceed 50% of total NIL revenue",
      consequence: "Breach triggers facility sizing review within 30 days",
    },
    conditionText: () => "High sponsor concentration flag triggered",
    priority: 2,
  },

  // ── Behavioral covenants ─────────────────────────────────────────────────

  {
    trigger: { type: "flag_code", code: "REPUTATION_RISK" },
    covenant: {
      type: "behavioral",
      description: "Morality clause with 30-day cure period",
      consequence: "Uncured morality breach triggers immediate facility acceleration",
    },
    conditionText: () => "Reputation risk flag triggered",
    priority: 1,
  },
  {
    trigger: { type: "flag_code", code: "BRAND_SAFETY_CONCERN" },
    covenant: {
      type: "behavioral",
      description: "Content review protocol: all sponsored content requires pre-approval for 6 months",
      consequence: "Unapproved content triggers compliance review",
    },
    conditionText: () => "Brand safety concern flag triggered",
    priority: 3,
  },
  {
    trigger: { type: "dimension_below", dimension: "reputational_volatility", threshold: 50 },
    covenant: {
      type: "behavioral",
      description: "Enhanced reputational monitoring: monthly sentiment review required",
      consequence: "Sustained decline triggers facility re-underwriting",
    },
    conditionText: () => "Reputational volatility dimension below 50",
    priority: 2,
  },

  // ── Eligibility covenants ────────────────────────────────────────────────

  {
    trigger: { type: "flag_code", code: "ELIGIBILITY_AT_RISK" },
    covenant: {
      type: "eligibility",
      description: "NCAA eligibility attestation required before facility closing",
      consequence: "Facility cannot close without verified eligibility confirmation",
    },
    conditionText: () => "Eligibility risk flag triggered",
    priority: 1,
  },
  {
    trigger: { type: "flag_code", code: "TRANSFER_PORTAL_RISK" },
    covenant: {
      type: "eligibility",
      description: "Transfer clause: facility terms adjust if athlete enters transfer portal",
      consequence: "Transfer triggers 90-day re-underwriting period; facility may be resized",
    },
    conditionText: () => "Transfer portal risk flag triggered",
    priority: 2,
  },
  {
    trigger: { type: "flag_code", code: "HIGH_INJURY_RISK" },
    covenant: {
      type: "eligibility",
      description: "Insurance requirement: athlete must maintain disability/injury insurance",
      consequence: "Lapsed insurance triggers facility freeze until reinstated",
    },
    conditionText: () => "High injury risk flag triggered",
    priority: 2,
  },

  // ── Reporting covenants ──────────────────────────────────────────────────

  {
    trigger: { type: "critical_flags_any" },
    covenant: {
      type: "reporting",
      description: "Enhanced reporting: monthly score updates and quarterly detailed review",
      consequence: "Missed reporting deadlines trigger compliance escalation",
    },
    conditionText: (ctx) => `${ctx.score.criticalFlags} critical flag(s) present`,
    priority: 1,
  },
  {
    trigger: { type: "flag_severity_count", severity: "caution", minCount: 2 },
    covenant: {
      type: "reporting",
      description: "Caution-level reporting: bi-monthly dashboard reviews required",
      consequence: "Continued caution status triggers quarterly in-person review",
    },
    conditionText: (ctx) => {
      const count = ctx.flags.filter((f) => f.severity === "caution").length;
      return `${count} caution flags present (≥2)`;
    },
    priority: 3,
  },
  {
    trigger: { type: "composite_below", threshold: 70 },
    covenant: {
      type: "reporting",
      description: "Watchlist reporting: athlete placed on active monitoring with weekly score checks",
      consequence: "Score below 60 for 30 consecutive days triggers formal review",
    },
    conditionText: (ctx) => `Composite score ${ctx.score.composite} < 70`,
    priority: 2,
  },
];

// ─── Engine ─────────────────────────────────────────────────────────────────

function evaluateTrigger(trigger: CovenantTrigger, ctx: RuleContext): boolean {
  switch (trigger.type) {
    case "composite_below":
      return ctx.score.composite < trigger.threshold;

    case "dimension_below": {
      const dim = ctx.score.dimensions.find((d) => d.dimension === trigger.dimension);
      return dim !== undefined && dim.score < trigger.threshold;
    }

    case "flag_code":
      return ctx.flags.some((f) => f.code === trigger.code);

    case "flag_severity_count":
      return ctx.flags.filter((f) => f.severity === trigger.severity).length >= trigger.minCount;

    case "critical_flags_any":
      return ctx.score.criticalFlags > 0;
  }
}

/**
 * Generate covenant recommendations based on a composite score and its risk flags.
 *
 * DETERMINISTIC: same score + flags = same covenants. Always.
 *
 * @param score - CompositeScore from scoring engine
 * @returns Ordered array of covenant recommendations (highest priority first)
 */
export function generateCovenants(score: CompositeScore): CovenantRecommendation[] {
  // Collect all flags from all dimensions
  const allFlags: RiskFlag[] = score.dimensions.flatMap((d) => d.flags);

  const ctx: RuleContext = { score, flags: allFlags };
  const recommendations: (CovenantRecommendation & { priority: number })[] = [];

  for (const rule of COVENANT_RULES) {
    if (evaluateTrigger(rule.trigger, ctx)) {
      recommendations.push({
        type: rule.covenant.type,
        description: rule.covenant.description,
        triggerCondition: rule.conditionText(ctx),
        consequence: rule.covenant.consequence,
        priority: rule.priority,
      });
    }
  }

  // Sort by priority (lower = more important), then by type for stability
  recommendations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.type.localeCompare(b.type);
  });

  // Strip priority from output (internal only)
  return recommendations.map(({ priority: _, ...rest }) => rest);
}

/**
 * Get the count of covenants that would trigger for a given score.
 * Useful for dashboard summaries without generating full covenant text.
 */
export function countTriggeredCovenants(score: CompositeScore): {
  total: number;
  financial: number;
  behavioral: number;
  eligibility: number;
  reporting: number;
} {
  const covenants = generateCovenants(score);
  return {
    total: covenants.length,
    financial: covenants.filter((c) => c.type === "financial").length,
    behavioral: covenants.filter((c) => c.type === "behavioral").length,
    eligibility: covenants.filter((c) => c.type === "eligibility").length,
    reporting: covenants.filter((c) => c.type === "reporting").length,
  };
}
