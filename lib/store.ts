import { create } from "zustand";

/* ── Types ─────────────────────────── */
export interface AthleteMetrics {
  velocity: number;
  releaseTime: number;
  spinRate: number;
  mechanics: number;
  accuracy: number;
  decisionSpeed: number;
}

export interface Athlete {
  id: string;
  name: string;
  gradYear: number;
  position: string;
  height: string;
  weight: number;
  state: string;
  school: string;
  photoUrl: string;
  verified: boolean;
  rating: number;
  qbClass: string;
  metrics: AthleteMetrics;
  offers: string[];
  filmUrl?: string;
  comparisonPlayer?: string;
}

export interface SearchFilters {
  velocityMin: number;
  velocityMax: number;
  gradYear: number | null;
  verifiedOnly: boolean;
  state: string;
  mechanicsMin: number;
}

/* ── Store ─────────────────────────── */
interface AppState {
  athletes: Athlete[];
  selectedAthlete: Athlete | null;
  filters: SearchFilters;
  cardTheme: "dark" | "holographic";
  setAthletes: (athletes: Athlete[]) => void;
  setSelectedAthlete: (athlete: Athlete | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setCardTheme: (theme: "dark" | "holographic") => void;
}

export const useAppStore = create<AppState>((set) => ({
  athletes: [],
  selectedAthlete: null,
  filters: {
    velocityMin: 0,
    velocityMax: 80,
    gradYear: null,
    verifiedOnly: false,
    state: "",
    mechanicsMin: 0,
  },
  cardTheme: "dark",

  setAthletes: (athletes) => set({ athletes }),

  setSelectedAthlete: (athlete) => set({ selectedAthlete: athlete }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setCardTheme: (theme) => set({ cardTheme: theme }),
}));
