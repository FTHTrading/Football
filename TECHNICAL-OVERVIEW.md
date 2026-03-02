# Under Center — Technical Overview

**Version:** 0.1.0  
**Stack:** Next.js 16 / React 19 / TypeScript / Tailwind 4 / Prisma 7 / Stripe / PostHog / Upstash Redis  
**Status:** Production-ready (pending database connection)

---

## 1. Security Architecture

### Rate Limiting (`lib/rate-limit.ts`)
- **Standard limiter:** 10 requests / 10 seconds (sliding window) — general API protection
- **Strict limiter:** 5 requests / 60 seconds — applied to auth and checkout routes
- **Provider:** Upstash Redis (serverless-compatible, edge-ready)
- **Graceful degradation:** If Upstash is not configured or Redis is down, requests proceed without blocking
- **Response headers:** `X-RateLimit-Remaining`, `Retry-After` on 429 responses

### Middleware Route Protection (`middleware.ts`)
- **`/admin/*`:** Requires valid JWT + `ADMIN` role. Non-admin users redirected to `/dashboard`. Unauthenticated users redirected to `/login`.
- **`/dashboard/*`:** Requires valid JWT (any role). Unauthenticated users redirected to `/login` with callback URL preserved.
- **Authentication:** next-auth JWT validation via `getToken()`
- **Cannot be bypassed:** Matcher config `["/admin/:path*", "/dashboard/:path*"]` ensures all sub-paths are covered.

### Stripe Payment Security (`app/api/checkout/route.ts`, `app/api/webhook/route.ts`)
- **Checkout:** Zod-validated input (`checkoutSchema`), strict rate limiting, structured logging
- **Webhook:** `stripe.webhooks.constructEvent()` verifies signature against `STRIPE_WEBHOOK_SECRET`
- **Missing signature:** Returns 400 immediately
- **Missing env vars:** Returns 500 with logged error, no crash

### Input Validation (`lib/validations.ts`)
Zod schemas for all critical data flows:
| Schema | Protects |
|---|---|
| `checkoutSchema` | `/api/checkout` POST body |
| `athleteProfileSchema` | Athlete profile creation/update |
| `athleteMetricsSchema` | Metric submission |
| `verificationActionSchema` | Admin verification actions |
| `searchFiltersSchema` | Search queries |
| `loginSchema` | Login endpoint |
| `contactSchema` | Contact/lead capture |

### Environment Validation (`lib/env.ts`)
- Zod schema validates all env vars at runtime
- **Required:** `NEXTAUTH_SECRET`
- **Optional (graceful):** `DATABASE_URL`, Stripe keys, PostHog keys, Upstash keys
- **Dev mode:** Warns but continues. **Prod mode:** Throws and halts.

### Error Boundary (`components/ErrorBoundary.tsx`)
- Global React error boundary wrapping all routes (via `layout.tsx`)
- Styled fallback UI with shield icon, error message, and reload button
- Production-safe: no stack traces exposed to users
- Catches render errors across the entire component tree

---

## 2. Analytics Tracking (`components/PostHogProvider.tsx`)

### Initialization
- PostHog SDK initialized client-side when `NEXT_PUBLIC_POSTHOG_KEY` is set
- Auto-captures: pageviews, page leaves, element clicks
- Identified-only person profiles
- Debug mode in development

### Custom Events Tracked
| Event | Trigger |
|---|---|
| `profile_viewed` | Athlete profile page loaded |
| `card_downloaded` | Any card download |
| `verified_card_downloaded` | Verified badge card download |
| `verification_started` | User begins verification flow |
| `verification_completed` | Admin completes verification |
| `film_played` | Film room video started |
| `cta_clicked` | CTA button interaction |
| `search_performed` | Search query executed |
| `filter_used` | Coach filter applied |
| `nil_deal_created` | NIL deal recorded |

---

## 3. Logging Strategy (`lib/logger.ts`)

### Core Logger
- **Engine:** Pino (structured JSON logging)
- **Prod:** `info` level, JSON output (machine-parseable for log aggregation)
- **Dev:** `debug` level, stdout

### Domain Loggers
| Logger | Module Tag | Use Case |
|---|---|---|
| `authLogger` | `auth` | Login, signup, token events |
| `stripeLogger` | `stripe` | Payment, webhook, checkout events |
| `adminLogger` | `admin` | Admin actions, verification decisions |
| `analyticsLogger` | `analytics` | Tracking events, data pipeline |

### Convenience API
`log.info()`, `log.warn()`, `log.error()`, `log.debug()`, `log.auth()`, `log.stripe()`, `log.admin()`, `log.analytics()`

---

## 4. Role-Based Access Control

### Roles (Prisma schema)
| Role | Access Level |
|---|---|
| `ATHLETE` | Profile, dashboard, stats |
| `COACH` | Search, compare, film room, scout tools |
| `PARENT` | Profile view, offers |
| `ADMIN` | Full platform access, verification controls |

### Enforcement
- **Server-side:** Middleware JWT validation with role check
- **Client-side:** Conditional rendering based on session role
- **Database:** `Role` enum on `User` model, default `ATHLETE`

---

## 5. NIL Readiness

### Current State
- **NIL Hub:** `/nil` — NIL Infrastructure & Compliance Center
- **NIL Marketplace:** `/nil/marketplace` — public NIL marketplace with valuations
- **NIL Compliance:** `/nil/compliance` — 50-state law matrix + compliance guide
- **NIL Agreements:** `/nil/agreements` — agreement template library
- **NIL Resources:** `/nil/resources` — education center
- **NIL Dashboard:** `/dashboard/nil` — dedicated NIL management page
- **NIL Offers:** `/offers` — offer tracking
- **NIL Valuation:** Inline in marketplace page — exponential formula based on composite score
- **Analytics:** `nil_deal_created` event tracked via PostHog
- **Data Model:** Prisma schema includes `NilProfile`, `NilDeal`, `StateLaw`, `InstitutionRule`, `ComplianceRecord`, `ContractVersion`

### Ready For
- Brand partnership matching
- Deal flow management
- Revenue tracking per athlete
- Compliance logging

---

## 6. AI Readiness

### Current Infrastructure
- `lib/ai/index.ts` — AI module entry point
- `lib/ai/image.ts` — Image generation pipeline
- `lib/ai/video.ts` — Video analysis pipeline
- `.env.example` includes `OPENAI_API_KEY`, `STABILITY_API_KEY`, `REPLICATE_API_TOKEN`

### Ready For
- AI-powered scouting reports
- Automated highlight analysis
- Performance prediction models
- Natural language search

---

## 7. Database Architecture

### ORM: Prisma 7 (PostgreSQL)
- Schema: `prisma/schema.prisma` (272 lines)
- Config: `prisma.config.ts`
- Models: `User`, `Athlete`, `AthleteMetrics`, `VerificationCard`, `RecruitingEvent`, `NilDeal`, `Film`, `Session`, `Account`
- Singleton pattern ready in `lib/prisma.ts` (activate after `prisma generate`)

---

## 8. Production Hardening Status

| Component | Status | Notes |
|---|---|---|
| Rate limiting (standard) | **ACTIVE** | 10 req/10s, Upstash Redis |
| Rate limiting (strict) | **ACTIVE** | 5 req/60s on auth/checkout |
| Middleware auth | **ACTIVE** | JWT + role enforcement |
| Stripe signature verification | **ACTIVE** | `constructEvent()` |
| Zod input validation | **ACTIVE** | All POST routes |
| Environment validation | **ACTIVE** | Zod schema, fail-fast |
| Error boundary | **ACTIVE** | Global, styled fallback |
| Structured logging | **ACTIVE** | Pino, domain loggers |
| PostHog analytics | **ACTIVE** | 10 custom events |
| Prisma singleton | **READY** | Activate after DB setup |
| HTTPS enforcement | **VERCEL** | Automatic on Vercel |
| CORS | **NEXT.JS** | Default API route handling |

---

## 9. Route Map

### Public Routes
`/`, `/login`, `/pricing`, `/docs/*`, `/search`, `/athlete/[id]`, `/profile/[id]`, `/nil`, `/offers`, `/combine`, `/community`, `/leaderboard`, `/stats`, `/map`, `/highlights`, `/training`, `/gameday`, `/genome`, `/lab`, `/film-room`, `/scout`, `/compare`, `/board`, `/awards`, `/collectibles`, `/card-generator`, `/coach`, `/draft`, `/portal`

### Protected Routes (Auth Required)
`/dashboard`, `/dashboard/nil`

### Admin Routes (Admin Role Required)
`/admin`

### API Routes (Server-Side)
`/api/checkout` (POST — Stripe checkout), `/api/webhook` (POST — Stripe webhook)

---

*Generated: March 1, 2026*  
*Build Status: PASSING (Next.js 16.1.6 Turbopack)*
