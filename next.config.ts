import type { NextConfig } from "next";

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['swiper'],
  images: {
    domains: ["res.cloudinary.com","lh3.googleusercontent.com","avatars.githubusercontent.com","scontent-jnb2-1.xx.fbcdn.net"],
  }
};

export default nextConfig;