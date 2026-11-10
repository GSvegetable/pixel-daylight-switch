'use strict';
const { test, expect } = require('@playwright/test');

test('auto-mounts, exposes an accessible switch, and avoids duplicate markup', async ({ page }) => {
  await page.goto('/tests/fixture.html');
  const root = page.locator('#switch-a');
  await expect(root.locator('canvas.scene')).toHaveCount(1);
  await expect(root.locator('button.hit[role="switch"]')).toHaveCount(1);
  await expect(root.locator('[data-status]')).toHaveCount(1);
  await page.evaluate(() => window.PixelDaylightSwitch.mount(document.querySelector('#switch-a')));
  await expect(root.locator('canvas.scene')).toHaveCount(1);
  await expect(root.locator('button.hit')).toHaveCount(1);
});

test('supports repeated unmount and remount on the same element', async ({ page }) => {
  await page.goto('/tests/fixture.html');
  const root = page.locator('#switch-a');
  const canvas = root.locator('canvas.scene');
  await expect(canvas).toHaveCount(1);
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => {
      const el = document.querySelector('#switch-a');
      window.PixelDaylightSwitch.unmount(el);
      window.PixelDaylightSwitch.mount(el);
    });
    await expect(root.locator('canvas.scene')).toHaveCount(1);
    await expect(root.locator('button.hit')).toHaveCount(1);
  }
  const dimensions = await canvas.evaluate(el => ({width:el.width,height:el.height}));
  expect(dimensions.width).toBeGreaterThan(1);
  expect(dimensions.height).toBeGreaterThan(1);
});

test('mounts and releases multiple independent instances', async ({ page }) => {
  await page.goto('/tests/fixture.html');
  const result = await page.evaluate(() => {
    const roots = Array.from({length:12}, (_,i) => {
      const el = document.createElement('div');
      el.dataset.ldPart = 'toggle-daylight';
      el.style.width = '320px';
      document.body.appendChild(el);
      window.PixelDaylightSwitch.mount(el);
      return el;
    });
    const mounted = roots.every(el => el.querySelector('canvas.scene') && el.querySelector('button.hit'));
    roots.forEach(el => window.PixelDaylightSwitch.unmount(el));
    const retainedMarkup = roots.reduce((n,el) => n + el.querySelectorAll('canvas,button,[data-status],.probe').length, 0);
    roots.forEach(el => el.remove());
    return {mounted,retainedMarkup};
  });
  expect(result.mounted).toBeTruthy();
  // Unmount is intentionally non-destructive to caller-owned DOM; a remount can reuse it.
  expect(result.retainedMarkup).toBe(48);
});

test('supports pointer interaction without uncaught page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tests/fixture.html');
  const button = page.locator('#switch-a button.hit');
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5, {steps:8});
  await page.mouse.up();
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('playground fits a narrow mobile viewport and applies settings', async ({ page }) => {
  await page.setViewportSize({width:360,height:800});
  await page.route('https://gsvegetable.github.io/pixel-daylight-switch/app.js', route => route.fulfill({
    status:200,contentType:'text/javascript',body:require('node:fs').readFileSync(require('node:path').resolve(__dirname,'../../app.js'),'utf8')
  }));
  await page.goto('/playground.html');
  await expect(page.locator('#previewA canvas.scene')).toHaveCount(1);
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
  await page.locator('#speed').fill('12');
  await page.locator('#speed').dispatchEvent('change');
  await page.locator('#apply').click();
  await expect(page.locator('#status')).toContainText('参数已是最新', {timeout:10000});
  await expect(page.locator('#previewB canvas.scene')).toHaveCount(1);
});
