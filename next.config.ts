import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.youtube.com"],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

};

export default withMDX({
})(nextConfig);
