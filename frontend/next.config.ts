import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/:path*`, // Proxy to Backend
      }
    ]
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5001',
  },
};

export default nextConfig;
