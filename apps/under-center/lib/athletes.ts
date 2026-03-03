export interface AthleteMetrics {
  armStrength: number;        // 1-99
  releaseTime: number;        // seconds (e.g. 0.38)
  accuracy: number;           // percentage
  decisionSpeed: number;      // milliseconds
  pocketPresence: number;     // 1-99
  athleticism: number;        // 1-99
  filmGrade: number;          // 1-99
  mechanicsGrade: number;     // 1-99
}

export interface NFLComparison {
  name: string;
  similarity: number;         // percentage
  trait: string;
}

export interface Offer {
  school: string;
  conference: string;
  status: "committed" | "offered" | "interested";
}

export interface FilmClip {
  title: string;
  date: string;
  plays: number;
}

export interface Athlete {
  id: string;
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  class: string;                // e.g. "2026"
  highSchool: string;
  city: string;
  state: string;
  height: string;
  weight: number;
  gpa: number;
  starRating: number;           // 1-5
  verified: boolean;
  verifiedDate: string;
  avatarInitials: string;
  accentColor: string;
  metrics: AthleteMetrics;
  nflComparisons: NFLComparison[];
  recruitingStatus: string;
  offers: Offer[];
  filmClips: FilmClip[];
  seasonStats: {
    games: number;
    completions: number;
    attempts: number;
    yards: number;
    touchdowns: number;
    interceptions: number;
    qbr: number;
  };
}

export const athletes: Athlete[] = [
  {
    id: "1",
    slug: "jaylen-carter",
    name: "Jaylen Carter",
    firstName: "Jaylen",
    lastName: "Carter",
    position: "QB",
    class: "2026",
    highSchool: "Bishop Gorman",
    city: "Las Vegas",
    state: "NV",
    height: "6'3\"",
    weight: 205,
    gpa: 3.8,
    starRating: 5,
    verified: true,
    verifiedDate: "2026-01-15",
    avatarInitials: "JC",
    accentColor: "#22c55e",
    metrics: {
      armStrength: 94,
      releaseTime: 0.36,
      accuracy: 71,
      decisionSpeed: 185,
      pocketPresence: 88,
      athleticism: 91,
      filmGrade: 93,
      mechanicsGrade: 90,
    },
    nflComparisons: [
      { name: "Patrick Mahomes", similarity: 82, trait: "Arm talent + improvisation" },
      { name: "Justin Herbert", similarity: 78, trait: "Release mechanics" },
      { name: "Josh Allen", similarity: 71, trait: "Power + athleticism" },
    ],
    recruitingStatus: "Committed",
    offers: [
      { school: "Ohio State", conference: "Big Ten", status: "committed" },
      { school: "Alabama", conference: "SEC", status: "offered" },
      { school: "Georgia", conference: "SEC", status: "offered" },
      { school: "USC", conference: "Big Ten", status: "offered" },
      { school: "Oregon", conference: "Big Ten", status: "offered" },
    ],
    filmClips: [
      { title: "State Championship Highlights", date: "2025-12-14", plays: 12 },
      { title: "vs. Mater Dei", date: "2025-10-18", plays: 8 },
      { title: "Summer 7v7 Tournament", date: "2025-07-22", plays: 15 },
    ],
    seasonStats: {
      games: 13,
      completions: 241,
      attempts: 338,
      yards: 3847,
      touchdowns: 42,
      interceptions: 4,
      qbr: 92.1,
    },
  },
  {
    id: "2",
    slug: "marcus-williams",
    name: "Marcus Williams",
    firstName: "Marcus",
    lastName: "Williams",
    position: "QB",
    class: "2026",
    highSchool: "St. Thomas Aquinas",
    city: "Fort Lauderdale",
    state: "FL",
    height: "6'1\"",
    weight: 195,
    gpa: 3.5,
    starRating: 4,
    verified: true,
    verifiedDate: "2026-02-01",
    avatarInitials: "MW",
    accentColor: "#3b82f6",
    metrics: {
      armStrength: 85,
      releaseTime: 0.34,
      accuracy: 74,
      decisionSpeed: 168,
      pocketPresence: 82,
      athleticism: 79,
      filmGrade: 86,
      mechanicsGrade: 92,
    },
    nflComparisons: [
      { name: "Joe Burrow", similarity: 85, trait: "Pocket precision + poise" },
      { name: "Brock Purdy", similarity: 76, trait: "Efficiency + decision-making" },
      { name: "Jalen Hurts", similarity: 68, trait: "Dual-threat ability" },
    ],
    recruitingStatus: "Open",
    offers: [
      { school: "Miami", conference: "ACC", status: "offered" },
      { school: "Florida State", conference: "ACC", status: "offered" },
      { school: "LSU", conference: "SEC", status: "interested" },
      { school: "Clemson", conference: "ACC", status: "offered" },
    ],
    filmClips: [
      { title: "Junior Season Highlights", date: "2025-11-28", plays: 18 },
      { title: "vs. IMG Academy", date: "2025-09-12", plays: 10 },
    ],
    seasonStats: {
      games: 11,
      completions: 198,
      attempts: 275,
      yards: 2956,
      touchdowns: 31,
      interceptions: 6,
      qbr: 87.4,
    },
  },
  {
    id: "3",
    slug: "drew-nakamura",
    name: "Drew Nakamura",
    firstName: "Drew",
    lastName: "Nakamura",
    position: "QB",
    class: "2027",
    highSchool: "De La Salle",
    city: "Concord",
    state: "CA",
    height: "6'2\"",
    weight: 190,
    gpa: 4.1,
    starRating: 4,
    verified: true,
    verifiedDate: "2026-02-10",
    avatarInitials: "DN",
    accentColor: "#a855f7",
    metrics: {
      armStrength: 78,
      releaseTime: 0.33,
      accuracy: 76,
      decisionSpeed: 155,
      pocketPresence: 85,
      athleticism: 74,
      filmGrade: 88,
      mechanicsGrade: 95,
    },
    nflComparisons: [
      { name: "Drew Brees", similarity: 79, trait: "Accuracy + football IQ" },
      { name: "Kirk Cousins", similarity: 74, trait: "Mechanics + consistency" },
      { name: "Dak Prescott", similarity: 66, trait: "Pocket presence" },
    ],
    recruitingStatus: "Open",
    offers: [
      { school: "Stanford", conference: "ACC", status: "offered" },
      { school: "Cal", conference: "Big Ten", status: "offered" },
      { school: "UCLA", conference: "Big Ten", status: "interested" },
    ],
    filmClips: [
      { title: "Sophomore Highlights", date: "2025-11-15", plays: 14 },
      { title: "NorCal Championship", date: "2025-12-06", plays: 9 },
      { title: "Elite 11 Regional", date: "2025-06-18", plays: 11 },
    ],
    seasonStats: {
      games: 12,
      completions: 215,
      attempts: 290,
      yards: 3210,
      touchdowns: 34,
      interceptions: 5,
      qbr: 89.7,
    },
  },
  /* ── 4 ── */
  {
    id: "4",
    slug: "trevon-mitchell",
    name: "Tre'von Mitchell",
    firstName: "Tre'von",
    lastName: "Mitchell",
    position: "QB",
    class: "2026",
    highSchool: "IMG Academy",
    city: "Bradenton",
    state: "FL",
    height: "6'4\"",
    weight: 218,
    gpa: 3.4,
    starRating: 5,
    verified: true,
    verifiedDate: "2026-01-20",
    avatarInitials: "TM",
    accentColor: "#ef4444",
    metrics: {
      armStrength: 97,
      releaseTime: 0.40,
      accuracy: 65,
      decisionSpeed: 210,
      pocketPresence: 76,
      athleticism: 96,
      filmGrade: 89,
      mechanicsGrade: 78,
    },
    nflComparisons: [
      { name: "Cam Newton", similarity: 88, trait: "Size + power + rushing" },
      { name: "Josh Allen", similarity: 84, trait: "Cannon arm + athleticism" },
      { name: "Lamar Jackson", similarity: 72, trait: "Explosive dual-threat" },
    ],
    recruitingStatus: "Committed",
    offers: [
      { school: "Alabama", conference: "SEC", status: "committed" },
      { school: "Georgia", conference: "SEC", status: "offered" },
      { school: "Texas", conference: "SEC", status: "offered" },
      { school: "Ohio State", conference: "Big Ten", status: "offered" },
      { school: "Michigan", conference: "Big Ten", status: "offered" },
      { school: "USC", conference: "Big Ten", status: "offered" },
    ],
    filmClips: [
      { title: "IMG Academy Full Season", date: "2025-11-22", plays: 22 },
      { title: "Under Armour All-American", date: "2026-01-04", plays: 14 },
      { title: "vs. Grayson HS", date: "2025-09-08", plays: 10 },
    ],
    seasonStats: {
      games: 12,
      completions: 186,
      attempts: 298,
      yards: 3124,
      touchdowns: 36,
      interceptions: 9,
      qbr: 83.6,
    },
  },

  /* ── 5 ── */
  {
    id: "5",
    slug: "cole-brennan",
    name: "Cole Brennan",
    firstName: "Cole",
    lastName: "Brennan",
    position: "QB",
    class: "2026",
    highSchool: "Southlake Carroll",
    city: "Southlake",
    state: "TX",
    height: "6'2\"",
    weight: 198,
    gpa: 3.9,
    starRating: 4,
    verified: true,
    verifiedDate: "2026-01-28",
    avatarInitials: "CB",
    accentColor: "#f59e0b",
    metrics: {
      armStrength: 82,
      releaseTime: 0.32,
      accuracy: 79,
      decisionSpeed: 148,
      pocketPresence: 91,
      athleticism: 72,
      filmGrade: 90,
      mechanicsGrade: 94,
    },
    nflComparisons: [
      { name: "Joe Burrow", similarity: 86, trait: "Pocket command + accuracy" },
      { name: "Matthew Stafford", similarity: 78, trait: "Touch + anticipation" },
      { name: "Trevor Lawrence", similarity: 70, trait: "Processing speed" },
    ],
    recruitingStatus: "Open",
    offers: [
      { school: "Texas", conference: "SEC", status: "offered" },
      { school: "Texas A&M", conference: "SEC", status: "offered" },
      { school: "Oklahoma", conference: "SEC", status: "offered" },
      { school: "Notre Dame", conference: "Independent", status: "interested" },
    ],
    filmClips: [
      { title: "Texas 6A State Semis", date: "2025-12-07", plays: 16 },
      { title: "vs. Allen HS", date: "2025-10-25", plays: 11 },
      { title: "Elite 11 Finals", date: "2025-07-01", plays: 13 },
    ],
    seasonStats: {
      games: 14,
      completions: 268,
      attempts: 352,
      yards: 4102,
      touchdowns: 44,
      interceptions: 5,
      qbr: 93.8,
    },
  },

  /* ── 6 ── */
  {
    id: "6",
    slug: "isaiah-washington",
    name: "Isaiah Washington",
    firstName: "Isaiah",
    lastName: "Washington",
    position: "QB",
    class: "2027",
    highSchool: "Buford",
    city: "Buford",
    state: "GA",
    height: "6'3\"",
    weight: 200,
    gpa: 3.6,
    starRating: 4,
    verified: true,
    verifiedDate: "2026-02-15",
    avatarInitials: "IW",
    accentColor: "#06b6d4",
    metrics: {
      armStrength: 88,
      releaseTime: 0.37,
      accuracy: 68,
      decisionSpeed: 195,
      pocketPresence: 78,
      athleticism: 90,
      filmGrade: 82,
      mechanicsGrade: 80,
    },
    nflComparisons: [
      { name: "Jayden Daniels", similarity: 80, trait: "Running ability + arm" },
      { name: "Jalen Hurts", similarity: 76, trait: "Dual-threat evolution" },
      { name: "Kyler Murray", similarity: 69, trait: "Elusiveness + playmaking" },
    ],
    recruitingStatus: "Open",
    offers: [
      { school: "Georgia", conference: "SEC", status: "interested" },
      { school: "Auburn", conference: "SEC", status: "offered" },
      { school: "Tennessee", conference: "SEC", status: "interested" },
    ],
    filmClips: [
      { title: "Sophomore Highlights", date: "2025-11-20", plays: 16 },
      { title: "Georgia 7A Playoffs", date: "2025-11-28", plays: 9 },
    ],
    seasonStats: {
      games: 11,
      completions: 172,
      attempts: 258,
      yards: 2640,
      touchdowns: 28,
      interceptions: 8,
      qbr: 81.2,
    },
  },

  /* ── 7 ── */
  {
    id: "7",
    slug: "kai-lautenberg",
    name: "Kai Lautenberg",
    firstName: "Kai",
    lastName: "Lautenberg",
    position: "QB",
    class: "2026",
    highSchool: "Kahuku",
    city: "Kahuku",
    state: "HI",
    height: "5'11\"",
    weight: 182,
    gpa: 3.7,
    starRating: 3,
    verified: true,
    verifiedDate: "2026-02-05",
    avatarInitials: "KL",
    accentColor: "#14b8a6",
    metrics: {
      armStrength: 74,
      releaseTime: 0.31,
      accuracy: 77,
      decisionSpeed: 142,
      pocketPresence: 86,
      athleticism: 83,
      filmGrade: 79,
      mechanicsGrade: 88,
    },
    nflComparisons: [
      { name: "Russell Wilson", similarity: 81, trait: "Undersized playmaker" },
      { name: "Baker Mayfield", similarity: 75, trait: "Competitiveness + accuracy" },
      { name: "Tua Tagovailoa", similarity: 73, trait: "Quick release + poise" },
    ],
    recruitingStatus: "Open",
    offers: [
      { school: "Hawaii", conference: "MWC", status: "offered" },
      { school: "Oregon State", conference: "Big Ten", status: "interested" },
      { school: "Boise State", conference: "MWC", status: "offered" },
    ],
    filmClips: [
      { title: "OIA Championship", date: "2025-11-08", plays: 12 },
      { title: "vs. Saint Louis HS", date: "2025-10-11", plays: 8 },
    ],
    seasonStats: {
      games: 10,
      completions: 156,
      attempts: 210,
      yards: 2380,
      touchdowns: 24,
      interceptions: 3,
      qbr: 90.5,
    },
  },

  /* ── 8 ── */
  {
    id: "8",
    slug: "ryan-petersen",
    name: "Ryan Petersen",
    firstName: "Ryan",
    lastName: "Petersen",
    position: "QB",
    class: "2026",
    highSchool: "St. John Bosco",
    city: "Bellflower",
    state: "CA",
    height: "6'5\"",
    weight: 225,
    gpa: 3.3,
    starRating: 4,
    verified: true,
    verifiedDate: "2026-01-10",
    avatarInitials: "RP",
    accentColor: "#8b5cf6",
    metrics: {
      armStrength: 92,
      releaseTime: 0.39,
      accuracy: 70,
      decisionSpeed: 178,
      pocketPresence: 84,
      athleticism: 77,
      filmGrade: 85,
      mechanicsGrade: 86,
    },
    nflComparisons: [
      { name: "Justin Herbert", similarity: 83, trait: "Prototypical size + arm" },
      { name: "Andrew Luck", similarity: 76, trait: "Cerebral + big frame" },
      { name: "Carson Palmer", similarity: 68, trait: "Pocket poise + velocity" },
    ],
    recruitingStatus: "Open",
    offers: [
      { school: "USC", conference: "Big Ten", status: "offered" },
      { school: "Oregon", conference: "Big Ten", status: "offered" },
      { school: "Michigan", conference: "Big Ten", status: "interested" },
      { school: "Penn State", conference: "Big Ten", status: "offered" },
      { school: "Washington", conference: "Big Ten", status: "offered" },
    ],
    filmClips: [
      { title: "Trinity League Highlights", date: "2025-11-14", plays: 19 },
      { title: "CIF-SS Championship", date: "2025-12-10", plays: 13 },
      { title: "Opening Day Showcase", date: "2025-08-28", plays: 11 },
    ],
    seasonStats: {
      games: 13,
      completions: 224,
      attempts: 330,
      yards: 3560,
      touchdowns: 38,
      interceptions: 7,
      qbr: 86.3,
    },
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  DNA COMPOSITE SCORE                                          */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const DNA_WEIGHTS = {
  armStrength: 0.15,
  releaseTime: 0.10,
  accuracy: 0.18,
  decisionSpeed: 0.12,
  pocketPresence: 0.13,
  athleticism: 0.10,
  filmGrade: 0.12,
  mechanicsGrade: 0.10,
};

/**
 * Normalize each metric to a 0-100 scale,
 * then compute a weighted composite DNA score.
 */
export function computeDnaScore(metrics: AthleteMetrics): number {
  const normalized = {
    armStrength: metrics.armStrength,                            // already 1-99
    releaseTime: Math.max(0, Math.min(100, (0.50 - metrics.releaseTime) / 0.20 * 100)),  // 0.30 → 100, 0.50 → 0
    accuracy: metrics.accuracy,                                  // already percentage
    decisionSpeed: Math.max(0, Math.min(100, (300 - metrics.decisionSpeed) / 200 * 100)), // 100ms → 100, 300ms → 0
    pocketPresence: metrics.pocketPresence,                      // already 1-99
    athleticism: metrics.athleticism,                             // already 1-99
    filmGrade: metrics.filmGrade,                                // already 1-99
    mechanicsGrade: metrics.mechanicsGrade,                      // already 1-99
  };

  let score = 0;
  for (const [key, weight] of Object.entries(DNA_WEIGHTS)) {
    score += normalized[key as keyof typeof normalized] * weight;
  }

  return Math.round(score * 10) / 10;
}

/** Letter grade from DNA score */
export function dnaGrade(score: number): string {
  if (score >= 92) return "ELITE";
  if (score >= 85) return "A+";
  if (score >= 80) return "A";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "C+";
  return "C";
}

/** Color for DNA grade */
export function dnaGradeColor(score: number): string {
  if (score >= 92) return "#22c55e";
  if (score >= 85) return "#4ade80";
  if (score >= 80) return "#d4a843";
  if (score >= 75) return "#f59e0b";
  if (score >= 70) return "#3b82f6";
  if (score >= 65) return "#8b5cf6";
  return "#6b7280";
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  RADAR CHART DATA                                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface RadarPoint {
  label: string;
  value: number;   // 0-100 normalized
  raw: number;
}

/** Get normalized radar data for an athlete (all on 0-100 scale) */
export function getRadarData(metrics: AthleteMetrics): RadarPoint[] {
  return [
    { label: "ARM", value: metrics.armStrength, raw: metrics.armStrength },
    { label: "REL", value: Math.round((0.50 - metrics.releaseTime) / 0.20 * 100), raw: metrics.releaseTime },
    { label: "ACC", value: metrics.accuracy, raw: metrics.accuracy },
    { label: "DEC", value: Math.round((300 - metrics.decisionSpeed) / 200 * 100), raw: metrics.decisionSpeed },
    { label: "PKT", value: metrics.pocketPresence, raw: metrics.pocketPresence },
    { label: "ATH", value: metrics.athleticism, raw: metrics.athleticism },
    { label: "FLM", value: metrics.filmGrade, raw: metrics.filmGrade },
    { label: "MECH", value: metrics.mechanicsGrade, raw: metrics.mechanicsGrade },
  ];
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  HELPERS                                                      */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function getAthleteBySlug(slug: string): Athlete | undefined {
  return athletes.find((a) => a.slug === slug);
}

export function getAthleteById(id: string): Athlete | undefined {
  return athletes.find((a) => a.id === id);
}

export function getAthletesSorted(
  sortBy: "dnaScore" | "starRating" | "name" | "yards" | "touchdowns" | "qbr" = "dnaScore",
  direction: "asc" | "desc" = "desc"
): Athlete[] {
  const sorted = [...athletes].sort((a, b) => {
    let diff = 0;
    switch (sortBy) {
      case "dnaScore":
        diff = computeDnaScore(a.metrics) - computeDnaScore(b.metrics);
        break;
      case "starRating":
        diff = a.starRating - b.starRating;
        break;
      case "name":
        diff = a.lastName.localeCompare(b.lastName);
        break;
      case "yards":
        diff = a.seasonStats.yards - b.seasonStats.yards;
        break;
      case "touchdowns":
        diff = a.seasonStats.touchdowns - b.seasonStats.touchdowns;
        break;
      case "qbr":
        diff = a.seasonStats.qbr - b.seasonStats.qbr;
        break;
    }
    return direction === "desc" ? -diff : diff;
  });
  return sorted;
}
