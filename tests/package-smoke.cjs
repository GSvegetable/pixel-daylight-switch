'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const pkg = require('../package.json');
  assert.equal(pkg.name, 'pixel-daylight-switch-gsvegetable');
  assert.equal(pkg.version, '3.0.1');

  // CommonJS import must be safe in Node/SSR without window or document.
  const cjs = require('../index.cjs');
  assert.equal(typeof cjs.mount, 'function');
  assert.equal(typeof cjs.unmount, 'function');
  assert.equal(typeof cjs.registerScene, 'function');
  assert.equal(typeof cjs.validateScene, 'function');

  // ESM import must expose the same API and remain SSR-safe.
  const esm = await import('../index.mjs');
  assert.equal(typeof esm.mount, 'function');
  assert.equal(typeof esm.unmount, 'function');
  assert.equal(typeof esm.registerScene, 'function');
  assert.equal(esm.default, cjs);

  // Browser ESM entry must defer auto-mount and expose the plugin registry.
  const browserEntry = fs.readFileSync(path.join(__dirname, '..', 'browser.mjs'), 'utf8');
  assert.match(browserEntry, /__PDS_DEFER_AUTO_MOUNT__/);
  assert.match(browserEntry, /export const registerScene/);

  assert.equal(pkg.main, './index.cjs');
  assert.equal(pkg.module, './index.mjs');
  assert.equal(pkg.exports['.'].import, './index.mjs');
  assert.equal(pkg.exports['.'].require, './index.cjs');
  assert.equal(pkg.exports['.'].browser, './browser.mjs');
  assert.equal(pkg.browser, './browser.mjs');

  const allowed = new Set(pkg.files);
  for (const required of ['app.js', 'index.cjs', 'index.mjs', 'scene-plugin.js', 'browser.mjs', 'docs/SCENE_PLUGINS.md', 'docs/INTEGRATIONS.md', 'docs/CHANGELOG.md', 'README.md', 'LICENSE', 'llms.txt']) {
    assert.ok(allowed.has(required), 'Missing package file: ' + required);
    assert.ok(fs.existsSync(path.join(__dirname, '..', required)), 'Missing source file: ' + required);
  }
  for (const excluded of ['playground.html', 'preview.html', 'index.html']) {
    assert.ok(!allowed.has(excluded), 'Unexpected demo file in package allowlist: ' + excluded);
  }

  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert.ok(app.includes('function unmountOne(root)'), 'Public unmount implementation is missing');
  assert.ok(app.includes('io.disconnect()') && app.includes('ro.disconnect()'), 'Observer cleanup is missing');
  assert.ok(app.includes('for (const off of cleanups) off()'), 'Event listener cleanup is missing');
  assert.ok(!app.includes("getExtension('WEBGL_lose_context')"), 'Unmount must not invalidate a canvas that may be mounted again');

  console.log('Package smoke and SSR tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
