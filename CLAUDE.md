# Portfolio Project

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **3D Engine:** React Three Fiber + Drei + Three.js (for creative mode)
- **Post-processing:** @react-three/postprocessing
- **Icons:** react-icons
- **Fonts:** Inter, Space Grotesk, JetBrains Mono, Instrument Serif — self-hosted in `app/fonts/` via `next/font/local` (next/font/google made Vercel builds flaky)
- **Package Manager:** Bun

## Project Structure
- `app/` - Next.js App Router pages and layouts
  - `app/about/page.tsx` - About: scroll-driven 3D gyroscope (see `components/about/`)
  - `app/page.tsx` - Homepage: "Full stack, literally." scroll-scrubbed film of me at every stage (see `components/stack/`)
  - `app/experience/page.tsx` - Journey: scroll-driven 3D route up a mountain (see `components/journey/`)
  - `app/resume/page.tsx` - "Simple mode" résumé. Simple mode = `/resume`, every `/projects/[slug]` case study and `app/not-found.tsx`; all three share one premium "sheet" design built from `components/resume/` (`SimpleToolbar`, `Section`, `SimpleFooter`, `projects.ts` for the shared project order/numbering) and styled in `app/simple.css` (`rs-` prefix, own light/dark tokens). Printing `/resume` swaps the sheet for `components/resume/HarvardResume.tsx`, a one-page Harvard-style, ATS-friendly resume (`hv-` prefix, print-only)
- `app/creative/page.tsx` - 3D interactive office mode (FPS-style walkable office)
  - `app/globals.css` - Global styles, CSS variables, animations, print styles
- `components/` - Resume page components (header, summary, experience, education, skills, projects, footer, scroll-progress, sticky-nav, theme-toggle)
- `components/stack/` - Homepage. `SceneSequence.tsx` draws a realistic, scroll-scrubbed film of me to a 2D canvas: each `data-stage` section holds on one scene (hero, silicon, signal, data, one per project slug, now, contact) and the gap between two sections scrubs the clip that joins them. `app/page.tsx` lists the stages (scene id + altimeter label) in section order. Scenes are Higgsfield GPT Image 2.5 Sunburst stills (`docs/scroll-keyframes/`, built from my photos) joined by MiniMax H3 Max start/end-frame clips, upscaled to 4K with Higgsfield Topaz (8 credits per clip), listed in `scripts/scenes/clips.json` (`uhd`); `node scripts/scenes/build-frames.mjs` cuts them into `public/stack/scenes/{d,m}/SS-FFF.webp` and regenerates `sceneManifest.ts`: `d` is the 16:9 frame at 1600w for landscape screens, `m` a portrait crop 1152px tall that follows me (per-scene `focus` in `clips.json`) for portrait screens, where the scene fills the top 72% and melts into the copy. On desktop a scene can be shifted right (`pan` in `clips.json`, hero = 0.14) so a centred subject clears the big hero title; the uncovered edge fades into the page. Data-saver visitors get the stills only, crossfaded. A section whose scene id has no frames keeps the previous scene. `scrollStore.ts` shares scroll state without React re-renders. `Sections.tsx` holds the copy. `stages.ts`, `CameraRig`, `Spine` and `activity.ts` remain because About and Journey use them.
- `components/stack/StackShell.tsx` - Shared immersive-page chrome (preloader, Lenis smooth scroll, top bar, altimeter, readout, hero video, grain). The homepage (`StackExperience`) and About (`AboutExperience`) both wrap it with their own canvas, labels and nav. `CameraRig` takes a `keys` prop so each page brings its own keyframes.
- `components/about/` - About page 3D experience, "The human in the loop": a gyroscope of nested engraved rings around a molten core that you dive into ring by ring. `stages.ts` is the source of truth (`ABOUT_KEYS` camera keyframes, one per `data-stage` section, and `RINGS`, outer to inner). Rings settle into one plane at Trajectory and a beam fires up; `activity.ts` holds the scroll-driven focus/alignment helpers. `Sections.tsx` holds the copy.
- `components/journey/` - Journey page 3D experience, "The long way up": a road spiralling up a contour-engraved mountain with a survey monolith at every `journey` milestone; the road lights up behind you as you scroll. `terrain.ts` is the pure geometry (height field, `ROUTE` curve, `elevation`), `stages.ts` holds `JOURNEY_KEYS` (one per `data-stage` section: trailhead, one per milestone, ledger, summit). `JourneyRig` follows the road between waypoints instead of cutting through the mountain. `Sections.tsx` holds the copy.
- `public/journey/` - Journey media (Higgsfield-generated hero loop `hero-route.mp4` + `hero-poster.webp`)
- `public/about/` - About media (Higgsfield-generated hero loop `hero-core.mp4` + `hero-poster.webp`)
- `public/stack/` - Homepage media (`scenes/` frame sequence; PCB texture used as the immersive-page fallback)
- `components/creative/` - 3D office scene components (Scene, Character, OfficeWalls, OfficeFloor, SectionStations, OfficePeople, NeonSign, FPSHands, ConversationOverlay, etc.)
- `lib/data.ts` - All resume/portfolio data (edit this to customize content)
- `lib/npcDialogue.ts` - NPC dialogue lines for the creative office mode
- `public/images/` - Image assets (e.g., Tracky.png)
- `public/fonts/` - Font files (e.g., helvetiker_bold.typeface.json for 3D text)

## Development
- `bun run dev` - Start dev server
- `bun run build` - Production build
- `bun run lint` - Run ESLint

## Conventions
- All resume data lives in `lib/data.ts` — edit this file to update portfolio content
- NPC dialogue for creative mode lives in `lib/npcDialogue.ts`
- Components are simple, typed, and receive data via props
- Use Tailwind utility classes for styling; custom CSS variables defined in `globals.css`
- Dark mode uses a `data-theme` attribute toggle with `prefers-color-scheme` fallback
- Print styles are supported for PDF export
- The old flat resume components in `components/` (experience, projects, footer, page-background, theme-toggle, …) are no longer used by any page
- Homepage, About and Journey are dark-only; their styles live under the `stack-` prefix at the end of `globals.css` (About-only pieces in the "About" block, Journey-only in the "Journey" block)
- The homepage's text reads like a film's titles, not the old layer tower: every section is a numbered scene (`Chapter scene={n}` in `components/stack/Sections.tsx`, hero = 00), the HUD shows scene labels and a REC timecode, and the palette comes from the footage (lamp gold `--s-amber: #f0b46a`, PC-glow cyan `--s-glow` for live signals, red `--s-rec`). These overrides are scoped to `.stack-home--film` at the end of `globals.css`, so About and Journey keep their own look
- Adding a milestone to `journey` in `lib/data.ts` automatically adds a waypoint, monolith and camera stop on the Journey page; give it a `kit` list
- Resume-only content lives in `lib/data.ts` too: `resume.headline`, `highlights` on each `experience` item, `skillGroups` (software / hardware, `core` = bolded), `certifications`
- Case-study demo videos are rendered in code, not with a video service: `scripts/demo-video/<name>.html` is a deterministic HTML/CSS timeline (`render(t)`, preview with `?play`) and `node scripts/demo-video/render.mjs <name>` (atlas, coop, plantpal, kdv, newzion, tracky) captures it frame by frame with Playwright and encodes `public/videos/<name>-demo.{mp4,webm}` + poster with ffmpeg. Wire one up with `video` on the project in `lib/data.ts`. Voice-over (Piper TTS, offline, voice `en_US-joe-medium`, CC0): edit `scripts/demo-video/<name>.voice.json` (one `{ at, text }` per line) and run `PIPER=… PIPER_VOICES=… PYTHON=<python with numpy> node scripts/demo-video/narrate.mjs <name>` after rendering; it refuses lines that would overlap the next one. A line with a `file` uses that recorded clip instead of Piper, and every video now does: all six voices are Higgsfield Seed Audio presets (ATLAS Arthur, Coop Brielle, PlantPal Faye, KDV Grady, New Zion Ainsley, TRACKY Holden), kept as lossless FLAC clips in `scripts/demo-video/voice/<name>/` (make each one from the raw take with `python scripts/demo-video/voiceclip.py raw.wav voice/<name>/line-N.flac`: it resamples in float, trims, fades and leaves -3 dB headroom; never store clips as Opus/16-bit resamples, Seed Audio takes overshoot when upsampled and clip), so re-mixing needs no Piper and no new credits. Lines that overran their slot were re-generated with a higher `speech_rate` or tightened wording. The same step adds background music: an original score per video synthesised in `scripts/demo-video/music.py` (numpy, no samples, so nothing to license; atlas = dark synth, coop = marimba groove, plantpal = kalimba in 3/4, kdv = paper-storm drone into an electric-piano groove, newzion = ticking clock and plucked strings with a counter bell, tracky = lo-fi beat with vinyl crackle), timed to the scenes and sidechain-ducked under the voice (`"music": false` in the voice file skips it). Only use Piper voices whose model card allows public use (Ryan and HFC voices are non-commercial)
- Screenshots that show other people (e.g. Coop-Tracker members) get their names blurred before publishing; log crops/redactions in `docs/mobile-screenshots.md`
- Adding a project to `lib/data.ts` automatically adds a homepage section; it shows the previous scene until a still for its slug and the clips into and out of it are generated (ask before spending Higgsfield credits) and `build-frames.mjs` is re-run
- 3D/creative components live in `components/creative/`

## Color Tokens (CSS Variables)
- `--accent` / `text-accent` - Primary accent color (blue)
- `--accent-secondary` / `text-accent-secondary` - Secondary accent (purple)
- `--accent-light` / `bg-accent-light` - Light accent background
- `--muted` / `text-muted` - Secondary text
- `--muted-light` / `text-muted-light` - Tertiary text
- `--border` / `border-border` - Borders
- `--card` / `bg-card` - Card backgrounds
- `--section-bg` / `bg-section-bg` - Subtle section backgrounds
- `--tag-bg`, `--tag-border`, `--tag-text` - Skill/tag chip styling
- `--skills-bg`, `--skills-text`, `--skills-muted` - Skills section (dark background)
- `--shadow`, `--shadow-md`, `--shadow-lg` - Elevation shadows
