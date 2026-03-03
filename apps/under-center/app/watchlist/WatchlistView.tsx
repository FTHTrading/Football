"use client";

import {
  athletes,
  computeDnaScore,
  dnaGrade,
  dnaGradeColor,
  getRadarData,
} from "@/lib/athletes";
import type { Athlete } from "@/lib/athletes";
import RadarChart from "@/components/RadarChart";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "uc_watchlist";

/* ─── Persistence helpers ─── */
function loadWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* quota exceeded — silently fail */
  }
}

/* ─── Watchlist Hook (exportable for other components) ─── */
export function useWatchlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(loadWatchlist());
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      setSlugs((prev) => {
        const next = prev.includes(slug)
          ? prev.filter((s) => s !== slug)
          : [...prev, slug];
        saveWatchlist(next);
        return next;
      });
    },
    []
  );

  const isWatched = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  return { slugs, toggle, isWatched, count: slugs.length };
}

/* ─── Watchlist Row ─── */
function WatchlistRow({
  athlete,
  rank,
  onRemove,
}: {
  athlete: Athlete;
  rank: number;
  onRemove: () => void;
}) {
  const score = computeDnaScore(athlete.metrics);
  const grade = dnaGrade(score);
  const gradeColor = dnaGradeColor(score);
  const radarData = getRadarData(athlete.metrics);
  const [showRadar, setShowRadar] = useState(false);

  return (
    <div className="group bg-uc-dark border border-uc-border rounded-2xl overflow-hidden hover:border-uc-gold/15 transition-all">
      <div className="flex items-center gap-4 p-4">
        {/* Rank */}
        <div className="w-8 h-8 rounded-lg bg-uc-panel border border-uc-border flex items-center justify-center shrink-0">
          <span className="text-xs font-mono font-bold text-uc-muted">
            {rank}
          </span>
        </div>

        {/* Color accent */}
        <div
          className="w-1 h-10 rounded-full shrink-0"
          style={{ background: athlete.accentColor }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/athlete/${athlete.slug}`}
            className="text-sm font-semibold text-uc-white hover:text-uc-gold transition-colors"
          >
            {athlete.name}
          </Link>
          <p className="text-[11px] text-uc-muted truncate">
            {athlete.highSchool} · {athlete.state} · Class of {athlete.class}
          </p>
        </div>

        {/* Stars */}
        <div className="hidden sm:block">
          <Stars count={athlete.starRating} size="sm" />
        </div>

        {/* DNA Score */}
        <div className="text-right shrink-0">
          <div
            className="text-lg font-mono font-black"
            style={{ color: gradeColor }}
          >
            {score}
          </div>
          <div className="text-[9px] text-uc-muted uppercase tracking-wider">
            {grade}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowRadar(!showRadar)}
            className="p-2 rounded-lg hover:bg-uc-panel transition-colors cursor-pointer"
            title="Toggle radar"
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                showRadar ? "text-uc-gold" : "text-uc-muted"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
              />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer group/remove"
            title="Remove from watchlist"
          >
            <svg
              className="w-4 h-4 text-uc-muted group-hover/remove:text-red-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable radar */}
      {showRadar && (
        <div className="border-t border-uc-border bg-uc-panel/50 p-6 flex flex-col items-center">
          <RadarChart data={radarData} size={200} color={athlete.accentColor} />
          <div className="mt-3 flex items-center gap-3">
            <Link
              href={`/athlete/${athlete.slug}`}
              className="text-xs text-uc-gold hover:text-uc-white transition-colors"
            >
              Full Profile →
            </Link>
            <Link
              href={`/card/${athlete.slug}`}
              className="text-xs text-uc-muted hover:text-uc-white transition-colors"
            >
              View Card
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  WATCHLIST VIEW                                               */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function WatchlistView() {
  const { slugs, toggle, count } = useWatchlist();

  const watched = useMemo(() => {
    return slugs
      .map((slug) => athletes.find((a) => a.slug === slug))
      .filter(Boolean) as Athlete[];
  }, [slugs]);

  /* Sort by DNA score within the watchlist */
  const sorted = useMemo(() => {
    return [...watched]
      .map((a) => ({ athlete: a, score: computeDnaScore(a.metrics) }))
      .sort((a, b) => b.score - a.score);
  }, [watched]);

  /* Aggregate stats */
  const avgScore =
    sorted.length > 0
      ? Math.round(
          sorted.reduce((sum, r) => sum + r.score, 0) / sorted.length
        )
      : 0;

  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-uc-gold text-xs uppercase tracking-widest font-semibold mb-3">
              Your Board
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-uc-white mb-3">
              Watchlist
            </h1>
            <p className="text-uc-muted text-sm max-w-xl">
              Track the quarterbacks on your radar. Add prospects from any
              profile page and monitor their DNA scores here.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      {count > 0 && (
        <section className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-6 bg-uc-dark border border-uc-border rounded-xl px-6 py-4">
                <div>
                  <div className="text-2xl font-mono font-black text-uc-gold">
                    {count}
                  </div>
                  <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                    Prospects
                  </div>
                </div>
                <div className="w-px h-8 bg-uc-border" />
                <div>
                  <div className="text-2xl font-mono font-black text-uc-white">
                    {avgScore}
                  </div>
                  <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                    Avg DNA
                  </div>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => {
                      slugs.forEach((s) => toggle(s));
                    }}
                    className="text-[11px] text-uc-muted hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── List ─── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {count === 0 ? (
            <Reveal>
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-uc-dark border border-uc-border flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-7 h-7 text-uc-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-uc-white mb-2">
                  No prospects yet
                </h3>
                <p className="text-sm text-uc-muted mb-6 max-w-sm mx-auto">
                  Visit any athlete profile and tap the star icon to add them to
                  your watchlist.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/board"
                    className="text-sm bg-uc-gold/10 text-uc-gold border border-uc-gold/20 px-5 py-2.5 rounded-xl hover:bg-uc-gold/20 transition-colors"
                  >
                    Browse Board
                  </Link>
                  <Link
                    href="/rankings"
                    className="text-sm text-uc-muted border border-uc-border px-5 py-2.5 rounded-xl hover:border-uc-gold/20 hover:text-uc-white transition-colors"
                  >
                    View Rankings
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="space-y-3">
              {sorted.map((r, i) => (
                <Reveal key={r.athlete.id} delay={i * 0.05}>
                  <WatchlistRow
                    athlete={r.athlete}
                    rank={i + 1}
                    onRemove={() => toggle(r.athlete.slug)}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
