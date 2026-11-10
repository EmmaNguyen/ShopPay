import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3010",
    video: "on",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
    launchOptions: { slowMo: process.env.DEMO_SLOWMO ? 400 : 0 },
  },
  outputDir: "../submission/video/test-results",
  reporter: "list",
});
