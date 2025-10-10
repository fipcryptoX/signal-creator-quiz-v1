/**
 * Wagmi Configuration with Conditional Farcaster Mini App Connector
 *
 * This file implements conditional connector registration to avoid conflicts
 * between mini app and non-mini app environments.
 *
 * KEY CONCEPT: The Farcaster connector should ONLY be registered when running
 * inside a Farcaster Mini App. If it's always registered globally, it can
 * cause conflicts in normal browser environments where other wallet connectors
 * (MetaMask, Coinbase Wallet, etc.) should be used instead.
 *
 * APPROACH:
 * 1. Detect if we're in a mini app environment using sdk.isInMiniApp()
 * 2. If yes: Register ONLY the Farcaster connector
 * 3. If no: Register standard wallet connectors (MetaMask, Coinbase, etc.)
 */

import { http, createConfig, CreateConnectorFn } from "wagmi"
import { base } from "wagmi/chains"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"
import { NETWORK_CONFIG } from "./constants"

/**
 * Type-safe connector configuration
 */
type ConnectorConfig = {
  isMiniApp: boolean
  connectors: CreateConnectorFn[]
}

/**
 * Get the appropriate connectors based on the environment
 *
 * @param isMiniApp - Whether the app is running in a Farcaster Mini App
 * @returns Array of connector functions
 */
function getConnectors(isMiniApp: boolean): CreateConnectorFn[] {
  if (isMiniApp) {
    // In mini app environment: ONLY use Farcaster connector
    // This connector automatically connects to the user's wallet in Farcaster
    return [farcasterMiniApp()]
  } else {
    // In regular web environment: Use standard wallet connectors
    // You can add MetaMask, Coinbase Wallet, WalletConnect, etc. here
    // For this implementation, we'll return an empty array as a fallback
    // since the quiz should primarily run as a mini app
    return []

    // Example of adding standard connectors:
    // import { metaMask, coinbaseWallet } from 'wagmi/connectors'
    // return [metaMask(), coinbaseWallet()]
  }
}

/**
 * Create Wagmi configuration with conditional connector registration
 *
 * @param isMiniApp - Whether the app is running in a Farcaster Mini App
 * @returns Wagmi configuration object
 */
export function createWagmiConfig(isMiniApp: boolean) {
  const connectors = getConnectors(isMiniApp)

  return createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
    connectors,
    // Enable auto-connect for better UX
    // In mini app mode, this will auto-connect to the Farcaster wallet
    // @ts-ignore - wagmi v2 config types
    autoConnect: isMiniApp,
  })
}

/**
 * USAGE NOTE:
 *
 * This config should be created AFTER detecting the mini app environment.
 * See lib/farcaster-provider.tsx for the implementation of environment
 * detection and dynamic config creation.
 *
 * The config is NOT exported as a constant because it depends on runtime
 * environment detection. Instead, it's created dynamically in the provider.
 */
