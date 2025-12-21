import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://www.datocms-assets.com/183398/**')],
  },
};

export default nextConfig;
