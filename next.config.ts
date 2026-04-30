import type { NextConfig } from "next";

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['swiper'],
  allowedDevOrigins: ['172.18.224.1'],
};

export default nextConfig;