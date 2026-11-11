# Scene Plugin Guide

Pixel Daylight Switch The community scene system supports a declarative community-scene format. A scene is JSON data, not an executable JavaScript plugin. The renderer validates the manifest and draws the resulting pixel world through the existing refractive-glass pipeline.

## Two ways to create a scene

**Palette creator:** Start with `../examples/scenes/sakura-evening.json`, keep its pixel rows, and change the colors under `palettes`. This is the quickest way to create a distinct atmosphere.

**Pixel-world creator:** Edit `canvas` and `pixels` to design your own geometry, then define a color for every symbol in each palette. Each character represents one pixel; rows must all have the declared width.

## Register with npm

```bash
npm install pixel-daylight-switch-gsvegetable
```

```js
import PixelDaylightSwitch, { registerScene } from 'pixel-daylight-switch-gsvegetable';
import myScene from './my-scene.json';

const unregister = registerScene(myScene);
const root = document.querySelector('[data-ld-part="toggle-daylight"]');
root.dataset.scene = myScene.id;
PixelDaylightSwitch.mount(root);

// Call when this scene is no longer needed:
unregister();
```

The scene must be registered before its root is mounted. Registering a scene returns an idempotent unregister function.

## Register in a browser

Load the registry before the renderer:

```html
<script src="https://gsvegetable.github.io/pixel-daylight-switch/scene-plugin.js"></script>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
<div data-ld-part="toggle-daylight" data-scene="sakura-evening"></div>
<script>
  PixelDaylightSwitch.registerScene(sceneManifest);
</script>
```

If the runtime auto-mounts on `DOMContentLoaded`, register the manifest before that event. For deterministic ordering, load both scripts with `defer` and register from a later deferred script, or register before loading `app.js`.

The one-line `embed.js` loader loads the registry before the renderer, but it does not fetch or execute arbitrary remote scene scripts. Register your manifest in your own page before the component mounts.

## Manifest v1

Required fields:

- `schemaVersion`: `1` for the original single-matrix format or `2` for layered pixel assets and motion.
- `id`: unique lowercase ID, 3–64 characters. Built-in scene IDs are reserved.
- `name`, `author`, `license`: scene metadata.
- `canvas`: width 1–192 and height 1–112.
- `pixels`: one printable-ASCII string per row; every row must match the declared width.
- `palettes`: one or more named maps from single characters to `#RGB` or `#RRGGBB`.
- `timeCycle`: strictly increasing time stops, beginning at hour 0 and ending at hour 24. Each stop references a defined palette.

Every symbol used in `pixels` must have a color in every palette. The renderer interpolates the RGB values between adjacent time stops, including across midnight. Keep the first and last palette compatible to avoid a visible midnight jump.

The authoritative machine-readable contract is [../schemas/scene-manifest.v1.schema.json](../schemas/scene-manifest.v1.schema.json). A complete sample is [../examples/scenes/sakura-evening.json](../examples/scenes/sakura-evening.json).

## Layered scenes and pixel assets (Manifest v2)

Version 3.0.1 adds reusable pixel-art assets, compositing layers and deterministic motion tracks. Manifest v1 remains supported without changes; use `schemaVersion: 2` to opt in.

A v2 manifest keeps the base `canvas`, `pixels`, `palettes` and `timeCycle`, and adds:

- `assets`: up to 24 named pixel matrices (each up to 192 × 112).
- `layers`: 1–16 ordered placements that reference an asset and specify integer `x` / `y` coordinates.
- `animation`: optional `drift` or `bob` motion on either axis, with bounded speed, distance and phase.

The dot character (`.`) is transparent when an asset is composited as a layer. All other characters are palette symbols, so every palette must define colors for symbols used by the base matrix and every asset. Layers are drawn in array order; later layers appear above earlier ones. Motion is deterministic and uses the scene's animation clock; it does not execute plugin code.

Example: [Floating Island v2](../examples/scenes/floating-island.v2.json). The v2 contract is [../schemas/scene-manifest.v2.schema.json](../schemas/scene-manifest.v2.schema.json); the original v1 contract remains at [../schemas/scene-manifest.v1.schema.json](../schemas/scene-manifest.v1.schema.json).

The current asset format is deliberately pixel-matrix based. Arbitrary PNG/JPEG downloads and executable animation callbacks are not part of v3.0.1; this keeps rendering crisp, portable, CSP-friendly and safe for community contributions.

## API

- `registerScene(manifest)`: validate, snapshot and register a scene; returns an unregister function.
- `validateScene(manifest)`: return `{ valid, errors }` without registering.
- `getScene(id)`: return a registered, deeply frozen manifest or `null`.
- `listScenes()`: return a new array of registered manifests.

Registration rejects duplicate IDs, built-in IDs, malformed dimensions, invalid colors, missing palette symbols, unsupported manifest fields and invalid timelines. Registered manifests are copied and deeply frozen so later edits to the original object cannot silently alter a running scene.

## Scope and safety

Manifest v1 supports palette-driven pixel maps; Manifest v2 adds bounded pixel-matrix assets, ordered layers and declarative drift/bob tracks. Neither version executes plugin JavaScript, evaluates expressions, loads arbitrary code or downloads external images. Raster image imports and tile-atlas tooling are outside the v3.0.1 scope.

All five built-in scenes continue to use their original hand-authored painters and scene-specific live behavior. Community scenes use the data-driven renderer and do not replace or mutate built-in scene definitions.
