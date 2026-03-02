/**
 * @nil33/scraping — NIL Deal & Athlete Data Scraping Pipeline
 *
 * Collects NIL deal data, athlete profiles, and market intelligence
 * from public sources across the collegiate athletics landscape.
 */

export { Scraper, type ScraperConfig, type ScrapeResult } from "./scraper";
export { DealParser, type ParsedDeal } from "./parsers";
export { ScrapingScheduler, type ScheduleConfig } from "./scheduler";
export {
  SOURCE_CONFIGS,
  type SourceConfig,
  type SourceType,
} from "./sources";
