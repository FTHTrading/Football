/**
 * Sport Definitions
 *
 * Canonical sport identifiers, positions, and metadata
 * used across the entire NIL33 platform.
 */

// ---------------------------------------------------------------------------
// Sport enum and metadata
// ---------------------------------------------------------------------------

export type SportId =
  | "football"
  | "basketball"
  | "baseball"
  | "soccer"
  | "softball"
  | "volleyball"
  | "track_field"
  | "swimming"
  | "golf"
  | "tennis"
  | "lacrosse"
  | "hockey"
  | "wrestling"
  | "gymnastics";

export interface SportMeta {
  id: SportId;
  name: string;
  /** Display abbreviation */
  abbr: string;
  /** Whether the sport has gendered divisions */
  gendered: boolean;
  /** Average roster size */
  avgRosterSize: number;
  /** NCAA division levels (I, II, III) */
  divisions: string[];
  /** Key positions for this sport */
  positions: string[];
  /** Season type */
  season: "fall" | "winter" | "spring" | "year-round";
  /** NIL market relative weight (1.0 = football baseline) */
  marketWeight: number;
}

export const SPORTS: Record<SportId, SportMeta> = {
  football: {
    id: "football",
    name: "Football",
    abbr: "FB",
    gendered: false,
    avgRosterSize: 85,
    divisions: ["FBS", "FCS", "DII", "DIII"],
    positions: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"],
    season: "fall",
    marketWeight: 1.0,
  },
  basketball: {
    id: "basketball",
    name: "Basketball",
    abbr: "MBB",
    gendered: true,
    avgRosterSize: 15,
    divisions: ["DI", "DII", "DIII"],
    positions: ["PG", "SG", "SF", "PF", "C"],
    season: "winter",
    marketWeight: 0.85,
  },
  baseball: {
    id: "baseball",
    name: "Baseball",
    abbr: "BSB",
    gendered: false,
    avgRosterSize: 35,
    divisions: ["DI", "DII", "DIII"],
    positions: ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
    season: "spring",
    marketWeight: 0.5,
  },
  soccer: {
    id: "soccer",
    name: "Soccer",
    abbr: "SOC",
    gendered: true,
    avgRosterSize: 30,
    divisions: ["DI", "DII", "DIII"],
    positions: ["GK", "CB", "FB", "CDM", "CM", "CAM", "LW", "RW", "ST"],
    season: "fall",
    marketWeight: 0.45,
  },
  softball: {
    id: "softball",
    name: "Softball",
    abbr: "SB",
    gendered: false,
    avgRosterSize: 20,
    divisions: ["DI", "DII", "DIII"],
    positions: ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"],
    season: "spring",
    marketWeight: 0.4,
  },
  volleyball: {
    id: "volleyball",
    name: "Volleyball",
    abbr: "VB",
    gendered: true,
    avgRosterSize: 15,
    divisions: ["DI", "DII", "DIII"],
    positions: ["S", "OH", "MB", "OPP", "L", "DS"],
    season: "fall",
    marketWeight: 0.45,
  },
  track_field: {
    id: "track_field",
    name: "Track & Field",
    abbr: "TF",
    gendered: true,
    avgRosterSize: 40,
    divisions: ["DI", "DII", "DIII"],
    positions: ["Sprints", "Distance", "Hurdles", "Jumps", "Throws", "Multi"],
    season: "spring",
    marketWeight: 0.35,
  },
  swimming: {
    id: "swimming",
    name: "Swimming & Diving",
    abbr: "SWIM",
    gendered: true,
    avgRosterSize: 30,
    divisions: ["DI", "DII", "DIII"],
    positions: ["Free", "Back", "Breast", "Fly", "IM", "Diving"],
    season: "winter",
    marketWeight: 0.35,
  },
  golf: {
    id: "golf",
    name: "Golf",
    abbr: "GOLF",
    gendered: true,
    avgRosterSize: 10,
    divisions: ["DI", "DII", "DIII"],
    positions: [],
    season: "spring",
    marketWeight: 0.4,
  },
  tennis: {
    id: "tennis",
    name: "Tennis",
    abbr: "TEN",
    gendered: true,
    avgRosterSize: 10,
    divisions: ["DI", "DII", "DIII"],
    positions: ["Singles", "Doubles"],
    season: "spring",
    marketWeight: 0.4,
  },
  lacrosse: {
    id: "lacrosse",
    name: "Lacrosse",
    abbr: "LAX",
    gendered: true,
    avgRosterSize: 30,
    divisions: ["DI", "DII", "DIII"],
    positions: ["A", "M", "D", "G", "FO", "LSM"],
    season: "spring",
    marketWeight: 0.35,
  },
  hockey: {
    id: "hockey",
    name: "Ice Hockey",
    abbr: "HKY",
    gendered: true,
    avgRosterSize: 25,
    divisions: ["DI", "DIII"],
    positions: ["C", "LW", "RW", "D", "G"],
    season: "winter",
    marketWeight: 0.45,
  },
  wrestling: {
    id: "wrestling",
    name: "Wrestling",
    abbr: "WR",
    gendered: false,
    avgRosterSize: 25,
    divisions: ["DI", "DII", "DIII"],
    positions: ["125", "133", "141", "149", "157", "165", "174", "184", "197", "285"],
    season: "winter",
    marketWeight: 0.3,
  },
  gymnastics: {
    id: "gymnastics",
    name: "Gymnastics",
    abbr: "GYM",
    gendered: true,
    avgRosterSize: 16,
    divisions: ["DI"],
    positions: ["Vault", "Bars", "Beam", "Floor", "All-Around"],
    season: "winter",
    marketWeight: 0.55,
  },
};

// ---------------------------------------------------------------------------
// Conferences
// ---------------------------------------------------------------------------

export type ConferenceId =
  | "SEC"
  | "Big Ten"
  | "Big 12"
  | "ACC"
  | "Pac-12"
  | "AAC"
  | "Mountain West"
  | "Sun Belt"
  | "Conference USA"
  | "MAC"
  | "Missouri Valley"
  | "Ivy"
  | "Big East"
  | "WCC"
  | "A-10"
  | "Independent";

export interface Conference {
  id: ConferenceId;
  name: string;
  /** Power conference flag */
  power: boolean;
  /** Approximate NIL market multiplier */
  marketMultiplier: number;
}

export const CONFERENCES: Conference[] = [
  { id: "SEC", name: "Southeastern Conference", power: true, marketMultiplier: 1.3 },
  { id: "Big Ten", name: "Big Ten Conference", power: true, marketMultiplier: 1.25 },
  { id: "Big 12", name: "Big 12 Conference", power: true, marketMultiplier: 1.15 },
  { id: "ACC", name: "Atlantic Coast Conference", power: true, marketMultiplier: 1.15 },
  { id: "Pac-12", name: "Pac-12 Conference", power: false, marketMultiplier: 1.1 },
  { id: "AAC", name: "American Athletic Conference", power: false, marketMultiplier: 0.85 },
  { id: "Mountain West", name: "Mountain West Conference", power: false, marketMultiplier: 0.8 },
  { id: "Sun Belt", name: "Sun Belt Conference", power: false, marketMultiplier: 0.75 },
  { id: "Conference USA", name: "Conference USA", power: false, marketMultiplier: 0.7 },
  { id: "MAC", name: "Mid-American Conference", power: false, marketMultiplier: 0.7 },
  { id: "Missouri Valley", name: "Missouri Valley Conference", power: false, marketMultiplier: 0.65 },
  { id: "Ivy", name: "Ivy League", power: false, marketMultiplier: 0.6 },
  { id: "Big East", name: "Big East Conference", power: false, marketMultiplier: 0.95 },
  { id: "WCC", name: "West Coast Conference", power: false, marketMultiplier: 0.75 },
  { id: "A-10", name: "Atlantic 10 Conference", power: false, marketMultiplier: 0.7 },
  { id: "Independent", name: "Independent", power: false, marketMultiplier: 0.8 },
];
