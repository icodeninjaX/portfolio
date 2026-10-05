# Screenshot inbox

Temporary upload folders, one per project. Drop screenshots into the matching
folder; Claude converts them to `.webp` in `public/images/`, adds them to the
project in `lib/data.ts`, and deletes this `incoming/` folder afterwards.

- Desktop screenshots: any name, e.g. `dashboard.png`
- Phone screenshots: put `phone` in the name, e.g. `phone dashboard.png`
- Optional order: start names with `01`, `02`, …
- Use demo data only — these go on a public site.
