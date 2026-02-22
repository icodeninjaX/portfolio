# Multiplayer Office FPS — PartyKit Guide

## What Is PartyKit?

PartyKit is a serverless WebSocket hosting platform. It runs your real-time server code on Cloudflare's edge network. You write a simple TypeScript class that handles `onConnect`, `onMessage`, and `onClose`, and PartyKit deploys it globally with zero infrastructure management.

In this project, PartyKit powers the multiplayer — it relays player positions, weapon states, shots, and hits between all connected browsers in real time.

## How It Works

```
Browser A  ── position/weapon/shots ──▶  PartyKit Server  ◀── Browser B
Browser A  ◀── remote player states ───  (party/game.ts)  ──▶ Browser B
```

- **`party/game.ts`** — The server. It keeps a `Map` of connected players, broadcasts state updates at the rate clients send them (~20Hz), and relays shot/hit events instantly.
- **`lib/useMultiplayer.ts`** — Client hook. Connects via WebSocket, sends local player state 20 times/second, receives and interpolates remote player positions.
- **`components/creative/RemotePlayers.tsx`** — Renders other players in the 3D scene with animated bodies, name tags, and weapons.

## Local Development

You need **two terminals** running simultaneously:

```bash
# Terminal 1: PartyKit dev server (WebSocket server on port 1999)
npx partykit dev

# Terminal 2: Next.js dev server
bun run dev
```

Then open two browser tabs to `http://localhost:3000/creative`. You should see "Online: 2 players" in the top-left HUD.

## Deploying to Production

### Step 1: Deploy the PartyKit Server

PartyKit has its own hosting (free tier available). You deploy the WebSocket server separately from your Next.js app.

```bash
# First time: log in to PartyKit (creates account via GitHub)
npx partykit login

# Deploy the server
npx partykit deploy
```

After deploying, PartyKit gives you a URL like:
```
https://portfolio-multiplayer.YOUR_USERNAME.partykit.dev
```

### Step 2: Set the Environment Variable

Update your Next.js hosting provider (Vercel, Netlify, etc.) with the PartyKit URL.

**On Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_PARTYKIT_HOST` = `portfolio-multiplayer.YOUR_USERNAME.partykit.dev`
3. Redeploy

**Or in `.env.production`:**
```
NEXT_PUBLIC_PARTYKIT_HOST=portfolio-multiplayer.YOUR_USERNAME.partykit.dev
```

### Step 3: Deploy Next.js

Deploy your Next.js app as usual (e.g., `git push` if using Vercel auto-deploy, or `vercel --prod`).

That's it — the Next.js frontend connects to PartyKit's hosted WebSocket server automatically.

## Architecture Notes

- **Two separate deployments**: Next.js (your site) + PartyKit (WebSocket server). They are independent services.
- **No database**: Player state lives in memory on the PartyKit server. When all players disconnect, the room is empty. This is intentional for a portfolio project.
- **Free tier**: PartyKit's free tier supports up to 100 concurrent connections per project, which is plenty for a portfolio.
- **Global edge**: PartyKit runs on Cloudflare Workers, so WebSocket connections are fast worldwide.

## Configuration Files

| File | Purpose |
|---|---|
| `partykit.json` | PartyKit project config (name + entry point) |
| `party/game.ts` | WebSocket server code |
| `.env.local` | Local dev: `NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999` |

## Useful Commands

```bash
# Local dev server
npx partykit dev

# Deploy to production
npx partykit deploy

# View deployment logs
npx partykit tail

# Login to PartyKit
npx partykit login

# Check current deployment info
npx partykit info
```

## Troubleshooting

**"Connecting..." badge never turns green locally:**
- Make sure `npx partykit dev` is running in a separate terminal
- Check that `.env.local` has `NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999`

**Players don't see each other in production:**
- Verify the `NEXT_PUBLIC_PARTYKIT_HOST` env var is set correctly on your hosting provider (no `https://` prefix, just the hostname)
- Redeploy Next.js after changing env vars

**Build errors with partykit imports:**
- The `party/game.ts` file uses PartyKit server types that are only resolved by the PartyKit CLI, not by Next.js. This is fine — Next.js never imports that file.
