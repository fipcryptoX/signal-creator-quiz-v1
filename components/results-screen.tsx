"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getResultCategory } from "@/lib/quiz-data"
import { addToLeaderboard, getUserRank } from "@/lib/leaderboard"
import { useState } from "react"
import { Leaderboard } from "./leaderboard"
import { usePayToReveal } from "@/hooks/use-pay-to-reveal"
import { PAYMENT_CONFIG, MINIAPP_CONFIG } from "@/lib/constants"
import { useFarcaster } from "@/lib/farcaster-provider"

interface ResultsScreenProps {
  score: number
  onRestart: () => void
}

export function ResultsScreen({ score, onRestart }: ResultsScreenProps) {
  const [submitted, setSubmitted] = useState(false)
  const [userTimestamp, setUserTimestamp] = useState<number | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Payment gate hook
  const { isRevealed, isLoading, error, payToReveal, state, txHash } = usePayToReveal()

  // Get Farcaster context
  const { context, sdk, isMiniApp } = useFarcaster()

  const result = getResultCategory(score)

  const handleAddScore = () => {
    if (context?.user) {
      const timestamp = Date.now()
      const username = context.user.displayName || context.user.username || `User ${context.user.fid}`
      const profilePicture = context.user.pfpUrl
      const fid = context.user.fid

      addToLeaderboard(username, score, profilePicture, fid)
      setUserTimestamp(timestamp)
      setSubmitted(true)
      setShowLeaderboard(true)
    }
  }

  const handleShare = async () => {
    const shareText = `I just took the Signal Creator Quiz and found out that I'm a ${result.title}. Discover your creator type here:`

    console.log("🔍 Share Debug:", {
      isMiniApp,
      hasSDK: !!sdk,
      hasSdkActions: !!sdk?.actions,
      hasComposeCast: !!sdk?.actions?.composeCast,
      shareImageUrl: result.shareImageUrl
    })

    // Always use Farcaster sharing when in mini app
    if (isMiniApp) {
      try {
        console.log("📝 Opening Farcaster composer with dynamic image...")
        const composeResult = await sdk.actions.composeCast({
          text: shareText,
          embeds: [result.shareImageUrl, MINIAPP_CONFIG.HOME_URL],
        })
        console.log("✅ Composer result:", composeResult)
      } catch (error) {
        console.error("❌ Failed to compose cast:", error)
        // Fallback to clipboard only if composeCast fails
        try {
          await navigator.clipboard.writeText(`${shareText} ${MINIAPP_CONFIG.HOME_URL}`)
          alert("Failed to open composer. Text copied to clipboard!")
        } catch (clipboardError) {
          alert("Failed to open composer and copy to clipboard.")
        }
      }
    } else {
      // Fallback for non-Farcaster environments
      console.log("📱 Using fallback share...")
      const fullText = `${shareText} ${MINIAPP_CONFIG.HOME_URL}`
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Signal Creator Quiz Results",
            text: fullText,
          })
        } catch (error) {
          console.log("Share cancelled or failed:", error)
        }
      } else {
        await navigator.clipboard.writeText(fullText)
        alert("Results copied to clipboard!")
      }
    }
  }

  const userRank = submitted && userTimestamp && context?.user ? getUserRank(context.user.fid, userTimestamp) : null

  // Debug logging
  console.log("🔍 Results Screen Debug:", {
    isRevealed,
    isMiniApp,
    hasContext: !!context,
    hasUser: !!context?.user,
    user: context?.user,
    shouldShowGate: !isRevealed && isMiniApp,
  })

  if (!context?.user) {
    console.warn("⚠️ No user context available - Add Score button will not show")
    console.log("📊 Full context:", context)
  }

  /**
   * PAYMENT GATE: If score is not revealed yet, show payment UI
   * Only shows in mini app mode for better testing/development experience
   */
  if (!isRevealed && isMiniApp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-3xl">
          <Card className="p-8 md:p-12 text-center space-y-6">
            <div className="space-y-4">
              <div className="text-6xl">🔒</div>
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Unlock Your Results</h2>
              <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed">
                View your quiz score and discover your creator type
              </p>
            </div>

            <div className="pt-4 space-y-4">
              <Button
                onClick={payToReveal}
                disabled={isLoading}
                size="lg"
                className="rounded-full px-8 py-6 text-lg"
              >
                {state === "idle" && "Reveal My Score"}
                {state === "connecting" && "Connecting Wallet..."}
                {state === "ready" && "Reveal My Score"}
                {state === "pending" && "Confirming Transaction..."}
                {state === "confirming" && "Waiting for Confirmation..."}
                {state === "success" && "Success! ✓"}
                {state === "error" && "Retry Payment"}
              </Button>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Unlock access for {PAYMENT_CONFIG.AMOUNT_ETH} ETH
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              {txHash && (
                <div className="text-sm text-muted-foreground">
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    View transaction on BaseScan
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={onRestart} variant="outline" size="lg" className="rounded-full bg-transparent">
                Retake Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  /**
   * SCORE REVEALED: Show full results
   * (Also shown by default in non-mini-app mode)
   */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <Card className="p-8 md:p-12 text-center space-y-6">
          {/* Success banner if payment was just completed */}
          {isRevealed && isMiniApp && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-600 font-medium">Success, check your results below</p>
            </div>
          )}

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

          {/* ARCHIVED: Add to Leaderboard functionality */}
          {/*
          {!submitted ? (
            <div className="space-y-4 pt-4">
              {context?.user ? (
                <>
                  <Button onClick={handleAddScore} size="lg" className="px-8">
                    Add Score
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Open this in Farcaster to add your score to the leaderboard
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {userRank && (
                <p className="text-lg font-medium text-primary">You're ranked #{userRank} on the leaderboard! 🎉</p>
              )}
            </div>
          )}

          {!submitted && context?.user && (
            <div className="pt-6 pb-2">
              <p className="text-sm text-muted-foreground text-center">
                Add your score to the leaderboard to see where you rank among other creators
              </p>
            </div>
          )}
          */}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={handleShare} size="lg" className="rounded-full px-8">
              Share Results
            </Button>
            <Button onClick={onRestart} variant="outline" size="lg" className="rounded-full bg-transparent">
              Retake Quiz
            </Button>
            {/* ARCHIVED: View Leaderboard button */}
            {/*
            {submitted && (
              <Button onClick={() => setShowLeaderboard(!showLeaderboard)} size="lg" className="rounded-full">
                {showLeaderboard ? "Hide" : "View"} Leaderboard
              </Button>
            )}
            */}
          </div>

          <div className="pt-6 border-t border-border mt-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              To build an <strong className="font-semibold text-foreground">algo-resistant reputation</strong>, you need
              a daily writing habit.
              <br />
              Join the{" "}
              <a
                href="https://app.hel.io/x/30-day-signal-creator-challenge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                30-Day Signal Creator Challenge
              </a>{" "}
              today.
            </p>
          </div>
        </Card>

        {/* ARCHIVED: Leaderboard display */}
        {/*
        {showLeaderboard && (
          <Leaderboard currentUserFid={context?.user?.fid} currentTimestamp={userTimestamp || undefined} />
        )}
        */}
      </div>
    </div>
  )
}
