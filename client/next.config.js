require('dotenv').config({ path: '../server/.env' });

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  trailingSlash: true,
  env: {
    API_BASE_PATH: process.env.API_BASE_PATH,
    FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST,
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
            source: `${process.env.API_BASE_PATH}/:path*`,
            destination: `http://localhost:31577${process.env.API_BASE_PATH}/:path*`,
          },
        ],
      }
    : { output: 'export' }),
};
