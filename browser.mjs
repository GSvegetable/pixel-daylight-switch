import './glass-engine.js';
import './scene-plugin.js';

// Browser ESM consumers need to register their scene before mounting.
// Suppress the classic script's automatic DOM scan until the caller invokes mount().
globalThis.__PDS_DEFER_AUTO_MOUNT__ = true;
try {
  await import('./app.js');
} finally {
  delete globalThis.__PDS_DEFER_AUTO_MOUNT__;
}

const api = globalThis.PixelDaylightSwitch;\napi.createGlass = globalThis.PixelGlassEngine.createGlass;
const scenes = globalThis.PixelDaylightSwitchScenePlugins;
export const mount = api.mount;
export const unmount = api.unmount;
export const registerScene = scenes.registerScene;
export const validateScene = scenes.validateScene;
export const getScene = scenes.getScene;
export const listScenes = scenes.listScenes;
export default api;

export const createGlass = globalThis.PixelGlassEngine.createGlass;
