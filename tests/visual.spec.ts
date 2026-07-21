import { test, expect } from "@playwright/test";

/**
 * Visual regression — web-engineering-standard EG-4.
 * Runs against the Vercel PREVIEW deployment URL, never localhost.
 * Baselines are committed to tests/baselines/ AFTER this build passes QA
 * (the QA-passed state is the baseline, per the skill) — until then this
 * spec will fail on first run with "no baseline found", which is expected.
 */
const BASE = process.env.PREVIEW_URL;
if (!BASE) {
  throw new Error(
    "PREVIEW_URL is required — visual regression never runs against localhost. " +
      "Usage: PREVIEW_URL=https://your-preview.vercel.app npx playwright test"
  );
}

const PAGES = ["/home-v3"];

for (const path of PAGES) {
  for (const width of [375, 768, 1440]) {
    test(`${path} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await expect(page).toHaveScreenshot(
        `${path.replace(/\//g, "_")}-${width}.png`,
        { fullPage: true }
      );
    });
  }

  test(`${path} @ 1440 reduced-motion`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await expect(page).toHaveScreenshot(
      `${path.replace(/\//g, "_")}-1440-reduced-motion.png`,
      { fullPage: true }
    );
    await context.close();
  });
}
