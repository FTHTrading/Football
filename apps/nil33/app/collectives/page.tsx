"use client";

import { useEffect, useRef, useState } from "react";
import Section, { SectionHeader } from "../../components/Section";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import { InlineStat } from "../../components/Stat";
import { ScoreBar } from "../../components/ScoreDisplay";

/* === Animated counter === */
function Counter({ end, suffix = "", prefix = "", duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setVal(Math.round(end * ease));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

export default function CollectivesPage() {
  return (
    <>
      {/* === Hero === */}
      <section className="relative pt-32 sm:pt-44 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-nil-green/[0.03] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="max-w-3xl">
            <p className="text-overline mb-6">For Collectives</p>
            <h1 className="text-display text-nil-white">
              Stop guessing what athletes
              <span className="gradient-text"> are worth.</span>
            </h1>
            <p className="mt-6 text-body-lg text-nil-muted max-w-xl">
              Your donors gave you capital. NIL33 makes sure you can account for
              every dollar &mdash; with scored valuations, compliance verification,
              and signed receipts for every deal.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/demo" size="lg">Try a Valuation</Button>
              <Button href="mailto:partnerships@nil33.com?subject=Collective%20Inquiry" variant="ghost" size="lg" external>
                Talk to us &rarr;
              </Button>
            </div>
          </div>

          {/* Hero stat strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-nil-border/20 rounded-2xl overflow-hidden border border-nil-border/40">
            {[
              { value: 18, suffix: "%", label: "Average overpay rate", color: "text-nil-red" },
              { value: 270, prefix: "$", suffix: "K", label: "Overpay per cycle", color: "text-nil-red" },
              { value: 33, suffix: "", label: "Scoring factors", color: "text-nil-green" },
              { value: 50, suffix: "", label: "State rulesets", color: "text-nil-cyan" },
            ].map((s) => (
              <div key={s.label} className="bg-nil-dark/80 backdrop-blur-sm p-6 text-center">
                <p className={`font-mono text-3xl font-extrabold ${s.color}`}>
                  <Counter end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-nil-muted text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === The Problem === */}
      <Section dark>
        <SectionHeader
          overline="The problem"
          title="Collectives are flying blind."
          subtitle="Without institutional-grade valuation, every deal is a guess. And guesses cost real money."
        />
        <div className="grid md:grid-cols-3 gap-6 stagger">
          {[
            {
              icon: "\u26A0",
              title: "No price discovery",
              desc: "Agents name a price. Collectives have no independent reference point to push back. The result: systematic overpay across the entire portfolio.",
              stat: "18%",
              statLabel: "avg overpay",
              color: "var(--color-nil-red)",
            },
            {
              icon: "\uD83D\uDCCB",
              title: "No documentation",
              desc: "Board asks how you spent $1.2M this year. You open a spreadsheet. When the NCAA asks the same question, a spreadsheet won't be enough.",
              stat: "0",
              statLabel: "audit-ready receipts",
              color: "var(--color-nil-gold)",
            },
            {
              icon: "\u2696",
              title: "No compliance proof",
              desc: "50 different state laws. Conference-specific rules. NCAA pay-for-play thresholds. One missed regulation can jeopardize your entire operation.",
              stat: "60+",
              statLabel: "regulatory layers",
              color: "var(--color-nil-orange)",
            },
          ].map((item) => (
            <Card key={item.title} hover>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-nil-white font-semibold">{item.title}</h3>
              </div>
              <p className="text-nil-muted text-sm leading-relaxed mb-6">{item.desc}</p>
              <div className="border-t border-nil-border/30 pt-4 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold" style={{ color: item.color }}>{item.stat}</span>
                <span className="text-nil-muted text-xs uppercase">{item.statLabel}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* === Before / After === */}
      <Section>
        <SectionHeader
          overline="The difference"
          title="Before and after NIL33."
          subtitle="Three scenarios every collective faces &mdash; and the tooling that changes each one."
        />
        <div className="space-y-6 stagger">
          {[
            {
              title: "Valuation",
              before: "Agent quotes $85K for a portal QB. You have no reference to push back. You pay $85K because you don't want to lose the deal.",
              after: "NIL33 scores the athlete at 67/99 with a fair range of $48K\u2013$62K. You negotiate from data \u2014 and save $23K on a single deal.",
              savings: "$23,000",
            },
            {
              title: "Documentation",
              before: "Board asks how you allocated $1.2M this cycle. You show a spreadsheet with names and numbers. No methodology. No audit trail.",
              after: "Every deal has a signed receipt with score, valuation band, compliance status, and cryptographic signature. Export the full report in one click.",
              savings: "Audit-ready",
            },
            {
              title: "Compliance",
              before: "NCAA sends an enforcement letter requesting deal documentation. You scramble to recreate deal context from emails and texts.",
              after: "Each transaction is time-stamped, cryptographically signed, and searchable. You send the file in minutes, not weeks.",
              savings: "Defense-grade",
            },
          ].map((item, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
              <Card className="border-l-2 !border-l-nil-red/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-nil-red/60 text-xs font-mono">BEFORE</span>
                  <span className="text-nil-muted text-[10px]">&mdash; {item.title}</span>
                </div>
                <p className="text-nil-muted text-sm leading-relaxed">{item.before}</p>
              </Card>
              <div className="hidden md:flex flex-col items-center justify-center">
                <div className="w-px h-full bg-gradient-to-b from-nil-red/40 via-nil-green/60 to-nil-green/40" />
              </div>
              <Card className="border-l-2 !border-l-nil-green/40" accent="var(--color-nil-green)">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-nil-green/80 text-xs font-mono">AFTER</span>
                    <span className="text-nil-muted text-[10px]">&mdash; {item.title}</span>
                  </div>
                  <span className="text-nil-green text-xs font-bold font-mono bg-nil-green/10 px-2.5 py-1 rounded-full border border-nil-green/20">{item.savings}</span>
                </div>
                <p className="text-nil-text text-sm leading-relaxed">{item.after}</p>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* === How it works - 3 step === */}
      <Section dark>
        <SectionHeader
          center
          overline="Workflow"
          title="Three steps. Full capital discipline."
        />
        <div className="grid md:grid-cols-3 gap-8 stagger">
          {[
            {
              step: "01",
              title: "Score the athlete",
              desc: "Enter deal details. NIL33 runs 33 weighted factors across social reach, athletic performance, market demand, and brand alignment. You get a composite score (0\u201399) and a dollar-range valuation band.",
              color: "var(--color-nil-green)",
            },
            {
              step: "02",
              title: "Check compliance",
              desc: "Every deal is validated against your state's NIL law, your conference's rules, and current NCAA guidelines. If the proposed amount exceeds fair value, NIL33 flags the overpay risk before you sign.",
              color: "var(--color-nil-cyan)",
            },
            {
              step: "03",
              title: "Get the receipt",
              desc: "Every scored deal generates a timestamped, cryptographically signed receipt. The receipt captures every input, score, and compliance check \u2014 tamper-evident and ready for any audit.",
              color: "var(--color-nil-purple)",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-sm font-bold border"
                  style={{ color: item.color, borderColor: `color-mix(in srgb, ${item.color} 25%, transparent)`, backgroundColor: `color-mix(in srgb, ${item.color} 5%, transparent)` }}
                >
                  {item.step}
                </span>
                <h3 className="text-nil-white font-semibold text-lg">{item.title}</h3>
              </div>
              <p className="text-nil-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* === Compliance pressure === */}
      <Section>
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
              <Button href="/product" variant="ghost" size="sm">See the compliance engine &rarr;</Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-nil-dark/60 border border-nil-border/40">
              <Badge status="pass" label="State Laws" />
              <div>
                <span className="text-nil-white text-sm font-medium">50 state rulesets</span>
                <p className="text-nil-muted text-xs">Updated as legislation changes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-nil-dark/60 border border-nil-border/40">
              <Badge status="pass" label="Conference" />
              <div>
                <span className="text-nil-white text-sm font-medium">10+ conference rulesets</span>
                <p className="text-nil-muted text-xs">SEC, Big Ten, Big 12, ACC, and more</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-nil-dark/60 border border-nil-border/40">
              <Badge status="review" label="NCAA" />
              <div>
                <span className="text-nil-white text-sm font-medium">Real-time thresholds</span>
                <p className="text-nil-muted text-xs">Pay-for-play risk detection</p>
              </div>
            </div>
            <Card className="mt-4">
              <p className="text-nil-gold text-xs font-bold tracking-wider uppercase mb-2">Post-House v. NCAA</p>
              <p className="text-nil-muted text-sm leading-relaxed">
                Revenue-sharing frameworks will require collectives to demonstrate
                fair-market valuation for every deal. NIL33 is built for this future.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* === ROI math === */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              overline="The math"
              title="Catch one overpay. Paid for the year."
              subtitle="The average unvalidated deal includes $15K\u2013$40K in overpay. NIL33 Pro costs $14,400/year. The ROI is obvious."
            />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/pricing" size="lg">See Pricing</Button>
              <Button href="/demo" variant="ghost" size="lg">Try Free Demo &rarr;</Button>
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
            <InlineStat label="ROI (typical)" value="5x\u201310x" valueColor="var(--color-nil-green)" />
            <p className="text-nil-muted text-xs pt-4 border-t border-nil-border/20 mt-4">
              One accurate valuation on one deal covers the annual cost. Everything after that is pure savings.
            </p>
          </div>
        </div>
      </Section>

      {/* === What this replaces === */}
      <Section>
        <SectionHeader
          center
          overline="Built for collectives"
          title="What this replaces."
        />
        <div className="grid md:grid-cols-3 gap-6 stagger">
          {[
            { replaced: "Gut-feel valuations", with: "33-factor composite scoring with sub-scores across social, athletic, market, and brand dimensions", icon: "\uD83D\uDCCA" },
            { replaced: "Excel spreadsheets", with: "Cryptographically signed deal receipts with full audit trails, searchable history, and one-click export", icon: "\uD83D\uDCC4" },
            { replaced: "Call-a-friend compliance", with: "Real-time 3-layer compliance checking against state law, conference rules, and NCAA guidelines", icon: "\u2696" },
            { replaced: "Manual deal tracking", with: "Portfolio-wide deal history with sort, filter, and aggregate reporting across your entire operation", icon: "\uD83D\uDD0D" },
            { replaced: "Unverifiable data", with: "Ed25519 cryptographic signatures on every receipt. Tamper-evident, time-stamped, legally defensible", icon: "\uD83D\uDD10" },
            { replaced: "Per-deal legal review", with: "Automated pre-deal compliance checks that flag issues before you sign \u2014 not after", icon: "\u26A1" },
          ].map((item) => (
            <Card key={item.replaced} hover>
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <p className="text-nil-red/60 text-xs font-mono line-through mb-2">{item.replaced}</p>
              <p className="text-nil-text text-sm leading-relaxed">{item.with}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* === Pipeline === */}
      <Section dark>
        <SectionHeader
          center
          overline="Under the hood"
          title="The technology behind the receipts."
        />
        <div className="max-w-2xl mx-auto">
          <CodePreview title="nil33-receipt-pipeline.txt">
            <pre className="text-nil-text whitespace-pre leading-relaxed text-xs sm:text-sm overflow-x-auto">
{`Deal Input                 NIL33 Engine
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  Athlete Profile  \u2502      \u2502  33-Factor Score   \u2502
\u2502  Deal Proposal    \u2502\u2500\u2500\u2500\u2500\u25B6\u2502  Compliance Check  \u2502
\u2502  Market Context   \u2502      \u2502  Valuation Band    \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                                    \u2502
                           \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                           \u25BC                 \u25BC
                    \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                    \u2502 Compliance   \u2502  \u2502   Receipt     \u2502
                    \u2502 50 States    \u2502  \u2502   Ed25519     \u2502
                    \u2502 10+ Confs    \u2502  \u2502   Signed      \u2502
                    \u2502 NCAA Rules   \u2502  \u2502   Sealed      \u2502
                    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                                          \u2502
                                          \u25BC
                                   \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
                                   \u2502  Audit-Ready  \u2502
                                   \u2502  PDF / JSON   \u2502
                                   \u2502  Tamper-      \u2502
                                   \u2502    Evident    \u2502
                                   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`}
            </pre>
          </CodePreview>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 stagger">
          {[
            { label: "Rust engine", value: "Deterministic", color: "text-nil-green" },
            { label: "Signatures", value: "Ed25519", color: "text-nil-purple" },
            { label: "Rulesets", value: "60+", color: "text-nil-cyan" },
            { label: "Scoring time", value: "<1ms", color: "text-nil-gold" },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 bg-nil-black/40 rounded-xl border border-nil-border/30">
              <p className={`font-mono text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-nil-muted text-xs uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* === CTA === */}
      <section className="relative py-32 sm:py-40 px-6 border-t border-nil-border/40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-nil-green/[0.03] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          <p className="text-overline mb-6">Get started</p>
          <h2 className="text-display text-nil-white max-w-2xl mx-auto mb-4">
            See it work on a
            <span className="gradient-text"> real deal.</span>
          </h2>
          <p className="text-nil-muted text-body-lg mb-10 max-w-md mx-auto">
            Enter an athlete&apos;s details. Get a score, compliance check, and receipt in 30 seconds.
            No credit card. No sales call.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/demo" size="lg">Open Demo &rarr;</Button>
            <Button href="mailto:partnerships@nil33.com?subject=Collective%20Partnership" variant="secondary" size="lg" external>
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
