"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12 text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Signal Creator Quiz</h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
            Are you creating Signal or just adding to the Noise? Take this 10-question quiz to find out.
          </p>
        </div>

        <div className="pt-4">
          <Button onClick={onStart} size="lg" className="text-lg px-8 py-6 rounded-full">
            Start Quiz
          </Button>
        </div>
      </Card>
    </div>
  )
}
