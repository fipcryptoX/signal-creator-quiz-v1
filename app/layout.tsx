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
    'fc:frame:post_url': 'https://signal-creator-quiz-v1-pdml.vercel.app',
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
        {/* Farcaster Mini App Embed - 1200x630 image for social sharing */}
        <meta
          name="fc:miniapp"
          content='{"version":"1","imageUrl":"https://signal-creator-quiz-v1-pdml.vercel.app/image.png","button":{"title":"Take Quiz","action":{"type":"launch_miniapp","name":"Signal Creator Quiz","url":"https://signal-creator-quiz-v1-pdml.vercel.app","splashImageUrl":"https://signal-creator-quiz-v1-pdml.vercel.app/splash.png","splashBackgroundColor":"#3C6E71"}}}'
        />
        {/* Backward compatibility */}
        <meta
          name="fc:frame"
          content='{"version":"1","imageUrl":"https://signal-creator-quiz-v1-pdml.vercel.app/image.png","button":{"title":"Take Quiz","action":{"type":"launch_frame","name":"Signal Creator Quiz","url":"https://signal-creator-quiz-v1-pdml.vercel.app","splashImageUrl":"https://signal-creator-quiz-v1-pdml.vercel.app/splash.png","splashBackgroundColor":"#3C6E71"}}}'
        />
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
