import './scene-plugin.js';
import './app.js';

const api = globalThis.PixelDaylightSwitch;
export const mount = api.mount;
export const unmount = api.unmount;
export const registerScene = globalThis.PixelDaylightSwitchScenePlugins.registerScene;
export const validateScene = globalThis.PixelDaylightSwitchScenePlugins.validateScene;
export const getScene = globalThis.PixelDaylightSwitchScenePlugins.getScene;
export const listScenes = globalThis.PixelDaylightSwitchScenePlugins.listScenes;
export default api;
