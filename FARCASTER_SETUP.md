# Farcaster Mini App Setup Guide

This guide will walk you through completing the setup of your Signal Creator Quiz as a Farcaster Mini App with on-chain payment gating.

## 📋 Overview

Your quiz app has been transformed into a Farcaster Mini App with the following features:

- ✅ Farcaster SDK integration
- ✅ Conditional Wagmi connector (only in mini app mode)
- ✅ Payment gate requiring 0.00001 ETH on Base network
- ✅ Automatic environment detection
- ✅ Fallback for non-mini-app environments

## 🔧 Configuration Steps

### Step 1: Update Your Ethereum Address

**File:** `lib/constants.ts`

Replace `YOUR_ETH_ADDRESS_HERE` with your actual Ethereum address:

```typescript
export const PAYMENT_CONFIG = {
  RECIPIENT_ADDRESS: "0x1234567890123456789012345678901234567890" as `0x${string}`, // ← YOUR ADDRESS
  AMOUNT_ETH: "0.00001",
  AMOUNT_WEI: BigInt("10000000000000"),
} as const
```

### Step 2: Update Your Domain

Update your domain in the following files:

**File:** `lib/constants.ts`

```typescript
export const MINIAPP_CONFIG = {
  HOME_URL: "https://yourdomain.com", // ← YOUR DOMAIN
  APP_NAME: "Signal Creator Quiz",
  APP_DESCRIPTION: "Discover your content creator type with the Signal Creator Quiz",
} as const
```

**File:** `app/layout.tsx`

Update all instances of `https://yourdomain.com` with your actual domain:

```typescript
other: {
  'fc:frame': 'vNext',
  'fc:frame:image': 'https://yourdomain.com/og-image.png', // ← YOUR DOMAIN
  'fc:frame:button:1': 'Take Quiz',
  'fc:frame:post_url': 'https://yourdomain.com', // ← YOUR DOMAIN
},
```

And in the `<head>` section:

```html
<meta name="fc:frame:image" content="https://yourdomain.com/og-image.png" />
<meta name="fc:frame:post_url" content="https://yourdomain.com" />
```

**File:** `public/.well-known/farcaster.json`

```json
{
  "miniapp": {
    "homeUrl": "https://yourdomain.com", // ← YOUR DOMAIN
    "iconUrl": "https://yourdomain.com/icon.png", // ← YOUR DOMAIN
    "splashImageUrl": "https://yourdomain.com/splash.png" // ← YOUR DOMAIN
  }
}
```

### Step 3: Create Required Images

You need to create the following images:

1. **App Icon** (`public/icon.png`):
   - Size: 1024x1024 pixels
   - Format: PNG
   - Represents your app in Farcaster

2. **Splash Image** (`public/splash.png`):
   - Size: 1920x1080 pixels (recommended)
   - Format: PNG
   - Shown while your app loads

3. **OG Image** (`public/og-image.png`):
   - Size: 1200x630 pixels
   - Format: PNG
   - Used for social sharing previews

### Step 4: Generate Account Association Signature

The `accountAssociation` in your manifest must be cryptographically signed to prove domain ownership.

#### Method 1: Using Warpcast Mobile App (Recommended)

1. Open Warpcast on your mobile device
2. Go to **Settings → Developer → Domains**
3. Enter your domain (e.g., `yourdomain.com`)
4. Click **Generate Domain Manifest**
5. Copy the `accountAssociation` object
6. Paste it into `public/.well-known/farcaster.json`

#### Method 2: Using Warpcast Desktop

1. Enable Developer Mode in Warpcast:
   - Visit: https://farcaster.xyz/~/settings/developer-tools
   - Toggle on "Developer Mode"

2. Navigate to the Mini App Manifest Tool:
   - Look for "Developer" section in the left sidebar
   - Find "Manifest Generator" or similar tool

3. Enter your domain and generate the signature

4. Copy the generated `accountAssociation` object

#### Method 3: Using CLI (Advanced)

If available, you can use the Farcaster CLI:

```bash
# This will open a browser window for signing
npx @farcaster/manifest-tool generate
```

**IMPORTANT NOTES:**

- The wallet you use to sign MUST be your Farcaster custody wallet
- You can find your recovery phrase in Warpcast:
  - Settings → Advanced → Farcaster recovery phrase
- Import this wallet to MetaMask or your preferred wallet if needed
- The signature ties your domain to your Farcaster identity (FID)

### Step 5: Update the Manifest File

After generating the signature, update `public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "eyJ0eXAiOiJKV1QiLCJhbGc...", // ← FROM MANIFEST TOOL
    "payload": "eyJkb21haW4iOiJ5b3VyZG...", // ← FROM MANIFEST TOOL
    "signature": "0x1234567890abcdef..." // ← FROM MANIFEST TOOL
  },
  "miniapp": {
    // ... rest of your miniapp config
  }
}
```

### Step 6: Deploy Your App

1. Build your app:

```bash
npm run build
# or
pnpm build
```

2. Deploy to your hosting provider (Vercel, Netlify, etc.)

3. Ensure the manifest is accessible at:
   ```
   https://yourdomain.com/.well-known/farcaster.json
   ```

4. Test the manifest URL in your browser to verify it's publicly accessible

### Step 7: Test Your Mini App

1. Open Warpcast (mobile or desktop)

2. Enable Developer Mode if not already enabled:
   - Visit: https://farcaster.xyz/~/settings/developer-tools

3. Use the Mini App Preview tool:
   - Navigate to the Developer section
   - Find "Preview Mini App" or similar
   - Enter your app URL: `https://yourdomain.com`

4. Test the full flow:
   - Take the quiz
   - Verify payment gate appears
   - Complete payment (use testnet first if possible)
   - Verify results are revealed after payment

### Step 8: Publish Your Mini App

Once testing is complete:

1. In Warpcast, navigate to the Mini App submission area
2. Submit your app URL
3. Wait for review and approval
4. Your app will be discoverable in Farcaster!

## 🔍 Troubleshooting

### Common Issues

#### Issue: "Invalid manifest signature"

**Solution:**
- Ensure you signed with your Farcaster custody wallet
- Verify the domain in the manifest matches your deployed domain exactly
- Regenerate the signature if the domain changed

#### Issue: "Wallet not connecting in mini app"

**Solution:**
- Check browser console for errors
- Verify `sdk.isInMiniApp()` is resolving correctly
- Ensure you called `sdk.actions.ready()` (this is automatic in our setup)

#### Issue: "Payment not working"

**Solution:**
- Verify `RECIPIENT_ADDRESS` in `lib/constants.ts` is valid
- Check that you're on Base network (chainId: 8453)
- Ensure user has sufficient ETH for gas + payment amount
- Check browser console for transaction errors

#### Issue: "App shows loading screen forever"

**Solution:**
- This means `sdk.actions.ready()` wasn't called
- Check the FarcasterProvider component is wrapping your app
- Look for errors in the browser console during initialization

#### Issue: "Manifest not found (404)"

**Solution:**
- Verify `public/.well-known/farcaster.json` exists
- Check your deployment includes the `.well-known` directory
- Some build tools skip hidden files - configure to include them
- In Next.js, files in `public/` should be served automatically

### Testing in Development

To test locally before deploying:

1. Run your dev server:
```bash
npm run dev
```

2. Use a tool like `ngrok` to expose your localhost:
```bash
ngrok http 3000
```

3. Use the ngrok URL (e.g., `https://abc123.ngrok.io`) as your temporary domain

4. Generate a manifest signature for this temporary domain

5. Test in Warpcast using the ngrok URL

## 📊 Architecture Overview

### File Structure

```
signal-creator-quiz-v1/
├── app/
│   ├── layout.tsx                    # ✅ Updated with FarcasterProvider
│   └── page.tsx                      # No changes needed
├── components/
│   └── results-screen.tsx            # ✅ Updated with payment gate
├── hooks/
│   └── use-pay-to-reveal.ts          # ✅ NEW: Payment hook
├── lib/
│   ├── constants.ts                  # ✅ NEW: Configuration
│   ├── farcaster-provider.tsx        # ✅ NEW: Main provider
│   └── wagmi-config.ts               # ✅ NEW: Conditional config
└── public/
    └── .well-known/
        └── farcaster.json            # ✅ NEW: Manifest file
```

### How It Works

1. **Environment Detection:**
   - `FarcasterProvider` calls `sdk.isInMiniApp()` on mount
   - Detects if running in Farcaster or regular browser
   - Creates appropriate Wagmi config based on environment

2. **Conditional Connector Registration:**
   - In mini app: Registers ONLY `farcasterMiniApp` connector
   - In browser: No connectors (or add MetaMask, etc.)
   - Prevents conflicts between wallet types

3. **Payment Flow:**
   - User completes quiz
   - If in mini app mode: Shows payment gate
   - If in browser mode: Bypasses gate (better UX for testing)
   - User pays 0.00001 ETH on Base
   - Transaction confirms
   - Score is revealed

4. **Fallback Logic:**
   - Non-mini-app environments: Payment gate disabled
   - Network mismatch: Shows error message
   - User cancels transaction: Allows retry
   - Connection failures: Graceful error handling

## 🔐 Security Considerations

1. **Payment Address:**
   - Double-check your address before deploying
   - Test with a small payment first
   - Consider using a multisig for larger deployments

2. **Network:**
   - App is configured for Base network only
   - Users on other networks will see an error
   - This is intentional for security

3. **Manifest Signature:**
   - Never share your Farcaster custody wallet private key
   - The signature proves you own the domain
   - Regenerate if you suspect compromise

## 📚 Additional Resources

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz)
- [Wagmi Documentation](https://wagmi.sh)
- [Base Network Documentation](https://docs.base.org)
- [Farcaster Developer Discord](https://discord.com/invite/farcaster)

## 🎉 Next Steps

After deployment:

1. Share your mini app URL in Farcaster feeds
2. Monitor payments and user engagement
3. Consider adding analytics
4. Iterate based on user feedback

## ❓ Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Review this guide thoroughly
3. Search Farcaster developer documentation
4. Ask in Farcaster developer channels

Good luck with your Signal Creator Quiz Mini App! 🚀
