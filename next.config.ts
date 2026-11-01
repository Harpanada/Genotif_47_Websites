import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone hanya untuk self-hosted (Docker / Ubuntu Server).
  // Vercel menggunakan deployment adapter miliknya sendiri.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
};

export default nextConfig;
