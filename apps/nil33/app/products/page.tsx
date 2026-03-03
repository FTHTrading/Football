import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";

export default function ProductsPage() {
  const products = [
    {
      num: "01",
      title: "Revenue Participation Notes",
      desc: "Fractional interest in athlete NIL revenue streams. Quarterly distributions tied to verified earnings. Structured with waterfall provisions and covenant protections.",
      features: ["Quarterly distributions", "Revenue-linked returns", "33-signal underwriting", "50-state compliance"],
    },
    {
      num: "02",
      title: "Structured Advances",
      desc: "Capital advances against future NIL earnings with structured repayment schedules. Underwritten by our 33-signal engine with institutional-grade risk assessment.",
      features: ["Defined repayment schedule", "Covenant protections", "Advance-to-value limits", "Automated servicing"],
    },
    {
      num: "03",
      title: "Sponsor-Backed Facilities",
      desc: "Credit facilities collateralized by contracted sponsorship revenue. Known cashflows from executed sponsor agreements reduce risk for investors.",
      features: ["Contract-collateralized", "Known cashflow profiles", "Sponsor credit analysis", "Assignment provisions"],
    },
    {
      num: "04",
      title: "Portfolio Instruments",
      desc: "Diversified exposure across athlete cohorts — by sport, conference, or revenue type. Portfolio-level risk management with concentration limits.",
      features: ["Cohort diversification", "Concentration limits", "Portfolio VaR modeling", "Rebalancing framework"],
    },
    {
      num: "05",
      title: "Agency Credit Lines",
      desc: "Working capital facilities for agencies, secured against portfolio-level athlete revenue projections. Enables agencies to scale operations.",
      features: ["Portfolio-secured", "Revolving structure", "Draw-down flexibility", "Agency-level underwriting"],
    },
    {
      num: "06",
      title: "Data & Analytics Licenses",
      desc: "API access to 33-signal scoring, portfolio intelligence, and compliance infrastructure. For institutional partners requiring athlete capital data.",
      features: ["REST API access", "Real-time scoring", "Compliance data feeds", "Custom analytics"],
    },
  ];

  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-nil-black">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">PLATFORM</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-nil-white leading-tight mb-6">
            Six product families.<br />
            <span className="gradient-text">Structured for institutional scale.</span>
          </h1>
          <p className="text-nil-muted text-lg max-w-2xl leading-relaxed">
            Each product type maps to specific athlete revenue streams, risk profiles, and investor appetites.
            All built on shared underwriting, compliance, and settlement infrastructure.
          </p>
        </div>
      </section>

      <Section>
        <div className="space-y-8">
          {products.map((product) => (
            <div key={product.num} className="rounded-2xl border border-nil-border/60 bg-nil-dark/60 p-8 sm:p-10 card-lift">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-11 h-11 rounded-xl bg-nil-gold/10 border border-nil-gold/20 flex items-center justify-center font-mono text-sm font-bold text-nil-gold">
                      {product.num}
                    </span>
                    <h2 className="text-nil-white font-bold text-xl">{product.title}</h2>
                  </div>
                  <p className="text-nil-muted text-sm leading-relaxed">{product.desc}</p>
                </div>
                <div>
                  <p className="text-nil-muted text-[10px] uppercase tracking-[0.15em] font-semibold mb-3">Key Features</p>
                  <div className="space-y-2">
                    {product.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-nil-gold text-xs">◆</span>
                        <span className="text-nil-text text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="py-20 px-6 bg-nil-dark/40 text-center">
        <h2 className="text-h1 text-nil-white mb-4">Ready to explore?</h2>
        <p className="text-nil-muted text-lg mb-8 max-w-lg mx-auto">
          Contact our partnerships team to discuss product structuring for your agency or broker-dealer.
        </p>
        <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Product%20Inquiry" size="lg" external>
          Request Access →
        </Button>
      </section>
    </>
  );
}
