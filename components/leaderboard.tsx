"use client"

import { Card } from "@/components/ui/card"
import { getLeaderboard } from "@/lib/leaderboard"
import { useEffect, useState } from "react"
import Image from "next/image"

interface LeaderboardProps {
  currentUserFid?: number
  currentTimestamp?: number
}

export function Leaderboard({ currentUserFid, currentTimestamp }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard())

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [currentUserFid, currentTimestamp])

  return (
    <Card className="p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Leaderboard</h3>

      {leaderboard.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No entries yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 20).map((entry, index) => {
            const isCurrentUser = entry.fid === currentUserFid && entry.timestamp === currentTimestamp

            return (
              <div
                key={`${entry.fid || entry.username}-${entry.timestamp}`}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isCurrentUser ? "bg-primary/10 border-2 border-primary" : "bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
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

                  {/* Profile Picture */}
                  {entry.profilePicture ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={entry.profilePicture}
                        alt={`${entry.username}'s profile`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                  )}

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
