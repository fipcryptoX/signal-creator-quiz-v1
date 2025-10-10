export interface LeaderboardEntry {
  username: string
  score: number
  timestamp: number
  profilePicture?: string // Farcaster profile picture URL
  fid?: number // Farcaster ID
}

const LEADERBOARD_KEY = "signal-quiz-leaderboard"

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(LEADERBOARD_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addToLeaderboard(
  username: string,
  score: number,
  profilePicture?: string,
  fid?: number
): void {
  const leaderboard = getLeaderboard()
  leaderboard.push({
    username,
    score,
    timestamp: Date.now(),
    profilePicture,
    fid,
  })

  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score)

  // Keep top 100
  const trimmed = leaderboard.slice(0, 100)

  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed))
}

export function getUserRank(fid: number | undefined, timestamp: number): number {
  const leaderboard = getLeaderboard()
  const index = leaderboard.findIndex((entry) => entry.fid === fid && entry.timestamp === timestamp)
  return index + 1
}
