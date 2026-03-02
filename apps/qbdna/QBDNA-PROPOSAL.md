# Under Center — Platform Proposal for QBDNA

**Prepared by:** FTH Trading / NIL33  
**Date:** March 2, 2026  
**Live Demo:** [undercenter-demo.netlify.app](https://undercenter-demo.netlify.app)

---

## You Don't Need a Webflow Designer. We Already Built This.

QBDNA is looking for a Webflow designer to build 3 screens — a homepage, an athlete profile, and a shareable card. We already built a **full-stack Next.js platform** with **61 pages**, **16 custom components**, a proprietary **Genome Activation Index scoring engine**, and **NIL compliance infrastructure** — purpose-built for the exact use case you described.

This isn't a mockup. It's a working product. Here's what you get.

---

## What You Asked For vs. What We Built

| QBDNA Job Posting | What Already Exists |
|---|---|
| "Dark, cinematic homepage" | **703-line homepage** with 3D WebGL hero tunnel, animated metrics, scroll-reveal sections, partner logos, training locations, and 5-step onboarding flow |
| "Premium athlete profile page" | **649-line athlete profile** with verified metrics, Genome Activation Index (GAI), radial gauges, percentile rankings, NFL player comparisons, star ratings, recruiting timeline, film player, and NIL valuation |
| "Shareable verified card graphic" | **Card generator** with 3 themes (Dark, Holographic, DNA) — selectable per athlete, downloadable as image, built for Instagram/Twitter sharing |
| "Webflow design and build" | **Full Next.js 16 app** — server-rendered, static-exportable, TypeScript, Tailwind 4, Prisma database-ready, Stripe-ready, NextAuth-ready — infinitely more powerful than Webflow |
| "3 screens for MVP" | **61 pre-built pages** across 30+ routes — not an MVP, a full platform |

---

## Live Demo — What To Click

### Homepage
**[undercenter-demo.netlify.app](https://undercenter-demo.netlify.app)**  
Dark cinematic entrance with animated velocity/release/accuracy metrics, scroll-activated sections, "What Verified Means" explainer cards, verified social cards preview, 2026 prospect grid, 5-step How It Works flow, training locations, partner showcase, and full CTA footer.

### Athlete Profile (click any QB)
**[/athlete/6](https://undercenter-demo.netlify.app/athlete/6)** — Andre Mitchell (5-star, IMG Academy)  
**[/athlete/1](https://undercenter-demo.netlify.app/athlete/1)** — Jaxon Smith (4.5-star, Westlake HS)  
- Verified badge + star rating
- Genome Activation Index (GAI) with tier, archetype, growth trajectory
- 6 radial gauge metrics: Velocity, Release, Spin Rate, Mechanics, Accuracy, Decision Speed
- NFL comparison panel (vs. Trevor Lawrence, Patrick Mahomes, etc.)
- Percentile bars with animation
- Film room embed
- NIL valuation section
- Recruiting timeline with offers
- Shareable profile link

### Verified Card Generator
**[/card-generator](https://undercenter-demo.netlify.app/card-generator)**  
Select any verified athlete, choose Dark / Holographic / DNA theme, download card as image. Built for social sharing — Instagram stories, Twitter posts, college coach DMs.

### Quarterback Search & Discovery
**[/search](https://undercenter-demo.netlify.app/search)**  
Filter by name, grad year, verified status, minimum velocity. Grid view with mini-profiles linking to full athlete pages.

---

## What Else Is Already Built (Beyond the 3 Screens)

| Route | Description |
|---|---|
| `/leaderboard` | Ranked QB leaderboard with sortable metrics |
| `/compare` | Side-by-side athlete comparison tool |
| `/combine` | Virtual combine experience with mock evaluation |
| `/genome` | Full Genome Activation Index deep-dive |
| `/film-room` | Video analysis and film review |
| `/highlights` | Highlight reels |
| `/stats` | Statistical breakdowns and analytics |
| `/training` | Training program information |
| `/draft` | Draft board / mock draft experience |
| `/scout` | Scouting reports and evaluations |
| `/gameday` | Game day live experience |
| `/nil` | Full NIL hub with marketplace, compliance, agreements, resources |
| `/pricing` | Tiered pricing with Stripe integration ready |
| `/coach` | Coach portal |
| `/dashboard` | Athlete dashboard |
| `/admin` | Admin panel with auth protection |
| `/docs/*` | 7 documentation pages (platform overview, capabilities, design system, etc.) |
| `/community` | Community features |
| `/awards` | Awards & recognition |
| `/collectibles` | Digital collectibles |
| `/lab` | Experimental features |
| `/map` | Geographic visualization |
| `/board` | Board/advisory view |
| `/portal` | Portal entry |

---

## The Backend — NIL33 Scoring Engine

This isn't just a front-end. The platform is powered by **NIL33**, our proprietary NIL infrastructure layer:

### Genome Activation Index (GAI)
A deterministic scoring engine that evaluates QB prospects across 6 gene dimensions:
- **VEL** — Arm velocity (throw speed percentile)
- **REL** — Release sequence (release time efficiency)
- **SPN** — Spin rate (spiral efficiency)
- **MCH** — Mechanics grade (technique evaluation)
- **ACC** — Accuracy (completion probability)
- **DCS** — Decision speed (processing speed under pressure)

Each prospect gets a **GAI score (0–99)**, a **tier classification** (Elite, Pro-Ready, Developmental, etc.), an **archetype** (Gunslinger, Field General, Dual-Threat, etc.), and a **growth trajectory** (ascending, stable, declining).

### What QBDNA Can Plug Into
- **Wilson QBX data → GAI engine** — Feed your QBX metrics directly into our scoring model
- **NIL compliance** — Automated compliance verification for every deal
- **Valuation engine** — Score the fair market value of any QB prospect
- **Verified badge system** — Cryptographic verification of athlete metrics
- **API-ready** — Prisma schema, database models, and API routes already scaffolded

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + 520-line design system |
| 3D/Animation | Three.js / React Three Fiber, Framer Motion, GSAP |
| Database | Prisma ORM (PostgreSQL-ready) |
| Auth | NextAuth.js (credential + OAuth) |
| Payments | Stripe (checkout + webhooks scaffolded) |
| Analytics | PostHog |
| Charts | Recharts |
| Video | React Player |
| Cards | html-to-image (downloadable card export) |
| QR Codes | qrcode.react |
| Themes | 5 color themes (Default, Midnight, Slate, Ivory, Ember) |

**This is not Webflow.** This is a production-grade platform built with the same stack used by Vercel, Stripe, and Linear.

---

## What This Means for QBDNA

### Option A: Full Platform License
We hand you the complete platform. You add your athletes, connect your QBX data, configure your branding, and launch. We provide:
- Full source code access
- NIL33 backend integration
- Custom domain setup
- Ongoing technical support
- Feature development partnership

### Option B: White-Label Partnership
We operate the platform infrastructure. QBDNA focuses on coaching, evaluation, and athlete acquisition. Revenue share on subscriptions and NIL deals processed through the platform.

### Option C: Backend API Only
QBDNA hires their own front-end team (Webflow or otherwise). We provide the NIL33 scoring engine, GAI computation, and compliance layer as an API service. QBDNA builds their own UI on top.

---

## Why This Is Better Than Webflow

| | Webflow | Under Center Platform |
|---|---|---|
| Pages | 3 (from scratch) | 61 (already built) |
| Scoring Engine | None | Genome Activation Index |
| Database | None | Prisma + PostgreSQL |
| Auth | None | NextAuth (admin + athlete roles) |
| Payments | None | Stripe integration |
| NIL Compliance | None | Full compliance layer |
| 3D Animations | Not possible | Three.js WebGL hero |
| Card Export | Not possible | html-to-image download |
| API Routes | Not possible | Next.js API routes |
| Themes | Manual CSS | 5 themes, one-click switch |
| Mobile | Responsive | Responsive + PWA-ready |
| Performance | Webflow runtime | Static export, CDN-edge |
| Ownership | Webflow lock-in | Full source code |

---

## Contact

**Partnership Inquiries:**  
partnerships@nil33.com

**Platform Demo:**  
[undercenter-demo.netlify.app](https://undercenter-demo.netlify.app)

**NIL33 Infrastructure:**  
[nil33.com](https://nil33.com)

---

*Under Center is a product of FTH Trading. NIL33 is the infrastructure layer powering verified athlete valuations, compliance, and scoring.*
