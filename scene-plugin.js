(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.PixelDaylightSwitchScenePlugins = api;
    root.PixelDaylightSwitchScenes = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const registry = new Map();
  const MAX_WIDTH = 192;
  const MAX_HEIGHT = 112;
  const MAX_PIXELS = MAX_WIDTH * MAX_HEIGHT;
  const ID_RE = /^[a-z0-9][a-z0-9._-]{1,62}[a-z0-9]$/;
  const COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
  const BUILT_INS = new Set(['countryside', 'japanese-street', 'apartment', 'seaside', 'mountain-cabin']);

  function validateScene(input) {
    const errors = [];
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return { valid: false, errors: ['Scene manifest must be an object.'] };
    }
    if (input.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
    if (typeof input.id !== 'string' || !ID_RE.test(input.id)) errors.push('id must be 3-64 lowercase letters, numbers, dots, underscores or hyphens.');
    if (BUILT_INS.has(input.id)) errors.push('Built-in scene IDs are reserved.');
    if (typeof input.name !== 'string' || !input.name.trim() || input.name.length > 80) errors.push('name must be a non-empty string of at most 80 characters.');
    if (typeof input.author !== 'string' || !input.author.trim() || input.author.length > 80) errors.push('author must be a non-empty string of at most 80 characters.');
    if (typeof input.license !== 'string' || !input.license.trim() || input.license.length > 64) errors.push('license must be a non-empty SPDX identifier or license label.');
    const width = input.canvas && input.canvas.width;
    const height = input.canvas && input.canvas.height;
    if (!Number.isInteger(width) || width < 1 || width > MAX_WIDTH) errors.push('canvas.width must be an integer from 1 to 192.');
    if (!Number.isInteger(height) || height < 1 || height > MAX_HEIGHT) errors.push('canvas.height must be an integer from 1 to 112.');
    if (Array.isArray(input.pixels) && Number.isInteger(height) && input.pixels.length !== height) errors.push('pixels must contain exactly canvas.height rows.');
    if (!Array.isArray(input.pixels) || input.pixels.length === 0) errors.push('pixels must be a non-empty array of strings.');
    if (Array.isArray(input.pixels) && Number.isInteger(width)) {
      input.pixels.forEach((row, index) => {
        if (typeof row !== 'string' || row.length !== width) errors.push('pixels[' + index + '] must be a string exactly canvas.width characters long.');
      });
    }
    if (!input.palettes || typeof input.palettes !== 'object' || Array.isArray(input.palettes)) errors.push('palettes must be an object of named color maps.');
    else {
      const names = Object.keys(input.palettes);
      if (!names.length) errors.push('palettes must define at least one palette.');
      names.forEach((name) => {
        const palette = input.palettes[name];
        if (!palette || typeof palette !== 'object' || Array.isArray(palette)) errors.push('palette "' + name + '" must be a color map.');
        else Object.keys(palette).forEach((symbol) => {
          if (symbol.length !== 1) errors.push('Palette keys must be exactly one character.');
          if (typeof palette[symbol] !== 'string' || !COLOR_RE.test(palette[symbol])) errors.push('Palette color for "' + symbol + '" must be #RGB or #RRGGBB.');
        });
      });
    }
    if (!Array.isArray(input.timeCycle) || input.timeCycle.length < 2) errors.push('timeCycle must contain at least two time stops.');
    else {
      let previous = -1;
      input.timeCycle.forEach((stop, index) => {
        if (!stop || !Number.isFinite(stop.at) || stop.at < 0 || stop.at > 24 || stop.at <= previous) errors.push('timeCycle[' + index + '].at must be strictly increasing from 0 to 24.');
        else previous = stop.at;
        if (!stop || typeof stop.palette !== 'string' || !input.palettes || !Object.prototype.hasOwnProperty.call(input.palettes, stop.palette)) errors.push('timeCycle[' + index + '] references an unknown palette.');
      });
    }
    if (Array.isArray(input.pixels) && input.palettes && typeof input.palettes === 'object') {
      const symbols = new Set();
      input.pixels.forEach((row) => { if (typeof row === 'string') for (const ch of row) symbols.add(ch); });
      Object.keys(input.palettes).forEach((name) => {
        const palette = input.palettes[name] || {};
        symbols.forEach((symbol) => { if (!Object.prototype.hasOwnProperty.call(palette, symbol)) errors.push('Palette "' + name + '" is missing pixel symbol "' + symbol + '".'); });
      });
    }
    return { valid: errors.length === 0, errors };
  }

  function registerScene(manifest) {
    const result = validateScene(manifest);
    if (!result.valid) {
      const error = new Error('Invalid Pixel Daylight Switch scene: ' + result.errors.join(' '));
      error.validationErrors = result.errors;
      throw error;
    }
    if (registry.has(manifest.id)) throw new Error('A scene with id "' + manifest.id + '" is already registered.');
    const frozen = Object.freeze(JSON.parse(JSON.stringify(manifest)));
    registry.set(frozen.id, frozen);
    let active = true;
    return function unregisterScene() {
      if (!active) return false;
      active = false;
      return registry.delete(frozen.id);
    };
  }

  function getScene(id) { return registry.get(id) || null; }
  function listScenes() { return Array.from(registry.values()); }
  function clearScenes() { registry.clear(); }

  return Object.freeze({ registerScene, validateScene, getScene, listScenes, clearScenes, schemaVersion: 1 });
});
