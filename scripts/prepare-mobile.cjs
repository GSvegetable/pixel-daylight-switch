'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'mobile', 'www');
const required = ['app.js', 'style.css', 'mobile/index.html', 'mobile/mobile.css', 'capacitor.config.json'];
const config = JSON.parse(fs.readFileSync(path.join(root, 'capacitor.config.json'), 'utf8'));
if (config.webDir !== 'mobile/www') throw new Error('Capacitor webDir must target the generated mobile/www directory');
if (typeof config.appId !== 'string' || !config.appId.includes('.') || !/^[a-z0-9.]+$/.test(config.appId)) throw new Error('Capacitor appId must be a reverse-domain identifier');

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Mobile build input is missing: ${file}`);
  }
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(path.join(root, 'app.js'), path.join(output, 'app.js'));
fs.copyFileSync(path.join(root, 'style.css'), path.join(output, 'style.css'));
fs.copyFileSync(path.join(root, 'mobile/index.html'), path.join(output, 'index.html'));
fs.copyFileSync(path.join(root, 'mobile/mobile.css'), path.join(output, 'mobile.css'));

const gallery = path.join(root, 'assets', 'scene-gallery.png');
if (fs.existsSync(gallery)) {
  fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
  fs.copyFileSync(gallery, path.join(output, 'assets', 'scene-gallery.png'));
}

console.log(`Prepared Capacitor web assets at ${path.relative(root, output)}`);
