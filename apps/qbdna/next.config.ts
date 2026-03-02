import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" — enable for static demo deploys, disable for internal dev (API routes)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
