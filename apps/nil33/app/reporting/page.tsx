import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";

export default function ReportingPage() {
  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-nil-black">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">REPORTING</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-nil-white leading-tight mb-6">
            Institutional reporting.<br />
            <span className="gradient-text">Investor-grade transparency.</span>
          </h1>
          <p className="text-nil-muted text-lg max-w-2xl leading-relaxed">
            Portfolio performance, compliance status, distribution history, and risk analytics —
            all in one investor-ready reporting suite.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          center
          overline="Capabilities"
          title="Reporting for every stakeholder."
        />
        <div className="grid md:grid-cols-2 gap-6 stagger">
          {[
            {
              title: "Investor Reporting",
              desc: "Quarterly performance reports, distribution statements, NAV calculations, and K-1 generation. Branded PDF export for LP distribution.",
              items: ["Portfolio performance", "Distribution history", "NAV tracking", "K-1 generation"],
              color: "text-nil-gold",
            },
            {
              title: "Agency Dashboard",
              desc: "Roster-level analytics, athlete capital scores, revenue projections, and deal pipeline visibility. Real-time portfolio intelligence.",
              items: ["Roster analytics", "Revenue projections", "Deal pipeline", "Score monitoring"],
              color: "text-nil-blue",
            },
            {
              title: "Compliance Reports",
              desc: "Regulatory status by jurisdiction, compliance check history, exception tracking, and supervisory approval logs.",
              items: ["State compliance status", "Audit trail export", "Exception reports", "Supervision logs"],
              color: "text-nil-emerald",
            },
            {
              title: "Risk Analytics",
              desc: "Portfolio VaR, concentration analysis, stress-test scenarios, and exposure monitoring. Custom risk factor modeling.",
              items: ["Portfolio VaR", "Concentration limits", "Stress testing", "Exposure monitoring"],
              color: "text-nil-purple",
            },
          ].map((report) => (
            <div key={report.title} className="rounded-2xl border border-nil-border/60 bg-nil-dark/60 p-8 card-lift">
              <h3 className={`font-bold text-xl mb-3 ${report.color}`}>{report.title}</h3>
              <p className="text-nil-muted text-sm leading-relaxed mb-5">{report.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                {report.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className={`${report.color} text-[8px]`}>◆</span>
                    <span className="text-nil-text text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="py-20 px-6 bg-nil-dark/40 text-center">
        <h2 className="text-h1 text-nil-white mb-4">See a sample report.</h2>
        <p className="text-nil-muted text-lg mb-8 max-w-lg mx-auto">
          Request a sample investor report or agency dashboard walkthrough.
        </p>
        <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Reporting%20Demo" size="lg" external>
          Request Sample →
        </Button>
      </section>
    </>
  );
}
