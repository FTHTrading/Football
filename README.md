# Under Center — The Verified Quarterback Index

> "We're not building a site. We're building a QB identity engine that feels like Unreal Engine met Webflow and had a first-round draft pick."

A cinematic, data-driven platform for high school quarterbacks to get verified, build their identity, and connect with college programs — making On3 look like a fax machine.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + custom design tokens |
| 3D | Three.js via @react-three/fiber + drei |
| Animation | Framer Motion + GSAP |
| Charts | Recharts (radial gauges, percentile bars) |
| State | Zustand |
| Auth | NextAuth.js (credentials provider) |
| Database | Prisma + PostgreSQL |
| Payments | Stripe (checkout + webhooks) |
| Card Export | html-to-image + qrcode.react |
| AI (Future) | Stubs ready for OpenAI / Stability / Replicate |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/under-center.git
cd under-center
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `DATABASE_URL`, `NEXTAUTH_SECRET`, and Stripe keys in `.env.local`.

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
under-center/
├── app/
│   ├── page.tsx                    # Cinematic homepage — "Enter the Tunnel"
│   ├── layout.tsx                  # Root layout + Navigation
│   ├── globals.css                 # Design system tokens
│   ├── athlete/[id]/page.tsx       # Athlete command center profile
│   ├── card-generator/page.tsx     # Shareable verified card builder
│   ├── search/page.tsx             # Coach discovery / filter engine
│   ├── dashboard/
│   │   ├── page.tsx                # Athlete dashboard
│   │   └── nil/page.tsx            # NIL marketplace module
│   ├── admin/page.tsx              # Admin verification control panel
│   └── api/
│       ├── auth/[...nextauth]/route.ts  # NextAuth credentials
│       ├── checkout/route.ts            # Stripe checkout session
│       └── webhook/route.ts             # Stripe webhook handler
├── components/
│   ├── Navigation.tsx              # Fixed glass nav + mobile menu
│   ├── HeroTunnel.tsx              # 3D stadium tunnel (Three.js)
│   ├── MetricCard.tsx              # Animated stat counters
│   ├── RadialGauge.tsx             # Circular percentile gauge
│   ├── PercentileBar.tsx           # Horizontal fill bar
│   ├── VerifiedBadge.tsx           # Pulsing verified shield
│   ├── StarRating.tsx              # 5-star animated display
│   ├── RecruitingTimeline.tsx      # Vertical offer/visit timeline
│   ├── ComparisonPanel.tsx         # Athlete vs NFL pro split-screen
│   ├── VideoOverlayPlayer.tsx      # Film player with HUD overlay
│   └── CardCanvas.tsx              # Card renderer + PNG export
├── lib/
│   ├── utils.ts                    # cn(), formatters, grading fns
│   ├── animations.ts               # Reusable Framer Motion variants
│   ├── store.ts                    # Zustand global state
│   ├── prisma.ts                   # Prisma client singleton
│   ├── placeholder-data.ts         # 6 demo athletes with full metrics
│   └── ai/
│       ├── index.ts                # AI service re-exports
│       ├── video.ts                # Video enhancement stubs
│       └── image.ts                # Image stylization stubs
└── prisma/
    └── schema.prisma               # Full data model (14 tables)
```

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `uc-black` | `#0A0A0A` | Page background |
| `uc-panel` | `#111111` | Cards, panels |
| `uc-cyan` | `#00C2FF` | Primary accent, CTA glow |
| `uc-silver` | `#C0C0C0` | Secondary text, badges |
| `uc-green` | `#00FF88` | Positive metrics |
| `uc-red` | `#FF3B5C` | Alerts, revoke actions |

**Typography:** Inter (body) + JetBrains Mono (metrics/data)

**Effects:** `.glass` (frosted panels), `.glow` (cyan shadow), `.gradient-text` (cyan→blue), `.light-sweep` (holographic sweep)

---

## Pages

| Route | Description |
|---|---|
| `/` | Cinematic homepage with 3D tunnel, problem statement, features, stats bar |
| `/athlete/[id]` | Full profile — metrics, film, recruiting timeline, NFL comparison, share CTA |
| `/card-generator` | Build & download shareable verified QB cards (dark/holographic themes) |
| `/search` | Coach-facing filter engine — search by name, grad year, velocity, verified status |
| `/dashboard` | Athlete home — profile completion, verification payment CTA, action cards |
| `/dashboard/nil` | NIL marketplace preview — brand interest, collectibles, analytics, valuation |
| `/admin` | Verification control — approve/revoke athletes, view metrics, manage status |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@undercenter.com` | `admin123` |
| Athlete | `jaxon@undercenter.com` | `demo123` |

---

## Stripe Integration

The "Get Verified" flow charges **$149** via Stripe Checkout.

- `POST /api/checkout` — Creates a checkout session
- `POST /api/webhook` — Handles `checkout.session.completed` → marks athlete as PENDING verification

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## Roadmap

- [x] Phase 1 — Cinematic front-end + verified identity system
- [ ] Phase 2 — Full auth flow, Prisma migrations, admin CRUD
- [ ] Phase 3 — AI video enhancement + image stylization
- [ ] Phase 4 — NIL marketplace (brand matching, deal tracking)
- [ ] Phase 5 — Web3 collectible cards + on-chain verification
- [ ] Phase 6 — Mobile app (React Native / Expo)

---

## License

Proprietary — Under Center LLC. All rights reserved.
