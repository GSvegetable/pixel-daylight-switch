'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const embed = fs.readFileSync(path.join(root, 'embed.js'), 'utf8');
const playground = fs.readFileSync(path.join(root, 'demos', 'playground.html'), 'utf8');
const integrations = fs.readFileSync(path.join(root, 'docs', 'INTEGRATIONS.md'), 'utf8');

assert.match(embed, /data-ld-part/);
assert.match(embed, /aspect-ratio:1\.6439/);
assert.match(embed, /width:min\(100%, 800px\)/);
assert.match(embed, /pixel-daylight-switch\/scene-plugin\.js/);
assert.match(embed, /plugins\.onload = loadRuntime/);
assert.match(embed, /pixel-daylight-switch\/app\.js/);
assert.doesNotMatch(embed, /createElement\(['"]link['"]\)|\.href\s*=|rel\s*=\s*['"]stylesheet['"]/, 'The embed loader must not inject a global stylesheet.');
assert.doesNotMatch(embed, /document\.body\.style|document\.documentElement\.style/, 'The embed loader must not mutate host page global styles.');
assert.match(playground, /width:min\(100%, 800px\)/, 'Playground snippets must include a responsive sizing wrapper.');
assert.match(playground, /data-ld-part="toggle-daylight"/);
assert.match(integrations, /## React/);
assert.match(integrations, /## Vue 3/);
assert.match(integrations, /onBeforeUnmount/);

console.log('Embed isolation, responsive snippet, and framework integration checks passed.');
