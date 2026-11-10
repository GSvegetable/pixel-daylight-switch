'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');

const pkg = require('../package.json');
assert.equal(pkg.name, 'pixel-daylight-switch-gsvegetable');
assert.equal(pkg.version, '1.3.0');

const api = require('../index.cjs');
assert.equal(typeof api.mount, 'function');
assert.equal(typeof api.unmount, 'function');

const allowed = new Set(pkg.files);
for (const required of ['app.js', 'index.cjs', 'index.mjs', 'README.md', 'LICENSE', 'llms.txt']) {
  assert.ok(allowed.has(required), 'Missing package file: ' + required);
}
for (const excluded of ['playground.html', 'preview.html', 'index.html']) {
  assert.ok(!allowed.has(excluded), 'Unexpected demo file in package allowlist: ' + excluded);
}

console.log('Package smoke tests passed.');
