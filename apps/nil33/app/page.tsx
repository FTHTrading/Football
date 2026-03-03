"use client";

import { useEffect, useRef, useState } from "react";
import Section, { SectionHeader } from "../components/Section";
import Button from "../components/Button";
import CodePreview, { DataRow, DataDivider } from "../components/CodePreview";

/* ═══ Animated counter ═══ */
function Counter({ end, suffix = "", prefix = "", duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(end * ease));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ═══ Architecture layers ═══ */
const ARCHITECTURE_LAYERS = [
  {
    num: "01",
    title: "Athlete Registry",
    subtitle: "Identity · Metrics · Verification",
    desc: "Structured athlete profiles with verified identity, performance metrics, social reach, and brand alignment data. The canonical source for athlete capital assessment.",
    color: "var(--color-nil-gold)",
  },
  {
    num: "02",
    title: "33-Signal Underwriting",
    subtitle: "Scoring · Valuation · Risk",
    desc: "Proprietary 33-signal engine scores every athlete across revenue durability, sponsor concentration, engagement quality, eligibility risk, and reputational volatility.",
    color: "var(--color-nil-blue)",
  },
  {
    num: "03",
    title: "Portfolio Intelligence",
    subtitle: "VaR · Concentration · Forecasting",
    desc: "Portfolio-level analytics: sport/conference concentration, brand exposure overlap, cohort performance tracking, cashflow calendar, and stress-test modeling.",
    color: "var(--color-nil-emerald)",
  },
  {
    num: "04",
    title: "Deal Execution",
    subtitle: "Structuring · Settlement · Custody",
    desc: "Product factory for NIL-linked instruments — revenue participation notes, structured advances, sponsor-backed facilities. Automated settlement and reconciliation.",
    color: "var(--color-nil-gold)",
  },
  {
    num: "05",
    title: "Governance & Reporting",
    subtitle: "Compliance · Audit · Documentation",
    desc: "50-state compliance engine, BD supervision workflows, SEC-ready audit trails, investor reporting, and regulatory documentation. Every action timestamped and signed.",
    color: "var(--color-nil-purple)",
  },
  {
    num: "06",
    title: "Capital & Distribution",
    subtitle: "Investors · Allocation · Returns",
    desc: "LP/GP structuring, capital call workflow, distribution waterfall, investor portal, K-1 generation, and NAV calculation. Institutional-grade fund administration.",
    color: "var(--color-nil-blue)",
  },
];

/* ═══ Target agencies ═══ */
const TARGET_AGENCIES = [
  "CAA Sports", "Wasserman", "Excel Sports", "Klutch Sports", "Roc Nation Sports",
  "WME Sports", "Athletes First", "Octagon", "Landmark Sports", "Priority Sports",
];

export default function Home() {
  return (
    <>
      {/* ═══ 1 · HERO — Institutional, full-bleed ═══ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-nil-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(198,167,94,0.04),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(30,79,255,0.03),transparent_50%)]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(198,167,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(198,167,94,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-4xl">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-nil-gold/[0.08] border border-nil-gold/20 rounded-full px-4 py-1.5 mb-8 animate-fade-down">
              <span className="w-2 h-2 rounded-full bg-nil-gold animate-pulse" />
              <span className="text-nil-gold text-xs font-semibold tracking-wide">INSTITUTIONAL INFRASTRUCTURE · 50 STATES</span>
            </div>

            <h1 className="space-y-2">
              <span className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold text-nil-white leading-[1.05] tracking-tight">
                THE PE OPERATING SYSTEM
              </span>
              <span className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight">
                <span className="text-nil-white">FOR </span>
                <span className="gradient-text">ELITE SPORTS AGENCIES.</span>
              </span>
            </h1>

            <p className="mt-8 text-xl text-nil-muted max-w-2xl leading-relaxed">
              Underwriting, compliance, and portfolio intelligence infrastructure
              for NIL-linked alternative investments. Built for agencies that
              originate. Trusted by broker-dealers that distribute.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Partnership%20Inquiry" size="lg" external>
                Request Access →
              </Button>
              <Button href="/products" variant="secondary" size="lg">
                View Platform
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-xs text-nil-muted">
              <span className="flex items-center gap-1.5"><span className="text-nil-gold">◆</span> 33-Signal Underwriting</span>
              <span className="flex items-center gap-1.5"><span className="text-nil-blue">◆</span> Portfolio Intelligence</span>
              <span className="flex items-center gap-1.5"><span className="text-nil-purple">◆</span> 50-State Compliance</span>
              <span className="flex items-center gap-1.5"><span className="text-nil-emerald">◆</span> BD Supervision Ready</span>
            </div>
          </div>

          {/* Counter tiles */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: 33, suffix: "", label: "Underwriting Signals", color: "text-nil-gold", border: "border-nil-gold/20" },
              { value: 50, suffix: "+", label: "State Rulesets", color: "text-nil-blue", border: "border-nil-blue/20" },
              { value: 6, suffix: "", label: "Architecture Layers", color: "text-nil-emerald", border: "border-nil-emerald/20" },
              { value: 0, suffix: "", label: "Compliance Gaps", color: "text-nil-purple", border: "border-nil-purple/20", isStatic: true },
            ].map((t) => (
              <div key={t.label} className={`glass rounded-2xl p-5 border ${t.border} card-lift`}>
                <p className={`font-mono text-3xl sm:text-4xl font-extrabold ${t.color}`}>
                  {"isStatic" in t ? "0" : <Counter end={t.value} suffix={t.suffix} prefix={""} />}
                </p>
                <p className="text-nil-muted text-[10px] mt-1.5 tracking-[0.15em] uppercase font-medium">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2 · BROADCAST TICKER — Institutional tone ═══ */}
      <div className="border-y border-nil-gold/10 bg-nil-dark/80 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-[13px] font-mono">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex gap-12 shrink-0 text-nil-muted/70">
              <span><span className="text-nil-gold">◆</span> 33-SIGNAL UNDERWRITING ENGINE</span>
              <span><span className="text-nil-blue">◆</span> PORTFOLIO VAR MODELING</span>
              <span><span className="text-nil-purple">◆</span> 50-STATE COMPLIANCE AUTOMATION</span>
              <span><span className="text-nil-emerald">◆</span> INSTITUTIONAL AUDIT TRAIL</span>
              <span><span className="text-nil-gold">◆</span> SPV STRUCTURING & SETTLEMENT</span>
              <span><span className="text-nil-blue">◆</span> BD SUPERVISION WORKFLOW</span>
              <span className="text-nil-gold/40">NIL33 CAPITAL INTELLIGENCE PLATFORM</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 3 · POSITIONING STATEMENT ═══ */}
      <section className="py-24 px-6 bg-nil-dark/40">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-overline mb-6">WHY NIL33</p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold text-nil-white leading-tight mb-8">
            Athlete capital is a{" "}
            <span className="gradient-text">$1.7B asset class</span>{" "}
            running on spreadsheets and handshakes.
          </h2>
          <p className="text-nil-muted text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Elite sports agencies control the origination pipeline — the athletes, the relationships,
            the deal flow. But they lack the institutional infrastructure to structure, underwrite,
            and distribute athlete-linked capital products. NIL33 builds the rails.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$1.7B+", label: "NIL Market Size", sub: "And accelerating" },
              { value: "6", label: "Product Families", sub: "Structured for distribution" },
              { value: "33", label: "Scoring Signals", sub: "Per athlete assessment" },
              { value: "50+", label: "Jurisdictions", sub: "Compliance coverage" },
            ].map((s) => (
              <div key={s.label} className="group">
                <p className="text-nil-white font-mono text-3xl sm:text-4xl font-extrabold tracking-tight group-hover:text-nil-gold transition-colors">
                  {s.value}
                </p>
                <p className="text-nil-white text-sm font-semibold mt-2">{s.label}</p>
                <p className="text-nil-muted text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4 · ARCHITECTURE — 6 Layers ═══ */}
      <Section>
        <SectionHeader
          center
          overline="Architecture"
          title="Six layers. One institutional stack."
          subtitle="From athlete data ingestion to investor distribution — every layer purpose-built for compliance, auditability, and scale."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <div key={layer.num} className="rounded-2xl border border-nil-border/60 bg-nil-dark/60 p-7 card-lift group">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold border"
                  style={{
                    color: layer.color,
                    borderColor: layer.color,
                    backgroundColor: `color-mix(in srgb, ${layer.color} 8%, transparent)`,
                  }}
                >
                  {layer.num}
                </span>
                <div>
                  <h3 className="text-nil-white font-semibold text-base">{layer.title}</h3>
                  <p className="text-nil-muted text-[10px] uppercase tracking-wider">{layer.subtitle}</p>
                </div>
              </div>
              <p className="text-nil-muted text-sm leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ 5 · DUAL AUDIENCE — Agencies & Broker-Dealers ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* For Agencies */}
          <div className="rounded-2xl border border-nil-gold/20 bg-nil-black/60 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-nil-gold/10 border border-nil-gold/20 flex items-center justify-center">
                <span className="text-nil-gold text-lg">◆</span>
              </span>
              <div>
                <p className="text-nil-gold text-[10px] font-bold tracking-[0.15em] uppercase">Supply Side</p>
                <h3 className="text-nil-white font-bold text-xl">For Elite Agencies</h3>
              </div>
            </div>
            <p className="text-nil-muted text-sm leading-relaxed mb-6">
              You control the supply — the athletes, the relationships, the origination pipeline.
              NIL33 gives you the infrastructure to turn that access into structured capital products.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Athlete capital dashboard with 33-signal scoring",
                "Structured advance & revenue participation tools",
                "Portfolio intelligence — concentration, exposure, VaR",
                "Sponsor optimization & brand valuation analytics",
                "Automated underwriting memo generation",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-gold text-xs mt-0.5">◆</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Button href="mailto:partnerships@nil33.com?subject=Agency%20Partnership" variant="primary" size="sm" external>
              Agency Partnership →
            </Button>
          </div>

          {/* For Broker-Dealers */}
          <div className="rounded-2xl border border-nil-blue/20 bg-nil-black/60 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-nil-blue/10 border border-nil-blue/20 flex items-center justify-center">
                <span className="text-nil-blue text-lg">◈</span>
              </span>
              <div>
                <p className="text-nil-blue text-[10px] font-bold tracking-[0.15em] uppercase">Distribution Side</p>
                <h3 className="text-nil-white font-bold text-xl">For Broker-Dealers</h3>
              </div>
            </div>
            <p className="text-nil-muted text-sm leading-relaxed mb-6">
              You need supervision, compliance, and auditability before touching athlete-linked
              products. NIL33 provides the infrastructure your compliance team requires.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "BD supervision & suitability workflow",
                "50-state compliance automation with citations",
                "SEC-ready audit trails on every transaction",
                "Investor reporting & distribution waterfall",
                "Risk modeling & portfolio stress testing",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-blue text-xs mt-0.5">◈</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Button href="mailto:partnerships@nil33.com?subject=BD%20Partnership" variant="secondary" size="sm" external>
              BD Partnership →
            </Button>
          </div>
        </div>
      </Section>

      {/* ═══ 6 · 33-SIGNAL ENGINE — Technical Authority ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-overline mb-5">Underwriting</p>
            <h2 className="text-h1 text-nil-white mb-4">
              33 signals.
              <span className="gradient-text"> One score.</span>
            </h2>
            <p className="text-nil-muted text-body-lg mb-8 leading-relaxed">
              Every athlete assessment runs through our proprietary 33-signal underwriting
              engine. Six risk dimensions, weighted by instrument type, producing a composite
              score and institutional-grade underwriting memo.
            </p>
            <div className="space-y-3">
              {[
                { icon: "◆", text: "Revenue durability — contract tenure, earning trajectory, market depth", color: "text-nil-gold" },
                { icon: "◆", text: "Sponsor concentration — top-3 dependency, category diversity, renewal rates", color: "text-nil-blue" },
                { icon: "◆", text: "Engagement quality — authentic reach, conversion signals, audience demographics", color: "text-nil-emerald" },
                { icon: "◆", text: "Eligibility & transfer risk — NCAA status, portal probability, draft timeline", color: "text-nil-purple" },
                { icon: "◆", text: "Injury & availability — position risk, medical history, workload metrics", color: "text-nil-gold" },
                { icon: "◆", text: "Reputational volatility — sentiment analysis, controversy exposure, brand safety", color: "text-nil-blue" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className={`${item.color} text-xs mt-1`}>{item.icon}</span>
                  <span className="text-nil-text text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <CodePreview title="nil33 underwrite --athlete $ID --instrument rev-participation">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Arch Manning — QB, Texas Longhorns" />
              <DataRow label="Instrument" value="Revenue Participation Note" />
              <DataRow label="Assessment" value={<span className="text-nil-gold font-bold text-xl">94</span>} />
              <DataDivider />
              <DataRow label="Revenue Durability" value={<span className="text-nil-gold">91/99</span>} />
              <DataRow label="Sponsor Concentration" value={<span className="text-nil-blue">88/99</span>} />
              <DataRow label="Engagement Quality" value={<span className="text-nil-emerald">95/99</span>} />
              <DataRow label="Eligibility Risk" value={<span className="text-nil-gold">97/99</span>} />
              <DataRow label="Injury/Availability" value={<span className="text-nil-purple">89/99</span>} />
              <DataRow label="Reputational Vol" value={<span className="text-nil-blue">93/99</span>} />
              <DataDivider />
              <DataRow label="Facility Size" value="$3.2M–$4.5M" />
              <DataRow label="Compliance" value={<span className="text-nil-emerald font-bold">50/50 States — Pass</span>} />
              <DataRow label="Memo Status" value={<span className="text-nil-gold">Generated · PDF Ready</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ 7 · COMPLIANCE & GOVERNANCE ═══ */}
      <section className="py-24 px-6 bg-nil-dark/60 border-y border-nil-border/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-overline mb-5">Governance</p>
            <h2 className="text-h1 text-nil-white mb-4">
              50-state compliance.{" "}
              <span className="gradient-text-blue">Institutional audit trail.</span>
            </h2>
            <p className="text-nil-muted text-body-lg max-w-2xl mx-auto">
              Every transaction, every assessment, every distribution — timestamped, signed,
              and audit-ready. NIL33 maintains structured compliance rulesets for every
              jurisdiction with active NIL legislation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "50-State Engine",
                desc: "Structured rulesets covering state NIL statutes, conference regulations, NCAA guidelines, and SEC requirements. Updated as legislation evolves.",
                detail: "Automated compliance check on every transaction",
                color: "var(--color-nil-gold)",
                border: "border-nil-gold/20",
              },
              {
                title: "BD Supervision",
                desc: "Suitability assessment, concentration limits, risk tolerance matching, and supervisory approval workflow for broker-dealer distribution.",
                detail: "Pre-trade compliance · Post-trade surveillance",
                color: "var(--color-nil-blue)",
                border: "border-nil-blue/20",
              },
              {
                title: "Audit Infrastructure",
                desc: "Append-only ledger, cryptographic signatures, document versioning. Every action generates a permanent, tamper-evident record.",
                detail: "SHA-256 hashing · Ed25519 signatures",
                color: "var(--color-nil-purple)",
                border: "border-nil-purple/20",
              },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border ${item.border} bg-nil-dark/60 p-7 card-lift`}>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      color: item.color,
                      backgroundColor: `color-mix(in srgb, ${item.color} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${item.color} 20%, transparent)`,
                    }}
                  >
                    ◈
                  </span>
                  <h3 className="text-nil-white font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-nil-muted text-sm leading-relaxed mb-5">{item.desc}</p>
                <div className="bg-nil-black/60 rounded-xl px-4 py-2.5 border border-nil-border/30">
                  <p className="font-mono text-xs" style={{ color: item.color }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8 · PRODUCT FAMILIES ═══ */}
      <Section>
        <SectionHeader
          center
          overline="Products"
          title="Six product families. Structured for scale."
          subtitle="Each product type maps to specific athlete revenue streams, risk profiles, and investor appetites. All built on shared underwriting and compliance infrastructure."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {[
            { title: "Revenue Participation Notes", desc: "Fractional interest in athlete NIL revenue streams. Quarterly distributions tied to verified earnings.", icon: "01" },
            { title: "Structured Advances", desc: "Capital advances against future NIL earnings with structured repayment schedules and covenant protections.", icon: "02" },
            { title: "Sponsor-Backed Facilities", desc: "Credit facilities collateralized by contracted sponsorship revenue. Known cashflows, reduced risk.", icon: "03" },
            { title: "Portfolio Instruments", desc: "Diversified exposure across athlete cohorts — by sport, conference, or revenue type. Portfolio-level risk management.", icon: "04" },
            { title: "Agency Credit Lines", desc: "Working capital facilities for agencies, secured against portfolio-level athlete revenue projections.", icon: "05" },
            { title: "Data & Analytics Licenses", desc: "API access to 33-signal scoring, portfolio intelligence, and compliance infrastructure for institutional partners.", icon: "06" },
          ].map((product) => (
            <div key={product.icon} className="rounded-2xl border border-nil-border/60 bg-nil-dark/60 p-7 hover:border-nil-gold/20 transition-all card-lift">
              <span className="font-mono text-sm font-bold text-nil-gold mb-4 block">{product.icon}</span>
              <h3 className="text-nil-white font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-nil-muted text-sm leading-relaxed">{product.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ 9 · AGENCY ECOSYSTEM ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-overline mb-5">Ecosystem</p>
            <h2 className="text-h1 text-nil-white mb-4">
              Built for the agencies that
              <span className="gradient-text"> control the supply.</span>
            </h2>
            <p className="text-nil-muted text-body-lg mb-8 leading-relaxed">
              The top 10 sports agencies represent thousands of elite athletes and billions
              in aggregate NIL value. NIL33 provides the institutional infrastructure
              that turns agency relationships into structured capital products.
            </p>
            <div className="space-y-4">
              {[
                { step: "01", text: "Agency onboards athlete roster to NIL33 registry", color: "text-nil-gold" },
                { step: "02", text: "33-signal engine scores each athlete across 6 risk dimensions", color: "text-nil-blue" },
                { step: "03", text: "Portfolio intelligence identifies optimal structuring", color: "text-nil-emerald" },
                { step: "04", text: "Product factory generates investor-ready instruments", color: "text-nil-purple" },
                { step: "05", text: "Compliance engine clears 50-state regulatory requirements", color: "text-nil-gold" },
                { step: "06", text: "BD partners distribute to qualified investors", color: "text-nil-blue" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4 group">
                  <span className={`font-mono text-sm font-bold ${s.color} mt-0.5 w-6`}>{s.step}</span>
                  <div className="flex-1 border-b border-nil-border/20 pb-4 group-last:border-0">
                    <span className="text-nil-text text-sm">{s.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target agencies */}
          <div className="space-y-6">
            <p className="text-nil-muted text-xs uppercase tracking-[0.15em] font-semibold">Target Agency Partners</p>
            <div className="grid grid-cols-2 gap-3">
              {TARGET_AGENCIES.map((agency) => (
                <div key={agency} className="bg-nil-black/60 border border-nil-border/40 rounded-xl px-5 py-4 text-center hover:border-nil-gold/20 transition-colors">
                  <span className="text-nil-white text-sm font-medium">{agency}</span>
                </div>
              ))}
            </div>
            <div className="bg-nil-black/40 border border-nil-gold/10 rounded-2xl p-6 mt-6">
              <p className="text-nil-gold text-[10px] font-bold tracking-[0.15em] uppercase mb-3">Agency Value Proposition</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-nil-muted">Portfolio scoring</span>
                  <span className="text-nil-white font-mono">Full roster analytics</span>
                </div>
                <div className="h-px bg-nil-border/20" />
                <div className="flex justify-between">
                  <span className="text-nil-muted">Revenue monetization</span>
                  <span className="text-nil-white font-mono">6 product families</span>
                </div>
                <div className="h-px bg-nil-border/20" />
                <div className="flex justify-between">
                  <span className="text-nil-muted">Compliance burden</span>
                  <span className="text-nil-emerald font-mono">Automated</span>
                </div>
                <div className="h-px bg-nil-border/20" />
                <div className="flex justify-between">
                  <span className="text-nil-muted">Time to market</span>
                  <span className="text-nil-gold font-mono">Weeks, not months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 10 · THE THESIS ═══ */}
      <section className="py-24 px-6 border-y border-nil-border/30 bg-nil-dark/30">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-overline mb-6">THE THESIS</p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold text-nil-white leading-tight mb-8">
            Not a sports app. Not a marketplace.{" "}
            <span className="gradient-text">Underwriting + compliance infrastructure.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-nil-black/60 border border-nil-border/40 rounded-2xl p-8">
              <p className="text-nil-muted text-sm mb-3 font-semibold">What exists today</p>
              <p className="text-nil-red/80 font-mono text-lg font-bold mb-4">Spreadsheets</p>
              <p className="text-nil-muted text-xs leading-relaxed">
                Agencies value athletes with gut feel. BDs have no compliance framework for NIL products.
                Investors have no underwriting data. Everyone guesses.
              </p>
            </div>
            <div className="bg-nil-black/60 border border-nil-gold/20 rounded-2xl p-8 glow-gold">
              <p className="text-nil-gold text-sm mb-3 font-semibold">What NIL33 builds</p>
              <p className="text-nil-gold font-mono text-lg font-bold mb-4">Infrastructure</p>
              <p className="text-nil-muted text-xs leading-relaxed">
                Systematic underwriting. Automated compliance. Portfolio analytics.
                Settlement rails. The institutional stack that makes athlete capital
                investable.
              </p>
            </div>
            <div className="bg-nil-black/60 border border-nil-border/40 rounded-2xl p-8">
              <p className="text-nil-muted text-sm mb-3 font-semibold">What this enables</p>
              <p className="text-nil-blue font-mono text-lg font-bold mb-4">Scale</p>
              <p className="text-nil-muted text-xs leading-relaxed">
                Agencies originate at volume. BDs distribute with confidence.
                Investors allocate with data. A new asset class becomes institutional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 11 · CTA — Institutional ═══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-nil-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(198,167,94,0.06),transparent_60%)]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(rgba(198,167,94,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(198,167,94,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-nil-gold/[0.08] border border-nil-gold/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-nil-gold animate-pulse" />
            <span className="text-nil-gold text-xs font-semibold tracking-wide">NOW ACCEPTING PARTNERSHIP INQUIRIES</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-nil-white leading-[1.1] mb-6">
            The infrastructure layer for<br />
            <span className="gradient-text">athlete capital markets.</span>
          </h2>
          <p className="text-nil-muted text-lg mb-10 max-w-lg mx-auto">
            Whether you&apos;re an agency looking to monetize athlete capital or a broker-dealer
            seeking compliant distribution rails — NIL33 is your operating system.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Partnership%20Inquiry" size="lg" external>
              Request Access →
            </Button>
            <Button href="/products" variant="secondary" size="lg">
              Explore the Platform
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-nil-muted/50 font-mono">
            <span>Elite Sports Agencies</span>
            <span className="text-nil-gold/30">·</span>
            <span>Registered Broker-Dealers</span>
            <span className="text-nil-gold/30">·</span>
            <span>Institutional Investors</span>
          </div>
        </div>
      </section>
    </>
  );
}
