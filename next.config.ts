import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  outputFileTracingIncludes: {
    "/api/ticket/[token]/pdf": ["./node_modules/playwright-core/**"],
  },
};

export default nextConfig;
