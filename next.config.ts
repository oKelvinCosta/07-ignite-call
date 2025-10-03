import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "api.ts", "api.tsx"], // restrict pages to .tsx files
};

export default nextConfig;
