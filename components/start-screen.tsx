"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12 text-center space-y-4">
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/signal-quiz-logo.png"
              alt="Signal Creator Quiz Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Signal Creator Quiz</h1>
          <div className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed space-y-2">
            <p>Are you creating Signal or just adding to the Noise?</p>
            <p>Take this 10-question quiz to find out.</p>
          </div>
        </div>

        <div>
          <Button onClick={onStart} size="lg" className="text-lg px-8 py-6 rounded-full">
            Start Quiz
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-sm text-muted-foreground">
        Created by{" "}
        <a
          href="https://farcaster.xyz/fipcrypto"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          @fipcrypto
        </a>
      </div>
    </div>
  )
}
