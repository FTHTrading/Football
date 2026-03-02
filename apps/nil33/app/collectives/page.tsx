import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import { InlineStat } from "../../components/Stat";

export default function CollectivesPage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="pt-32 sm:pt-40 pb-24 px-6 hero-glow">
        <div className="max-w-[1200px] mx-auto max-w-3xl">
          <p className="text-overline mb-5">For Collectives</p>
          <h1 className="text-display text-nil-white">
            Stop guessing what athletes
            <span className="gradient-text"> are worth.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-xl">
            Your donors gave you capital. NIL33 makes sure you can account for
            every dollar — with scored valuations, compliance verification,
            and signed receipts for every deal.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/demo" size="lg">Try a Valuation</Button>
            <Button href="mailto:partnerships@nil33.com?subject=Collective%20Inquiry" variant="ghost" size="lg" external>
              Talk to us →
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ Before / After ═══ */}
      <Section>
        <SectionHeader
          overline="The difference"
          title="Before and after NIL33."
          subtitle="Three scenarios every collective faces — and how NIL33 changes each one."
        />
        <div className="space-y-6 stagger">
          {[
            {
              before: "Agent quotes $85K for a portal QB. You have no reference to push back.",
              after: "NIL33 scores the athlete at 67/99 with a fair range of $48K–$62K. You negotiate from data.",
            },
            {
              before: "Board asks how you allocated $1.2M this cycle. You show a spreadsheet.",
              after: "Every deal has a signed receipt with score, valuation, and compliance status. Export the full report.",
            },
            {
              before: "NCAA sends an enforcement letter requesting deal documentation. You scramble.",
              after: "Each transaction is time-stamped, cryptographically signed, and audit-ready. You send the file.",
            },
          ].map((item, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4">
              <Card className="border-l-2 !border-l-nil-red/40">
                <p className="text-overline !text-nil-red/70 !mb-2 !text-[10px]">Without NIL33</p>
                <p className="text-nil-muted text-sm leading-relaxed">{item.before}</p>
              </Card>
              <Card className="border-l-2 !border-l-nil-green/40" accent="var(--color-nil-green)">
                <p className="text-overline !text-nil-green/70 !mb-2 !text-[10px]">With NIL33</p>
                <p className="text-nil-text text-sm leading-relaxed">{item.after}</p>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ Compliance pressure ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeader
              overline="Regulatory landscape"
              title="Compliance is getting harder, not easier."
            />
            <div className="space-y-4 text-[15px] text-nil-muted leading-relaxed">
              <p>
                50 states have distinct NIL statutes. Conferences layer on supplemental rules.
                The NCAA is actively investigating deal structures. The House v. NCAA settlement
                will introduce revenue-sharing frameworks that require institutional-grade valuation.
              </p>
              <p>
                If you&apos;re still relying on a spreadsheet and a handshake, the regulatory
                environment has already passed you by.
              </p>
            </div>
            <div className="mt-8">
              <Button href="/product" variant="ghost" size="sm">See how the compliance engine works →</Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge status="pass" label="State Laws" />
              <span className="text-nil-muted text-sm">50 rulesets maintained</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge status="pass" label="Conference Rules" />
              <span className="text-nil-muted text-sm">10+ conferences tracked</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge status="review" label="NCAA Guidelines" />
              <span className="text-nil-muted text-sm">Real-time threshold monitoring</span>
            </div>
            <Card className="mt-6">
              <p className="text-nil-gold text-xs font-medium mb-2">Post-House v. NCAA</p>
              <p className="text-nil-muted text-sm leading-relaxed">
                Revenue-sharing frameworks will require collectives to demonstrate
                fair-market valuation for every deal. NIL33 is built for this future.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* ═══ Cost math ═══ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <SectionHeader
            overline="The math"
            title="Catch one overpay. Paid for the year."
            subtitle="The average unvalidated deal includes $15K–$40K in overpay. NIL33 Pro is $14,400/year."
          />
          <div className="bg-nil-dark/60 border border-nil-border/60 rounded-2xl p-8">
            <InlineStat label="NIL33 Pro (annual)" value="$14,400" />
            <InlineStat label="Typical overpay on one deal" value="$15K–$40K" valueColor="var(--color-nil-red)" />
            <div className="h-px bg-nil-border/40 my-3" />
            <InlineStat label="Deals to break even" value="1" valueColor="var(--color-nil-green)" />
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button href="/pricing" variant="ghost" size="sm">See pricing →</Button>
              <Button href="/demo" variant="ghost" size="sm">Run a free valuation →</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 sm:py-40 px-6 border-t border-nil-border/40">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-h1 text-nil-white mb-4">
            See it work on a real deal.
          </h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-md mx-auto">
            Enter an athlete&apos;s details. Get a score, compliance check, and receipt in 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Open Demo →</Button>
            <Button href="mailto:partnerships@nil33.com?subject=Collective%20Partnership" variant="secondary" size="lg" external>
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
