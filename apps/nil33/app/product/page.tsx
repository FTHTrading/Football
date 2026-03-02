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
            Smart contracts.<span className="gradient-text"> Self-executing deals.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-lg mx-auto">
            NIL33 combines on-chain Solidity contracts, deterministic athlete valuation,
            50-state compliance, and cryptographic receipts into one system that protects
            every athlete, every dollar, every deal.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Try a Valuation</Button>
            <Button href="/developers" variant="ghost" size="lg">Read the Docs &rarr;</Button>
          </div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-nil-border/20 rounded-2xl overflow-hidden border border-nil-border/40 max-w-3xl mx-auto">
            {[
              { label: "Smart Contracts", desc: "Solidity on-chain", color: "text-nil-green" },
              { label: "Valuation", desc: "33-factor scoring", color: "text-nil-cyan" },
              { label: "Compliance", desc: "50-state coverage", color: "text-nil-purple" },
              { label: "Receipts", desc: "Ed25519 signed", color: "text-nil-gold" },
            ].map((e) => (
              <div key={e.label} className="bg-nil-dark/80 backdrop-blur-sm p-5 text-center">
                <p className={"font-mono text-sm font-bold " + e.color + " uppercase tracking-wider"}>{e.label}</p>
                <p className="text-nil-muted text-xs mt-1">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SMART CONTRACTS — Self-Executing Deals ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-start stagger">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-nil-green/10 border border-nil-green/20 flex items-center justify-center text-nil-green font-mono text-sm font-bold">01</span>
              <span className="text-overline !mb-0">Smart Contract Layer</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">Deals that execute themselves.</h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              Every NIL agreement is encoded as a Solidity smart contract on-chain.
              When milestones are met &mdash; social post delivered, appearance completed,
              performance target hit &mdash; the contract automatically triggers payout.
              No invoicing. No delays. No disputes.
            </p>
            <ul className="space-y-3">
              {[
                { color: "text-nil-green", label: "Automatic Payouts", text: "milestone hit = instant settlement, no manual approval needed" },
                { color: "text-nil-cyan", label: "Immutable Terms", text: "deal terms locked on-chain, neither party can alter after signing" },
                { color: "text-nil-purple", label: "Escrow Protection", text: "funds held in contract until deliverables verified" },
                { color: "text-nil-gold", label: "Dispute Resolution", text: "on-chain audit trail eliminates he-said-she-said" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <span className={item.color + " text-sm mt-0.5 shrink-0"}>&#9656;</span>
                  <span className="text-nil-text text-sm"><strong className={item.color}>{item.label}:</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <CodePreview title="NILDeal.sol">
            <div className="space-y-0.5 text-[13px]">
              <p className="text-nil-purple">// SPDX-License-Identifier: MIT</p>
              <p><span className="text-nil-cyan">pragma</span> <span className="text-nil-green">solidity</span> ^0.8.24;</p>
              <p className="mt-2"><span className="text-nil-cyan">contract</span> <span className="text-nil-green">NILDeal</span> {"{"}</p>
              <p className="pl-4"><span className="text-nil-cyan">address</span> <span className="text-nil-gold">athlete</span>;</p>
              <p className="pl-4"><span className="text-nil-cyan">address</span> <span className="text-nil-gold">collective</span>;</p>
              <p className="pl-4"><span className="text-nil-cyan">uint256</span> <span className="text-nil-gold">dealAmount</span>;</p>
              <p className="pl-4"><span className="text-nil-cyan">uint256</span> <span className="text-nil-gold">milestoneCount</span>;</p>
              <p className="pl-4 mt-2"><span className="text-nil-cyan">function</span> <span className="text-nil-green">completeMilestone</span>(<span className="text-nil-gold">uint id</span>) <span className="text-nil-purple">external</span> {"{"}</p>
              <p className="pl-8"><span className="text-nil-cyan">require</span>(milestones[id].verified);</p>
              <p className="pl-8">payable(athlete).<span className="text-nil-green">transfer</span>(</p>
              <p className="pl-12">dealAmount / milestoneCount</p>
              <p className="pl-8">);</p>
              <p className="pl-4">{"}"}</p>
              <p>{"}"}</p>
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ WHO WE PROTECT ═══ */}
      <Section>
        <SectionHeader center overline="Ecosystem" title="Built for every stakeholder in NIL." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {[
            {
              icon: "&#9733;", title: "Athletes",
              items: ["Guaranteed payouts via smart contract escrow", "Full transparency into deal valuation", "Identity protection with Ed25519 signatures", "Fair market value verification before signing"],
              color: "text-nil-green", border: "border-nil-green/20", bg: "bg-nil-green/5",
            },
            {
              icon: "&#9670;", title: "Universities",
              items: ["Compliance dashboards for every active deal", "50-state regulatory coverage automatic", "Audit-ready documentation for NCAA inquiries", "Risk scoring before deals close"],
              color: "text-nil-cyan", border: "border-nil-cyan/20", bg: "bg-nil-cyan/5",
            },
            {
              icon: "&#9671;", title: "Agents & Collectives",
              items: ["Deterministic valuations eliminate guesswork", "Smart contract terms lock in both parties", "Deal receipts signed and immutable on-chain", "Portfolio-wide analytics and reporting"],
              color: "text-nil-purple", border: "border-nil-purple/20", bg: "bg-nil-purple/5",
            },
            {
              icon: "&#9672;", title: "Brands",
              items: ["Verified athlete metrics before sponsorship", "ROI scoring based on 33 weighted factors", "Compliance pre-check across all jurisdictions", "Transparent milestone tracking and payouts"],
              color: "text-nil-gold", border: "border-nil-gold/20", bg: "bg-nil-gold/5",
            },
          ].map((s) => (
            <div key={s.title} className={`rounded-2xl border ${s.border} ${s.bg} p-6`}>
              <span className={`text-2xl ${s.color}`} dangerouslySetInnerHTML={{ __html: s.icon }} />
              <h3 className={`text-lg font-bold mt-3 mb-4 ${s.color}`}>{s.title}</h3>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className={`${s.color} text-xs mt-1 shrink-0`}>&#9656;</span>
                    <span className="text-nil-muted text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ TRANSPARENCY & TRUST ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              overline="Transparency"
              title="Every dollar tracked. Every deal auditable."
              subtitle="NIL has a trust problem. Athletes get promised deals that never pay out. Collectives overpay without data. Universities can&apos;t prove compliance. NIL33 fixes all of it with one system."
            />
            <div className="space-y-4 mt-8">
              {[
                { label: "On-chain deal records", desc: "Every agreement, milestone, and payout is permanently recorded", color: "text-nil-green" },
                { label: "Cryptographic signatures", desc: "Ed25519 signatures make every receipt tamper-proof and legally defensible", color: "text-nil-cyan" },
                { label: "Real-time compliance", desc: "State law changes are reflected instantly across all active deals", color: "text-nil-purple" },
                { label: "Open audit trail", desc: "Any authorized party can verify any deal at any time — no black boxes", color: "text-nil-gold" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <span className={`${item.color} text-sm mt-0.5 shrink-0`}>&#9670;</span>
                  <div className="flex-1 border-b border-nil-border/20 pb-4 group-last:border-0">
                    <p className={`${item.color} text-sm font-semibold`}>{item.label}</p>
                    <p className="text-nil-muted text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card>
            <div className="space-y-3">
              <p className="text-nil-muted text-xs uppercase tracking-wider font-semibold mb-4">How deals flow today vs. NIL33</p>
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-red/5 border border-nil-red/20">
                <span className="text-nil-muted text-sm">Traditional: handshake deal</span>
                <span className="text-nil-red font-mono text-sm">No proof</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-red/5 border border-nil-red/20">
                <span className="text-nil-muted text-sm">Traditional: manual payout</span>
                <span className="text-nil-red font-mono text-sm">60+ day delays</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-red/5 border border-nil-red/20">
                <span className="text-nil-muted text-sm">Traditional: compliance check</span>
                <span className="text-nil-red font-mono text-sm">Manual / risky</span>
              </div>
              <div className="h-px bg-nil-border/40" />
              <div className="flex items-center justify-between p-3 rounded-lg bg-nil-green/5 border border-nil-green/20">
                <span className="text-nil-green text-sm font-semibold">NIL33: smart contract deal</span>
                <span className="text-nil-green font-mono text-sm font-bold">Instant + Immutable</span>
              </div>
              <p className="text-nil-muted text-xs text-center pt-2">Transparency isn&apos;t a feature. It&apos;s the entire architecture.</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* ═══ VALUATION ENGINE ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-start stagger">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-nil-cyan/10 border border-nil-cyan/20 flex items-center justify-center text-nil-cyan font-mono text-sm font-bold">02</span>
              <span className="text-overline !mb-0">Valuation Engine</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">What is this athlete actually worth?</h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              NIL33 scores every athlete using 33 weighted factors across four categories:
              social reach, athletic performance, market demand, and brand alignment.
              The result is a composite score (0&ndash;99) and a dollar-range valuation band.
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
              <DataRow label="Composite Score" value={<span className="text-nil-green font-bold text-xl">96</span>} />
              <DataRow label="Valuation Band" value="$3,200,000 - $4,500,000" />
              <DataDivider />
              <div className="py-2 space-y-2">
                <ScoreBar label="Social" value={91} />
                <ScoreBar label="Athletic" value={97} />
                <ScoreBar label="Market" value={99} />
                <ScoreBar label="Brand" value={96} />
              </div>
              <DataDivider />
              <DataRow label="Confidence" value={<span className="text-nil-green">High (8 signals strong)</span>} />
              <DataRow label="Processing" value={<span className="text-nil-muted font-mono text-xs">&lt;1ms &mdash; Rust deterministic</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ COMPLIANCE ENGINE ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-start stagger">
          <CodePreview title="compliance-check.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="State" value="Texas" />
              <DataRow label="Conference" value="SEC" />
              <DataDivider />
              <DataRow label="State NIL Law" value={<Badge status="pass" label="Pass" />} />
              <DataRow label="Conference Rules" value={<Badge status="pass" label="Pass" />} />
              <DataRow label="NCAA Guidelines" value={<Badge status="pass" label="Pass" />} />
              <DataDivider />
              <DataRow label="Smart Contract" value={<span className="text-nil-green">Terms encoded on-chain</span>} />
              <DataRow label="Escrow Status" value={<span className="text-nil-cyan">Funded &amp; locked</span>} />
            </div>
          </CodePreview>
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-2xl bg-nil-purple/10 border border-nil-purple/20 flex items-center justify-center text-nil-purple font-mono text-sm font-bold">03</span>
              <span className="text-overline !mb-0">Compliance Engine</span>
            </div>
            <h2 className="text-h2 text-nil-white mb-4">Is this deal compliant?</h2>
            <p className="text-nil-muted mb-6 leading-relaxed">
              Every deal is checked against three layers of regulation: your state&apos;s
              NIL law, your conference&apos;s specific rules, and current NCAA guidelines.
              Results are instant, and compliance status is written into the smart contract.
            </p>
            <ul className="space-y-3">
              {[
                "50-state NIL law database &mdash; updated as legislation changes",
                "Conference-specific rulesets (SEC, Big Ten, Big 12, ACC, etc.)",
                "NCAA guideline alignment and pay-for-play risk flags",
                "Compliance status embedded in smart contract before execution",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-nil-purple text-sm mt-0.5 shrink-0">&#9656;</span>
                  <span className="text-nil-text text-sm" dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ═══ ATHLETE PROTECTION ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              overline="Athlete-First"
              title="The system exists to protect the athlete."
              subtitle="NIL was supposed to empower student-athletes. Instead, many get underpaid, overpromised, or left unprotected. NIL33 puts the athlete first in every transaction."
            />
            <div className="space-y-4 mt-6">
              {[
                { label: "Fair value guarantee", desc: "Athletes see their verified valuation band before signing anything" },
                { label: "Escrow-backed deals", desc: "Funds are locked in smart contract escrow before any deliverables begin" },
                { label: "Automatic settlement", desc: "Milestones verified on-chain trigger instant payout — no chasing payments" },
                { label: "Portable identity", desc: "Ed25519-signed athlete profile travels with them — transfer portal, new school, same data" },
                { label: "Full deal visibility", desc: "Athletes see every term, every milestone, every payout in real-time" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-nil-green text-sm mt-0.5 shrink-0">&#10003;</span>
                  <div>
                    <p className="text-nil-white text-sm font-semibold">{item.label}</p>
                    <p className="text-nil-muted text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CodePreview title="athlete-deal-status.json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Arch Manning &mdash; QB, Texas Longhorns" />
              <DataRow label="Deal" value="Brand Endorsement &mdash; Athletic Apparel" />
              <DataRow label="Total Value" value={<span className="text-nil-green font-bold">$3,800,000</span>} />
              <DataDivider />
              <DataRow label="Milestone 1" value={<span className="text-nil-green">&#10003; Complete &mdash; $950,000 paid</span>} />
              <DataRow label="Milestone 2" value={<span className="text-nil-green">&#10003; Complete &mdash; $950,000 paid</span>} />
              <DataRow label="Milestone 3" value={<span className="text-nil-cyan">&#9679; In progress</span>} />
              <DataRow label="Milestone 4" value={<span className="text-nil-muted">&#9675; Locked in escrow</span>} />
              <DataDivider />
              <DataRow label="Paid to date" value={<span className="text-nil-green font-bold">$1,900,000</span>} />
              <DataRow label="In escrow" value={<span className="text-nil-cyan">$1,900,000</span>} />
              <DataRow label="Contract status" value={<span className="text-nil-green">Active &mdash; on-chain</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ DETERMINISTIC SCORING ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader overline="Philosophy" title="Why deterministic scoring matters." />
            <div className="space-y-4 text-[15px] text-nil-muted leading-relaxed">
              <p>AI-generated valuations are non-reproducible. Run the same athlete through an LLM twice and you get different numbers. That&apos;s a liability, not a tool.</p>
              <p>NIL33&apos;s Rust engine is fully deterministic. Same inputs, same output, every time. This makes every valuation auditable, defensible, and legally admissible.</p>
              <p>When that valuation feeds into a smart contract, the numbers are locked. No renegotiation, no ambiguity, no manipulation.</p>
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
                <span className="text-nil-green font-mono text-sm font-bold">$3,200,000&ndash;$4,500,000</span>
              </div>
              <p className="text-nil-muted text-xs text-center pt-2">Same athlete. Same inputs. Deterministic engine wins.</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* Architecture */}
      <Section>
        <SectionHeader center overline="Architecture" title="How a deal flows through NIL33." />
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-12">
            {[
              { step: "1", label: "Enter deal details", color: "var(--color-nil-white)" },
              { step: "2", label: "Score + Value", color: "var(--color-nil-green)" },
              { step: "3", label: "Compliance check", color: "var(--color-nil-cyan)" },
              { step: "4", label: "Smart contract", color: "var(--color-nil-purple)" },
              { step: "5", label: "Auto-payout", color: "var(--color-nil-gold)" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg mb-3" style={{ borderColor: s.color, color: s.color }}>
                    {s.step}
                  </div>
                  <p className="text-nil-muted text-sm text-center w-28">{s.label}</p>
                </div>
                {i < 4 && (<div className="hidden sm:block w-16 h-px bg-nil-border mx-2 -mt-8" />)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 stagger">
            {[
              { label: "Processing", value: "<1ms", color: "text-nil-green" },
              { label: "Scoring factors", value: "33", color: "text-nil-cyan" },
              { label: "State rulesets", value: "50", color: "text-nil-gold" },
              { label: "Contract layer", value: "Solidity", color: "text-nil-purple" },
              { label: "Signatures", value: "Ed25519", color: "text-nil-green" },
            ].map((s) => (
              <div key={s.label} className="text-center p-5 bg-nil-dark/60 rounded-xl border border-nil-border/30">
                <p className={"font-mono text-2xl font-bold " + s.color}>{s.value}</p>
                <p className="text-nil-muted text-xs uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
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
            Run a demo valuation with real inputs. See how NIL33 scores, checks compliance,
            generates a smart contract, and produces a receipt &mdash; in seconds.
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
