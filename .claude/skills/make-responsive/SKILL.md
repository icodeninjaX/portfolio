---
name: make-responsive
description: Make the portfolio website mobile-responsive by auditing and fixing responsive design issues
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

Make the project mobile-responsive. Follow these steps:

## 1. Audit

- Read all component files in `components/` and page files in `app/`
- Read `app/globals.css` for existing breakpoints and variables
- Identify elements that may break on small screens (< 640px):
  - Fixed widths or sizes that don't scale
  - Flex rows that should stack on mobile
  - Text sizes that are too large on mobile
  - Padding/margins that waste space on small screens
  - Images that don't scale
  - Overflow issues (horizontal scroll)

## 2. Fix

Apply these responsive patterns using Tailwind CSS mobile-first approach:

- **Layout**: Use `flex-col` by default, `sm:flex-row` for side-by-side on larger screens
- **Typography**: Use smaller base sizes on mobile, scale up with `sm:` or `md:` prefixes
- **Spacing**: Use tighter padding/margins on mobile (`p-4` -> `sm:p-6` -> `md:p-8`)
- **Cards**: Ensure cards have appropriate padding on mobile
- **Images**: Use responsive sizing (`w-16 sm:w-20`)
- **Tags/Pills**: Ensure they wrap properly with `flex-wrap`
- **Grid**: Use `grid-cols-1` on mobile, scale up with `sm:grid-cols-2`

## 3. Verify

- Run `bun run build` to ensure no errors
- List all changes made with a summary

## Rules

- Use Tailwind CSS utility classes only — no custom media queries unless absolutely necessary
- Mobile-first: base styles are for mobile, use `sm:` (640px) and `md:` (768px) for larger screens
- Do NOT change the visual design or layout on desktop — only improve the mobile experience
- Do NOT add new dependencies
