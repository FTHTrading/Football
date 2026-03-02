import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { InlineStat } from "../../components/Stat";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Explore NIL33 with limited demo valuations. No credit card required.",
    cta: "Start Free",
    ctaHref: "/demo",
    highlight: false,
    features: [
      "5 demo valuations per month",
      "Composite score output (0-99)",
      "Basic compliance check (state law only)",
      "No deal receipts",
      "No deal history",
    ],
  },
  {
    name: "Pro",
    price: "$1,200",
    period: "/mo",
    desc: "Full capital discipline for active collectives. Unlimited valuations, full compliance, auditable receipts.",
    cta: "Get Pro Access",
    ctaHref: "mailto:partnerships@nil33.com?subject=NIL33%20Pro%20Access",
    highlight: true,
    features: [
      "Unlimited valuations",
      "Full 33-factor composite scoring",
      "3-layer compliance (state + conference + NCAA)",
      "Cryptographically signed deal receipts",
      "Searchable deal history",
      "Exportable reports (PDF + JSON)",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For multi-school collectives, conferences, and institutional buyers. Custom integrations, SLAs, dedicated support.",
    cta: "Talk to Sales",
    ctaHref: "mailto:partnerships@nil33.com?subject=NIL33%20Enterprise%20Inquiry",
    highlight: false,
    features: [
      "Everything in Pro",
      "Multi-school portfolio view",
      "API access for internal tools",
      "Custom compliance rulesets",
      "White-label receipts",
      "Dedicated account manager",
      "SLA and uptime guarantees",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 sm:pt-44 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-nil-green/[0.03] blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-6">Pricing</p>
          <h1 className="text-display text-nil-white max-w-2xl mx-auto">
            Prevent one overpay.<span className="gradient-text"> Paid for the year.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-md mx-auto">
            Pro costs $1,200/month. Most collectives recoup that on a single validated deal.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <Section>
        <div className="grid md:grid-cols-3 gap-6 stagger">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={"rounded-2xl p-8 flex flex-col " + (
                tier.highlight
                  ? "bg-nil-green/[0.05] border-2 border-nil-green/30 relative"
                  : "bg-nil-dark/60 border border-nil-border/60"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-nil-green text-nil-black text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-nil-white font-semibold text-lg mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-nil-white font-mono text-4xl font-extrabold">{tier.price}</span>
                  {tier.period && <span className="text-nil-muted text-sm">{tier.period}</span>}
                </div>
                <p className="text-nil-muted text-sm mt-3 leading-relaxed">{tier.desc}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-nil-green text-sm mt-0.5 shrink-0">&#10003;</span>
                    <span className="text-nil-text text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              {tier.ctaHref.startsWith("mailto:") ? (
                <Button href={tier.ctaHref} variant={tier.highlight ? "primary" : "secondary"} external>
                  {tier.cta}
                </Button>
              ) : (
                <Button href={tier.ctaHref} variant={tier.highlight ? "primary" : "secondary"}>
                  {tier.cta}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* What's included comparison */}
      <Section dark>
        <SectionHeader center overline="Compare" title="What you get at each tier." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nil-border/60">
                <th className="text-left text-nil-muted py-3 pr-4 font-medium">Feature</th>
                <th className="text-center text-nil-muted py-3 px-4 font-medium">Starter</th>
                <th className="text-center text-nil-green py-3 px-4 font-semibold">Pro</th>
                <th className="text-center text-nil-muted py-3 pl-4 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Valuations", "5/mo", "Unlimited", "Unlimited"],
                ["33-Factor Scoring", "Basic", "Full", "Full + Custom"],
                ["Compliance", "State only", "State + Conf + NCAA", "Custom rulesets"],
                ["Deal Receipts", "-", "&#10003;", "&#10003; White-label"],
                ["Deal History", "-", "&#10003;", "&#10003; Multi-school"],
                ["Export (PDF/JSON)", "-", "&#10003;", "&#10003;"],
                ["API Access", "-", "-", "&#10003;"],
                ["Support", "Community", "Priority", "Dedicated"],
              ].map(([feature, starter, pro, enterprise]) => (
                <tr key={feature} className="border-b border-nil-border/30">
                  <td className="text-nil-text py-3 pr-4">{feature}</td>
                  <td className="text-nil-muted py-3 px-4 text-center">{starter}</td>
                  <td className="text-nil-white py-3 px-4 text-center font-medium" dangerouslySetInnerHTML={{ __html: pro || "" }} />
                  <td className="text-nil-muted py-3 pl-4 text-center" dangerouslySetInnerHTML={{ __html: enterprise || "" }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ROI */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader overline="Return on investment" title="The math is simple." />
            <div className="space-y-4 text-[15px] text-nil-muted leading-relaxed">
              <p>
                The average unvalidated NIL deal includes $15K-$40K in overpay. NIL33 Pro costs $14,400/year. One accurate valuation on one deal covers the annual cost.
              </p>
              <p>
                Most collectives see 5x-10x ROI. The conservative estimate - where NIL33 prevents just 10% of a $1.5M portfolio's overpay - still returns 1.9x.
              </p>
            </div>
            <div className="mt-8">
              <Button href="/collectives" variant="ghost" size="sm">See the full case &rarr;</Button>
            </div>
          </div>
          <div className="bg-nil-black border border-nil-border/60 rounded-2xl p-8">
            <InlineStat label="Annual NIL budget (typical)" value="$1.5M" />
            <InlineStat label="Average overpay rate" value="18%" valueColor="var(--color-nil-red)" />
            <InlineStat label="Annual overpay (estimated)" value="$270,000" valueColor="var(--color-nil-red)" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="NIL33 Pro (annual)" value="$14,400" valueColor="var(--color-nil-green)" />
            <InlineStat label="Prevent just 10% of overpay" value="$27,000 saved" valueColor="var(--color-nil-green)" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="ROI (conservative)" value="1.9x" valueColor="var(--color-nil-green)" />
            <InlineStat label="ROI (typical)" value="5x-10x" valueColor="var(--color-nil-green)" />
            <p className="text-nil-muted text-xs pt-4 border-t border-nil-border/20 mt-4">
              Everything after break-even is pure savings.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section dark>
        <SectionHeader center overline="Questions" title="Common questions." />
        <div className="max-w-2xl mx-auto space-y-6 stagger">
          {[
            { q: "Is there a contract?", a: "No. Pro is month-to-month. Enterprise contracts are annual with custom terms." },
            { q: "Can I upgrade from Starter to Pro?", a: "Yes. Your demo history carries over. Upgrade anytime from your dashboard." },
            { q: "What counts as a valuation?", a: "Each time you submit athlete data and receive a scored output. Re-scoring the same athlete with updated data counts as a new valuation." },
            { q: "Do you offer discounts for smaller collectives?", a: "Enterprise pricing is custom. Reach out and we'll build a plan that fits your budget and deal volume." },
            { q: "Is my data secure?", a: "All data is encrypted in transit and at rest. Deal receipts are cryptographically signed. We never share collective data with third parties." },
          ].map((item) => (
            <div key={item.q} className="border border-nil-border/40 rounded-xl p-6 bg-nil-dark/40">
              <h3 className="text-nil-white font-semibold text-sm mb-2">{item.q}</h3>
              <p className="text-nil-muted text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative py-32 sm:py-40 px-6 border-t border-nil-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-nil-green/[0.03] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-6">Get started</p>
          <h2 className="text-display text-nil-white mb-4 max-w-2xl mx-auto">
            Start with a free demo.<span className="gradient-text"> Upgrade when ready.</span>
          </h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-md mx-auto">
            No credit card. No sales call required. Run your first valuation in 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Run Free Demo &rarr;</Button>
            <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Pricing%20Question" variant="secondary" size="lg" external>
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
