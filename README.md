# Pixel Daylight Switch

[![Quality checks](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml/badge.svg)](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/pixel-daylight-switch-gsvegetable)](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f7df1e?logo=javascript&logoColor=222)](https://developer.mozilla.org/docs/Web/JavaScript)

**Language / 语言 / 言語:** [English](#english) · [简体中文](#简体中文) · [日本語](#日本語)

![Pixel Daylight Switch — five animated pixel-world scenes](assets/scene-gallery.png)

A tiny animated world, held inside a refractive glass switch.

Pixel Daylight Switch is a self-contained day/night UI component. Drag its glass control to move between day, dusk, and night while a small pixel-art environment changes inside the lens. It is built with vanilla JavaScript, WebGL2, and a Canvas 2D fallback — with no third-party runtime dependencies.

**[Try the live Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** · **[View the source](https://github.com/GSvegetable/pixel-daylight-switch)** · **[Read the changelog](CHANGELOG.md)**

---

<a id="english"></a>
## English

### Highlights

- **A living pixel world:** five handcrafted environments — countryside, Japanese street, modern apartment, seaside lighthouse, and mountain cabin.
- **Refractive glass:** WebGL2 rendering creates the lens effect; Canvas 2D provides a fallback when WebGL2 cannot be initialized.
- **Continuous day/night motion:** drag, tap, click, or use the keyboard to move through the transition.
- **Tunable behavior and appearance:** configure motion, inertia, bounce, refraction, glass details, world speed, weather, and scene through HTML data attributes.
- **Multiple instances:** mount independent switches on the same page.
- **Accessibility-aware interaction:** switch semantics, an announced status, keyboard controls, and support for `prefers-reduced-motion`.
- **Lifecycle control:** explicit `mount()` and `unmount()` methods for dynamic applications.
- **Lightweight integration:** the standalone browser script has no third-party runtime dependencies.

### Try it

Open the **[Interactive Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** to change the scene and parameters, preview the result, and copy the generated HTML.

### Quick start — no build step

Add an empty mount point and load the browser script:

```html
<div data-ld-part="toggle-daylight"></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js">
</script>
```

The script automatically finds elements with `data-ld-part="toggle-daylight"` and creates the component markup and rendering surface. Give the mount point a width in your layout; the component scales to its container.

### Install from npm

```bash
npm install pixel-daylight-switch-gsvegetable
```

**ES modules**

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');

PixelDaylightSwitch.mount(root);

// Before removing the root from the DOM:
PixelDaylightSwitch.unmount(root);
```

**CommonJS**

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

The package exposes ESM and CommonJS entry points. It is safe to import in an SSR environment; call `mount()` only in the browser after the target element exists. Automatic mounting is provided when the browser runtime is loaded directly.

### Configuration

Every option is optional and is set on the component's root element. The defaults below are used when an attribute is omitted or contains an invalid value.

| Attribute | Default | Description |
| --- | ---: | --- |
| `data-speed` | `9.5` | Base response speed of the switch motion. Must be greater than zero. |
| `data-refraction` | `1.24` | Refraction strength of the glass lens. Must be greater than zero. |
| `data-bezel` | `0.046` | Relative thickness of the glass edge. Must be greater than zero. |
| `data-start-night` | `false` | Set to the exact string `"true"` to start in the night state. |
| `data-friction` | `0.6` | Inertia damping after release; clamped to `0.1–0.9`. |
| `data-bounce` | `3.2` | Edge rebound strength; clamped to `0–12`. |
| `data-dispersion` | `0.05` | RGB dispersion around the glass edge; clamped to `0–0.25`. |
| `data-shine` | `0.44` | Daytime glass highlight intensity; clamped to `0–1.5`. |
| `data-time-speed` | `1` | Pixel-world simulation speed; clamped to `0–8`. Set to `0` to freeze world dynamics. |
| `data-weather` | `default` | `default` or `snow`. Unknown values fall back to `default`. |
| `data-scene` | `countryside` | `countryside`, `japanese-street`, `apartment`, `seaside`, or `mountain-cabin`. |

**Example — start at night with the seaside scene**

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

### Events and state

The component exposes its transition progress as the CSS custom property `--night` on the root element:

- `0` — day
- `1` — night
- Values between `0` and `1` — transition in progress

When the committed day/night state changes, the root dispatches a bubbling, composed `daylight:change` event. Its `event.detail.night` property is a boolean.

```js
const root = document.querySelector('[data-ld-part="toggle-daylight"]');

root.addEventListener('daylight:change', (event) => {
  console.log(event.detail.night ? 'Night' : 'Day');
});
```

The event reports a change of the committed day/night state; it is not emitted for every animation frame.

### Rendering and performance

- WebGL2 is used for the refractive glass rendering.
- Canvas 2D is used when WebGL2 is unavailable or initialization fails.
- Rendering is paused when the document is hidden or the component is outside the viewport.
- The component measures its container and scales its drawing surface to fit.
- The component responds to the operating system's `prefers-reduced-motion` setting.

The browser script does not require a framework. Actual rendering performance depends on the browser, graphics hardware, device pixel ratio, and the number of instances on screen.

### Development and tests

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

The package smoke tests cover the module entry points, SSR import behavior, and mobile preparation checks.

To run the Chromium browser regression suite:

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

GitHub Actions runs package and SSR checks on Node.js 18, 20, and 22, plus the Chromium interaction and mobile regression suite. See the **[workflow runs](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml)** for the latest result.

### Mobile builds and validation

The repository includes Capacitor 8 build paths for Android and iOS. The mobile projects reuse the web renderer rather than maintaining a separate rendering implementation.

Build setup and commands are documented in the repository scripts and mobile configuration. Build success should not be interpreted as proof of compatibility on every physical device. Android real-device validation is ongoing; iOS simulator build support is included, but this repository does not provide a signed App Store IPA.

### Project hub

Start here based on what you want to do — no need to browse the repository manually.

| I want to… | Open |
| --- | --- |
| **Try the switch** | [Live interactive demo](https://gsvegetable.github.io/pixel-daylight-switch/) |
| **Tune every visual parameter** | [Parameter Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) |
| **See the component preview** | [Preview page](https://gsvegetable.github.io/pixel-daylight-switch/preview.html) |
| **Embed it on my own website** | [Embed instructions and loader](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/embed.js) |
| **Install it in a JavaScript project** | [npm package](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable) · `npm install pixel-daylight-switch-gsvegetable` |
| **Read the source code** | [Core renderer](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/app.js) · [Styles](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/style.css) |
| **Download a mobile build** | [Mobile build notes and artifacts](builds/README.md) |
| **See what changed** | [Changelog](CHANGELOG.md) |
| **Check automated test results** | [Quality checks](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml) |
| **Get Android / iOS build status** | [Native mobile builds](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/mobile-build.yml) |
| **Report a bug or request a feature** | [Open an issue](https://github.com/GSvegetable/pixel-daylight-switch/issues/new/choose) |
| **Review license and reuse terms** | [Unlicense](LICENSE) |

**Quick choices:** [Try it now](https://gsvegetable.github.io/pixel-daylight-switch/) · [Customize it](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) · [Install with npm](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)

### License

Pixel Daylight Switch is released under **[The Unlicense](https://unlicense.org/)**. You may copy, modify, publish, distribute, and use it for personal or commercial purposes without attribution. The software is provided without warranty; see [LICENSE](LICENSE).

---

<a id="简体中文"></a>
## 简体中文

一个装在折射玻璃开关里的微缩像素世界。

**Pixel Daylight Switch（像素昼夜开关）** 是一个可拖动的昼夜切换 UI 组件。拖动玻璃开关，即可让内部的像素世界从白天经过黄昏切换到夜晚。项目使用原生 JavaScript、WebGL2 和 Canvas 2D 回退渲染，不依赖第三方运行时库。

**[打开在线参数实验室](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** · **[查看源代码](https://github.com/GSvegetable/pixel-daylight-switch)** · **[查看更新日志](CHANGELOG.md)**

### 核心特点

- **动态像素世界：** 五种场景——乡村、日本街道、现代公寓、海边灯塔和山间木屋。
- **折射玻璃效果：** 使用 WebGL2 渲染玻璃镜片；WebGL2 无法初始化时回退到 Canvas 2D。
- **连续昼夜变化：** 支持拖动、触控、点击和键盘操作。
- **丰富的自定义参数：** 可配置运动、惯性、回弹、折射、玻璃细节、世界速度、天气和场景。
- **多实例：** 同一页面可以挂载多个互相独立的开关。
- **无障碍支持：** 提供开关语义、状态播报、键盘操作，并尊重系统的 `prefers-reduced-motion` 设置。
- **生命周期管理：** 提供 `mount()` 和 `unmount()`，适合动态页面和前端应用。
- **轻量接入：** 独立浏览器脚本没有第三方运行时依赖。

### 在线参数实验室

进入**[交互式参数实验室](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)**，可以切换场景、调整运动与玻璃效果、设置天气和世界速度，实时预览并复制生成的 HTML。

### 快速开始：无需构建

在页面中放置挂载节点，并引入脚本：

```html
<div data-ld-part="toggle-daylight"></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js">
</script>
```

脚本会自动查找带有 `data-ld-part="toggle-daylight"` 的元素，并生成组件结构与渲染画布。请在页面布局中为挂载节点设置宽度；组件会根据容器尺寸缩放。

### 通过 npm 安装

```bash
npm install pixel-daylight-switch-gsvegetable
```

**ES Modules**

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');

PixelDaylightSwitch.mount(root);

// 从 DOM 移除 root 之前调用：
PixelDaylightSwitch.unmount(root);
```

**CommonJS**

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

npm 包同时提供 ESM 和 CommonJS 入口，可在 SSR 环境中安全导入。只有在浏览器环境、目标元素已经存在时，才能调用 `mount()`。直接引入浏览器脚本时，组件会自动挂载。

### 配置参数

所有参数均为可选项，写在组件根元素上。省略参数或参数值无效时，将使用默认值。

| HTML 属性 | 默认值 | 说明 |
| --- | ---: | --- |
| `data-speed` | `9.5` | 开关运动的基础响应速度，必须大于零。 |
| `data-refraction` | `1.24` | 玻璃镜片折射强度，必须大于零。 |
| `data-bezel` | `0.046` | 玻璃边缘的相对厚度，必须大于零。 |
| `data-start-night` | `false` | 精确设置为字符串 `"true"` 时，从夜晚状态开始。 |
| `data-friction` | `0.6` | 松手后的惯性阻尼，限制在 `0.1–0.9`。 |
| `data-bounce` | `3.2` | 边缘回弹力度，限制在 `0–12`。 |
| `data-dispersion` | `0.05` | 玻璃边缘 RGB 色散强度，限制在 `0–0.25`。 |
| `data-shine` | `0.44` | 白天玻璃高光强度，限制在 `0–1.5`。 |
| `data-time-speed` | `1` | 像素世界时间倍率，限制在 `0–8`；设为 `0` 可冻结世界动态。 |
| `data-weather` | `default` | 支持 `default` 或 `snow`；未知值回退为 `default`。 |
| `data-scene` | `countryside` | 支持 `countryside`、`japanese-street`、`apartment`、`seaside`、`mountain-cabin`。 |

**示例：从夜晚开始，使用海边场景**

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

### 事件与状态

组件会在根元素上更新 CSS 自定义属性 `--night`：

- `0`：白天
- `1`：夜晚
- `0` 到 `1` 之间：昼夜过渡过程

当已确认的昼夜状态发生变化时，根元素会派发可冒泡、可跨越 Shadow DOM 边界的 `daylight:change` 事件。事件中的 `event.detail.night` 是布尔值。

```js
const root = document.querySelector('[data-ld-part="toggle-daylight"]');

root.addEventListener('daylight:change', (event) => {
  console.log(event.detail.night ? '夜晚' : '白天');
});
```

该事件只在昼夜状态发生变化时触发，不会在每一帧动画中重复派发。

### 渲染与性能

- 使用 WebGL2 实现玻璃折射渲染。
- WebGL2 不可用或初始化失败时，使用 Canvas 2D 回退。
- 页面隐藏或组件离开视口时，暂停不必要的绘制。
- 根据容器尺寸调整组件渲染区域。
- 尊重系统的 `prefers-reduced-motion` 设置。

组件无需依赖前端框架。实际渲染性能取决于浏览器、图形硬件、设备像素比以及同时显示的实例数量。

### 开发与测试

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

基础测试覆盖模块入口、SSR 导入行为和移动端准备检查。

运行 Chromium 浏览器回归测试：

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

GitHub Actions 会在 Node.js 18、20、22 环境中运行包与 SSR 检查，并执行 Chromium 交互和移动端回归测试。最新结果请查看 **[GitHub Actions](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml)**。

### Android / iOS

仓库包含基于 Capacitor 8 的 Android 和 iOS 构建路径。原生端复用 Web 渲染器，不维护另一套独立的图形实现。

构建成功不等于所有实体设备均已通过兼容性验证。Android 真机验证仍在进行；项目包含 iOS 模拟器构建支持，但不提供已签名的 App Store IPA。

### 项目入口｜按用途直达

把常用入口放在这里，不需要进入仓库后再一层层寻找。

| 你想做什么 | 直接打开 |
| --- | --- |
| **直接体验昼夜开关** | [在线演示](https://gsvegetable.github.io/pixel-daylight-switch/) |
| **调整场景、玻璃和运动参数** | [参数实验室 Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) |
| **查看组件预览页** | [Preview 页面](https://gsvegetable.github.io/pixel-daylight-switch/preview.html) |
| **嵌入到自己的网站** | [嵌入脚本 embed.js](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/embed.js) |
| **在项目中安装使用** | [npm 包页面](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable) · `npm install pixel-daylight-switch-gsvegetable` |
| **阅读核心实现** | [核心渲染器 app.js](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/app.js) · [样式 style.css](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/style.css) |
| **获取 Android / iOS 构建产物** | [移动端构建说明与产物](builds/README.md) |
| **查看版本更新记录** | [CHANGELOG](CHANGELOG.md) |
| **查看自动化测试是否通过** | [Quality checks](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml) |
| **查看 Android / iOS 构建状态** | [Native mobile builds](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/mobile-build.yml) |
| **反馈 Bug 或提出新功能** | [创建 Issue](https://github.com/GSvegetable/pixel-daylight-switch/issues/new/choose) |
| **了解授权和使用范围** | [Unlicense 许可证](LICENSE) |

**最常用的三个入口：** [立即体验](https://gsvegetable.github.io/pixel-daylight-switch/) · [开始调参](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) · [npm 安装](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)

### 项目结构｜Repository map

下面是仓库当前的主要目录与文件。按功能分组，方便开发者直接定位，不把依赖、构建缓存等非源码内容混进来。

```text
pixel-daylight-switch/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Node / SSR / Chromium 自动化测试
│       ├── mobile-build.yml       # Android 与 iOS 构建流程
│       └── npm-publish.yml        # 发布到 npm 的工作流
│
├── assets/
│   └── scene-gallery.png          # 五种像素场景展示图
│
├── builds/
│   └── README.md                  # 移动端构建产物说明
│
├── mobile/
│   ├── index.html                 # Capacitor 移动端入口
│   └── mobile.css                 # 移动端专用样式
│
├── scripts/
│   └── prepare-mobile.cjs         # 移动端资源准备脚本
│
├── tests/
│   ├── browser/
│   │   └── component.spec.cjs     # 浏览器交互与移动端回归测试
│   ├── fixture.html               # 浏览器测试页面
│   ├── mobile-smoke.cjs           # 移动端准备检查
│   ├── package-smoke.cjs          # npm / SSR 入口检查
│   └── server.cjs                 # 本地测试服务器
│
├── app.js                         # 核心组件、像素世界与渲染逻辑
├── style.css                      # 组件基础样式
├── embed.js                       # 独立网站嵌入加载器
├── index.mjs                      # ESM 包入口
├── index.cjs                      # CommonJS 包入口
├── index.html                     # 项目主页 / 在线入口
├── preview.html                   # 组件预览页面
├── playground.html                # 可交互参数实验室
├── playwright.config.cjs          # Playwright 浏览器测试配置
├── capacitor.config.json          # Capacitor 配置
├── package.json                   # npm 元数据、导出与脚本
├── CHANGELOG.md                   # 版本变更记录
├── llms.txt                       # 面向 AI 工具的项目说明
├── LICENSE                        # Unlicense
└── README.md                      # 项目文档
```

**从哪里开始阅读代码？**

- 想理解组件如何工作：从 `app.js` 开始。
- 想调整视觉外观：查看 `style.css` 和 `playground.html`。
- 想研究 npm 接入：查看 `index.mjs`、`index.cjs` 和 `package.json`。
- 想把组件嵌入普通网页：查看 `embed.js`。
- 想修改移动端：查看 `mobile/`、`scripts/` 和 `capacitor.config.json`。
- 想验证改动有没有破坏功能：查看 `tests/` 和 `.github/workflows/ci.yml`。

### 许可证

项目采用 **[Unlicense](https://unlicense.org/)** 公有领域协议。你可以自由复制、修改、发布、分发，并用于个人或商业项目，无需署名。软件按现状提供，不附带任何担保。详情请阅读 [LICENSE](LICENSE)。

---

<a id="日本語"></a>
## 日本語

屈折するガラススイッチの中に、小さなピクセルワールドを。

**Pixel Daylight Switch** は、ドラッグ操作で昼・夕暮れ・夜を切り替えられる UI コンポーネントです。ガラスレンズの中のピクセルアートの世界が、スイッチの動きに合わせて変化します。Vanilla JavaScript、WebGL2、Canvas 2D フォールバックで構成され、実行時にサードパーティ製ライブラリを必要としません。

**[オンライン Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** · **[ソースコード](https://github.com/GSvegetable/pixel-daylight-switch)** · **[変更履歴](CHANGELOG.md)**

### 主な特徴

- **動くピクセルワールド：** 田園風景、日本の街並み、モダンなアパート、海辺の灯台、山小屋の 5 シーン。
- **屈折するガラス：** WebGL2 でレンズ効果を描画し、利用できない場合は Canvas 2D にフォールバック。
- **連続した昼夜の変化：** ドラッグ、タップ、クリック、キーボードで操作可能。
- **柔軟なカスタマイズ：** 動き、慣性、バウンス、屈折、ガラス表現、ワールド速度、天候、シーンを HTML 属性で設定。
- **複数インスタンス：** 1 ページに独立したスイッチを複数配置可能。
- **アクセシビリティ：** switch セマンティクス、状態通知、キーボード操作、`prefers-reduced-motion` に対応。
- **ライフサイクル API：** 動的なアプリケーション向けに `mount()` と `unmount()` を提供。
- **軽量な導入：** 単体ブラウザースクリプトに実行時依存関係はありません。

### Playground

**[インタラクティブ Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** でシーンや各種パラメーターを変更し、プレビューを確認して HTML コードをコピーできます。

### クイックスタート：ビルド不要

HTML にマウント要素を配置し、ブラウザースクリプトを読み込みます。

```html
<div data-ld-part="toggle-daylight"></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js">
</script>
```

スクリプトは `data-ld-part="toggle-daylight"` を持つ要素を自動検出し、コンポーネントの DOM と描画領域を生成します。レイアウト側でマウント要素の幅を指定してください。コンポーネントはコンテナに合わせて拡大・縮小します。

### npm からインストール

```bash
npm install pixel-daylight-switch-gsvegetable
```

**ES Modules**

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');

PixelDaylightSwitch.mount(root);

// DOM から root を削除する前に呼び出します。
PixelDaylightSwitch.unmount(root);
```

**CommonJS**

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

ESM と CommonJS の両方を提供し、SSR 環境でも安全にインポートできます。`mount()` はブラウザー上で対象要素が存在してから呼び出してください。ブラウザースクリプトを直接読み込む場合は自動マウントされます。

### 設定属性

すべて任意の設定で、コンポーネントのルート要素に指定します。省略時または無効な値の場合はデフォルト値が使われます。

| HTML 属性 | デフォルト | 説明 |
| --- | ---: | --- |
| `data-speed` | `9.5` | スイッチの基本応答速度。0 より大きい値。 |
| `data-refraction` | `1.24` | ガラスレンズの屈折強度。0 より大きい値。 |
| `data-bezel` | `0.046` | ガラスの縁の相対的な厚さ。0 より大きい値。 |
| `data-start-night` | `false` | 文字列 `"true"` の場合、夜の状態から開始。 |
| `data-friction` | `0.6` | リリース後の慣性減衰。範囲は `0.1–0.9`。 |
| `data-bounce` | `3.2` | 端での跳ね返り。範囲は `0–12`。 |
| `data-dispersion` | `0.05` | ガラス端の RGB 色分散。範囲は `0–0.25`。 |
| `data-shine` | `0.44` | 昼間のガラスハイライト強度。範囲は `0–1.5`。 |
| `data-time-speed` | `1` | ピクセルワールドの時間倍率。範囲は `0–8`、`0` で停止。 |
| `data-weather` | `default` | `default` または `snow`。不明な値は `default` に戻ります。 |
| `data-scene` | `countryside` | `countryside`、`japanese-street`、`apartment`、`seaside`、`mountain-cabin`。 |

**例：夜から開始し、海辺のシーンを使用**

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

### イベントと状態

ルート要素の CSS カスタムプロパティ `--night` が更新されます。

- `0`：昼
- `1`：夜
- `0` と `1` の間：遷移中

確定した昼夜状態が変化すると、ルート要素からバブリングし、Shadow DOM の境界を越える `daylight:change` イベントが発生します。`event.detail.night` は boolean 値です。

```js
const root = document.querySelector('[data-ld-part="toggle-daylight"]');

root.addEventListener('daylight:change', (event) => {
  console.log(event.detail.night ? 'Night' : 'Day');
});
```

このイベントは昼夜状態が変わったときに発生し、アニメーションの各フレームでは発生しません。

### 描画とパフォーマンス

- ガラスの屈折描画には WebGL2 を使用します。
- WebGL2 が利用できない、または初期化に失敗した場合は Canvas 2D に切り替えます。
- ドキュメントが非表示、またはコンポーネントが画面外にある場合、不要な描画を一時停止します。
- コンテナサイズに合わせて描画領域を調整します。
- OS の `prefers-reduced-motion` 設定を尊重します。

フレームワークは不要です。実際の描画性能はブラウザー、GPU、デバイスピクセル比、画面内のインスタンス数によって異なります。

### 開発とテスト

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

基本テストではモジュールエントリー、SSR インポート、モバイル準備チェックを検証します。

Chromium ブラウザー回帰テスト：

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

GitHub Actions は Node.js 18、20、22 でパッケージと SSR のチェックを実行し、Chromium の操作・モバイル回帰テストも実行します。最新の結果は **[GitHub Actions](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml)** を確認してください。

### Android / iOS

リポジトリには Capacitor 8 による Android / iOS のビルド手順が含まれています。ネイティブ版も Web と同じレンダラーを使用し、別の描画実装は持ちません。

ビルド成功は、すべての実機での互換性確認を意味しません。Android 実機での検証は継続中です。iOS シミュレーター向けビルドには対応していますが、署名済み App Store IPA は提供していません。

### プロジェクトへの入口

目的に合わせて、必要なページへ直接アクセスできます。

| 目的 | リンク |
| --- | --- |
| **スイッチを体験する** | [オンラインデモ](https://gsvegetable.github.io/pixel-daylight-switch/) |
| **パラメーターを調整する** | [Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) |
| **コンポーネントのプレビューを見る** | [Preview](https://gsvegetable.github.io/pixel-daylight-switch/preview.html) |
| **自分のサイトに埋め込む** | [embed.js](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/embed.js) |
| **npm からインストールする** | [npm パッケージ](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable) · `npm install pixel-daylight-switch-gsvegetable` |
| **コア実装を読む** | [app.js](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/app.js) · [style.css](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/style.css) |
| **モバイルビルドを確認する** | [ビルド情報](builds/README.md) |
| **変更履歴を見る** | [CHANGELOG](CHANGELOG.md) |
| **自動テストの結果を見る** | [Quality checks](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml) |
| **Android / iOS のビルド状況を見る** | [Native mobile builds](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/mobile-build.yml) |
| **不具合報告・機能提案をする** | [Issue を作成](https://github.com/GSvegetable/pixel-daylight-switch/issues/new/choose) |
| **ライセンスを確認する** | [Unlicense](LICENSE) |

**よく使う入口：** [デモ](https://gsvegetable.github.io/pixel-daylight-switch/) · [パラメーター調整](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) · [npm](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)

### ライセンス

本プロジェクトは **[Unlicense](https://unlicense.org/)** に基づき公開されています。個人利用・商用利用を問わず、帰属表示なしで自由にコピー、変更、公開、配布、利用できます。無保証で提供されます。詳細は [LICENSE](LICENSE) を参照してください。
