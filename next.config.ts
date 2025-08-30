import { createMDX } from "fumadocs-mdx/next";
import CopyWebpackPlugin from "copy-webpack-plugin";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    domains: ["res.cloudinary.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [{ from: "src/sw.js", to: "public" }],
      })
    );
    return config;
  },
};

export default withMDX(config);
