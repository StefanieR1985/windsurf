import { defineConfig, devices } from '@playwright/test';

// Browser tests against the local dev server. The server is started
// automatically unless one is already running on the same port.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

// Escape hatch for containers and CI images that ship their own Chromium
// instead of the build Playwright would download.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
