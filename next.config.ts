import { createMDX } from "fumadocs-mdx/next";

import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  webpack: (cfg, { isServer }) => {
    if (isServer) {
      const prev = cfg.externals;
      const externalsArray = Array.isArray(prev) ? prev : [];
      cfg.externals = [
        ...externalsArray,
        { prisma: 'commonjs prisma' },
        { '@prisma/client': 'commonjs @prisma/client' },
      ];
    }
    return cfg;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
      },
    ],
    domains: [
      "res.cloudinary.com",
      "user-images.githubusercontent.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withMDX(config);
