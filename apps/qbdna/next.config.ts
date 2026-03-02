import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" removed — required for API routes, middleware, and auth
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
