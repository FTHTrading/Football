import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIL33 — The Athlete Intelligence Platform",
  description:
    "AI-powered NIL intelligence, compliance, deal tracking, and verified athlete analytics across every sport. National coverage. Real-time data. Built for athletes, agents, and institutions.",
  keywords: [
    "NIL",
    "Name Image Likeness",
    "athlete intelligence",
    "NIL deals",
    "NIL compliance",
    "college sports",
    "NCAA NIL",
    "athlete analytics",
    "NIL valuation",
    "sports AI",
  ],
  openGraph: {
    title: "NIL33 — The Athlete Intelligence Platform",
    description:
      "AI-powered NIL intelligence across every sport. National deal tracking, compliance, and verified analytics.",
    url: "https://nil33.com",
    siteName: "NIL33",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
