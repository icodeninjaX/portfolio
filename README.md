This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Inside the Build homepage

The homepage uses one scroll-driven 3D studio; `/resume` is the simple, printable view and `/creative` remains the separate office experience. Content lives in `lib/data.ts`, scene code in `components/cinematic/`, and locally stored media in `public/studio/`.

The scroll journey stays continuously in 3D. Each project is presented as a scroll-controlled interface walkthrough inside one 3D browser. The cursor clicks navigation, the view changes, a record detail opens in depth, and the next view appears. Scrolling pauses and reverses every action. These are local animated demonstrations based on the real interfaces, not live sessions connected to the project backends. Static fallbacks use the corresponding project view.

The implementation, verification evidence, unresolved source claims and performance limits are documented in [.claude/plans/next-level-portfolio.md](.claude/plans/next-level-portfolio.md). Exact generated asset prompts, models, job IDs and the unresolved estimate-versus-balance discrepancy are recorded in [docs/studio-assets.json](docs/studio-assets.json).

Browser checks use an existing Playwright installation (no added project dependency): set `PLAYWRIGHT_MODULE`, start `bun run dev`, then run `node scripts/verify-studio.mjs` and `node scripts/verify-studio-extended.mjs`. For transfer and frame measurements, serve a production build on port 3001 and run `node scripts/measure-studio.mjs`. Results are saved to ignored `.artifacts/`.
