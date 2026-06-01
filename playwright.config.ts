import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.SLIDEV_PORT ?? 3030);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    viewport: { width: 1600, height: 900 },
  },
  webServer: {
    command: `pnpm exec slidev --port ${port} --open false`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
