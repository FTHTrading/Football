/** Holding period constants (days) */
export const HOLDING_PERIODS = {
  REG_D_506B: 365,
  REG_D_506C: 365,
  REG_A: 0,
} as const;

/** Concentration limit defaults (basis points = 25% of raise) */
export const DEFAULT_CONCENTRATION_LIMIT_BPS = 2500;

/** Distribution waterfall labels */
export const WATERFALL_LABELS = {
  MANAGEMENT_FEE: "SPV Management Fee",
  INVESTOR_RETURN: "Investor Revenue Share",
  RESERVE: "Operating Reserve",
} as const;

/** NIL33 action names — used in audit ledger */
export const ACTIONS = {
  SPV: {
    CREATED: "spv.created",
    UPDATED: "spv.updated",
    CLOSED: "spv.closed",
    DISSOLVED: "spv.dissolved",
  },
  ATHLETE: {
    CREATED: "athlete.created",
    UPDATED: "athlete.updated",
    RESTRICTED: "athlete.restricted",
  },
  CONTRACT: {
    CREATED: "contract.created",
    ACTIVATED: "contract.activated",
    EXPIRED: "contract.expired",
    TERMINATED: "contract.terminated",
  },
  INSTRUMENT: {
    CREATED: "instrument.created",
    OPENED: "instrument.offering.opened",
    CLOSED: "instrument.offering.closed",
  },
  INVESTOR: {
    CREATED: "investor.created",
    KYC_STARTED: "investor.kyc.started",
    KYC_APPROVED: "investor.kyc.approved",
    KYC_REJECTED: "investor.kyc.rejected",
    ACCREDITATION_APPROVED: "investor.accreditation.approved",
    ACCREDITATION_REJECTED: "investor.accreditation.rejected",
  },
  SUBSCRIPTION: {
    CREATED: "subscription.created",
    DOCS_SIGNED: "subscription.docs_signed",
    ACCEPTED: "subscription.accepted",
    FUNDED: "subscription.funded",
    REJECTED: "subscription.rejected",
    WITHDRAWN: "subscription.withdrawn",
  },
  DISTRIBUTION: {
    CREATED: "distribution.created",
    CALCULATED: "distribution.calculated",
    COMPLIANCE_APPROVED: "distribution.compliance_approved",
    EXECUTED: "distribution.executed",
    REVERSED: "distribution.reversed",
  },
  COMPLIANCE: {
    CHECK_RUN: "compliance.check_run",
    TRANSFER_CHECKED: "compliance.transfer_checked",
  },
  DOCUMENT: {
    UPLOADED: "document.uploaded",
    LINKED: "document.linked",
  },
  UNDERWRITING: {
    SCORED: "underwriting.scored",
    MEMO_GENERATED: "underwriting.memo.generated",
    MEMO_REVIEWED: "underwriting.memo.reviewed",
    MEMO_APPROVED: "underwriting.memo.approved",
    MEMO_REJECTED: "underwriting.memo.rejected",
    MEMO_STALE: "underwriting.memo.stale",
    STRESS_TEST_RUN: "underwriting.stress_test.run",
  },
} as const;

/** Reason codes for compliance gate decisions */
export const REASON_CODES = {
  OK: "OK",
  HOLDING_PERIOD_NOT_MET: "HOLDING_PERIOD_NOT_MET",
  INVESTOR_NOT_ACCREDITED: "INVESTOR_NOT_ACCREDITED",
  JURISDICTION_RESTRICTED: "JURISDICTION_RESTRICTED",
  CONCENTRATION_LIMIT_EXCEEDED: "CONCENTRATION_LIMIT_EXCEEDED",
  INVESTOR_NOT_ON_WHITELIST: "INVESTOR_NOT_ON_WHITELIST",
  INSTRUMENT_CLOSED: "INSTRUMENT_CLOSED",
  KYC_NOT_APPROVED: "KYC_NOT_APPROVED",
  AML_FLAG: "AML_FLAG",
} as const;

/** Jurisdictions with known NIL activity restrictions (placeholder — legal review required) */
export const RESTRICTED_JURISDICTIONS: string[] = [];

/** Maximum page size for API pagination */
export const MAX_PAGE_SIZE = 200;

/** Default page size */
export const DEFAULT_PAGE_SIZE = 50;
