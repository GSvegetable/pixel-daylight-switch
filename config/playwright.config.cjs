'use strict';
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '../tests/browser',
  timeout: 30000,
  expect: { timeout: 8000 },
  fullyParallel: false,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
    launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl'] }
  },
  webServer: {
    command: 'node ../tests/server.cjs',
    url: 'http://127.0.0.1:4173/tests/fixture.html',
    reuseExistingServer: !process.env.CI,
    timeout: 15000
  }
});
