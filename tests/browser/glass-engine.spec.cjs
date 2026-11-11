'use strict';
const { test, expect } = require('@playwright/test');

test('standalone glass engine renders an independently sized overlay', async ({ page }) => {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/demos/glass-engine.html');
  const canvas=page.locator('#stage canvas.pixel-glass-engine');
  await expect(canvas).toBeVisible();
  const initial=await canvas.evaluate(el=>({width:el.width,height:el.height,cssWidth:getComputedStyle(el).width}));
  expect(initial.width).toBeGreaterThan(0);
  expect(initial.height).toBeGreaterThan(0);
  await page.locator('#width').fill('48');
  await page.locator('#refraction').fill('1.55');
  await expect(page.locator('#widthOut')).toHaveText('48%');
  await expect(page.locator('#refractionOut')).toHaveText('1.55');
  expect(errors).toEqual([]);
});
