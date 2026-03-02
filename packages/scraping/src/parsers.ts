/**
 * Deal Parsers
 *
 * Extract structured NIL deal data from raw scraped content
 * using pattern matching and NLP heuristics.
 */

import type { ScrapeItem } from "./scraper";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ParsedDeal {
  /** Extracted athlete name */
  athleteName: string | null;
  /** Extracted deal value (USD) */
  value: number | null;
  /** Deal type guess */
  dealType: string | null;
  /** Sport */
  sport: string | null;
  /** School */
  school: string | null;
  /** Brand */
  brand: string | null;
  /** Confidence score (0-1) */
  confidence: number;
  /** Source URL */
  sourceUrl: string | null;
  /** Publication date */
  pubDate: string | null;
  /** Raw title */
  rawTitle: string;
}

// ---------------------------------------------------------------------------
// Extraction Patterns
// ---------------------------------------------------------------------------

const VALUE_PATTERNS = [
  /\$([0-9,]+(?:\.[0-9]+)?)\s*(?:million|mil|M)/i,
  /\$([0-9,]+(?:\.[0-9]+)?)\s*(?:thousand|K)/i,
  /\$([0-9,]+(?:\.[0-9]+)?)/,
  /([0-9,]+(?:\.[0-9]+)?)\s*(?:million|mil)\s*(?:dollar|deal|contract)/i,
];

const DEAL_TYPE_KEYWORDS: Record<string, string[]> = {
  endorsement: ["endorsement", "endorses", "brand deal", "partnership", "ambassador"],
  appearance: ["appearance", "appears", "event", "meet and greet", "meet & greet"],
  social_media: ["social media", "instagram", "tiktok", "post", "content creator"],
  merchandise: ["merchandise", "merch", "clothing", "apparel", "shoe"],
  camp: ["camp", "training", "clinic", "coaching"],
  autograph: ["autograph", "signing", "signed"],
  collective: ["collective", "booster", "consortium"],
  licensing: ["licensing", "license", "rights"],
};

const SPORT_KEYWORDS: Record<string, string[]> = {
  football: ["football", "quarterback", "qb", "wide receiver", "running back", "offensive line", "defensive"],
  basketball: ["basketball", "hoops", "point guard", "center", "forward"],
  baseball: ["baseball", "pitcher", "shortstop", "outfielder"],
  soccer: ["soccer", "midfielder", "goalkeeper", "striker"],
  softball: ["softball"],
  volleyball: ["volleyball"],
  "track & field": ["track", "field", "sprinter", "hurdles", "javelin"],
  swimming: ["swimming", "swimmer", "diving"],
  golf: ["golf", "golfer"],
  tennis: ["tennis"],
  lacrosse: ["lacrosse", "lax"],
  hockey: ["hockey"],
  wrestling: ["wrestling", "wrestler"],
  gymnastics: ["gymnastics", "gymnast"],
};

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

export class DealParser {
  /**
   * Parse a single scraped item into a structured deal.
   */
  parse(item: ScrapeItem): ParsedDeal {
    const text = `${item.title} ${item.content ?? ""}`.toLowerCase();
    let confidence = 0;

    // Extract value
    const value = this.extractValue(text);
    if (value !== null) confidence += 0.3;

    // Extract deal type
    const dealType = this.extractDealType(text);
    if (dealType) confidence += 0.15;

    // Extract sport
    const sport = item.sport ?? this.extractSport(text);
    if (sport) confidence += 0.15;

    // Use pre-extracted fields from scraper
    const athleteName = item.athleteName ?? null;
    const school = item.school ?? null;
    const brand = item.brand ?? null;

    if (athleteName) confidence += 0.2;
    if (school) confidence += 0.1;
    if (brand) confidence += 0.1;

    return {
      athleteName,
      value,
      dealType,
      sport,
      school,
      brand,
      confidence: Math.min(confidence, 1),
      sourceUrl: item.url ?? null,
      pubDate: item.pubDate ?? null,
      rawTitle: item.title,
    };
  }

  /**
   * Parse multiple items and filter by minimum confidence.
   */
  parseMany(items: ScrapeItem[], minConfidence = 0.3): ParsedDeal[] {
    return items
      .map((item) => this.parse(item))
      .filter((deal) => deal.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  }

  private extractValue(text: string): number | null {
    for (const pattern of VALUE_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const raw = match[1].replace(/,/g, "");
        let value = parseFloat(raw);

        // Detect multiplier
        if (/million|mil|M/i.test(match[0])) value *= 1_000_000;
        if (/thousand|K/i.test(match[0])) value *= 1_000;

        if (!isNaN(value) && value > 0) return value;
      }
    }
    return null;
  }

  private extractDealType(text: string): string | null {
    for (const [type, keywords] of Object.entries(DEAL_TYPE_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        return type;
      }
    }
    return null;
  }

  private extractSport(text: string): string | null {
    for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        return sport;
      }
    }
    return null;
  }
}
