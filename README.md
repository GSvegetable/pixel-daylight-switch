# Pixel Daylight Switch

[![Quality checks](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml/badge.svg)](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/pixel-daylight-switch-gsvegetable)](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](LICENSE)

**Languages:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

![Five animated pixel-world scenes](assets/scene-gallery.png)

*A tiny animated world, held inside a refractive glass switch.*

Pixel Daylight Switch is a draggable day/night UI component. Move its glass control to travel between day, dusk and night while a miniature pixel-art world changes inside the lens. It uses vanilla JavaScript, WebGL2 and a Canvas 2D fallback, with no third-party runtime dependency.

**[Open the live demo](https://gsvegetable.github.io/pixel-daylight-switch/)** · **[Launch the parameter lab](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** · **[Install from npm](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)**

## Start here

| Goal | Direct link |
| --- | --- |
| Experience the switch | [Live demo](https://gsvegetable.github.io/pixel-daylight-switch/) |
| Customize scenes and visual behavior | [Interactive parameter lab](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) |
| Inspect the component | [Preview page](https://gsvegetable.github.io/pixel-daylight-switch/preview.html) |
| Add it to a website with one script | [Embed loader source](embed.js) |
| Use it in a JavaScript project | [npm package](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable) |
| Read implementation details | [Runtime](app.js) · [Styles](style.css) |
| Download mobile builds | [Build notes and limitations](builds/README.md) · [GitHub Actions artifacts](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/mobile-build.yml) |
| Check tests | [CI workflow](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml) |
| Review changes | [Changelog](CHANGELOG.md) |
| Report a bug | [Issue tracker](https://github.com/GSvegetable/pixel-daylight-switch/issues) |

## Features

- Five scenes: countryside, Japanese street, modern apartment, seaside lighthouse and mountain cabin.
- Refractive glass rendering with WebGL2 and a Canvas 2D fallback.
- Continuous drag interaction, tap/click switching and keyboard operation.
- Configurable motion, inertia, bounce, refraction, glass details, world speed, weather and scene.
- Multiple independent instances on one page.
- Switch semantics, live status announcements and `prefers-reduced-motion` support.
- `mount()` and `unmount()` lifecycle methods for dynamic applications.
- Rendering pauses when the document is hidden or the component is outside the viewport.

## Quick start — browser, no build step

Place a mount point on your page and load the runtime:

```html
<div data-ld-part="toggle-daylight" style="width: min(100%, 800px);">
</div>

<script defer src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

The browser runtime finds the mount point and creates the component UI. The host element needs a usable width.

### Embed with one script

For a self-inserting embed, add this script where you want the component to appear:

```html
<script src="https://gsvegetable.github.io/pixel-daylight-switch/embed.js"></script>
```

The loader inserts its own container, stylesheet and runtime. It currently creates one default instance with a fixed maximum display size; use the mount-point approach above when you need precise layout or custom attributes.

## Install from npm

```bash
npm install pixel-daylight-switch-gsvegetable
```

**ES modules**

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');
PixelDaylightSwitch.mount(root);

// Call before removing the root from the DOM.
PixelDaylightSwitch.unmount(root);
```

**CommonJS**

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

The package exposes ESM and CommonJS entry points. Importing is safe in an SSR environment; call `mount()` only in a browser after the target element exists. The package's published file list is defined in [package.json](package.json).

## Configuration

Set optional attributes on the mount element. Defaults apply when an attribute is omitted or invalid.

| Attribute | Default | Description |
| --- | ---: | --- |
| `data-speed` | `9.5` | Base response speed; greater than zero. |
| `data-refraction` | `1.24` | Glass lens refraction strength; greater than zero. |
| `data-bezel` | `0.046` | Relative glass-edge thickness; greater than zero. |
| `data-start-night` | `false` | Exact string `"true"` starts in night mode. |
| `data-friction` | `0.6` | Release inertia damping; clamped to `0.1–0.9`. |
| `data-bounce` | `3.2` | Edge rebound strength; clamped to `0–12`. |
| `data-dispersion` | `0.05` | RGB dispersion at the glass edge; clamped to `0–0.25`. |
| `data-shine` | `0.44` | Daylight glass highlight; clamped to `0–1.5`. |
| `data-time-speed` | `1` | World simulation speed; clamped to `0–8`. Set to `0` to freeze world motion. |
| `data-weather` | `default` | `default` or `snow`. Unknown values fall back to `default`. |
| `data-scene` | `countryside` | `countryside`, `japanese-street`, `apartment`, `seaside` or `mountain-cabin`. |

Example:

```html
<div
  data-ld-part="toggle-daylight"
  data-start-night="true"
  data-scene="seaside"
  data-weather="snow"
  data-time-speed="1.4"
  data-refraction="1.3">
</div>
```

## Events and state

The root element exposes transition progress through the CSS custom property `--night`: `0` is day, `1` is night, and values between them represent the transition.

When the committed day/night state changes, the root dispatches a bubbling, composed `daylight:change` event. `event.detail.night` is a boolean. It is not emitted on every animation frame.

```js
const root = document.querySelector('[data-ld-part="toggle-daylight"]');

root.addEventListener('daylight:change', (event) => {
  console.log(event.detail.night ? 'Night' : 'Day');
});
```

## Rendering, accessibility and performance

- WebGL2 renders the refractive lens; Canvas 2D is used if WebGL2 is unavailable or fails to initialize.
- The component scales its drawing surface to its container.
- Rendering pauses while the document is hidden or the component is outside the viewport.
- Keyboard and switch semantics are provided, with a live status announcement.
- The runtime respects the operating system's `prefers-reduced-motion` preference.

Performance varies with browser, graphics hardware, device pixel ratio and the number of visible instances.

## Development and tests

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

Run the Chromium browser regression suite:

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

GitHub Actions runs package and SSR checks on Node.js 18, 20 and 22, plus Chromium interaction and mobile regression tests. See [current workflow runs](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml).

## Android and iOS

The Capacitor app includes a native-friendly control surface for all five worlds (countryside, Japanese street, apartment, seaside and mountain cabin), plus an optional snowfall effect. Scene and weather changes reuse the shared renderer; the glass shader and day/night interaction remain the same. The app shell detects English, Simplified Chinese and Japanese from the device language. GitHub Actions produces an Android debug APK and an unsigned iOS Simulator archive. These are development artifacts, not store-ready releases: the Android APK is not a Play Store release, and the iOS Simulator build cannot be installed on a physical iPhone or iPad. See [mobile build notes](builds/README.md) and the [mobile workflow](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/mobile-build.yml).



### Embed in a web page

For one basic day/night switch, no package installation is required. Paste this single line into your HTML:

```html
<script src="https://gsvegetable.github.io/pixel-daylight-switch/embed.js"></script>
```

The loader injects its styles and one default-scene switch. For custom scenes, weather, multiple instances or full control over placement, use the npm API above and its `data-scene` / `data-weather` attributes.

### Integrate with your own Android / iOS Capacitor app

This repository currently ships a **Capacitor app template and build scripts**, not a separately installable native UI plugin. For an existing Capacitor 8 project, integrate this repository's `mobile/`, `app.js`, `style.css` and `scripts/prepare-mobile.cjs`, then run:

```bash
npm install
npm run mobile:prepare
npm run mobile:android:init  # first-time Android project creation
npm run mobile:android      # sync subsequent updates
```

For iOS, use `npm run mobile:ios:init` once and `npm run mobile:ios` for later syncs; macOS and Xcode are required. Open the native projects with `npm run mobile:open:android` or `npm run mobile:open:ios`. See [package.json](package.json) for the exact scripts.

## Repository map

```text
pixel-daylight-switch/
├── .github/workflows/       # CI, native mobile builds, npm publishing
├── assets/
│   └── scene-gallery.png    # Five-scene overview image
├── builds/
│   └── README.md            # Mobile artifact notes; binaries are workflow outputs
├── mobile/
│   ├── index.html            # Capacitor app entry
│   └── mobile.css            # Mobile-only layout
├── scripts/
│   └── prepare-mobile.cjs   # Prepare the shared web runtime for Capacitor
├── tests/
│   ├── browser/              # Playwright interaction and mobile regressions
│   ├── fixture.html
│   ├── mobile-smoke.cjs
│   ├── package-smoke.cjs
│   └── server.cjs
├── app.js                    # Component runtime, scenes, input and rendering
├── style.css                 # Component styles
├── embed.js                  # One-script website embed loader
├── index.html                # Live demo page
├── preview.html              # Component preview
├── playground.html            # Interactive parameter lab
├── index.mjs / index.cjs     # ESM and CommonJS package entry points
├── package.json               # Package metadata and scripts
├── capacitor.config.json     # Capacitor configuration
├── playwright.config.cjs     # Browser test configuration
├── CHANGELOG.md
├── llms.txt
├── LICENSE
└── README*.md                 # English, Simplified Chinese and Japanese docs
```

## License

Released under [The Unlicense](LICENSE). You may copy, modify, publish, distribute and use the software for personal or commercial purposes without attribution. It is provided without warranty.
