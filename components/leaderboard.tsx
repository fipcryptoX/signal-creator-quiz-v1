"use client"

import { Card } from "@/components/ui/card"
import { getLeaderboard } from "@/lib/leaderboard"
import { useEffect, useState } from "react"

interface LeaderboardProps {
  currentUser?: string
  currentTimestamp?: number
}

export function Leaderboard({ currentUser, currentTimestamp }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard())

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [currentUser, currentTimestamp])

  return (
    <Card className="p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Leaderboard</h3>

      {leaderboard.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No entries yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 20).map((entry, index) => {
            const isCurrentUser = entry.username === currentUser && entry.timestamp === currentTimestamp

            return (
              <div
                key={`${entry.username}-${entry.timestamp}`}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isCurrentUser ? "bg-primary/10 border-2 border-primary" : "bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-yellow-950"
                        : index === 1
                          ? "bg-gray-400 text-gray-900"
                          : index === 2
                            ? "bg-orange-600 text-orange-50"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`font-medium ${isCurrentUser ? "text-primary font-bold" : ""}`}>
                    {entry.username}
                    {isCurrentUser && " (You)"}
                  </span>
                </div>
                <span className="font-bold text-lg">{entry.score}/40</span>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
