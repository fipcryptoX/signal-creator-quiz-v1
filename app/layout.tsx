import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { FarcasterProvider } from '@/lib/farcaster-provider'
import './globals.css'

/**
 * Metadata for the Signal Creator Quiz Mini App
 *
 * IMPORTANT: Update these fields before deploying:
 * - title: Your app name
 * - description: Your app description
 * - Update the fc:frame meta tag with your actual domain
 */
export const metadata: Metadata = {
  title: 'Signal Creator Quiz',
  description: 'Discover your content creator type with the Signal Creator Quiz',
  generator: 'Signal Creator Quiz',
  // Open Graph tags for social sharing
  openGraph: {
    title: 'Signal Creator Quiz',
    description: 'Discover your content creator type',
    type: 'website',
    images: [
      {
        url: 'https://signal-creator-quiz-v1-pdml.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Signal Creator Quiz',
      },
    ],
  },
  // Add other meta tags as needed
  other: {
    // Farcaster Frame meta tag for embedding
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://signal-creator-quiz-v1-pdml.vercel.app/image.png',
    'fc:frame:button:1': 'Take Quiz',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://signal-creator-quiz-v1-pdml.vercel.app',
    'fc:frame:post_url': 'https://signal-creator-quiz-v1-pdml.vercel.app/api/frame',
    // Mini app embed metadata for social sharing
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: 'https://signal-creator-quiz-v1-pdml.vercel.app/image.png',
      button: {
        title: 'Take Quiz',
        action: {
          type: 'launch_frame',
          name: 'Signal Creator Quiz',
          url: 'https://signal-creator-quiz-v1-pdml.vercel.app',
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Frame v2 meta tags are in metadata.other below */}
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        {/*
          FarcasterProvider wraps the entire app and provides:
          - Farcaster SDK initialization
          - Mini app environment detection
          - Wagmi configuration with conditional connector
          - Context for accessing mini app features
        */}
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
        <Analytics />
      </body>
    </html>
  )
}
