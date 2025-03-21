import type { NextConfig } from 'next';
import { NEXT_PUBLIC_API_BASE_PATH, NEXT_PUBLIC_SERVER_PORT } from 'utils/envValues';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.resolve.symlinks = false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  rewrites: async () => [
    {
      source: `${NEXT_PUBLIC_API_BASE_PATH}/:path*`,
      destination: `http://localhost:${NEXT_PUBLIC_SERVER_PORT}${NEXT_PUBLIC_API_BASE_PATH}/:path*`,
    },
  ],
};

export default nextConfig;
