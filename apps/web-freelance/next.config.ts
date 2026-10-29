import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui-web', '@repo/theme-engine', '@repo/shared-dto'],
};

export default nextConfig;

