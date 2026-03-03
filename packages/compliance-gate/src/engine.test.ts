import { describe, it, expect } from "vitest";
import { ComplianceGate } from "../src/engine";
import type { Investor, Instrument } from "@nil33/core";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const approvedInvestor: Investor = {
  id: "inv-001",
  entityType: "individual",
  legalName: "Sample Investor LLC [SAMPLE]",
  ein: null,
  jurisdiction: "US",
  kycStatus: "approved",
  kycCompletedAt: new Date("2025-01-01"),
  accreditationStatus: "approved",
  accreditationExpiry: new Date("2027-01-01"),
  riskFlags: [],
  contactEmail: "investor@example.com",
  contactName: "Test Investor",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const openInstrument: Instrument = {
  id: "ins-001",
  spvId: "spv-001",
  name: "Athlete Revenue Note A [SAMPLE]",
  type: "revenue_participation_note",
  status: "offering",
  offeringSizeCents: 5_000_000_00, // $5M
  minTicketCents: 25_000_00,        // $25k
  maxTicketCents: null,
  targetYield: null,
  maturityMonths: 36,
  eligibilityRules: ["accredited_only"],
  holdingPeriodDays: 365,
  concentrationLimitPct: 2500, // 25%
  offeringDocId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  closedAt: null,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ComplianceGate", () => {
  const gate = new ComplianceGate();

  it("passes an approved accredited investor on an open offering", () => {
    const result = gate.checkEligibility({
      investor: approvedInvestor,
      instrument: openInstrument,
    });
    expect(result.allowed).toBe(true);
    expect(result.reasonCode).toBe("OK");
  });

  it("fails when KYC is pending", () => {
    const investor = { ...approvedInvestor, kycStatus: "pending" as const };
    const result = gate.checkEligibility({ investor, instrument: openInstrument });
    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("KYC_NOT_APPROVED");
  });

  it("fails when accreditation is required but not approved", () => {
    const investor = {
      ...approvedInvestor,
      accreditationStatus: "pending" as const,
    };
    const result = gate.checkEligibility({ investor, instrument: openInstrument });
    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("INVESTOR_NOT_ACCREDITED");
  });

  it("fails when instrument is closed", () => {
    const instrument = { ...openInstrument, status: "closed" as const };
    const result = gate.checkEligibility({
      investor: approvedInvestor,
      instrument,
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("INSTRUMENT_CLOSED");
  });

  it("fails when investor has risk flags", () => {
    const investor = { ...approvedInvestor, riskFlags: ["OFAC_MATCH"] };
    const result = gate.checkEligibility({ investor, instrument: openInstrument });
    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("AML_FLAG");
  });

  it("fails when concentration limit is exceeded", () => {
    const result = gate.checkEligibility({
      investor: approvedInvestor,
      instrument: openInstrument,
      currentInvestorTotalCents: 2_000_000_00, // $2M = 40% of $5M
      currentRaisedCents: 3_000_000_00,
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("CONCENTRATION_LIMIT_EXCEEDED");
  });

  it("passes when investor is within concentration limit", () => {
    const result = gate.checkEligibility({
      investor: approvedInvestor,
      instrument: openInstrument,
      currentInvestorTotalCents: 1_000_000_00, // $1M = 20% of $5M — under 25% limit
      currentRaisedCents: 2_000_000_00,
    });
    expect(result.allowed).toBe(true);
  });

  it("fails transfer check when holding period not met", () => {
    const fundedAt = new Date();
    fundedAt.setDate(fundedAt.getDate() - 100); // only 100 days ago, need 365
    const result = gate.checkTransferAllowed({
      investor: approvedInvestor,
      instrument: openInstrument,
      fundedAt,
    });
    expect(result.allowed).toBe(false);
    expect(result.reasonCode).toBe("HOLDING_PERIOD_NOT_MET");
  });

  it("allows transfer after holding period", () => {
    const fundedAt = new Date();
    fundedAt.setDate(fundedAt.getDate() - 400); // 400 days ago — past 365-day requirement
    const result = gate.checkTransferAllowed({
      investor: approvedInvestor,
      instrument: openInstrument,
      fundedAt,
    });
    expect(result.allowed).toBe(true);
  });
});
