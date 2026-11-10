export interface ScenePalette {
  [symbol: string]: `#${string}`;
}
export interface SceneTimeStop { at: number; palette: string; }
export interface ScenePixelAsset {
  width: number;
  height: number;
  /** One printable-ASCII character per pixel. A dot is transparent when used as a layer. */
  pixels: string[];
}
export interface SceneLayerAnimation {
  /** drift and bob are deterministic sinusoidal motion tracks. */
  type: 'drift' | 'bob';
  axis: 'x' | 'y';
  /** Cycles per second, from 0 to 4. */
  speed: number;
  /** Motion amplitude in scene pixels, from 1 to 64. */
  distance: number;
  /** Optional phase in radians, from 0 to 2π. */
  phase?: number;
}
export interface SceneLayer {
  id: string;
  asset: string;
  x: number;
  y: number;
  animation?: SceneLayerAnimation;
}
export interface SceneManifestBase {
  id: string;
  name: string;
  author: string;
  license: string;
  canvas: { width: number; height: number };
  pixels: string[];
  palettes: Record<string, ScenePalette>;
  timeCycle: SceneTimeStop[];
}
/** Manifest v1 preserves the original single pixel-matrix format. */
export interface SceneManifestV1 extends SceneManifestBase { schemaVersion: 1; }
/** Manifest v2 adds reusable pixel assets, compositing layers and declarative motion. */
export interface SceneManifestV2 extends SceneManifestBase {
  schemaVersion: 2;
  assets: Record<string, ScenePixelAsset>;
  layers: SceneLayer[];
}
export type SceneManifest = SceneManifestV1 | SceneManifestV2;
export interface SceneValidationResult { valid: boolean; errors: string[]; }
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
