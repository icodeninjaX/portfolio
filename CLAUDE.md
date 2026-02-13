# Portfolio Project

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **3D Engine:** React Three Fiber + Drei + Three.js (for creative mode)
- **Post-processing:** @react-three/postprocessing
- **Icons:** react-icons
- **Fonts:** Geist Sans, Geist Mono (via next/font), Caveat (cursive)
- **Package Manager:** Bun

## Project Structure
- `app/` - Next.js App Router pages and layouts
  - `app/page.tsx` - Main resume/portfolio page
  - `app/creative/page.tsx` - 3D interactive office mode (FPS-style walkable office)
  - `app/globals.css` - Global styles, CSS variables, animations, print styles
- `components/` - Resume page components (header, summary, experience, education, skills, projects, footer, scroll-progress, sticky-nav, theme-toggle)
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
- Resume components live as flat files in `components/`
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
