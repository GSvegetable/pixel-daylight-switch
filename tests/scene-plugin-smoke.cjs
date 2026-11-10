'use strict';
const assert = require('node:assert/strict');
const plugins = require('../scene-plugin.js');
const example = require('../examples/scenes/sakura-evening.json');

assert.equal(plugins.schemaVersion, 1);
assert.equal(plugins.validateScene(example).valid, true);
const unregister = plugins.registerScene(example);
assert.equal(plugins.getScene(example.id).name, 'Sakura Evening');
assert.equal(plugins.listScenes().length, 1);
assert.equal(unregister(), true);
assert.equal(unregister(), false);
assert.equal(plugins.getScene(example.id), null);

const bad = JSON.parse(JSON.stringify(example));
bad.pixels[0] = 'too-short';
assert.equal(plugins.validateScene(bad).valid, false);
assert.throws(() => plugins.registerScene(bad), /Invalid Pixel Daylight Switch scene/);
assert.throws(() => plugins.registerScene({ ...example, id: 'seaside' }), /reserved/);
plugins.registerScene(example);
assert.throws(() => plugins.registerScene(example), /already registered/);
plugins.clearScenes();
console.log('Scene plugin manifest validation and registry tests passed.');
