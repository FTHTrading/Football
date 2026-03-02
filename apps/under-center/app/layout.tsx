import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Under Center — Verified Quarterback Metrics",
  description:
    "The verified quarterback profile platform. Elite metrics, mechanics grades, NFL comparisons, and recruiting data — built for serious prospects.",
  keywords: [
    "quarterback recruiting",
    "verified QB metrics",
    "quarterback profile",
    "QB mechanics grade",
    "football recruiting platform",
    "high school quarterback",
    "college football recruiting",
    "quarterback evaluation",
    "NFL comparison",
    "QB arm strength",
    "release time",
    "quarterback film",
    "elite quarterback",
    "verified athlete profile",
  ],
  authors: [{ name: "Under Center" }],
  creator: "Under Center",
  openGraph: {
    title: "Under Center — Verified Quarterback Metrics",
    description:
      "The verified quarterback profile platform. Built for serious prospects.",
    type: "website",
    locale: "en_US",
    siteName: "Under Center",
  },
  twitter: {
    card: "summary_large_image",
    title: "Under Center — Verified Quarterback Metrics",
    description:
      "The verified quarterback profile platform. Built for serious prospects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
