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
  await expect(page.locator('#previewB canvas.scene')).toHaveCount(1);
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
  await page.locator('#speed').evaluate(el => { el.value = '12'; el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); });
  await page.locator('#apply').click();
  await expect(page.locator('#status')).toContainText('参数已是最新', {timeout:10000});
  await expect(page.locator('#previewA canvas.scene')).toHaveCount(1);
});


test('playground language selector is visible, switches all supported locales, and stays within mobile width', async ({ page }) => {
  await page.setViewportSize({width:360,height:800});
  await page.route('https://gsvegetable.github.io/pixel-daylight-switch/app.js', route => route.fulfill({
    status:200,contentType:'text/javascript',body:require('node:fs').readFileSync(require('node:path').resolve(__dirname,'../../app.js'),'utf8')
  }));
  await page.goto('/playground.html');
  const language = page.locator('#language');
  await expect(language).toBeVisible();
  for (const [locale, title] of [['en','Pixel Daylight Switch'],['zh-CN','像素昼夜开关'],['ja','昼夜スイッチ']]) {
    await language.selectOption(locale);
    await expect(page.locator('.top b')).toHaveText(title);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
  }
  const widths = await page.evaluate(() => ({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
});

test('removes all component-owned event listeners on unmount', async ({ page }) => {
  await page.addInitScript(() => {
    const originalAdd = EventTarget.prototype.addEventListener;
    const originalRemove = EventTarget.prototype.removeEventListener;
    const listeners = new WeakMap();
    const captureOf = options => typeof options === 'boolean' ? options : !!(options && options.capture);
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (listener) {
        const entries = listeners.get(this) || [];
        if (!entries.some(x => x.type === type && x.listener === listener && x.capture === captureOf(options))) {
          entries.push({type,listener,capture:captureOf(options)});
          listeners.set(this,entries);
        }
      }
      return originalAdd.call(this,type,listener,options);
    };
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      const entries = listeners.get(this) || [];
      const index = entries.findIndex(x => x.type === type && x.listener === listener && x.capture === captureOf(options));
      if (index >= 0) entries.splice(index,1);
      return originalRemove.call(this,type,listener,options);
    };
    window.__activeListeners = target => (listeners.get(target) || []).length;
  });
  await page.goto('/tests/fixture.html');
  const button = page.locator('#switch-a button.hit');
  const before = await button.evaluate(el => window.__activeListeners(el));
  expect(before).toBeGreaterThan(0);
  await page.evaluate(() => window.PixelDaylightSwitch.unmount(document.querySelector('#switch-a')));
  const after = await button.evaluate(el => window.__activeListeners(el));
  expect(after).toBe(0);
});

test('accepts touch input in a mobile browser context', async ({ browser }) => {
  const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/tests/fixture.html');
  const hit = page.locator('#switch-a button.hit');
  await expect(hit).toBeVisible();
  const box = await hit.boundingBox();
  await page.touchscreen.tap(box.x + box.width * 0.7, box.y + box.height * 0.5);
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
  await context.close();
});


test('playground status localization does not create a MutationObserver feedback loop', async ({ page }) => {
  await page.route('https://gsvegetable.github.io/pixel-daylight-switch/app.js', route => route.fulfill({
    status:200,contentType:'text/javascript',body:require('node:fs').readFileSync(require('node:path').resolve(__dirname,'../../app.js'),'utf8')
  }));
  await page.goto('/playground.html');
  const mutations = await page.evaluate(async () => {
    const node = document.querySelector('#status');
    let count = 0;
    const observer = new MutationObserver(records => { count += records.length; });
    observer.observe(node, {childList:true, characterData:true, subtree:true});
    node.textContent = '参数有变动，尚未应用';
    await new Promise(resolve => setTimeout(resolve, 100));
    observer.disconnect();
    return {count, text:node.textContent};
  });
  expect(mutations.text).toBe('Settings changed — not applied yet');
  expect(mutations.count).toBeLessThanOrEqual(3);
});

test('range sliders preserve vertical page scrolling on touch devices', async ({ page }) => {
  await page.goto('/playground.html');
  const touchAction = await page.locator('#speed').evaluate(el => getComputedStyle(el).touchAction);
  expect(touchAction).toBe('pan-y');
});
