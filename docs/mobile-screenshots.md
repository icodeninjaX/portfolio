# Phone screenshot provenance

Captured 2026-10-02 in Chromium at **390 × 844 CSS pixels**, DPR 2 (780 × 1688 image pixels), reduced-motion preference, fresh signed-out contexts. Assets are WebP quality 86. They are viewport captures, not resized desktop images. Existing desktop assets and case-study copy are retained.

The cloud browser could not reach the confirmed public domains (proxy CONNECT 403 / ERR_TUNNEL_CONNECTION_FAILED). Instead, the following **unchanged saved source checkouts** were copied to an isolated scratch directory and their public pages rendered locally. No application account, production database, customer record, or private dashboard was used. Source applications were not edited. Captions distinguish these local public views from production captures.

| Portfolio project | Saved source commit | Local public route and state | Assets in `public/images/` |
| --- | --- | --- | --- |
| ATLAS | `ea4a45f7fd4f15542ac0605d0ea66a17ce850f83` | `/`, landing and scrolled `#tasks .landing-card`; the task records are the existing illustrative public demo | `atlas-mobile-landing.webp`, `atlas-mobile-tasks.webp` |
| KDV Website Services | `1a930ded945f3ea301e444dce47006bce87df64f` | `/`, homepage and expanded navigation | `kdv-mobile-home.webp`, `kdv-mobile-menu.webp` |
| PlantPal / Garden | `50c6701e929c58895cf29e0288116fa7b40cd449` | `/public/home.php`, opening and scrolled `#care` | `plantpal-mobile-home.webp`, `plantpal-mobile-care.webp` |
| Coop-Tracker | See the saved checkout commit recorded below | `/auth/login`, scrolled to the empty form; **sign-in only**, not dashboard coverage | `coop-mobile-login.webp` |

Confirmed production sources: `https://atlas.kdvwebsiteservices.com/`, `https://kdvwebsiteservices.com/`, `https://kdv-garden.ct.ws/`, and `https://coop-tracker.vercel.app/`. The ATLAS and Garden domains came from the task; the others are in `lib/data.ts`.

## Capture environment

Google Fonts was also blocked. The same named font families were loaded from Fontsource packages locally: Next's font response fixture mechanism for ATLAS, KDV and Coop-Tracker; request fulfillment of the existing font stylesheet for Garden. No layout, text, product CSS or application behavior was substituted. KDV used its production build; ATLAS and Coop-Tracker used development servers with only the Next developer overlay hidden during screenshots. Garden ran its original PHP templates without a database. The public care-guide library was not captured because it requires database data.

## Remaining coverage

- **TRACKY:** confirmed URL `https://budget-tracker-two-inky.vercel.app/` blocked by the cloud proxy; no local source checkout available. No mobile capture added.
- **371admin:** no public URL or sanitized runnable source in this environment; existing desktop images only. No authenticated access attempted.
- **New Z1on LPG (`new-z1on-lpg`):** only approved desktop empty-state images are available. Those cannot authentically be converted into phone screenshots; no mobile capture added.
- **Coop-Tracker:** public sign-in captured; authenticated dashboard requires a separately authorized sanitized demo.

## Integration and verification

`mobileImages` sits beside existing `images` in `lib/data.ts`. The server-rendered case-study gallery displays phone screenshots in two columns on wider screens and one column on phones, with uncropped aspect ratios, bounded widths, native section links, visible focus indicators, full-size image links, descriptive alt text and figure captions. No new production dependency or client state is needed.

The capture files include the native viewport boundaries; they are not full-page captures. Open their links to inspect text at original resolution.

Run `node scripts/verify-project-showcase.mjs` with a running portfolio server. Set `SHOWCASE_URL`, `PLAYWRIGHT_MODULE`, or `CHROMIUM_PATH` as needed. It checks all seven case studies at 320, 390, 768 and 1440 pixels, image decoding, overflow, keyboard section navigation, full-size image links, and JavaScript errors. Review previews and a JSON report are written under `.artifacts/project-showcase/`.

Coop-Tracker source commit: `5a71b75759c7130713bf535f2e24e9a8625a7f18`.
