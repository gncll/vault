import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
      },
      {
        protocol: 'http',
        hostname: '**.blogspot.com',
      },
      {
        protocol: 'https',
        hostname: '**.blogspot.com',
      },
    ],
  },
};

export default nextConfig;
