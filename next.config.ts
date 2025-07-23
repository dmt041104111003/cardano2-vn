import type { NextConfig } from 'next';
import { withNextra } from 'nextra';

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'img.youtube.com'],
  },
};

export default withNextra()(nextConfig);
