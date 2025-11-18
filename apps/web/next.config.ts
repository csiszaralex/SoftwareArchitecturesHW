import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  transpilePackages: ['@parking/schema'],
};

export default nextConfig;

