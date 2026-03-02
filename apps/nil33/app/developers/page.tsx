"use client";

import Link from "next/link";

/* ═══════════════════════════════════════════════════
   NIL33 — /developers
   
   ALL engineering details live here.
   Rust, deterministic scoring, rulesets, architecture,
   cryptographic signing — none of this is on the homepage.
   ═══════════════════════════════════════════════════ */

export default function DevelopersPage() {
  return (
    <>
      <Nav />

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-nil-green uppercase tracking-widest mb-4">
            Developers
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-nil-white leading-tight mb-6">
            How NIL33 works
            <br />
            under the hood.
          </h1>
          <p className="text-lg text-nil-muted max-w-lg mx-auto">
            Deterministic scoring. Rust-powered engine. Cryptographic receipts.
            50-state compliance rulesets. This page is for engineers, auditors,
            and technical evaluators.
          </p>
        </div>
      </section>

      {/* ─── Architecture Overview ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-8">
            System Architecture
          </h2>

          <div className="bg-nil-black border border-nil-border rounded-xl p-6 font-mono text-sm">
            <pre className="text-nil-text overflow-x-auto whitespace-pre leading-relaxed">
{`┌─────────────────────────────────────────────────┐
│                   NIL33 Stack                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┐   ┌────────────┐   ┌────────┐ │
│  │  Next.js UI  │──▶│  API Layer │──▶│  Rust  │ │
│  │  (React 19)  │   │ (REST/JSON)│   │ Engine │ │
│  └─────────────┘   └────────────┘   └────────┘ │
│                                         │       │
│                          ┌──────────────┤       │
│                          ▼              ▼       │
│                    ┌──────────┐  ┌───────────┐  │
│                    │ Rulesets │  │  Receipts  │  │
│                    │ (50 + 10)│  │ (Ed25519)  │  │
│                    └──────────┘  └───────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Frontend",
                desc: "Next.js 16, React 19, Tailwind 4. Static export for edge deployment. No client-side data persistence.",
                color: "#e5e5e5",
              },
              {
                title: "API Layer",
                desc: "REST endpoints for scoring, compliance checking, and receipt generation. JSON in, JSON out. Stateless.",
                color: "#00d4ff",
              },
              {
                title: "Rust Engine",
                desc: "Core scoring and compliance logic written in Rust for deterministic, auditable computation. No floating-point ambiguity.",
                color: "#f97316",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-nil-dark border border-nil-border rounded-xl p-5"
              >
                <h3
                  className="font-semibold mb-2"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="text-nil-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The 33 Factors ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            The 33 Scoring Factors
          </h2>
          <p className="text-nil-muted mb-10">
            Every athlete is scored across 33 weighted factors in four
            categories. Each factor has a defined input type, normalization
            method, and weight. The composite score is the weighted sum,
            normalized to 0–99.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                category: "Social Reach",
                color: "#00ff88",
                weight: "25%",
                factors: [
                  "Instagram followers",
                  "Instagram engagement rate",
                  "TikTok followers",
                  "TikTok engagement rate",
                  "Twitter/X followers",
                  "YouTube subscribers",
                  "Content posting frequency",
                  "Platform diversity score",
                  "Audience authenticity index",
                ],
              },
              {
                category: "Athletic Performance",
                color: "#00d4ff",
                weight: "30%",
                factors: [
                  "Position-specific stats (passing yards, tackles, etc.)",
                  "Conference tier",
                  "Team win-loss record",
                  "Individual awards & honors",
                  "Draft stock / mock draft position",
                  "Years of eligibility remaining",
                  "Games started",
                  "Position scarcity premium",
                ],
              },
              {
                category: "Market Demand",
                color: "#a855f7",
                weight: "25%",
                factors: [
                  "Media mentions (last 90 days)",
                  "Regional market size",
                  "Sport premium (football vs. other)",
                  "NIL market maturity (by state)",
                  "Competing offers / market saturation",
                  "Seasonal demand factor",
                  "Rivalry / rivalry game premium",
                  "Postseason exposure potential",
                ],
              },
              {
                category: "Brand Alignment",
                color: "#f59e0b",
                weight: "20%",
                factors: [
                  "Audience demographic quality",
                  "Brand safety score",
                  "Narrative / story value",
                  "Community involvement",
                  "Content quality index",
                  "Uniqueness / differentiation",
                  "Long-term brand potential",
                  "Cross-sport appeal",
                ],
              },
            ].map((cat) => (
              <div
                key={cat.category}
                className="bg-nil-dark border border-nil-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: cat.color }}>
                    {cat.category}
                  </h3>
                  <span className="text-nil-muted text-xs font-mono">
                    Weight: {cat.weight}
                  </span>
                </div>
                <ol className="space-y-1.5">
                  {cat.factors.map((f, i) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-nil-text"
                    >
                      <span className="text-nil-muted font-mono text-xs w-5 shrink-0 mt-0.5 text-right">
                        {i + 1}.
                      </span>
                      {f}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Deterministic Scoring ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            Deterministic Scoring
          </h2>
          <p className="text-nil-muted mb-8">
            NIL33 produces deterministic scores: the same inputs always produce
            the same output. This is a design requirement for auditability.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-nil-black border border-nil-border rounded-xl p-6">
              <h3 className="text-nil-white font-semibold mb-3">
                Why Rust?
              </h3>
              <ul className="space-y-2 text-sm text-nil-muted">
                <li className="flex items-start gap-2">
                  <span className="text-nil-orange mt-0.5">▸</span>
                  No garbage collection pauses — predictable execution
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-nil-orange mt-0.5">▸</span>
                  Integer arithmetic for scoring — no floating-point drift
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-nil-orange mt-0.5">▸</span>
                  Memory safety without runtime overhead
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-nil-orange mt-0.5">▸</span>
                  Compiles to WASM for browser-side validation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-nil-orange mt-0.5">▸</span>
                  Sub-millisecond score generation
                </li>
              </ul>
            </div>

            <div className="bg-nil-black border border-nil-border rounded-xl p-6">
              <h3 className="text-nil-white font-semibold mb-3">
                Score Contract
              </h3>
              <div className="font-mono text-xs text-nil-text space-y-1">
                <p className="text-nil-muted">
                  {"//"} Input: AthleteProfile + DealProposal
                </p>
                <p className="text-nil-muted">
                  {"//"} Output: ScoredDeal (deterministic)
                </p>
                <p className="mt-3">
                  <span className="text-nil-cyan">fn</span>{" "}
                  <span className="text-nil-green">score_deal</span>(
                </p>
                <p className="pl-4">
                  profile: <span className="text-nil-gold">&AthleteProfile</span>,
                </p>
                <p className="pl-4">
                  proposal: <span className="text-nil-gold">&DealProposal</span>,
                </p>
                <p className="pl-4">
                  rules: <span className="text-nil-gold">&ComplianceRuleset</span>,
                </p>
                <p>
                  ) -&gt; <span className="text-nil-gold">ScoredDeal</span> {"{"}
                </p>
                <p className="pl-4 text-nil-muted">
                  {"//"} 33-factor weighted composite
                </p>
                <p className="pl-4 text-nil-muted">
                  {"//"} Integer arithmetic only
                </p>
                <p className="pl-4 text-nil-muted">
                  {"//"} Compliance check included
                </p>
                <p className="pl-4 text-nil-muted">
                  {"//"} Receipt generated on success
                </p>
                <p>{"}"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Compliance Rulesets ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            Compliance Rulesets
          </h2>
          <p className="text-nil-muted mb-8">
            NIL33 maintains structured compliance rulesets for all 50 states
            and 10+ conference-specific rule sets. Each ruleset is versioned,
            timestamped, and auditable.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-nil-dark border border-nil-border rounded-xl p-5 text-center">
              <p className="text-nil-white font-mono text-3xl font-bold mb-1">
                50
              </p>
              <p className="text-nil-muted text-xs uppercase tracking-wider">
                State rulesets
              </p>
            </div>
            <div className="bg-nil-dark border border-nil-border rounded-xl p-5 text-center">
              <p className="text-nil-white font-mono text-3xl font-bold mb-1">
                10+
              </p>
              <p className="text-nil-muted text-xs uppercase tracking-wider">
                Conference rulesets
              </p>
            </div>
            <div className="bg-nil-dark border border-nil-border rounded-xl p-5 text-center">
              <p className="text-nil-white font-mono text-3xl font-bold mb-1">
                v3.2
              </p>
              <p className="text-nil-muted text-xs uppercase tracking-wider">
                Current ruleset version
              </p>
            </div>
          </div>

          <div className="bg-nil-dark border border-nil-border rounded-xl p-6">
            <h3 className="text-nil-white font-semibold mb-3">
              Ruleset Structure
            </h3>
            <div className="font-mono text-xs text-nil-text overflow-x-auto">
              <pre className="whitespace-pre leading-relaxed">
{`StateLaw {
  state:          "Georgia"
  effective_date: "2024-07-01"
  version:        "3.2.1"
  
  requires_disclosure:     true
  max_contract_duration:   12      // months
  institutional_involvement: "prohibited"
  agent_registration:      "required"
  tax_reporting_threshold: 600     // USD
  
  restrictions: [
    "No pay-for-play (performance bonuses prohibited)",
    "No institutional NIL deals (school cannot be party)",
    "Agent must be registered with state"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cryptographic Receipts ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            Cryptographic Deal Receipts
          </h2>
          <p className="text-nil-muted mb-8">
            Every scored deal produces a receipt signed with Ed25519.
            Receipts are tamper-evident: any modification invalidates the
            signature. This creates an auditable chain of deal decisions.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-nil-white font-semibold mb-4">
                Receipt Contents
              </h3>
              <ul className="space-y-2 text-sm text-nil-muted">
                {[
                  "Receipt ID (unique, sequential)",
                  "Athlete profile hash (SHA-256)",
                  "Deal proposal details",
                  "Composite score + sub-scores",
                  "Valuation band (low–high)",
                  "Compliance check results",
                  "Timestamp (ISO 8601, UTC)",
                  "Ruleset version used",
                  "Ed25519 signature",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-nil-purple mt-0.5">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-nil-white font-semibold mb-4">
                Verification
              </h3>
              <div className="bg-nil-black border border-nil-border rounded-xl p-5 font-mono text-xs text-nil-text">
                <p className="text-nil-muted mb-2">
                  {"//"} Verify any receipt with the public key
                </p>
                <p>
                  <span className="text-nil-cyan">let</span> valid ={" "}
                  <span className="text-nil-green">verify_receipt</span>(
                </p>
                <p className="pl-4">
                  receipt: <span className="text-nil-gold">&Receipt</span>,
                </p>
                <p className="pl-4">
                  pub_key: <span className="text-nil-gold">&PublicKey</span>,
                </p>
                <p>
                  ) -&gt; <span className="text-nil-gold">bool</span>;
                </p>
                <p className="mt-3 text-nil-muted">
                  {"//"} Returns true if receipt is untampered
                </p>
                <p className="text-nil-muted">
                  {"//"} Returns false if any field was modified
                </p>
              </div>

              <div className="mt-4 bg-nil-black border border-nil-border rounded-xl p-5">
                <p className="text-nil-white text-sm font-medium mb-2">
                  Why Ed25519?
                </p>
                <ul className="space-y-1.5 text-xs text-nil-muted">
                  <li>• 128-bit security level</li>
                  <li>• Deterministic signatures (no random nonce)</li>
                  <li>• Small keys (32 bytes public, 64 bytes private)</li>
                  <li>• Fast verification (~71,000 ops/sec)</li>
                  <li>
                    • Widely audited (used by SSH, Signal, Tor)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Data Pipeline ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            Data Pipeline
          </h2>
          <p className="text-nil-muted mb-8">
            NIL33 ingests data from multiple sources to build athlete profiles.
            All data flows through normalization before reaching the scoring
            engine.
          </p>

          <div className="bg-nil-dark border border-nil-border rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-nil-text whitespace-pre leading-relaxed">
{`Social APIs          Athletic Data         Market Signals
(Instagram,          (Stats providers,     (News APIs,
 TikTok, X,           conference data,      Google Trends,
 YouTube)             awards databases)     regional data)
     │                      │                     │
     ▼                      ▼                     ▼
┌──────────────────────────────────────────────────────┐
│              Normalization Layer                      │
│  • Rate limiting   • Deduplication   • Validation    │
│  • Unit conversion • Null handling   • Freshness     │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Athlete Profile    │
              │  (33 normalized      │
              │   factor inputs)     │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    Rust Scoring      │
              │    Engine            │
              │  • Weighted sum      │
              │  • Integer math      │
              │  • Deterministic     │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Scored Deal +      │
              │   Signed Receipt     │
              └─────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* ─── API Reference (Preview) ─── */}
      <section className="py-24 px-6 bg-nil-dark border-y border-nil-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            API Reference (Preview)
          </h2>
          <p className="text-nil-muted mb-8">
            Enterprise customers get REST API access for integration with
            internal tools, CRMs, and deal management systems.
          </p>

          <div className="space-y-4">
            {[
              {
                method: "POST",
                path: "/api/v1/score",
                desc: "Score an athlete and return composite + sub-scores + valuation band",
                color: "#00ff88",
              },
              {
                method: "POST",
                path: "/api/v1/compliance",
                desc: "Check a deal proposal against state, conference, and NCAA rules",
                color: "#00d4ff",
              },
              {
                method: "POST",
                path: "/api/v1/receipt",
                desc: "Generate a signed receipt for a scored deal",
                color: "#a855f7",
              },
              {
                method: "GET",
                path: "/api/v1/receipts/:id",
                desc: "Retrieve and verify an existing receipt",
                color: "#f59e0b",
              },
              {
                method: "GET",
                path: "/api/v1/rulesets/:state",
                desc: "Get the current compliance ruleset for a state",
                color: "#e5e5e5",
              },
            ].map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex items-start gap-4 bg-nil-black border border-nil-border rounded-xl p-5"
              >
                <span
                  className="font-mono text-xs font-bold px-2 py-1 rounded shrink-0"
                  style={{
                    color: endpoint.color,
                    backgroundColor: `${endpoint.color}15`,
                  }}
                >
                  {endpoint.method}
                </span>
                <div>
                  <p className="text-nil-white font-mono text-sm">
                    {endpoint.path}
                  </p>
                  <p className="text-nil-muted text-xs mt-1">
                    {endpoint.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Open Source ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-nil-white mb-4">
            Built in the open
          </h2>
          <p className="text-nil-muted mb-8 max-w-lg mx-auto">
            NIL33&apos;s scoring engine and compliance rulesets are designed
            for auditability. We believe the best way to earn trust is
            transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/FTHTrading"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-nil-dark border border-nil-border text-nil-white font-medium px-7 py-3 rounded-xl hover:border-nil-green/30 transition-colors text-sm"
            >
              GitHub →
            </a>
            <a
              href="mailto:developers@nil33.com?subject=NIL33%20Technical%20Inquiry"
              className="bg-nil-dark border border-nil-border text-nil-muted font-medium px-7 py-3 rounded-xl hover:border-nil-green/30 hover:text-nil-white transition-colors text-sm"
            >
              Contact Engineering
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ─── Shared ─── */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nil-black/90 backdrop-blur-xl border-b border-nil-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
            <span className="text-nil-green font-bold text-sm">33</span>
          </div>
          <span className="text-nil-white font-semibold tracking-tight">NIL33</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/product" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Product</Link>
          <Link href="/collectives" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">For Collectives</Link>
          <Link href="/pricing" className="text-sm text-nil-muted hover:text-nil-white transition-colors hidden sm:block">Pricing</Link>
          <Link href="/demo" className="text-sm bg-nil-green text-nil-black font-semibold px-4 py-1.5 rounded-lg hover:bg-nil-green/90 transition-colors">Run Demo</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-nil-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-nil-green/10 border border-nil-green/20 flex items-center justify-center">
            <span className="text-nil-green font-bold text-xs">33</span>
          </div>
          <span className="text-nil-white font-medium text-sm">NIL33</span>
          <span className="text-nil-muted text-xs ml-2">Capital Discipline Software</span>
        </div>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <Link href="/product" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Product</Link>
          <Link href="/collectives" className="text-xs text-nil-muted hover:text-nil-white transition-colors">For Collectives</Link>
          <Link href="/pricing" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Pricing</Link>
          <Link href="/demo" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Demo</Link>
          <Link href="/developers" className="text-xs text-nil-muted hover:text-nil-white transition-colors">Developers</Link>
        </div>
        <p className="text-xs text-nil-muted">© {new Date().getFullYear()} NIL33</p>
      </div>
    </footer>
  );
}
