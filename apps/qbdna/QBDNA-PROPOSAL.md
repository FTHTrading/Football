# Under Center — Verified Quarterback Identity Platform

**Date:** March 2, 2026  
**Live demo:** [undercenter.netlify.app](https://undercenter.netlify.app)

---

Hey — I saw your post. You described three screens: a cinematic homepage, a premium QB profile, and a shareable verified card.

I've already built all three. Not mockups — a live, working platform with real data architecture underneath.

---

## The Three Screens (Live)

### 1. Cinematic Homepage  
[undercenter.netlify.app](https://undercenter.netlify.app)  
Stadium photography hero · Overtime-scale typography · Featured athlete editorial with radial metric gauges · Social card showcase with staggered hover animations · Scroll-reveal sections

### 2. Premium Athlete Profile  
[/athlete/6](https://undercenter.netlify.app/athlete/6) — Andre Mitchell · 5-star · IMG Academy  
Cinematic photo header · Profile photo overlay · Verified badge · Star rating · Genome Activation Index (GAI) ring with tier/archetype classification · 6 radial gauges · Key stat cards · Percentile bar rankings · QB Genome Decoded (DNA helix visualization) · NFL pro comparison panel · Film review embed · Recruiting timeline · NIL valuation · Digital collectible preview · Card generation CTA

### 3. Verified Card Generator  
[/card-generator](https://undercenter.netlify.app/card-generator)  
3 themes (Dark / Holographic / DNA) · Athlete selector · Live preview · QR code linking to verified profile · Exports at 1080×1350px (Instagram-optimized PNG) · Genome score integration on DNA theme

---

## What's Underneath the Screens

This isn't three pages. It's a component system:

| Component | Purpose |
|-----------|---------|
| `RadialGauge` | Circular metric visualization (velocity, mechanics, accuracy) |
| `PercentileBar` | Horizontal ranking bars with animated fills |
| `ComparisonPanel` | Side-by-side athlete vs. NFL pro metric overlay |
| `DNAHelix` | Animated double-helix SVG with configurable base pairs |
| `CardCanvas` | Exportable card renderer (3 themes, QR, download-as-PNG) |
| `SocialGraphic` | 7 templates (commitment, offer, ranking, gameday, verified, stat-showcase, story) |
| `NILValuation` | Market value estimation from metrics + offers + rating |
| `RecruitingTimeline` | Visual timeline of offers, visits, commitments |
| `VideoOverlayPlayer` | Film embed with metric overlay |
| `VerifiedBadge` | Animated verification indicator |
| `StarRating` | 5-star recruiting rating display |
| `GenomeActivationIndex` | Composite score: Base × Activation × Growth × Fit, normalized 0–99 |

19 components total. All composable. All data-bound. All theme-aware.

---

## The Data Layer

Every visualization resolves to a single computation: the **Genome Activation Index (GAI)**.

```
GAI = Base × Activation × (1 + Growth) × Fit
```

Four coefficients:
- **Base Genome Score** — raw trait expression (velocity, release, spin, mechanics, accuracy, decision speed)
- **Activation Multiplier** — in-game performance intensity
- **Growth Delta** — trajectory over time (ascending / stable / declining)
- **Fit Coefficient** — institutional program alignment

This isn't decoration. It's a **data visualization language** — velocity color systems, release-speed bars, spin-rate rings, mechanics grades, accuracy percentiles — designed to make QB data feel premium, legible, and shareable.

---

## What I'm Proposing

You need three screens. I've built three screens.

But more importantly — you need a **system** underneath those screens. A component library. A data model. A visualization language. An identity architecture that scales from one QB to a thousand.

I can translate this into Webflow with your brand direction, or we can discuss which approach gives you the most leverage long-term.

Either way — the architecture is already proven. Happy to walk through it live.

**Kevan**

---

**Live demo:** [undercenter.netlify.app](https://undercenter.netlify.app)  
**Profile:** [undercenter.netlify.app/athlete/6](https://undercenter.netlify.app/athlete/6)  
**Card generator:** [undercenter.netlify.app/card-generator](https://undercenter.netlify.app/card-generator)

