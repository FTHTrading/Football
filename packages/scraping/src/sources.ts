/**
 * Source Configurations
 *
 * Defines the public data sources the scraping pipeline monitors
 * for NIL deal information, athlete updates, and market data.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SourceType = "rss" | "html" | "api" | "social";

export interface SourceConfig {
  /** Unique source identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Source type */
  type: SourceType;
  /** Base URL */
  url: string;
  /** Scraping interval in minutes */
  intervalMinutes: number;
  /** CSS selectors for HTML scraping */
  selectors?: {
    container?: string;
    title?: string;
    value?: string;
    athlete?: string;
    school?: string;
    sport?: string;
    date?: string;
    link?: string;
  };
  /** Whether the source is currently active */
  enabled: boolean;
  /** Reliability score (0-1) */
  reliability: number;
  /** Sports covered by this source */
  sports: string[];
  /** Rate limit (requests per minute) */
  rateLimit: number;
  /** Custom headers for requests */
  headers?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Pre-configured Sources
// ---------------------------------------------------------------------------

/**
 * Public NIL data sources.
 * All sources are public news/RSS feeds — no paywall bypass.
 */
export const SOURCE_CONFIGS: SourceConfig[] = [
  {
    id: "espn-nil",
    name: "ESPN NIL Coverage",
    type: "rss",
    url: "https://www.espn.com/espn/rss/nil/news",
    intervalMinutes: 30,
    enabled: true,
    reliability: 0.95,
    sports: ["football", "basketball", "baseball", "softball"],
    rateLimit: 2,
  },
  {
    id: "athletic-nil",
    name: "The Athletic NIL",
    type: "rss",
    url: "https://theathletic.com/nil/feed/",
    intervalMinutes: 30,
    enabled: true,
    reliability: 0.9,
    sports: ["football", "basketball"],
    rateLimit: 2,
  },
  {
    id: "si-nil",
    name: "Sports Illustrated NIL",
    type: "rss",
    url: "https://www.si.com/nil/rss",
    intervalMinutes: 60,
    enabled: true,
    reliability: 0.85,
    sports: ["football", "basketball", "baseball"],
    rateLimit: 2,
  },
  {
    id: "ncaa-news",
    name: "NCAA Official News",
    type: "rss",
    url: "https://www.ncaa.org/news/rss.xml",
    intervalMinutes: 120,
    enabled: true,
    reliability: 1.0,
    sports: ["all"],
    rateLimit: 1,
  },
  {
    id: "google-news-nil",
    name: "Google News — NIL Deals",
    type: "rss",
    url: "https://news.google.com/rss/search?q=NIL+deal+college+athlete",
    intervalMinutes: 15,
    enabled: true,
    reliability: 0.7,
    sports: ["all"],
    rateLimit: 3,
  },
];
