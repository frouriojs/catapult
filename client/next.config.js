require('dotenv').config();

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  trailingSlash: true,
  env: {
    COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_USER_POOL_CLIENT_ID,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.symlinks = false;

    return config;
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        rewrites: async () => [
          {
            source: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`,
            destination: `http://localhost:31577${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`,
          },
        ],
      }
    : { output: 'export' }),
};
