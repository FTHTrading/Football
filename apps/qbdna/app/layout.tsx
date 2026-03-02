import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { PostHogProvider } from "@/components/PostHogProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Under Center — The Verified Quarterback Index",
  description:
    "Objective throwing metrics. Real recruiting signal. The identity standard for elite quarterbacks.",
  keywords: ["quarterback", "recruiting", "verified", "metrics", "NFL", "combine"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-uc-black text-uc-white`}
      >
        <PostHogProvider>
          <ErrorBoundary>
            <Navigation />
            {children}
          </ErrorBoundary>
        </PostHogProvider>
      </body>
    </html>
  );
}
