import type { ComplianceRule } from "./engine";
import { REASON_CODES, RESTRICTED_JURISDICTIONS } from "@nil33/core";

/**
 * KYC / AML cleared rule.
 * Investor must have approved KYC before subscribing.
 */
const kycApprovedRule: ComplianceRule = {
  id: "kyc_approved",
  name: "KYC Approved",
  description: "Investor must have an approved KYC status.",
  evaluate(ctx) {
    if (ctx.investor.kycStatus !== "approved") {
      return {
        reasonCode: REASON_CODES.KYC_NOT_APPROVED,
        detail: `Investor KYC status is "${ctx.investor.kycStatus}". Must be "approved".`,
      };
    }
    return null;
  },
};

/**
 * Accreditation rule.
 * If the instrument requires accredited investors, the investor must be accredited.
 */
const accreditationRule: ComplianceRule = {
  id: "accreditation",
  name: "Accreditation Status",
  description: "Investor must be accredited if instrument requires it.",
  evaluate(ctx) {
    const requiresAccredited =
      ctx.instrument.eligibilityRules.includes("accredited_only") ||
      ctx.instrument.eligibilityRules.includes("qib_only");

    if (!requiresAccredited) return null;

    if (ctx.investor.accreditationStatus !== "approved") {
      return {
        reasonCode: REASON_CODES.INVESTOR_NOT_ACCREDITED,
        detail: `Instrument requires accredited investors. Investor accreditation status: "${ctx.investor.accreditationStatus}".`,
      };
    }

    // Check accreditation expiry
    const asOf = ctx.asOf ?? new Date();
    if (
      ctx.investor.accreditationExpiry &&
      ctx.investor.accreditationExpiry < asOf
    ) {
      return {
        reasonCode: REASON_CODES.INVESTOR_NOT_ACCREDITED,
        detail: `Investor accreditation expired on ${ctx.investor.accreditationExpiry.toISOString()}.`,
      };
    }

    return null;
  },
};

/**
 * Jurisdiction restriction rule.
 * Investors from restricted jurisdictions cannot subscribe.
 */
const jurisdictionRule: ComplianceRule = {
  id: "jurisdiction",
  name: "Jurisdiction Check",
  description:
    "Prevents investors from restricted jurisdictions from subscribing.",
  evaluate(ctx) {
    if (RESTRICTED_JURISDICTIONS.includes(ctx.investor.jurisdiction)) {
      return {
        reasonCode: REASON_CODES.JURISDICTION_RESTRICTED,
        detail: `Investor jurisdiction "${ctx.investor.jurisdiction}" is restricted for this instrument.`,
      };
    }

    // US-only check
    if (ctx.instrument.eligibilityRules.includes("us_only")) {
      const usJurisdictions = ["US", "USA"];
      if (!usJurisdictions.includes(ctx.investor.jurisdiction.toUpperCase())) {
        return {
          reasonCode: REASON_CODES.JURISDICTION_RESTRICTED,
          detail: `Instrument is restricted to US investors. Investor jurisdiction: "${ctx.investor.jurisdiction}".`,
        };
      }
    }

    // Non-US-only check
    if (ctx.instrument.eligibilityRules.includes("non_us_only")) {
      const usJurisdictions = ["US", "USA"];
      if (usJurisdictions.includes(ctx.investor.jurisdiction.toUpperCase())) {
        return {
          reasonCode: REASON_CODES.JURISDICTION_RESTRICTED,
          detail: `Instrument is restricted to non-US investors. Investor is US-based.`,
        };
      }
    }

    return null;
  },
};

/**
 * Instrument status rule.
 * Cannot subscribe to a closed or matured instrument.
 */
const instrumentStatusRule: ComplianceRule = {
  id: "instrument_status",
  name: "Instrument Open for Subscriptions",
  description: "Instrument must be in 'offering' status to accept new subscriptions.",
  evaluate(ctx) {
    if (ctx.instrument.status !== "offering") {
      return {
        reasonCode: REASON_CODES.INSTRUMENT_CLOSED,
        detail: `Instrument is not open for subscriptions. Current status: "${ctx.instrument.status}".`,
      };
    }
    return null;
  },
};

/**
 * Risk flags rule.
 * Investors with active risk flags cannot subscribe.
 */
const riskFlagsRule: ComplianceRule = {
  id: "risk_flags",
  name: "No Active Risk Flags",
  description: "Investor must not have active risk flags.",
  evaluate(ctx) {
    if (ctx.investor.riskFlags && ctx.investor.riskFlags.length > 0) {
      return {
        reasonCode: REASON_CODES.AML_FLAG,
        detail: `Investor has active risk flags: ${ctx.investor.riskFlags.join(", ")}.`,
      };
    }
    return null;
  },
};

/**
 * Concentration limit rule.
 * A single investor cannot hold more than concentrationLimitPct (bps) of the offering.
 */
const concentrationLimitRule: ComplianceRule = {
  id: "concentration_limit",
  name: "Investor Concentration Limit",
  description:
    "A single investor cannot exceed the instrument's concentration limit.",
  evaluate(ctx) {
    if (
      ctx.currentInvestorTotalCents === undefined ||
      ctx.currentRaisedCents === undefined
    ) {
      return null; // skip if not provided
    }

    const offeringSize = ctx.instrument.offeringSizeCents;
    const requestedTotal = ctx.currentInvestorTotalCents;

    // bps: e.g. 2500 = 25%
    const limitPct = ctx.instrument.concentrationLimitPct / 10000;
    const maxAllowed = Math.floor(offeringSize * limitPct);

    if (requestedTotal > maxAllowed) {
      return {
        reasonCode: REASON_CODES.CONCENTRATION_LIMIT_EXCEEDED,
        detail: `Investor would hold ${(requestedTotal / offeringSize * 100).toFixed(2)}% of offering. Limit is ${(limitPct * 100).toFixed(2)}%.`,
      };
    }

    return null;
  },
};

/** Ordered rule set — first failure short-circuits */
export const rules: ComplianceRule[] = [
  kycApprovedRule,
  accreditationRule,
  jurisdictionRule,
  instrumentStatusRule,
  riskFlagsRule,
  concentrationLimitRule,
];
