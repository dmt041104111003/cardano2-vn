import type { NextConfig } from 'next';
import nextra from 'nextra';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'img.youtube.com'],
  },
};

export default nextra({
  defaultShowCopyCode: true,
})(nextConfig);
