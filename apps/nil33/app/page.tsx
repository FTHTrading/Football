"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════
   NIL33 — Revenue-Focused Homepage
   
   Role: Collective capital discipline tool.
   Primary buyer: Collectives (90-day revenue target).
   Tone: "Before you sign the deal, know the number and the risk."
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
      className={`transition-all duration-700 ease-out ${
        vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Score Bar ── */
function ScoreBar({
  label,
  value,
  max = 100,
  color,
  visible,
  delay = 0,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  visible: boolean;
  delay?: number;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-nil-muted uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-mono font-bold text-nil-white">
          {value}
        </span>
      </div>
      <div className="h-2 bg-nil-gray rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${pct}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Tabbed Audience Selector ── */
function AudienceTabs() {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      label: "For Collectives",
      color: "#00ff88",
      headline: "Stop overpaying. Start validating.",
      points: [
        "Know fair market value before committing capital",
        "Validate every offer against 50-state compliance rules",
        "Reduce institutional risk with auditable deal receipts",
        "Standardize valuation across your entire roster",
      ],
      cta: "Request Collective Access",
    },
    {
      label: "For Schools",
      color: "#00d4ff",
      headline: "Compliance clarity across every deal.",
      points: [
        "Real-time compliance scoring for every NIL transaction",
        "State-specific rules matched to your institution",
        "Audit-ready deal records for NCAA reporting",
        "Reduce exposure to retroactive eligibility challenges",
      ],
      cta: "Request Institutional Access",
    },
    {
      label: "For Brands",
      color: "#a855f7",
      headline: "Pay what the data says. Not what agents say.",
      points: [
        "Compare athlete valuations objectively",
        "Verify deal terms against fair market benchmarks",
        "Avoid PR risk with pre-deal compliance checks",
        "Data-backed ROI projections for NIL sponsorships",
      ],
      cta: "Request Brand Access",
    },
    {
      label: "For Athletes",
      color: "#f59e0b",
      headline: "Know your real number before you sign.",
      points: [
        "See your true NIL value — not what someone tells you",
        "Check if a deal is compliant before you commit",
        "Get a verified receipt that protects your eligibility",
        "Free demo access — no commitment required",
      ],
      cta: "Run Free Demo",
    },
  ];
  const t = tabs[active];
  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              i === active
                ? "text-nil-black"
                : "bg-nil-dark border border-nil-border text-nil-muted hover:text-nil-white"
            }`}
            style={
              i === active ? { background: tab.color } : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="bg-nil-dark border rounded-2xl p-8 md:p-10 transition-colors duration-300"
        style={{ borderColor: `${t.color}25` }}
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: t.color }}
        >
          {t.headline}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {t.points.map((p) => (
            <div key={p} className="flex items-start gap-3">
              <span style={{ color: t.color }} className="mt-0.5 shrink-0">
                ✓
              </span>
              <p className="text-nil-text text-sm leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 text-nil-black font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          style={{ background: t.color }}
        >
          {t.cta}
          <span>→</span>
        </a>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const scoreRef = useRef<HTMLDivElement>(null);
  const [scoreVisible, setScoreVisible] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const el = scoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setScoreVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ─── Nav ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-nil-black/90 backdrop-blur-xl border-b border-nil-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
              <span className="text-nil-green font-bold text-sm">33</span>
            </div>
            <span className="text-nil-white font-semibold tracking-tight">
              NIL33
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#demo"
              className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block"
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block"
            >
              Pricing
            </a>
            <a
              href="#use-cases"
              className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block"
            >
              Use Cases
            </a>
            <a
              href="#demo"
              className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg hover:bg-nil-green/90 transition-colors"
            >
              Run Demo
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-nil-green/[0.03] blur-[120px]" />

        <div className="relative text-center max-w-3xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-nil-dark border border-nil-border rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-nil-green animate-pulse" />
              <span className="text-xs text-nil-muted uppercase tracking-widest">
                Valuation + Compliance Intelligence
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-nil-white leading-[1.08] tracking-tight mb-6">
              Before you sign the deal,
              <br />
              <span className="text-nil-green">
                know the number and&nbsp;the&nbsp;risk.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-lg sm:text-xl text-nil-muted max-w-xl mx-auto mb-10 leading-relaxed">
              Instant NIL valuation and compliance scoring for collectives,
              schools, brands, and athletes.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 bg-nil-green text-nil-black font-semibold px-7 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
              >
                Run Demo Valuation
                <span className="text-base">→</span>
              </a>
              <a
                href="#use-cases"
                className="inline-flex items-center gap-2 bg-nil-dark border border-nil-border text-nil-muted font-medium px-7 py-3.5 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
              >
                For Collectives & Schools
              </a>
            </div>
          </Reveal>

          {/* Proof strip */}
          <Reveal delay={400}>
            <div className="mt-14 flex flex-wrap justify-center gap-8 text-center">
              {[
                { n: "240+", l: "Demo valuations run" },
                { n: "12", l: "Pilot athletes verified" },
                { n: "50", l: "State rulesets loaded" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-xl font-mono font-bold text-nil-white">
                    {s.n}
                  </div>
                  <div className="text-[10px] text-nil-muted uppercase tracking-wider mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Three Outcomes ─── */}
      <section className="py-20 px-6 border-y border-nil-border bg-nil-dark">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "See fair market value",
                desc: "Get a composite NIL score based on 33 real signals — not guesses, not hype, not what an agent tells you.",
              },
              {
                icon: "🛡️",
                title: "Avoid compliance violations",
                desc: "Instantly see if an NIL deal passes compliance across your state, your school, and NCAA rules — before you sign.",
              },
              {
                icon: "📄",
                title: "Get a verified deal record",
                desc: "Every verified deal gets a timestamped receipt — auditable, reproducible, and ready for institutional review.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="text-center md:text-left">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-nil-white font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-nil-muted text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works — 3 Steps ─── */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-3">
                Three steps. That&apos;s it.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Enter athlete or deal info",
                desc: "Social profiles, athletic stats, deal terms, school, and state. NIL33 handles the rest.",
              },
              {
                step: "02",
                title: "NIL33 calculates value + risk",
                desc: "33 weighted factors produce a composite score, a valuation band, and a compliance risk check — specific to your state and school.",
              },
              {
                step: "03",
                title: "Get your score and status",
                desc: "A clear NIL score, a dollar range, and a pass/fail on compliance. Sharable. Auditable. Done.",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="bg-nil-dark border border-nil-border rounded-xl p-6 h-full">
                  <span className="text-xs font-mono text-nil-green tracking-wider">
                    STEP {item.step}
                  </span>
                  <h3 className="text-nil-white font-semibold text-lg mt-3 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-nil-muted text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demo Valuation (Product Surface) ─── */}
      <section
        id="demo"
        className="py-24 px-6 bg-nil-dark border-y border-nil-border"
        ref={scoreRef}
      >
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-xs text-nil-green uppercase tracking-widest mb-3">
                Product Preview
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-3">
                What a NIL33 valuation looks like
              </h2>
              <p className="text-nil-muted max-w-lg mx-auto">
                This is a real output format. Enter athlete data, get a score,
                a valuation band, and a compliance status — instantly.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left: Athlete input card */}
            <Reveal className="md:col-span-2">
              <div className="bg-nil-black border border-nil-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-nil-green" />
                  <span className="text-xs text-nil-muted uppercase tracking-widest">
                    Input
                  </span>
                </div>

                {/* Athlete header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-nil-green/10 border border-nil-green/20 flex items-center justify-center text-lg font-bold text-nil-green">
                    QB
                  </div>
                  <div>
                    <h3 className="text-nil-white font-semibold">
                      Florida QB — Class of 2027
                    </h3>
                    <p className="text-nil-muted text-sm">
                      SEC · 4-star · 3 brand offers
                    </p>
                  </div>
                </div>

                {/* Input fields */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Instagram", value: "42.1K followers" },
                    { label: "TikTok", value: "118K followers" },
                    { label: "State", value: "Florida" },
                    { label: "Conference", value: "SEC" },
                    { label: "Star Rating", value: "★★★★☆" },
                    { label: "Proposed Deal", value: "$65,000" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex justify-between py-2 border-b border-nil-border/50 last:border-0"
                    >
                      <span className="text-xs text-nil-muted uppercase tracking-wider">
                        {s.label}
                      </span>
                      <span className="text-sm text-nil-white font-medium">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-nil-muted/60 text-center">
                  Demo composite — not a real athlete
                </p>
              </div>
            </Reveal>

            {/* Right: Score output card */}
            <Reveal className="md:col-span-3" delay={150}>
              <div className="bg-nil-black border border-nil-border rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-nil-green" />
                  <span className="text-xs text-nil-muted uppercase tracking-widest">
                    Output
                  </span>
                </div>

                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-nil-green/[0.04] rounded-full blur-[60px]" />

                {/* Composite Score */}
                <div className="relative text-center mb-8">
                  <div className="text-7xl font-mono font-extrabold text-nil-white mb-1">
                    82
                  </div>
                  <div className="text-xs text-nil-muted uppercase tracking-widest mb-5">
                    NIL Composite Score
                  </div>
                  <div className="inline-flex items-center gap-4 sm:gap-6 bg-nil-dark rounded-xl px-5 sm:px-6 py-3 flex-wrap justify-center">
                    <div className="text-center">
                      <div className="text-lg font-mono font-bold text-nil-green">
                        $58,000
                      </div>
                      <div className="text-[10px] text-nil-muted uppercase tracking-wider">
                        Valuation Band
                      </div>
                    </div>
                    <div className="w-px h-8 bg-nil-border hidden sm:block" />
                    <div className="text-center">
                      <div className="text-lg font-mono font-bold text-nil-green">
                        GREEN
                      </div>
                      <div className="text-[10px] text-nil-muted uppercase tracking-wider">
                        Compliance Risk
                      </div>
                    </div>
                    <div className="w-px h-8 bg-nil-border hidden sm:block" />
                    <div className="text-center">
                      <div className="text-lg font-mono font-bold text-nil-green">
                        HIGH
                      </div>
                      <div className="text-[10px] text-nil-muted uppercase tracking-wider">
                        Deal Confidence
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="space-y-4 mb-6">
                  <ScoreBar
                    label="Social Reach"
                    value={78}
                    color="#00ff88"
                    visible={scoreVisible}
                    delay={0}
                  />
                  <ScoreBar
                    label="Athletic Performance"
                    value={91}
                    color="#00ff88"
                    visible={scoreVisible}
                    delay={100}
                  />
                  <ScoreBar
                    label="Market Demand"
                    value={74}
                    color="#00d4ff"
                    visible={scoreVisible}
                    delay={200}
                  />
                  <ScoreBar
                    label="Brand Alignment"
                    value={85}
                    color="#00d4ff"
                    visible={scoreVisible}
                    delay={300}
                  />
                  <ScoreBar
                    label="Compliance Clearance"
                    value={96}
                    color="#a855f7"
                    visible={scoreVisible}
                    delay={400}
                  />
                </div>

                {/* Compliance verdict */}
                <div className="bg-nil-green/5 border border-nil-green/15 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-nil-green text-lg mt-0.5">✓</span>
                  <div>
                    <p className="text-nil-white text-sm font-medium mb-0.5">
                      Deal passes compliance
                    </p>
                    <p className="text-nil-muted text-xs">
                      Florida state law · SEC institution rules · NCAA
                      guidelines — all clear. Proposed $65K is within fair
                      market range ($52K–$64K).
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Who It's For (Tabbed — Collectives First) ─── */}
      <section id="use-cases" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-3">
                Built for the people who write the checks
              </h2>
              <p className="text-nil-muted max-w-md mx-auto">
                Collectives, schools, brands, and athletes — each gets exactly
                the answers they need.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <AudienceTabs />
          </Reveal>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section
        id="pricing"
        className="py-24 px-6 bg-nil-dark border-y border-nil-border"
      >
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-3">
                Simple pricing. Clear value.
              </h2>
              <p className="text-nil-muted max-w-md mx-auto">
                Start with a free demo. Scale when you&apos;re ready.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <Reveal>
              <div className="bg-nil-black border border-nil-border rounded-2xl p-8 h-full flex flex-col">
                <h3 className="text-nil-white font-semibold text-lg mb-1">
                  Starter
                </h3>
                <p className="text-nil-muted text-sm mb-6">
                  Try it. No commitment.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-nil-white">Free</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "5 demo valuations",
                    "Sample compliance report",
                    "Score breakdown preview",
                    "Single athlete",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="text-nil-green text-sm mt-0.5">✓</span>
                      <span className="text-nil-text text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#demo"
                  className="block text-center bg-nil-dark border border-nil-border text-nil-white font-medium px-6 py-3 rounded-xl hover:border-nil-green/30 transition-colors text-sm"
                >
                  Run Free Demo
                </a>
              </div>
            </Reveal>

            {/* Pro */}
            <Reveal delay={100}>
              <div className="bg-nil-black border-2 border-nil-green/40 rounded-2xl p-8 h-full flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nil-green text-nil-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
                <h3 className="text-nil-white font-semibold text-lg mb-1">
                  Pro
                </h3>
                <p className="text-nil-muted text-sm mb-6">
                  For collectives and schools.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-nil-white">
                    $1,200
                  </span>
                  <span className="text-nil-muted text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Unlimited valuations",
                    "Full compliance reports",
                    "50-state ruleset access",
                    "Deal receipt generation",
                    "Multi-athlete dashboard",
                    "API access (100K calls/mo)",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="text-nil-green text-sm mt-0.5">✓</span>
                      <span className="text-nil-text text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:partnerships@nil33.com?subject=Pro%20Access%20Request"
                  className="block text-center bg-nil-green text-nil-black font-semibold px-6 py-3 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
                >
                  Request Access
                </a>
              </div>
            </Reveal>

            {/* Enterprise */}
            <Reveal delay={200}>
              <div className="bg-nil-black border border-nil-border rounded-2xl p-8 h-full flex flex-col">
                <h3 className="text-nil-white font-semibold text-lg mb-1">
                  Enterprise
                </h3>
                <p className="text-nil-muted text-sm mb-6">
                  Custom integration and volume.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-nil-white">
                    Custom
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Everything in Pro",
                    "White-label reports",
                    "Custom compliance rules",
                    "Dedicated API endpoints",
                    "SLA guarantees",
                    "Conference-wide licensing",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="text-nil-green text-sm mt-0.5">✓</span>
                      <span className="text-nil-text text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:partnerships@nil33.com?subject=Enterprise%20Inquiry"
                  className="block text-center bg-nil-dark border border-nil-border text-nil-white font-medium px-6 py-3 rounded-xl hover:border-nil-green/30 transition-colors text-sm"
                >
                  Contact Sales
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Social Proof ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-nil-dark border border-nil-border rounded-2xl p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-nil-white mb-2">
                  Early traction
                </h2>
                <p className="text-nil-muted text-sm">
                  NIL33 is in active pilot. Here&apos;s where we stand.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8">
                {[
                  { value: "240+", label: "Demo deals scored" },
                  { value: "12", label: "Athletes in pilot" },
                  { value: "33", label: "Valuation factors" },
                  { value: "<1s", label: "Score generation" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-mono font-bold text-nil-white mb-1">
                      {s.value}
                    </div>
                    <div className="text-xs text-nil-muted uppercase tracking-wider">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="h-px w-full mb-8"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)",
                }}
              />

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    quote:
                      "Built by former QB development operators who understand the gap between what athletes are told and what they're worth.",
                    tag: "Origin",
                  },
                  {
                    quote:
                      "Deterministic scoring — same inputs always produce the same output. No black boxes. No subjective adjustments.",
                    tag: "Methodology",
                  },
                  {
                    quote:
                      "State-specific compliance based on actual legislation across all 50 states, not assumptions or outdated precedent.",
                    tag: "Compliance",
                  },
                ].map((item) => (
                  <div key={item.tag} className="flex items-start gap-3">
                    <span className="text-nil-green mt-0.5 shrink-0">✓</span>
                    <div>
                      <p className="text-nil-text text-sm leading-relaxed mb-1">
                        {item.quote}
                      </p>
                      <span className="text-[10px] text-nil-muted uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Ecosystem ─── */}
      <section className="py-20 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-nil-white mb-3">
                The stack
              </h2>
              <p className="text-nil-muted text-sm max-w-md mx-auto">
                NIL33 is the intelligence layer. Under Center is the profile
                layer. Together, they create verified, valued, compliant athletes.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col items-center gap-3">
              {/* Under Center */}
              <div className="bg-nil-black border border-nil-border rounded-xl px-6 py-4 text-center w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center">
                    <span className="text-[#d4a843] font-bold text-[9px]">
                      UC
                    </span>
                  </div>
                  <span className="text-nil-white font-semibold text-sm">
                    Under Center
                  </span>
                </div>
                <p className="text-nil-muted text-xs">
                  Verified quarterback profiles
                </p>
              </div>

              <div className="text-nil-green text-sm">↓ verified metrics</div>

              {/* NIL33 */}
              <div className="bg-nil-green/5 border border-nil-green/20 rounded-xl px-6 py-4 text-center w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
                    <span className="text-nil-green font-bold text-[9px]">
                      33
                    </span>
                  </div>
                  <span className="text-nil-white font-semibold text-sm">
                    NIL33
                  </span>
                </div>
                <p className="text-nil-muted text-xs">
                  Valuation + compliance scoring
                </p>
              </div>

              <div className="text-nil-cyan text-sm">↓ valuation + compliance</div>

              {/* Deal Decision */}
              <div className="bg-nil-black border border-nil-border rounded-xl px-6 py-4 text-center w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-nil-cyan text-sm">📄</span>
                  <span className="text-nil-white font-semibold text-sm">
                    Deal Decision
                  </span>
                </div>
                <p className="text-nil-muted text-xs">
                  Sign with confidence. Auditable receipt.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-3xl font-bold text-nil-white mb-12 text-center">
              Common questions
            </h2>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                q: "Is NIL33 a marketplace?",
                a: "No. NIL33 doesn't broker deals. It scores them. It tells you what a deal is worth, whether it's compliant, and produces a verifiable receipt after it's done.",
              },
              {
                q: "Who is the primary buyer?",
                a: "Collectives and schools managing NIL capital allocation. Athletes get free demo access. Brands can use NIL33 to validate sponsorship pricing.",
              },
              {
                q: "How is the NIL score calculated?",
                a: "33 weighted factors across social reach, athletic performance, market demand, brand alignment, and compliance risk — specific to the athlete's state, school, and conference.",
              },
              {
                q: "Do you cover my state?",
                a: "Yes. NIL33 has compliance rulesets loaded for all 50 states, plus conference-specific institutional rules.",
              },
              {
                q: "Is this free?",
                a: "Demo access is free (5 valuations). Pro plans start at $1,200/month for unlimited valuations. Enterprise pricing is custom.",
              },
              {
                q: "How does this connect to Under Center?",
                a: "Under Center shows verified athlete profiles. NIL33 powers the valuation and compliance data behind those profiles. Together: identity + intelligence.",
              },
            ].map((faq, i) => (
              <Reveal key={faq.q} delay={i * 60}>
                <div className="border-b border-nil-border pb-6">
                  <h3 className="text-nil-white font-semibold mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-nil-muted text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-32 px-6 relative bg-nil-dark border-t border-nil-border">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nil-green/[0.02] to-transparent" />
        <div className="relative max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-nil-white mb-4">
              Stop guessing. Start knowing.
            </h2>
            <p className="text-nil-muted mb-8 max-w-md mx-auto">
              Whether you&apos;re an athlete wondering what you&apos;re worth
              or a collective deciding where to allocate capital — NIL33 gives
              you the number and the risk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#demo"
                className="bg-nil-green text-nil-black font-semibold px-8 py-3.5 rounded-xl hover:bg-nil-green/90 transition-colors text-sm"
              >
                Run Demo Valuation →
              </a>
              <a
                href="mailto:partnerships@nil33.com?subject=NIL33%20Access"
                className="bg-nil-black border border-nil-border text-nil-muted font-medium px-8 py-3.5 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
              >
                Talk to Sales
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-nil-border py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
                <span className="text-nil-green font-bold text-xs">33</span>
              </div>
              <span className="text-nil-white font-medium text-sm">NIL33</span>
              <span className="text-nil-muted text-xs ml-2">
                Valuation + Compliance Intelligence
              </span>
            </div>

            <div className="flex items-center gap-8">
              <a
                href="https://under-center.netlify.app"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Under Center
              </a>
              <a
                href="#pricing"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                API Docs
              </a>
              <a
                href="#"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs text-nil-muted hover:text-nil-white transition-colors"
              >
                Terms
              </a>
            </div>

            <p className="text-xs text-nil-muted">
              © {new Date().getFullYear()} NIL33. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
