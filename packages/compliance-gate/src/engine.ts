/**
 * @nil33/compliance-gate — Rules-based compliance engine
 *
 * NOTE: This engine is designed for integration testing and operational use within
 * the NIL33 platform. It does NOT constitute legal advice. All compliance decisions
 * must be reviewed by qualified legal counsel before implementation.
 *
 * Every decision is recorded in the audit ledger.
 */

import type {
  Investor,
  Instrument,
  Subscription,
  TransferCheckResult,
  TransferCheckReasonCode,
  ComplianceCheck,
  ComplianceCheckOutcome,
} from "@nil33/core";
import { REASON_CODES, RESTRICTED_JURISDICTIONS } from "@nil33/core";
import { rules } from "./rules";

// ─── Context passed to every rule ────────────────────────────────────────────

export interface ComplianceContext {
  investor: Investor;
  instrument: Instrument;
  subscription?: Subscription;
  /** Current total subscribed cents for this investor across this instrument */
  currentInvestorTotalCents?: number;
  /** Total funded raise cents for the instrument so far */
  currentRaisedCents?: number;
  /** Date to evaluate against (defaults to now) */
  asOf?: Date;
}

// ─── Rule definition ──────────────────────────────────────────────────────────

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  /** Returns null if rule passes, or a reason code + detail if it fails */
  evaluate(ctx: ComplianceContext): ComplianceRuleResult | null;
}

export interface ComplianceRuleResult {
  reasonCode: TransferCheckReasonCode;
  detail: string;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class ComplianceGate {
  private readonly rules: ComplianceRule[];

  constructor(customRules?: ComplianceRule[]) {
    this.rules = customRules ?? rules;
  }

  /**
   * Run all rules against context. Returns the first failure, or a pass result.
   * All checks are logged externally via the audit ledger.
   */
  checkEligibility(ctx: ComplianceContext): TransferCheckResult {
    const asOf = ctx.asOf ?? new Date();

    for (const rule of this.rules) {
      const result = rule.evaluate({ ...ctx, asOf });
      if (result !== null) {
        return {
          allowed: false,
          reasonCode: result.reasonCode,
          detail: `[${rule.id}] ${result.detail}`,
          checkedAt: asOf,
        };
      }
    }

    return {
      allowed: true,
      reasonCode: REASON_CODES.OK,
      detail: "All compliance rules passed.",
      checkedAt: asOf,
    };
  }

  /**
   * Check whether a transfer of an existing subscription is permitted.
   * Used in secondary readiness layer — not a live ATS.
   */
  checkTransferAllowed(
    ctx: ComplianceContext & { fundedAt: Date }
  ): TransferCheckResult {
    const asOf = ctx.asOf ?? new Date();
    const holdingDays = Math.floor(
      (asOf.getTime() - ctx.fundedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (holdingDays < ctx.instrument.holdingPeriodDays) {
      return {
        allowed: false,
        reasonCode: REASON_CODES.HOLDING_PERIOD_NOT_MET,
        detail: `Holding period not satisfied. Required: ${ctx.instrument.holdingPeriodDays}d. Elapsed: ${holdingDays}d.`,
        checkedAt: asOf,
      };
    }

    // Run standard eligibility on top
    return this.checkEligibility(ctx);
  }

  /**
   * Build an audit-ready ComplianceCheck record from a result.
   */
  toCheckRecord(
    result: TransferCheckResult,
    investorId: string,
    instrumentId: string | null,
    subscriptionId: string | null,
    performedBy: string,
    checkType: ComplianceCheck["type"]
  ): Omit<ComplianceCheck, "id"> {
    const outcome: ComplianceCheckOutcome =
      result.allowed ? "pass" : "fail";

    return {
      investorId,
      instrumentId,
      subscriptionId,
      type: checkType,
      outcome,
      reasonCode: result.reasonCode,
      reasonDetail: result.detail,
      performedAt: result.checkedAt,
      expiresAt: null,
      performedBy,
    };
  }
}
