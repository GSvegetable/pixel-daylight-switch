import api from './index.cjs';
import { createGlass } from './glass-engine.mjs';

export const mount = api.mount;
export const unmount = api.unmount;
export const registerScene = api.registerScene;
export const validateScene = api.validateScene;
export const getScene = api.getScene;
export const listScenes = api.listScenes;
export default api;
\nexport { createGlass };\n