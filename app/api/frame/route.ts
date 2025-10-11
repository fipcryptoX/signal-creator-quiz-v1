import { NextRequest, NextResponse } from 'next/server'

const FRAME_IMAGE_URL = 'https://signal-creator-quiz-v1-pdml.vercel.app/image.png'
const APP_URL = 'https://signal-creator-quiz-v1-pdml.vercel.app'

export async function POST(req: NextRequest) {
  try {
    // Return frame response with image and button
    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_IMAGE_URL}" />
    <meta property="fc:frame:button:1" content="Take Quiz" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${APP_URL}" />
    <meta property="og:image" content="${FRAME_IMAGE_URL}" />
    <meta property="og:title" content="Signal Creator Quiz" />
    <meta property="og:description" content="Discover your content creator type" />
  </head>
  <body>
    <p>Signal Creator Quiz - Click to take the quiz!</p>
  </body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Frame route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Handle GET requests (for debugging)
  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${FRAME_IMAGE_URL}" />
    <meta property="fc:frame:button:1" content="Take Quiz" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${APP_URL}" />
    <meta property="og:image" content="${FRAME_IMAGE_URL}" />
  </head>
  <body>
    <p>Frame endpoint is working!</p>
  </body>
</html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}
