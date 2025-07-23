import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.youtube.com"],
  },
};

export default withMDX({
  extension: /\.mdx?$/,
})(nextConfig);
