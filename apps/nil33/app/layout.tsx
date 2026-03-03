import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "NIL33 — Underwriting & Compliance Rails for NIL-Linked Alternative Investments",
  description:
    "NIL33 is the institutional operating system for athlete capital markets. 33-signal underwriting, 50-state compliance, portfolio intelligence, and settlement infrastructure for elite sports agencies and broker-dealers.",
  keywords: [
    "NIL alternative investments",
    "athlete capital underwriting",
    "NIL compliance infrastructure",
    "sports agency capital platform",
    "NIL structured products",
    "athlete revenue underwriting",
    "NIL broker-dealer compliance",
    "athlete portfolio intelligence",
    "NIL33",
    "NIL institutional platform",
    "athlete valuation engine",
    "NIL SPV management",
    "50 state NIL compliance",
    "SEC NIL compliance",
    "NIL settlement infrastructure",
    "athlete capital markets",
    "NIL deal structuring",
    "sports agency software",
    "athlete alternative assets",
    "institutional NIL platform",
  ],
  authors: [{ name: "UnyKorn", url: "https://nil33.com" }],
  creator: "NIL33 — A UnyKorn Company",
  publisher: "NIL33",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nil33.com",
  },
  openGraph: {
    title: "NIL33 — Institutional Infrastructure for Athlete Capital Markets",
    description:
      "33-signal underwriting engine, 50-state compliance, portfolio intelligence, and settlement rails. Built for elite sports agencies and broker-dealers.",
    url: "https://nil33.com",
    siteName: "NIL33",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://nil33.com/nil33-og.png",
        width: 1200,
        height: 630,
        alt: "NIL33 — The PE Operating System for Athlete Capital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NIL33 — Underwriting & Compliance for Athlete Capital",
    description:
      "33-signal underwriting, portfolio intelligence, 50-state compliance. Built for elite sports agencies and broker-dealers.",
    images: ["https://nil33.com/nil33-og.png"],
  },
  category: "Financial Technology",
  other: {
    "geo.region": "US-GA",
    "geo.placename": "Norcross",
    "geo.position": "33.9410;-84.2135",
    ICBM: "33.9410, -84.2135",
  },
};

function SchemaOrg() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NIL33",
    legalName: "NIL33 — A UnyKorn Company",
    url: "https://nil33.com",
    logo: "https://nil33.com/nil33-logo-light.png",
    description:
      "Institutional underwriting and compliance infrastructure for NIL-linked alternative investments. 33-signal scoring, portfolio intelligence, and settlement rails for elite sports agencies and broker-dealers.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5655 Peachtree Parkway",
      addressLocality: "Norcross",
      addressRegion: "GA",
      postalCode: "30092",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "kevanbtc@gmail.com",
      contactType: "customer support",
    },
    sameAs: [
      "https://github.com/FTHTrading/nil33",
      "https://github.com/FTHTrading/Football",
    ],
    foundingDate: "2025",
    founder: {
      "@type": "Person",
      name: "Kevan Burns",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "UnyKorn",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NIL33",
    applicationCategory: "FinancialApplication",
    operatingSystem: "Web",
    description:
      "Institutional operating system for athlete capital markets. 33-signal underwriting, 50-state compliance, portfolio intelligence, and settlement infrastructure.",
    url: "https://nil33.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/ComingSoon",
    },
    creator: {
      "@type": "Organization",
      name: "NIL33",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "NIL33",
    image: "https://nil33.com/nil33-logo-dark.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5655 Peachtree Parkway",
      addressLocality: "Norcross",
      addressRegion: "GA",
      postalCode: "30092",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.941,
      longitude: -84.2135,
    },
    url: "https://nil33.com",
    priceRange: "$$",
    description:
      "Institutional financial technology company based in Norcross, Georgia. Underwriting, compliance, and portfolio intelligence infrastructure for athlete capital markets.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <SchemaOrg />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://nil33.com" />
        <meta name="geo.region" content="US-GA" />
        <meta name="geo.placename" content="Norcross" />
        <meta name="geo.position" content="33.9410;-84.2135" />
        <meta name="ICBM" content="33.9410, -84.2135" />
      </head>
      <body className="antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
