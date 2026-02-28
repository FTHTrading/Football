import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Skip type checking and linting during build for speed
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
