/**
 * Scraping Scheduler
 *
 * Manages periodic scraping jobs with configurable intervals,
 * deduplication, and error recovery.
 */

import { Scraper, type ScraperConfig, type ScrapeResult } from "./scraper";
import { DealParser, type ParsedDeal } from "./parsers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScheduleConfig {
  /** Scraper configuration */
  scraperConfig?: ScraperConfig;
  /** Default interval in minutes for all sources */
  defaultIntervalMinutes?: number;
  /** Callback when new deals are found */
  onDeals?: (deals: ParsedDeal[]) => void | Promise<void>;
  /** Callback on scrape completion */
  onScrapeComplete?: (results: ScrapeResult[]) => void | Promise<void>;
  /** Callback on errors */
  onError?: (error: Error, sourceId: string) => void;
  /** Minimum confidence for parsed deals */
  minConfidence?: number;
}

// ---------------------------------------------------------------------------
// Scheduler
// ---------------------------------------------------------------------------

export class ScrapingScheduler {
  private scraper: Scraper;
  private parser: DealParser;
  private config: ScheduleConfig;
  private timer: ReturnType<typeof setInterval> | null = null;
  private seenUrls = new Set<string>();
  private running = false;

  constructor(config: ScheduleConfig = {}) {
    this.config = config;
    this.scraper = new Scraper(config.scraperConfig);
    this.parser = new DealParser();
  }

  /**
   * Start the periodic scraping schedule.
   */
  start(): void {
    if (this.running) return;
    this.running = true;

    const intervalMs =
      (this.config.defaultIntervalMinutes ?? 30) * 60 * 1000;

    // Run immediately, then on interval
    this.tick();
    this.timer = setInterval(() => this.tick(), intervalMs);
  }

  /**
   * Stop the scraping schedule.
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.running = false;
  }

  /**
   * Run a single scraping cycle.
   */
  async tick(): Promise<void> {
    try {
      const results = await this.scraper.scrapeAll();

      // Notify scrape completion
      if (this.config.onScrapeComplete) {
        await this.config.onScrapeComplete(results);
      }

      // Parse and deduplicate deals
      const allItems = results.flatMap((r) => r.items);
      const parsed = this.parser.parseMany(
        allItems,
        this.config.minConfidence ?? 0.3
      );

      // Filter out already-seen deals
      const newDeals = parsed.filter((deal) => {
        if (!deal.sourceUrl) return true;
        if (this.seenUrls.has(deal.sourceUrl)) return false;
        this.seenUrls.add(deal.sourceUrl);
        return true;
      });

      if (newDeals.length > 0 && this.config.onDeals) {
        await this.config.onDeals(newDeals);
      }
    } catch (err) {
      if (this.config.onError) {
        this.config.onError(
          err instanceof Error ? err : new Error(String(err)),
          "scheduler"
        );
      }
    }
  }

  /** Get the current scraper instance */
  getScraper(): Scraper {
    return this.scraper;
  }

  /** Check if scheduler is running */
  isRunning(): boolean {
    return this.running;
  }

  /** Get count of seen URLs (for dedup stats) */
  seenCount(): number {
    return this.seenUrls.size;
  }
}
