import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import { ScoreBar } from "../../components/ScoreDisplay";

export default function ProductPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 sm:pt-44 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-nil-green/[0.03] blur-[140px] pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-6">Product</p>
          <h1 className="text-display text-nil-white max-w-3xl mx-auto">
            Three engines.<span className="gradient-text"> One decision layer.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-lg mx-auto">
            NIL33 combines athlete valuation, regulatory compliance, and audit-ready deal documentation into a single deterministic workflow.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Try a Valuation</Button>
            <Button href="/developers" variant="ghost" size="lg">Read the Docs &rarr;</Button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-px bg-nil-border/20 rounded-2xl overflow-hidden border border-nil-border/40 max-w-2xl mx-auto">
            {[
              { label: "Valuation", desc: "33-factor scoring", color: "text-nil-green" },
              { label: "Compliance", desc: "50-state coverage", color: "text-nil-cyan" },
              { label: "Receipts", desc: "Ed25519 signed", color: "text-nil-purple" },
            ].map((e) => (
              <div key={e.label} className="bg-nil-dark/80 backdrop-blur-sm p-5 text-center">
                <p className={"font-mono text-sm font-bold " + e.color + " uppercase tracking-wider"}>{e.label}</p>
                <p className="text-nil-muted text-xs mt-1">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engine 1: Valuation */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-start stagger">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-nil-green/10 border border-nil-green/20 flex items-center justify-center text-nil-green font-mono text-sm font-bold">01</span>
              <span className="text-overline !mb-0">Valuation Engine</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">What is this athlete actually worth?</h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              NIL33 scores every athlete using 33 weighted factors across four categories: social reach, athletic performance, market demand, and brand alignment. The result is a composite score (0-99) and a dollar-range valuation band.
            </p>
            <ul className="space-y-3">
              {[
                { color: "text-nil-green", label: "Social (25%)", text: "followers, engagement rate, content frequency, platform diversity" },
                { color: "text-nil-cyan", label: "Athletic (30%)", text: "position stats, conference, team records, awards, draft stock" },
                { color: "text-nil-purple", label: "Market (25%)", text: "media coverage, regional demand, NIL market maturity, sport premium" },
                { color: "text-nil-gold", label: "Brand (20%)", text: "audience quality, brand safety, uniqueness, narrative value" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <span className={item.color + " text-sm mt-0.5 shrink-0"}>&#9656;</span>
                  <span className="text-nil-text text-sm"><strong className={item.color}>{item.label}:</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <CodePreview title="valuation-output.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Arch Manning - QB, SEC" />
              <DataRow label="Composite Score" value={<span className="text-nil-green font-bold text-xl">74</span>} />
              <DataRow label="Valuation Band" value=",000 - ,000" />
              <DataDivider />
              <div className="py-2 space-y-2">
                <ScoreBar label="Social" value={68} />
                <ScoreBar label="Athletic" value={81} />
                <ScoreBar label="Market" value={72} />
                <ScoreBar label="Brand" value={75} />
              </div>
              <DataDivider />
              <DataRow label="Confidence" value={<span className="text-nil-green">High (8 signals strong)</span>} />
              <DataRow label="Processing" value={<span className="text-nil-muted font-mono text-xs">&lt;1ms - Rust deterministic</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Engine 2: Compliance */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-start stagger">
          <CodePreview title="compliance-check.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="State" value="Georgia" />
              <DataRow label="Conference" value="SEC" />
              <DataDivider />
              <DataRow label="State NIL Law" value={<Badge status="pass" label="Pass" />} />
              <DataRow label="Conference Rules" value={<Badge status="pass" label="Pass" />} />
              <DataRow label="NCAA Guidelines" value={<Badge status="review" label="Review" />} />
              <DataDivider />
              <div className="bg-nil-gold/5 border border-nil-gold/20 rounded-lg p-3 mt-2">
                <p className="text-nil-gold text-xs font-medium mb-1">&#9888; NCAA Note</p>
                <p className="text-nil-muted text-xs leading-relaxed">
                  Proposed deal amount ($80,000) exceeds the NIL33 fair value band ($42,200&ndash;$58,400) by 37%. This gap may trigger NCAA pay-for-play scrutiny.
                </p>
              </div>
            </div>
          </CodePreview>
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-nil-cyan/10 border border-nil-cyan/20 flex items-center justify-center text-nil-cyan font-mono text-sm font-bold">02</span>
              <span className="text-overline !mb-0">Compliance Engine</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">Is this deal compliant?</h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              Every deal is checked against three layers of regulation: your state's NIL law, your conference's specific rules, and current NCAA guidelines. Results are instant.
            </p>
            <ul className="space-y-3">
              {[
                "50-state NIL law database - updated as legislation changes",
                "Conference-specific rulesets (SEC, Big Ten, Big 12, ACC, etc.)",
                "NCAA guideline alignment and pay-for-play risk flags",
                "Automated alerts when a deal falls outside safe parameters",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-cyan text-sm mt-0.5 shrink-0">&#9656;</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Engine 3: Receipts */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-start stagger">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-nil-purple/10 border border-nil-purple/20 flex items-center justify-center text-nil-purple font-mono text-sm font-bold">03</span>
              <span className="text-overline !mb-0">Deal Receipts</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">Can we prove it?</h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              Every scored deal produces a timestamped, cryptographically signed receipt. Each receipt captures the valuation inputs, compliance status, and final decision - ready for board review, NCAA inquiry, or legal defense.
            </p>
            <ul className="space-y-3">
              {[
                "Tamper-evident - receipts cannot be altered after generation",
                "Exportable PDF or JSON for record-keeping and legal discovery",
                "Searchable deal history across your entire collective portfolio",
                "Retroactive audit support - look up any past deal instantly",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-purple text-sm mt-0.5 shrink-0">&#9656;</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <CodePreview title="deal-receipt.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Receipt ID" value={<span className="font-mono text-xs">NIL33-2025-00847</span>} />
              <DataRow label="Athlete" value="Arch Manning" />
              <DataRow label="Composite Score" value={<span className="text-nil-green font-mono">74</span>} />
              <DataRow label="Fair Value Band" value={<span className="font-mono">$42,200–$58,400</span>} />
              <DataRow label="Proposed Amount" value={<span className="text-nil-red font-mono">$80,000</span>} />
              <DataRow label="Verdict" value={<span className="text-nil-red font-bold">OVERPAY - 37% above band</span>} />
              <DataRow label="Compliance" value={<span className="text-nil-gold">Review Required</span>} />
              <DataDivider />
              <DataRow label="Generated" value={<span className="text-nil-muted font-mono text-xs">2025-06-15T14:32:08Z</span>} />
              <DataRow label="Signature" value={<span className="text-nil-purple font-mono text-xs">ed25519:7f3a...c91b</span>} />
              <DataRow label="Tamper hash" value={<span className="text-nil-muted font-mono text-xs">sha256:b4e1...3d7a</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* Architecture */}
      <Section>
        <SectionHeader center overline="Architecture" title="How a deal flows through NIL33." />
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-12">
            {[
              { step: "1", label: "Enter deal details", color: "var(--color-nil-white)" },
              { step: "2", label: "Score + Value", color: "var(--color-nil-green)" },
              { step: "3", label: "Compliance check", color: "var(--color-nil-cyan)" },
              { step: "4", label: "Receipt generated", color: "var(--color-nil-purple)" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg mb-3" style={{ borderColor: s.color, color: s.color }}>
                    {s.step}
                  </div>
                  <p className="text-nil-muted text-sm text-center w-32">{s.label}</p>
                </div>
                {i < 3 && (<div className="hidden sm:block w-20 h-px bg-nil-border mx-3 -mt-8" />)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
            {[
              { label: "Processing", value: "<1ms", color: "text-nil-green" },
              { label: "Scoring factors", value: "33", color: "text-nil-cyan" },
              { label: "State rulesets", value: "50", color: "text-nil-gold" },
              { label: "Cryptographic", value: "Ed25519", color: "text-nil-purple" },
            ].map((s) => (
              <div key={s.label} className="text-center p-5 bg-nil-dark/60 rounded-xl border border-nil-border/30">
                <p className={"font-mono text-2xl font-bold " + s.color}>{s.value}</p>
                <p className="text-nil-muted text-xs uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why deterministic */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader overline="Philosophy" title="Why deterministic scoring matters." />
            <div className="space-y-4 text-[15px] text-nil-muted leading-relaxed">
              <p>AI-generated valuations are non-reproducible. Run the same athlete through an LLM twice and you get different numbers. That's a liability, not a tool.</p>
              <p>NIL33's Rust engine is fully deterministic. Same inputs, same output, every time. This makes every valuation auditable, defensible, and legally admissible.</p>
            </div>
          </div>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-red/5 border border-nil-red/20">
                <span className="text-nil-muted text-sm">GPT-4 run 1</span>
                <span className="text-nil-red font-mono text-sm">$67,300</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-red/5 border border-nil-red/20">
                <span className="text-nil-muted text-sm">GPT-4 run 2</span>
                <span className="text-nil-red font-mono text-sm">$51,800</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-red/5 border border-nil-red/20">
                <span className="text-nil-muted text-sm">GPT-4 run 3</span>
                <span className="text-nil-red font-mono text-sm">$74,100</span>
              </div>
              <div className="h-px bg-nil-border/40" />
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-green/5 border border-nil-green/20">
                <span className="text-nil-green text-sm font-semibold">NIL33 (every run)</span>
                <span className="text-nil-green font-mono text-sm font-bold">$42,200–$58,400</span>
              </div>
              <p className="text-nil-muted text-xs text-center pt-2">Same athlete. Same inputs. Deterministic engine wins.</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-32 sm:py-40 px-6 border-t border-nil-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-nil-green/[0.03] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-6">Try it now</p>
          <h2 className="text-display text-nil-white mb-4 max-w-2xl mx-auto">
            See it work on a<span className="gradient-text"> real deal.</span>
          </h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-md mx-auto">
            Run a demo valuation with real inputs. See how NIL33 scores, checks compliance, and generates a receipt - in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Run Demo &rarr;</Button>
            <Button href="/collectives" variant="secondary" size="lg">For Collectives &rarr;</Button>
          </div>
        </div>
      </section>
    </>
  );
}
