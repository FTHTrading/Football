"use client";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  ChevronRight,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Search,
  FileText,
  Scale,
  Trophy,
  Target,
  Layers,
  Database,
  Bot,
  Sparkles,
  Lock,
  Hash,
  Fingerprint,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  Radio,
  Server,
  Cpu,
  Eye,
  Handshake,
  CircleDollarSign,
  ShieldCheck,
  UserCheck,
  FileCheck,
  Link2,
  Blocks,
  BadgeCheck,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   DATA — 33-Signal Framework, Sports, Deals, AI Agents, Web3
   ═══════════════════════════════════════════════════════════════ */

const NIL33_SIGNALS = [
  {
    bucket: "Identity & Verification",
    color: "#00d4ff",
    icon: Fingerprint,
    count: 5,
    signals: [
      "KYC / Guardian Status",
      "Verification Tier Level",
      "Audit Trail Completeness",
      "Document Integrity Score",
      "Dispute Risk Score",
    ],
  },
  {
    bucket: "Performance Proof",
    color: "#00ff88",
    icon: Activity,
    count: 7,
    signals: [
      "Sport-Specific Verified Metrics",
      "Consistency Delta (Trend Stability)",
      "Injury / Availability Factor",
      "Role & Usage Factor",
      "Training Progression Factor",
      "Peer Percentile Factor",
      "Volatility Penalty (Anti-Fluke)",
    ],
  },
  {
    bucket: "Recruiting & Exposure",
    color: "#a855f7",
    icon: Eye,
    count: 6,
    signals: [
      "Offers Quality Score",
      "Visits & Contact Intensity",
      "Coach Views & Saves",
      "Verified Profile Shares",
      "Highlight / Film Engagement",
      "Geographic Recruiting Demand Index",
    ],
  },
  {
    bucket: "Market & Reach",
    color: "#f59e0b",
    icon: TrendingUp,
    count: 6,
    signals: [
      "Social Graph Signals",
      "Engagement Quality",
      "Content Output Consistency",
      "Audience Geography Fit",
      "Brand Category Affinity",
      "Reputation Safety Score",
    ],
  },
  {
    bucket: "Compliance & Eligibility",
    color: "#ef4444",
    icon: ShieldCheck,
    count: 5,
    signals: [
      "State NIL Law Compatibility",
      "School Policy Compatibility",
      "Restricted Category Blocks",
      "Disclosure & Reporting Completeness",
      "Pay-for-Play Risk Score",
    ],
  },
  {
    bucket: "Deal Execution & Reliability",
    color: "#3b82f6",
    icon: FileCheck,
    count: 4,
    signals: [
      "Contract Completeness Score",
      "Deliverable Fulfillment Rate",
      "Payment Performance Score",
      "Dispute / Chargeback Risk",
    ],
  },
];

const SPORTS = [
  { name: "Football", icon: "🏈", athletes: "13,400+", deals: "4,200+" },
  { name: "Basketball", icon: "🏀", athletes: "11,200+", deals: "5,800+" },
  { name: "Baseball", icon: "⚾", athletes: "8,600+", deals: "2,100+" },
  { name: "Soccer", icon: "⚽", athletes: "9,800+", deals: "1,900+" },
  { name: "Softball", icon: "🥎", athletes: "6,400+", deals: "1,200+" },
  { name: "Volleyball", icon: "🏐", athletes: "7,100+", deals: "1,600+" },
  { name: "Track & Field", icon: "🏃", athletes: "14,200+", deals: "800+" },
  { name: "Swimming", icon: "🏊", athletes: "5,300+", deals: "700+" },
  { name: "Golf", icon: "⛳", athletes: "3,100+", deals: "900+" },
  { name: "Tennis", icon: "🎾", athletes: "2,800+", deals: "600+" },
  { name: "Lacrosse", icon: "🥍", athletes: "4,500+", deals: "500+" },
  { name: "Hockey", icon: "🏒", athletes: "3,900+", deals: "400+" },
  { name: "Wrestling", icon: "🤼", athletes: "5,700+", deals: "350+" },
  { name: "Gymnastics", icon: "🤸", athletes: "2,200+", deals: "1,100+" },
];

const LIVE_DEALS = [
  { athlete: "Marcus Thompson", sport: "Basketball", school: "Duke", brand: "Nike", value: "$285,000", type: "Endorsement", date: "2h ago" },
  { athlete: "Sarah Chen", sport: "Gymnastics", school: "UCLA", brand: "Gatorade", value: "$190,000", type: "Brand Ambassador", date: "4h ago" },
  { athlete: "Jaylen Williams", sport: "Football", school: "Ohio State", brand: "Beats by Dre", value: "$340,000", type: "NIL Deal", date: "6h ago" },
  { athlete: "Alyssa Rodriguez", sport: "Softball", school: "Oklahoma", brand: "Under Armour", value: "$125,000", type: "Endorsement", date: "8h ago" },
  { athlete: "Tyler Brooks", sport: "Baseball", school: "Vanderbilt", brand: "New Balance", value: "$95,000", type: "NIL Deal", date: "12h ago" },
  { athlete: "Emma Wright", sport: "Volleyball", school: "Nebraska", brand: "Adidas", value: "$110,000", type: "Brand Ambassador", date: "1d ago" },
  { athlete: "Deshawn Harris", sport: "Track & Field", school: "LSU", brand: "Puma", value: "$78,000", type: "Endorsement", date: "1d ago" },
  { athlete: "Olivia Park", sport: "Tennis", school: "Stanford", brand: "Wilson", value: "$145,000", type: "NIL Deal", date: "2d ago" },
];

const AI_AGENTS = [
  {
    name: "Valuation Agent",
    icon: BarChart3,
    color: "#00ff88",
    responsibilities: [
      "Computes NIL33 composite index",
      "Runs exponential valuation model",
      "Applies recruiting weight adjustments",
      "Adjusts by geography and conference",
      "Outputs deterministic dollar value",
    ],
  },
  {
    name: "Compliance Agent",
    icon: Shield,
    color: "#ef4444",
    responsibilities: [
      "Checks state law (GA, CA, TX, etc.)",
      "Validates minor consent rules",
      "Flags restricted industries",
      "Generates compliance summary",
      "Logs audit trail per check",
    ],
  },
  {
    name: "Identity Hash Agent",
    icon: Fingerprint,
    color: "#00d4ff",
    responsibilities: [
      "Generates SHA-256 athlete fingerprint",
      "Signs NIL receipt with Ed25519",
      "Anchors Merkle root (future XRPL/EVM)",
      "Tracks version history",
      "Tamper-evident verification",
    ],
  },
  {
    name: "Recruiting Signal Agent",
    icon: Target,
    color: "#a855f7",
    responsibilities: [
      "Analyzes GAI + QB Index signals",
      "Computes percentile cohort ranking",
      "Suggests program fit by conference",
      "Tracks offer quality over time",
      "Geographic demand indexing",
    ],
  },
  {
    name: "Brand Matching Agent",
    icon: Handshake,
    color: "#f59e0b",
    responsibilities: [
      "Scores athlete engagement quality",
      "Matches brand vertical alignment",
      "Calculates projected deal ROI",
      "Filters for compliance clearance",
      "Outputs ranked brand matches",
    ],
  },
];

const WEB3_FEATURES = [
  {
    title: "Identity Anchoring",
    icon: Hash,
    color: "#00d4ff",
    description: "Deterministic identity hash for every verified athlete — SHA-256 + Ed25519 signing with optional blockchain anchor.",
    details: ["Deterministic identity hash", "Ed25519 cryptographic signing", "Optional XRPL / Polygon / Ethereum anchor"],
  },
  {
    title: "NIL Receipt Tokenization",
    icon: FileCheck,
    color: "#00ff88",
    description: "Every NIL deal generates a verifiable receipt with hash, signature, and timestamp — proof of existence, not replacement of contracts.",
    details: ["Hash receipt per deal", "Signed contract fingerprint", "Optional ERC-721 receipt NFT"],
  },
  {
    title: "Future Settlement Rails",
    icon: CircleDollarSign,
    color: "#f59e0b",
    description: "Infrastructure for on-chain escrow, stablecoin settlement, and a public NIL value index oracle — when the market is ready.",
    details: ["Stablecoin settlement rails", "On-chain escrow capability", "Public NIL value index oracle"],
  },
];

const STATS = [
  { label: "Sports Covered", value: "14", suffix: "+" },
  { label: "Signals Tracked", value: "33", suffix: "" },
  { label: "NIL Deals Indexed", value: "21,000", suffix: "+" },
  { label: "States Mapped", value: "50", suffix: "" },
  { label: "Institutions", value: "1,100", suffix: "+" },
  { label: "AI Agents Active", value: "5", suffix: "" },
];

const COMPLIANCE_STATES = [
  { state: "Georgia", status: "Active", laws: 3, restrictions: "Low", highlight: true },
  { state: "California", status: "Active", laws: 3, restrictions: "Low" },
  { state: "Texas", status: "Active", laws: 2, restrictions: "Medium" },
  { state: "Florida", status: "Active", laws: 4, restrictions: "Low" },
  { state: "Alabama", status: "Active", laws: 2, restrictions: "High" },
  { state: "New York", status: "Active", laws: 2, restrictions: "Medium" },
  { state: "Ohio", status: "Active", laws: 3, restrictions: "Low" },
  { state: "Tennessee", status: "Active", laws: 2, restrictions: "Medium" },
];

const VERTICALS = [
  {
    name: "QB DNA",
    sport: "Football — Quarterback",
    domain: "qbdna.nil33.com",
    description: "Verified quarterback identity system with 8-input QB Index, 6-gene GAI, and position-specific NIL valuation.",
    status: "Live",
    color: "#00ff88",
  },
  {
    name: "Court IQ",
    sport: "Basketball",
    domain: "courtiq.nil33.com",
    description: "Shot charts, player efficiency ratings, combine metrics, and basketball-specific NIL deal intelligence.",
    status: "Coming Soon",
    color: "#00d4ff",
  },
  {
    name: "Diamond Edge",
    sport: "Baseball / Softball",
    domain: "diamond.nil33.com",
    description: "Pitching velocity, exit velocity, sprint speed, and defensive metrics for baseball and softball.",
    status: "Coming Soon",
    color: "#f59e0b",
  },
  {
    name: "Pitch Control",
    sport: "Soccer",
    domain: "pitch.nil33.com",
    description: "Expected goals, pass completion mapping, sprint data, positional heat maps, and global scouting integration.",
    status: "Coming Soon",
    color: "#a855f7",
  },
];

/* ═══════════════════════════════════════════════════════════════
   SECTION 0 — NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-nil-border bg-nil-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-nil-green/10 border border-nil-green/20">
            <Zap className="h-5 w-5 text-nil-green" />
          </div>
          <span className="text-xl font-bold tracking-tight text-nil-white">
            NIL<span className="text-nil-green">33</span>
          </span>
          <span className="hidden sm:block text-[10px] tracking-[0.2em] text-nil-muted uppercase ml-1">
            Identity · Value · Legacy
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm">
          <a href="#what" className="text-nil-muted hover:text-nil-white transition-colors">What is NIL33</a>
          <a href="#signals" className="text-nil-muted hover:text-nil-white transition-colors">33 Signals</a>
          <a href="#compliance" className="text-nil-muted hover:text-nil-white transition-colors">Compliance</a>
          <a href="#ai" className="text-nil-muted hover:text-nil-white transition-colors">AI Engine</a>
          <a href="#web3" className="text-nil-muted hover:text-nil-white transition-colors">Web3</a>
          <a href="#norcross" className="text-nil-muted hover:text-nil-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://qbdna.nil33.com" className="hidden sm:block rounded-lg border border-nil-border px-4 py-2 text-sm text-nil-muted hover:text-nil-white hover:border-nil-green/50 transition-all">
            QB DNA
          </a>
          <button className="rounded-lg bg-nil-green px-5 py-2 text-sm font-semibold text-nil-black hover:bg-nil-green/90 transition-colors">
            Get Access
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   "NIL33 — The Deterministic NIL Valuation Engine"
   ═══════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-nil-black via-transparent to-nil-black" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Live badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-nil-green/20 bg-nil-green/5 px-4 py-2 text-sm text-nil-green">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nil-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-nil-green" />
          </span>
          Live — Tracking {STATS[2].value}+ NIL deals across {STATS[0].value}+ sports
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
          <span className="text-nil-white">THE DETERMINISTIC</span>
          <br />
          <span className="bg-gradient-to-r from-nil-green via-nil-cyan to-nil-purple bg-clip-text text-transparent animate-gradient">
            NIL VALUATION
          </span>
          <br />
          <span className="text-nil-white">ENGINE</span>
        </h1>

        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-nil-muted leading-relaxed mb-4">
          33 measurable signals. Deterministic valuation. 50-state compliance routing.
          Verified athlete identity. Cryptographic deal receipts.{" "}
          <span className="text-nil-white">Infrastructure for NIL.</span>
        </p>
        <p className="mx-auto max-w-2xl text-sm text-nil-muted mb-10">
          Built from Norcross, Georgia — serving athletes, coaches, brands, and institutions nationwide.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group flex items-center gap-2 rounded-xl bg-nil-green px-8 py-4 text-base font-bold text-nil-black hover:bg-nil-green/90 transition-all">
            Explore the Platform
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#signals" className="flex items-center gap-2 rounded-xl border border-nil-border px-8 py-4 text-base font-semibold text-nil-white hover:border-nil-cyan/50 transition-all">
            <Layers className="h-5 w-5 text-nil-cyan" />
            The 33-Signal Index
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-nil-border bg-nil-dark/50 p-4">
              <div className="text-2xl font-black text-nil-white">
                {stat.value}
                <span className="text-nil-green">{stat.suffix}</span>
              </div>
              <div className="text-xs text-nil-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — WHAT IS NIL33?
   ═══════════════════════════════════════════════════════════════ */

function WhatIsNIL33() {
  const capabilities = [
    { icon: BarChart3, text: "Calculates athlete NIL value using verified performance metrics" },
    { icon: Target, text: "Tracks recruiting signals and percentile cohorts" },
    { icon: Shield, text: "Validates NIL deals against state compliance rules" },
    { icon: Fingerprint, text: "Generates signed identity hashes for athlete verification" },
    { icon: FileText, text: "Creates compliance-ready NIL agreement records" },
    { icon: Handshake, text: "Enables brand-athlete valuation matching" },
    { icon: Link2, text: "Supports Web3-based receipt anchoring" },
    { icon: GraduationCap, text: "Provides coach-facing ranking intelligence" },
    { icon: Database, text: "Stores structured NIL deal data across 14 sports" },
    { icon: MapPin, text: "Scales nationwide from Norcross, Georgia" },
  ];

  return (
    <section id="what" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Narrative */}
          <div>
            <p className="text-nil-green text-sm font-semibold tracking-widest uppercase mb-3">What is NIL33</p>
            <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-6 leading-tight">
              Not a marketplace.<br />
              <span className="text-nil-cyan">Infrastructure.</span>
            </h2>
            <div className="space-y-4 text-nil-muted leading-relaxed">
              <p>
                NIL33 is a deterministic NIL infrastructure system — the verified operating layer that sits behind athlete profiles and turns NIL into verified identity, verified performance proof, verified deal receipts, and compliance-aware deal workflows.
              </p>
              <p>
                Think of it as <span className="text-nil-white font-semibold">Stripe + Experian + a compliance engine + an athlete ledger</span>, purpose-built for NIL.
              </p>
              <p>
                Current NIL platforms are fragmented: spreadsheets, screenshots, DMs, agents doing manual routing, schools scared of violations, brands unsure what they&apos;re paying for, athletes with no portable verified record.
              </p>
              <p className="text-nil-white">
                NIL33 replaces that with a ledger, a rules engine, a valuation index, and a verifiable receipt system.
              </p>
            </div>

            {/* Infrastructure vs marketplace comparison */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-nil-red/20 bg-nil-red/5 p-4">
                <div className="text-xs font-bold text-nil-red mb-2 uppercase tracking-wider">NIL33 is NOT</div>
                <ul className="text-xs text-nil-muted space-y-1">
                  <li>A marketplace template</li>
                  <li>A collective tool</li>
                  <li>A recruiting app</li>
                  <li>A compliance consultant</li>
                </ul>
              </div>
              <div className="rounded-xl border border-nil-green/20 bg-nil-green/5 p-4">
                <div className="text-xs font-bold text-nil-green mb-2 uppercase tracking-wider">NIL33 IS</div>
                <ul className="text-xs text-nil-muted space-y-1">
                  <li>Universal infrastructure layer</li>
                  <li>Compliance routing engine</li>
                  <li>Identity verification system</li>
                  <li>Deterministic valuation index</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right — 10 capabilities */}
          <div>
            <div className="rounded-2xl border border-nil-border bg-nil-dark/50 p-8">
              <h3 className="text-lg font-bold text-nil-white mb-6">What NIL33 Does</h3>
              <div className="space-y-4">
                {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-nil-green/10 border border-nil-green/20 mt-0.5">
                      <cap.icon className="h-4 w-4 text-nil-green" />
                    </div>
                    <div>
                      <span className="text-nil-green font-mono text-xs mr-2">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm text-nil-text">{cap.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — THE 33-SIGNAL INDEX
   "How NIL Value Is Calculated"
   ═══════════════════════════════════════════════════════════════ */

function SignalsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const totalSignals = NIL33_SIGNALS.reduce((sum, b) => sum + b.count, 0);

  return (
    <section id="signals" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-cyan text-sm font-semibold tracking-widest uppercase mb-3">The 33-Signal Index</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            How NIL Value Is <span className="text-nil-green">Calculated</span>
          </h2>
          <p className="text-nil-muted text-lg max-w-3xl mx-auto mb-2">
            NIL33 represents the <span className="text-nil-white">3 core pillars of modern athlete value — Identity, Performance, and Market — across 3 measurable layers.</span>
          </p>
          <p className="text-nil-muted max-w-2xl mx-auto">
            {totalSignals} deterministic signals grouped into 6 scoring buckets. Not mystical — measurable, explainable, defensible.
          </p>
        </div>

        {/* Output metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
          {[
            { label: "NIL33 Composite", value: "0–100", icon: BarChart3, color: "#00ff88" },
            { label: "Valuation Band", value: "$", icon: CircleDollarSign, color: "#f59e0b" },
            { label: "Compliance", value: "G/Y/R", icon: ShieldCheck, color: "#ef4444" },
            { label: "Deal Readiness", value: "Level", icon: BadgeCheck, color: "#00d4ff" },
            { label: "Deal Types", value: "Match", icon: Handshake, color: "#a855f7" },
          ].map((out) => (
            <div key={out.label} className="rounded-xl border border-nil-border bg-nil-dark/50 p-4 text-center">
              <out.icon className="h-6 w-6 mx-auto mb-2" style={{ color: out.color }} />
              <div className="text-lg font-black text-nil-white">{out.value}</div>
              <div className="text-xs text-nil-muted">{out.label}</div>
            </div>
          ))}
        </div>

        {/* Signal buckets */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NIL33_SIGNALS.map((bucket, i) => (
            <div
              key={bucket.bucket}
              className="rounded-2xl border border-nil-border bg-nil-dark/50 p-6 hover:border-nil-green/20 transition-all cursor-pointer"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${bucket.color}15`, border: `1px solid ${bucket.color}30` }}
                  >
                    <bucket.icon className="h-5 w-5" style={{ color: bucket.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-nil-white">{bucket.bucket}</div>
                    <div className="text-xs text-nil-muted">{bucket.count} signals</div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-nil-muted transition-transform ${expanded === i ? "rotate-180" : ""}`}
                />
              </div>

              {expanded === i && (
                <div className="mt-2 space-y-2 border-t border-nil-border pt-4">
                  {bucket.signals.map((signal, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <Check className="h-3 w-3 flex-shrink-0" style={{ color: bucket.color }} />
                      <span className="text-nil-text">{signal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Valuation formula */}
        <div className="mt-12 rounded-2xl border border-nil-green/20 bg-nil-green/5 p-8 text-center">
          <h3 className="text-lg font-bold text-nil-white mb-4">Deterministic Valuation Formula</h3>
          <div className="font-mono text-2xl sm:text-3xl text-nil-green mb-4">
            Value = 1.065<sup>composite</sup> &times; 12
          </div>
          <p className="text-sm text-nil-muted max-w-xl mx-auto">
            No randomness. No vibes. Server-side validated in Rust. Every input is measurable, every output is reproducible.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — GEORGIA NIL COMPLIANCE
   ═══════════════════════════════════════════════════════════════ */

function ComplianceSection() {
  return (
    <section id="compliance" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-nil-green text-sm font-semibold tracking-widest uppercase mb-3">Georgia NIL Compliance</p>
            <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-6 leading-tight">
              50-State Compliance<br />
              <span className="text-nil-cyan">Routing Engine</span>
            </h2>
            <p className="text-nil-muted text-lg leading-relaxed mb-6">
              Every NIL deal passes through our compliance engine. State laws, institutional policies, and NCAA bylaws — all cross-referenced before any agreement is executed.
            </p>

            {/* Compliance flow */}
            <div className="rounded-2xl border border-nil-border bg-nil-dark/50 p-6 mb-8">
              <h3 className="text-sm font-bold text-nil-white mb-4">Deal Compliance Flow</h3>
              <div className="space-y-3">
                {[
                  "Deal Submitted",
                  "State Law Lookup",
                  "Institution Rule Overlay",
                  "Restriction Detection",
                  "Disclosure Requirement Check",
                  "Compliance Receipt Logged",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-nil-green/10 border border-nil-green/20 text-nil-green text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm text-nil-text">{step}</span>
                    {i < 5 && <ArrowRight className="h-3 w-3 text-nil-muted ml-auto" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: Shield, text: "50-state law database with automatic updates", color: "text-nil-green" },
                { icon: Building2, text: "Institution-specific rule overlays (1,100+ schools)", color: "text-nil-cyan" },
                { icon: Scale, text: "Pre-deal eligibility verification for minors", color: "text-nil-purple" },
                { icon: Activity, text: "Immutable audit trail for every compliance check", color: "text-nil-gold" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm text-nil-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* State compliance map */}
          <div className="rounded-2xl border border-nil-border bg-nil-dark/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-nil-white">State Compliance Map</div>
              <div className="flex items-center gap-2 text-xs text-nil-green">
                <Radio className="h-3 w-3" />
                Live
              </div>
            </div>
            <div className="space-y-3">
              {COMPLIANCE_STATES.map((s) => (
                <div
                  key={s.state}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                    s.highlight ? "bg-nil-green/5 border border-nil-green/20" : "bg-nil-gray/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-nil-white">{s.state}</div>
                      {s.highlight && (
                        <span className="text-[10px] bg-nil-green/10 text-nil-green px-2 py-0.5 rounded-full font-bold">HQ</span>
                      )}
                    </div>
                    <div className="text-xs text-nil-muted">{s.laws} active laws</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    s.restrictions === "Low" ? "bg-nil-green/10 text-nil-green" :
                    s.restrictions === "Medium" ? "bg-nil-gold/10 text-nil-gold" :
                    "bg-nil-red/10 text-nil-red"
                  }`}>
                    {s.restrictions}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs text-nil-muted">Showing 8 of 50 states · Full map available in platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — AI INFRASTRUCTURE
   ═══════════════════════════════════════════════════════════════ */

function AISection() {
  return (
    <section id="ai" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-purple text-sm font-semibold tracking-widest uppercase mb-3">AI Infrastructure</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            Multi-Agent <span className="text-nil-purple">Architecture</span>
          </h2>
          <p className="text-nil-muted text-lg max-w-3xl mx-auto">
            NIL33 operates a multi-agent AI system — not a chatbot, but an orchestration engine.
            Each agent operates independently and scales horizontally.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="rounded-2xl border border-nil-border bg-nil-dark/50 p-8 mb-8">
          <h3 className="text-sm font-bold text-nil-white mb-6">System Architecture</h3>
          <div className="grid sm:grid-cols-5 gap-4 text-center">
            {[
              { icon: Sparkles, label: "Multi-Provider LLM", sub: "GPT · Claude · Gemini", color: "#a855f7" },
              { icon: Bot, label: "Agentic Framework", sub: "MCP · Tool Use · ReAct", color: "#00ff88" },
              { icon: Database, label: "RAG Pipeline", sub: "Embeddings · Vector DB", color: "#00d4ff" },
              { icon: Globe, label: "Live Scraping", sub: "Deals · Social · News", color: "#f97316" },
              { icon: Server, label: "Rust Engine", sub: "Axum · Ed25519 · SQLx", color: "#f59e0b" },
            ].map((node) => (
              <div key={node.label} className="rounded-xl border border-nil-border bg-nil-gray/50 p-5">
                <node.icon className="h-8 w-8 mx-auto mb-3" style={{ color: node.color }} />
                <div className="text-sm font-bold text-nil-white mb-1">{node.label}</div>
                <div className="text-xs text-nil-muted">{node.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="rounded-2xl border border-nil-border bg-nil-dark/50 p-6 hover:border-nil-green/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                >
                  <agent.icon className="h-5 w-5" style={{ color: agent.color }} />
                </div>
                <h3 className="text-sm font-bold text-nil-white">{agent.name}</h3>
              </div>
              <ul className="space-y-2">
                {agent.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-nil-muted">
                    <Check className="h-3 w-3 flex-shrink-0 mt-0.5" style={{ color: agent.color }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Empty card for future */}
          <div className="rounded-2xl border border-dashed border-nil-border bg-nil-dark/30 p-6 flex items-center justify-center">
            <div className="text-center">
              <Cpu className="h-8 w-8 text-nil-muted mx-auto mb-2" />
              <div className="text-sm font-bold text-nil-muted">More Agents</div>
              <div className="text-xs text-nil-muted/60">Expanding continuously</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — WEB3 IDENTITY ANCHORING
   ═══════════════════════════════════════════════════════════════ */

function Web3Section() {
  return (
    <section id="web3" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-gold text-sm font-semibold tracking-widest uppercase mb-3">Web3 Identity Anchoring</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            Verifiable. <span className="text-nil-gold">Not Speculative.</span>
          </h2>
          <p className="text-nil-muted text-lg max-w-3xl mx-auto">
            Web3 done correctly — not crypto hype, but infrastructure.
            Cryptographic proof of identity, deal existence, and timestamp.
            University-friendly. Audit-safe.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {WEB3_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-nil-border bg-nil-dark/50 p-8 hover:border-nil-gold/20 transition-all"
            >
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-bold text-nil-white mb-3">{feature.title}</h3>
              <p className="text-sm text-nil-muted leading-relaxed mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-nil-text">
                    <Blocks className="h-3 w-3 flex-shrink-0" style={{ color: feature.color }} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Rust engine callout */}
        <div className="rounded-2xl border border-nil-gold/20 bg-nil-gold/5 p-8">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-bold text-nil-white mb-3">Powered by Rust Engine</h3>
              <p className="text-sm text-nil-muted leading-relaxed mb-4">
                The cryptographic layer runs on a purpose-built Rust microservice — Axum 0.8, SQLx 0.8, Ed25519-dalek, SHA2.
                Deterministic computation, fast ingestion, strict correctness for compliance logic.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Axum", "SQLx", "Tokio", "Ed25519", "SHA-256", "Governor", "Tower-HTTP"].map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-nil-gold/10 text-nil-gold border border-nil-gold/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="font-mono text-xs text-nil-muted bg-nil-dark/80 rounded-xl p-6 border border-nil-border">
              <div className="text-nil-green">{"// Rust Engine Endpoints"}</div>
              <div className="mt-2">POST /identity/hash</div>
              <div>POST /identity/verify</div>
              <div>POST /nil/receipt</div>
              <div>POST /nil/valuation</div>
              <div>POST /compliance/check</div>
              <div>POST /ranking/compute</div>
              <div>GET &nbsp;/ranking/leaderboard</div>
              <div>GET &nbsp;/health</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7 — FOR ATHLETES / COACHES / BRANDS
   ═══════════════════════════════════════════════════════════════ */

function AudienceSection() {
  const audiences = [
    {
      title: "For Athletes",
      icon: Trophy,
      color: "#00ff88",
      points: [
        "My NIL record is verified and portable",
        "My deals are compliant with state and school rules",
        "My value isn't vibes — it's 33 measured signals",
        "I can prove deliverables and earnings history",
        "I carry my NIL record across schools and transfers",
      ],
    },
    {
      title: "For Coaches & Schools",
      icon: GraduationCap,
      color: "#00d4ff",
      points: [
        "This doesn't create compliance violations",
        "This organizes disclosures automatically",
        "This gives recruiting visibility without chaos",
        "Compliance checks run before any deal executes",
        "Full audit trail for institutional protection",
      ],
    },
    {
      title: "For Brands & Agents",
      icon: Briefcase,
      color: "#f59e0b",
      points: [
        "Filter for compliant athletes instantly",
        "Verify performance and authenticity",
        "Structure deals with templates and receipts",
        "Reduce risk, disputes, and chargebacks",
        "Measurable ROI via engagement scoring",
      ],
    },
    {
      title: "For Parents & Guardians",
      icon: Users,
      color: "#a855f7",
      points: [
        "See what is allowed in your state",
        "Contracts and consent aren't guesswork",
        "Track payments and obligations transparently",
        "Minor consent workflows built in",
        "Full visibility into deal terms",
      ],
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-nil-green text-sm font-semibold tracking-widest uppercase mb-3">Built For Everyone</p>
          <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
            Who NIL33 <span className="text-nil-green">Serves</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {audiences.map((aud) => (
            <div
              key={aud.title}
              className="rounded-2xl border border-nil-border bg-nil-dark/50 p-8 hover:border-nil-green/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${aud.color}15`, border: `1px solid ${aud.color}30` }}
                >
                  <aud.icon className="h-5 w-5" style={{ color: aud.color }} />
                </div>
                <h3 className="text-lg font-bold text-nil-white">{aud.title}</h3>
              </div>
              <ul className="space-y-3">
                {aud.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-nil-muted">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: aud.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION — VERTICALS & LIVE DEALS
   ═══════════════════════════════════════════════════════════════ */

function VerticalsAndDeals() {
  return (
    <section className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        {/* Verticals */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <p className="text-nil-gold text-sm font-semibold tracking-widest uppercase mb-3">Sport Verticals</p>
            <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-4">
              One Platform. <span className="text-nil-gold">Every Sport.</span>
            </h2>
            <p className="text-nil-muted text-lg max-w-2xl mx-auto">
              Each sport gets a dedicated subdomain with position-specific analytics, metrics, and NIL intelligence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {VERTICALS.map((v) => (
              <div
                key={v.name}
                className="group rounded-2xl border border-nil-border bg-nil-dark/50 p-8 hover:border-nil-green/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-nil-white">{v.name}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      v.status === "Live"
                        ? "bg-nil-green/10 text-nil-green border border-nil-green/20"
                        : "bg-nil-border text-nil-muted"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
                <div className="text-sm text-nil-cyan mb-1 font-mono">{v.domain}</div>
                <div className="text-xs text-nil-muted mb-4">{v.sport}</div>
                <p className="text-sm text-nil-muted leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>

          {/* 14 sports grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {SPORTS.map((sport) => (
              <div
                key={sport.name}
                className="group rounded-xl border border-nil-border bg-nil-dark/50 p-3 hover:border-nil-green/30 transition-all text-center"
              >
                <div className="text-2xl mb-1">{sport.icon}</div>
                <div className="text-xs font-bold text-nil-white">{sport.name}</div>
                <div className="text-[10px] text-nil-muted mt-1">{sport.deals} deals</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Deals */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <p className="text-nil-cyan text-sm font-semibold tracking-widest uppercase mb-2">National Deal Feed</p>
              <h2 className="text-3xl sm:text-4xl font-black text-nil-white">Live NIL Deals</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-nil-green">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nil-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-nil-green" />
              </span>
              Real time
            </div>
          </div>

          <div className="grid gap-3">
            {LIVE_DEALS.map((deal, i) => (
              <div
                key={i}
                className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-nil-border bg-nil-dark/50 px-6 py-4 hover:border-nil-green/20 transition-all"
              >
                <div className="col-span-4 sm:col-span-3">
                  <div className="text-sm font-bold text-nil-white">{deal.athlete}</div>
                  <div className="text-xs text-nil-muted">{deal.sport} · {deal.school}</div>
                </div>
                <div className="col-span-2 hidden sm:block">
                  <div className="text-sm text-nil-text">{deal.brand}</div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <span className="inline-flex items-center rounded-full bg-nil-green/10 px-3 py-1 text-xs font-medium text-nil-green">
                    {deal.type}
                  </span>
                </div>
                <div className="col-span-5 sm:col-span-3 text-right">
                  <div className="text-lg font-black text-nil-white">{deal.value}</div>
                  <div className="text-xs text-nil-muted">{deal.date}</div>
                </div>
                <div className="hidden sm:flex col-span-2 justify-end">
                  <ChevronRight className="h-4 w-4 text-nil-muted group-hover:text-nil-green transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8 — BASED IN NORCROSS, GA 30092
   ═══════════════════════════════════════════════════════════════ */

function NorcrossSection() {
  return (
    <section id="norcross" className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-nil-green text-sm font-semibold tracking-widest uppercase mb-3">NIL Infrastructure — Norcross, Georgia</p>
            <h2 className="text-4xl sm:text-5xl font-black text-nil-white mb-6 leading-tight">
              Based in <span className="text-nil-green">Norcross,</span><br />
              GA 30092
            </h2>
            <p className="text-nil-muted text-lg leading-relaxed mb-6">
              NIL33 operates from 5655 Peachtree Parkway, Norcross, Georgia 30092,
              serving athletes, coaches, and brands nationwide.
              Georgia is one of the most competitive recruiting markets in the country.
            </p>
            <p className="text-nil-muted leading-relaxed mb-8">
              Positioned at the center of SEC-level recruiting territory,
              NIL33 serves the Southeastern recruiting corridor while supporting
              national NIL brand networks and college programs across all 50 states.
            </p>

            <div className="space-y-4">
              {[
                { icon: MapPin, text: "5655 Peachtree Parkway, Norcross, GA 30092" },
                { icon: Building2, text: "UnyKorn — Parent company" },
                { icon: Globe, text: "Serving athletes and institutions nationwide" },
                { icon: GraduationCap, text: "SEC-level recruiting territory" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-nil-green" />
                  <span className="text-sm text-nil-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Markets served */}
          <div className="rounded-2xl border border-nil-border bg-nil-dark/50 p-8">
            <h3 className="text-lg font-bold text-nil-white mb-6">Markets Served</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { market: "Georgia Athletes", desc: "High school and collegiate", icon: "🍑" },
                { market: "Southeast Corridor", desc: "AL, FL, TN, SC, NC, LA", icon: "🏈" },
                { market: "National NIL Brands", desc: "Brand networks & agencies", icon: "🏢" },
                { market: "College Programs", desc: "All 50 states, 1,100+ schools", icon: "🎓" },
                { market: "Gwinnett County", desc: "Local athlete development", icon: "📍" },
                { market: "Atlanta Metro", desc: "Greater Atlanta NIL ecosystem", icon: "🌆" },
              ].map((m) => (
                <div key={m.market} className="rounded-xl bg-nil-gray/50 p-4">
                  <div className="text-xl mb-2">{m.icon}</div>
                  <div className="text-sm font-bold text-nil-white">{m.market}</div>
                  <div className="text-xs text-nil-muted">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTA + FOOTER
   ═══════════════════════════════════════════════════════════════ */

function CTA() {
  return (
    <section className="py-24 px-6 border-t border-nil-border">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl sm:text-6xl font-black text-nil-white mb-6">
          The NIL Industry Needs <span className="text-nil-green">Infrastructure.</span>
        </h2>
        <p className="text-nil-muted text-lg mb-10 max-w-2xl mx-auto">
          NIL33 is the interoperable infrastructure layer — connecting existing NIL platforms,
          generating verifiable receipts, and providing a portable athlete NIL record with
          jurisdiction-aware compliance routing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group flex items-center gap-2 rounded-xl bg-nil-green px-10 py-5 text-lg font-bold text-nil-black hover:bg-nil-green/90 transition-all">
            Get Access
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="https://github.com/FTHTrading/nil33" className="flex items-center gap-2 rounded-xl border border-nil-border px-10 py-5 text-lg font-semibold text-nil-white hover:border-nil-green/50 transition-all">
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-nil-border py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid sm:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-nil-green" />
              <span className="text-lg font-bold text-nil-white">NIL<span className="text-nil-green">33</span></span>
            </div>
            <p className="text-xs text-nil-muted leading-relaxed mb-3">
              Identity · Value · Legacy
            </p>
            <p className="text-xs text-nil-muted leading-relaxed">
              The deterministic NIL infrastructure layer. 33 signals. 14 sports. 50 states.
              AI-powered valuation, compliance routing, and verifiable identity receipts.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-nil-white mb-4">Platform</h4>
            <div className="flex flex-col gap-2 text-sm text-nil-muted">
              <a href="#what" className="hover:text-nil-white transition-colors">What is NIL33</a>
              <a href="#signals" className="hover:text-nil-white transition-colors">33-Signal Index</a>
              <a href="#compliance" className="hover:text-nil-white transition-colors">Compliance Engine</a>
              <a href="#ai" className="hover:text-nil-white transition-colors">AI Infrastructure</a>
              <a href="#web3" className="hover:text-nil-white transition-colors">Web3 Anchoring</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-nil-white mb-4">Verticals</h4>
            <div className="flex flex-col gap-2 text-sm text-nil-muted">
              <a href="https://qbdna.nil33.com" className="hover:text-nil-white transition-colors">QB DNA — Live</a>
              <span className="text-nil-border">Court IQ — Soon</span>
              <span className="text-nil-border">Diamond Edge — Soon</span>
              <span className="text-nil-border">Pitch Control — Soon</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-nil-white mb-4">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-nil-muted">
              <span className="text-nil-text">NIL33 — A UnyKorn Company</span>
              <span>5655 Peachtree Pkwy</span>
              <span>Norcross, GA 30092</span>
              <a href="mailto:kevanbtc@gmail.com" className="hover:text-nil-white transition-colors">kevanbtc@gmail.com</a>
              <a href="https://github.com/FTHTrading/nil33" className="hover:text-nil-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
        <div className="border-t border-nil-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-nil-muted">&copy; 2026 NIL33. All rights reserved. A UnyKorn company. Norcross, Georgia.</div>
          <div className="text-xs text-nil-muted">nil33.com · Cloudflare DNS · Rust + Next.js</div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE — Full 8-Section SEO Architecture
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-nil-black">
      <Nav />
      {/* S1: Hero */}
      <Hero />
      {/* S2: What is NIL33 */}
      <WhatIsNIL33 />
      {/* S3: 33-Signal Index */}
      <SignalsSection />
      {/* S4: Compliance Engine */}
      <ComplianceSection />
      {/* S5: AI Infrastructure */}
      <AISection />
      {/* S6: Web3 Identity Anchoring */}
      <Web3Section />
      {/* S7: Audience — Athletes / Coaches / Brands */}
      <AudienceSection />
      {/* Verticals & Live Deals */}
      <VerticalsAndDeals />
      {/* S8: Norcross, GA 30092 */}
      <NorcrossSection />
      {/* CTA */}
      <CTA />
      {/* Footer */}
      <Footer />
    </main>
  );
}
