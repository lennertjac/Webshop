import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Hosts that serve product / card photos; anything else falls back to unoptimized.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    return [{ source: '/product/:id', destination: '/products/:id', permanent: true }];
  },
};

export default nextConfig;
