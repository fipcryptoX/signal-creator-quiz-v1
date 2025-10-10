/** @type {import('next').NextConfig} */
// Force rebuild to clear cache
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Allow ngrok and other development origins
  experimental: {
    allowedDevOrigins: ['**.ngrok-free.app', '**.ngrok.io', '**.ngrok-free.dev'],
  },
}

export default nextConfig