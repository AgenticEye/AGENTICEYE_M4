import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/py/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/:path*'
          : '/api/py/:path*',
      },
    ];
  },
};

export default nextConfig;
