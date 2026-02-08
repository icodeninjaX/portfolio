# Portfolio Project

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Geist Sans & Geist Mono (via next/font)
- **Package Manager:** Bun

## Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - React components (header, summary, experience, education, skills, projects)
- `lib/data.ts` - All resume/portfolio data in a single file (edit this to customize content)

## Development
- `bun run dev` - Start dev server
- `bun run build` - Production build
- `bun run lint` - Run ESLint

## Conventions
- All resume data lives in `lib/data.ts` — edit this file to update portfolio content
- Components are simple, typed, and receive data via props
- Use Tailwind utility classes for styling; custom CSS variables defined in `globals.css`
- Dark mode is automatic via `prefers-color-scheme`
- Print styles are supported for PDF export
- Keep components in `components/` as flat files (no nested folders unless needed)

## Color Tokens (CSS Variables)
- `--accent` / `text-accent` - Primary accent color (blue)
- `--muted` / `text-muted` - Secondary text
- `--border` / `border-border` - Borders
- `--section-bg` / `bg-section-bg` - Subtle backgrounds (skill tags, etc.)
