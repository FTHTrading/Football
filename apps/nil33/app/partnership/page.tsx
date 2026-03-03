import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";

const PARTNERSHIP_TIERS = [
  {
    audience: "Sports Agencies",
    color: "nil-gold",
    border: "border-nil-gold/30",
    intro:
      "Control athlete supply and origination. NIL33 gives your agency institutional infrastructure — underwriting, compliance, and portfolio intelligence — without building it in-house.",
    benefits: [
      "33-Signal underwriting on every athlete in your roster",
      "50-state + conference compliance automation",
      "Portfolio-level risk analytics and concentration monitoring",
      "Branded investor reporting and distribution waterfall",
      "White-label capital dashboard for your athletes",
      "Deal execution rails — from term sheet to settlement",
    ],
    cta: "Apply for Agency Partnership",
  },
  {
    audience: "Broker-Dealers",
    color: "nil-blue",
    border: "border-nil-blue/30",
    intro:
      "Distribute NIL-linked alternative investments through compliant, institutional-grade rails. NIL33 provides the underwriting data, compliance engine, and reporting infrastructure your compliance desk requires.",
    benefits: [
      "SEC-compliant instrument structuring and documentation",
      "Reg D / Reg A+ / Reg CF filing support",
      "KYC/AML/accreditation verification pipeline",
      "Supervisory approval workflows with full audit trail",
      "Investor suitability scoring and concentration limits",
      "Quarterly reporting, K-1 generation, and NAV delivery",
    ],
    cta: "Apply for BD Partnership",
  },
];

export default function PartnershipPage() {
  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-nil-black">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">PARTNERSHIP</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-nil-white leading-tight mb-6">
            Built for agencies.<br />
            <span className="gradient-text">Cleared for broker-dealers.</span>
          </h1>
          <p className="text-nil-muted text-lg max-w-2xl leading-relaxed">
            NIL33 partners with elite sports agencies and registered broker-dealers
            to bring institutional discipline to athlete capital markets.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          center
          overline="Two audiences. One infrastructure."
          title="Choose your partnership track."
        />
        <div className="grid md:grid-cols-2 gap-8 stagger">
          {PARTNERSHIP_TIERS.map((tier) => (
            <div
              key={tier.audience}
              className={`rounded-2xl border ${tier.border} bg-nil-dark/60 p-8 flex flex-col`}
            >
              <h3 className={`text-${tier.color} font-bold text-2xl mb-3`}>
                {tier.audience}
              </h3>
              <p className="text-nil-muted text-sm leading-relaxed mb-6">
                {tier.intro}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className={`text-${tier.color} mt-1 text-xs`}>✓</span>
                    <span className="text-nil-text text-sm">{b}</span>
                  </li>
                ))}
              </ul>
              <Button
                href={`mailto:partnerships@nil33.com?subject=${encodeURIComponent(tier.cta)}`}
                variant={tier.color === "nil-gold" ? "primary" : "secondary"}
                size="lg"
                external
                className="w-full justify-center"
              >
                {tier.cta} →
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          center
          overline="Process"
          title="From inquiry to onboarding."
        />
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Inquiry", desc: "Submit your partnership application with firm details and target market." },
            { step: "02", title: "Diligence", desc: "NIL33 reviews your operations, compliance posture, and athlete pipeline." },
            { step: "03", title: "Integration", desc: "Platform access, API keys, branded dashboards, and compliance configuration." },
            { step: "04", title: "Launch", desc: "Go live with underwriting, reporting, and deal execution on NIL33 rails." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="text-nil-gold font-mono font-bold text-3xl mb-3">{s.step}</div>
              <h4 className="text-nil-white font-semibold mb-2">{s.title}</h4>
              <p className="text-nil-muted text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="py-20 px-6 bg-nil-dark/40 text-center">
        <h2 className="text-h1 text-nil-white mb-4">Ready to partner?</h2>
        <p className="text-nil-muted text-lg mb-8 max-w-lg mx-auto">
          Contact our partnerships team to discuss integration, licensing, and onboarding.
        </p>
        <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Partnership%20Inquiry" size="lg" external>
          partnerships@nil33.com →
        </Button>
      </section>
    </>
  );
}
