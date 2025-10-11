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
  // Redirect to Farcaster Hosted Manifest
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0199d29e-aa60-d1ac-fe3a-ffda9631b947',
        permanent: false,
      },
    ]
  },
}

export default nextConfig