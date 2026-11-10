export interface ScenePalette {
  [symbol: string]: `#${string}`;
}

export interface SceneTimeStop {
  /** Local scene time in hours, from 0 through 24. */
  at: number;
  /** Key in SceneManifest.palettes. */
  palette: string;
}

export interface SceneManifest {
  schemaVersion: 1;
  /** Unique lowercase community scene identifier (3-64 characters). */
  id: string;
  name: string;
  author: string;
  /** SPDX identifier or a clearly stated license label. */
  license: string;
  canvas: { width: number; height: number };
  /** One printable-ASCII character per pixel; rows match canvas dimensions. */
  pixels: string[];
  /** Each palette maps every used pixel symbol to a #RGB or #RRGGBB color. */
  palettes: Record<string, ScenePalette>;
  /** Strictly increasing palette stops; must begin at 0 and end at 24. */
  timeCycle: SceneTimeStop[];
}

export interface SceneValidationResult {
  valid: boolean;
  errors: string[];
}

export type UnregisterScene = () => boolean;

export interface PixelDaylightSwitchAPI {
  mount(root: Element | null): (() => void) | null;
  unmount(root: Element | null): void;
  registerScene(manifest: SceneManifest): UnregisterScene;
  validateScene(manifest: unknown): SceneValidationResult;
  getScene(id: string): SceneManifest | null;
  listScenes(): SceneManifest[];
}

declare const PixelDaylightSwitch: PixelDaylightSwitchAPI;
export declare const mount: PixelDaylightSwitchAPI['mount'];
export declare const unmount: PixelDaylightSwitchAPI['unmount'];
export declare const registerScene: PixelDaylightSwitchAPI['registerScene'];
export declare const validateScene: PixelDaylightSwitchAPI['validateScene'];
export declare const getScene: PixelDaylightSwitchAPI['getScene'];
export declare const listScenes: PixelDaylightSwitchAPI['listScenes'];
export default PixelDaylightSwitch;
