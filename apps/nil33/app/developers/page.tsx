import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import Card from "../../components/Card";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import Stat from "../../components/Stat";

export default function DevelopersPage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="pt-32 sm:pt-40 pb-24 px-6 hero-glow">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-5">Developers</p>
          <h1 className="text-display text-nil-white max-w-2xl mx-auto">
            How NIL33 works
            <span className="gradient-text"> under the hood.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-lg mx-auto">
            Deterministic scoring. Rust-powered engine. Cryptographic receipts.
            50-state compliance rulesets. This page is for engineers, auditors,
            and technical evaluators.
          </p>
        </div>
      </section>

      {/* ═══ Architecture ═══ */}
      <Section dark>
        <SectionHeader
          overline="Architecture"
          title="System overview."
        />
        <CodePreview title="nil33-architecture.txt">
          <pre className="text-nil-text overflow-x-auto whitespace-pre leading-relaxed text-xs sm:text-sm">
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
        </CodePreview>

        <div className="grid md:grid-cols-3 gap-6 mt-8 stagger">
          {[
            { title: "Frontend", desc: "Next.js 16, React 19, Tailwind 4. Static export for edge deployment. No client-side data persistence.", color: "var(--color-nil-text)" },
            { title: "API Layer", desc: "REST endpoints for scoring, compliance checking, and receipt generation. JSON in, JSON out. Stateless.", color: "var(--color-nil-cyan)" },
            { title: "Rust Engine", desc: "Core scoring and compliance logic written in Rust for deterministic, auditable computation. No floating-point ambiguity.", color: "#f97316" },
          ].map((item) => (
            <Card key={item.title} hover>
              <h3 className="font-semibold mb-2" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-nil-muted text-sm leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══ 33 Factors ═══ */}
      <Section>
        <SectionHeader
          overline="Scoring model"
          title="The 33 factors."
          subtitle="Every athlete is scored across 33 weighted factors in four categories. Each factor has a defined input type, normalization method, and weight. The composite score is the weighted sum, normalized to 0–99."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              category: "Social Reach", color: "var(--color-nil-green)", weight: "25%",
              factors: ["Instagram followers", "Instagram engagement rate", "TikTok followers", "TikTok engagement rate", "Twitter/X followers", "YouTube subscribers", "Content posting frequency", "Platform diversity score", "Audience authenticity index"],
            },
            {
              category: "Athletic Performance", color: "var(--color-nil-cyan)", weight: "30%",
              factors: ["Position-specific stats (passing yards, tackles, etc.)", "Conference tier", "Team win-loss record", "Individual awards & honors", "Draft stock / mock draft position", "Years of eligibility remaining", "Games started", "Position scarcity premium"],
            },
            {
              category: "Market Demand", color: "var(--color-nil-purple)", weight: "25%",
              factors: ["Media mentions (last 90 days)", "Regional market size", "Sport premium (football vs. other)", "NIL market maturity (by state)", "Competing offers / market saturation", "Seasonal demand factor", "Rivalry / rivalry game premium", "Postseason exposure potential"],
            },
            {
              category: "Brand Alignment", color: "var(--color-nil-gold)", weight: "20%",
              factors: ["Audience demographic quality", "Brand safety score", "Narrative / story value", "Community involvement", "Content quality index", "Uniqueness / differentiation", "Long-term brand potential", "Cross-sport appeal"],
            },
          ].map((cat) => (
            <Card key={cat.category}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: cat.color }}>{cat.category}</h3>
                <span className="text-nil-muted text-xs font-mono">Weight: {cat.weight}</span>
              </div>
              <ol className="space-y-1.5">
                {cat.factors.map((f, i) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-nil-text">
                    <span className="text-nil-muted font-mono text-xs w-5 shrink-0 mt-0.5 text-right">{i + 1}.</span>
                    {f}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══ Deterministic Scoring ═══ */}
      <Section dark>
        <SectionHeader
          overline="Engine design"
          title="Deterministic scoring."
          subtitle="NIL33 produces deterministic scores: the same inputs always produce the same output. This is a design requirement for auditability."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-nil-white font-semibold mb-4">Why Rust?</h3>
            <ul className="space-y-2.5 text-sm text-nil-muted">
              {[
                "No garbage collection pauses — predictable execution",
                "Integer arithmetic for scoring — no floating-point drift",
                "Memory safety without runtime overhead",
                "Compiles to WASM for browser-side validation",
                "Sub-millisecond score generation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#f97316] mt-0.5">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <CodePreview title="score_deal.rs">
            <div className="font-mono text-xs text-nil-text space-y-1">
              <p className="text-nil-muted">{"// Input: AthleteProfile + DealProposal"}</p>
              <p className="text-nil-muted">{"// Output: ScoredDeal (deterministic)"}</p>
              <p className="mt-3"><span className="text-nil-cyan">fn</span> <span className="text-nil-green">score_deal</span>(</p>
              <p className="pl-4">profile: <span className="text-nil-gold">&AthleteProfile</span>,</p>
              <p className="pl-4">proposal: <span className="text-nil-gold">&DealProposal</span>,</p>
              <p className="pl-4">rules: <span className="text-nil-gold">&ComplianceRuleset</span>,</p>
              <p>) -&gt; <span className="text-nil-gold">ScoredDeal</span> {"{"}</p>
              <p className="pl-4 text-nil-muted">{"// 33-factor weighted composite"}</p>
              <p className="pl-4 text-nil-muted">{"// Integer arithmetic only"}</p>
              <p className="pl-4 text-nil-muted">{"// Compliance check included"}</p>
              <p className="pl-4 text-nil-muted">{"// Receipt generated on success"}</p>
              <p>{"}"}</p>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ Compliance Rulesets ═══ */}
      <Section>
        <SectionHeader
          overline="Regulation"
          title="Compliance rulesets."
          subtitle="NIL33 maintains structured compliance rulesets for all 50 states and 10+ conference-specific rule sets. Each ruleset is versioned, timestamped, and auditable."
        />
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Stat value="50" label="State rulesets" />
          <Stat value="10+" label="Conference rulesets" />
          <Stat value="v3.2" label="Current ruleset version" />
        </div>

        <CodePreview title="state-law-georgia.json">
          <pre className="text-nil-text whitespace-pre leading-relaxed text-xs sm:text-sm overflow-x-auto">
{`StateLaw {
  state:          "Georgia"
  effective_date: "2024-07-01"
  version:        "3.2.1"
  
  requires_disclosure:       true
  max_contract_duration:     12      // months
  institutional_involvement: "prohibited"
  agent_registration:        "required"
  tax_reporting_threshold:   600     // USD
  
  restrictions: [
    "No pay-for-play (performance bonuses prohibited)",
    "No institutional NIL deals (school cannot be party)",
    "Agent must be registered with state"
  ]
}`}
          </pre>
        </CodePreview>
      </Section>

      {/* ═══ Cryptographic Receipts ═══ */}
      <Section dark>
        <SectionHeader
          overline="Audit trail"
          title="Cryptographic deal receipts."
          subtitle="Every scored deal produces a receipt signed with Ed25519. Receipts are tamper-evident: any modification invalidates the signature."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-nil-white font-semibold mb-4">Receipt Contents</h3>
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

          <div className="space-y-4">
            <CodePreview title="verify.rs">
              <div className="font-mono text-xs text-nil-text">
                <p className="text-nil-muted mb-2">{"// Verify any receipt with the public key"}</p>
                <p><span className="text-nil-cyan">let</span> valid = <span className="text-nil-green">verify_receipt</span>(</p>
                <p className="pl-4">receipt: <span className="text-nil-gold">&Receipt</span>,</p>
                <p className="pl-4">pub_key: <span className="text-nil-gold">&PublicKey</span>,</p>
                <p>) -&gt; <span className="text-nil-gold">bool</span>;</p>
                <p className="mt-3 text-nil-muted">{"// Returns true if receipt is untampered"}</p>
                <p className="text-nil-muted">{"// Returns false if any field was modified"}</p>
              </div>
            </CodePreview>

            <Card>
              <p className="text-nil-white text-sm font-medium mb-2">Why Ed25519?</p>
              <ul className="space-y-1.5 text-xs text-nil-muted">
                <li>• 128-bit security level</li>
                <li>• Deterministic signatures (no random nonce)</li>
                <li>• Small keys (32 bytes public, 64 bytes private)</li>
                <li>• Fast verification (~71,000 ops/sec)</li>
                <li>• Widely audited (used by SSH, Signal, Tor)</li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* ═══ Data Pipeline ═══ */}
      <Section>
        <SectionHeader
          overline="Data ingestion"
          title="Data pipeline."
          subtitle="NIL33 ingests data from multiple sources to build athlete profiles. All data flows through normalization before reaching the scoring engine."
        />
        <CodePreview title="data-pipeline.txt">
          <pre className="text-nil-text whitespace-pre leading-relaxed text-xs sm:text-sm overflow-x-auto">
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
        </CodePreview>
      </Section>

      {/* ═══ API Reference ═══ */}
      <Section dark>
        <SectionHeader
          overline="Integration"
          title="API reference (preview)."
          subtitle="Enterprise customers get REST API access for integration with internal tools, CRMs, and deal management systems."
        />
        <div className="space-y-4 stagger">
          {[
            { method: "POST", path: "/api/v1/score", desc: "Score an athlete and return composite + sub-scores + valuation band", color: "var(--color-nil-green)" },
            { method: "POST", path: "/api/v1/compliance", desc: "Check a deal proposal against state, conference, and NCAA rules", color: "var(--color-nil-cyan)" },
            { method: "POST", path: "/api/v1/receipt", desc: "Generate a signed receipt for a scored deal", color: "var(--color-nil-purple)" },
            { method: "GET", path: "/api/v1/receipts/:id", desc: "Retrieve and verify an existing receipt", color: "var(--color-nil-gold)" },
            { method: "GET", path: "/api/v1/rulesets/:state", desc: "Get the current compliance ruleset for a state", color: "var(--color-nil-text)" },
          ].map((endpoint) => (
            <div key={endpoint.path} className="flex items-start gap-4 bg-nil-black border border-nil-border/60 rounded-2xl p-5">
              <span
                className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                style={{ color: endpoint.color, backgroundColor: `color-mix(in srgb, ${endpoint.color} 10%, transparent)` }}
              >
                {endpoint.method}
              </span>
              <div>
                <p className="text-nil-white font-mono text-sm">{endpoint.path}</p>
                <p className="text-nil-muted text-xs mt-1">{endpoint.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Open Source CTA ═══ */}
      <section className="py-32 sm:py-40 px-6 border-t border-nil-border/40">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-h1 text-nil-white mb-4">Built in the open.</h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-lg mx-auto">
            NIL33&apos;s scoring engine and compliance rulesets are designed
            for auditability. We believe the best way to earn trust is
            transparency.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="https://github.com/FTHTrading" variant="secondary" size="lg" external>
              GitHub →
            </Button>
            <Button href="mailto:developers@nil33.com?subject=NIL33%20Technical%20Inquiry" variant="ghost" size="lg" external>
              Contact Engineering
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
