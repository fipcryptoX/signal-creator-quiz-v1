import type { Metadata } from 'next'

type Props = {
  params: { type: string }
}

const resultMetadata: Record<string, { title: string; imageUrl: string }> = {
  'heavy-noise': {
    title: 'Heavy Noise Creator',
    imageUrl: 'https://signal-creator-quiz-v1-pdml.vercel.app/share-heavy-noise.png',
  },
  'leaning-noise': {
    title: 'Leaning Noise Creator',
    imageUrl: 'https://signal-creator-quiz-v1-pdml.vercel.app/share-leaning-noise.png',
  },
  'leaning-signal': {
    title: 'Leaning Signal Creator',
    imageUrl: 'https://signal-creator-quiz-v1-pdml.vercel.app/share-leaning-signal.png',
  },
  'strong-signal': {
    title: 'Strong Signal Creator',
    imageUrl: 'https://signal-creator-quiz-v1-pdml.vercel.app/share-strong-signal.png',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resultType = params.type
  const result = resultMetadata[resultType] || resultMetadata['strong-signal']

  return {
    title: `${result.title} - Signal Creator Quiz`,
    description: 'Discover your content creator type with the Signal Creator Quiz',
    openGraph: {
      title: `${result.title} - Signal Creator Quiz`,
      description: 'Discover your content creator type',
      type: 'website',
      images: [
        {
          url: result.imageUrl,
          width: 1200,
          height: 800,
          alt: result.title,
        },
      ],
    },
    other: {
      'fc:miniapp': JSON.stringify({
        version: '1',
        imageUrl: result.imageUrl,
        button: {
          title: 'Take Quiz',
          action: {
            type: 'launch_frame',
            name: 'Signal Creator Quiz',
            url: 'https://signal-creator-quiz-v1-pdml.vercel.app',
            splashImageUrl: 'https://signal-creator-quiz-v1-pdml.vercel.app/splash-squircle.png',
            splashBackgroundColor: '#3C6E71',
          },
        },
      }),
    },
  }
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children
}
