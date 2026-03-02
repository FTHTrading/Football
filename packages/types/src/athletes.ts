/**
 * Athlete Type Definitions
 *
 * Profiles, metrics, and social data for collegiate athletes
 * across all sports tracked by NIL33.
 */

import type { SportId, ConferenceId } from "./sports";

// ---------------------------------------------------------------------------
// Athlete Profile
// ---------------------------------------------------------------------------

export interface AthleteProfile {
  id: string;
  /** Full legal name */
  name: string;
  /** Preferred display name */
  displayName?: string;
  /** Sport */
  sport: SportId;
  /** Position within sport */
  position: string;
  /** School / university */
  school: string;
  /** Conference */
  conference: ConferenceId;
  /** NCAA class year */
  classYear: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";
  /** Eligibility years remaining */
  eligibilityRemaining: number;
  /** Home state (two-letter code) */
  homeState: string;
  /** Height in inches */
  height?: number;
  /** Weight in pounds */
  weight?: number;
  /** Profile image URL */
  imageUrl?: string;
  /** Active / inactive / transferred */
  status: "active" | "inactive" | "transferred" | "graduated";
  /** ISO date when profile was created */
  createdAt: string;
  /** ISO date when profile was last updated */
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Performance Metrics (sport-agnostic wrapper)
// ---------------------------------------------------------------------------

export interface PerformanceMetrics {
  athleteId: string;
  sport: SportId;
  season: string;
  /** Overall composite score (0-100) */
  compositeScore: number;
  /** Sport-specific stats as key-value pairs */
  stats: Record<string, number | string>;
  /** National ranking within sport (if available) */
  nationalRank?: number;
  /** Conference ranking */
  conferenceRank?: number;
  /** Awards / honors for this season */
  awards?: string[];
}

/**
 * Football-specific metrics (extends general stats)
 */
export interface FootballMetrics {
  passingYards?: number;
  passingTouchdowns?: number;
  completionPercentage?: number;
  rushingYards?: number;
  rushingTouchdowns?: number;
  receivingYards?: number;
  receivingTouchdowns?: number;
  tackles?: number;
  sacks?: number;
  interceptions?: number;
  pff_grade?: number;
  qbr?: number;
}

/**
 * Basketball-specific metrics
 */
export interface BasketballMetrics {
  pointsPerGame?: number;
  reboundsPerGame?: number;
  assistsPerGame?: number;
  stealsPerGame?: number;
  blocksPerGame?: number;
  fieldGoalPercentage?: number;
  threePointPercentage?: number;
  freeThrowPercentage?: number;
  playerEfficiencyRating?: number;
}

// ---------------------------------------------------------------------------
// Social Presence
// ---------------------------------------------------------------------------

export interface SocialPresence {
  athleteId: string;
  /** Followers / subscribers per platform */
  platforms: {
    instagram?: PlatformMetrics;
    tiktok?: PlatformMetrics;
    twitter?: PlatformMetrics;
    youtube?: PlatformMetrics;
    threads?: PlatformMetrics;
  };
  /** Aggregate total followers */
  totalFollowers: number;
  /** Weighted average engagement rate */
  avgEngagementRate: number;
  /** Monthly growth rate (percentage) */
  monthlyGrowthRate: number;
  /** Last scrape date */
  lastUpdated: string;
}

export interface PlatformMetrics {
  followers: number;
  /** Average engagement rate (0-100) */
  engagementRate: number;
  /** Average posts per week */
  postFrequency: number;
  /** Verified account flag */
  verified: boolean;
  /** Profile URL */
  profileUrl?: string;
}

// ---------------------------------------------------------------------------
// Athlete Valuation Snapshot
// ---------------------------------------------------------------------------

export interface ValuationSnapshot {
  athleteId: string;
  /** ISO date of valuation */
  date: string;
  /** Estimated annual market value (USD) */
  estimatedValue: number;
  /** Low range */
  rangeLow: number;
  /** High range */
  rangeHigh: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** Value tier */
  tier: "Elite" | "Premium" | "Mid-Market" | "Emerging" | "Entry";
  /** Percentile rank within sport */
  percentile: number;
  /** Change from previous valuation */
  delta?: number;
}

// ---------------------------------------------------------------------------
// Athlete Search / Filter
// ---------------------------------------------------------------------------

export interface AthleteSearchParams {
  query?: string;
  sport?: SportId;
  position?: string;
  school?: string;
  conference?: ConferenceId;
  classYear?: AthleteProfile["classYear"];
  state?: string;
  minValue?: number;
  maxValue?: number;
  tier?: ValuationSnapshot["tier"];
  sortBy?: "value" | "followers" | "engagement" | "performance" | "name";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface AthleteSearchResult {
  athletes: AthleteProfile[];
  total: number;
  page: number;
  pageSize: number;
}
