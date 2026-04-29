import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4322',
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 4322,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
