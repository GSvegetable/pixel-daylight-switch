'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const run = spawnSync(process.execPath, [path.join(root, 'scripts/prepare-mobile.cjs')], {
  cwd: root,
  encoding: 'utf8'
});
assert.equal(run.status, 0, run.stderr || run.stdout);

const output = path.join(root, 'mobile/www');
for (const file of ['index.html', 'app.js', 'style.css', 'mobile.css']) {
  assert.ok(fs.existsSync(path.join(output, file)), `Missing generated mobile asset: ${file}`);
}
const config = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'));
assert.equal(config.webDir, 'mobile/www');
assert.ok(typeof config.appId === 'string' && config.appId.includes('.') && /^[a-z0-9.]+$/.test(config.appId));
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
assert.match(html, /viewport-fit=cover/);
assert.match(html, /mobile\.css/);
assert.match(html, /data-ld-part="toggle-daylight"/);
assert.match(html, /app\.js/);
const renderer = fs.readFileSync(path.join(output, 'app.js'), 'utf8');
assert.equal(renderer, fs.readFileSync(path.join(root, 'app.js'), 'utf8'), 'Mobile build must use the exact shared renderer');
console.log('Mobile shell smoke checks passed.');
