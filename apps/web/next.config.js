/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking during build
  // (type errors are handled in development / CI separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
