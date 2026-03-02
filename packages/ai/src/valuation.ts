/**
 * NIL Valuation Engine
 *
 * Sport-agnostic athlete valuation model with sport-specific weight overrides.
 * Combines performance metrics, social presence, market factors, and
 * historical deal data to produce market value estimates.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValuationInput {
  /** Athlete sport */
  sport: string;
  /** Position within the sport */
  position?: string;
  /** School / university */
  school: string;
  /** Conference (e.g., SEC, Big Ten) */
  conference?: string;
  /** Overall performance rating (0-100) */
  performanceScore: number;
  /** Sport-specific performance metrics */
  metrics?: Record<string, number>;
  /** Social media following across platforms */
  social: {
    instagram?: number;
    tiktok?: number;
    twitter?: number;
    youtube?: number;
  };
  /** Average engagement rate (0-100) */
  engagementRate?: number;
  /** Years of eligibility remaining */
  eligibilityRemaining?: number;
  /** Existing deal count */
  existingDeals?: number;
}

export interface ValuationResult {
  /** Estimated annual NIL market value (USD) */
  estimatedValue: number;
  /** Low end of range */
  rangeLow: number;
  /** High end of range */
  rangeHigh: number;
  /** Model confidence (0-1) */
  confidence: number;
  /** Percentile rank within sport */
  percentile: number;
  /** Factor breakdown */
  factors: {
    performanceValue: number;
    socialValue: number;
    engagementValue: number;
    marketValue: number;
    positionPremium: number;
  };
  /** Sport-specific tier */
  tier: "Elite" | "Premium" | "Mid-Market" | "Emerging" | "Entry";
  /** Comparable athletes (placeholder) */
  comparables: string[];
}

// ---------------------------------------------------------------------------
// Sport-Specific Weights
// ---------------------------------------------------------------------------

interface SportWeights {
  performance: number;
  social: number;
  engagement: number;
  market: number;
  baseMultiplier: number;
}

const SPORT_WEIGHTS: Record<string, SportWeights> = {
  football: {
    performance: 0.4,
    social: 0.25,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 1.0,
  },
  basketball: {
    performance: 0.35,
    social: 0.3,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 0.85,
  },
  baseball: {
    performance: 0.45,
    social: 0.2,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 0.5,
  },
  soccer: {
    performance: 0.35,
    social: 0.3,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.45,
  },
  softball: {
    performance: 0.35,
    social: 0.3,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.4,
  },
  volleyball: {
    performance: 0.3,
    social: 0.35,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.45,
  },
  gymnastics: {
    performance: 0.3,
    social: 0.35,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.55,
  },
  swimming: {
    performance: 0.4,
    social: 0.25,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.35,
  },
  "track & field": {
    performance: 0.45,
    social: 0.2,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.35,
  },
  golf: {
    performance: 0.4,
    social: 0.25,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 0.4,
  },
  tennis: {
    performance: 0.4,
    social: 0.25,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 0.4,
  },
  lacrosse: {
    performance: 0.4,
    social: 0.25,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 0.35,
  },
  hockey: {
    performance: 0.4,
    social: 0.25,
    engagement: 0.15,
    market: 0.2,
    baseMultiplier: 0.45,
  },
  wrestling: {
    performance: 0.45,
    social: 0.2,
    engagement: 0.2,
    market: 0.15,
    baseMultiplier: 0.3,
  },
};

const DEFAULT_WEIGHTS: SportWeights = {
  performance: 0.35,
  social: 0.3,
  engagement: 0.15,
  market: 0.2,
  baseMultiplier: 0.4,
};

// ---------------------------------------------------------------------------
// Conference multipliers
// ---------------------------------------------------------------------------

const CONFERENCE_MULTIPLIER: Record<string, number> = {
  SEC: 1.3,
  "Big Ten": 1.25,
  "Big 12": 1.15,
  ACC: 1.15,
  "Pac-12": 1.1,
  AAC: 0.85,
  "Mountain West": 0.8,
  "Sun Belt": 0.75,
  "Conference USA": 0.7,
  MAC: 0.7,
  "Missouri Valley": 0.65,
  Ivy: 0.6,
};

// ---------------------------------------------------------------------------
// Position premiums (football-specific, extend for other sports)
// ---------------------------------------------------------------------------

const POSITION_PREMIUM: Record<string, number> = {
  QB: 1.5,
  WR: 1.15,
  RB: 1.1,
  TE: 1.05,
  OL: 0.85,
  DL: 0.95,
  LB: 1.0,
  DB: 1.05,
  K: 0.7,
  P: 0.65,
  // Basketball
  PG: 1.2,
  SG: 1.1,
  SF: 1.1,
  PF: 1.05,
  C: 1.0,
};

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class NILValuationEngine {
  /**
   * Calculate estimated NIL market value for an athlete.
   */
  estimate(input: ValuationInput): ValuationResult {
    const sportKey = input.sport.toLowerCase();
    const weights = SPORT_WEIGHTS[sportKey] ?? DEFAULT_WEIGHTS;

    // --- Performance component ---
    const perfScore = Math.min(100, Math.max(0, input.performanceScore));
    const performanceValue = perfScore * 500 * weights.performance;

    // --- Social component ---
    const totalFollowing =
      (input.social.instagram ?? 0) +
      (input.social.tiktok ?? 0) +
      (input.social.twitter ?? 0) +
      (input.social.youtube ?? 0);
    const socialLog = Math.log10(Math.max(totalFollowing, 1));
    const socialValue = socialLog * 10_000 * weights.social;

    // --- Engagement component ---
    const engagement = Math.min(100, Math.max(0, input.engagementRate ?? 3));
    const engagementValue = engagement * 200 * weights.engagement;

    // --- Market component ---
    const confMultiplier =
      CONFERENCE_MULTIPLIER[input.conference ?? ""] ?? 0.8;
    const marketValue = confMultiplier * 15_000 * weights.market;

    // --- Position premium ---
    const posPremium =
      POSITION_PREMIUM[input.position?.toUpperCase() ?? ""] ?? 1.0;

    // --- Base calculation ---
    const rawValue =
      (performanceValue + socialValue + engagementValue + marketValue) *
      weights.baseMultiplier *
      posPremium;

    // --- Eligibility bonus ---
    const eligBonus =
      input.eligibilityRemaining != null
        ? 1 + (input.eligibilityRemaining - 1) * 0.05
        : 1.0;

    const estimatedValue = Math.round(rawValue * eligBonus);

    // --- Range ---
    const rangeLow = Math.round(estimatedValue * 0.7);
    const rangeHigh = Math.round(estimatedValue * 1.4);

    // --- Confidence ---
    const dataPoints = [
      input.performanceScore > 0,
      totalFollowing > 0,
      input.engagementRate != null,
      input.conference != null,
      input.position != null,
    ].filter(Boolean).length;
    const confidence = Math.round((dataPoints / 5) * 100) / 100;

    // --- Tier ---
    const tier = this.determineTier(estimatedValue, sportKey);

    // --- Percentile (simplified) ---
    const percentile = Math.min(
      99,
      Math.round((perfScore * 0.6 + socialLog * 8) * (posPremium * 0.8))
    );

    return {
      estimatedValue,
      rangeLow,
      rangeHigh,
      confidence,
      percentile,
      factors: {
        performanceValue: Math.round(performanceValue),
        socialValue: Math.round(socialValue),
        engagementValue: Math.round(engagementValue),
        marketValue: Math.round(marketValue),
        positionPremium: posPremium,
      },
      tier,
      comparables: [],
    };
  }

  private determineTier(
    value: number,
    sport: string
  ): ValuationResult["tier"] {
    // Sport-adjusted thresholds
    const multiplier = SPORT_WEIGHTS[sport]?.baseMultiplier ?? 0.4;
    const adjusted = value / multiplier;

    if (adjusted >= 100_000) return "Elite";
    if (adjusted >= 50_000) return "Premium";
    if (adjusted >= 20_000) return "Mid-Market";
    if (adjusted >= 5_000) return "Emerging";
    return "Entry";
  }

  /**
   * Compare two athletes' valuations side by side.
   */
  compare(
    a: ValuationInput,
    b: ValuationInput
  ): { a: ValuationResult; b: ValuationResult; delta: number } {
    const resultA = this.estimate(a);
    const resultB = this.estimate(b);
    return {
      a: resultA,
      b: resultB,
      delta: resultA.estimatedValue - resultB.estimatedValue,
    };
  }
}
