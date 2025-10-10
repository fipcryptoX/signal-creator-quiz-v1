"use client"

/**
 * Farcaster Provider Component
 *
 * This provider handles:
 * 1. Farcaster SDK initialization
 * 2. Mini app environment detection
 * 3. Conditional Wagmi configuration
 * 4. Making mini app context available throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { WagmiProvider, Config } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { sdk } from "@farcaster/miniapp-sdk"
import { createWagmiConfig } from "./wagmi-config"

/**
 * Context shape for Farcaster Mini App
 */
interface FarcasterContextType {
  // Whether the app is running in a Farcaster Mini App
  isMiniApp: boolean
  // Whether the detection is still loading
  isLoading: boolean
  // Whether an error occurred during detection
  error: Error | null
  // The Farcaster SDK instance (always available)
  sdk: typeof sdk
  // Context from the Farcaster client (only available in mini app)
  context: typeof sdk.context | null
}

/**
 * Create the context
 */
const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined)

/**
 * Hook to use the Farcaster context
 */
export function useFarcaster() {
  const context = useContext(FarcasterContext)
  if (context === undefined) {
    throw new Error("useFarcaster must be used within a FarcasterProvider")
  }
  return context
}

/**
 * React Query client for Wagmi
 * Created once to avoid recreation on every render
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus in mini app context
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * Props for FarcasterProvider
 */
interface FarcasterProviderProps {
  children: ReactNode
}

/**
 * Farcaster Provider Component
 *
 * This component:
 * 1. Detects if we're in a Farcaster Mini App using sdk.isInMiniApp()
 * 2. Creates appropriate Wagmi config based on environment
 * 3. Calls sdk.actions.ready() when in mini app mode
 * 4. Provides context to child components
 */
export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [isMiniApp, setIsMiniApp] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null)
  const [farcasterContext, setFarcasterContext] = useState<typeof sdk.context | null>(null)

  useEffect(() => {
    let mounted = true

    // Suppress origin mismatch errors in development (expected with ngrok)
    const originalError = console.error
    console.error = (...args) => {
      if (args[0]?.includes?.("origins don't match")) {
        // Ignore origin mismatch errors in development
        return
      }
      originalError.apply(console, args)
    }

    async function detectEnvironment() {
      try {
        console.log("🔍 Starting Farcaster detection...")

        // Detect if we're in a Farcaster Mini App
        // This uses environment checks and postMessage communication
        // Timeout after 5 seconds to avoid hanging (increased from 3s)
        console.log("🔍 Calling sdk.isInMiniApp()...")
        let inMiniApp = await sdk.isInMiniApp({ timeoutMs: 5000 })
        console.log("🔍 Detection result:", inMiniApp)

        // TEMPORARY TESTING OVERRIDE: Force mini app mode if in iframe
        // This bypasses signature verification for testing with ngrok
        // REMOVE THIS BEFORE PRODUCTION DEPLOYMENT
        const isInIframe = window.self !== window.top
        if (!inMiniApp && isInIframe) {
          console.log("⚠️ TESTING MODE: Forcing mini app detection (in iframe)")
          console.log("⚠️ This bypasses signature verification - remove before production!")
          inMiniApp = true
        }

        if (!mounted) return

        setIsMiniApp(inMiniApp)

        // Create Wagmi config based on detected environment
        const config = createWagmiConfig(inMiniApp)
        setWagmiConfig(config)

        if (inMiniApp) {
          // Get the Farcaster context (user info, client info, etc.)
          console.log("🔍 Getting Farcaster context...")

          try {
            // Attempt to access context - requires valid manifest signature
            const context = sdk.context
            setFarcasterContext(context)

            console.log("✅ Farcaster Mini App initialized", {
              user: context.user,
              client: context.client,
            })
          } catch (contextError) {
            console.warn("⚠️ Could not access Farcaster context (missing valid manifest signature)")
            console.warn("⚠️ User features (leaderboard, sharing) will be disabled")
            console.warn("⚠️ Payment gate will still work!")
            // Leave context as null - app will work without user context
          }
        } else {
          console.log("ℹ️ Running in regular web mode (not a Farcaster Mini App)")
          console.log("🔍 Window location:", window.location.href)
          console.log("🔍 Is in iframe:", window.self !== window.top)
        }
      } catch (err) {
        if (!mounted) return

        console.error("❌ Error detecting Farcaster environment:", err)
        setError(err instanceof Error ? err : new Error("Unknown error"))

        // Create fallback config for regular web mode
        const config = createWagmiConfig(false)
        setWagmiConfig(config)
      } finally {
        if (mounted) {
          setIsLoading(false)

          // Call ready() AFTER loading is complete and content is ready to display
          // This hides the splash screen and shows the app
          try {
            await sdk.actions.ready()
            console.log("✅ Called sdk.actions.ready() - splash screen hidden")
          } catch (err) {
            console.log("⚠️ ready() call failed (expected in non-mini-app):", err)
          }
        }
      }
    }

    detectEnvironment()

    return () => {
      mounted = false
      // Restore original console.error
      console.error = originalError
    }
  }, [])

  // Show loading state while detecting environment
  if (isLoading || !wagmiConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Provide context to children
  const contextValue: FarcasterContextType = {
    isMiniApp,
    isLoading,
    error,
    sdk,
    context: farcasterContext,
  }

  return (
    <FarcasterContext.Provider value={contextValue}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </FarcasterContext.Provider>
  )
}

/**
 * USAGE NOTES:
 *
 * 1. Wrap your app with this provider in app/layout.tsx
 * 2. Use the useFarcaster() hook in any component to access:
 *    - isMiniApp: boolean indicating if in mini app
 *    - sdk: Farcaster SDK instance
 *    - context: User and client info (only in mini app)
 *
 * 3. The provider automatically:
 *    - Detects the environment on mount
 *    - Creates appropriate Wagmi config
 *    - Calls sdk.actions.ready() in mini app mode
 *    - Provides fallback for non-mini-app mode
 *
 * EDGE CASES HANDLED:
 * - Component unmounting during async detection (mounted flag)
 * - Detection timeout (3 second timeout)
 * - Errors during detection (error state + fallback config)
 * - Non-mini-app environments (graceful fallback)
 */
