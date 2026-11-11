'use strict';

// Load the declarative scene registry before the browser runtime so registered
// community scenes are available when mount() initializes a root.
const scenes = require('./scene-plugin.js');
const api = require('./app.js');
api.registerScene = scenes.registerScene;
api.validateScene = scenes.validateScene;
api.getScene = scenes.getScene;
api.listScenes = scenes.listScenes;
api.createGlass = require('./glass-engine.js').createGlass;\nmodule.exports = api;
