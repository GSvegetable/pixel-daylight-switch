(function (root, factory) {
  const api = root && root.PixelDaylightSwitchScenePlugins ? root.PixelDaylightSwitchScenePlugins : factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.PixelDaylightSwitchScenePlugins = api;
    root.PixelDaylightSwitchScenes = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const registry = new Map();
  const MAX_WIDTH = 192, MAX_HEIGHT = 112, MAX_PALETTES = 8, MAX_SYMBOLS = 64, MAX_TIME_STOPS = 48, MAX_ASSETS = 24, MAX_LAYERS = 16, MAX_TOTAL_CELLS = 430080;
  const ID_RE = /^[a-z0-9][a-z0-9._-]{1,62}[a-z0-9]$/;
  const COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
  const SYMBOL_RE = /^[\x20-\x7E]$/;
  const BUILT_INS = new Set(['countryside', 'japanese-street', 'apartment', 'seaside', 'mountain-cabin']);
  const isPlainObject = value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  };
  const unknownKeys = (value, allowed, path, errors) => {
    if (isPlainObject(value)) Object.keys(value).forEach(key => { if (!allowed.has(key)) errors.push(path + ' contains unsupported property "' + key + '".'); });
  };
  function validateScene(input) {
    const errors = [];
    if (!isPlainObject(input)) return { valid:false, errors:['Scene manifest must be a plain object.'] };
    unknownKeys(input, new Set(['schemaVersion','id','name','author','license','canvas','pixels','palettes','timeCycle','assets','layers']), 'manifest', errors);
    if (input.schemaVersion !== 1 && input.schemaVersion !== 2) errors.push('schemaVersion must be 1 or 2.');
    if (input.schemaVersion === 1 && (input.assets !== undefined || input.layers !== undefined)) errors.push('assets and layers require schemaVersion 2.');
    if (input.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
    if (typeof input.id !== 'string' || !ID_RE.test(input.id)) errors.push('id must be 3-64 lowercase letters, numbers, dots, underscores or hyphens.');
    if (BUILT_INS.has(input.id)) errors.push('Built-in scene IDs are reserved.');
    if (typeof input.name !== 'string' || !input.name.trim() || input.name.length > 80) errors.push('name must be a non-empty string of at most 80 characters.');
    if (typeof input.author !== 'string' || !input.author.trim() || input.author.length > 80) errors.push('author must be a non-empty string of at most 80 characters.');
    if (typeof input.license !== 'string' || !input.license.trim() || input.license.length > 64) errors.push('license must be a non-empty SPDX identifier or license label.');
    const canvas = input.canvas;
    if (!isPlainObject(canvas)) errors.push('canvas must be an object.');
    else unknownKeys(canvas, new Set(['width','height']), 'canvas', errors);
    const width = canvas && canvas.width, height = canvas && canvas.height;
    if (!Number.isInteger(width) || width < 1 || width > MAX_WIDTH) errors.push('canvas.width must be an integer from 1 to 192.');
    if (!Number.isInteger(height) || height < 1 || height > MAX_HEIGHT) errors.push('canvas.height must be an integer from 1 to 112.');
    if (!Array.isArray(input.pixels) || input.pixels.length === 0) errors.push('pixels must be a non-empty array of strings.');
    else {
      if (input.pixels.length > MAX_HEIGHT) errors.push('pixels cannot contain more than 112 rows.');
      if (Number.isInteger(height) && input.pixels.length !== height) errors.push('pixels must contain exactly canvas.height rows.');
      input.pixels.forEach((row,index) => {
        if (typeof row !== 'string' || !Number.isInteger(width) || row.length !== width) errors.push('pixels[' + index + '] must be a string exactly canvas.width characters long.');
        else if (!Array.from(row).every(symbol => SYMBOL_RE.test(symbol))) errors.push('pixels[' + index + '] may contain printable ASCII characters only.');
      });
    }
    const palettes = input.palettes;
    if (!isPlainObject(palettes)) errors.push('palettes must be an object of named color maps.');
    else {
      const names = Object.keys(palettes);
      if (!names.length) errors.push('palettes must define at least one palette.');
      if (names.length > MAX_PALETTES) errors.push('palettes cannot contain more than 8 palettes.');
      names.forEach(name => {
        const palette = palettes[name];
        if (!isPlainObject(palette)) errors.push('palette "' + name + '" must be a color map.');
        else {
          const symbols = Object.keys(palette);
          if (symbols.length > MAX_SYMBOLS) errors.push('palette "' + name + '" cannot contain more than 64 symbols.');
          symbols.forEach(symbol => {
            if (!SYMBOL_RE.test(symbol)) errors.push('Palette keys must be one printable ASCII character.');
            if (typeof palette[symbol] !== 'string' || !COLOR_RE.test(palette[symbol])) errors.push('Palette color for "' + symbol + '" must be #RGB or #RRGGBB.');
          });
        }
      });
    }
    const assets = input.assets;
    if (input.schemaVersion === 2) {
      if (!isPlainObject(assets) || Object.keys(assets).length < 1) errors.push('schemaVersion 2 requires at least one named pixel asset.');
      else {
        const names = Object.keys(assets);
        if (names.length > MAX_ASSETS) errors.push('assets may contain at most 24 pixel assets.');
        names.forEach(name => {
          const asset = assets[name];
          if (!/^[a-z0-9][a-z0-9._-]{0,47}$/.test(name)) errors.push('Asset names must be lowercase identifiers.');
          if (!isPlainObject(asset)) { errors.push('Asset "' + name + '" must be an object.'); return; }
          unknownKeys(asset, new Set(['width','height','pixels']), 'assets.' + name, errors);
          if (!Number.isInteger(asset.width) || asset.width < 1 || asset.width > MAX_WIDTH) errors.push('Asset "' + name + '" width must be 1-192.');
          if (!Number.isInteger(asset.height) || asset.height < 1 || asset.height > MAX_HEIGHT) errors.push('Asset "' + name + '" height must be 1-112.');
          if (!Array.isArray(asset.pixels) || asset.pixels.length !== asset.height) errors.push('Asset "' + name + '" pixels must match its height.');
          else asset.pixels.forEach((row,index) => {
            if (typeof row !== 'string' || row.length !== asset.width || !Array.from(row).every(symbol => SYMBOL_RE.test(symbol))) errors.push('Asset "' + name + '" row ' + index + ' must be printable ASCII and match its width.');
          });
        });
      }
      if (!Array.isArray(input.layers) || input.layers.length < 1 || input.layers.length > MAX_LAYERS) errors.push('layers must contain 1-16 layer definitions.');
      else input.layers.forEach((layer,index) => {
        if (!isPlainObject(layer)) { errors.push('layers[' + index + '] must be an object.'); return; }
        unknownKeys(layer, new Set(['id','asset','x','y','animation']), 'layers[' + index + ']', errors);
        if (typeof layer.id !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,47}$/.test(layer.id)) errors.push('layers[' + index + '].id must be a lowercase identifier.');
        if (!isPlainObject(assets) || typeof layer.asset !== 'string' || !Object.prototype.hasOwnProperty.call(assets,layer.asset)) errors.push('layers[' + index + '] references an unknown asset.');
        if (!Number.isInteger(layer.x) || layer.x < -MAX_WIDTH || layer.x > MAX_WIDTH) errors.push('layers[' + index + '].x must be an integer from -192 to 192.');
        if (!Number.isInteger(layer.y) || layer.y < -MAX_HEIGHT || layer.y > MAX_HEIGHT) errors.push('layers[' + index + '].y must be an integer from -112 to 112.');
        if (layer.animation !== undefined) {
          const animation = layer.animation;
          if (!isPlainObject(animation)) errors.push('layers[' + index + '].animation must be an object.');
          else {
            unknownKeys(animation,new Set(['type','axis','speed','distance','phase']),'layers[' + index + '].animation',errors);
            if (animation.type !== 'drift' && animation.type !== 'bob') errors.push('Animation type must be drift or bob.');
            if (animation.axis !== 'x' && animation.axis !== 'y') errors.push('Animation axis must be x or y.');
            if (!Number.isFinite(animation.speed) || animation.speed < 0 || animation.speed > 4) errors.push('Animation speed must be between 0 and 4.');
            if (!Number.isInteger(animation.distance) || animation.distance < 1 || animation.distance > 64) errors.push('Animation distance must be an integer from 1 to 64.');
            if (animation.phase !== undefined && (!Number.isFinite(animation.phase) || animation.phase < 0 || animation.phase > 6.2832)) errors.push('Animation phase must be between 0 and 2π.');
          }
        }
      });
      const totalCells = Object.values(assets || {}).reduce((sum,asset) => sum + (asset && Number.isInteger(asset.width) && Number.isInteger(asset.height) ? asset.width * asset.height : 0),0);
      if (totalCells > MAX_TOTAL_CELLS) errors.push('Total pixel asset area exceeds the scene budget.');
    }
    const timeCycle = input.timeCycle;
    if (!Array.isArray(timeCycle) || timeCycle.length < 2) errors.push('timeCycle must contain at least two time stops.');
    else {
      if (timeCycle.length > MAX_TIME_STOPS) errors.push('timeCycle may contain at most 48 stops.');
      let previous = -1;
      timeCycle.forEach((stop,index) => {
        if (!isPlainObject(stop)) { errors.push('timeCycle[' + index + '] must be an object.'); return; }
        unknownKeys(stop, new Set(['at','palette']), 'timeCycle[' + index + ']', errors);
        if (!Number.isFinite(stop.at) || stop.at < 0 || stop.at > 24 || stop.at <= previous) errors.push('timeCycle[' + index + '].at must be strictly increasing from 0 to 24.');
        else previous = stop.at;
        if (typeof stop.palette !== 'string' || !isPlainObject(palettes) || !Object.prototype.hasOwnProperty.call(palettes,stop.palette)) errors.push('timeCycle[' + index + '] references an unknown palette.');
      });
      if (timeCycle[0] && timeCycle[0].at !== 0) errors.push('timeCycle must start at hour 0.');
      if (timeCycle[timeCycle.length-1] && timeCycle[timeCycle.length-1].at !== 24) errors.push('timeCycle must end at hour 24.');
    }
    if (Array.isArray(input.pixels) && isPlainObject(palettes)) {
      const symbols = new Set();
      input.pixels.forEach(row => { if (typeof row === 'string') for (const symbol of row) symbols.add(symbol); });
      if (input.schemaVersion === 2 && isPlainObject(assets)) Object.values(assets).forEach(asset => { if (asset && Array.isArray(asset.pixels)) asset.pixels.forEach(row => { if (typeof row === 'string') for (const symbol of row) symbols.add(symbol); }); });
      if (symbols.size > MAX_SYMBOLS) errors.push('pixels cannot use more than 64 unique symbols.');
      Object.keys(palettes).forEach(name => {
        const palette = palettes[name];
        if (!isPlainObject(palette)) return;
        symbols.forEach(symbol => { if (!Object.prototype.hasOwnProperty.call(palette,symbol)) errors.push('Palette "' + name + '" is missing pixel symbol "' + symbol + '".'); });
      });
    }
    return { valid:errors.length === 0, errors };
  }
  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(key => deepFreeze(value[key]));
    return Object.freeze(value);
  }
  function registerScene(manifest) {
    const result = validateScene(manifest);
    if (!result.valid) {
      const error = new Error('Invalid Pixel Daylight Switch scene: ' + result.errors.join(' '));
      error.validationErrors = result.errors;
      throw error;
    }
    if (registry.has(manifest.id)) throw new Error('A scene with id "' + manifest.id + '" is already registered.');
    let snapshot;
    try { snapshot = JSON.parse(JSON.stringify(manifest)); }
    catch (cause) {
      const error = new Error('Scene manifest must be JSON-serializable.');
      error.cause = cause;
      throw error;
    }
    const frozen = deepFreeze(snapshot);
    registry.set(frozen.id, frozen);
    let active = true;
    return function unregisterScene() {
      if (!active) return false;
      active = false;
      return registry.delete(frozen.id);
    };
  }
  const getScene = id => registry.get(id) || null;
  const listScenes = () => Array.from(registry.values());
  return Object.freeze({ registerScene, validateScene, getScene, listScenes, schemaVersion:1 });
});
