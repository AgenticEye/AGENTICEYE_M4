import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/py/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:8000/:path*'
          : `${process.env.PYTHON_BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
