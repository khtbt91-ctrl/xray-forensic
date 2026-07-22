import { defineConfig } from "@playwright/test";

/**
 * Visual regression config — web-engineering-standard EG-4.
 * Runs against a deployed Vercel preview URL only, never localhost
 * (errors.md LIGHTHOUSE_LOCALHOST_ARTIFACT applies to rendering too).
 * Set PREVIEW_URL before running: PREVIEW_URL=https://... npx playwright test
 *
 * Preview deployments carry Vercel Deployment Protection (SSO). Set
 * VERCEL_AUTOMATION_BYPASS_SECRET to the project's "Protection Bypass for
 * Automation" secret (Vercel project settings) so Playwright can reach the
 * page — this is Vercel's documented mechanism, not a workaround. See
 * https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["html", { outputFolder: "tests/report", open: "never" }]],
  snapshotPathTemplate: "tests/baselines/{arg}{ext}",
  use: {
    screenshot: "only-on-failure",
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          "x-vercel-protection-bypass":
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
          "x-vercel-set-bypass-cookie": "true",
        }
      : undefined,
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
});
