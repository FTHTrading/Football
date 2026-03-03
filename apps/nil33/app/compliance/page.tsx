import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";

export default function CompliancePage() {
  const complianceAreas = [
    {
      title: "50-State NIL Statutes",
      desc: "Structured rulesets for every state with active NIL legislation. Automatically applied based on athlete domicile, school location, and transaction jurisdiction.",
      detail: "Updated as legislation evolves · Versioned for audit",
      color: "var(--color-nil-gold)",
      border: "border-nil-gold/20",
    },
    {
      title: "Conference Regulations",
      desc: "Conference-specific NIL rules overlaid on state compliance. Covers SEC, Big Ten, Big 12, ACC, Pac-12, and all D1 conferences.",
      detail: "Conference rules · Institutional policies · Stacking logic",
      color: "var(--color-nil-blue)",
      border: "border-nil-blue/20",
    },
    {
      title: "NCAA Guidelines",
      desc: "Current NCAA NIL guidelines tracked and enforced. Includes interim policy, booster restrictions, recruiting guardrails, and institutional caps.",
      detail: "Interim policy · Enforcement trends · Case law",
      color: "var(--color-nil-emerald)",
      border: "border-nil-emerald/20",
    },
    {
      title: "SEC Requirements",
      desc: "Securities law compliance for structured NIL products. Reg D, Reg A+, accreditation verification, and blue sky filing requirements.",
      detail: "Reg D · Reg A+ · Accreditation · Blue sky",
      color: "var(--color-nil-purple)",
      border: "border-nil-purple/20",
    },
    {
      title: "BD Supervision",
      desc: "Broker-dealer supervision workflow: pre-trade suitability, concentration limits, risk tolerance matching, and supervisory approval chain.",
      detail: "Suitability · Concentration · Approval workflow",
      color: "var(--color-nil-gold)",
      border: "border-nil-gold/20",
    },
    {
      title: "Audit Infrastructure",
      desc: "Append-only ledger with cryptographic signatures. Every action generates a permanent, tamper-evident record with SHA-256 hashing and Ed25519 signatures.",
      detail: "SHA-256 · Ed25519 · Immutable ledger",
      color: "var(--color-nil-blue)",
      border: "border-nil-blue/20",
    },
  ];

  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-nil-black">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">COMPLIANCE</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-nil-white leading-tight mb-6">
            50-state compliance.<br />
            <span className="gradient-text-blue">Institutional audit trail.</span>
          </h1>
          <p className="text-nil-muted text-lg max-w-2xl leading-relaxed">
            Every transaction, assessment, and distribution is checked against applicable
            state statutes, conference rules, NCAA guidelines, and SEC requirements.
            Timestamped, signed, and audit-ready.
          </p>
        </div>
      </section>

      <Section>
        <SectionHeader
          center
          overline="Coverage"
          title="Six compliance layers. Zero gaps."
          subtitle="From state NIL statutes to BD supervision — every regulatory dimension covered."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {complianceAreas.map((area) => (
            <div key={area.title} className={`rounded-2xl border ${area.border} bg-nil-dark/60 p-7 card-lift`}>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    color: area.color,
                    backgroundColor: `color-mix(in srgb, ${area.color} 8%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${area.color} 20%, transparent)`,
                  }}
                >
                  ◈
                </span>
                <h3 className="text-nil-white font-semibold text-base">{area.title}</h3>
              </div>
              <p className="text-nil-muted text-sm leading-relaxed mb-5">{area.desc}</p>
              <div className="bg-nil-black/60 rounded-xl px-4 py-2.5 border border-nil-border/30">
                <p className="font-mono text-xs" style={{ color: area.color }}>{area.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-h1 text-nil-white mb-4">Compliance should never be the bottleneck.</h2>
          <p className="text-nil-muted text-lg mb-8 leading-relaxed">
            NIL33 automates the compliance checks that slow deals down.
            State law, conference rules, suitability — checked in milliseconds, documented permanently.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { value: "< 1s", label: "Compliance check" },
              { value: "50+", label: "Jurisdictions" },
              { value: "100%", label: "Audit coverage" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-nil-gold font-mono text-3xl font-extrabold">{stat.value}</p>
                <p className="text-nil-muted text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="py-20 px-6 bg-nil-dark/40 text-center">
        <h2 className="text-h1 text-nil-white mb-4">Built for your compliance team.</h2>
        <p className="text-nil-muted text-lg mb-8 max-w-lg mx-auto">
          Schedule a compliance review to see NIL33&apos;s regulatory coverage for your jurisdiction.
        </p>
        <Button href="mailto:partnerships@nil33.com?subject=NIL33%20Compliance%20Review" size="lg" external>
          Schedule Review →
        </Button>
      </section>
    </>
  );
}
