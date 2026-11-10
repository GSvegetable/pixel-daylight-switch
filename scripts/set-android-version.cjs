'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gradlePath = path.resolve(process.argv[2] || path.join(root, 'android/app/build.gradle'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const match = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(pkg.version || '');
if (!match) throw new Error('Invalid semantic app version: ' + pkg.version);
const versionCode = Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
let gradle = fs.readFileSync(gradlePath, 'utf8');
const codePattern = /(\bversionCode\s+)\d+/;
const namePattern = /(\bversionName\s+)[\"'][^\"']+[\"']/;
if (!codePattern.test(gradle) || !namePattern.test(gradle)) {
  throw new Error('Could not locate versionCode/versionName in ' + gradlePath);
}
gradle = gradle.replace(codePattern, '$1' + versionCode).replace(namePattern, '$1\"' + pkg.version + '\"');
fs.writeFileSync(gradlePath, gradle);
console.log('Android version set to ' + pkg.version + ' (versionCode ' + versionCode + ')');
