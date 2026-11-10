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
for (const file of ['index.html', 'app.js', 'scene-plugin.js', 'style.css', 'mobile.css']) {
  assert.ok(fs.existsSync(path.join(output, file)), `Missing generated mobile asset: ${file}`);
}
const config = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'));
assert.equal(config.webDir, 'mobile/www');
assert.equal(config.backgroundColor, '#eef1f5');
assert.equal(config.android.backgroundColor, '#eef1f5');
assert.ok(typeof config.appId === 'string' && config.appId.includes('.') && /^[a-z0-9.]+$/.test(config.appId));
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
assert.match(html, /viewport-fit=cover/);
assert.match(html, /theme-color\" content=\"#eef1f5/);
assert.match(html, /mobile\.css/);
assert.match(html, /data-ld-part="toggle-daylight"/);
assert.equal((html.match(/data-scene-choice=/g) || []).length, 5);
assert.match(html, /weather-toggle/);
assert.match(html, /PixelDaylightSwitch\.unmount\(root\)/);
assert.match(html, /PixelDaylightSwitch\.mount\(root\)/);
assert.match(html, /daylight:change/);
assert.match(html, /scene-plugin\.js/);
assert.match(html, /pluginScript\.onload = loadApp/);
assert.match(html, /app\.js/);
assert.match(html, /unhandledrejection/);
assert.match(html, /__PDS_DIAG__/);
assert.match(html, /Resource Load Failed/);
const mobileCss = fs.readFileSync(path.join(output, 'mobile.css'), 'utf8');
assert.match(mobileCss, /#pds-diagnostic/);
assert.match(mobileCss, /background:\s*#eef1f5/);
assert.match(mobileCss, /\.scene-picker/);
assert.match(mobileCss, /\.world-tools/);
assert.doesNotMatch(mobileCss, /#f5ecd9/);
const rendererSource = fs.readFileSync(path.join(output, 'app.js'), 'utf8');
assert.match(rendererSource, /WebGL2 Failed/);
assert.match(rendererSource, /Vertex Shader/);
assert.match(rendererSource, /Canvas 2D Failed/);
const renderer = fs.readFileSync(path.join(output, 'app.js'), 'utf8');
assert.equal(renderer, fs.readFileSync(path.join(root, 'app.js'), 'utf8'), 'Mobile build must use the exact shared renderer');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.equal(pkg.version, '3.0.1');
const os = require('node:os');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pds-android-version-'));
try {
  const gradlePath = path.join(tempDir, 'build.gradle');
  fs.writeFileSync(gradlePath, "android { defaultConfig { versionCode 1; versionName '1.0' } }");
  const versionRun = spawnSync(process.execPath, [path.join(root, 'scripts/set-android-version.cjs'), gradlePath], { cwd: root, encoding: 'utf8' });
  assert.equal(versionRun.status, 0, versionRun.stderr || versionRun.stdout);
  const gradle = fs.readFileSync(gradlePath, 'utf8');
  assert.match(gradle, /versionCode 30100/);
  assert.match(gradle, /versionName "3\.0\.1"/);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
console.log('Mobile shell, neutral theme, and Android version checks passed.');
