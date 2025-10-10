"use client"

/**
 * usePayToReveal Hook
 *
 * This hook manages the "pay to reveal" functionality for quiz results.
 * It handles the transaction flow, error states, and reveal logic.
 *
 * FLOW:
 * 1. User completes quiz
 * 2. User clicks "Reveal Score" button
 * 3. Hook initiates transaction (0.00001 ETH to configured address)
 * 4. Wait for transaction confirmation
 * 5. Mark score as revealed
 */

import { useState, useCallback, useEffect } from "react"
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { PAYMENT_CONFIG, NETWORK_CONFIG } from "@/lib/constants"
import { useFarcaster } from "@/lib/farcaster-provider"

/**
 * Payment states
 */
export type PaymentState =
  | "idle" // Initial state
  | "connecting" // Connecting wallet
  | "ready" // Wallet connected, ready to pay
  | "pending" // Transaction sent, waiting for confirmation
  | "confirming" // Transaction confirmed, waiting for blocks
  | "success" // Payment successful, score revealed
  | "error" // Error occurred

/**
 * Hook return type
 */
interface UsePayToRevealReturn {
  // Current payment state
  state: PaymentState

  // Whether score is revealed (payment successful)
  isRevealed: boolean

  // Whether transaction is in progress
  isLoading: boolean

  // Error message if any
  error: string | null

  // Connected wallet address
  address: string | undefined

  // Whether wallet is connected
  isConnected: boolean

  // Function to initiate payment
  payToReveal: () => void

  // Function to reset state (for retry)
  reset: () => void

  // Transaction hash (if available)
  txHash: string | undefined

  // Whether in mini app mode (affects UX)
  isMiniApp: boolean
}

/**
 * Custom hook for pay-to-reveal functionality
 */
export function usePayToReveal(): UsePayToRevealReturn {
  const [state, setState] = useState<PaymentState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  // Get Farcaster context
  const { isMiniApp } = useFarcaster()

  // Wagmi hooks
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { data: txHash, sendTransaction, isPending: isSendPending, isError: isSendError, error: sendError } = useSendTransaction()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  /**
   * Update state based on connection status
   */
  useEffect(() => {
    if (state === "idle" && isConnected) {
      setState("ready")
    } else if (state === "idle" && !isConnected) {
      setState("idle")
    }
  }, [isConnected, state])

  /**
   * Update state based on transaction status
   */
  useEffect(() => {
    if (isSendPending) {
      setState("pending")
      setError(null)
    }
  }, [isSendPending])

  useEffect(() => {
    if (isConfirming) {
      setState("confirming")
    }
  }, [isConfirming])

  useEffect(() => {
    if (isConfirmed) {
      setState("success")
      setIsRevealed(true)
      setError(null)
    }
  }, [isConfirmed])

  /**
   * Handle errors
   */
  useEffect(() => {
    if (isSendError && sendError) {
      setState("error")
      // Parse error message
      const message = sendError.message || "Transaction failed"
      if (message.includes("User rejected")) {
        setError("Transaction cancelled by user")
      } else if (message.includes("insufficient funds")) {
        setError("Insufficient funds for transaction")
      } else {
        setError("Transaction failed. Please try again.")
      }
    }
  }, [isSendError, sendError])

  useEffect(() => {
    if (isConfirmError && confirmError) {
      setState("error")
      setError("Transaction confirmation failed. Please check the transaction and try again.")
    }
  }, [isConfirmError, confirmError])

  /**
   * Check if user is on correct network
   */
  const isCorrectNetwork = chainId === NETWORK_CONFIG.CHAIN_ID

  /**
   * Main payment function
   */
  const payToReveal = useCallback(() => {
    // Reset error state
    setError(null)

    // Check if wallet is connected
    if (!isConnected) {
      // In mini app mode, auto-connect to Farcaster wallet
      if (isMiniApp && connectors.length > 0) {
        setState("connecting")
        connect({ connector: connectors[0] })
      } else {
        setError("Please connect your wallet first")
        setState("error")
      }
      return
    }

    // Check if on correct network
    if (!isCorrectNetwork) {
      setError(`Please switch to ${NETWORK_CONFIG.NETWORK_NAME} network`)
      setState("error")
      return
    }

    // Validate recipient address
    if (PAYMENT_CONFIG.RECIPIENT_ADDRESS === "YOUR_ETH_ADDRESS_HERE") {
      setError("Payment address not configured. Please contact the developer.")
      setState("error")
      return
    }

    // Send transaction
    try {
      sendTransaction({
        to: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
        value: parseEther(PAYMENT_CONFIG.AMOUNT_ETH),
      })
    } catch (err) {
      console.error("Error sending transaction:", err)
      setError("Failed to send transaction. Please try again.")
      setState("error")
    }
  }, [isConnected, isMiniApp, isCorrectNetwork, connectors, connect, sendTransaction])

  /**
   * Reset function for retry
   */
  const reset = useCallback(() => {
    setState(isConnected ? "ready" : "idle")
    setError(null)
    // Note: We don't reset isRevealed - once revealed, stays revealed
  }, [isConnected])

  /**
   * Determine loading state
   */
  const isLoading = state === "connecting" || state === "pending" || state === "confirming"

  return {
    state,
    isRevealed,
    isLoading,
    error,
    address,
    isConnected,
    payToReveal,
    reset,
    txHash,
    isMiniApp,
  }
}

/**
 * USAGE EXAMPLE:
 *
 * ```tsx
 * function ResultsScreen() {
 *   const {
 *     isRevealed,
 *     isLoading,
 *     error,
 *     payToReveal,
 *     state,
 *   } = usePayToReveal()
 *
 *   if (!isRevealed) {
 *     return (
 *       <div>
 *         <p>Pay 0.00001 ETH to reveal your score</p>
 *         <button onClick={payToReveal} disabled={isLoading}>
 *           {isLoading ? 'Processing...' : 'Reveal Score'}
 *         </button>
 *         {error && <p className="text-red-500">{error}</p>}
 *       </div>
 *     )
 *   }
 *
 *   return <div>Your score: {score}</div>
 * }
 * ```
 *
 * EDGE CASES HANDLED:
 * - User not connected (prompts connection in mini app)
 * - Wrong network (shows error)
 * - User cancels transaction (shows cancellation message)
 * - Insufficient funds (shows insufficient funds error)
 * - Transaction fails (allows retry)
 * - Address not configured (shows configuration error)
 *
 * STATE TRANSITIONS:
 * idle -> connecting -> ready -> pending -> confirming -> success
 *                                        -> error (can retry)
 */
