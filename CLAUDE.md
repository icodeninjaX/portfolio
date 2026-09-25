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
  - `app/page.tsx` - Homepage: "Full stack, literally." scroll-driven 3D tower (see `components/stack/`)
  - `app/creative/page.tsx` - 3D interactive office mode (FPS-style walkable office)
  - `app/globals.css` - Global styles, CSS variables, animations, print styles
- `components/` - Resume page components (header, summary, experience, education, skills, projects, footer, scroll-progress, sticky-nav, theme-toggle)
- `components/stack/` - Homepage 3D experience. `stages.ts` is the single source of truth: each DOM section with `data-stage` maps in order to one camera keyframe in `CAMERA_KEYS`. `scrollStore.ts` shares scroll state with the canvas without React re-renders. Layers: `SiliconLayer`, `NetworkLayer`, `DataLayer`, `InterfaceLayer` (project screenshots on panels), `Spine` (signal bus, crown, dust). `Sections.tsx` holds the copy.
- `public/stack/` - Homepage media (generated PCB texture, project covers for projects without screenshots, hero video loop + poster)
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
- Resume components live as flat files in `components/` (still used by `/about`, `/experience`, `/projects/[slug]`)
- Homepage is dark-only; its styles live under the `stack-` prefix at the end of `globals.css`
- Adding a project to `lib/data.ts` automatically adds a panel + camera stop; give it `images` or add a cover in `COVERS` in `app/page.tsx`
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
