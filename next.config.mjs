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
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0199d27f-5211-20b5-6303-66a206a4eac2',
        permanent: false,
      },
    ]
  },
}

export default nextConfig