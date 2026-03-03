import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";

export default function UnderwritingPage() {
  const signals = [
    { category: "Revenue Durability", count: 7, color: "text-nil-gold", items: ["Contract tenure & renewal probability", "Earning trajectory vs. cohort", "Market depth & demand signals", "Revenue source diversification", "Season-adjusted earnings pattern", "Off-field revenue stability", "Post-career transition readiness"] },
    { category: "Sponsor Concentration", count: 5, color: "text-nil-blue", items: ["Top-3 sponsor dependency ratio", "Category diversity index", "Renewal rate vs. industry avg", "Sponsor credit quality", "Contract duration distribution"] },
    { category: "Engagement Quality", count: 6, color: "text-nil-emerald", items: ["Authentic reach vs. follower count", "Conversion & click-through signals", "Audience demographic alignment", "Content consistency score", "Platform diversification", "Brand safety index"] },
    { category: "Eligibility & Transfer Risk", count: 5, color: "text-nil-purple", items: ["NCAA eligibility status", "Transfer portal probability", "Draft timeline & declaration", "Academic standing indicators", "Conference realignment impact"] },
    { category: "Injury & Availability", count: 5, color: "text-nil-gold", items: ["Position-specific injury rates", "Historical medical record", "Workload & snap count trends", "Recovery timeline modeling", "Insurance availability"] },
    { category: "Reputational Volatility", count: 5, color: "text-nil-blue", items: ["Sentiment analysis score", "Controversy exposure index", "Brand safety classification", "Media cycle resilience", "Community standing metrics"] },
  ];

  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-nil-black">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">UNDERWRITING</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-nil-white leading-tight mb-6">
            33 signals. Six risk dimensions.<br />
            <span className="gradient-text">One institutional score.</span>
          </h1>
          <p className="text-nil-muted text-lg max-w-2xl leading-relaxed">
            The NIL33 underwriting engine assesses every athlete across 33 proprietary signals
            organized into six risk dimensions. Each signal is weighted by instrument type,
            producing a composite score and institutional-grade underwriting memo.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          overline="Signal Architecture"
          title="Six dimensions. 33 signals."
          subtitle="Each dimension captures a distinct risk factor relevant to athlete capital assessment. Signals are weighted dynamically based on instrument type and market conditions."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {signals.map((dim) => (
            <div key={dim.category} className="rounded-2xl border border-nil-border/60 bg-nil-dark/60 p-7 card-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold text-base ${dim.color}`}>{dim.category}</h3>
                <span className="font-mono text-xs text-nil-muted bg-nil-black/40 px-2 py-1 rounded-lg">{dim.count} signals</span>
              </div>
              <div className="space-y-2">
                {dim.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className={`${dim.color} text-[8px] mt-1.5`}>◆</span>
                    <span className="text-nil-muted text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              overline="Output"
              title="Underwriting memo. Investor-ready."
              subtitle="Every athlete assessment produces a structured underwriting memo with composite score, risk breakdown, valuation band, and compliance clearance."
            />
            <div className="space-y-3 mt-6">
              {[
                "Composite score with dimension breakdown",
                "Fair value range with confidence interval",
                "Risk flags and covenant recommendations",
                "50-state compliance clearance",
                "PDF export for investor distribution",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-gold text-xs mt-0.5">◆</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <CodePreview title="nil33 underwrite --athlete arch-manning --output memo">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Arch Manning — QB, Texas Longhorns" />
              <DataRow label="Instrument" value="Revenue Participation Note" />
              <DataRow label="Composite" value={<span className="text-nil-gold font-bold text-xl">94</span>} />
              <DataDivider />
              <DataRow label="Revenue Durability" value={<span className="text-nil-gold">91/99</span>} />
              <DataRow label="Sponsor Concentration" value={<span className="text-nil-blue">88/99</span>} />
              <DataRow label="Engagement Quality" value={<span className="text-nil-emerald">95/99</span>} />
              <DataRow label="Eligibility Risk" value={<span className="text-nil-gold">97/99</span>} />
              <DataRow label="Injury/Availability" value={<span className="text-nil-purple">89/99</span>} />
              <DataRow label="Reputational Vol" value={<span className="text-nil-blue">93/99</span>} />
              <DataDivider />
              <DataRow label="Facility Range" value="$3.2M – $4.5M" />
              <DataRow label="Risk Flags" value={<span className="text-nil-emerald">0 — Clean</span>} />
              <DataRow label="Compliance" value={<span className="text-nil-emerald">50/50 — Pass</span>} />
              <DataRow label="Memo" value={<span className="text-nil-gold">Generated · PDF Ready</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      <section className="py-20 px-6 bg-nil-dark/40 text-center">
        <h2 className="text-h1 text-nil-white mb-4">See the engine in action.</h2>
        <p className="text-nil-muted text-lg mb-8 max-w-lg mx-auto">
          Request a demo assessment for your athlete roster.
        </p>
        <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Underwriting%20Demo" size="lg" external>
          Request Demo →
        </Button>
      </section>
    </>
  );
}
