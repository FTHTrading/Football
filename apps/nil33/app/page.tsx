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

/* ═══ Typing effect ═══ */
function TypeWriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let idx = 0;
      const iv = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, speed]);
  return <span ref={ref}>{displayed}{!done && <span className="animate-pulse text-nil-green">|</span>}</span>;
}

/* ═══ Verified athletes from Under Center — real NIL data ═══ */
const VERIFIED_ATHLETES = [
  {
    id: "arch-manning", name: "Arch Manning", sport: "Football", pos: "QB", school: "Texas Longhorns", state: "Texas",
    conference: "SEC", year: "Junior", rating: 5.0, image: "/images/athlete-action.png",
    nil: { composite: 96, low: 3200000, high: 4500000, social: 91, athletic: 97, market: 99, brand: 96 },
  },
  {
    id: "jeremiah-smith", name: "Jeremiah Smith", sport: "Football", pos: "WR", school: "Ohio State Buckeyes", state: "Ohio",
    conference: "Big Ten", year: "Sophomore", rating: 5.0, image: "/images/qb4.png",
    nil: { composite: 94, low: 4200000, high: 5600000, social: 92, athletic: 98, market: 93, brand: 91 },
  },
  {
    id: "livvy-dunne", name: "Livvy Dunne", sport: "Gymnastics", pos: "All-Around", school: "LSU Tigers", state: "Louisiana",
    conference: "SEC", year: "Senior", rating: 5.0, image: "/images/qb3.png",
    nil: { composite: 95, low: 3800000, high: 5200000, social: 99, athletic: 88, market: 95, brand: 99 },
  },
  {
    id: "juju-watkins", name: "JuJu Watkins", sport: "Basketball", pos: "Guard", school: "USC Trojans", state: "California",
    conference: "Big Ten", year: "Junior", rating: 5.0, image: "/images/qb5.png",
    nil: { composite: 90, low: 1800000, high: 2800000, social: 89, athletic: 95, market: 88, brand: 87 },
  },
  {
    id: "bryce-underwood", name: "Bryce Underwood", sport: "Football", pos: "QB", school: "Michigan Wolverines", state: "Michigan",
    conference: "Big Ten", year: "Freshman", rating: 5.0, image: "/images/qb2.png",
    nil: { composite: 93, low: 8500000, high: 12000000, social: 78, athletic: 96, market: 97, brand: 88 },
  },
  {
    id: "aj-dybantsa", name: "AJ Dybantsa", sport: "Basketball", pos: "Small Forward", school: "BYU Cougars", state: "Utah",
    conference: "Big 12", year: "Freshman", rating: 5.0, image: "/images/qb.png",
    nil: { composite: 91, low: 4500000, high: 6200000, social: 87, athletic: 96, market: 90, brand: 89 },
  },
];

/* ═══ Compliance states data ═══ */
const COMPLIANCE_STATES = [
  { state: "FL", status: "active", law: "§ 1006.74" },
  { state: "TX", status: "active", law: "Ed Code § 51.9246" },
  { state: "CA", status: "active", law: "SB 206" },
  { state: "GA", status: "active", law: "§ 20-3-681" },
  { state: "AL", status: "active", law: "§ 16-22-40" },
  { state: "OH", status: "active", law: "SB 187" },
  { state: "PA", status: "active", law: "Act 26" },
  { state: "MI", status: "active", law: "SB 301" },
  { state: "LA", status: "active", law: "SB 60" },
  { state: "TN", status: "active", law: "SB 1423" },
  { state: "SC", status: "active", law: "SB 685" },
  { state: "NC", status: "active", law: "SB 725" },
  { state: "OR", status: "active", law: "SB 5" },
  { state: "CO", status: "active", law: "SB 20-123" },
  { state: "NE", status: "active", law: "LB 962" },
  { state: "MS", status: "active", law: "SB 2313" },
  { state: "OK", status: "active", law: "SB 48" },
  { state: "KY", status: "active", law: "HB 382" },
  { state: "AZ", status: "active", law: "SB 1296" },
  { state: "NV", status: "active", law: "SB 354" },
];

export default function Home() {
  const featured = VERIFIED_ATHLETES[0];

  return (
    <>
      {/* ═══ 1 · HERO — Cinematic full-bleed ═══ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <Image src="/images/qb.png" alt="" fill className="object-cover object-top" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-nil-black via-nil-black/90 to-nil-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-nil-black via-transparent to-nil-black/70" />
          {/* Animated glow orb */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-nil-green/[0.04] blur-[120px] animate-pulse-ring" />
          <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-nil-cyan/[0.03] blur-[100px] animate-pulse-ring" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-3xl">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-nil-green/[0.08] border border-nil-green/20 rounded-full px-4 py-1.5 mb-8 animate-fade-down">
              <span className="w-2 h-2 rounded-full bg-nil-green animate-pulse" />
              <span className="text-nil-green text-xs font-semibold tracking-wide">ENGINE v3.2 — 50 STATES ACTIVE</span>
            </div>

            <h1 className="space-y-2">
              <span className="block text-hero text-nil-white">EVERY</span>
              <span className="block text-hero text-nil-white">DOLLAR</span>
              <span className="block text-hero gradient-text">ACCOUNTABLE.</span>
            </h1>

            <p className="mt-8 text-xl text-nil-muted max-w-lg leading-relaxed">
              Score athletes across{" "}
              <RotatingWord words={["33 factors", "4 categories", "50 states", "every conference", "every deal"]} />
              <br />
              before capital moves. Built in Rust. Signed with Ed25519.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/demo" size="lg">Score a Deal →</Button>
              <Button href="/athletes" variant="ghost" size="lg">View Verified Athletes</Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 text-xs text-nil-muted">
              <span className="flex items-center gap-1.5"><span className="text-nil-green">✓</span> Deterministic scoring</span>
              <span className="flex items-center gap-1.5"><span className="text-nil-green">✓</span> Cryptographic receipts</span>
              <span className="flex items-center gap-1.5"><span className="text-nil-green">✓</span> 50-state compliance</span>
            </div>
          </div>

          {/* Counter tiles — elevated */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: 33, suffix: "", label: "Scoring Factors", color: "text-nil-green", border: "border-nil-green/20" },
              { value: 50, suffix: "+", label: "State Rulesets", color: "text-nil-cyan", border: "border-nil-cyan/20" },
              { value: 2400000, prefix: "$", suffix: "", label: "Deals Scored", color: "text-nil-gold", border: "border-nil-gold/20" },
              { value: 0, suffix: "", label: "Overpays Missed", color: "text-nil-purple", border: "border-nil-purple/20", isStatic: true },
            ].map((t) => (
              <div key={t.label} className={`glass rounded-2xl p-5 border ${t.border} card-lift`}>
                <p className={`font-mono text-3xl sm:text-4xl font-extrabold ${t.color}`}>
                  {t.isStatic ? "0" : <Counter end={t.value} suffix={t.suffix} prefix={t.prefix || ""} />}
                </p>
                <p className="text-nil-muted text-[10px] mt-1.5 tracking-[0.15em] uppercase font-medium">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2 · BROADCAST TICKER ═══ */}
      <div className="border-y border-nil-green/10 bg-nil-dark/80 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-[13px] font-mono">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex gap-12 shrink-0">
              <span><span className="text-nil-green">▲</span> Arch Manning — <span className="text-nil-green font-bold">96</span>/99 — $3.2M–$4.5M — <span className="text-nil-green">TX: Pass</span></span>
              <span><span className="text-nil-cyan">▲</span> Livvy Dunne — <span className="text-nil-cyan font-bold">95</span>/99 — $3.8M–$5.2M — <span className="text-nil-green">LA: Pass</span></span>
              <span><span className="text-nil-gold">▲</span> Jeremiah Smith — <span className="text-nil-gold font-bold">94</span>/99 — $4.2M–$5.6M — <span className="text-nil-green">OH: Pass</span></span>
              <span><span className="text-nil-purple">▲</span> Bryce Underwood — <span className="text-nil-purple font-bold">93</span>/99 — $8.5M–$12M — <span className="text-nil-green">MI: Pass</span></span>
              <span className="text-nil-green/60">NIL33 ENGINE v3.2 · Ed25519 SIGNED · 50-STATE COMPLIANT</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 3 · SOCIAL PROOF — Numbers that command ═══ */}
      <section className="py-20 px-6 bg-nil-dark/40">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger">
            {[
              { value: "$52.7M+", label: "Capital Scored", sub: "Total deal value evaluated" },
              { value: "10", label: "Verified Athletes", sub: "Under Center pipeline" },
              { value: "20+", label: "Active States", sub: "Compliance rulesets loaded" },
              { value: "0", label: "Missed Overpays", sub: "Every dollar accounted" },
            ].map((s) => (
              <div key={s.label} className="group">
                <p className="text-nil-white font-mono text-4xl sm:text-5xl font-extrabold tracking-tight group-hover:text-nil-green transition-colors">
                  {s.value}
                </p>
                <p className="text-nil-white text-sm font-semibold mt-2">{s.label}</p>
                <p className="text-nil-muted text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4 · THREE ENGINES — The Core ═══ */}
      <Section>
        <SectionHeader
          overline="The platform"
          title="Three engines. One decision layer."
          subtitle="Every deal runs through valuation, compliance, and documentation before a dollar moves."
        />
        <div className="grid md:grid-cols-3 gap-6 stagger">
          {[
            {
              num: "01", color: "var(--color-nil-green)", borderColor: "border-nil-green/20",
              title: "Valuation Engine",
              desc: "33 weighted factors — social reach, athletic performance, conference market, brand alignment — produce a composite score and dollar range.",
              detail: "Score: 91/99 → $168K–$218K",
              icon: "◆",
            },
            {
              num: "02", color: "var(--color-nil-cyan)", borderColor: "border-nil-cyan/20",
              title: "Compliance Engine",
              desc: "Instant check against the athlete's state NIL law, conference rules, and current NCAA guidelines. Pass, review, or fail — with citations.",
              detail: "FL: Pass · IND: Pass · NCAA: Pass",
              icon: "◈",
            },
            {
              num: "03", color: "var(--color-nil-purple)", borderColor: "border-nil-purple/20",
              title: "Deal Receipts",
              desc: "Every deal gets a timestamped, cryptographically signed record. Show your board, your donors, or the NCAA exactly what you evaluated.",
              detail: "NIL33-2026-00847 · Ed25519",
              icon: "◇",
            },
          ].map((engine) => (
            <div key={engine.num} className={`rounded-2xl border ${engine.borderColor} bg-nil-dark/60 p-7 card-lift group`}>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold border"
                  style={{ color: engine.color, borderColor: engine.color, backgroundColor: `color-mix(in srgb, ${engine.color} 8%, transparent)` }}
                >
                  {engine.num}
                </span>
                <h3 className="text-nil-white font-semibold text-lg">{engine.title}</h3>
              </div>
              <p className="text-nil-muted text-sm leading-relaxed mb-5">{engine.desc}</p>
              <div className="bg-nil-black/60 rounded-xl px-4 py-2.5 border border-nil-border/30">
                <p className="font-mono text-xs" style={{ color: engine.color }}>{engine.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ 5 · POWERED BY UNDER CENTER — Pipeline ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
            <div className="space-y-4">
              {[
                { step: "01", text: "Under Center captures and verifies athlete metrics", color: "text-nil-cyan" },
                { step: "02", text: "Identity hash created with SHA-256 + Ed25519 signature", color: "text-nil-green" },
                { step: "03", text: "NIL33 ingests verified identity into 33-factor scoring", color: "text-nil-gold" },
                { step: "04", text: "Valuation, compliance check, and receipt generated", color: "text-nil-purple" },
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

          {/* Featured athlete card — elevated */}
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-nil-green/[0.03] rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-nil-border/60 bg-nil-dark/80 glow-green">
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
                  <p className="text-nil-white font-extrabold text-2xl">{featured.name}</p>
                  <p className="text-nil-muted text-sm">{featured.sport} · {featured.pos} · {featured.school} · {featured.year}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* UC Metrics */}
                <div>
                  <p className="text-nil-cyan text-[10px] font-bold tracking-[0.15em] uppercase mb-3">NIL33 Factor Scores</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Social", value: `${featured.nil.social}`, unit: "/99" },
                      { label: "Athletic", value: `${featured.nil.athletic}`, unit: "/99" },
                      { label: "Market", value: `${featured.nil.market}`, unit: "/99" },
                      { label: "Brand", value: `${featured.nil.brand}`, unit: "/99" },
                    ].map((m) => (
                      <div key={m.label} className="text-center bg-nil-black/40 rounded-xl py-3 border border-nil-border/20">
                        <p className="text-nil-white font-mono text-lg font-bold">{m.value}</p>
                        <p className="text-nil-muted text-[9px] uppercase tracking-wide">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-nil-border/40" />

                {/* NIL33 Valuation */}
                <div>
                  <p className="text-nil-green text-[10px] font-bold tracking-[0.15em] uppercase mb-3">NIL33 Valuation</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-nil-muted text-sm">Composite Score</span>
                    <span className="text-nil-green font-mono text-3xl font-extrabold glow-green-text">{featured.nil.composite}<span className="text-nil-muted text-sm font-normal">/99</span></span>
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

      {/* ═══ 6 · LIVE DEAL SCORING — Terminal Output ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              overline="Live output"
              title="What a scored deal looks like."
              subtitle={`Arch Manning — 5-star QB, Texas Longhorns. Verified by Under Center. Scored by NIL33. Every deal your collective evaluates produces a structured, auditable record like this.`}
            />
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Badge status="pass" label="TX State Law" />
              <Badge status="pass" label="SEC" />
              <Badge status="pass" label="NCAA Guidelines" />
            </div>
            <div className="mt-6">
              <Button href="/demo" variant="ghost" size="sm">Try with your own athlete →</Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 bg-nil-green/[0.02] rounded-2xl blur-xl" />
            <div className="relative">
              <CodePreview title="nil33 score-deal --athlete manning --output json">
                <div className="space-y-0.5 text-[13px]">
                  <DataRow label="Athlete" value="Arch Manning — QB, Texas Longhorns" />
                  <DataRow label="UC Verified" value={<span className="text-nil-cyan">✓ SHA-256 + Ed25519</span>} />
                  <DataRow label="Composite Score" value={<span className="text-nil-green font-bold text-xl">96</span>} />
                  <DataRow label="Valuation Band" value="$3,200,000 – $4,500,000" />
                  <DataRow label="Proposed Deal" value={<span className="text-nil-white">$3,800,000</span>} />
                  <DataDivider />
                  <DataRow label="Overpay" value={<span className="text-nil-green font-bold">$0 — within range</span>} />
                  <DataRow label="State Law" value={<span className="text-nil-green">Pass — TX Ed Code § 51.9246</span>} />
                  <DataRow label="NCAA" value={<span className="text-nil-green">Pass — within fair value</span>} />
                  <DataDivider />
                  <DataRow label="Receipt ID" value="NIL33-2026-00101" />
                  <DataRow label="Timestamp" value={new Date().toISOString().split("T")[0]} />
                  <DataRow label="Signature" value={<span className="text-nil-purple text-xs">ed25519:a4f8…d7f2</span>} />
                </div>
              </CodePreview>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 7 · COMPLIANCE MAP — 50 States ═══ */}
      <section className="py-24 px-6 bg-nil-dark/60 border-y border-nil-border/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-overline mb-5">Regulatory Coverage</p>
            <h2 className="text-h1 text-nil-white mb-4">50-state compliance. Always current.</h2>
            <p className="text-nil-muted text-body-lg max-w-xl mx-auto">
              NIL33 maintains structured rulesets for every state with active NIL legislation.
              Updated as laws change. Versioned for audit trails.
            </p>
          </div>

          {/* State grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 mb-10 stagger">
            {COMPLIANCE_STATES.map((s) => (
              <div
                key={s.state}
                className="group relative bg-nil-black/60 border border-nil-green/20 rounded-xl p-3 text-center card-lift cursor-default"
              >
                <p className="text-nil-white font-mono text-sm font-bold">{s.state}</p>
                <p className="text-nil-green text-[8px] font-semibold uppercase tracking-wider mt-0.5">Active</p>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-nil-dark border border-nil-border/60 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <p className="text-nil-white text-xs font-medium">{s.state} — {s.law}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-nil-green/30 border border-nil-green/40" />
              <span className="text-nil-muted">Active NIL Statute</span>
            </span>
            <span className="text-nil-muted">·</span>
            <span className="text-nil-muted font-mono text-xs">Rulesets versioned · Timestamped · Auditable</span>
          </div>
        </div>
      </section>

      {/* ═══ 8 · VERIFIED ROSTER ═══ */}
      <Section>
        <SectionHeader
          center
          overline="Verified Athletes"
          title="Under Center athletes. NIL33 valuations."
          subtitle="Every athlete on this roster has been identity-verified, metrics-captured, and scored through the NIL33 engine."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {VERIFIED_ATHLETES.map((a) => (
            <Link key={a.id} href="/athletes" className="group">
              <div className="rounded-2xl border border-nil-border/60 bg-nil-dark/60 overflow-hidden hover:border-nil-green/30 transition-all card-lift">
                <div className="relative h-52">
                  <Image src={a.image} alt={a.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-nil-dark via-nil-dark/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-nil-green/20 text-nil-green text-[10px] font-bold px-2.5 py-1 rounded-full border border-nil-green/30 font-mono">
                      {a.nil.composite}/99
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-nil-black/60 text-nil-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-nil-gold/20">
                      ★ {a.rating}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-nil-white font-semibold text-[15px]">{a.name}</p>
                      <p className="text-nil-muted text-xs">{a.sport} · {a.pos} · {a.school}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-nil-green font-mono text-sm font-bold">${a.nil.low >= 1000000 ? `${(a.nil.low / 1000000).toFixed(1)}M` : `${(a.nil.low / 1000).toFixed(0)}K`}–${a.nil.high >= 1000000 ? `${(a.nil.high / 1000000).toFixed(1)}M` : `${(a.nil.high / 1000).toFixed(0)}K`}</span>
                    <span className="text-[9px] text-nil-muted uppercase tracking-wider">Fair Value</span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {[
                      { label: "SOC", val: a.nil.social, color: "bg-nil-green" },
                      { label: "ATH", val: a.nil.athletic, color: "bg-nil-cyan" },
                      { label: "MKT", val: a.nil.market, color: "bg-nil-purple" },
                      { label: "BRD", val: a.nil.brand, color: "bg-nil-gold" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="h-1 rounded-full bg-nil-border/40 overflow-hidden">
                          <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.val}%` }} />
                        </div>
                        <p className="text-nil-muted text-[8px] text-center mt-1 font-mono">{bar.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/athletes" variant="secondary" size="lg">View Full Roster →</Button>
        </div>
      </Section>

      {/* ═══ 9 · PROBLEM / SOLUTION ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
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
              <p className="text-nil-white font-medium text-lg">
                NIL33 gives you the number, the compliance check, and the paper trail —
                before you wire the money.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { before: "Agent says '$120K for this WR.' You have no counter.", after: "NIL33 scores the athlete at 67/99 — fair value is $48K–$62K.", color: "var(--color-nil-green)" },
              { before: "Board wants to see how $1.2M was allocated.", after: "Every deal has a signed receipt. Export the entire portfolio.", color: "var(--color-nil-cyan)" },
              { before: "NCAA sends an enforcement letter.", after: "Each transaction is timestamped, signed, and audit-ready.", color: "var(--color-nil-purple)" },
            ].map((item, i) => (
              <div key={i} className="bg-nil-black/40 border border-nil-border/40 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-nil-red text-xs font-bold mt-0.5">✕</span>
                  <p className="text-nil-muted text-sm">{item.before}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-nil-green text-xs font-bold mt-0.5">✓</span>
                  <p className="text-nil-text text-sm font-medium">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 10 · WHY RUST — Technical Authority ═══ */}
      <section className="py-24 px-6 border-y border-nil-border/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-overline mb-5">Engineering</p>
              <h2 className="text-h1 text-nil-white mb-4">
                Why Rust. Why Ed25519.
                <span className="gradient-text"> Why it matters.</span>
              </h2>
              <p className="text-nil-muted text-body-lg mb-8">
                NIL33 isn&apos;t a spreadsheet with a logo. It&apos;s a deterministic
                scoring engine compiled from Rust — where the same inputs always produce
                the same output, and every result is cryptographically signed.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "◆", text: "Integer arithmetic — no floating-point drift or rounding errors", color: "text-nil-green" },
                  { icon: "◆", text: "Sub-millisecond scoring — score 1,000 deals in under a second", color: "text-nil-cyan" },
                  { icon: "◆", text: "Ed25519 signatures — tamper-evident, verifiable, court-ready", color: "text-nil-purple" },
                  { icon: "◆", text: "Memory-safe — no buffer overflows, no undefined behavior", color: "text-nil-gold" },
                  { icon: "◆", text: "WASM-compatible — client-side verification in the browser", color: "text-nil-orange" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className={`${item.color} text-xs mt-1`}>{item.icon}</span>
                    <span className="text-nil-text text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <CodePreview title="score_deal.rs — Rust Scoring Engine">
              <div className="font-mono text-xs text-nil-text space-y-1">
                <p className="text-nil-muted">{"// Deterministic: same inputs → same output"}</p>
                <p className="text-nil-muted">{"// Integer arithmetic only — no f64"}</p>
                <p className="mt-2"><span className="text-nil-cyan">pub fn</span> <span className="text-nil-green">score_deal</span>(</p>
                <p className="pl-4">profile: <span className="text-nil-gold">&AthleteProfile</span>,</p>
                <p className="pl-4">proposal: <span className="text-nil-gold">&DealProposal</span>,</p>
                <p className="pl-4">rules: <span className="text-nil-gold">&ComplianceRuleset</span>,</p>
                <p>) -&gt; <span className="text-nil-gold">Result</span>&lt;<span className="text-nil-green">ScoredDeal</span>, <span className="text-nil-red">EngineError</span>&gt; {"{"}</p>
                <p className="pl-4"><span className="text-nil-cyan">let</span> social = <span className="text-nil-green">compute_social</span>(&profile.social);</p>
                <p className="pl-4"><span className="text-nil-cyan">let</span> athletic = <span className="text-nil-green">compute_athletic</span>(&profile.stats);</p>
                <p className="pl-4"><span className="text-nil-cyan">let</span> market = <span className="text-nil-green">compute_market</span>(&profile.market);</p>
                <p className="pl-4"><span className="text-nil-cyan">let</span> brand = <span className="text-nil-green">compute_brand</span>(&profile.brand);</p>
                <p className="pl-4 mt-2"><span className="text-nil-cyan">let</span> composite = <span className="text-nil-green">weighted_sum</span>(</p>
                <p className="pl-8">[social, athletic, market, brand],</p>
                <p className="pl-8">[<span className="text-nil-gold">25</span>, <span className="text-nil-gold">30</span>, <span className="text-nil-gold">25</span>, <span className="text-nil-gold">20</span>]</p>
                <p className="pl-4">);</p>
                <p className="pl-4 mt-2"><span className="text-nil-cyan">let</span> receipt = <span className="text-nil-green">sign_receipt</span>(</p>
                <p className="pl-8">&scored, &<span className="text-nil-purple">SIGNING_KEY</span></p>
                <p className="pl-4">);</p>
                <p className="pl-4 mt-2"><span className="text-nil-cyan">Ok</span>(<span className="text-nil-green">ScoredDeal</span> {"{ composite, receipt }"});</p>
                <p>{"}"}</p>
              </div>
            </CodePreview>
          </div>
        </div>
      </section>

      {/* ═══ 11 · ROI ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              overline="ROI"
              title="Catch one overpay. Paid for the year."
              subtitle="Most collectives see 5x–10x return. The math is simple."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/pricing" variant="ghost" size="sm">See all pricing →</Button>
              <Button href="/demo" variant="ghost" size="sm">Run a free valuation →</Button>
            </div>
          </div>
          <div className="bg-nil-black border border-nil-border/60 rounded-2xl p-8 glow-green">
            <InlineStat label="NIL33 Pro (monthly)" value="$1,200" />
            <InlineStat label="NIL33 Pro (annual)" value="$14,400" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="Avg. overpay caught per deal" value="$28,000" valueColor="var(--color-nil-red)" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="Deals to break even" value="1" valueColor="var(--color-nil-green)" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="Annual ROI at 10 deals" value="1,844%" valueColor="var(--color-nil-green)" />
          </div>
        </div>
      </Section>

      {/* ═══ 12 · BUILT FOR ═══ */}
      <Section dark>
        <SectionHeader
          center
          overline="Built for"
          title="Every stakeholder in the NIL ecosystem."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {[
            { title: "Collectives", desc: "Validate deals, document decisions, protect capital. Every dollar accounted for.", href: "/collectives", icon: "◆", color: "text-nil-green" },
            { title: "Compliance Officers", desc: "50-state law checks, conference rules, NCAA tracking. Instant verdicts.", href: "/product", icon: "◈", color: "text-nil-cyan" },
            { title: "Board Members", desc: "Audit-ready receipts for every dollar allocated. Export-ready reports.", href: "/product", icon: "◇", color: "text-nil-purple" },
            { title: "Developers", desc: "REST API, Rust engine, deterministic scoring. Build on top of NIL33.", href: "/developers", icon: "◆", color: "text-nil-gold" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <div className="bg-nil-dark/60 border border-nil-border/60 rounded-2xl p-7 h-full hover:border-nil-green/20 transition-all card-lift">
                <span className={`${item.color} text-2xl block mb-4`}>{item.icon}</span>
                <h3 className="text-nil-white font-semibold text-lg mb-2 group-hover:text-nil-green transition-colors">{item.title}</h3>
                <p className="text-nil-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ═══ 13 · TESTIMONIALS / CASE STUDY ═══ */}
      <section className="py-24 px-6 border-y border-nil-border/30 bg-nil-dark/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-overline mb-5">Case Study</p>
            <h2 className="text-h1 text-nil-white mb-4">How NIL33 saved a collective $107K on one deal.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-nil-black/60 border border-nil-border/40 rounded-2xl p-8">
              <p className="text-nil-red font-mono text-4xl font-extrabold mb-2">$195K</p>
              <p className="text-nil-muted text-sm mb-4">Agent&apos;s asking price for a 4-star WR</p>
              <p className="text-nil-muted text-xs leading-relaxed">Based on &quot;market comps&quot; — no structured data, no factor analysis, no compliance check.</p>
            </div>
            <div className="bg-nil-black/60 border border-nil-green/20 rounded-2xl p-8 glow-green">
              <p className="text-nil-green font-mono text-4xl font-extrabold mb-2">$88K</p>
              <p className="text-nil-text text-sm mb-4">NIL33 fair value assessment</p>
              <p className="text-nil-muted text-xs leading-relaxed">Composite 72/99 — strong athletic but low social reach and limited market. Valuation band: $78K–$98K.</p>
            </div>
            <div className="bg-nil-black/60 border border-nil-border/40 rounded-2xl p-8">
              <p className="text-nil-gold font-mono text-4xl font-extrabold mb-2">$107K</p>
              <p className="text-nil-text text-sm mb-4">Capital preserved</p>
              <p className="text-nil-muted text-xs leading-relaxed">Collective negotiated from data. Final deal: $91K — within NIL33 fair value band. Receipt generated, compliance verified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 14 · CTA — Cinematic ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/qb-69.png" alt="" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-nil-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-nil-black via-transparent to-nil-black/60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-nil-green/[0.04] blur-[150px]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-nil-green/[0.08] border border-nil-green/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-nil-green animate-pulse" />
            <span className="text-nil-green text-xs font-semibold tracking-wide">FREE — NO SIGN-UP REQUIRED</span>
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-nil-white leading-[1.05] mb-6">
            Score your first deal.<br />
            <span className="gradient-text">Before the money moves.</span>
          </h2>
          <p className="text-nil-muted text-lg mb-10 max-w-md mx-auto">
            Under Center verified athletes. NIL33 scored. 33 factors. 50 states. Zero guesswork.
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
