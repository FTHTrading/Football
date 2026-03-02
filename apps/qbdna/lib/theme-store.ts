import { create } from "zustand";

export type ThemeId = "neon" | "midnight" | "slate" | "ivory" | "ember";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  description: string;
  accent: string;       // preview swatch color
  accentAlt: string;    // secondary preview color
}

export const THEMES: ThemeMeta[] = [
  {
    id: "neon",
    label: "Neon DNA",
    description: "Original electric — cyan, green, purple glow",
    accent: "#00C2FF",
    accentAlt: "#00FF88",
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep navy with soft blue accents — less neon, more pro",
    accent: "#5B8DEF",
    accentAlt: "#8BB4FF",
  },
  {
    id: "slate",
    label: "Slate",
    description: "Cool gray minimalism — muted tones, clean editorial feel",
    accent: "#94A3B8",
    accentAlt: "#CBD5E1",
  },
  {
    id: "ivory",
    label: "Ivory",
    description: "Light mode — cream backgrounds, dark text, warm gold accents",
    accent: "#B8860B",
    accentAlt: "#D4A843",
  },
  {
    id: "ember",
    label: "Ember",
    description: "Dark with warm orange-red accents — bold, athletic energy",
    accent: "#F97316",
    accentAlt: "#EF4444",
  },
];

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "neon",
  setTheme: (theme) => {
    set({ theme });
    // Apply data-theme attribute to html element for CSS overrides
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  },
}));
