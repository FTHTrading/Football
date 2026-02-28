"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

// ─── PostHog Analytics Provider ────────────────────────
// Wraps the app to enable event tracking.
// Only initializes when NEXT_PUBLIC_POSTHOG_KEY is set.

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (key) {
      posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") {
            ph.debug();
          }
        },
      });
    }
  }, []);

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!key) {
    // No PostHog key — render children without provider
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// ─── Custom Event Tracking ─────────────────────────────
// Call these from any client component to track key events.

export const track = {
  /** Athlete profile viewed */
  profileView: (athleteId: string, source?: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("profile_viewed", { athleteId, source });
    }
  },

  /** Card downloaded */
  cardDownload: (athleteId: string, theme: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("card_downloaded", { athleteId, theme });
    }
  },

  /** Verification flow started */
  verificationStarted: (athleteId: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("verification_started", { athleteId });
    }
  },

  /** Search performed */
  searchPerformed: (filters: Record<string, unknown>) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("search_performed", filters);
    }
  },

  /** Coach filter used */
  filterUsed: (filterName: string, value: unknown) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("filter_used", { filterName, value });
    }
  },

  /** CTA clicked */
  ctaClicked: (ctaName: string, location: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("cta_clicked", { ctaName, location });
    }
  },

  /** Film play */
  filmPlayed: (athleteId: string, filmTitle: string) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("film_played", { athleteId, filmTitle });
    }
  },
};
