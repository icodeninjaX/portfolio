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

- **TRACKY:** populated local offline dashboard and Activity captures completed with synthetic demo entries.
- **371admin:** meaningful workflow capture blocked on sanctioned demo authentication; rejected login-only preview excluded.
- **New Z1on LPG (`new-z1on-lpg`):** real dashboard and customer-directory captures completed with an isolated synthetic database and normal authentication. Removed from the case study on 2026-10-05 at the owner's request; the files below were deleted.
- **Coop-Tracker:** public sign-in captured; authenticated dashboard requires a separately authorized sanitized demo.

## Integration and verification

`mobileImages` sits beside existing `images` in `lib/data.ts`. The server-rendered case-study gallery displays phone screenshots in two columns on wider screens and one column on phones, with uncropped aspect ratios, bounded widths, native section links, visible focus indicators, full-size image links, descriptive alt text and figure captions. No new production dependency or client state is needed.

The capture files include the native viewport boundaries; they are not full-page captures. Open their links to inspect text at original resolution.

Run `node scripts/verify-project-showcase.mjs` with a running portfolio server. Set `SHOWCASE_URL`, `PLAYWRIGHT_MODULE`, or `CHROMIUM_PATH` as needed. It checks all seven case studies at 320, 390, 768 and 1440 pixels, image decoding, overflow, keyboard section navigation, full-size image links, and JavaScript errors. Review previews and a JSON report are written under `.artifacts/project-showcase/`.

Coop-Tracker source commit: `5a71b75759c7130713bf535f2e24e9a8625a7f18`.

## Isolated workflow captures — 2026-10-02

The earlier login-only proposal was rejected and is not included. Four useful workflow captures now supplement the original seven phone images, which remain unchanged. Every desktop image is also unchanged.

All four new images are native Chrome captures at 390 x 844 CSS pixels, DPR 2 (780 x 1688 image pixels), mobile/touch emulation and reduced motion. No CSS/layout substitution, desktop cropping, screenshot compositing, or authentication bypass was used. WebP quality is 86. Captions and alt text explicitly identify synthetic demo content.

### New Zion

Source: unchanged copy of `C:/Dev/LPG-System`, remote `icodeninjaX/newzionpos1`, HEAD `220e96ac78257096c5f451a1ef3851d7a54519e2`. The source checkout was not edited. The copy runs at `http://127.0.0.1:3192` with its own `.env` pointing at a fresh MySQL instance bound only to loopback port 3318, with a new data directory and `newzion_demo` database. The owner's existing MySQL data directory and databases were not used.

Imported the repository's clean-install schema plus login-enhancement schema. The only schema-import compatibility adjustment removes MariaDB's `IF NOT EXISTS` on ADD COLUMN/INDEX for the new MySQL 8 database. No application PHP, UI, authorization logic, or password checks were changed. A demo user was created through the existing CSRF-protected public signup form and subsequent captures used the normal login form.

Synthetic fixture rows: `DEMO-001` / `Demo Household A`, `DEMO-002` / `Demo Household B`, and `DEMO-003` / `Demo Shop C`, fictional Sample addresses in Demo District / Demo City, no phone numbers, plus three fictional orders (two pending). No source/customer-record export or production connection occurred. The fixture's optional telephone fields use empty strings: null values initially triggered a source PHP deprecation warning; correcting the fixture removed the warning without modifying application code.

- `newzion-mobile-demo-customers.webp`: `/search-customer.php`, real responsive customer directory with synthetic rows.
- `newzion-mobile-demo-dashboard.webp`: `/dashboard.php`, normal scroll to the dashboard totals. Existing fixed navigation/footer and large phone cards remain as implemented; not all totals fit in one viewport.

Final normal-login captures return HTTP 200, have 390px document width, and no JavaScript errors. An initial signup success-page JavaScript error was not present during final normal-login captures.

### TRACKY

Source: byte-for-byte copy of the existing built app from `C:/Dev/Tracky/dist`, served at `http://127.0.0.1:3193`; source checkout remote `icodeninjaX/Budget-tracker`, HEAD `6f435aa0683060ff527dd8878337065af8228dcf`. No application code was edited. This is a local-build capture, not a production capture; the exact compiled artifact is retained in the capture workspace.

Used the app's existing Continue Offline and Skip for Now controls in a fresh disposable browser context. Three fictional transactions were entered via the actual manual-entry form: `DEMO — Sample earnings` (Salary, PHP 15,000), `DEMO — Sample groceries` (Food, PHP 800), and `DEMO — Sample commute` (Transportation, PHP 150). The application computed the PHP 14,050 balance. No account login, real finances, AI call, geolocation request, or production service was used. Browser requests were restricted to loopback and font hosts; no blocked external-service attempt was recorded.

- `tracky-mobile-demo-dashboard.webp`: actual Home dashboard calculated from synthetic entries.
- `tracky-mobile-demo-activity.webp`: actual Activity view scrolled to expose the DEMO-labeled entries.

Both captures have 390px document width and no JavaScript errors. Native notifications were allowed to expire before capture.

### 371admin blocker

Source located at `E:/xampp/htdocs/371admin/371admin_ver1`, remote `icodeninjaX/371admin_ver1`, HEAD `b5fc152756d4ce2286737212fe56a27a2fd471c4` plus existing owner edits to login/config files. Those edits remain intact. No phone screenshot is added for this project in the final proposal.

The repository's users/RBAC setup contains seeded password hashes but no verified demo login password. The current user-creation route requires a logged-in administrator with USERS_CREATE permission and a valid CSRF token; there is no public signup flow. Proceeding needs a working sanctioned demo login or an approved supported demo-account provisioning step. Passwords were not reset, sessions were not fabricated, and authorization checks were not changed. Device-monitoring workflows additionally use a separate production RDS configuration; no production connection was attempted. A calculator may provide a useful local-only view after sanctioned demo authentication is established.

The prior login preview is excluded. Its existing source layout overflow remains a diagnostic observation, not a claim about dashboard responsiveness.

## Update 2026-10-05: ATLAS in-app phone views

The two ATLAS public-landing captures above (`atlas-mobile-landing.webp`, `atlas-mobile-tasks.webp`) were replaced and deleted. The owner sent eight screenshots taken on their own Android phone, signed in to their own ATLAS workspace: Today, Money, Tasks, Goals, Analyst, Capture, Career and Timeline. Each was cropped to remove the Android status bar (rows 0–103) and gesture bar (rows 2358+), resized from 1080 to 780 px wide and saved as `public/images/atlas-mobile-app-*.webp` (780 × 1628). No pixels inside the app were edited. These show the owner's real records, not demo data.

## Update 2026-10-05: PlantPal (Garden) in-app phone views

The two Garden public-landing captures (`plantpal-mobile-home.webp`, `plantpal-mobile-care.webp`) were replaced and deleted. The owner sent six screenshots taken in their phone's browser on the live site (`kdv-garden.ct.ws`), signed in to their own garden: Log in, Today, Plants, Calendar, Library and Activity. Each was cropped to remove the Android status bar and Chrome's address bar (rows 0–256) and the gesture pill (rows 2360+), resized from 1080 to 780 px wide and saved as `public/images/plantpal-mobile-app-*.webp` (780 × 1519). No pixels inside the site were edited.

## Update 2026-10-05: CoopTracker in-app phone views

The CoopTracker public sign-in capture (`coop-mobile-login.webp`) was replaced and deleted. The owner sent eight screenshots from the live app on their Android phone, signed in as the cooperative's administrator: Sign in, Dashboard, Current period, Collections, Members, Loans, Shares and Profile. Each was cropped to remove the status bar (rows 0–109) and gesture bar (rows 2360+), resized from 1080 to 780 px and saved as `public/images/coop-mobile-app-*.webp` (780 × 1625).

**Redaction:** the screens list real cooperative members. Every member name other than the owner's was blurred (Gaussian, before cropping) on Collections, Members and Loans, including a name showing faintly through the Loans tab bar. Amounts, shares and statuses are left as captured. The owner's own name is not blurred. No other pixels were edited.

## ATLAS desktop screenshots (2026-10-06)

Supplied by the owner from the ATLAS desktop app, signed in to their own account: Today, Capture, Analyst, Tasks and Money · Accounts. Cropped to remove the Windows title bar (top 33 px) and trimmed to a common 1896 × 992 frame, then resized to 1440 × 754 WebP (quality 86) as `atlas-desktop-{today,capture,analyst,tasks,accounts}.webp`. No redaction: the screens show only the owner's own tasks and balances, published with their approval.

## PlantPal / Garden desktop screenshots (2026-10-06)

Supplied by the owner from the live site, signed in to their own account: two landing-story chapters, Today, Plants and Calendar. All cropped to a common 1888 × 918 frame (dropping the browser's link tooltip at the bottom-left of Today) and resized to 1440 × 700 WebP (quality 86) as `plantpal-desktop-{water,grown,today,plants,calendar}.webp`. **Redaction:** the account email under the user's name in the sidebar is blurred on Today, Plants and Calendar.

Added the same day: Library (signed in), Activity and Gardens as `plantpal-desktop-{library,activity,gardens}.webp`, same crop and size. **Redaction:** the sidebar email on all three; on Gardens, both garden locations and the second garden's name.

## KDV Website Services phone screenshots (2026-10-06)

Supplied by the owner from an Android phone on the live site: the hero, "Where it starts", "Paper to system" (New Zion), "The front door" (website creation, iPay International) and "The control room" (business dashboards, 371admin). Cropped to remove the phone's status bar (top 116 px) and gesture bar, then resized from 1080 px to 780 × 1568 WebP (quality 86) as `kdv-mobile-{home,problem,new-zion,websites,dashboards}.webp`; `kdv-mobile-home.webp` replaces the earlier local render. The earlier `kdv-mobile-menu.webp` is kept. No extra redaction: client dashboards are already blurred on the site itself. The site's chat button is visible in the corner.

## KDV Website Services desktop screenshots (2026-10-06)

Supplied by the owner from the live site on a desktop browser: the hero, "Where it starts", "Paper to system", "The front door" and "The control room". Cropped to a common 1894 × 900 frame and resized to 1440 × 684 WebP (quality 86) as `kdv-desktop-{home,problem,new-zion,websites,dashboards}.webp`; they replace the earlier `kdv-website-services-home.webp`. **Redaction:** on Paper to system, the customer names in Latest Orders and New Customers on the New Zion dashboard are blurred; on The control room, the campaign details in the 371admin notifications panel are blurred. The site's chat button is visible in the corner.

## New Z1on LPG POS + CMS desktop screenshots (2026-10-06)

Supplied by the owner from the admin workspace, populated with demo data (Demo Customer One to Four, `DUMMY-CUS` codes, `09170000xxx` numbers, Example Lane addresses) plus two orders under the owner's own name: Business overview, Order management, Customers, Products and Inventory. Cropped to a common 1899 × 900 frame and resized to 1440 × 682 WebP (quality 86) as `new-zion-{dashboard,orders,customers,products,inventory}.webp`. They replace the earlier empty-state captures `new-zion-add-customer.webp` and `new-zion-search-customers.webp`. No redaction needed.

Added the same day: Branches, Sales report and three point-of-sale views (dashboard, customers, new order) as `new-zion-{branches,sales-report,pos-dashboard,pos-customers,pos-order}.webp`, cropped to 1895 × 898 and resized to 1440 × 682. **Redaction:** one real customer's name, code, phone number and street address are blurred on the POS customers list, and the same street address is blurred on Branches.

## ATLAS desktop screenshots, part 2 (2026-10-06)

Supplied by the owner from the desktop app: Money · Debts, Goals and Career. Cropped to a common 1891 × 987 frame and resized to 1440 × 752 WebP (quality 86) as `atlas-desktop-{debts,goals,career}.webp`. **Redaction:** on Debts, the total remaining, the repaid and borrowed amounts, the monthly minimums and the next lender's name are blurred; on Career, the company names, roles, locations and salaries of both closed applications are blurred. Goals needed none.
