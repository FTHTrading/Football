import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import { ScoreBar } from "../../components/ScoreDisplay";

export default function ProductPage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="pt-32 sm:pt-40 pb-24 px-6 hero-glow">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-5">Product</p>
          <h1 className="text-display text-nil-white max-w-2xl mx-auto">
            Three engines.
            <span className="gradient-text"> One decision layer.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-lg mx-auto">
            NIL33 combines athlete valuation, regulatory compliance, and
            audit-ready deal documentation into a single workflow.
          </p>
        </div>
      </section>

      {/* ═══ Engine 1: Valuation ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-nil-green/10 border border-nil-green/20 flex items-center justify-center text-nil-green font-mono text-sm font-bold">01</span>
              <span className="text-overline !mb-0">Valuation Engine</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">
              What is this athlete actually worth?
            </h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              NIL33 scores every athlete using 33 weighted factors across four
              categories: social reach, athletic performance, market demand,
              and brand alignment. The result is a composite score (0–99) and
              a dollar-range valuation band.
            </p>
            <ul className="space-y-3">
              {[
                { color: "text-nil-green", text: "Social: followers, engagement rate, content frequency, platform diversity" },
                { color: "text-nil-cyan", text: "Athletic: position stats, conference, team records, awards, draft stock" },
                { color: "text-nil-purple", text: "Market: media coverage, regional demand, NIL market maturity, sport premium" },
                { color: "text-nil-gold", text: "Brand: audience quality, brand safety, uniqueness, narrative value" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <span className={`${item.color} text-sm mt-0.5 shrink-0`}>▸</span>
                  <span className="text-nil-text text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <CodePreview title="valuation-output.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Marcus Williams — QB, SEC" />
              <DataRow label="Composite Score" value={<span className="text-nil-green font-bold text-xl">74</span>} />
              <DataRow label="Valuation Band" value="$48,000 – $62,000" />
              <DataDivider />
              <div className="py-2 space-y-2">
                <ScoreBar label="Social" value={68} />
                <ScoreBar label="Athletic" value={81} />
                <ScoreBar label="Market" value={72} />
                <ScoreBar label="Brand" value={75} />
              </div>
              <DataDivider />
              <DataRow label="Confidence" value={<span className="text-nil-green">High (8 signals strong)</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ Engine 2: Compliance ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                <p className="text-nil-gold text-xs font-medium mb-1">⚠ NCAA Note</p>
                <p className="text-nil-muted text-xs leading-relaxed">
                  Proposed deal amount ($85K) exceeds the NIL33 fair value
                  band ($48K–$62K) by 37%. This gap may trigger NCAA
                  pay-for-play scrutiny.
                </p>
              </div>
            </div>
          </CodePreview>

          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-nil-cyan/10 border border-nil-cyan/20 flex items-center justify-center text-nil-cyan font-mono text-sm font-bold">02</span>
              <span className="text-overline !mb-0">Compliance Engine</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">
              Is this deal compliant?
            </h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              Every deal is checked against three layers of regulation:
              your state&apos;s NIL law, your conference&apos;s specific
              rules, and current NCAA guidelines. Results are instant.
            </p>
            <ul className="space-y-3">
              {[
                "50-state NIL law database — updated as legislation changes",
                "Conference-specific rulesets (SEC, Big Ten, Big 12, ACC, etc.)",
                "NCAA guideline alignment and pay-for-play risk flags",
                "Automated alerts when a deal falls outside safe parameters",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-cyan text-sm mt-0.5 shrink-0">▸</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ═══ Engine 3: Receipts ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-nil-purple/10 border border-nil-purple/20 flex items-center justify-center text-nil-purple font-mono text-sm font-bold">03</span>
              <span className="text-overline !mb-0">Deal Receipts</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">
              Can we prove it?
            </h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              Every scored deal produces a timestamped, cryptographically
              signed receipt. Each receipt captures the valuation inputs,
              compliance status, and final decision — ready for board
              review, NCAA inquiry, or legal defense.
            </p>
            <ul className="space-y-3">
              {[
                "Tamper-evident — receipts cannot be altered after generation",
                "Exportable PDF or JSON for record-keeping",
                "Searchable deal history across your entire collective portfolio",
                "Retroactive audit support — look up any past deal",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-nil-purple text-sm mt-0.5 shrink-0">▸</span>
                  <span className="text-nil-text text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <CodePreview title="deal-receipt.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Receipt ID" value={<span className="font-mono text-xs">NIL33-2025-00847</span>} />
              <DataRow label="Athlete" value="Marcus Williams" />
              <DataRow label="Composite Score" value={<span className="text-nil-green font-mono">74</span>} />
              <DataRow label="Fair Value Band" value={<span className="font-mono">$48K–$62K</span>} />
              <DataRow label="Proposed Amount" value={<span className="text-nil-red font-mono">$85,000</span>} />
              <DataRow label="Compliance" value={<span className="text-nil-gold">Review Required</span>} />
              <DataDivider />
              <DataRow label="Generated" value={<span className="text-nil-muted font-mono text-xs">2025-06-15T14:32:08Z</span>} />
              <DataRow label="Signature" value={<span className="text-nil-purple font-mono text-xs">ed25519:7f3a…c91b</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ Workflow ═══ */}
      <Section>
        <SectionHeader
          center
          title="How a deal flows through NIL33."
        />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {[
            { step: "1", label: "Enter deal details", color: "#e5e5e5" },
            { step: "2", label: "Score + Value", color: "#00ff88" },
            { step: "3", label: "Compliance check", color: "#00d4ff" },
            { step: "4", label: "Receipt generated", color: "#a855f7" },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg mb-3"
                  style={{ borderColor: s.color, color: s.color }}
                >
                  {s.step}
                </div>
                <p className="text-nil-muted text-sm text-center w-32">
                  {s.label}
                </p>
              </div>
              {i < 3 && (
                <div className="hidden sm:block w-20 h-px bg-nil-border mx-3 -mt-8" />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 sm:py-40 px-6 border-t border-nil-border/40 bg-nil-dark/30">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-h1 text-nil-white mb-4">
            See it in action.
          </h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-md mx-auto">
            Run a demo valuation with real inputs. See how NIL33 scores,
            checks compliance, and generates a receipt — in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Run Demo →</Button>
            <Button href="/collectives" variant="secondary" size="lg">For Collectives →</Button>
          </div>
        </div>
      </section>
    </>
  );
}
