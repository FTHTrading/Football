"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════
   NIL33 — Premium Product Homepage
   
   Every section has a UNIQUE layout.
   Product UIs are the visual anchors.
   Nothing looks like documentation.
   ═══════════════════════════════════════════════════ */

/* ── Scroll Reveal ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          o.disconnect();
        }
      },
      { threshold }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, vis } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-out ${
        vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Gradient Divider ── */
function Divider({ color = "#00ff88" }: { color?: string }) {
  return (
    <div
      className="h-px w-full"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }}
    />
  );
}

/* ── Reusable Window Chrome ── */
function MockWindow({
  title,
  children,
  glow,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  glow?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {glow && (
        <div
          className="absolute -inset-6 rounded-3xl blur-[80px] opacity-60 pointer-events-none"
          style={{ background: glow }}
        />
      )}
      <div className="relative bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0a]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] text-gray-600 font-mono truncate">
            {title}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1 · NAVIGATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 48);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        s
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center group-hover:shadow-[0_0_20px_#00ff8860] transition-shadow duration-300">
            <span className="text-[#0a0a0a] font-black text-sm leading-none">
              33
            </span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            NIL33
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-10 text-[13px] font-medium tracking-wide uppercase text-gray-600">
          <a href="#engine" className="hover:text-white transition-colors">
            Engine
          </a>
          <a href="#compliance" className="hover:text-white transition-colors">
            Compliance
          </a>
          <a href="#receipts" className="hover:text-white transition-colors">
            Receipts
          </a>
          <a
            href="#architecture"
            className="hover:text-white transition-colors"
          >
            Architecture
          </a>
        </div>

        <a
          href="mailto:kevanbtc@gmail.com?subject=NIL33 — Demo Request"
          className="bg-white text-[#0a0a0a] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Request Demo
        </a>
      </div>
    </nav>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2 · HERO  —  Centered text + floating product card
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero() {
  const [animated, setAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setAnimated(true), 500);
          o.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  const factors = [
    { label: "On-Field Performance", value: 91, color: "#00ff88" },
    { label: "Recruiting Interest", value: 87, color: "#00ff88" },
    { label: "Social Reach", value: 72, color: "#f59e0b" },
    { label: "Brand Safety", value: 95, color: "#00ff88" },
    { label: "Compliance Status", value: 100, color: "#00d4ff" },
    { label: "Deal History", value: 64, color: "#f59e0b" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-12 px-6 sm:px-8 overflow-hidden">
      {/* ── Background ── */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] bg-[radial-gradient(circle,#00ff8810_0%,transparent_70%)]" />

      {/* ── Text ── */}
      <Reveal className="relative z-10 text-center max-w-5xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          Infrastructure — Not a Marketplace
        </div>

        <h1 className="text-[clamp(2.8rem,8vw,7rem)] font-black tracking-[-0.035em] leading-[0.92] mb-8">
          <span className="text-white block">NIL valuation</span>
          <span className="text-white block">and compliance</span>
          <span className="text-[#00ff88] block">infrastructure.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          33 measurable factors. 50-state compliance routing. Cryptographic deal
          receipts. Built for athletes, collectives, and institutions that need
          real numbers — not guesswork.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href="mailto:kevanbtc@gmail.com?subject=NIL33 — Early Access"
            className="bg-[#00ff88] text-[#0a0a0a] px-8 py-4 rounded-xl text-sm font-bold shadow-[0_0_0_1px_#00ff8840] hover:shadow-[0_0_40px_#00ff8840] transition-all duration-300"
          >
            Request Early Access
          </a>
          <a
            href="#engine"
            className="text-gray-500 text-sm font-medium hover:text-white transition-colors group"
          >
            See the engine{" "}
            <span className="inline-block group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </a>
        </div>
      </Reveal>

      {/* ── Floating Product Card ── */}
      <Reveal delay={300} className="relative z-10 w-full max-w-4xl mx-auto">
        <MockWindow
          title="nil33 — athlete valuation report"
          glow="radial-gradient(circle, #00ff880d 0%, transparent 70%)"
        >
          <div ref={cardRef} className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1.5">
                  Athlete Valuation Report
                </div>
                <div className="text-xl md:text-2xl font-black text-white">
                  Marcus Johnson
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  QB · Georgia · Class of 2027
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-4xl md:text-[56px] font-black text-[#00ff88] font-mono leading-none">
                  84.7
                </div>
                <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-2">
                  NIL Score
                </div>
              </div>
            </div>

            <div className="h-px bg-white/[0.06] mb-6" />

            {/* Animated factor bars — 2 cols */}
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 mb-6">
              {factors.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400">{f.label}</span>
                    <span className="text-white font-mono font-bold">
                      {f.value}
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all ease-out"
                      style={{
                        width: animated ? `${f.value}%` : "0%",
                        backgroundColor: f.color,
                        transitionDuration: `${800 + i * 180}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/[0.06] mb-6" />

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1">
                  Estimated Annual Value
                </div>
                <div className="text-xl md:text-2xl font-black text-white">
                  $185,000 — $340,000
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-xs text-gray-500 font-mono">
                  33/33 factors computed
                </span>
              </div>
            </div>
          </div>
        </MockWindow>
      </Reveal>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3 · STAT BAR  —  Big numbers, dark ground
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StatBar() {
  return (
    <>
      <Divider />
      <Reveal className="py-20 px-8 bg-[#060606]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 md:divide-x md:divide-white/[0.06]">
          {[
            { n: "33", label: "Measurable Factors", sub: "Six weighted categories" },
            { n: "50", label: "States Covered", sub: "Full compliance routing" },
            { n: "14", label: "Sports Supported", sub: "Revenue & Olympic" },
            { n: "<200ms", label: "Valuation Speed", sub: "Rust computation engine" },
          ].map((s, i) => (
            <div key={i} className="md:px-10 first:md:pl-0 last:md:pr-0 text-center md:text-left">
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                {s.n}
              </div>
              <div className="text-sm text-[#00ff88] font-semibold mt-2">
                {s.label}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </Reveal>
      <Divider />
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4 · VALUATION ENGINE  —  Heatmap + Categories
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ValuationEngine() {
  const { ref, vis } = useReveal();

  const heatColors = [
    "#00ff88","#00ff88","#00ff88","#f59e0b","#00ff88","#00ff88",
    "#00ff88","#f59e0b","#00ff88","#00ff88","#00ff88","#f59e0b",
    "#00ff88","#00ff88","#ef4444","#00ff88","#f59e0b","#00ff88",
    "#00ff88","#00ff88","#00ff88","#f59e0b","#00ff88","#00ff88",
    "#00ff88","#00d4ff","#00d4ff","#00ff88","#00ff88","#f59e0b",
    "#f59e0b","#00ff88","#00ff88",
  ];

  return (
    <section id="engine" className="py-32 md:py-40 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header — centered */}
        <Reveal className="text-center mb-20">
          <div className="text-[#00ff88] text-xs font-bold uppercase tracking-[0.25em] mb-5">
            Valuation Engine
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1]">
            33 factors.{" "}
            <span className="text-gray-600">Not follower counts.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Most platforms estimate NIL value from social media followers. NIL33
            computes a deterministic score from 33 measurable signals across six
            weighted categories.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Heatmap */}
          <Reveal>
            <MockWindow title="nil33 — 33-factor heatmap">
              <div ref={ref} className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                    Factor Analysis
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#00ff88]" /> Strong
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#f59e0b]" /> Moderate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-[#ef4444]" /> Weak
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {heatColors.map((c, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg transition-all duration-500 hover:scale-110 cursor-default"
                      style={{
                        backgroundColor: c,
                        opacity: vis ? 0.75 : 0,
                        transitionDelay: `${i * 30}ms`,
                      }}
                      title={`Factor ${i + 1}`}
                    />
                  ))}
                  {/* Fill remaining 3 cells transparent */}
                  {[0, 1, 2].map((i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                      Composite Score
                    </div>
                    <div className="text-3xl font-black text-[#00ff88] font-mono mt-1">
                      84.7 / 100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                      Confidence
                    </div>
                    <div className="text-sm font-mono text-white mt-1">
                      High — 31/33 verified
                    </div>
                  </div>
                </div>
              </div>
            </MockWindow>
          </Reveal>

          {/* Right — Categories */}
          <div className="space-y-5">
            {[
              {
                cat: "Identity Verification",
                weight: "12%",
                color: "#00ff88",
                desc: "KYC status, age eligibility, enrollment verification, guardian consent status.",
              },
              {
                cat: "On-Field Performance",
                weight: "28%",
                color: "#00ff88",
                desc: "Game statistics, film grades, seasonal trajectory, positional rankings.",
              },
              {
                cat: "Recruiting Interest",
                weight: "22%",
                color: "#00ff88",
                desc: "Service rankings, D1 offers, official visits, portal activity, commit status.",
              },
              {
                cat: "Social & Brand Reach",
                weight: "18%",
                color: "#f59e0b",
                desc: "Follower count, engagement rate, content quality, brand safety score.",
              },
              {
                cat: "Compliance Status",
                weight: "12%",
                color: "#00d4ff",
                desc: "State law match, school policy adherence, prior violations, active flags.",
              },
              {
                cat: "Deal History",
                weight: "8%",
                color: "#a855f7",
                desc: "Past contracts, fulfillment rate, dispute record, payment history.",
              },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group flex items-start gap-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] rounded-xl p-5 transition-all duration-300">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black font-mono"
                    style={{
                      backgroundColor: `${c.color}12`,
                      color: c.color,
                    }}
                  >
                    {c.weight}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-[#00ff88] transition-colors">
                      {c.cat}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {c.desc}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5 · COMPLIANCE ENGINE  —  Flow diagram + Check UI
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ComplianceEngine() {
  const steps = [
    { emoji: "📜", title: "State Law", sub: "50-state coverage" },
    { emoji: "🏛️", title: "School Rules", sub: "Institution policies" },
    { emoji: "🏈", title: "NCAA / Conf.", sub: "Association rules" },
    { emoji: "⚠️", title: "Risk Score", sub: "Flag & resolve" },
  ];

  const checks = [
    {
      status: "pass" as const,
      title: "Georgia State Law — Passed",
      detail:
        "SB 290 (2021) — No institutional involvement required. Agent disclosure required for deals >$5,000.",
    },
    {
      status: "pass" as const,
      title: "University Policy — Passed",
      detail:
        "72-hour disclosure window met. No use of institutional marks. Compliance office notified.",
    },
    {
      status: "pass" as const,
      title: "NCAA Guidelines — Passed",
      detail:
        "No pay-for-play indicators. No recruiting inducement flags. Deal structure compliant.",
    },
    {
      status: "warn" as const,
      title: "Agent Disclosure — Action Required",
      detail:
        "Deal value exceeds $5,000. Georgia law requires agent disclosure filing within 7 days of execution.",
    },
  ];

  return (
    <section
      id="compliance"
      className="py-32 md:py-40 px-6 sm:px-8 bg-[#070709]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-20">
          <div className="text-[#00d4ff] text-xs font-bold uppercase tracking-[0.25em] mb-5">
            Compliance Engine
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1]">
            50-state{" "}
            <span className="text-gray-600">compliance routing.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Every state has different NIL laws. Every school has its own rules.
            NIL33 checks every deal against all of them — automatically — and
            flags issues before they become violations.
          </p>
        </Reveal>

        {/* ── HORIZONTAL FLOW DIAGRAM ── */}
        <Reveal className="mb-20">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex-1 bg-[#111] border border-white/[0.08] rounded-xl p-5 md:p-6 text-center min-w-[140px] hover:border-[#00d4ff]/30 transition-colors duration-300">
                  <div className="text-2xl mb-2">{step.emoji}</div>
                  <div className="text-sm font-bold text-white">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-1">
                    {step.sub}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-10 text-[#00d4ff] text-lg flex-shrink-0">
                    →
                  </div>
                )}
                {i < steps.length - 1 && (
                  <div className="flex md:hidden items-center justify-center h-6 text-[#00d4ff] text-lg">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── COMPLIANCE CHECK MOCKUP ── */}
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <MockWindow
              title="nil33 — compliance check (real-time)"
              glow="radial-gradient(circle, #00d4ff08 0%, transparent 70%)"
            >
              <div className="p-5 md:p-7 space-y-3">
                {checks.map((c, i) => {
                  const isPass = c.status === "pass";
                  const accent = isPass ? "#00ff88" : "#f59e0b";
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg p-4"
                      style={{
                        backgroundColor: `${accent}08`,
                        border: `1px solid ${accent}25`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: `${accent}20`,
                          color: accent,
                        }}
                      >
                        {isPass ? "✓" : "!"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {c.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {c.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                    <span className="text-xs text-gray-400">
                      3 of 4 checks passed
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#f59e0b]">
                    1 action required
                  </span>
                </div>
              </div>
            </MockWindow>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   6 · DEAL RECEIPTS  —  Proof, not promises
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function DealReceipts() {
  return (
    <section id="receipts" className="py-32 md:py-40 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-20">
          <div className="text-[#a855f7] text-xs font-bold uppercase tracking-[0.25em] mb-5">
            Deal Receipts
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1]">
            Verifiable proof.{" "}
            <span className="text-gray-600">Every deal.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Every NIL deal processed through NIL33 generates a cryptographic
            receipt — timestamped, signed, and immutable. No more handshake
            deals.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Left — Key points */}
          <Reveal className="lg:col-span-2 space-y-6">
            {[
              {
                title: "SHA-256 Hashed",
                desc: "Every receipt is fingerprinted with a cryptographic hash at execution time.",
              },
              {
                title: "Dual Signatures",
                desc: "Both parties digitally sign the receipt. No more he-said-she-said.",
              },
              {
                title: "Compliance Snapshot",
                desc: "Compliance status at deal time is recorded permanently on the receipt.",
              },
              {
                title: "Immutable Record",
                desc: "Once created, receipts cannot be altered. Exportable for audits and tax filings.",
              },
              {
                title: "Fair Market Validation",
                desc: "Deal value is compared against the NIL33 valuation range at time of signing.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-2 h-2 rounded-full bg-[#a855f7] mt-2 flex-shrink-0 group-hover:shadow-[0_0_12px_#a855f760] transition-shadow" />
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Right — Receipt card */}
          <Reveal delay={200} className="lg:col-span-3">
            <MockWindow
              title="nil33 — deal receipt #NIL33-2026-00847"
              glow="radial-gradient(circle, #a855f708 0%, transparent 70%)"
            >
              <div className="p-6 md:p-8 font-mono text-xs space-y-5">
                {/* Deal details */}
                <div className="space-y-3">
                  {[
                    ["Receipt ID", "NIL33-2026-00847"],
                    ["Athlete", "Marcus Johnson"],
                    ["Brand", "SportFuel Athletics"],
                    ["Deal Type", "Social Media Campaign"],
                  ].map(([k, v], i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{k}</span>
                      <span className="text-white">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value</span>
                    <span className="text-[#00ff88] font-bold text-sm">
                      $12,500.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-white">90 days</span>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Compliance & value */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compliance</span>
                    <span className="text-[#00ff88]">PASSED — 4/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NIL Score at Signing</span>
                    <span className="text-white">84.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Range</span>
                    <span className="text-white">$9,200 — $18,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fair Market</span>
                    <span className="text-[#00ff88] font-bold">
                      WITHIN RANGE
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Crypto data */}
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-600 mb-1">Executed</div>
                    <div className="text-white">2026-02-14T18:32:07Z</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">SHA-256</div>
                    <div className="text-[#a855f7]/50 break-all leading-relaxed text-[11px]">
                      a7f3b2c1d4e5f6a8b9c0d1e2f3a4b5c6
                      <br />
                      d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                    <span className="text-gray-500">
                      Digitally signed by both parties
                    </span>
                  </div>
                  <span className="text-[#a855f7] font-bold text-[10px] uppercase tracking-widest">
                    Verified
                  </span>
                </div>
              </div>
            </MockWindow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   7 · ARCHITECTURE  —  3-Layer Diagram + Tech Stack
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Architecture() {
  const layers = [
    {
      n: "01",
      title: "Data Ingestion",
      color: "#00ff88",
      items: [
        "Identity verification (KYC)",
        "Performance data feeds",
        "Social media APIs",
        "Recruiting databases",
        "State law database",
        "School policy registry",
      ],
    },
    {
      n: "02",
      title: "Computation Engine",
      color: "#00d4ff",
      items: [
        "33-factor scoring model",
        "Weighted category analysis",
        "Compliance rule matching",
        "Fair market calculation",
        "Risk scoring algorithm",
        "Deal simulation engine",
      ],
    },
    {
      n: "03",
      title: "Output & Verification",
      color: "#a855f7",
      items: [
        "Valuation reports",
        "Compliance certificates",
        "Deal receipts (SHA-256)",
        "Audit trail logs",
        "REST API endpoints",
        "Institutional dashboards",
      ],
    },
  ];

  const techStack = [
    { name: "Next.js", role: "Frontend", color: "#ffffff" },
    { name: "TypeScript", role: "Type Safety", color: "#3178c6" },
    { name: "Prisma", role: "Data Layer", color: "#5a67d8" },
    { name: "Rust", role: "Computation", color: "#dea584" },
    { name: "PostgreSQL", role: "Storage", color: "#336791" },
    { name: "Tailwind", role: "Design", color: "#06b6d4" },
  ];

  return (
    <section
      id="architecture"
      className="py-32 md:py-40 px-6 sm:px-8 bg-[#070709]"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-20">
          <div className="text-[#00d4ff] text-xs font-bold uppercase tracking-[0.25em] mb-5">
            System Architecture
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1]">
            How it&apos;s built.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Three layers. Each independently verifiable. Data flows in, scores
            come out, receipts are sealed.
          </p>
        </Reveal>

        {/* ── 3-Layer Diagram ── */}
        <Reveal className="mb-20">
          <div className="grid md:grid-cols-3 gap-0 items-stretch">
            {layers.map((layer, i) => (
              <div key={i} className="flex items-stretch">
                <div
                  className="flex-1 rounded-2xl p-7 md:p-8 mx-1.5 border transition-colors duration-300"
                  style={{
                    borderColor:
                      i === 1
                        ? `${layer.color}30`
                        : "rgba(255,255,255,0.06)",
                    backgroundColor:
                      i === 1 ? `${layer.color}06` : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    className="text-xs font-black uppercase tracking-[0.25em] mb-2 font-mono"
                    style={{ color: layer.color }}
                  >
                    Layer {layer.n}
                  </div>
                  <h3 className="text-xl font-black text-white mb-6">
                    {layer.title}
                  </h3>
                  <div className="space-y-3">
                    {layer.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 group"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-sm text-gray-500 group-hover:text-white transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                {i < 2 && (
                  <div className="hidden md:flex items-center justify-center w-6 flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
                      <span className="text-white/30 text-sm">→</span>
                      <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Tech Stack ── */}
        <Reveal>
          <Divider />
          <div className="py-12">
            <div className="text-[10px] text-gray-600 uppercase tracking-[0.25em] text-center mb-8">
              Technology Stack
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {techStack.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-3 h-3 rounded-full transition-shadow duration-300"
                    style={{
                      backgroundColor: t.color,
                      boxShadow: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow = `0 0 16px ${t.color}60`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-gray-600">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Divider />
        </Reveal>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   8 · WHO IT'S FOR  —  4 cards, distinct colors
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Stakeholders() {
  const cards = [
    {
      title: "Athletes",
      color: "#00ff88",
      desc: "Know your real value. Verify compliance before signing. Build a verifiable deal history.",
      features: [
        "Free valuation",
        "Compliance pre-check",
        "Deal receipts",
        "Score tracking",
      ],
    },
    {
      title: "Collectives",
      color: "#f59e0b",
      desc: "Data-backed valuations before writing checks. Simulate deals. Track capital with discipline.",
      features: [
        "Roster valuations",
        "Deal simulation",
        "Spend analytics",
        "API access",
      ],
    },
    {
      title: "Compliance Officers",
      color: "#00d4ff",
      desc: "50-state coverage. Automated rule checks. Full audit trails. Protect your program.",
      features: [
        "Auto rule-check",
        "Violation prevention",
        "Audit export",
        "Risk scoring",
      ],
    },
    {
      title: "Brands",
      color: "#a855f7",
      desc: "Find the right athlete. Verify the value matches the ask. Execute deals that are compliant.",
      features: [
        "Athlete matching",
        "Value verification",
        "Risk screening",
        "Deal structuring",
      ],
    },
  ];

  return (
    <section className="py-32 md:py-40 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Built for the NIL ecosystem.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="h-full rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 group bg-white/[0.02] hover:bg-white/[0.04]"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `${card.color}40`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.06)")
                }
              >
                {/* Color accent bar */}
                <div
                  className="w-8 h-1 rounded-full mb-6"
                  style={{ backgroundColor: card.color }}
                />
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {card.desc}
                </p>
                <div className="space-y-2.5">
                  {card.features.map((f, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2.5 text-xs text-gray-400"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: card.color }}
                      />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   9 · CTA  —  One action
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CallToAction() {
  return (
    <section className="py-32 md:py-40 px-6 sm:px-8 bg-[#070709] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] bg-[radial-gradient(circle,#00ff8808_0%,transparent_70%)] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            See it in action.
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-14 max-w-xl mx-auto">
            NIL33 is in early access. Request a demo to see the valuation
            engine, compliance checks, and deal receipt system working.
          </p>
          <a
            href="mailto:kevanbtc@gmail.com?subject=NIL33 — Demo Request"
            className="inline-flex items-center gap-3 bg-[#00ff88] text-[#0a0a0a] px-10 py-5 rounded-xl text-lg font-bold hover:shadow-[0_0_60px_#00ff8830] transition-all duration-300"
          >
            Request a Demo
            <span className="opacity-50">→</span>
          </a>
          <p className="text-xs text-gray-600 mt-8">
            Early access · No commitment · Response within 24 hours
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   10 · FOOTER  —  Clean, professional, no placeholders
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Footer() {
  return (
    <footer className="py-20 px-6 sm:px-8 border-t border-white/[0.06] bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-[#00ff88] flex items-center justify-center">
                <span className="text-[#0a0a0a] font-black text-[10px] leading-none">
                  33
                </span>
              </div>
              <span className="text-base font-bold text-white">NIL33</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Deterministic NIL valuation
              <br />
              and compliance infrastructure.
            </p>
            <p className="text-xs text-gray-700 mt-4">
              Norcross, Georgia 30092
              <br />A UnyKorn Company
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href="#engine"
                  className="hover:text-white transition-colors"
                >
                  Valuation Engine
                </a>
              </li>
              <li>
                <a
                  href="#compliance"
                  className="hover:text-white transition-colors"
                >
                  Compliance Engine
                </a>
              </li>
              <li>
                <a
                  href="#receipts"
                  className="hover:text-white transition-colors"
                >
                  Deal Receipts
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="hover:text-white transition-colors"
                >
                  Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href="https://github.com/FTHTrading/nil33"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:kevanbtc@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="mailto:kevanbtc@gmail.com?subject=NIL33 — Demo Request"
                  className="hover:text-white transition-colors"
                >
                  Request Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Divider />

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-700">
            © 2026 NIL33 — A UnyKorn Company. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">Identity · Value · Legacy</p>
        </div>
      </div>
    </footer>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen antialiased selection:bg-[#00ff88] selection:text-[#0a0a0a]">
      <Nav />
      <Hero />
      <StatBar />
      <ValuationEngine />
      <Divider color="#00d4ff" />
      <ComplianceEngine />
      <Divider color="#a855f7" />
      <DealReceipts />
      <Divider color="#00d4ff" />
      <Architecture />
      <Stakeholders />
      <CallToAction />
      <Footer />
    </main>
  );
}
