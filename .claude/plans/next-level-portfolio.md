# Next-Level Portfolio Redesign Plan

Transform the current basic resume layout into an impressive, professional portfolio that still reads like a resume but feels like a modern web experience.

---

## Phase 1: Visual Polish & Micro-Interactions

### 1.1 Animated Entry
- Staggered fade-in + slide-up animation for each section as the page loads
- Subtle scale-in for the profile image
- No external animation library — use CSS `@keyframes` + Tailwind `animate-` utilities

### 1.2 Section Hover Effects
- Cards lift slightly on hover with enhanced shadow (`translateY(-2px)`)
- Timeline dots pulse subtly on the active/current role
- Project cards get a left-accent border on hover

### 1.3 Typography Upgrade
- Use `font-display: swap` for better loading
- Add a subtle gradient to the name heading (accent color gradient)
- Improve hierarchy: larger name, more contrast between headings and body

### 1.4 Status Badge
- "Available for hire" or "Currently employed" badge next to the title
- Small animated dot (green pulse) if available

---

## Phase 2: Interactive Elements

### 2.1 Scroll Progress Indicator
- Thin accent-colored progress bar at the top of the page
- Shows how far the user has scrolled

### 2.2 Sticky Navigation
- Minimal floating nav (sticky top) with section links: About, Experience, Skills, Projects, Education
- Active section highlights as user scrolls
- Smooth scroll on click
- Auto-hides when scrolling down, shows on scroll up

### 2.3 Theme Toggle
- Light/dark mode toggle button (top-right corner)
- Smooth transition between themes
- Persist preference in localStorage

### 2.4 Project Cards Enhancement
- Expandable project cards — click to reveal more details
- Show a "tech breakdown" or architecture notes on expand
- Add project status badges (Live, In Development, Local Only)

---

## Phase 3: Rich Content Sections

### 3.1 Tech Stack Visualization
- Replace plain skill tags with a visual skill grid
- Group by proficiency level (Expert, Proficient, Familiar)
- Or use a compact bar/dot rating system next to each skill

### 3.2 Experience Timeline Enhancement
- Add company logos/icons (or colored initials as fallback)
- Show duration badges ("1yr 6mo", "4mo")
- Collapsible highlights for cleaner look

### 3.3 GitHub Activity Integration
- Fetch and display GitHub contribution data or pinned repos
- Show live repo stats (stars, language) for linked projects
- Uses GitHub API via server component

### 3.4 Contact Section / Footer
- Dedicated contact section at the bottom
- "Download Resume as PDF" button (uses browser print styles)
- Social links with icons
- "Built with Next.js" footer credit

---

## Phase 4: Performance & SEO

### 4.1 Metadata & SEO
- Open Graph tags with a generated OG image
- Structured data (JSON-LD) for Person schema
- Proper meta description, canonical URL

### 4.2 Performance
- Optimize images with Next.js Image component (already done)
- Lazy load below-the-fold sections
- Preload critical fonts

### 4.3 Accessibility
- Proper ARIA landmarks for all sections
- Keyboard navigation for interactive elements
- Focus-visible rings on all interactive elements
- Screen reader friendly section headings

---

## Phase 5: Advanced Features (Optional)

### 5.1 Command Palette (Ctrl+K)
- Quick navigation to any section
- Quick actions: download PDF, toggle theme, view GitHub
- Adds a "power user" feel

### 5.2 Visitor Analytics
- Simple, privacy-friendly analytics (e.g., Vercel Analytics)
- No cookies, no tracking

### 5.3 Blog/Writing Section
- Optional markdown-based blog
- Show latest 2-3 posts on the main page

### 5.4 Testimonials/Recommendations
- Short quotes from colleagues or clients
- Carousel or static cards

---

## Implementation Priority (Recommended Order)

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| 1 | Animated entry + hover effects | High | Low |
| 2 | Theme toggle (light/dark) | High | Low |
| 3 | Sticky nav with smooth scroll | High | Medium |
| 4 | Project status badges + expandable cards | High | Medium |
| 5 | Scroll progress bar | Medium | Low |
| 6 | Contact footer + PDF download | High | Low |
| 7 | Skill proficiency visualization | Medium | Medium |
| 8 | Experience duration badges + logos | Medium | Low |
| 9 | GitHub integration | Medium | Medium |
| 10 | SEO + structured data | High | Low |
| 11 | Command palette | Low | High |
| 12 | Blog section | Low | High |

---

## Tech Approach
- **No new heavy dependencies** — use CSS animations, React hooks, and Next.js built-ins
- Only add a library if it saves significant effort (e.g., `framer-motion` for complex animations)
- Keep everything in server components where possible, use `"use client"` only where interactivity is required
- All data still driven from `lib/data.ts`

---

## Implemented: Inside the Build — 2026-09-25

This implementation supersedes the optional animation, proficiency-ranking, and resume-first directions above. Historical plan and UX audit findings remain intact.

### Delivered

- `/` is now the five-chapter portfolio: immediate identity/contact, three selected projects, full-stack layers, experience/person/education, and contact.
- One deferred R3F canvas. Architectural frame, three real screenshot displays, native document scroll, reversible gallery rearrangement, camera dolly/orbit, separated layers and a settled ending. No office gameplay imported.
- Typed poses, responsive cameras, chapter ranges, assets, text-safe regions and static states in `components/cinematic/chapters.ts`. Section positions are measured, refreshed with ResizeObserver, fonts, viewport changes and pageshow. One progress source drives 3D and video.
- HTML content stays server-rendered and sourced from `lib/data.ts`. New qualitative summaries avoid promoting unsupported metrics. Portrait, slugs and public destinations are retained.
- `/resume` reuses resume components, adds a static identity, ordinary skill list, print action and print-specific colors. Project screenshots have real dimensions and links to full-size originals.
- Both themes, keyboard skip/focus, router-aware anchors, persistent reduced-effects control, system reduced motion and supported save-data detection. Low-effects mode skips the 3D import, textures and video; representative static states replace motion. Blocked storage still permits session preferences.
- Demand rendering stops at rest; rendering suspends while hidden/offscreen or while video is presented. DPR caps at 1.5. Shared box geometry/materials, three 1024px textures, small procedural reflection environment, no postprocessing. Owned geometry, materials, environment and textures are disposed. Image, video and WebGL failures preserve readable HTML and a static fallback.
- The separate `/creative`, `/about`, `/experience`, and existing project routes remain available. No production dependencies, coding-model change, deployment, push, hook bypass or check suppression.

### Assets and spending

See `docs/studio-assets.json` for exact prompts, settings, IDs, dimensions, paths, cost estimates and review notes. Assets are local under `public/studio/`; no expiring generation URLs or credentials are used by the site.

- Two GPT Image 2 (`gpt_image_2`) stills: 1K medium, landscape 4:3 and portrait 3:4, using inspected blank-screen captures of the actual 3D blockout. Compressed posters: 22,222 and 8,682 bytes. Originals: 1168×880 and 880×1168; delivery portrait: 640×849. No project screenshots, faces or client data uploaded.
- One Seedance 2.5 (`seedance_2_5`) silent clip: requested 5s / 720p, returned 1112×834 / 5.042s. Delivery transcode is 960×720, H.264, 24fps, GOP 6, CRF 24, faststart, no audio, 598,552 bytes. The video is fetched only near the work-to-layers transition. Metadata gating, clamping, seek coalescing, reconciliation, and stepped fallback after repeatedly slow seeks are implemented.
- Visual review accepts the video as a labeled illustration: it fans panels apart rather than exactly reproducing vertical layer separation, with mild generated edge shimmer. The coded scene provides the precise layer state. No endpoint or frame-perfect generation claim.
- Approved cap: 39 credits. Preflights: 1 + 1 + 35 = 37 credits. **Billing discrepancy:** account balance changed from 1810 to 1766.5 (43.5 credits). MCP offers no itemized charge lookup, so actual job-level charges and the reason for the discrepancy remain unresolved. No further generation submitted. Do not describe 37 as verified spend or claim the observed balance delta is within the cap.

### Verification and evidence

Baseline `bun run build`: passed. Baseline `bun run lint`: 45 errors and 2 warnings in existing creative, navigation/theme and projects files. Final repository lint retains that same failure count; changed production files and verification scripts pass targeted ESLint. Type checking and production build pass.

Browser: local headless Chrome through existing bundled Playwright, using real WebGL with SwiftShader enabled; no browser/testing dependency added to the project. This is viewport emulation, not physical-device certification.

- 320, 360, 390, 430, 768, 1024, 1440 CSS px: no horizontal page overflow, one shared canvas, immediate identity and contact/navigation available.
- Inspected opening, each project, exploded layers, experience, final frame, light/dark and mobile evidence; fixed print heading colors after visual inspection.
- Fast/reverse scroll, direct chapter anchor, reload mid-page, browser back after an anchor and case study, portrait/landscape and height changes.
- Keyboard skip link focuses main content. Both themes, stored/system reduced effects, save-data, blocked storage, missing images, failed video, unsupported and lost WebGL exercised. Reduced modes request no scene textures or video. Production resource comparison confirms deferred scene JS is absent in reduced mode.
- Idle render frame counter stays unchanged; offscreen counter remains unchanged through tab return and scrolling. 3D counter stays unchanged while video is displayed. Local video seeks reconcile in both directions (observed roughly 2–70 ms; no claim about all devices).
- `/resume`, selected detail pages, `/about`, `/experience`, `/creative`: HTTP 200 and browser smoke checks. Three-page print PDF captured; print media inspected. No-JavaScript HTML and cross-tab theme synchronization also pass. TRACKY, Coop-Tracker and GitHub returned public HTTP 200; LinkedIn returned anti-automation HTTP 999 and cannot be independently verified here. Mailto destination matches source; no email sent.

Reproducible scripts: `scripts/verify-studio.mjs`, `scripts/verify-studio-extended.mjs`, `scripts/measure-studio.mjs`. Set `PLAYWRIGHT_MODULE` to an installed Playwright package. Run with Node; default app is localhost:3000; measurement uses the production server at localhost:3001. Evidence is generated in ignored `.artifacts/` (screenshots, reports, resume PDF and browser recordings).

### Measured budgets and limitations

Production localhost, 1440×1000, device scale 2 capped at 1.5 for WebGL:

| Item | Observed transfer / behavior |
| --- | --- |
| Initial HTML | 10,481 compressed bytes (51,257 decoded) |
| Fonts | 111,232 bytes |
| Desktop poster | 22,222 bytes |
| Base JavaScript | 157,042 compressed bytes |
| Deferred 3D JavaScript | 237,565 compressed bytes |
| Three screenshot textures | 50,066 bytes; 1024px wide, intact proportions |
| Initial video transfer | 0 bytes |
| Video near transition | 598,552-byte local file |
| 3D draw calls | 20–28 across measured states |
| Texture count | 5 renderer textures including internal/environment textures |
| Canvas | 1058×1194 backing pixels for ~706×796 CSS pixels |
| Seven-second scroll measurement | 524 frames; p50 13.3ms, p95 13.4ms; no >50ms frame in that sample |

These are local measurements, not field Core Web Vitals or a Lighthouse score. Initial graphics startup still recorded a main-thread long task up to 784ms. Real low-end hardware, Safari/iOS, Firefox, screen-reader announcements and sustained battery use remain unverified. Video geometry is approximate and its gray studio backdrop does not exactly match the realtime scene lighting. The automatic stepped-seek threshold is implemented but was not triggered by the local measured decoder.

### Content requiring owner review

Source facts are preserved, not silently corrected. Confirm X-META's `Dec 2024 – Present` employment and stale first-person “Now” statements. TRACKY's 70% payload reduction, under-five-second logging, 95%+ accuracy, “eliminate hallucinations,” and first-month abandonment claims lack supporting measurements in this repo. Coop-Tracker's 100% automation and days-to-instantaneous result, 371admin's sub-second timing/hours saved, and New Z1on’s hours-to-seconds and eliminated double-booking claims also need evidence. These remain on historical source/case-study content; the new homepage uses qualitative language. Skill levels are not presented as ranked proficiency.

### Revision: continuous motion and Soul Cinema — 2026-09-25

The user rejected the bright generated-video cut into the dark 3D layer scene. This revision supersedes the automatic video handoff described above:

- The native-scroll journey now stays in one continuously rendered 3D scene. The existing Seedance clip is an optional motion-study link in the layers section, never fetched or played by scrolling. Removed the unused scrub component and its hard visibility switches.
- Quintic interpolation gives zero velocity and acceleration at chapter endpoints; frame-rate-independent damping softens camera travel and reversals. Returning visibility or changing theme no longer resets the pose. Texture completion and the first correct pose gate an 800ms initial crossfade. Reduced-motion CSS disables the fade.
- Added shared beveled geometry and a lightweight procedural grounding shadow. Observed layer scene: 29 draw calls and five textures. Prior timing measurements above belong to the earlier implementation and were not re-benchmarked for this revision.
- Soul Cinema (`soul_cinematic`, 2K, 4:3) produced seven candidates; five rejected for poor geometry, composition, or background. Two selected glass-layer studies are illustrative art, not exact duplicates of the coded workstation. Theme-specific responsive WebP posters replace the GPT Image 2 loading posters. Dark: 13,808 bytes / 5,444 small; light: 21,730 / 9,622 small. Original 2048×1536; delivery 1200×900 and 640×480. Only theme-appropriate imagery mounts after preference hydration; inline geometry covers pre-hydration and image failure.
- New approved cap: two credits. Exact estimates: seven × 0.12 = 0.84 credits. Observed account balance: 1681.50 → 1680.66, matching 0.84. The earlier 43.5-credit discrepancy remains unresolved and is not reclassified. All prompts, job IDs, rejection notes, and selected paths are appended to `docs/studio-assets.json`.
- Fresh checks: production build, TypeScript, and targeted ESLint pass. Full lint still reports the same 45 errors and two warnings. In-app Chromium inspection confirmed forward/reverse movement through the former video interval with the canvas fully visible and no video element; light/dark rendering; mobile layout; correct small poster selection; reduced effects removing the canvas. No new physical-device, Safari, Firefox, or screen-reader certification.
- Updated the reproducible extended verification script to assert continuous canvas visibility and reverse 3D progress instead of video seeks; updated performance asset matching for Soul posters. Those standalone browser scripts were not rerun in this revision; fresh browser verification used the in-app browser controls.

### Revision: folded titanium ribbon — 2026-09-25

- The user clarified that Sunburst names the GPT Image 2.5 model variant, not a radial design. Generated two 2K/high-quality concepts using `gpt_image_2_5`, `variant: sunburst`: dark and matching light ribbon artwork. The new authorization was up to 25 credits; two jobs cost 2.75 each, with the observed balance moving from 1559.16 to 1553.66 (5.5 total). Prior billing history remains unchanged. Exact requests and job IDs are in `docs/studio-assets.json`.
- Replaced the monitor rig with a custom beveled ribbon knot in silver and violet. Three sections share closed boundaries, open around the actual project screenshots, and separate during the layers chapter. A small procedural studio environment provides the reflective highlights. The live sculpture is a geometric interpretation of the generated concept, not an exact reconstructed mesh.
- Kept quintic easing, frame-rate-independent damping, demand rendering, texture readiness, reduced-effects and context-loss fallbacks. Removed the obsolete monitor-video link. Generated artwork now supplies the loading/static fallback in both themes, with an inline ribbon drawing if image delivery fails. Static fallback holds its pose while the text and chapter caption advance.
- WebP delivery: dark 36,282 bytes / 14,650 small; light 40,012 / 15,912 small. Originals 2336x1744; desktop 1200x896; small 640x478.
- Fresh verification: production build and TypeScript pass; targeted ESLint passes; two geometry tests pass (closed boundaries, valid indices/normals and under 10,000 triangles). Full lint retains the baseline 45 errors and two warnings. No added dependencies.
- Fresh in-app Chromium checks: desktop light/dark, project reveal and layer separation, reverse motion from progress 3.664 to 3.002 with canvas opacity remaining 1 and zero video elements, mobile at 390x844 without horizontal overflow, and reduced effects showing theme-matched generated artwork with no canvas. No captured console errors in the inspected development tab. Observed 10 draw calls for sculpture-only poses and up to five resident textures after project reveals. Prior timing measurements do not apply to this new geometry; no new frame-time benchmark, physical-device, Safari or Firefox claim is made.
- Updated verification/performance scripts for the retired link and current asset names; standalone browser scripts were not rerun. Production preview rebuilt and restarted on port 3001.

### Revision: project-led 3D showcase — 2026-09-25

The user rejected the abstract ribbon because it did not represent their developer portfolio. It has been removed from the live scene, loading state, and reduced-effects fallback. The earlier generation records remain historical; this revision incurred no generation credits.

- Nine actual project views now form the scene: TRACKY dashboard/transactions/budgets, Coop-Tracker dashboard/members/loans, and 371admin dashboard/device monitoring/playback calculator. Local screenshot crops preserve actual interface content, with project and technology headings added above the images. Eleven compressed textures including two system-study boards total 294,900 bytes on disk.
- The opening composition presents the three products. Each project then takes its own spatial arrangement, with supporting interfaces moving forward along with the main screen. The 371admin chapter transitions into three connected planes: actual interface, PHP MVC application responsibilities, and MySQL records. The two lower boards are explicitly conceptual summaries based on repository project descriptions, not screenshots or literal schema documentation.
- `project-motion.ts` owns deterministic compositions and continuous quintic interpolation. Frame-rate-independent damping supports reversals, and demand rendering stops after settling. Screenshot surfaces have physical thickness and project-colored edges. Static fallbacks present the same project imagery; no generated art or video is loaded.
- Fresh verification: production build/TypeScript and targeted ESLint pass; three focused tests confirm project ownership at each chapter, correct system-study layers, and continuous chapter boundaries. Browser inspection covered all three project compositions, light/dark rendering, mobile 390x844 without horizontal overflow, reduced effects removing the canvas, and reverse progress 4.053 to 3.393 while canvas opacity remained 1. Captured development console errors: none. Mobile fallback clipping was corrected after visual inspection. Existing full-repository lint debt remains as documented above; no new field performance or cross-browser claim.
- The generated-ribbon geometry and its tests were removed; historical generated image files are retained but unused. Updated README and measurement asset filters. Production preview is served at port 3001.

### Revision: operated product walkthroughs — 2026-09-25

The user clarified that the right-hand panel should show each project being operated in 3D, rather than arranging screenshots. They explicitly selected playback tied to scrolling: stopping holds the action and scrolling upward reverses it.

- Replaced the simultaneous screenshot stacks with one 3D browser per active project. A canvas-backed interface timeline draws a cursor, click pulse, view changes, record highlight, detail-panel open/close, and a final navigation action. Browser tilt and a separate detail plane create camera movement and depth around the operation itself.
- TRACKY: dashboard → transactions → inspect the Dubai Chewy expense → budgets. Coop-Tracker: dashboard → members → inspect Keith Vergara’s share record → loans. 371admin: dashboard → devices → inspect XJEEP-0000164 → offline-device filter. Source screenshots and record values come from the repository. Detail panels are illustrative summaries made for the portfolio walkthrough, not recordings of live backend sessions. No project-backend write actions occur.
- `demo-timeline.ts` is deterministic and has no playback clock. `demo-renderer.ts` owns the animated screen and detail drawing. Rendering and texture upload happen only while the scroll position changes/settles; hidden surfaces are skipped. Project handoffs overlap briefly, and all views are locally available before the 3D reveal. Canvas/texture references resynchronize after development hot reloads.
- Nine compressed full-interface sources total 315,464 bytes on disk. Fallbacks show one corresponding real interface without 3D animation. The four workflow steps and progress line make the current action visible. Project sections have sufficient desktop scroll distance for the sequence. No new generation credits or dependencies.
- Fresh checks: four timeline tests pass for workflow order, cursor/button alignment before view changes, deterministic reverse/pause behavior, and visible project handoffs. Targeted ESLint, TypeScript and production build pass. Browser inspection confirmed transaction and member detail reveals plus device selection. An idle development sample held its frame counter at 2603 across a build/status interval, confirming demand rendering stopped. Further production and responsive checks follow before handoff. Earlier motion/performance evidence belongs to retired implementations.
- Final verification: fresh production build passed after the replay and responsive fixes. Production Chromium showed the 371admin device detail, with no captured console errors. Mobile at 390x844 had no horizontal overflow; reduced effects removed the canvas and displayed the corresponding interface. Mobile walkthrough heading was hidden to avoid overlapping the browser. Final production server restarted on port 3001. No additional generation spending.
