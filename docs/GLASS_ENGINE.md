# Standalone Glass Engine

PixelGlassEngine extracts the project's refractive lens into a reusable WebGL2 overlay. It is independent of the day/night switch: it does not create a switch, impose an aspect ratio, or set a fixed component size.

## Browser

Load `glass-engine.js`, then pass a source that the browser can upload to WebGL:

```html
<div id="card" style="position:relative;width:100%;height:260px;overflow:hidden">
  <canvas id="background" width="1200" height="520"></canvas>
</div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/glass-engine.js"></script>
<script>
  const card = document.querySelector('#card');
  const background = document.querySelector('#background');
  const glass = PixelGlassEngine.createGlass(card, {
    source: background,
    width: '72%',
    height: '68%',
    left: '14%',
    top: '16%',
    radius: 32,
    refraction: 1.24,
    dispersion: 0.05,
    bezel: 0.046,
    shine: 0.44
  });
  // Later: glass.setOptions({ refraction: 1.32 });
  // Before removing the card: glass.destroy();
</script>
```

## npm

```js
import { createGlass } from 'pixel-daylight-switch-gsvegetable/glass-engine';

const glass = createGlass(container, { source: backgroundCanvas, width: '70%', height: 160, radius: 28 });
glass.setOptions({ dispersion: 0.08 });
glass.setSource(nextCanvasOrImage);
glass.destroy();
```

## Source contract and browser security

The source may be an HTMLCanvasElement, OffscreenCanvas, HTMLImageElement, HTMLVideoElement, ImageBitmap, or a function returning one of those objects. The source must be ready and origin-clean. Cross-origin images require appropriate CORS headers and `crossOrigin = "anonymous"` before assigning `src`.

A browser does not expose arbitrary DOM pixels as a WebGL texture. Therefore this engine does not claim to refract any arbitrary page behind an overlay automatically. For a live webpage, provide a canvas snapshot/render target from the host application (for example, the same canvas used by a chart, game, or custom renderer). A DOM-to-canvas adapter is application-specific and may be blocked by cross-origin content, video, fonts, or browser security.

## Options

- `source`: canvas/image/video/bitmap or a callback returning one.
- `width`, `height`, `left`, `top`: numbers in CSS pixels or CSS length strings; no fixed aspect ratio.
- `radius`: number in CSS pixels or CSS length string.
- `refraction`: magnification factor; default `1.24`.
- `dispersion`: RGB edge separation, clamped to `0–0.25`.
- `bezel`: relative edge thickness, clamped to `0–0.3`.
- `shine`: highlight intensity.
- `opacity`: glass opacity from `0–1`.
- `ink`, `light`: RGB arrays in normalized `0–1`.
- `dpr`: render pixel-ratio ceiling, default `2`.
- `continuous`: redraw continuously for animated sources; set `false` for static sources and call `render()` when the source changes.

The renderer uses WebGL2. It throws a clear error if WebGL2 is unavailable rather than silently substituting a visually unrelated fake-refraction effect.
