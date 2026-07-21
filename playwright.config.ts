import { defineConfig } from "@playwright/test";

/**
 * Visual regression config — web-engineering-standard EG-4.
 * Runs against a deployed Vercel preview URL only, never localhost
 * (errors.md LIGHTHOUSE_LOCALHOST_ARTIFACT applies to rendering too).
 * Set PREVIEW_URL before running: PREVIEW_URL=https://... npx playwright test
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["html", { outputFolder: "tests/report", open: "never" }]],
  snapshotPathTemplate: "tests/baselines/{arg}{ext}",
  use: {
    screenshot: "only-on-failure",
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
});
