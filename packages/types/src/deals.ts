/**
 * NIL Deal Type Definitions
 *
 * Structures for representing NIL deals, agreements,
 * and marketplace activity across all sports.
 */

import type { SportId } from "./sports";

// ---------------------------------------------------------------------------
// Deal Types
// ---------------------------------------------------------------------------

export type DealType =
  | "endorsement"
  | "appearance"
  | "social_media"
  | "merchandise"
  | "camp"
  | "autograph"
  | "licensing"
  | "collective"
  | "other";

export type DealStatus =
  | "active"
  | "pending"
  | "completed"
  | "expired"
  | "terminated"
  | "draft";

// ---------------------------------------------------------------------------
// Deal Record
// ---------------------------------------------------------------------------

export interface NILDeal {
  id: string;
  /** Athlete ID (if linked) */
  athleteId?: string;
  /** Athlete name (always present, even without linked profile) */
  athleteName: string;
  /** Sport */
  sport: SportId;
  /** Position */
  position?: string;
  /** School / university */
  school: string;
  /** Brand or entity */
  brand: string;
  /** Deal type category */
  dealType: DealType;
  /** Total deal value (USD) */
  value: number;
  /** Annual value if multi-year */
  annualValue?: number;
  /** Deal duration in months */
  durationMonths?: number;
  /** Deal status */
  status: DealStatus;
  /** Brief description of deliverables */
  description?: string;
  /** Public announcement date (ISO) */
  announcedDate: string;
  /** Deal start date (ISO) */
  startDate?: string;
  /** Deal end date (ISO) */
  endDate?: string;
  /** Source of deal information */
  source: DealSource;
  /** Compliance status */
  complianceStatus: "cleared" | "pending_review" | "flagged" | "unknown";
  /** State where deal was executed */
  state?: string;
  /** Conference */
  conference?: string;
  /** Tags for categorization */
  tags?: string[];
  /** ISO timestamps */
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Deal Source (how we know about this deal)
// ---------------------------------------------------------------------------

export interface DealSource {
  type: "scraped" | "reported" | "disclosed" | "estimated";
  /** Source URL */
  url?: string;
  /** Source name (e.g., "ESPN", "On3 NIL Database") */
  name: string;
  /** Confidence in the data accuracy (0-1) */
  confidence: number;
}

// ---------------------------------------------------------------------------
// Deal Search
// ---------------------------------------------------------------------------

export interface DealSearchParams {
  query?: string;
  sport?: SportId;
  dealType?: DealType;
  status?: DealStatus;
  brand?: string;
  school?: string;
  conference?: string;
  state?: string;
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "value" | "date" | "athlete" | "brand";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface DealSearchResult {
  deals: NILDeal[];
  total: number;
  page: number;
  pageSize: number;
  aggregates?: DealAggregates;
}

// ---------------------------------------------------------------------------
// Deal Aggregates / Analytics
// ---------------------------------------------------------------------------

export interface DealAggregates {
  totalValue: number;
  avgValue: number;
  medianValue: number;
  dealCount: number;
  bySport: Record<string, { count: number; totalValue: number }>;
  byType: Record<string, { count: number; totalValue: number }>;
  byConference: Record<string, { count: number; totalValue: number }>;
  topBrands: Array<{ brand: string; dealCount: number; totalValue: number }>;
  topSchools: Array<{ school: string; dealCount: number; totalValue: number }>;
}

// ---------------------------------------------------------------------------
// Deal Agreement (contract structure)
// ---------------------------------------------------------------------------

export interface DealAgreement {
  id: string;
  dealId: string;
  /** Contract version */
  version: number;
  /** Agreement status */
  status: "draft" | "sent" | "signed" | "countersigned" | "active" | "archived";
  /** Deliverables */
  deliverables: Deliverable[];
  /** Payment terms */
  paymentTerms: PaymentTerm[];
  /** Exclusivity clause */
  exclusivity?: {
    enabled: boolean;
    scope: string;
    duration: string;
  };
  /** Morals clause */
  moralsClause?: boolean;
  /** Termination conditions */
  terminationConditions?: string[];
  /** Digital signature data */
  signatures?: {
    athlete?: { signedAt: string; ip?: string };
    brand?: { signedAt: string; ip?: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  type: "social_post" | "appearance" | "autograph" | "photo_shoot" | "video" | "other";
  description: string;
  quantity: number;
  deadline?: string;
  completed: boolean;
}

export interface PaymentTerm {
  id: string;
  amount: number;
  currency: "USD";
  type: "upfront" | "milestone" | "recurring" | "performance_bonus";
  dueDate?: string;
  paid: boolean;
  paidDate?: string;
}
