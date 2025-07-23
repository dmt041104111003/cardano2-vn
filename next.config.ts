import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
});

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.youtube.com"],
  },
};

export default withNextra(nextConfig);
