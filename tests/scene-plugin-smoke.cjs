'use strict';
const assert = require('node:assert/strict');
const plugins = require('../scene-plugin.js');
const example = require('../examples/scenes/sakura-evening.json');
const layered = require('../examples/scenes/floating-island.v2.json');

assert.equal(plugins.schemaVersion, 1);
assert.equal(plugins.validateScene(layered).valid, true, plugins.validateScene(layered).errors.join(' '));
const unregisterLayered = plugins.registerScene(layered);
assert.equal(plugins.getScene(layered.id).schemaVersion, 2);
assert.equal(Object.isFrozen(plugins.getScene(layered.id).assets.tree.pixels), true);
assert.equal(unregisterLayered(), true);
assert.equal(plugins.validateScene(example).valid, true);
const unregister = plugins.registerScene(example);
assert.equal(plugins.getScene(example.id).name, 'Sakura Evening');
assert.equal(Object.isFrozen(plugins.getScene(example.id)), true);
assert.equal(Object.isFrozen(plugins.getScene(example.id).palettes.day), true);
assert.equal(Object.isFrozen(plugins.getScene(example.id).pixels), true);
assert.equal(plugins.listScenes().length, 1);
assert.equal(Object.isFrozen(plugins.getScene(example.id)), true);
assert.equal(Object.isFrozen(plugins.getScene(example.id).palettes.day), true);
assert.equal(unregister(), true);
assert.equal(unregister(), false);
assert.equal(plugins.getScene(example.id), null);

const bad = JSON.parse(JSON.stringify(example));
bad.pixels[0] = 'too-short';
assert.equal(plugins.validateScene(bad).valid, false);
assert.throws(() => plugins.registerScene(bad), /Invalid Pixel Daylight Switch scene/);
assert.throws(() => plugins.registerScene({ ...example, id: 'seaside' }), /reserved/);
assert.equal(plugins.validateScene({ ...example, arbitraryCode: 'alert(1)' }).valid, false);
assert.equal(plugins.validateScene({ ...example, timeCycle: [{at:1,palette:'night'},{at:24,palette:'night'}] }).valid, false);

const badTimeline = JSON.parse(JSON.stringify(example));
badTimeline.timeCycle[0].at = 1;
assert.match(plugins.validateScene(badTimeline).errors.join(' '), /start at hour 0/);

const badSymbol = JSON.parse(JSON.stringify(example));
badSymbol.pixels[0] = '😀..............';
assert.equal(plugins.validateScene(badSymbol).valid, false);

const tooManyPalettes = JSON.parse(JSON.stringify(example));
tooManyPalettes.palettes.extra1 = { ...tooManyPalettes.palettes.day };
tooManyPalettes.palettes.extra2 = { ...tooManyPalettes.palettes.day };
tooManyPalettes.palettes.extra3 = { ...tooManyPalettes.palettes.day };
tooManyPalettes.palettes.extra4 = { ...tooManyPalettes.palettes.day };
tooManyPalettes.palettes.extra5 = { ...tooManyPalettes.palettes.day };
tooManyPalettes.palettes.extra6 = { ...tooManyPalettes.palettes.day };
assert.match(plugins.validateScene(tooManyPalettes).errors.join(' '), /more than 8 palettes/);

const unregisterAgain = plugins.registerScene(example);
assert.throws(() => plugins.registerScene(example), /already registered/);
assert.equal(unregisterAgain(), true);
const badLayer = JSON.parse(JSON.stringify(layered));
badLayer.layers[0].animation = { type: 'execute', axis: 'x', speed: 1, distance: 4 };
assert.equal(plugins.validateScene(badLayer).valid, false);
const missingSymbol = JSON.parse(JSON.stringify(layered));
missingSymbol.assets.tree.pixels[0] = 'zzzzz';
assert.equal(plugins.validateScene(missingSymbol).valid, false);
console.log('Scene plugin v1/v2 validation, registry and motion-track tests passed.');
