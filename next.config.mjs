/** @type {import('next').NextConfig} */
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
  // Redirect manifest to Farcaster hosted version
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0199ce9e-23df-f6a1-de74-9a44d356ad9b',
        permanent: false, // 307 Temporary Redirect
      },
    ]
  },
}

export default nextConfig