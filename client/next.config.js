/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.symlinks = false;

    return config;
  },
  rewrites: async () => [
    {
      source: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`,
      destination: `http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}${process.env.NEXT_PUBLIC_API_BASE_PATH}/:path*`,
    },
  ],
};
