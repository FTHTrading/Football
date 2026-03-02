/**
 * Core Scraper
 *
 * Fetches data from configured sources using appropriate strategies
 * (RSS parsing, HTML scraping, API calls).
 */

import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { type SourceConfig, SOURCE_CONFIGS } from "./sources";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScraperConfig {
  /** User-Agent header for requests */
  userAgent?: string;
  /** Global rate limit (requests per minute across all sources) */
  globalRateLimit?: number;
  /** Request timeout in ms */
  timeoutMs?: number;
  /** Custom sources (merged with defaults) */
  sources?: SourceConfig[];
}

export interface ScrapeResult {
  sourceId: string;
  sourceName: string;
  items: ScrapeItem[];
  scrapedAt: string;
  durationMs: number;
  errors: string[];
}

export interface ScrapeItem {
  /** Raw title from source */
  title: string;
  /** URL to full article/deal */
  url?: string;
  /** Raw content/description */
  content?: string;
  /** Publication date */
  pubDate?: string;
  /** Extracted athlete name (if found) */
  athleteName?: string;
  /** Extracted deal value (if found) */
  dealValue?: number;
  /** Extracted sport (if found) */
  sport?: string;
  /** Extracted school (if found) */
  school?: string;
  /** Extracted brand (if found) */
  brand?: string;
  /** Raw metadata from source */
  raw?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Scraper
// ---------------------------------------------------------------------------

export class Scraper {
  private config: Required<ScraperConfig>;
  private sources: SourceConfig[];
  private rssParser: Parser;
  private lastRequest = 0;

  constructor(config: ScraperConfig = {}) {
    this.config = {
      userAgent:
        config.userAgent ??
        "NIL33-Scraper/1.0 (https://nil33.com; research purposes)",
      globalRateLimit: config.globalRateLimit ?? 10,
      timeoutMs: config.timeoutMs ?? 15_000,
      sources: config.sources ?? [],
    };

    this.sources = [...SOURCE_CONFIGS, ...this.config.sources].filter(
      (s) => s.enabled
    );

    this.rssParser = new Parser({
      timeout: this.config.timeoutMs,
      headers: { "User-Agent": this.config.userAgent },
    });
  }

  /**
   * Scrape all enabled sources.
   */
  async scrapeAll(): Promise<ScrapeResult[]> {
    const results: ScrapeResult[] = [];

    for (const source of this.sources) {
      try {
        const result = await this.scrapeSource(source);
        results.push(result);
      } catch (err) {
        results.push({
          sourceId: source.id,
          sourceName: source.name,
          items: [],
          scrapedAt: new Date().toISOString(),
          durationMs: 0,
          errors: [err instanceof Error ? err.message : String(err)],
        });
      }

      // Respect rate limits
      await this.rateLimitDelay();
    }

    return results;
  }

  /**
   * Scrape a single source by ID.
   */
  async scrapeById(sourceId: string): Promise<ScrapeResult> {
    const source = this.sources.find((s) => s.id === sourceId);
    if (!source) {
      throw new Error(`Source "${sourceId}" not found or not enabled`);
    }
    return this.scrapeSource(source);
  }

  /**
   * Scrape a single source.
   */
  private async scrapeSource(source: SourceConfig): Promise<ScrapeResult> {
    const start = Date.now();
    const errors: string[] = [];

    let items: ScrapeItem[] = [];

    try {
      switch (source.type) {
        case "rss":
          items = await this.scrapeRSS(source);
          break;
        case "html":
          items = await this.scrapeHTML(source);
          break;
        case "api":
          items = await this.scrapeAPI(source);
          break;
        default:
          errors.push(`Source type "${source.type}" not yet implemented`);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      items,
      scrapedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      errors,
    };
  }

  /**
   * Parse an RSS feed source.
   */
  private async scrapeRSS(source: SourceConfig): Promise<ScrapeItem[]> {
    const feed = await this.rssParser.parseURL(source.url);

    return (feed.items ?? []).map((item) => ({
      title: item.title ?? "",
      url: item.link,
      content: item.contentSnippet ?? item.content ?? "",
      pubDate: item.pubDate ?? item.isoDate,
      raw: item as unknown as Record<string, unknown>,
    }));
  }

  /**
   * Scrape an HTML page using CSS selectors.
   */
  private async scrapeHTML(source: SourceConfig): Promise<ScrapeItem[]> {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": this.config.userAgent,
        ...source.headers,
      },
      signal: AbortSignal.timeout(this.config.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${source.url}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const items: ScrapeItem[] = [];
    const sel = source.selectors;

    if (!sel?.container) return items;

    $(sel.container).each((_i, el) => {
      const item: ScrapeItem = {
        title: sel.title ? $(el).find(sel.title).text().trim() : "",
        url: sel.link
          ? $(el).find(sel.link).attr("href")
          : undefined,
        content: $(el).text().trim(),
      };

      if (sel.athlete) {
        item.athleteName = $(el).find(sel.athlete).text().trim() || undefined;
      }
      if (sel.school) {
        item.school = $(el).find(sel.school).text().trim() || undefined;
      }
      if (sel.sport) {
        item.sport = $(el).find(sel.sport).text().trim() || undefined;
      }
      if (sel.value) {
        const valText = $(el).find(sel.value).text().trim();
        const parsed = parseFloat(valText.replace(/[^0-9.]/g, ""));
        if (!isNaN(parsed)) item.dealValue = parsed;
      }

      if (item.title) items.push(item);
    });

    return items;
  }

  /**
   * Fetch from a JSON API source.
   */
  private async scrapeAPI(source: SourceConfig): Promise<ScrapeItem[]> {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": this.config.userAgent,
        Accept: "application/json",
        ...source.headers,
      },
      signal: AbortSignal.timeout(this.config.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} from ${source.url}`);
    }

    const data = await response.json();

    // Generic array handling — specific sources may need custom parsers
    if (Array.isArray(data)) {
      return data.map((item: Record<string, unknown>) => ({
        title: String(item.title ?? item.name ?? ""),
        url: item.url as string | undefined,
        content: String(item.description ?? item.content ?? ""),
        raw: item,
      }));
    }

    return [];
  }

  /**
   * Rate limit delay between requests.
   */
  private async rateLimitDelay(): Promise<void> {
    const minInterval = 60_000 / this.config.globalRateLimit;
    const elapsed = Date.now() - this.lastRequest;
    if (elapsed < minInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, minInterval - elapsed)
      );
    }
    this.lastRequest = Date.now();
  }

  /** Get list of enabled sources */
  getSources(): SourceConfig[] {
    return [...this.sources];
  }
}
