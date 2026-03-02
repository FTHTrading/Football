"use client";

import { athletes } from "@/lib/athletes";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Intersection Observer Hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Reveal Wrapper ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Metric Bar (small, horizontal) ─── */
function MetricBar({
  label,
  value,
  max = 99,
  color,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] uppercase tracking-wider text-uc-muted w-16 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-uc-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full animate-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono font-semibold text-uc-white w-7 text-right">
        {value}
      </span>
    </div>
  );
}

/* ─── Star Rating ─── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < count ? "text-uc-gold" : "text-uc-border"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── Athlete Preview Card ─── */
function AthleteCard({
  athlete,
  index,
}: {
  athlete: (typeof athletes)[0];
  index: number;
}) {
  return (
    <Reveal delay={index * 0.12}>
      <Link href={`/athlete/${athlete.slug}`}>
        <div className="group relative bg-uc-dark border border-uc-border rounded-2xl p-6 hover:border-uc-gold/30 transition-all duration-500 cursor-pointer overflow-hidden">
          {/* Subtle top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: athlete.accentColor }}
          />

          {/* Header: Avatar + Info */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
              style={{ background: `${athlete.accentColor}18`, border: `1px solid ${athlete.accentColor}30` }}
            >
              {athlete.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-uc-white font-semibold text-base truncate">
                  {athlete.name}
                </h3>
                {athlete.verified && (
                  <span className="w-4 h-4 rounded-full bg-uc-gold flex items-center justify-center text-[10px] text-black font-bold shrink-0">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-uc-muted text-sm">
                {athlete.position} · Class of {athlete.class}
              </p>
              <p className="text-uc-muted text-xs mt-0.5">
                {athlete.highSchool} — {athlete.city}, {athlete.state}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-3 mb-5">
            <Stars count={athlete.starRating} />
            <span className="text-[11px] text-uc-muted uppercase tracking-wider">
              {athlete.starRating}-Star Prospect
            </span>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2.5 mb-5">
            <MetricBar
              label="ARM"
              value={athlete.metrics.armStrength}
              color={athlete.accentColor}
            />
            <MetricBar
              label="ACC"
              value={athlete.metrics.accuracy}
              color={athlete.accentColor}
            />
            <MetricBar
              label="MECH"
              value={athlete.metrics.mechanicsGrade}
              color={athlete.accentColor}
            />
            <MetricBar
              label="FILM"
              value={athlete.metrics.filmGrade}
              color={athlete.accentColor}
            />
          </div>

          {/* Bottom Stats Row */}
          <div className="flex items-center justify-between pt-4 border-t border-uc-border">
            <div className="text-center">
              <div className="text-uc-white font-mono text-sm font-semibold">
                {athlete.metrics.releaseTime}s
              </div>
              <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                Release
              </div>
            </div>
            <div className="text-center">
              <div className="text-uc-white font-mono text-sm font-semibold">
                {athlete.metrics.decisionSpeed}ms
              </div>
              <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                Decision
              </div>
            </div>
            <div className="text-center">
              <div className="text-uc-white font-mono text-sm font-semibold">
                {athlete.seasonStats.qbr}
              </div>
              <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                QBR
              </div>
            </div>
            <div className="text-center">
              <div className="text-uc-white font-mono text-sm font-semibold">
                {athlete.offers.length}
              </div>
              <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                Offers
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  PAGE                                                        */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* ─── Nav ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-uc-black/90 backdrop-blur-xl border-b border-uc-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
              <span className="text-uc-gold font-bold text-sm">UC</span>
            </div>
            <span className="text-uc-white font-semibold tracking-tight">
              Under Center
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#profiles"
              className="text-sm text-uc-muted hover:text-uc-white transition-colors"
            >
              Profiles
            </a>
            <a
              href="#how"
              className="text-sm text-uc-muted hover:text-uc-white transition-colors"
            >
              How It Works
            </a>
            <button className="text-sm bg-uc-gold/10 text-uc-gold border border-uc-gold/20 px-4 py-1.5 rounded-lg hover:bg-uc-gold/20 transition-colors cursor-pointer">
              Request Invite
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-uc-gold/[0.03] via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-uc-gold/[0.02] blur-[120px]" />

        <div className="relative text-center max-w-3xl">
          {/* Verified badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-uc-dark border border-uc-border rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-uc-gold animate-verified" />
              <span className="text-xs text-uc-light uppercase tracking-widest">
                Invite-Only · Verified Athletes
              </span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-uc-white leading-[1.05] tracking-tight mb-6">
              Verified Quarterback
              <br />
              <span className="text-uc-gold">Metrics.</span>
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl text-uc-light max-w-lg mx-auto mb-10 leading-relaxed">
              The elite quarterback profile platform.
              <br />
              Built for serious prospects.
            </p>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.3}>
            <div className="flex items-center justify-center gap-4">
              <a
                href="#profiles"
                className="inline-flex items-center gap-2 bg-uc-gold text-black font-semibold px-7 py-3 rounded-xl hover:bg-uc-gold/90 transition-colors text-sm"
              >
                View Verified Profiles
                <span className="text-base">→</span>
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 bg-uc-dark border border-uc-border text-uc-light font-medium px-7 py-3 rounded-xl hover:border-uc-gold/30 hover:text-uc-white transition-colors text-sm"
              >
                How It Works
              </a>
            </div>
          </Reveal>

          {/* Trust line */}
          <Reveal delay={0.4}>
            <p className="mt-12 text-xs text-uc-muted tracking-wide">
              {athletes.length} VERIFIED PROFILES · INVITE-ONLY ACCESS ·
              REAL DATA
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Stat Row ─── */}
      <section className="py-16 border-y border-uc-border bg-uc-dark">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "0.33s", label: "Fastest Release" },
                { value: "94", label: "Top Arm Grade" },
                { value: "76%", label: "Best Accuracy" },
                { value: "155ms", label: "Fastest Decision" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-mono font-bold text-uc-white mb-1">
                    {s.value}
                  </div>
                  <div className="text-xs text-uc-muted uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Verified Profiles ─── */}
      <section id="profiles" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-uc-white mb-4">
                Verified Profiles
              </h2>
              <p className="text-uc-light max-w-md mx-auto">
                Every metric verified. Every grade earned. No inflated numbers.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {athletes.map((athlete, i) => (
              <AthleteCard key={athlete.id} athlete={athlete} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how" className="py-24 px-6 bg-uc-dark border-y border-uc-border">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-uc-white mb-4">
                How It Works
              </h2>
              <p className="text-uc-light max-w-md mx-auto">
                Three steps. One verified profile. Zero guesswork.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Request Invite",
                desc: "Submit your info. We review every application. Only serious prospects move forward.",
                icon: "✉",
              },
              {
                step: "02",
                title: "Get Verified",
                desc: "Complete a verified evaluation. Real metrics, real film, real grades — nothing inflated.",
                icon: "✓",
              },
              {
                step: "03",
                title: "Own Your Profile",
                desc: "Your verified profile goes live. Share it with coaches, programs, and scouts.",
                icon: "◆",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.12}>
                <div className="relative bg-uc-panel border border-uc-border rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center text-uc-gold text-lg">
                      {item.icon}
                    </span>
                    <span className="text-xs font-mono text-uc-muted tracking-wider">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="text-uc-white font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-uc-light text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What Gets Measured ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-uc-white mb-4">
                What Gets Measured
              </h2>
              <p className="text-uc-light max-w-md mx-auto">
                Eight verified metrics. Every number matters.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { metric: "Arm Strength", range: "1-99", icon: "💪" },
              { metric: "Release Time", range: "seconds", icon: "⚡" },
              { metric: "Accuracy", range: "percentage", icon: "🎯" },
              { metric: "Decision Speed", range: "milliseconds", icon: "🧠" },
              { metric: "Pocket Presence", range: "1-99", icon: "🏈" },
              { metric: "Athleticism", range: "1-99", icon: "🏃" },
              { metric: "Film Grade", range: "1-99", icon: "🎬" },
              { metric: "Mechanics Grade", range: "1-99", icon: "⚙️" },
            ].map((m, i) => (
              <Reveal key={m.metric} delay={i * 0.06}>
                <div className="bg-uc-dark border border-uc-border rounded-xl p-5 text-center hover:border-uc-gold/20 transition-colors">
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="text-uc-white text-sm font-semibold mb-1">
                    {m.metric}
                  </div>
                  <div className="text-[10px] text-uc-muted uppercase tracking-wider">
                    {m.range}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-uc-gold/[0.02] to-transparent" />
        <div className="relative max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-uc-white mb-4">
              Ready to get verified?
            </h2>
            <p className="text-uc-light mb-8 max-w-md mx-auto">
              Under Center is invite-only. Request access and show what you can
              prove.
            </p>
            <button className="bg-uc-gold text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-uc-gold/90 transition-colors text-sm cursor-pointer">
              Request Invite
            </button>
            <p className="mt-6 text-xs text-uc-muted">
              Limited access. Verified athletes only.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-uc-border py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-uc-gold/10 border border-uc-gold/20 flex items-center justify-center">
              <span className="text-uc-gold font-bold text-xs">UC</span>
            </div>
            <span className="text-uc-white font-medium text-sm">
              Under Center
            </span>
          </div>
          <p className="text-xs text-uc-muted">
            © {new Date().getFullYear()} Under Center. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-uc-muted hover:text-uc-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-uc-muted hover:text-uc-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-uc-muted hover:text-uc-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
