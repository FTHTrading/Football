"use client";

import type { Athlete } from "@/lib/athletes";
import { computeDnaScore, dnaGrade, dnaGradeColor, getRadarData } from "@/lib/athletes";
import Stars from "@/components/Stars";
import Link from "next/link";

/* ─── Mini Metric Row ─── */
function CardMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-uc-border/50 last:border-0">
      <span className="text-[11px] uppercase tracking-wider text-uc-muted">
        {label}
      </span>
      <span className="text-sm font-mono font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  VERIFIED CARD — Shareable Instagram-Format                    */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function VerifiedCard({ athlete }: { athlete: Athlete }) {
  const score = computeDnaScore(athlete.metrics);
  const grade = dnaGrade(score);
  const gradeColor = dnaGradeColor(score);
  const radarData = getRadarData(athlete.metrics);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-uc-black">
      {/* Back nav */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <Link
          href={`/athlete/${athlete.slug}`}
          className="text-xs text-uc-muted hover:text-uc-white transition-colors"
        >
          ← Full Profile
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-5 h-5 rounded bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
            <span className="text-uc-gold font-bold text-[8px]">UC</span>
          </div>
          <span className="text-uc-white font-medium text-xs">
            Under Center
          </span>
        </Link>
      </div>

      {/* ─── THE CARD ─── */}
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden relative"
        style={{
          background: `linear-gradient(180deg, ${athlete.accentColor}08 0%, #0a0a0a 30%, #0a0a0a 70%, ${athlete.accentColor}05 100%)`,
          border: `1px solid ${athlete.accentColor}20`,
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${athlete.accentColor}, transparent)`,
          }}
        />

        {/* Card Content */}
        <div className="p-7">
          {/* — Header — */}
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{
                background: `${athlete.accentColor}12`,
                border: `2px solid ${athlete.accentColor}35`,
              }}
            >
              {athlete.avatarInitials}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-uc-white leading-tight">
                  {athlete.name}
                </h2>
              </div>
              <p className="text-uc-muted text-sm">
                {athlete.position} · Class of {athlete.class}
              </p>
              <p className="text-uc-muted text-xs mt-0.5">
                {athlete.highSchool}
              </p>
            </div>
          </div>

          {/* — Verified + Stars — */}
          <div className="flex items-center justify-between mb-5">
            <Stars count={athlete.starRating} />
            <div className="flex items-center gap-1.5 bg-uc-gold/10 border border-uc-gold/30 rounded-full px-3 py-1 animate-verified">
              <span className="w-2 h-2 rounded-full bg-uc-gold" />
              <span className="text-uc-gold text-[11px] font-semibold uppercase tracking-wider">
                Verified
              </span>
            </div>
          </div>

          {/* — DNA Score Badge — */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{
              background: `linear-gradient(135deg, ${gradeColor}08, ${athlete.accentColor}05)`,
              border: `1px solid ${gradeColor}25`,
            }}
          >
            <div className="flex items-center gap-4">
              {/* Mini Radar */}
              <div className="shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  {/* Grid rings */}
                  {[0.33, 0.66, 1].map((r) => (
                    <polygon
                      key={r}
                      points={radarData
                        .map((_, i) => {
                          const angle = (Math.PI * 2 * i) / radarData.length - Math.PI / 2;
                          const radius = 30 * r;
                          return `${36 + radius * Math.cos(angle)},${36 + radius * Math.sin(angle)}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Data polygon */}
                  <polygon
                    points={radarData
                      .map((p, i) => {
                        const angle = (Math.PI * 2 * i) / radarData.length - Math.PI / 2;
                        const radius = (p.value / 100) * 30;
                        return `${36 + radius * Math.cos(angle)},${36 + radius * Math.sin(angle)}`;
                      })
                      .join(" ")}
                    fill={`${athlete.accentColor}20`}
                    stroke={athlete.accentColor}
                    strokeWidth="1.5"
                  />
                  {/* Data dots */}
                  {radarData.map((p, i) => {
                    const angle = (Math.PI * 2 * i) / radarData.length - Math.PI / 2;
                    const radius = (p.value / 100) * 30;
                    return (
                      <circle
                        key={i}
                        cx={36 + radius * Math.cos(angle)}
                        cy={36 + radius * Math.sin(angle)}
                        r="2"
                        fill={athlete.accentColor}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Score + Grade */}
              <div className="flex-1">
                <p className="text-[9px] text-uc-muted uppercase tracking-widest mb-1">
                  QB DNA Score
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-mono font-bold leading-none"
                    style={{ color: gradeColor }}
                  >
                    {score}
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: gradeColor }}
                  >
                    {grade}
                  </span>
                </div>
                <p className="text-[9px] text-uc-muted mt-1">
                  Weighted composite across 8 verified metrics
                </p>
              </div>
            </div>
          </div>

          {/* — Divider — */}
          <div
            className="h-[1px] w-full mb-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${athlete.accentColor}30, transparent)`,
            }}
          />

          {/* — Key Metrics — */}
          <CardMetric
            label="Arm Strength"
            value={athlete.metrics.armStrength}
            color={athlete.accentColor}
          />
          <CardMetric
            label="Release Time"
            value={`${athlete.metrics.releaseTime}s`}
            color={athlete.accentColor}
          />
          <CardMetric
            label="Accuracy"
            value={`${athlete.metrics.accuracy}%`}
            color={athlete.accentColor}
          />
          <CardMetric
            label="Decision Speed"
            value={`${athlete.metrics.decisionSpeed}ms`}
            color={athlete.accentColor}
          />
          <CardMetric
            label="Mechanics Grade"
            value={athlete.metrics.mechanicsGrade}
            color={athlete.accentColor}
          />
          <CardMetric
            label="Film Grade"
            value={athlete.metrics.filmGrade}
            color={athlete.accentColor}
          />

          {/* — Divider — */}
          <div
            className="h-[1px] w-full my-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${athlete.accentColor}30, transparent)`,
            }}
          />

          {/* — NFL Comp — */}
          <div className="mb-6">
            <p className="text-[10px] text-uc-muted uppercase tracking-widest mb-3">
              Top NFL Comparison
            </p>
            <div className="flex items-center justify-between">
              <span className="text-uc-white font-semibold">
                {athlete.nflComparisons[0].name}
              </span>
              <span
                className="text-sm font-mono font-bold"
                style={{ color: athlete.accentColor }}
              >
                {athlete.nflComparisons[0].similarity}% match
              </span>
            </div>
            <p className="text-uc-muted text-xs mt-1">
              {athlete.nflComparisons[0].trait}
            </p>
          </div>

          {/* — Season Line — */}
          <div className="bg-uc-black/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "YDS", value: athlete.seasonStats.yards.toLocaleString() },
                { label: "TD", value: athlete.seasonStats.touchdowns },
                { label: "INT", value: athlete.seasonStats.interceptions },
                { label: "QBR", value: athlete.seasonStats.qbr },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-sm font-mono font-bold text-uc-white">
                    {s.value}
                  </div>
                  <div className="text-[9px] text-uc-muted uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* — QR Placeholder + Branding — */}
          <div className="flex items-end justify-between">
            <div>
              <div className="w-16 h-16 bg-uc-white rounded-lg flex items-center justify-center mb-2">
                {/* QR code placeholder — grid pattern */}
                <div className="w-12 h-12 grid grid-cols-5 grid-rows-5 gap-[1px]">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${
                        [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 23, 24].includes(i)
                          ? "bg-uc-black"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-uc-muted">Scan to view profile</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-1">
                <div className="w-5 h-5 rounded bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
                  <span className="text-uc-gold font-bold text-[8px]">UC</span>
                </div>
                <span className="text-uc-white font-semibold text-xs">
                  Under Center
                </span>
              </div>
              <p className="text-[9px] text-uc-muted">undercenter.com</p>
              <p className="text-[8px] text-uc-muted/60 mt-1">
                Verified {new Date(athlete.verifiedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${athlete.accentColor}60, transparent)`,
          }}
        />
      </div>

      {/* Actions below card */}
      <div className="w-full max-w-sm mt-6 flex items-center gap-3">
        <button className="flex-1 bg-uc-gold text-black font-semibold py-3 rounded-xl text-sm hover:bg-uc-gold/90 transition-colors cursor-pointer">
          Save Image
        </button>
        <Link
          href={`/athlete/${athlete.slug}`}
          className="flex-1 bg-uc-dark border border-uc-border text-uc-light font-medium py-3 rounded-xl text-sm text-center hover:border-uc-gold/30 hover:text-uc-white transition-colors"
        >
          Full Profile
        </Link>
      </div>

      {/* Footer credit */}
      <p className="text-[10px] text-uc-muted/50 mt-8">
        © {new Date().getFullYear()} Under Center. Verified quarterback metrics.
      </p>
    </div>
  );
}
