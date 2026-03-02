"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, GraduationCap, DollarSign, AlertTriangle,
  Shield, Building, Dna, CheckCircle2, ChevronDown, ChevronUp,
  FileText, Lightbulb, ArrowRight
} from "lucide-react";

/* ── Education Articles ── */
const ARTICLES = [
  {
    id: "how-nil-works",
    title: "How NIL Works: A Complete Guide for Quarterbacks",
    category: "Fundamentals",
    icon: BookOpen,
    color: "#00C2FF",
    readTime: "8 min",
    summary: "NIL stands for Name, Image, and Likeness — your right to earn income from your personal brand while still competing as a student-athlete. This guide covers what NIL is, how it works, and what every quarterback should know before their first deal.",
    content: [
      {
        heading: "What Is NIL?",
        text: "Name, Image, and Likeness (NIL) refers to an athlete's legal right to profit from their own identity. Starting July 1, 2021, the NCAA adopted an interim policy allowing student-athletes to monetize their NIL without losing eligibility. This covers social media promotions, autograph signings, personal appearances, brand endorsements, camps and clinics, merchandise, content creation, and more."
      },
      {
        heading: "How Quarterbacks Benefit from NIL",
        text: "Quarterbacks hold a unique advantage in the NIL landscape — they are the most visible position in football, often the face of their program, and command the highest engagement rates. Top QB NIL deals have reached six and seven figures. But even athletes at smaller programs can build sustainable NIL income through strategic personal branding, local sponsorships, and social media monetization."
      },
      {
        heading: "Key Steps to Getting Started",
        text: "Step 1: Build your brand — Social presence, content quality, engagement. Step 2: Understand your school's policy — Every institution has specific NIL rules beyond the state law. Step 3: Get a disclosure form ready — Most schools require upfront disclosure before deals execute. Step 4: Consider representation — NIL agents and managers can negotiate better deals and handle compliance. Step 5: Track everything — Revenue, contracts, deliverables, and tax obligations must be documented."
      },
      {
        heading: "Common Revenue Streams",
        text: "Social media sponsorships ($500-$50K per post depending on following), autograph signings ($20-$200 per signature), personal appearances ($1K-$25K), camps and clinics ($5K-$50K), merchandise ($1-$15 profit per item), brand ambassador deals ($5K-$100K+), and content creation (variable). The Under Center platform tracks all of these through your NIL profile."
      },
    ],
  },
  {
    id: "nil-taxes",
    title: "NIL Tax Guide: What Student-Athletes Need to Know",
    category: "Financial",
    icon: DollarSign,
    color: "#00FF88",
    readTime: "6 min",
    summary: "NIL income is taxable. This guide covers federal and state tax obligations, 1099 forms, deductions, and why every student-athlete earning NIL income needs a CPA.",
    content: [
      {
        heading: "NIL Income Is Self-Employment Income",
        text: "The IRS classifies NIL income as self-employment income, not wages. You will not receive a W-2 from brands — instead, you'll receive a 1099-NEC for any payment over $600 in a tax year. This means you're responsible for both income tax AND self-employment tax (15.3% for Social Security and Medicare)."
      },
      {
        heading: "How Much Should You Set Aside?",
        text: "As a rule of thumb, student-athletes should set aside 25-30% of all NIL income for taxes. The exact amount depends on your total income, state of residence, and deductions. For athletes earning over $10,000 in NIL income, quarterly estimated tax payments may be required to avoid penalties."
      },
      {
        heading: "Deductions You Can Claim",
        text: "Common deductions for NIL activities include: agent/manager commissions, travel expenses for appearances, equipment for content creation (cameras, lighting, editing software), professional headshots and media kits, business cards and marketing materials, and a portion of your phone/internet bill used for NIL work. Keep receipts for everything."
      },
      {
        heading: "State Tax Considerations",
        text: "You may owe state income tax in: (1) your state of residence, (2) the state where your school is located, and (3) any state where you earn NIL income (if you do an appearance in a different state). Some states have no income tax (TX, FL, NV, WA, WY, SD, AK, TN, NH) which may create advantages."
      },
      {
        heading: "Get Professional Help",
        text: "Under Center strongly recommends working with a CPA or tax professional experienced in athlete taxation. The platform can generate revenue reports to assist with tax preparation, but does not provide tax advice."
      },
    ],
  },
  {
    id: "avoid-violations",
    title: "How to Avoid NIL Violations and Protect Your Eligibility",
    category: "Compliance",
    icon: AlertTriangle,
    color: "#FF3B5C",
    readTime: "7 min",
    summary: "NIL rights come with rules. Violating those rules can jeopardize your eligibility. This guide covers the most common mistakes, restricted categories, and how to stay compliant.",
    content: [
      {
        heading: "The #1 Rule: No Pay-for-Play",
        text: "NIL allows you to monetize your personal brand — it does NOT allow you to be paid for athletic performance. If a deal is contingent on you attending a specific school, making a roster, starting, or winning games, it is a pay-for-play violation and will result in eligibility loss. Every NIL deal must be for a legitimate service (endorsement, appearance, content creation) at fair market value."
      },
      {
        heading: "Disclosure Is Non-Negotiable",
        text: "Every state and institution requires some form of disclosure. Failing to disclose a deal — even if the deal itself is perfectly legal — is one of the most common ways athletes lose eligibility. File your disclosure form BEFORE the deal executes if your state or school requires prior approval, or within the reporting window (typically 7-14 days) after execution."
      },
      {
        heading: "Restricted Brand Categories",
        text: "Most institutions restrict or prohibit NIL deals with: alcohol brands, gambling/sports betting companies, tobacco/nicotine products, adult entertainment, cannabis/CBD (even in legal states, due to NCAA rules), and any brand that conflicts with existing institutional sponsorships. When in doubt, check with your compliance office BEFORE signing."
      },
      {
        heading: "Booster and Collective Rules",
        text: "NIL collectives have become a major part of the landscape, but the NCAA has tightened rules around booster involvement. Deals facilitated by collectives must still meet fair market value standards and cannot be used as recruiting inducements. If a collective is offering you a deal contingent on attending or transferring to a specific school, that deal likely violates NCAA rules."
      },
      {
        heading: "Under Center's Conflict Check Engine",
        text: "The platform automatically flags restricted categories, institutional sponsor conflicts, and deals that may trigger compliance concerns. This is not a substitute for professional legal review, but it provides an additional layer of protection to help athletes avoid inadvertent violations."
      },
    ],
  },
  {
    id: "school-compliance",
    title: "How Schools Review NIL Deals: Institutional Compliance",
    category: "Institutional",
    icon: Building,
    color: "#A855F7",
    readTime: "5 min",
    summary: "Schools have their own NIL policies on top of state law. Understanding your institution's review process ensures your deals don't get rejected or create eligibility issues.",
    content: [
      {
        heading: "Why Schools Review NIL Deals",
        text: "Institutions review NIL deals to ensure compliance with state law, NCAA rules, and the school's own brand and sponsorship commitments. Many schools have existing exclusive sponsorship agreements (Nike, Adidas, regional brands) that may conflict with athlete endorsements. Your school's compliance office is responsible for reviewing and approving deals."
      },
      {
        heading: "The Review Process",
        text: "Typically: (1) Athlete submits disclosure form with deal details. (2) Compliance office checks for conflicts with institutional sponsors. (3) Review for restricted categories (alcohol, gambling, etc.). (4) Verification that the deal meets fair market value standards. (5) Approval, conditional approval, or rejection. This process usually takes 3-7 business days."
      },
      {
        heading: "What Gets Rejected",
        text: "Common rejection reasons include: conflict with institutional sponsors (wearing a Nike athlete's competitor brand), restricted product category, compensation above fair market value (suggesting pay-for-play), insufficient documentation, or deals that violate the school's code of conduct."
      },
      {
        heading: "Working with Your Compliance Office",
        text: "Build a relationship with your compliance officer early. Provide complete documentation upfront. Don't surprise them with a deal you've already executed. If you're unsure about a deal, ask BEFORE you sign. Most compliance issues arise from lack of communication, not malicious intent."
      },
    ],
  },
  {
    id: "nil-vs-pay-for-play",
    title: "NIL vs. Pay-for-Play: Understanding the Difference",
    category: "Fundamentals",
    icon: Shield,
    color: "#FFB800",
    readTime: "4 min",
    summary: "The line between NIL and pay-for-play is the most critical distinction in college athletics. Understanding it protects your eligibility and career.",
    content: [
      {
        heading: "NIL: Monetizing Your Brand",
        text: "NIL allows athletes to profit from their name, image, and likeness — their personal brand. The key requirement is that the athlete is being compensated for a legitimate service or use of their identity. Examples: Posting a sponsored Instagram story about a local restaurant. Making a paid appearance at a car dealership. Licensing your image for a video game. Running a personal training camp."
      },
      {
        heading: "Pay-for-Play: Compensation for Athletics",
        text: "Pay-for-play is compensation for athletic performance, recruitment, or enrollment. This remains prohibited under NCAA rules. Examples of pay-for-play (violations): Being paid to attend a specific school. Receiving bonuses for wins, touchdowns, or other performance metrics. Getting paid for being on the roster. Receiving compensation contingent on maintaining your starting position."
      },
      {
        heading: "The Gray Area",
        text: "The tension between NIL and pay-for-play is real — especially with NIL collectives. When a collective offers an athlete a deal worth $500K to attend a specific school, the NCAA considers that pay-for-play even if the deal is structured as 'content creation.' Fair market value is the test: Would this athlete receive this deal based solely on their NIL value, regardless of what school they attend?"
      },
      {
        heading: "Protecting Yourself",
        text: "Always ensure your NIL deals are: (1) For a legitimate service at fair market value. (2) Not contingent on enrollment, roster status, or performance. (3) Properly disclosed to your institution. (4) Reviewed by an attorney. (5) Documented with contracts that clearly define deliverables. If a deal feels too good to be true, or if it's contingent on where you play, it's probably a violation."
      },
    ],
  },
];

export default function ResourcesPage() {
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/nil" className="flex items-center gap-2 text-sm text-uc-gray-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to NIL
          </Link>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-cyan/20 text-[10px] tracking-[0.4em] uppercase text-uc-cyan mb-6">
            <GraduationCap size={12} /> Education & Resources
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            NIL Education <span className="text-uc-cyan">Center</span>
          </h1>
          <p className="text-uc-gray-400 max-w-2xl mx-auto">
            Everything quarterbacks, parents, and coaches need to know about NIL — taxes, compliance, violations, institutional rules, and building a sustainable brand.
          </p>
        </motion.div>

        {/* Quick Nav */}
        <div className="glass rounded-xl p-4 mb-12 flex flex-wrap items-center justify-center gap-3">
          {ARTICLES.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => {
                  setOpenArticle(openArticle === a.id ? null : a.id);
                  setTimeout(() => {
                    document.getElementById(a.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/5 text-[10px] text-uc-gray-300 hover:text-white hover:border-white/20 transition"
              >
                <Icon size={10} style={{ color: a.color }} /> {a.category}
              </button>
            );
          })}
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {ARTICLES.map((article) => {
            const Icon = article.icon;
            const isOpen = openArticle === article.id;
            return (
              <div key={article.id} id={article.id} className="glass rounded-2xl border border-white/[0.04] overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => setOpenArticle(isOpen ? null : article.id)}
                  className="w-full p-5 sm:p-6 flex items-start gap-4 text-left hover:bg-white/[0.01] transition"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${article.color}12` }}>
                    <Icon size={20} style={{ color: article.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: article.color }}>{article.category}</span>
                      <span className="text-[9px] text-uc-gray-500">• {article.readTime}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{article.title}</h3>
                    <p className="text-[11px] text-uc-gray-400 leading-relaxed line-clamp-2">{article.summary}</p>
                  </div>
                  <div className="shrink-0 mt-3">
                    {isOpen ? <ChevronUp size={16} className="text-uc-gray-400" /> : <ChevronDown size={16} className="text-uc-gray-400" />}
                  </div>
                </button>

                {/* Body */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-white/5"
                  >
                    <div className="p-5 sm:p-6 space-y-6">
                      {article.content.map((block) => (
                        <div key={block.heading}>
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Lightbulb size={12} style={{ color: article.color }} />
                            {block.heading}
                          </h4>
                          <p className="text-xs text-uc-gray-300 leading-relaxed whitespace-pre-line">{block.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Related Navigation */}
        <div className="mt-16 grid sm:grid-cols-2 gap-4">
          <Link href="/nil/compliance" className="glass rounded-xl p-5 border border-white/[0.04] hover:border-uc-red/20 transition group">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={16} className="text-uc-red" />
              <span className="text-xs font-bold">State Law Matrix →</span>
            </div>
            <p className="text-[11px] text-uc-gray-400">View the full 50-state NIL compliance matrix with disclosure requirements and institutional restrictions.</p>
          </Link>
          <Link href="/nil/agreements" className="glass rounded-xl p-5 border border-white/[0.04] hover:border-uc-green/20 transition group">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={16} className="text-uc-green" />
              <span className="text-xs font-bold">Agreement Templates →</span>
            </div>
            <p className="text-[11px] text-uc-gray-400">Download standardized NIL agreement templates for representation, brand partnerships, and guardian consent.</p>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">NIL Education & Resources · Written for quarterbacks, parents, and coaches</p>
          <p className="text-[10px] text-uc-gray-600">Educational content only — not legal or tax advice</p>
        </div>
      </div>
    </main>
  );
}
