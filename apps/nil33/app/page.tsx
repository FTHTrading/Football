import Link from "next/link";
import Section, { SectionHeader } from "../components/Section";
import { FeatureCard } from "../components/Card";
import Button from "../components/Button";
import CodePreview, { DataRow, DataDivider } from "../components/CodePreview";
import Badge from "../components/Badge";
import { InlineStat } from "../components/Stat";

export default function Home() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-6 hero-glow">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-3xl">
            <p className="text-overline mb-5">Capital Discipline Software</p>
            <h1 className="text-display text-nil-white">
              Know what an athlete is worth
              <span className="gradient-text"> before you sign.</span>
            </h1>
            <p className="mt-6 text-body-lg text-nil-muted max-w-xl">
              NIL33 scores athlete deals across 33 factors, checks compliance against
              50 state laws, and generates a cryptographically signed receipt — so your
              collective never overpays.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/demo" size="lg">Try a Valuation</Button>
              <Button href="/product" variant="ghost" size="lg">How it works →</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Three engines — feature cards ═══ */}
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
            detail="Score: 74/99 → $48K–$62K"
          />
          <FeatureCard
            number="02"
            numberColor="var(--color-nil-cyan)"
            title="Compliance Engine"
            description="Instant check against the athlete's state NIL law, conference rules, and current NCAA guidelines. Pass, review, or fail — with citations."
            detail="GA: Pass · SEC: Pass · NCAA: Review"
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

      {/* ═══ Live output preview — Stripe-style data card ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              overline="Sample output"
              title="What a scored deal looks like."
              subtitle="This is a real output from the NIL33 engine. Every deal your collective evaluates produces a structured, auditable record like this."
            />
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Badge status="pass" label="GA State Law" />
              <Badge status="pass" label="SEC Rules" />
              <Badge status="review" label="NCAA Guidelines" />
            </div>
          </div>

          <CodePreview title="nil33 score-deal --output json">
            <div className="space-y-0.5 text-[13px]">
              <DataRow label="Athlete" value="Marcus Williams — QB, SEC" />
              <DataRow label="Composite Score" value={<span className="text-nil-green font-bold text-lg">74</span>} />
              <DataRow label="Valuation Band" value="$48,000 – $62,000" />
              <DataRow label="Proposed Deal" value={<span className="text-nil-red">$85,000</span>} />
              <DataDivider />
              <DataRow label="Overpay" value={<span className="text-nil-red font-bold">$23,000</span>} />
              <DataRow label="State Law" value={<span className="text-nil-green">Pass</span>} />
              <DataRow label="Conference" value={<span className="text-nil-green">Pass</span>} />
              <DataRow label="NCAA" value={<span className="text-nil-gold">Review — 37% above fair value</span>} />
              <DataDivider />
              <DataRow label="Receipt ID" value="NIL33-2026-00847" />
              <DataRow label="Signature" value={<span className="text-nil-purple text-xs">ed25519:7f3a…c91b</span>} />
            </div>
          </CodePreview>
        </div>
      </Section>

      {/* ═══ Problem / Solution ═══ */}
      <Section>
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

      {/* ═══ ROI ═══ */}
      <Section dark>
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

      {/* ═══ Built for ═══ */}
      <Section>
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

      {/* ═══ CTA ═══ */}
      <section className="py-32 sm:py-40 px-6 border-t border-nil-border/40">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-h1 text-nil-white mb-4">
            Run your first valuation.
          </h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-md mx-auto">
            Free. No sign-up. Takes 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Open Demo →</Button>
            <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Inquiry" variant="secondary" size="lg" external>
              Talk to us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
