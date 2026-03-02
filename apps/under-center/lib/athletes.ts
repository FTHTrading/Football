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
];

export function getAthleteBySlug(slug: string): Athlete | undefined {
  return athletes.find((a) => a.slug === slug);
}

export function getAthleteById(id: string): Athlete | undefined {
  return athletes.find((a) => a.id === id);
}
