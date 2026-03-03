import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nil33/core", "@nil33/compliance-gate", "@nil33/audit-ledger"],
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
