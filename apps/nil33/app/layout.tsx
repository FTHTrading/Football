import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "NIL33 — Capital Discipline Software for NIL Collectives | Norcross, GA",
  description:
    "NIL33 is capital discipline software for NIL collectives. Validate athlete valuations, check 50-state compliance, and prevent overpay — before you sign the deal. Based in Norcross, Georgia.",
  keywords: [
    "NIL valuation software",
    "NIL compliance tool",
    "NIL collective software",
    "NIL overpay prevention",
    "NIL capital allocation",
    "NIL deal validation",
    "collective NIL management",
    "Georgia NIL compliance",
    "NIL33",
    "NIL valuation tool for collectives",
    "NIL compliance scoring",
    "athlete fair market value",
    "NIL deal compliance check",
    "50 state NIL rules",
    "NCAA NIL compliance",
    "SEC NIL compliance",
    "NIL ROI tool",
    "NIL capital discipline",
    "Norcross sports tech",
    "Atlanta NIL software",
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
    title: "NIL33 — Capital Discipline Software for NIL Collectives",
    description:
      "Validate athlete valuations, check 50-state compliance, and prevent overpay — before you sign the deal. Built for collectives. Based in Norcross, GA.",
    url: "https://nil33.com",
    siteName: "NIL33",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://nil33.com/nil33-og.png",
        width: 1200,
        height: 630,
        alt: "NIL33 — Identity · Value · Legacy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NIL33 — Capital Discipline Software for Collectives",
    description:
      "Validate athlete valuations, check compliance, prevent overpay. Built for NIL collectives. Norcross, GA.",
    images: ["https://nil33.com/nil33-og.png"],
  },
  category: "Sports Technology",
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
      "Capital discipline software for NIL collectives — athlete valuation, 50-state compliance, and deal validation. Prevent overpay. Prove compliance.",
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
    applicationCategory: "Business Software",
    operatingSystem: "Web",
    description:
      "Capital discipline software for NIL collectives. Validate athlete valuations, check 50-state compliance, and prevent overpay before signing.",
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
      "Capital discipline software company based in Norcross, Georgia. NIL valuation, compliance scoring, and deal validation for collectives and institutions.",
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
