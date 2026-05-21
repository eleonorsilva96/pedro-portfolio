import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-812bf4f9847741e0aaa0376b65940234.r2.dev',
        port: '',
        pathname: '/uploads/**', // This allows all files inside the uploads folder
      }
    ],
  },
};

export default withPayload(nextConfig);
