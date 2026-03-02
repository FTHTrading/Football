"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Section, { SectionHeader } from "../components/Section";
import { FeatureCard } from "../components/Card";
import Card from "../components/Card";
import Button from "../components/Button";
import CodePreview, { DataRow, DataDivider } from "../components/CodePreview";
import Badge from "../components/Badge";
import { InlineStat } from "../components/Stat";
import { ScoreBar } from "../components/ScoreDisplay";

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

/* ═══ Rotating words ═══ */
function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % words.length), 2400); return () => clearInterval(t); }, [words.length]);
  return (
    <span className="inline-block relative h-[1.2em] overflow-hidden align-bottom">
      {words.map((w, idx) => (
        <span key={w} className={`absolute left-0 transition-all duration-500 ${idx === i ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>{w}</span>
      ))}
    </span>
  );
}

/* ═══ Verified athletes from Under Center ═══ */
const VERIFIED_ATHLETES = [
  {
    id: "6", name: "Andre Mitchell", pos: "QB", school: "IMG Academy", state: "Florida",
    conference: "Independent", gradYear: 2026, rating: 5.0, image: "/images/athlete-action.png",
    metrics: { velocity: 63.4, release: 0.35, accuracy: 93, mechanics: 95 },
    nil: { composite: 91, low: 168000, high: 218000, social: 88, athletic: 95, market: 89, brand: 92 },
    offers: ["Alabama", "Georgia", "Ohio State", "Clemson", "Texas", "USC", "Oregon", "Notre Dame"],
    comp: "Trevor Lawrence",
  },
  {
    id: "4", name: "Dylan Park", pos: "QB", school: "Archbishop Moeller", state: "Ohio",
    conference: "Big Ten", gradYear: 2026, rating: 4.0, image: "/images/qb3.png",
    metrics: { velocity: 60.1, release: 0.36, accuracy: 91, mechanics: 89 },
    nil: { composite: 78, low: 82000, high: 106000, social: 65, athletic: 81, market: 82, brand: 78 },
    offers: ["Ohio State", "Notre Dame", "Michigan", "Penn State", "Clemson"],
    comp: "Joe Burrow",
  },
  {
    id: "1", name: "Jaxon Smith", pos: "QB", school: "Westlake HS", state: "Texas",
    conference: "Big 12", gradYear: 2026, rating: 4.5, image: "/images/qb4.png",
    metrics: { velocity: 61.8, release: 0.38, accuracy: 88, mechanics: 92 },
    nil: { composite: 84, low: 112000, high: 145000, social: 82, athletic: 87, market: 85, brand: 80 },
    offers: ["Alabama", "Ohio State", "Georgia", "Texas", "USC"],
    comp: "Patrick Mahomes",
  },
  {
    id: "2", name: "Marcus Rivera", pos: "QB", school: "Mater Dei HS", state: "California",
    conference: "Pac-12", gradYear: 2026, rating: 4.0, image: "/images/qb5.png",
    metrics: { velocity: 58.2, release: 0.41, accuracy: 90, mechanics: 85 },
    nil: { composite: 76, low: 72000, high: 94000, social: 78, athletic: 74, market: 79, brand: 72 },
    offers: ["Oregon", "USC", "Miami", "LSU"],
    comp: "Lamar Jackson",
  },
];

export default function Home() {
  const featured = VERIFIED_ATHLETES[0]; // Andre Mitchell

  return (
    <>
      {/* ═══ 1 · HERO — full-bleed with QB image ═══ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/qb.png" alt="" fill className="object-cover object-top" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-nil-black via-nil-black/85 to-nil-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-nil-black via-transparent to-nil-black/60" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-2xl">
            <p className="text-overline mb-6 tracking-[0.2em]">Capital Discipline Software</p>

            <h1 className="space-y-1">
              <span className="block text-[clamp(3rem,7vw,5.5rem)] font-extrabold text-nil-white leading-[0.95] tracking-tight">EVERY</span>
              <span className="block text-[clamp(3rem,7vw,5.5rem)] font-extrabold text-nil-white leading-[0.95] tracking-tight">DOLLAR</span>
              <span className="block text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight gradient-text">ACCOUNTABLE.</span>
            </h1>

            <p className="mt-8 text-xl text-nil-muted max-w-lg leading-relaxed">
              Score athletes across{" "}
              <RotatingWord words={["33 factors", "4 categories", "50 states", "every conference", "every deal"]} />
              <br />
              before capital moves.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/demo" size="lg">Score a Deal →</Button>
              <Button href="/athletes" variant="ghost" size="lg">View Verified Athletes</Button>
            </div>
          </div>

          {/* Counter tiles */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: 33, suffix: "", label: "Scoring Factors", color: "text-nil-green" },
              { value: 50, suffix: "+", label: "State Rulesets", color: "text-nil-cyan" },
              { value: 2400000, prefix: "$", suffix: "", label: "Deals Scored", color: "text-nil-gold" },
              { value: 0, suffix: "", label: "Overpays Missed", color: "text-nil-purple", static: true },
            ].map((t) => (
              <div key={t.label} className="glass rounded-2xl p-5 border border-nil-border/40">
                <p className={`font-mono text-3xl sm:text-4xl font-bold ${t.color}`}>
                  {'static' in t ? "0" : <Counter end={t.value} suffix={t.suffix} prefix={t.prefix || ""} />}
                </p>
                <p className="text-nil-muted text-xs mt-1 tracking-wide uppercase">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2 · BROADCAST TICKER ═══ */}
      <div className="border-y border-nil-border/40 bg-nil-dark/80 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-[13px] font-mono">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex gap-12 shrink-0">
              <span><span className="text-nil-green">▲</span> Andre Mitchell — 91/99 — $168K–$218K — <span className="text-nil-green">FL: Pass</span></span>
              <span><span className="text-nil-cyan">▲</span> Jaxon Smith — 84/99 — $112K–$145K — <span className="text-nil-green">TX: Pass</span></span>
              <span><span className="text-nil-gold">▲</span> Dylan Park — 78/99 — $82K–$106K — <span className="text-nil-green">OH: Pass</span></span>
              <span><span className="text-nil-purple">▲</span> Marcus Rivera — 76/99 — $72K–$94K — <span className="text-nil-green">CA: Pass</span></span>
              <span className="text-nil-muted">NIL33 ENGINE v3.2 · Ed25519 SIGNED · 50-STATE COMPLIANT</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 3 · POWERED BY UNDER CENTER ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-overline mb-5">Verified Pipeline</p>
            <h2 className="text-h1 text-nil-white mb-4">
              Under Center verifies.
              <span className="gradient-text"> NIL33 values.</span>
            </h2>
            <p className="text-nil-muted text-body-lg mb-8 leading-relaxed">
              Every athlete scored by NIL33 is first verified through Under Center&apos;s
              identity and metrics platform. Velocity, release time, accuracy — measured,
              hashed, and signed before a single dollar is discussed.
            </p>
            <div className="space-y-3">
              {[
                { step: "01", text: "Under Center captures and verifies athlete metrics", color: "text-nil-cyan" },
                { step: "02", text: "Identity hash created with SHA-256 + Ed25519 signature", color: "text-nil-green" },
                { step: "03", text: "NIL33 ingests verified identity into 33-factor scoring", color: "text-nil-gold" },
                { step: "04", text: "Valuation, compliance check, and receipt generated", color: "text-nil-purple" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className={`font-mono text-sm font-bold ${s.color} mt-0.5`}>{s.step}</span>
                  <span className="text-nil-text text-sm">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured athlete card */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-nil-border/60 bg-nil-dark/80">
              <div className="relative h-64 sm:h-80">
                <Image src={featured.image} alt={featured.name} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-nil-dark via-nil-dark/30 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge status="pass" label="UC Verified" />
                  <span className="bg-nil-gold/20 text-nil-gold text-[10px] font-bold px-2.5 py-1 rounded-full border border-nil-gold/30">
                    ★ {featured.rating}
                  </span>
                </div>
                <div className="absolute bottom-4 left-5">
                  <p className="text-nil-white font-bold text-2xl">{featured.name}</p>
                  <p className="text-nil-muted text-sm">{featured.pos} · {featured.school} · Class of {featured.gradYear}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* UC Metrics */}
                <div>
                  <p className="text-nil-cyan text-[10px] font-bold tracking-[0.15em] uppercase mb-2">Under Center Metrics</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Velocity", value: `${featured.metrics.velocity}`, unit: "MPH" },
                      { label: "Release", value: `${featured.metrics.release}`, unit: "sec" },
                      { label: "Accuracy", value: `${featured.metrics.accuracy}`, unit: "%" },
                      { label: "Mechanics", value: `${featured.metrics.mechanics}`, unit: "/100" },
                    ].map((m) => (
                      <div key={m.label} className="text-center">
                        <p className="text-nil-white font-mono text-lg font-bold">{m.value}</p>
                        <p className="text-nil-muted text-[9px] uppercase">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-nil-border/40" />

                {/* NIL33 Valuation */}
                <div>
                  <p className="text-nil-green text-[10px] font-bold tracking-[0.15em] uppercase mb-2">NIL33 Valuation</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-nil-muted text-sm">Composite Score</span>
                    <span className="text-nil-green font-mono text-3xl font-extrabold">{featured.nil.composite}<span className="text-nil-muted text-sm font-normal">/99</span></span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-nil-muted text-sm">Fair Value Range</span>
                    <span className="text-nil-white font-mono text-sm font-bold">${featured.nil.low.toLocaleString()} – ${featured.nil.high.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <ScoreBar label="Social" value={featured.nil.social} color="var(--color-nil-green)" />
                    <ScoreBar label="Athletic" value={featured.nil.athletic} color="var(--color-nil-cyan)" />
                    <ScoreBar label="Market" value={featured.nil.market} color="var(--color-nil-purple)" />
                    <ScoreBar label="Brand" value={featured.nil.brand} color="var(--color-nil-gold)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 4 · THREE ENGINES ═══ */}
      <Section>
        <SectionHeader
          overline="The platform"
          title="Three engines. One decision layer."
          subtitle="Every deal runs through valuation, compliance, and documentation before a dollar moves."
        />
        <div className="grid md:grid-cols-3 gap-6 stagger">
          <FeatureCard
            number="01"
            numberColor="var(--color-nil-green)"
            title="Valuation Engine"
            description="33 weighted factors — social reach, athletic performance, conference market, brand alignment — produce a composite score and dollar range."
            detail="Score: 91/99 → $168K–$218K"
          />
          <FeatureCard
            number="02"
            numberColor="var(--color-nil-cyan)"
            title="Compliance Engine"
            description="Instant check against the athlete's state NIL law, conference rules, and current NCAA guidelines. Pass, review, or fail — with citations."
            detail="FL: Pass · IND: Pass · NCAA: Pass"
          />
          <FeatureCard
            number="03"
            numberColor="var(--color-nil-purple)"
            title="Deal Receipts"
            description="Every deal gets a timestamped, cryptographically signed record. Show your board, your donors, or the NCAA exactly what you evaluated."
            detail="NIL33-2026-00847 · Ed25519"
          />
        </div>
      </Section>

      {/* ═══ 5 · LIVE DEAL SCORING — Andre Mitchell ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              overline="Live output"
              title="What a scored deal looks like."
              subtitle={`This is Andre Mitchell — 5-star QB, IMG Academy. Verified by Under Center. Scored by NIL33. Every deal your collective evaluates produces a structured, auditable record like this.`}
            />
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Badge status="pass" label="FL State Law" />
              <Badge status="pass" label="Independent" />
              <Badge status="pass" label="NCAA Guidelines" />
            </div>
            <div className="mt-6">
              <Button href="/demo" variant="ghost" size="sm">Try with your own athlete →</Button>
            </div>
          </div>

          <CodePreview title="nil33 score-deal --athlete mitchell --output json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Andre Mitchell — QB, IMG Academy" />
              <DataRow label="UC Verified" value={<span className="text-nil-cyan">✓ SHA-256 + Ed25519</span>} />
              <DataRow label="Composite Score" value={<span className="text-nil-green font-bold text-xl">91</span>} />
              <DataRow label="Valuation Band" value="$168,000 – $218,000" />
              <DataRow label="Proposed Deal" value={<span className="text-nil-white">$195,000</span>} />
              <DataDivider />
              <DataRow label="Overpay" value={<span className="text-nil-green font-bold">$0 — within range</span>} />
              <DataRow label="State Law" value={<span className="text-nil-green">Pass — FL Stat § 1006.74</span>} />
              <DataRow label="NCAA" value={<span className="text-nil-green">Pass — within fair value</span>} />
              <DataDivider />
              <DataRow label="Receipt ID" value="NIL33-2026-01094" />
              <DataRow label="Timestamp" value={new Date().toISOString().split("T")[0]} />
              <DataRow label="Signature" value={<span className="text-nil-purple text-xs">ed25519:a4f8…d72e</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ 6 · VERIFIED ROSTER PREVIEW ═══ */}
      <Section>
        <SectionHeader
          center
          overline="Verified Athletes"
          title="Under Center athletes. NIL33 valuations."
          subtitle="Every athlete on this roster has been identity-verified, metrics-captured, and scored through the NIL33 engine."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {VERIFIED_ATHLETES.map((a) => (
            <div key={a.id} className="group rounded-2xl border border-nil-border/60 bg-nil-dark/60 overflow-hidden hover:border-nil-green/30 transition-all">
              <div className="relative h-48">
                <Image src={a.image} alt={a.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-nil-dark to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="bg-nil-green/20 text-nil-green text-[9px] font-bold px-2 py-0.5 rounded-full border border-nil-green/30">
                    {a.nil.composite}/99
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-nil-white font-semibold">{a.name}</p>
                <p className="text-nil-muted text-xs">{a.pos} · {a.school}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-nil-green font-mono text-sm font-bold">${(a.nil.low / 1000).toFixed(0)}K–${(a.nil.high / 1000).toFixed(0)}K</span>
                  <span className="text-[9px] text-nil-muted uppercase">Fair Value</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/athletes" variant="secondary" size="lg">View Full Roster →</Button>
        </div>
      </Section>

      {/* ═══ 7 · PROBLEM / SOLUTION ═══ */}
      <Section dark>
        <div className="max-w-3xl">
          <SectionHeader
            title="The problem is capital without discipline."
          />
          <div className="space-y-6 text-[15px] text-nil-muted leading-relaxed">
            <p>
              Collectives spend $500K–$5M per cycle on athlete deals with no fair-market
              reference. Agents set the price. Collectives pay it. Nobody documents
              whether it was right.
            </p>
            <p>
              When the board asks how the money was spent, you pull up a spreadsheet.
              When the NCAA asks for deal documentation, you don&apos;t have any.
              When a state attorney general investigates NIL compliance, you hope
              you&apos;re covered.
            </p>
            <p className="text-nil-white font-medium">
              NIL33 gives you the number, the compliance check, and the paper trail —
              before you wire the money.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ 8 · ROI ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <SectionHeader
            overline="ROI"
            title="Catch one overpay. Paid for the year."
            subtitle="Most collectives see 5x–10x return. The math is simple."
          />
          <div className="bg-nil-black border border-nil-border/60 rounded-2xl p-8">
            <InlineStat label="NIL33 Pro (monthly)" value="$1,200" />
            <InlineStat label="NIL33 Pro (annual)" value="$14,400" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="Avg. overpay caught per deal" value="$28,000" valueColor="var(--color-nil-red)" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="Deals to break even" value="1" valueColor="var(--color-nil-green)" />
            <div className="mt-6">
              <Button href="/pricing" variant="ghost" size="sm">See all pricing →</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 9 · BUILT FOR ═══ */}
      <Section dark>
        <SectionHeader
          center
          overline="Built for"
          title="Every stakeholder in the NIL ecosystem."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {[
            { title: "Collectives", desc: "Validate deals, document decisions, protect capital.", href: "/collectives" },
            { title: "Compliance Officers", desc: "50-state law checks, conference rules, NCAA tracking.", href: "/product" },
            { title: "Board Members", desc: "Audit-ready receipts for every dollar allocated.", href: "/product" },
            { title: "Developers", desc: "REST API, Rust engine, deterministic scoring.", href: "/developers" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <div className="bg-nil-dark/60 border border-nil-border/60 rounded-2xl p-6 h-full hover:border-nil-green/20 transition-colors">
                <h3 className="text-nil-white font-semibold text-lg mb-2 group-hover:text-nil-green transition-colors">{item.title}</h3>
                <p className="text-nil-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ═══ 10 · CTA — cinematic ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/qb-69.png" alt="" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-nil-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-nil-black via-transparent to-nil-black/50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-nil-white leading-tight mb-6">
            Score your first deal.<br />
            <span className="gradient-text">Before the money moves.</span>
          </h2>
          <p className="text-nil-muted text-lg mb-10 max-w-md mx-auto">
            Free. No sign-up. Under Center verified athletes. NIL33 scored.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Open Demo →</Button>
            <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Partnership" variant="secondary" size="lg" external>
              Talk to Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
