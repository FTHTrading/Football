"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, FileText, Eye, Shield, Users,
  Camera, DollarSign, Dna, AlertTriangle,
  ChevronDown, ChevronUp, Mail, Scale,
} from "lucide-react";

/* ── Standard Clauses (shared across all agreements) ── */

const STANDARD_CLAUSES = [
  {
    title: "Indemnification",
    text: `Each Party ("Indemnifying Party") agrees to indemnify, defend, and hold harmless the other Party and its officers, directors, employees, and agents ("Indemnified Parties") from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to: (a) the Indemnifying Party's breach of this Agreement; (b) the Indemnifying Party's negligence or willful misconduct; or (c) any third-party claim arising from the Indemnifying Party's performance under this Agreement. This indemnification obligation shall survive the termination or expiration of this Agreement.`,
  },
  {
    title: "Limitation of Liability",
    text: `IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO THIS AGREEMENT, REGARDLESS OF THE THEORY OF LIABILITY. EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL COMPENSATION PAID OR PAYABLE UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.`,
  },
  {
    title: "Force Majeure",
    text: `Neither Party shall be liable for any failure or delay in performing its obligations under this Agreement to the extent that such failure or delay results from circumstances beyond the Party's reasonable control, including but not limited to acts of God, natural disasters, pandemic, government orders, war, terrorism, strikes, or failure of third-party telecommunications or power supply ("Force Majeure Event"). The affected Party shall provide prompt written notice and shall use commercially reasonable efforts to mitigate the impact. If a Force Majeure Event continues for more than [NUMBER] consecutive days, either Party may terminate this Agreement upon written notice.`,
  },
  {
    title: "Dispute Resolution",
    text: `Any dispute, controversy, or claim arising out of or relating to this Agreement shall first be submitted to good-faith negotiation between senior representatives of each Party for a period of thirty (30) days. If the dispute is not resolved through negotiation, it shall be submitted to binding arbitration administered in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted by a single arbitrator in [CITY, STATE]. The arbitrator's decision shall be final and binding, and judgment on the award may be entered in any court of competent jurisdiction. Each Party shall bear its own costs and attorneys' fees unless the arbitrator determines otherwise.`,
  },
  {
    title: "Confidentiality",
    text: `Each Party acknowledges that it may receive confidential and proprietary information of the other Party ("Confidential Information"), including but not limited to: compensation terms, business strategies, marketing plans, athlete performance data, and deal structures. The receiving Party shall: (a) hold Confidential Information in strict confidence; (b) not disclose it to any third party without prior written consent; (c) use it solely for the purposes of this Agreement; and (d) protect it with at least the same degree of care it uses to protect its own confidential information. This obligation shall survive termination of this Agreement for a period of [NUMBER] years.`,
  },
  {
    title: "Assignment",
    text: `Neither Party may assign or transfer this Agreement or any rights or obligations hereunder without the prior written consent of the other Party, which consent shall not be unreasonably withheld. Notwithstanding the foregoing, either Party may assign this Agreement in connection with a merger, acquisition, or sale of all or substantially all of its assets. Any purported assignment in violation of this Section shall be null and void.`,
  },
  {
    title: "FTC Compliance",
    text: `The Parties shall comply with all applicable Federal Trade Commission ("FTC") guidelines regarding endorsements and testimonials, including 16 CFR Part 255. Athlete shall clearly and conspicuously disclose the material connection between Athlete and Brand in all sponsored content, using disclosure language and placement consistent with current FTC guidance (e.g., #ad, #sponsored). Brand shall provide Athlete with written disclosure requirements and shall not instruct Athlete to omit required disclosures.`,
  },
  {
    title: "NIL Regulatory Compliance",
    text: `The Parties acknowledge that Name, Image, and Likeness activities are subject to state law, NCAA rules, and institutional policies that vary by jurisdiction and are subject to change. Each Party is independently responsible for ensuring compliance with all applicable regulations in their jurisdiction. This Agreement shall not be construed to require either Party to take any action that would violate applicable law or governing body rules. In the event that a change in law or regulation renders any provision of this Agreement unenforceable or would require either Party to act in violation of law, the affected provision shall be modified to the minimum extent necessary to achieve compliance.`,
  },
  {
    title: "Governing Law",
    text: `This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE], without regard to its conflict of law provisions. The Parties consent to the personal jurisdiction of the state and federal courts located in [COUNTY, STATE] for any action arising out of or relating to this Agreement.`,
  },
  {
    title: "Entire Agreement & Severability",
    text: `This Agreement, together with any exhibits and amendments executed by the Parties, constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions. If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect, and the unenforceable provision shall be modified to the minimum extent necessary to make it enforceable.`,
  },
];

/* ── Agreement Templates with Draft Clauses ── */
const AGREEMENTS = [
  {
    id: "athlete-representation",
    title: "Athlete NIL Representation Agreement",
    category: "Representation",
    description:
      "Defines the scope of representation between an athlete and their NIL representative. Covers services, compensation, term, and termination.",
    icon: Users,
    color: "#00C2FF",
    forWhom: "Athletes, NIL Agents, Parents/Guardians",
    draftClauses: [
      {
        heading: "1. PARTIES",
        text: `This Agreement is entered into as of [EFFECTIVE DATE] by and between:\n\n• [ATHLETE FULL LEGAL NAME], an individual residing in [STATE] ("Athlete")\n• [REPRESENTATIVE / AGENCY NAME], a [STATE] [LLC/Corporation/Individual] with principal offices at [ADDRESS] ("Representative")\n\nCollectively referred to as the "Parties."`,
      },
      {
        heading: "2. SCOPE OF REPRESENTATION",
        text: `Representative shall serve as Athlete's exclusive representative for Name, Image, and Likeness opportunities within the following scope:\n\n(a) Geographic Territory: [STATE / NATIONWIDE / GLOBAL]\n(b) Categories: [ALL NIL OPPORTUNITIES / SPECIFIC CATEGORIES]\n(c) Platforms: [ALL PLATFORMS / SPECIFIC PLATFORMS]\n\nRepresentative's services shall include, but are not limited to: sourcing and negotiating NIL deals, managing brand relationships, advising on deal structure and valuation, coordinating compliance disclosures, and providing market analysis.`,
      },
      {
        heading: "3. COMPENSATION",
        text: `Representative shall receive commission compensation as follows:\n\n(a) Commission Rate: [___]% of gross NIL revenue generated through Representative's efforts\n(b) Payment Timing: Commissions are due within [___] business days of Athlete's receipt of compensation\n(c) Expenses: Pre-approved expenses incurred by Representative on Athlete's behalf shall be reimbursed at cost\n(d) Post-Termination: Representative shall continue to receive commissions on deals originated during the Term for their full duration\n\nNo commission shall be owed on NIL opportunities not sourced or materially facilitated by Representative.`,
      },
      {
        heading: "4. TERM AND DURATION",
        text: `(a) Initial Term: This Agreement shall commence on [EFFECTIVE DATE] and continue for a period of [___] months/years ("Initial Term")\n(b) Renewal: Upon expiration of the Initial Term, this Agreement shall [automatically renew for successive [___]-month periods / terminate] unless either Party provides written notice of non-renewal at least [___] days prior to expiration\n(c) Early Termination: Either Party may terminate this Agreement upon [___] days' written notice, subject to Section 5`,
      },
      {
        heading: "5. TERMINATION",
        text: `(a) For Cause: Either Party may terminate immediately upon written notice if the other Party materially breaches this Agreement and fails to cure such breach within [___] days of receiving written notice\n(b) Without Cause: Either Party may terminate upon [___] days' written notice\n(c) Effect of Termination: Upon termination, Representative shall promptly transfer all pending deal information, brand contacts, and materials to Athlete or Athlete's designated successor representative\n(d) Survival: Sections relating to compensation (for originated deals), confidentiality, and indemnification shall survive termination`,
      },
      {
        heading: "6. ATHLETE OBLIGATIONS",
        text: `Athlete agrees to:\n(a) Provide timely and accurate information necessary for Representative to perform services\n(b) Not engage other representatives for NIL services within the exclusive scope without prior written consent\n(c) Maintain conduct consistent with NCAA, institutional, and applicable governing body rules\n(d) Comply with all state NIL disclosure requirements applicable to deals facilitated under this Agreement\n(e) Execute agreements and fulfill deliverables in good faith`,
      },
    ],
  },
  {
    id: "brand-partnership",
    title: "Brand Partnership Agreement",
    category: "Sponsorship",
    description:
      "Governs the relationship between an athlete and a brand for sponsored content, appearances, or endorsements.",
    icon: DollarSign,
    color: "#00FF88",
    forWhom: "Athletes, Brands, Marketing Agencies",
    draftClauses: [
      {
        heading: "1. PARTIES",
        text: `This Agreement is entered into as of [EFFECTIVE DATE] by and between:\n\n• [ATHLETE FULL LEGAL NAME], an individual residing in [STATE] ("Athlete")\n• [BRAND / COMPANY NAME], a [STATE] [LLC/Corporation] with principal offices at [ADDRESS] ("Brand")\n\nCollectively referred to as the "Parties."`,
      },
      {
        heading: "2. DELIVERABLES",
        text: `Athlete shall provide the following deliverables during the Term:\n\n(a) Social Media Content: [NUMBER] posts on [PLATFORM(S)] per [WEEK/MONTH], each featuring [PRODUCT/SERVICE] and including required FTC disclosures\n(b) Appearances: [NUMBER] appearances at [EVENT TYPE] per [PERIOD], each lasting approximately [DURATION]\n(c) Content Standards: All deliverables shall be [original/pre-approved by Brand] and maintain [professional quality standards / Brand's style guide]\n(d) Approval Process: Brand shall have [___] business days to review and approve content before publication\n(e) Revision Rights: Brand may request up to [NUMBER] rounds of revisions per deliverable`,
      },
      {
        heading: "3. COMPENSATION",
        text: `Brand shall compensate Athlete as follows:\n\n(a) Base Fee: $[AMOUNT] payable [upon execution / in installments: $[___] upon execution and $[___] upon completion of deliverables]\n(b) Performance Bonus: $[AMOUNT] per [METRIC] exceeding [THRESHOLD]\n(c) Product/In-Kind: [DESCRIPTION OF PRODUCTS PROVIDED, ESTIMATED VALUE]\n(d) Payment Terms: All payments due within [___] business days of invoice or deliverable completion\n(e) Late Payment: Unpaid amounts shall accrue interest at [___]% per month\n(f) Tax Responsibility: Athlete is solely responsible for all taxes arising from compensation received under this Agreement`,
      },
      {
        heading: "4. USAGE RIGHTS",
        text: `(a) Grant: Athlete grants Brand a [non-exclusive/exclusive] license to use Athlete's name, image, likeness, and approved content for [SPECIFIC PURPOSES]\n(b) Platforms: Licensed use is limited to: [LIST PLATFORMS]\n(c) Duration: Usage rights shall extend for [DURATION] following expiration or termination of this Agreement\n(d) Territory: [STATE / NATIONAL / GLOBAL]\n(e) Sublicensing: [Permitted with prior written consent / Not permitted]\n(f) Athlete Ownership: Athlete retains all rights to content not explicitly licensed herein`,
      },
      {
        heading: "5. EXCLUSIVITY",
        text: `(a) Category Exclusivity: During the Term, Athlete shall not enter into endorsement agreements with [COMPETING BRAND CATEGORY]\n(b) Duration: Exclusivity restrictions shall expire [upon termination / ___] days after termination]\n(c) Scope: Exclusivity applies to [paid endorsements only / all public associations including organic content]`,
      },
      {
        heading: "6. COMPLIANCE",
        text: `(a) NCAA/Governing Body: Athlete represents that this Agreement has been or will be disclosed to their institution's compliance office in accordance with applicable rules\n(b) State Law: The Parties shall comply with all applicable state NIL laws, including disclosure and reporting requirements\n(c) FTC Guidelines: All sponsored content shall comply with FTC endorsement guidelines, including conspicuous disclosure of the material connection between Athlete and Brand\n(d) Moral Standards: Athlete agrees to conduct themselves in a manner consistent with Brand's reasonable standards of public behavior. Brand may terminate this Agreement if Athlete engages in conduct that materially damages Brand's reputation, subject to written notice and a [___]-day cure period where applicable`,
      },
    ],
  },
  {
    id: "content-license",
    title: "Content Usage License",
    category: "Licensing",
    description:
      "Licenses an athlete's name, image, and likeness for specific commercial purposes with defined scope and revocation terms.",
    icon: Camera,
    color: "#A855F7",
    forWhom: "Athletes, Brands, Content Platforms, Media Companies",
    draftClauses: [
      {
        heading: "1. PARTIES",
        text: `This Content Usage License ("License") is entered into as of [EFFECTIVE DATE] by and between:\n\n• [LICENSOR / ATHLETE FULL LEGAL NAME], an individual residing in [STATE] ("Licensor")\n• [LICENSEE / COMPANY NAME], a [STATE] [LLC/Corporation] ("Licensee")\n\nCollectively referred to as the "Parties."`,
      },
      {
        heading: "2. LICENSED CONTENT",
        text: `Licensor hereby licenses the following content and intellectual property ("Licensed Content"):\n\n(a) Name and Identity: [Full name, team name, jersey number, signature, recognizable attributes]\n(b) Image: [Photographs taken on [DATE(S)] by [PHOTOGRAPHER/STUDIO] — see Exhibit A for specific assets]\n(c) Video: [Video recordings of [DESCRIPTION] — see Exhibit B]\n(d) Voice/Endorsement: [Audio recordings, testimonial statements, if applicable]\n\nThe Licensed Content is defined solely by this Section and the attached Exhibits. Any use of content not explicitly listed herein is not authorized under this License.`,
      },
      {
        heading: "3. GRANT OF LICENSE",
        text: `(a) Scope: Licensor grants Licensee a [non-exclusive / exclusive] license to use the Licensed Content for [SPECIFIC PURPOSES]\n(b) Sublicensing: [Permitted with prior written consent / Not permitted without express authorization]\n(c) Modification: Licensee [may / may not] modify, crop, or edit the Licensed Content, provided that modifications do not materially alter the appearance or context of Licensor's likeness [without prior written approval]\n(d) Attribution: Licensee shall [include / not be required to include] attribution to Licensor in all uses of Licensed Content`,
      },
      {
        heading: "4. TERRITORY AND DURATION",
        text: `(a) Territory: This License is limited to: [STATE / NATIONAL / WORLDWIDE]\n(b) Term: [FIXED TERM: This License shall remain in effect from [START DATE] through [END DATE]] OR [PERPETUAL: This License shall remain in effect in perpetuity, subject to revocation under Section 6]\n(c) Renewal: [Auto-renewal for successive [___]-year terms unless either Party provides [___] days' written notice of non-renewal / No automatic renewal]`,
      },
      {
        heading: "5. COMPENSATION",
        text: `Licensee shall compensate Licensor as follows:\n\n(a) License Fee: [FLAT FEE: $[AMOUNT] payable upon execution] OR [ROYALTY: [___]% of [NET/GROSS] revenue derived from use of Licensed Content, payable [quarterly/annually]]\n(b) Minimum Guarantee: [If applicable: $[AMOUNT] per [YEAR/QUARTER], payable regardless of revenue generated]\n(c) Reporting: Licensee shall provide Licensor with [quarterly/annual] reports of revenue generated from Licensed Content\n(d) Audit Rights: Licensor shall have the right to audit Licensee's records related to Licensed Content revenue upon [___] days' written notice`,
      },
      {
        heading: "6. REVOCATION",
        text: `(a) Revocation for Cause: Licensor may revoke this License immediately upon written notice if Licensee: (i) uses Licensed Content outside the scope defined herein; (ii) materially breaches any term of this License; or (iii) becomes subject to insolvency proceedings\n(b) Revocation without Cause: [If perpetual license: Licensor may revoke upon [___] days' written notice and refund of a pro-rata portion of any pre-paid license fee]\n(c) Post-Revocation: Upon revocation, Licensee shall cease all use of Licensed Content within [___] days and destroy or return all copies`,
      },
    ],
  },
  {
    id: "guardian-consent",
    title: "Minor Guardian Consent Form",
    category: "Guardian",
    description:
      "Required for NIL agreements involving athletes under 18. Establishes legal authority, tax-aware consent, and custodial banking.",
    icon: Shield,
    color: "#FFB800",
    forWhom: "Parents, Legal Guardians, Minor Athletes, NIL Representatives",
    draftClauses: [
      {
        heading: "1. PARTIES AND AUTHORITY",
        text: `This Guardian Consent Form ("Consent") is executed by:\n\n• [GUARDIAN FULL LEGAL NAME], residing in [STATE], in their capacity as [parent / legal guardian] of the below-named minor ("Guardian")\n• [MINOR ATHLETE FULL LEGAL NAME], date of birth [DATE], residing in [STATE] ("Minor Athlete")\n\nGuardian represents and warrants that they have full legal authority to consent to agreements on behalf of Minor Athlete under the laws of [STATE]. Guardian shall provide proof of legal authority upon request.`,
      },
      {
        heading: "2. SCOPE OF CONSENT",
        text: `Guardian hereby consents to Minor Athlete's participation in NIL activities subject to the following:\n\n(a) Authorization Type: [PER-DEAL APPROVAL: Guardian must approve each individual NIL agreement before execution] OR [BLANKET AUTHORIZATION: Guardian authorizes NIL agreements within the parameters defined in Section 3, without per-deal approval]\n(b) Permitted Activities: [ALL NIL opportunities / LIMITED TO: social media endorsements, appearances, content licensing]\n(c) Prohibited Activities: Minor Athlete shall not participate in NIL activities involving [alcohol, tobacco, gambling, adult content, firearms, or other categories prohibited under applicable law or institutional policy]`,
      },
      {
        heading: "3. FINANCIAL PROTECTIONS",
        text: `(a) Custodial Account: All NIL compensation payable to Minor Athlete shall be deposited into a custodial bank account established under [STATE] Uniform Transfers to Minors Act (UTMA) at [FINANCIAL INSTITUTION]\n(b) Account Details: Account Number [LAST 4 DIGITS], held in the name of [MINOR ATHLETE], with Guardian as custodian\n(c) Escrow Requirement: For individual deals with total compensation exceeding $[AMOUNT], [___]% of compensation shall be placed in escrow until Minor Athlete reaches the age of majority\n(d) Earning Caps: [If applicable under state law: Minor Athlete's total annual NIL earnings shall not exceed $[AMOUNT] without court approval]\n(e) Access Restrictions: Guardian shall not withdraw funds except for expenses directly related to Minor Athlete's NIL activities, education, or welfare`,
      },
      {
        heading: "4. TAX RESPONSIBILITY",
        text: `(a) Tax Liability: Guardian acknowledges that NIL compensation is subject to federal and state income tax\n(b) Filing Responsibility: [Guardian / Minor Athlete] shall be responsible for filing tax returns reporting NIL income\n(c) Estimated Taxes: For annual NIL income exceeding $[AMOUNT], Guardian shall arrange for quarterly estimated tax payments\n(d) Professional Advice: Guardian is encouraged to consult a qualified tax professional. Under Center does not provide tax advice`,
      },
      {
        heading: "5. REPORTING AND OVERSIGHT",
        text: `(a) Financial Summaries: [Representative / Platform] shall provide Guardian with [monthly / quarterly] summaries of all NIL activities, including: deals executed, compensation received, pending payments, and expenses\n(b) Annual Reconciliation: A comprehensive annual report shall be provided within [___] days of calendar year-end\n(c) Guardian Access: Guardian shall have full access to view all deal terms, correspondence, and financial records related to Minor Athlete's NIL activities`,
      },
      {
        heading: "6. GUARDIAN'S RIGHT TO TERMINATE",
        text: `(a) Immediate Termination: Guardian may terminate this Consent and any associated NIL agreements on behalf of Minor Athlete at any time upon written notice\n(b) Effect of Termination: Upon termination, Minor Athlete shall fulfill deliverables for which compensation has already been received, unless Guardian determines continued participation is contrary to Minor Athlete's welfare\n(c) Transition: Upon termination, all pending compensation shall be deposited into the custodial account and all rights to Minor Athlete's NIL shall revert to Minor Athlete / Guardian`,
      },
    ],
  },
  {
    id: "revenue-disclosure",
    title: "NIL Revenue Disclosure Form",
    category: "Compliance",
    description:
      "Standard disclosure form for reporting NIL deal details to institutions and compliance offices.",
    icon: FileText,
    color: "#FF3B5C",
    forWhom: "Athletes, Compliance Officers, Institutions",
    draftClauses: [
      {
        heading: "1. ATHLETE INFORMATION",
        text: `• Full Legal Name: [____________________]\n• Institution: [____________________]\n• Sport / Position: [____________________]\n• Student ID (optional): [____________________]\n• Reporting Period: [START DATE] to [END DATE]\n\nI certify that the information provided in this disclosure is true and accurate to the best of my knowledge.`,
      },
      {
        heading: "2. DEAL IDENTIFICATION",
        text: `• Deal Reference Number: [AUTO-GENERATED / MANUAL]\n• Date Agreement Executed: [____________________]\n• Contracting Party (Brand/Company): [____________________]\n• Company Contact Name: [____________________]\n• Company Contact Email: [____________________]\n• Industry Category: [e.g., Apparel, Food & Beverage, Technology, Financial Services, etc.]`,
      },
      {
        heading: "3. COMPENSATION DETAILS",
        text: `(a) Compensation Type: [ ] Cash  [ ] Product/In-Kind  [ ] Equity  [ ] Other: [________]\n(b) Total Value: $[AMOUNT] [actual / estimated fair market value]\n(c) Payment Structure: [ ] Lump sum  [ ] Installments: [SCHEDULE]  [ ] Per-deliverable\n(d) Product / In-Kind Value: If non-cash compensation, describe: [____________________]\n    Estimated Fair Market Value: $[AMOUNT]\n(e) Equity Interest: If equity is included, describe: [____________________]\n    Estimated Value at Time of Agreement: $[AMOUNT]`,
      },
      {
        heading: "4. DELIVERABLES AND OBLIGATIONS",
        text: `(a) Type of Activity: [ ] Social Media Post  [ ] Appearance  [ ] Autograph Session  [ ] Content License  [ ] Endorsement  [ ] Other: [________]\n(b) Number of Deliverables: [____________________]\n(c) Platforms: [____________________]\n(d) Timeline: Start [DATE] — End [DATE]\n(e) Exclusivity: [ ] Yes — Category: [________], Duration: [________]  [ ] No`,
      },
      {
        heading: "5. INSTITUTIONAL CONFLICT CHECK",
        text: `(a) Does the brand compete with any current institutional sponsor? [ ] Yes  [ ] No  [ ] Unknown\n    If Yes, identify conflicting sponsor: [____________________]\n(b) Does this deal involve a restricted category under institutional or conference policy? [ ] Yes  [ ] No\n    If Yes, specify: [____________________]\n(c) Does this deal involve use of institutional marks, logos, or facilities? [ ] Yes  [ ] No\n(d) Has institutional compliance office been notified? [ ] Yes — Date: [____]  [ ] Pending`,
      },
      {
        heading: "6. STATUS AND CERTIFICATION",
        text: `(a) Deal Status: [ ] Active  [ ] Completed  [ ] Cancelled  [ ] In Dispute\n(b) All Deliverables Completed? [ ] Yes  [ ] No — Remaining: [________________]\n(c) All Payments Received? [ ] Yes  [ ] No — Outstanding: $[AMOUNT]\n\nATHLETE CERTIFICATION:\nI certify that: (i) this disclosure is complete and accurate; (ii) this agreement was entered into voluntarily; (iii) this deal does not constitute a pay-for-play arrangement conditioned on enrollment or athletic performance; and (iv) I will promptly update this disclosure if any material terms change.\n\nSignature: ________________________  Date: ________________\nPrinted Name: ________________________`,
      },
    ],
  },
];

export default function AgreementsPage() {
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [showStandardClauses, setShowStandardClauses] = useState(false);
  const [expandedClause, setExpandedClause] = useState<number | null>(null);

  const active = AGREEMENTS.find((a) => a.id === selectedAgreement);

  return (
    <main className="min-h-screen bg-uc-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/nil" className="flex items-center gap-2 text-sm text-uc-gray-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to NIL
          </Link>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-uc-green/20 text-[10px] tracking-[0.4em] uppercase text-uc-green mb-6">
            <Scale size={12} /> NIL Agreement Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            NIL Agreement <span className="text-uc-green">Draft Structures</span>
          </h1>
          <p className="text-uc-gray-400 max-w-2xl mx-auto mb-2">
            Educational draft clause frameworks for athlete representation, brand partnerships, content licensing, guardian consent, and revenue disclosure.
          </p>
          <p className="text-[10px] text-uc-gray-600 uppercase tracking-widest">
            Draft structures only · Not attorney-reviewed · Must be customized by legal counsel before execution
          </p>
        </motion.div>

        {/* ── DRAFT STRUCTURE BANNER ── */}
        <div className="rounded-xl p-5 mb-12 border border-yellow-400/20 bg-yellow-400/[0.03]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-400 mb-2">
                DRAFT STRUCTURE — EDUCATIONAL USE ONLY
              </p>
              <ul className="text-[11px] text-uc-gray-400 leading-relaxed space-y-1.5">
                <li>• These draft clause structures are provided as <strong className="text-white">educational references</strong> to illustrate common NIL agreement provisions.</li>
                <li>• They have <strong className="text-white">not been reviewed by an attorney</strong> and do not constitute legal advice.</li>
                <li>• Placeholders (shown in [BRACKETS]) must be replaced with deal-specific terms.</li>
                <li>• Every agreement must be <strong className="text-white">reviewed, customized, and approved by a licensed attorney</strong> familiar with applicable state law before execution.</li>
                <li>• Under Center is a technology platform — we are <strong className="text-white">not a law firm</strong> and do not provide legal services.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Role Notice */}
        <div className="glass rounded-xl p-4 border border-uc-cyan/10 mb-12 flex items-start gap-3">
          <Shield size={16} className="text-uc-cyan shrink-0 mt-0.5" />
          <div className="text-[11px] text-uc-gray-400 leading-relaxed">
            <strong className="text-uc-cyan">Under Center&apos;s Role:</strong>{" "}
            We provide educational agreement structures and workflow tools designed to assist parties in understanding common NIL contract provisions.
            We do not draft, negotiate, or execute agreements on behalf of any party. We do not certify compliance with any state law, NCAA rule,
            or institutional policy. All parties should engage independent legal counsel. See our{" "}
            <Link href="/legal/disclaimer" className="text-uc-cyan underline underline-offset-2">Disclaimer</Link> and{" "}
            <Link href="/legal/terms" className="text-uc-cyan underline underline-offset-2">Terms of Service</Link>.
          </div>
        </div>

        {/* Agreement Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {AGREEMENTS.map((agreement) => {
            const Icon = agreement.icon;
            const isOpen = selectedAgreement === agreement.id;
            return (
              <motion.button
                key={agreement.id}
                onClick={() => setSelectedAgreement(isOpen ? null : agreement.id)}
                className={`glass rounded-2xl p-5 border text-left transition-all duration-300 ${
                  isOpen ? "border-white/20 ring-1 ring-white/10" : "border-white/[0.04] hover:border-white/10"
                }`}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agreement.color}12` }}>
                    <Icon size={18} style={{ color: agreement.color }} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: agreement.color }}>{agreement.category}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{agreement.title}</h3>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed line-clamp-3">{agreement.description}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px]" style={{ color: agreement.color }}>
                  {isOpen ? "Viewing draft clauses ↑" : "View draft clauses →"}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Agreement — Draft Clauses */}
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/[0.06] p-6 sm:p-8 mb-16"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${active.color}12` }}>
                <active.icon size={22} style={{ color: active.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{active.title}</h2>
                <p className="text-[10px] text-uc-gray-400">{active.forWhom}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-bold uppercase tracking-widest">
                Draft Structure
              </span>
              <span className="text-[9px] text-uc-gray-600">Not attorney-reviewed</span>
            </div>

            <p className="text-xs text-uc-gray-300 leading-relaxed mb-8">{active.description}</p>

            {/* Draft Clause Sections */}
            <div className="space-y-6 mb-8">
              {active.draftClauses.map((clause, i) => (
                <div key={i} className="border border-white/[0.04] rounded-lg p-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    {clause.heading}
                  </h4>
                  <pre className="text-[11px] text-uc-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {clause.text}
                  </pre>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
              <a
                href="mailto:legal@undercenter.com?subject=Legal-Ready%20Version%20Request"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-black transition"
                style={{ backgroundColor: active.color }}
              >
                <Mail size={12} /> Request Legal-Ready Version
              </a>
              <Link
                href="/legal/disclaimer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 text-xs text-white hover:border-white/20 transition"
              >
                <Eye size={12} /> View Disclaimer
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Standard Clauses Reference ── */}
        <div className="mb-16">
          <button
            onClick={() => setShowStandardClauses(!showStandardClauses)}
            className="w-full glass rounded-xl p-5 border border-white/[0.06] flex items-center justify-between hover:border-white/10 transition"
          >
            <div className="flex items-center gap-3">
              <Scale size={18} className="text-uc-cyan" />
              <div className="text-left">
                <h3 className="text-sm font-bold text-white">Standard Contract Clauses Reference</h3>
                <p className="text-[10px] text-uc-gray-500">
                  Common legal provisions applicable to all NIL agreements — educational reference only
                </p>
              </div>
            </div>
            {showStandardClauses ? <ChevronUp size={16} className="text-uc-gray-400" /> : <ChevronDown size={16} className="text-uc-gray-400" />}
          </button>

          {showStandardClauses && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 space-y-3"
            >
              {STANDARD_CLAUSES.map((clause, i) => (
                <div key={i} className="glass rounded-lg border border-white/[0.04] overflow-hidden">
                  <button
                    onClick={() => setExpandedClause(expandedClause === i ? null : i)}
                    className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                  >
                    <span className="text-xs font-bold text-white">{clause.title}</span>
                    {expandedClause === i ? <ChevronUp size={14} className="text-uc-gray-400" /> : <ChevronDown size={14} className="text-uc-gray-400" />}
                  </button>
                  {expandedClause === i && (
                    <div className="px-5 pb-4">
                      <pre className="text-[11px] text-uc-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {clause.text}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Process */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How to Use These Draft Structures</h2>
            <p className="text-sm text-uc-gray-400">From educational reference to executed agreement</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Review Structure", desc: "Read the draft clauses to understand common provisions for your deal type.", color: "#00C2FF" },
              { step: "02", title: "Identify Requirements", desc: "Note which sections apply and what placeholders need deal-specific terms.", color: "#00FF88" },
              { step: "03", title: "Engage Counsel", desc: "Have a licensed attorney customize, finalize, and approve the agreement for your situation.", color: "#FFB800" },
              { step: "04", title: "Execute & Disclose", desc: "Sign the attorney-approved agreement and file required disclosures with your institution.", color: "#A855F7" },
            ].map((s) => (
              <div key={s.step} className="glass rounded-xl p-5 border border-white/[0.04]">
                <span className="text-2xl font-black font-mono" style={{ color: s.color }}>{s.step}</span>
                <h4 className="text-sm font-bold text-white mt-2 mb-1">{s.title}</h4>
                <p className="text-[11px] text-uc-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dna size={14} className="text-uc-cyan" />
            <span className="text-xs font-bold tracking-[0.15em] uppercase gradient-text-dna">Under Center</span>
          </div>
          <p className="text-[10px] text-uc-gray-600">Draft clause structures are for educational purposes only</p>
          <p className="text-[10px] text-uc-gray-600">Not attorney-reviewed · Must be customized by licensed legal counsel</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <Link href="/legal/terms" className="text-[9px] text-uc-gray-600 hover:text-uc-cyan transition">Terms</Link>
            <span className="text-uc-gray-700">·</span>
            <Link href="/legal/privacy" className="text-[9px] text-uc-gray-600 hover:text-uc-cyan transition">Privacy</Link>
            <span className="text-uc-gray-700">·</span>
            <Link href="/legal/disclaimer" className="text-[9px] text-uc-gray-600 hover:text-uc-cyan transition">Disclaimer</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
