"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section, { SectionHeader } from "../../components/Section";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import CodePreview, { DataRow, DataDivider } from "../../components/CodePreview";
import { ScoreBar } from "../../components/ScoreDisplay";

/* ═══ Real athletes — multi-sport NIL data ═══ */
const ATHLETES = [
  {
    id: "arch-manning",
    name: "Arch Manning",
    sport: "Football",
    pos: "QB",
    school: "Texas Longhorns",
    state: "Texas",
    conference: "SEC",
    year: "Junior",
    agency: "Independent (family-managed)",
    collective: "Texas One Fund",
    rating: 5.0,
    image: "/images/athlete-action.png",
    profileImage: "/images/athlete-profile.png",
    socialFollowers: "1.2M",
    cardStats: [
      { label: "Arm", value: "62 MPH" },
      { label: "Release", value: "0.38s" },
      { label: "Acc", value: "91%" },
      { label: "Comp", value: "68%" },
    ],
    detailMetrics: [
      { label: "Arm Velocity", value: "62.1 MPH" },
      { label: "Release Time", value: "0.38s" },
      { label: "Accuracy", value: "91%" },
      { label: "Completion Rate", value: "68.4%" },
      { label: "TD/INT Ratio", value: "3.2:1" },
      { label: "QBR", value: "87.6" },
      { label: "Pass Yards/Game", value: "284.3" },
      { label: "Rush Yards/Game", value: "18.7" },
      { label: "Pocket Presence", value: "93/100" },
      { label: "Decision Speed", value: "91/100" },
    ],
    nil: { composite: 96, low: 3200000, high: 4500000, social: 91, athletic: 97, market: 99, brand: 96 },
    deals: ["EA Sports", "TikTok", "Panini America", "C4 Energy"],
    bio: "Nephew of Peyton and Eli Manning. #1 QB recruit in the 2023 class out of Isidore Newman School (LA). Texas\u2019s franchise quarterback with generational arm talent and football IQ. The Manning bloodline and Austin media market create one of the highest NIL ceilings in college sports history.",
    receiptId: "NIL33-2026-00101",
    signature: "ed25519:a4f8c3b7e9d1f6a2c8b4e7d3f9a1c5b8d2e6f4a7c9b3e1d5f8a2c4b6e9d7f2",
  },
  {
    id: "jeremiah-smith",
    name: "Jeremiah Smith",
    sport: "Football",
    pos: "WR",
    school: "Ohio State Buckeyes",
    state: "Ohio",
    conference: "Big Ten",
    year: "Sophomore",
    agency: "Klutch Sports Group",
    collective: "The 1870 Society",
    rating: 5.0,
    image: "/images/qb4.png",
    profileImage: "/images/qb4.png",
    socialFollowers: "2.1M",
    cardStats: [
      { label: "40-Yd", value: "4.39s" },
      { label: "Rec", value: "72" },
      { label: "YPG", value: "95.2" },
      { label: "TDs", value: "14" },
    ],
    detailMetrics: [
      { label: "40-Yard Dash", value: "4.39s" },
      { label: "Receptions", value: "72" },
      { label: "Yards/Game", value: "95.2" },
      { label: "Touchdowns", value: "14" },
      { label: "Catch Rate", value: "78.4%" },
      { label: "YAC Average", value: "8.7 yds" },
      { label: "Route Running", value: "95/100" },
      { label: "Contested Catches", value: "18" },
      { label: "Separation Score", value: "94/100" },
      { label: "Hands Rating", value: "96/100" },
    ],
    nil: { composite: 94, low: 4200000, high: 5600000, social: 92, athletic: 98, market: 93, brand: 91 },
    deals: ["Nike", "Beats by Dre", "Oakley", "Chipotle"],
    bio: "Generational wide receiver who shattered Ohio State freshman records with 72 catches, 1,315 yards, and 14 touchdowns. 6\u20193\u201d, 215 lbs with elite body control and contested-catch ability. The most complete WR prospect in a decade. Klutch Sports management amplifies an already massive market presence.",
    receiptId: "NIL33-2026-00102",
    signature: "ed25519:b7c4d9e2f1a8b3c6d5e9f2a4b7c1d8e3f6a9b2c5d4e7f1a3b6c8d2e5f9a1c4",
  },
  {
    id: "livvy-dunne",
    name: "Livvy Dunne",
    sport: "Gymnastics",
    pos: "All-Around",
    school: "LSU Tigers",
    state: "Louisiana",
    conference: "SEC",
    year: "Senior",
    agency: "WME",
    collective: "Bayou Traditions",
    rating: 5.0,
    image: "/images/qb3.png",
    profileImage: "/images/qb3.png",
    socialFollowers: "12.5M",
    cardStats: [
      { label: "AA", value: "39.625" },
      { label: "Vault", value: "9.90" },
      { label: "Bars", value: "9.85" },
      { label: "Floor", value: "9.95" },
    ],
    detailMetrics: [
      { label: "All-Around Score", value: "39.625" },
      { label: "Vault", value: "9.900" },
      { label: "Uneven Bars", value: "9.850" },
      { label: "Balance Beam", value: "9.875" },
      { label: "Floor Exercise", value: "9.950" },
      { label: "Difficulty Score", value: "5.4" },
      { label: "Execution Average", value: "9.65" },
      { label: "Season Consistency", value: "96%" },
      { label: "Competition Wins", value: "8" },
      { label: "National Ranking", value: "#4" },
    ],
    nil: { composite: 95, low: 3800000, high: 5200000, social: 99, athletic: 88, market: 95, brand: 99 },
    deals: ["Vuori", "American Eagle", "Grubhub", "Turn", "Forever 21", "Planet Fitness"],
    bio: "The most-followed NCAA athlete on social media with 12.5M+ combined followers across TikTok and Instagram. Redefined the NIL landscape for women\u2019s athletics. LSU gymnast with elite scores across all four apparatus. Her social reach and brand alignment metrics are unmatched in collegiate sports.",
    receiptId: "NIL33-2026-00103",
    signature: "ed25519:c9d3e7f1a5b2c8d6e4f9a3b1c7d5e2f8a6b4c9d1e3f7a2b5c8d4e6f1a9b3c2",
  },
  {
    id: "juju-watkins",
    name: "JuJu Watkins",
    sport: "Basketball",
    pos: "Guard",
    school: "USC Trojans",
    state: "California",
    conference: "Big Ten",
    year: "Junior",
    agency: "Octagon",
    collective: "\u2014",
    rating: 5.0,
    image: "/images/qb5.png",
    profileImage: "/images/qb5.png",
    socialFollowers: "1.8M",
    cardStats: [
      { label: "PPG", value: "27.1" },
      { label: "APG", value: "3.8" },
      { label: "SPG", value: "2.4" },
      { label: "FG%", value: "46.2" },
    ],
    detailMetrics: [
      { label: "Points/Game", value: "27.1" },
      { label: "Assists/Game", value: "3.8" },
      { label: "Rebounds/Game", value: "5.6" },
      { label: "Field Goal %", value: "46.2%" },
      { label: "3-Point %", value: "34.8%" },
      { label: "Free Throw %", value: "81.5%" },
      { label: "Steals/Game", value: "2.4" },
      { label: "Minutes/Game", value: "34.2" },
      { label: "PER", value: "28.9" },
      { label: "Win Shares", value: "8.4" },
    ],
    nil: { composite: 90, low: 1800000, high: 2800000, social: 89, athletic: 95, market: 88, brand: 87 },
    deals: ["Nike", "Gatorade", "Beats by Dre"],
    bio: "USC women\u2019s basketball phenom who set school scoring records as a true freshman with 27.1 PPG. Named Naismith Player of the Year finalist. A transcendent talent driving massive visibility for women\u2019s basketball. L.A. market multiplier and Nike partnership anchor her brand value.",
    receiptId: "NIL33-2026-00104",
    signature: "ed25519:d2e6f9a3b7c1d8e4f2a5b9c3d7e1f6a8b4c2d9e5f3a1b7c6d4e8f2a9b3c5d1",
  },
  {
    id: "bryce-underwood",
    name: "Bryce Underwood",
    sport: "Football",
    pos: "QB",
    school: "Michigan Wolverines",
    state: "Michigan",
    conference: "Big Ten",
    year: "Freshman",
    agency: "CAA Sports",
    collective: "Champions Circle",
    rating: 5.0,
    image: "/images/qb2.png",
    profileImage: "/images/qb2.png",
    socialFollowers: "680K",
    cardStats: [
      { label: "Arm", value: "61 MPH" },
      { label: "Release", value: "0.36s" },
      { label: "Acc", value: "89%" },
      { label: "Comp", value: "66%" },
    ],
    detailMetrics: [
      { label: "Arm Velocity", value: "61.2 MPH" },
      { label: "Release Time", value: "0.36s" },
      { label: "Accuracy", value: "89%" },
      { label: "Completion Rate", value: "66.1%" },
      { label: "TD/INT Ratio", value: "2.8:1" },
      { label: "QBR", value: "82.4" },
      { label: "Pass Yards/Game", value: "258.6" },
      { label: "Rush Yards/Game", value: "28.4" },
      { label: "Pocket Presence", value: "88/100" },
      { label: "Decision Speed", value: "87/100" },
    ],
    nil: { composite: 93, low: 8500000, high: 12000000, social: 78, athletic: 96, market: 97, brand: 88 },
    deals: ["Gatorade", "Old Spice"],
    bio: "#1 overall recruit in the 2025 class out of Belleville High School (MI). Flipped from LSU to Michigan in a landmark NIL deal reportedly worth $10.5M over four years through the Champions Circle collective. 6\u20194\u201d, 210 lbs with a cannon arm and elite mobility. The deal that changed NIL forever.",
    receiptId: "NIL33-2026-00105",
    signature: "ed25519:e4f8a2b6c9d3e7f1a5b2c8d6e4f9a3b1c7d5e2f8a6b4c9d1e3f7a2b5c8d4e1",
  },
  {
    id: "nico-iamaleava",
    name: "Nico Iamaleava",
    sport: "Football",
    pos: "QB",
    school: "Tennessee Volunteers",
    state: "Tennessee",
    conference: "SEC",
    year: "Sophomore",
    agency: "Athletes First",
    collective: "Spyre Sports Group",
    rating: 5.0,
    image: "/images/qb-10.png",
    profileImage: "/images/qb-10.png",
    socialFollowers: "425K",
    cardStats: [
      { label: "Arm", value: "60 MPH" },
      { label: "Release", value: "0.37s" },
      { label: "Acc", value: "87%" },
      { label: "Rush", value: "32 YPG" },
    ],
    detailMetrics: [
      { label: "Arm Velocity", value: "60.4 MPH" },
      { label: "Release Time", value: "0.37s" },
      { label: "Accuracy", value: "87%" },
      { label: "Completion Rate", value: "64.8%" },
      { label: "TD/INT Ratio", value: "2.5:1" },
      { label: "QBR", value: "79.2" },
      { label: "Pass Yards/Game", value: "246.1" },
      { label: "Rush Yards/Game", value: "32.4" },
      { label: "Pocket Presence", value: "85/100" },
      { label: "Decision Speed", value: "89/100" },
    ],
    nil: { composite: 88, low: 6500000, high: 9200000, social: 72, athletic: 93, market: 92, brand: 84 },
    deals: ["Celsius", "Oakley"],
    bio: "Dynamic dual-threat quarterback who started as a true freshman at Tennessee. 6\u20196\u201d frame with electric athleticism and deep-ball accuracy. SEC market premium and Spyre Sports Group backing generate one of the highest collective-driven NIL packages in the country.",
    receiptId: "NIL33-2026-00106",
    signature: "ed25519:f1a9b3c7d5e2f8a4b6c9d1e3f7a5b2c8d6e4f9a3b1c7d5e2f8a6b4c9d1e3f7",
  },
  {
    id: "flaujae-johnson",
    name: "Flau'jae Johnson",
    sport: "Basketball",
    pos: "Guard",
    school: "LSU Tigers",
    state: "Louisiana",
    conference: "SEC",
    year: "Senior",
    agency: "Roc Nation",
    collective: "Bayou Traditions",
    rating: 4.5,
    image: "/images/qb-69.png",
    profileImage: "/images/qb-69.png",
    socialFollowers: "5.2M",
    cardStats: [
      { label: "PPG", value: "15.4" },
      { label: "RPG", value: "6.3" },
      { label: "APG", value: "2.1" },
      { label: "STL", value: "1.8" },
    ],
    detailMetrics: [
      { label: "Points/Game", value: "15.4" },
      { label: "Rebounds/Game", value: "6.3" },
      { label: "Assists/Game", value: "2.1" },
      { label: "Field Goal %", value: "44.8%" },
      { label: "3-Point %", value: "32.1%" },
      { label: "Free Throw %", value: "78.6%" },
      { label: "Steals/Game", value: "1.8" },
      { label: "Minutes/Game", value: "31.5" },
      { label: "PER", value: "21.4" },
      { label: "Win Shares", value: "5.8" },
    ],
    nil: { composite: 86, low: 1200000, high: 1800000, social: 94, athletic: 82, market: 84, brand: 88 },
    deals: ["Puma", "Beats by Dre", "Cash App", "Target", "Subway"],
    bio: "Women\u2019s basketball star and recording artist signed to Jay-Z\u2019s Roc Nation. Multi-platform NIL pioneer who leverages her music career, 5.2M social following, and on-court production into one of the most diversified NIL portfolios in women\u2019s sports. Daughter of late rapper Camouflage.",
    receiptId: "NIL33-2026-00107",
    signature: "ed25519:a3b7c1d5e9f2a6b4c8d3e7f1a5b9c2d6e4f8a3b7c1d5e9f2a6b4c8d3e7f1a5",
  },
  {
    id: "aj-dybantsa",
    name: "AJ Dybantsa",
    sport: "Basketball",
    pos: "Small Forward",
    school: "BYU Cougars",
    state: "Utah",
    conference: "Big 12",
    year: "Freshman",
    agency: "Excel Sports Management",
    collective: "\u2014",
    rating: 5.0,
    image: "/images/qb.png",
    profileImage: "/images/qb.png",
    socialFollowers: "1.5M",
    cardStats: [
      { label: "PPG", value: "22.4" },
      { label: "RPG", value: "7.1" },
      { label: "APG", value: "3.6" },
      { label: "FG%", value: "48.0" },
    ],
    detailMetrics: [
      { label: "Points/Game", value: "22.4" },
      { label: "Rebounds/Game", value: "7.1" },
      { label: "Assists/Game", value: "3.6" },
      { label: "Field Goal %", value: "48.0%" },
      { label: "3-Point %", value: "38.2%" },
      { label: "Free Throw %", value: "82.4%" },
      { label: "Steals/Game", value: "1.4" },
      { label: "Blocks/Game", value: "0.8" },
      { label: "Minutes/Game", value: "33.8" },
      { label: "PER", value: "26.7" },
    ],
    nil: { composite: 91, low: 4500000, high: 6200000, social: 87, athletic: 96, market: 90, brand: 89 },
    deals: ["Nike", "Beats by Dre", "Topps"],
    bio: "#1 overall prospect in the 2025 basketball recruiting class. 6\u20199\u201d wing with elite scoring versatility and NBA-ready frame. Projected as potential #1 pick in the 2026 NBA Draft. His collegiate NIL portfolio rivals top football players \u2014 a first for men\u2019s basketball recruits.",
    receiptId: "NIL33-2026-00108",
    signature: "ed25519:b4c8d2e6f9a3b7c1d5e9f4a8b2c6d3e7f1a5b9c4d8e2f6a3b7c1d5e9f4a8b2",
  },
  {
    id: "dj-lagway",
    name: "DJ Lagway",
    sport: "Football",
    pos: "QB",
    school: "Florida Gators",
    state: "Florida",
    conference: "SEC",
    year: "Sophomore",
    agency: "ISE (Independent Sports)",
    collective: "Gator Collective",
    rating: 5.0,
    image: "/images/qb-69.png",
    profileImage: "/images/qb-69.png",
    socialFollowers: "320K",
    cardStats: [
      { label: "Arm", value: "62 MPH" },
      { label: "Release", value: "0.36s" },
      { label: "Acc", value: "88%" },
      { label: "TDs", value: "18" },
    ],
    detailMetrics: [
      { label: "Arm Velocity", value: "62.0 MPH" },
      { label: "Release Time", value: "0.36s" },
      { label: "Accuracy", value: "88%" },
      { label: "Completion Rate", value: "65.2%" },
      { label: "TD/INT Ratio", value: "2.6:1" },
      { label: "QBR", value: "80.8" },
      { label: "Pass Yards/Game", value: "262.4" },
      { label: "Rush Yards/Game", value: "24.8" },
      { label: "Pocket Presence", value: "86/100" },
      { label: "Decision Speed", value: "84/100" },
    ],
    nil: { composite: 85, low: 2600000, high: 3800000, social: 68, athletic: 92, market: 88, brand: 80 },
    deals: ["Celsius", "Outback Steakhouse"],
    bio: "5-star recruit from Willis High School (TX) who enrolled early at Florida and seized the starting job. 6\u20192\u201d with a rocket arm and elite deep-ball accuracy. Florida\u2019s massive alumni base and the Gator Collective\u2019s aggressive NIL strategy make him one of the best-compensated QBs in the country.",
    receiptId: "NIL33-2026-00109",
    signature: "ed25519:c7d1e5f9a3b8c2d6e4f7a1b5c9d3e8f2a6b4c7d1e5f9a3b8c2d6e4f7a1b5c9",
  },
  {
    id: "ryan-williams",
    name: "Ryan Williams",
    sport: "Football",
    pos: "WR",
    school: "Alabama Crimson Tide",
    state: "Alabama",
    conference: "SEC",
    year: "Sophomore",
    agency: "WME",
    collective: "Yea Alabama",
    rating: 5.0,
    image: "/images/qb5.png",
    profileImage: "/images/qb5.png",
    socialFollowers: "850K",
    cardStats: [
      { label: "40-Yd", value: "4.35s" },
      { label: "Rec", value: "65" },
      { label: "YPG", value: "88.4" },
      { label: "TDs", value: "12" },
    ],
    detailMetrics: [
      { label: "40-Yard Dash", value: "4.35s" },
      { label: "Receptions", value: "65" },
      { label: "Yards/Game", value: "88.4" },
      { label: "Touchdowns", value: "12" },
      { label: "Catch Rate", value: "76.2%" },
      { label: "YAC Average", value: "9.1 yds" },
      { label: "Route Running", value: "93/100" },
      { label: "Contested Catches", value: "15" },
      { label: "Separation Score", value: "96/100" },
      { label: "Hands Rating", value: "94/100" },
    ],
    nil: { composite: 87, low: 2200000, high: 3400000, social: 82, athletic: 94, market: 86, brand: 84 },
    deals: ["Nike", "Dr Pepper"],
    bio: "The youngest player to start at Alabama in the modern era. Enrolled at 16 and immediately became the Crimson Tide\u2019s most dynamic playmaker. 5\u201911\u201d with 4.35 speed, elite route-running, and exceptional ball tracking. Yea Alabama collective positioning him as the face of Tide athletics.",
    receiptId: "NIL33-2026-00110",
    signature: "ed25519:d8e2f6a4b9c3d7e1f5a8b2c6d4e9f3a7b1c5d8e2f6a4b9c3d7e1f5a8b2c6d4",
  },
];

type Athlete = typeof ATHLETES[number];

const SPORT_COLORS: Record<string, string> = {
  Football: "bg-nil-green/20 text-nil-green border-nil-green/30",
  Basketball: "bg-nil-cyan/20 text-nil-cyan border-nil-cyan/30",
  Gymnastics: "bg-nil-purple/20 text-nil-purple border-nil-purple/30",
};

/* ═══ Detail panel ═══ */
function AthleteDetail({ athlete, onClose }: { athlete: Athlete; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-nil-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-nil-border/60 bg-nil-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-80">
          <Image src={athlete.profileImage} alt={athlete.name} fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-nil-dark via-nil-dark/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-nil-black/60 border border-nil-border/40 flex items-center justify-center text-nil-muted hover:text-nil-white transition-colors cursor-pointer"
          >
            ✕
          </button>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge status="pass" label="Verified" />
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${SPORT_COLORS[athlete.sport] || "bg-nil-green/20 text-nil-green border-nil-green/30"}`}>
              {athlete.sport}
            </span>
            <span className="bg-nil-gold/20 text-nil-gold text-[10px] font-bold px-2.5 py-1 rounded-full border border-nil-gold/30">
              &#9733; {athlete.rating}
            </span>
          </div>
          <div className="absolute bottom-6 left-6">
            <p className="text-nil-white font-extrabold text-3xl">{athlete.name}</p>
            <p className="text-nil-muted text-sm mt-1">
              {athlete.pos} &middot; {athlete.school} &middot; {athlete.year} &middot; {athlete.conference}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Bio + meta strip */}
          <p className="text-nil-text text-sm leading-relaxed mb-4">{athlete.bio}</p>
          <div className="flex flex-wrap gap-3 mb-8 text-xs">
            <span className="bg-nil-black/60 border border-nil-border/40 rounded-lg px-3 py-1.5 text-nil-muted">
              <span className="text-nil-white font-semibold">Agency:</span> {athlete.agency}
            </span>
            <span className="bg-nil-black/60 border border-nil-border/40 rounded-lg px-3 py-1.5 text-nil-muted">
              <span className="text-nil-white font-semibold">Collective:</span> {athlete.collective}
            </span>
            <span className="bg-nil-black/60 border border-nil-border/40 rounded-lg px-3 py-1.5 text-nil-muted">
              <span className="text-nil-white font-semibold">Followers:</span> {athlete.socialFollowers}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Verified Metrics — sport-generic */}
            <Card>
              <p className="text-nil-cyan text-[10px] font-bold tracking-[0.15em] uppercase mb-4">
                Verified {athlete.sport} Metrics
              </p>
              <div className="grid grid-cols-2 gap-4">
                {athlete.detailMetrics.map((m, i) => (
                  <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-nil-border/20">
                    <span className="text-nil-muted text-xs">{m.label}</span>
                    <span className={`font-mono text-sm font-bold ${i % 2 === 0 ? "text-nil-green" : "text-nil-cyan"}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* NIL33 Valuation */}
            <div className="space-y-6">
              <Card>
                <p className="text-nil-green text-[10px] font-bold tracking-[0.15em] uppercase mb-4">NIL33 Valuation</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-nil-muted text-sm">Composite Score</span>
                  <span className="text-nil-green font-mono text-4xl font-extrabold">{athlete.nil.composite}<span className="text-nil-muted text-sm font-normal">/99</span></span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-nil-muted text-sm">Fair Value Range</span>
                  <span className="text-nil-white font-mono text-sm font-bold">${athlete.nil.low.toLocaleString()} &ndash; ${athlete.nil.high.toLocaleString()}</span>
                </div>
                <div className="space-y-2.5">
                  <ScoreBar label="Social" value={athlete.nil.social} color="var(--color-nil-green)" />
                  <ScoreBar label="Athletic" value={athlete.nil.athletic} color="var(--color-nil-cyan)" />
                  <ScoreBar label="Market" value={athlete.nil.market} color="var(--color-nil-purple)" />
                  <ScoreBar label="Brand" value={athlete.nil.brand} color="var(--color-nil-gold)" />
                </div>
              </Card>

              {/* Compliance */}
              <Card>
                <p className="text-nil-purple text-[10px] font-bold tracking-[0.15em] uppercase mb-3">Compliance Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-nil-muted text-sm">{athlete.state} State Law</span>
                    <Badge status="pass" label="Pass" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nil-muted text-sm">{athlete.conference} Rules</span>
                    <Badge status="pass" label="Pass" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nil-muted text-sm">NCAA Guidelines</span>
                    <Badge status="pass" label="Pass" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Receipt */}
          <div className="mt-6">
            <CodePreview title={`receipt-${athlete.receiptId}.json`}>
              <div className="space-y-0.5 text-[13px]">
                <DataRow label="Receipt ID" value={athlete.receiptId} />
                <DataRow label="Athlete" value={`${athlete.name} \u2014 ${athlete.pos}, ${athlete.school}`} />
                <DataRow label="Sport" value={athlete.sport} />
                <DataRow label="Verified" value={<span className="text-nil-cyan">&#10003; Identity Hash + Ed25519</span>} />
                <DataRow label="Composite" value={<span className="text-nil-green font-bold">{athlete.nil.composite}/99</span>} />
                <DataRow label="Fair Value" value={`$${athlete.nil.low.toLocaleString()} \u2013 $${athlete.nil.high.toLocaleString()}`} />
                <DataDivider />
                <DataRow label="Agency" value={athlete.agency} />
                <DataRow label="Collective" value={athlete.collective} />
                <DataRow label="Compliance" value={<span className="text-nil-green">All Clear</span>} />
                <DataRow label="Timestamp" value={new Date().toISOString()} />
                <div className="py-2">
                  <span className="text-nil-muted text-xs">Signature</span>
                  <p className="text-nil-purple/70 text-xs font-mono break-all mt-0.5">{athlete.signature}</p>
                </div>
              </div>
            </CodePreview>
          </div>

          {/* Brand Partnerships */}
          <div className="mt-6">
            <p className="text-nil-muted text-xs uppercase tracking-wider mb-3">Brand Partnerships</p>
            <div className="flex flex-wrap gap-2">
              {athlete.deals.map((d) => (
                <span key={d} className="text-nil-text text-xs bg-nil-black/60 border border-nil-border/40 rounded-lg px-3 py-1.5">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AthletesPage() {
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [sortBy, setSortBy] = useState<"composite" | "valuation" | "rating">("composite");
  const [sportFilter, setSportFilter] = useState<string>("All");

  const filtered = sportFilter === "All" ? ATHLETES : ATHLETES.filter((a) => a.sport === sportFilter);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "composite") return b.nil.composite - a.nil.composite;
    if (sortBy === "valuation") return b.nil.high - a.nil.high;
    return b.rating - a.rating;
  });

  const totalValue = ATHLETES.reduce((sum, a) => sum + a.nil.high, 0);
  const uniqueStates = new Set(ATHLETES.map((a) => a.state)).size;
  const uniqueSports = [...new Set(ATHLETES.map((a) => a.sport))];
  const highestComposite = Math.max(...ATHLETES.map((a) => a.nil.composite));

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="relative pt-32 sm:pt-44 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-stadium.png" alt="" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-nil-black/90 via-nil-black/80 to-nil-black" />
        </div>
        <div className="absolute inset-0 hero-glow" />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <p className="text-overline mb-5">Verified Roster</p>
          <h1 className="text-display text-nil-white max-w-2xl">
            Real athletes.
            <span className="gradient-text"> Real valuations.</span>
          </h1>
          <p className="mt-6 text-body-lg text-nil-muted max-w-xl">
            Every athlete on this roster has been identity-verified
            and scored through the NIL33 33-factor valuation engine. Football, basketball,
            gymnastics &mdash; every sport, every market.
          </p>

          {/* Summary stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-nil-border/20 rounded-2xl overflow-hidden border border-nil-border/40">
            {[
              { value: String(ATHLETES.length), label: "Verified Athletes", color: "text-nil-green" },
              { value: `$${(totalValue / 1000000).toFixed(1)}M`, label: "Total Portfolio Value", color: "text-nil-cyan" },
              { value: String(highestComposite), label: "Highest Composite", color: "text-nil-gold" },
              { value: String(uniqueStates), label: "States Covered", color: "text-nil-purple" },
            ].map((s) => (
              <div key={s.label} className="bg-nil-dark/80 backdrop-blur-sm p-6 text-center">
                <p className={`font-mono text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-nil-muted text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Sort + filter controls ═══ */}
      <div className="border-y border-nil-border/40 bg-nil-dark/60 px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center gap-3">
          <span className="text-nil-muted text-xs uppercase tracking-wider">Sort</span>
          {([
            { key: "composite", label: "NIL33 Score" },
            { key: "valuation", label: "Valuation" },
            { key: "rating", label: "Star Rating" },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sortBy === s.key
                  ? "bg-nil-green/10 text-nil-green border border-nil-green/30"
                  : "text-nil-muted hover:text-nil-white border border-nil-border/40"
              }`}
            >
              {s.label}
            </button>
          ))}
          <span className="text-nil-border mx-1">|</span>
          <span className="text-nil-muted text-xs uppercase tracking-wider">Sport</span>
          {["All", ...uniqueSports].map((s) => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sportFilter === s
                  ? "bg-nil-cyan/10 text-nil-cyan border border-nil-cyan/30"
                  : "text-nil-muted hover:text-nil-white border border-nil-border/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Athlete Grid ═══ */}
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {sorted.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="group rounded-2xl border border-nil-border/60 bg-nil-dark/60 overflow-hidden hover:border-nil-green/30 transition-all text-left cursor-pointer"
            >
              <div className="relative h-56">
                <Image src={a.image} alt={a.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-nil-dark via-nil-dark/20 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-nil-green/20 text-nil-green text-[10px] font-bold px-2.5 py-1 rounded-full border border-nil-green/30">
                    {a.nil.composite}/99
                  </span>
                  <span className="bg-nil-gold/20 text-nil-gold text-[10px] font-bold px-2 py-1 rounded-full border border-nil-gold/30">
                    &#9733;{a.rating}
                  </span>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge status="pass" label="Verified" />
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${SPORT_COLORS[a.sport] || "bg-nil-green/20 text-nil-green border-nil-green/30"}`}>
                    {a.sport}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-nil-white font-bold text-lg group-hover:text-nil-green transition-colors">{a.name}</p>
                    <p className="text-nil-muted text-xs">{a.pos} &middot; {a.school} &middot; {a.year}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {a.cardStats.map((stat, i) => (
                    <div key={stat.label}>
                      <p className={`font-mono text-sm font-bold ${i % 2 === 0 ? "text-nil-green" : "text-nil-cyan"}`}>{stat.value}</p>
                      <p className="text-nil-muted text-[8px] uppercase">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-nil-border/30 my-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-nil-green font-mono text-lg font-bold">
                      ${a.nil.low >= 1000000 ? `${(a.nil.low / 1000000).toFixed(1)}M` : `${(a.nil.low / 1000).toFixed(0)}K`}&ndash;${a.nil.high >= 1000000 ? `${(a.nil.high / 1000000).toFixed(1)}M` : `${(a.nil.high / 1000).toFixed(0)}K`}
                    </p>
                    <p className="text-nil-muted text-[9px] uppercase">Fair Value Range</p>
                  </div>
                  <span className="text-nil-muted text-xs group-hover:text-nil-green transition-colors">
                    View Report &rarr;
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* ═══ Pipeline CTA ═══ */}
      <Section dark>
        <div className="grid lg:grid-cols-2 gap-12 items-center stagger">
          <div>
            <SectionHeader
              overline="The Pipeline"
              title="Verified identity. Scored valuation. Signed receipt."
              subtitle="NIL33 captures the metrics and turns them into a defensible valuation. Every step is cryptographically signed and audit-ready."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/demo" size="lg">Score a Deal</Button>
              <Button href="/developers" variant="ghost" size="lg">Technical Specs &rarr;</Button>
            </div>
          </div>
          <CodePreview title="pipeline.txt">
            <pre className="text-nil-text whitespace-pre leading-relaxed text-xs sm:text-sm overflow-x-auto">
{`Identity Layer       NIL33 Engine
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  Capture     \u2502      \u2502  Score       \u2502
\u2502  Metrics     \u2502\u2500\u2500\u2500\u2500\u2500\u25B6\u2502  33 Factors  \u2502
\u2502  Verify ID   \u2502      \u2502  Compliance  \u2502
\u2502  Sign Hash   \u2502      \u2502  Receipt     \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`}
            </pre>
          </CodePreview>
        </div>
      </Section>

      {/* Modal */}
      {selected && <AthleteDetail athlete={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
