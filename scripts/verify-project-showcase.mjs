import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const out = ".artifacts/project-showcase";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const p = await b.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const results = [];
  for (const slug of [
    "atlas",
    "kdv-website-services",
    "plantpal",
    "coop-tracker",
    "371admin",
    "new-z1on-lpg",
    "tracky",
  ]) {
    for (const width of [320, 390, 768, 1440]) {
      await p.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
      const r = await p.goto(
        (process.env.SHOWCASE_URL || "http://localhost:3000") +
          "/projects/" +
          slug,
      );
      assert.equal(r.status(), 200);
      const hasPhone = [
        "atlas",
        "kdv-website-services",
        "plantpal",
        "coop-tracker",
        "new-z1on-lpg",
        "tracky",
      ].includes(slug);
      assert.equal(await p.locator("#phone-views").count(), hasPhone ? 1 : 0);
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow ${slug}/${width}`,
      );
      if (hasPhone) {
        await p.locator("#phone-views").scrollIntoViewIfNeeded();
        await p
          .locator("#phone-views img")
          .evaluateAll((imgs) => Promise.all(imgs.map((i) => i.decode())));
        const images = await p
          .locator("#phone-views img")
          .evaluateAll((imgs) =>
            imgs.map((i) => ({
              alt: i.alt,
              width: i.naturalWidth,
              height: i.naturalHeight,
              rendered: i.getBoundingClientRect().width,
            })),
          );
        for (const i of images) {
          assert.ok(i.alt && i.width && i.height);
          assert.ok(i.rendered <= 280.5);
        }
        if (width === 390 || width === 1440) {
          await p
            .getByRole("heading", { name: "Project Showcase", exact: true })
            .evaluate((e) =>
              scrollTo(0, e.getBoundingClientRect().top + scrollY - 24),
            );
          await p.screenshot({
            path: `${out}/after-${slug}-${width}.png`,
            style: "nextjs-portal { visibility: hidden; }",
          });
          await p
            .locator("section")
            .filter({
              has: p.getByRole("heading", {
                name: "Project Showcase",
                exact: true,
              }),
            })
            .screenshot({
              path: `${out}/gallery-${slug}-${width}.png`,
              style: "nextjs-portal { visibility: hidden; }",
            });
        }
        const a = p.getByRole("link", { name: "Desktop views", exact: true });
        await a.focus();
        await p.keyboard.press("Enter");
        assert.ok(p.url().endsWith("#desktop-views"));
        const phoneLink = p.locator("#phone-views a").first();
        await phoneLink.focus();
        assert.equal(
          await phoneLink.evaluate((e) => e === document.activeElement),
          true,
        );
        const popupPromise = p.waitForEvent("popup");
        await p.keyboard.press("Enter");
        const popup = await popupPromise;
        await popup.waitForLoadState();
        assert.ok(popup.url().endsWith(".webp"));
        await popup.close();
        results.push({
          slug,
          width,
          phoneImages: images.length,
          overflow: false,
          keyboard: "passed",
        });
      } else results.push({ slug, width, phoneImages: 0, overflow: false });
    }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    `${out}/browser-verification.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  await b.close();
  console.log(
    "Verified",
    results.length,
    "route/viewport combinations; image decoding, keyboard navigation, full-size links, no overflow or page errors.",
  );
})();
