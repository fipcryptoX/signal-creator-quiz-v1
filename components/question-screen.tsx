"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/quiz-data"
import { useState } from "react"

interface QuestionScreenProps {
  question: Question
  currentQuestion: number
  totalQuestions: number
  onAnswer: (score: number) => void
}

export function QuestionScreen({ question, currentQuestion, totalQuestions, onAnswer }: QuestionScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const handleNext = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer)
      setSelectedAnswer(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              {currentQuestion}
            </div>
            <span className="text-muted-foreground font-medium">
              Question {currentQuestion} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* Question card */}
        <Card className="p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-balance leading-relaxed">{question.question}</h2>

          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(answer.score)}
                className={`w-full p-6 rounded-xl text-left transition-all duration-200 border-2 ${
                  selectedAnswer === answer.score
                    ? "border-primary bg-accent shadow-md scale-[1.02]"
                    : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <p className="text-base md:text-lg text-pretty leading-relaxed">{answer.text}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Next button */}
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            size="lg"
            className="px-12 py-6 text-lg rounded-full"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
