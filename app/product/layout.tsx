import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Center — Verified QB Identity Platform | Product",
  description:
    "Objective throwing metrics. Real recruiting signal. A data-driven quarterback command center. Free MVP access or get verified for $149.",
  keywords: [
    "quarterback",
    "recruiting",
    "sports tech",
    "NIL",
    "athlete branding",
    "football training",
    "web platform",
    "data analytics",
    "youth sports",
    "college recruiting",
    "verified metrics",
    "quarterback identity",
  ],
  openGraph: {
    title: "Under Center — The Verified Identity Standard for Quarterbacks",
    description:
      "Objective throwing metrics. Real recruiting signal. A data-driven quarterback command center that makes a 15-year-old feel like a Division 1 prospect the moment he opens his page.",
    type: "website",
    siteName: "Under Center",
  },
  twitter: {
    card: "summary_large_image",
    title: "Under Center — Verified QB Identity Platform",
    description:
      "Objective throwing metrics. Real recruiting signal. The identity standard for elite quarterbacks.",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
