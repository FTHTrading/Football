"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section, { SectionHeader } from "../../components/Section";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import { ScoreBar } from "../../components/ScoreDisplay";

/* ═══ Same verified athlete data used across NIL33 ═══ */
const ATHLETES = [
  {
    id: "6", name: "Andre Mitchell", pos: "QB", school: "IMG Academy", state: "Florida",
    conference: "Independent", gradYear: 2026, rating: 5.0, image: "/images/athlete-action.png",
    profileImage: "/images/athlete-profile.png",
    metrics: { velocity: 63.4, release: 0.35, accuracy: 93, mechanics: 95, spinRate: 710, footwork: 90, poise: 93, fieldVision: 89, clutchFactor: 94, decisionSpeed: 91 },
    nil: { composite: 91, low: 168000, high: 218000, social: 88, athletic: 95, market: 89, brand: 92 },
    offers: ["Alabama", "Georgia", "Ohio State", "Clemson", "Texas", "USC", "Oregon", "Notre Dame"],
    comp: "Trevor Lawrence",
    bio: "Elite 5-star prospect with prototypical size and arm talent. Verified by Under Center with the highest composite metrics in the 2026 class. IMG Academy pedigree signals institutional development.",
    receiptId: "NIL33-2026-01094",
    signature: "ed25519:a4f8c3b7e9d1f6a2c8b4e7d3f9a1c5b8d2e6f4a7c9b3e1d5f8a2c4b6e9d7f2",
  },
  {
    id: "1", name: "Jaxon Smith", pos: "QB", school: "Westlake HS", state: "Texas",
    conference: "Big 12", gradYear: 2026, rating: 4.5, image: "/images/qb4.png",
    profileImage: "/images/qb4.png",
    metrics: { velocity: 61.8, release: 0.38, accuracy: 88, mechanics: 92, spinRate: 680, footwork: 83, poise: 86, fieldVision: 81, clutchFactor: 87, decisionSpeed: 85 },
    nil: { composite: 84, low: 112000, high: 145000, social: 82, athletic: 87, market: 85, brand: 80 },
    offers: ["Alabama", "Ohio State", "Georgia", "Texas", "USC"],
    comp: "Patrick Mahomes",
    bio: "Pro-style QB with elite arm strength and poise under pressure. Texas market premium and five major P5 offers drive strong NIL valuation.",
    receiptId: "NIL33-2026-01095",
    signature: "ed25519:b7c4d9e2f1a8b3c6d5e9f2a4b7c1d8e3f6a9b2c5d4e7f1a3b6c8d2e5f9a1c4",
  },
  {
    id: "4", name: "Dylan Park", pos: "QB", school: "Archbishop Moeller", state: "Ohio",
    conference: "Big Ten", gradYear: 2026, rating: 4.0, image: "/images/qb3.png",
    profileImage: "/images/qb3.png",
    metrics: { velocity: 60.1, release: 0.36, accuracy: 91, mechanics: 89, spinRate: 650, footwork: 84, poise: 89, fieldVision: 85, clutchFactor: 88, decisionSpeed: 87 },
    nil: { composite: 78, low: 82000, high: 106000, social: 65, athletic: 81, market: 82, brand: 78 },
    offers: ["Ohio State", "Notre Dame", "Michigan", "Penn State", "Clemson"],
    comp: "Joe Burrow",
    bio: "Cerebral pocket passer with elite accuracy and Big Ten conference market value. Strong brand alignment metrics despite lower social following.",
    receiptId: "NIL33-2026-01096",
    signature: "ed25519:c9d3e7f1a5b2c8d6e4f9a3b1c7d5e2f8a6b4c9d1e3f7a2b5c8d4e6f1a9b3c2",
  },
  {
    id: "2", name: "Marcus Rivera", pos: "QB", school: "Mater Dei HS", state: "California",
    conference: "Pac-12", gradYear: 2026, rating: 4.0, image: "/images/qb5.png",
    profileImage: "/images/qb5.png",
    metrics: { velocity: 58.2, release: 0.41, accuracy: 90, mechanics: 85, spinRate: 620, footwork: 79, poise: 88, fieldVision: 90, clutchFactor: 85, decisionSpeed: 92 },
    nil: { composite: 76, low: 72000, high: 94000, social: 78, athletic: 74, market: 79, brand: 72 },
    offers: ["Oregon", "USC", "Miami", "LSU"],
    comp: "Lamar Jackson",
    bio: "Dynamic dual-threat with elite decision speed and field vision. Mater Dei pipeline and California market create strong base valuation.",
    receiptId: "NIL33-2026-01097",
    signature: "ed25519:d2e6f9a3b7c1d8e4f2a5b9c3d7e1f6a8b4c2d9e5f3a1b7c6d4e8f2a9b3c5d1",
  },
  {
    id: "5", name: "Kai Nakamura", pos: "QB", school: "Saint Louis School", state: "Hawaii",
    conference: "MWC", gradYear: 2027, rating: 3.5, image: "/images/qb2.png",
    profileImage: "/images/qb2.png",
    metrics: { velocity: 56.5, release: 0.42, accuracy: 86, mechanics: 81, spinRate: 590, footwork: 76, poise: 82, fieldVision: 87, clutchFactor: 80, decisionSpeed: 90 },
    nil: { composite: 62, low: 38000, high: 52000, social: 55, athletic: 68, market: 58, brand: 65 },
    offers: ["Oregon", "Washington", "UCLA"],
    comp: "Marcus Mariota",
    bio: "High-ceiling dual-threat with strong decision speed. 2027 class timeline provides growth runway. Smaller market but unique island narrative.",
    receiptId: "NIL33-2026-01098",
    signature: "ed25519:e4f8a2b6c9d3e7f1a5b2c8d6e4f9a3b1c7d5e2f8a6b4c9d1e3f7a2b5c8d4e1",
  },
  {
    id: "3", name: "Tyler Washington", pos: "QB", school: "Buford HS", state: "Georgia",
    conference: "SEC", gradYear: 2027, rating: 3.5, image: "/images/qb-10.png",
    profileImage: "/images/qb-10.png",
    metrics: { velocity: 55.0, release: 0.44, accuracy: 82, mechanics: 78, spinRate: 560, footwork: 72, poise: 74, fieldVision: 76, clutchFactor: 70, decisionSpeed: 79 },
    nil: { composite: 58, low: 28000, high: 42000, social: 42, athletic: 62, market: 65, brand: 55 },
    offers: ["Georgia", "Auburn"],
    comp: "Justin Herbert",
    bio: "Raw prospect with prototypical frame and SEC market premium. Georgia pipeline provides institutional credibility. 2027 class provides development time.",
    receiptId: "NIL33-2026-01099",
    signature: "ed25519:f1a9b3c7d5e2f8a4b6c9d1e3f7a5b2c8d6e4f9a3b1c7d5e2f8a6b4c9d1e3f7",
  },
];

type Athlete = typeof ATHLETES[number];

/* ═══ Detail panel ═══ */
function AthleteDetail({ athlete, onClose }: { athlete: Athlete; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-nil-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-nil-border/60 bg-nil-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-80">
          <Image src={athlete.profileImage} alt={athlete.name} fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-nil-dark via-nil-dark/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-nil-black/60 border border-nil-border/40 flex items-center justify-center text-nil-muted hover:text-nil-white transition-colors cursor-pointer"
          >
            ✕
          </button>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge status="pass" label="UC Verified" />
            <span className="bg-nil-gold/20 text-nil-gold text-[10px] font-bold px-2.5 py-1 rounded-full border border-nil-gold/30">
              ★ {athlete.rating}
            </span>
          </div>
          <div className="absolute bottom-6 left-6">
            <p className="text-nil-white font-extrabold text-3xl">{athlete.name}</p>
            <p className="text-nil-muted text-sm mt-1">
              {athlete.pos} · {athlete.school} · Class of {athlete.gradYear} · {athlete.state}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Bio */}
          <p className="text-nil-text text-sm leading-relaxed mb-8">{athlete.bio}</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Under Center Metrics */}
            <Card>
              <p className="text-nil-cyan text-[10px] font-bold tracking-[0.15em] uppercase mb-4">Under Center Verified Metrics</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Velocity", value: `${athlete.metrics.velocity} MPH`, color: "text-nil-green" },
                  { label: "Release Time", value: `${athlete.metrics.release}s`, color: "text-nil-cyan" },
                  { label: "Accuracy", value: `${athlete.metrics.accuracy}%`, color: "text-nil-green" },
                  { label: "Mechanics", value: `${athlete.metrics.mechanics}/100`, color: "text-nil-cyan" },
                  { label: "Spin Rate", value: `${athlete.metrics.spinRate} RPM`, color: "text-nil-green" },
                  { label: "Footwork", value: `${athlete.metrics.footwork}/100`, color: "text-nil-cyan" },
                  { label: "Poise", value: `${athlete.metrics.poise}/100`, color: "text-nil-green" },
                  { label: "Field Vision", value: `${athlete.metrics.fieldVision}/100`, color: "text-nil-cyan" },
                  { label: "Clutch Factor", value: `${athlete.metrics.clutchFactor}/100`, color: "text-nil-green" },
                  { label: "Decision Speed", value: `${athlete.metrics.decisionSpeed}/100`, color: "text-nil-cyan" },
                ].map((m) => (
                  <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-nil-border/20">
                    <span className="text-nil-muted text-xs">{m.label}</span>
                    <span className={`font-mono text-sm font-bold ${m.color}`}>{m.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-nil-muted/50 text-[10px] mt-3 text-center">Comparison: {athlete.comp}</p>
            </Card>

            {/* NIL33 Valuation */}
            <div className="space-y-6">
              <Card>
                <p className="text-nil-green text-[10px] font-bold tracking-[0.15em] uppercase mb-4">NIL33 Valuation</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-nil-muted text-sm">Composite Score</span>
                  <span className="text-nil-green font-mono text-4xl font-extrabold">{athlete.nil.composite}<span className="text-nil-muted text-sm font-normal">/99</span></span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-nil-muted text-sm">Fair Value Range</span>
                  <span className="text-nil-white font-mono text-sm font-bold">${athlete.nil.low.toLocaleString()} – ${athlete.nil.high.toLocaleString()}</span>
                </div>
                <div className="space-y-2.5">
                  <ScoreBar label="Social" value={athlete.nil.social} color="var(--color-nil-green)" />
                  <ScoreBar label="Athletic" value={athlete.nil.athletic} color="var(--color-nil-cyan)" />
                  <ScoreBar label="Market" value={athlete.nil.market} color="var(--color-nil-purple)" />
                  <ScoreBar label="Brand" value={athlete.nil.brand} color="var(--color-nil-gold)" />
                </div>
              </Card>

              {/* Compliance */}
              <Card>
                <p className="text-nil-purple text-[10px] font-bold tracking-[0.15em] uppercase mb-3">Compliance Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-nil-muted text-sm">{athlete.state} State Law</span>
                    <Badge status="pass" label="Pass" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nil-muted text-sm">{athlete.conference} Rules</span>
                    <Badge status="pass" label="Pass" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nil-muted text-sm">NCAA Guidelines</span>
                    <Badge status="pass" label="Pass" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Receipt */}
          <div className="mt-6">
            <CodePreview title={`receipt-${athlete.receiptId}.json`}>
              <div className="space-y-0.5 text-[13px]">
                <DataRow label="Receipt ID" value={athlete.receiptId} />
                <DataRow label="Athlete" value={`${athlete.name} — ${athlete.pos}, ${athlete.school}`} />
                <DataRow label="UC Verified" value={<span className="text-nil-cyan">✓ Identity Hash + Ed25519</span>} />
                <DataRow label="Composite" value={<span className="text-nil-green font-bold">{athlete.nil.composite}/99</span>} />
                <DataRow label="Fair Value" value={`$${athlete.nil.low.toLocaleString()} – $${athlete.nil.high.toLocaleString()}`} />
                <DataDivider />
                <DataRow label="Compliance" value={<span className="text-nil-green">All Clear</span>} />
                <DataRow label="Timestamp" value={new Date().toISOString()} />
                <div className="py-2">
                  <span className="text-nil-muted text-xs">Signature</span>
                  <p className="text-nil-purple/70 text-xs font-mono break-all mt-0.5">{athlete.signature}</p>
                </div>
              </div>
            </CodePreview>
          </div>

          {/* Offers */}
          <div className="mt-6">
            <p className="text-nil-muted text-xs uppercase tracking-wider mb-3">Scholarship Offers</p>
            <div className="flex flex-wrap gap-2">
              {athlete.offers.map((o) => (
                <span key={o} className="text-nil-text text-xs bg-nil-black/60 border border-nil-border/40 rounded-lg px-3 py-1.5">{o}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AthletesPage() {
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [sortBy, setSortBy] = useState<"composite" | "valuation" | "rating">("composite");

  const sorted = [...ATHLETES].sort((a, b) => {
    if (sortBy === "composite") return b.nil.composite - a.nil.composite;
    if (sortBy === "valuation") return b.nil.high - a.nil.high;
    return b.rating - a.rating;
  });

  const totalValue = ATHLETES.reduce((sum, a) => sum + a.nil.high, 0);

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-stadium.png" alt="" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-nil-black/90 via-nil-black/80 to-nil-black" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">Verified Roster</p>
          <h1 className="text-display text-nil-white max-w-2xl">
            Under Center athletes.
            <span className="gradient-text"> NIL33 valuations.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-xl">
            Every athlete on this roster has been identity-verified through Under Center
            and scored through the NIL33 33-factor valuation engine. Click any athlete
            for their full report.
          </p>

          {/* Summary stats */}
          <div className="mt-10 flex flex-wrap gap-6">
            <div>
              <p className="text-nil-green font-mono text-3xl font-bold">{ATHLETES.length}</p>
              <p className="text-nil-muted text-xs uppercase">Verified Athletes</p>
            </div>
            <div>
              <p className="text-nil-cyan font-mono text-3xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
              <p className="text-nil-muted text-xs uppercase">Total Portfolio Value</p>
            </div>
            <div>
              <p className="text-nil-gold font-mono text-3xl font-bold">91</p>
              <p className="text-nil-muted text-xs uppercase">Highest Composite</p>
            </div>
            <div>
              <p className="text-nil-purple font-mono text-3xl font-bold">6</p>
              <p className="text-nil-muted text-xs uppercase">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Sort controls ═══ */}
      <div className="border-y border-nil-border/40 bg-nil-dark/60 px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center gap-3">
          <span className="text-nil-muted text-xs uppercase tracking-wider">Sort by</span>
          {([
            { key: "composite", label: "NIL33 Score" },
            { key: "valuation", label: "Valuation" },
            { key: "rating", label: "Star Rating" },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sortBy === s.key
                  ? "bg-nil-green/10 text-nil-green border border-nil-green/30"
                  : "text-nil-muted hover:text-nil-white border border-nil-border/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Athlete Grid ═══ */}
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {sorted.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="group rounded-2xl border border-nil-border/60 bg-nil-dark/60 overflow-hidden hover:border-nil-green/30 transition-all text-left cursor-pointer"
            >
              <div className="relative h-56">
                <Image src={a.image} alt={a.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-nil-dark via-nil-dark/20 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-nil-green/20 text-nil-green text-[10px] font-bold px-2.5 py-1 rounded-full border border-nil-green/30">
                    {a.nil.composite}/99
                  </span>
                  <span className="bg-nil-gold/20 text-nil-gold text-[10px] font-bold px-2 py-1 rounded-full border border-nil-gold/30">
                    ★{a.rating}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge status="pass" label="Verified" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-nil-white font-bold text-lg group-hover:text-nil-green transition-colors">{a.name}</p>
                    <p className="text-nil-muted text-xs">{a.pos} · {a.school} · {a.state}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-nil-green font-mono text-sm font-bold">{a.metrics.velocity}</p>
                    <p className="text-nil-muted text-[8px] uppercase">MPH</p>
                  </div>
                  <div>
                    <p className="text-nil-cyan font-mono text-sm font-bold">{a.metrics.release}s</p>
                    <p className="text-nil-muted text-[8px] uppercase">Release</p>
                  </div>
                  <div>
                    <p className="text-nil-green font-mono text-sm font-bold">{a.metrics.accuracy}%</p>
                    <p className="text-nil-muted text-[8px] uppercase">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-nil-cyan font-mono text-sm font-bold">{a.metrics.mechanics}</p>
                    <p className="text-nil-muted text-[8px] uppercase">Mech</p>
                  </div>
                </div>

                <div className="h-px bg-nil-border/30 my-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-nil-green font-mono text-lg font-bold">${(a.nil.low / 1000).toFixed(0)}K–${(a.nil.high / 1000).toFixed(0)}K</p>
                    <p className="text-nil-muted text-[9px] uppercase">Fair Value Range</p>
                  </div>
                  <span className="text-nil-muted text-xs group-hover:text-nil-green transition-colors">
                    View Report →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* ═══ Pipeline CTA ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              overline="The Pipeline"
              title="Verified identity. Scored valuation. Signed receipt."
              subtitle="Under Center captures the metrics. NIL33 turns them into a defensible valuation. Every step is cryptographically signed and audit-ready."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/demo" size="lg">Score a Deal</Button>
              <Button href="/developers" variant="ghost" size="lg">Technical Specs →</Button>
            </div>
          </div>
          <CodePreview title="pipeline.txt">
            <pre className="text-nil-text whitespace-pre leading-relaxed text-xs sm:text-sm overflow-x-auto">
{`Under Center          NIL33 Engine
┌──────────────┐      ┌──────────────┐
│  Capture     │      │  Score       │
│  Metrics     │─────▶│  33 Factors  │
│  Verify ID   │      │  Compliance  │
│  Sign Hash   │      │  Receipt     │
└──────────────┘      └──────────────┘
     │                       │
     ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  SHA-256     │      │  Ed25519     │
│  Identity    │      │  Deal        │
│  Hash        │      │  Signature   │
└──────────────┘      └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Audit-Ready │
                    │  Receipt     │
                    │  ✓ Verified  │
                    └──────────────┘`}
            </pre>
          </CodePreview>
        </div>
      </Section>

      {/* Modal */}
      {selected && <AthleteDetail athlete={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
