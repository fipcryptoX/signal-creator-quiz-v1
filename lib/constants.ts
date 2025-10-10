/**
 * Configuration constants for the Signal Creator Quiz Mini App
 *
 * IMPORTANT: Replace YOUR_ETH_ADDRESS_HERE with your actual Ethereum address
 * before deploying to production.
 */

// Payment configuration
export const PAYMENT_CONFIG = {
  // The recipient address for the payment to reveal quiz results
  RECIPIENT_ADDRESS: "0x1A73665e17bFb07a8A9cE4Ab0bc2db71b36B38e4" as `0x${string}`,

  // Amount in ETH (0.00001 ETH)
  AMOUNT_ETH: "0.00001",

  // Amount in Wei (for transaction precision)
  AMOUNT_WEI: BigInt("10000000000000"), // 0.00001 ETH = 10^13 wei
} as const

// Network configuration
export const NETWORK_CONFIG = {
  // Base network chain ID
  CHAIN_ID: 8453,

  // Network name for display
  NETWORK_NAME: "Base",
} as const

// Farcaster Mini App configuration
export const MINIAPP_CONFIG = {
  // Your app's home URL (update this with your actual domain)
  HOME_URL: "https://annamae-lyrical-leadingly.ngrok-free.dev",

  // App metadata
  APP_NAME: "Signal Creator Quiz",
  APP_DESCRIPTION: "Discover your content creator type with the Signal Creator Quiz",
} as const
