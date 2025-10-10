"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getResultCategory } from "@/lib/quiz-data"
import { addToLeaderboard, getUserRank } from "@/lib/leaderboard"
import { useState } from "react"
import { Leaderboard } from "./leaderboard"

interface ResultsScreenProps {
  score: number
  onRestart: () => void
}

export function ResultsScreen({ score, onRestart }: ResultsScreenProps) {
  const [username, setUsername] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [userTimestamp, setUserTimestamp] = useState<number | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const result = getResultCategory(score)

  const handleSubmit = () => {
    if (username.trim()) {
      const timestamp = Date.now()
      addToLeaderboard(username.trim(), score)
      setUserTimestamp(timestamp)
      setSubmitted(true)
      setShowLeaderboard(true)
    }
  }

  const handleShare = () => {
    const text = `I scored ${score}/40 on the Signal Creator Quiz! I'm a ${result.title}. Take the quiz yourself!`

    if (navigator.share) {
      navigator.share({
        title: "Signal Creator Quiz Results",
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert("Results copied to clipboard!")
    }
  }

  const userRank = submitted && userTimestamp ? getUserRank(username, userTimestamp) : null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <Card className="p-8 md:p-12 text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl">{result.emoji}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">{result.title}</h2>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed">
              {result.description}
            </p>
          </div>

          <div className="pt-4 pb-2">
            <div className="inline-block bg-accent px-8 py-4 rounded-full">
              <p className="text-sm text-muted-foreground mb-1">Your Score</p>
              <p className="text-4xl font-bold text-primary">{score}/40</p>
            </div>
          </div>

          {!submitted ? (
            <div className="space-y-4 pt-4">
              <p className="text-muted-foreground">Enter your name to join the leaderboard</p>
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="text-lg py-6"
                />
                <Button onClick={handleSubmit} disabled={!username.trim()} size="lg" className="px-8">
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {userRank && (
                <p className="text-lg font-medium text-primary">You're ranked #{userRank} on the leaderboard! 🎉</p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={handleShare} variant="outline" size="lg" className="rounded-full bg-transparent">
              Share Results
            </Button>
            <Button onClick={onRestart} variant="outline" size="lg" className="rounded-full bg-transparent">
              Retake Quiz
            </Button>
            {submitted && (
              <Button onClick={() => setShowLeaderboard(!showLeaderboard)} size="lg" className="rounded-full">
                {showLeaderboard ? "Hide" : "View"} Leaderboard
              </Button>
            )}
          </div>
        </Card>

        {showLeaderboard && (
          <Leaderboard currentUser={submitted ? username : undefined} currentTimestamp={userTimestamp || undefined} />
        )}
      </div>
    </div>
  )
}
