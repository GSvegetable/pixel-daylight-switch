# Pixel Daylight Switch

<p align="center">
  <strong>A tiny pixel world inside a draggable glass day/night switch.</strong>
</p>

<p align="center">
  <a href="https://gsvegetable.github.io/pixel-daylight-switch/">Live Demo</a> ·
  <a href="https://gsvegetable.github.io/pixel-daylight-switch/playground.html">Interactive Playground</a> ·
  <a href="https://github.com/GSvegetable/pixel-daylight-switch/releases">Releases</a> ·
  <a href="https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable">NPM</a>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7f248a5-c39c-432c-92f6-73237abdfe6b" width="49%" alt="Pixel Daylight Switch in daytime" />
  <img src="https://github.com/user-attachments/assets/b2e24e65-a378-4ac6-be7b-efd3070e4da8" width="49%" alt="Pixel Daylight Switch at night" />
</p>

<p align="center">
  <em>Drag the glass control. Watch a small world move from day to dusk to night.</em>
</p>

**中文文档在前。** [English documentation](#english)

---

## 目录

- [项目简介](#项目简介)
- [快速开始](#快速开始)
- [NPM 安装](#npm-安装)
- [框架集成](#框架集成)
- [参数实验室 Playground](#参数实验室-playground)
- [配置参数](#配置参数)
- [交互与事件](#交互与事件)
- [自定义主题](#自定义主题)
- [动态挂载与卸载](#动态挂载与卸载)
- [渲染与兼容性](#渲染与兼容性)
- [本地开发与测试](#本地开发与测试)
- [版本记录](#版本记录)
- [许可证](#许可证)

## 项目简介

**Pixel Daylight Switch** 是一个可拖动的昼夜切换组件。它把一个持续变化的像素世界放进玻璃开关中：拖动滑块，场景会经过白天、黄昏并进入夜晚；点击或使用键盘也可以切换昼夜。

### 特性

- **像素世界**：场景中有持续活动的像素角色与环境细节。
- **玻璃质感**：使用 WebGL2 绘制折射玻璃效果。
- **五种场景**：乡村小屋、日本街道、现代公寓、海边灯塔、山间木屋。
- **昼夜过渡**：不是简单的二态换色，而是连续的昼夜变化。
- **可配置**：通过 HTML `data-*` 属性配置运动、玻璃、天气和场景。
- **多实例**：同一页面可以放置多个独立开关。
- **轻量接入**：原生脚本无需构建工具或运行时依赖。
- **无障碍支持**：提供 switch 语义、键盘操作，并尊重减少动态效果偏好。

## 快速开始

不使用 NPM，也不需要安装依赖。把容器和脚本放进 HTML：

```html
<div data-ld-part="toggle-daylight"></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"
></script>
```

脚本会自动为每个匹配的容器创建 Canvas、交互按钮和状态播报元素。容器宽度会自适应父级，组件保持约 **1.6439:1** 的宽高比。

如果需要自行托管，可以下载仓库中的 `app.js`，将脚本地址替换为自己的静态资源地址。

## NPM 安装

```bash
npm install pixel-daylight-switch-gsvegetable
```

### 原生 JavaScript / ESM

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector(
  '[data-ld-part="toggle-daylight"]'
);

// 页面加载后动态创建的元素需要手动挂载
const destroy = PixelDaylightSwitch.mount(root);

// 不再使用时，在移除元素前卸载
PixelDaylightSwitch.unmount(root);
```

也可以使用命名导入：

```js
import { mount, unmount } from 'pixel-daylight-switch-gsvegetable';

mount(root);
unmount(root);
```

### CommonJS

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');

PixelDaylightSwitch.mount(root);
```

包同时提供 ESM 和 CommonJS 入口。模块可以在 SSR 环境中导入；DOM 挂载只会在浏览器中执行。对于服务端渲染项目，请在客户端生命周期中调用 `mount()`。

## 框架集成

### React

```jsx
import { useEffect, useRef } from 'react';
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

export function DaylightSwitch() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    PixelDaylightSwitch.mount(root);
    return () => PixelDaylightSwitch.unmount(root);
  }, []);

  return <div ref={rootRef} data-ld-part="toggle-daylight" />;
}
```

### Vue 3

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = ref(null);

onMounted(() => {
  PixelDaylightSwitch.mount(root.value);
});

onBeforeUnmount(() => {
  PixelDaylightSwitch.unmount(root.value);
});
</script>

<template>
  <div ref="root" data-ld-part="toggle-daylight"></div>
</template>
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

  let root;

  onMount(() => {
    PixelDaylightSwitch.mount(root);
    return () => PixelDaylightSwitch.unmount(root);
  });
</script>

<div bind:this={root} data-ld-part="toggle-daylight"></div>
```

> **生命周期原则：** 对于框架或路由动态创建的容器，在元素进入 DOM 后调用 `mount(element)`；在元素被移除前调用 `unmount(element)`。不要在同一个容器上重复创建自己的实例。

## 参数实验室 Playground

打开 [Pixel Daylight Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)，可以在浏览器中试验组件配置。

- 拖动预览区中的开关，直接体验交互。
- 按运动反馈、玻璃光学、世界节奏和场景环境调整参数。
- 在五种像素场景之间切换。
- 选择天气、初始昼夜状态与世界时间倍率。
- 先调整参数，再点击「应用参数」更新预览。
- 复制生成的 HTML 配置，放入自己的项目。

Playground 是独立页面。它用于探索配置，不是组件运行时的依赖。

## 配置参数

所有配置都写在组件根元素的 HTML `data-*` 属性上。每个实例可以使用不同参数；未填写的参数使用默认值。

### 完整参数表

| HTML 属性 | 默认值 | 说明 |
| --- | ---: | --- |
| `data-speed` | `9.5` | 开关运动的基础响应速度，必须为正数。 |
| `data-refraction` | `1.24` | 玻璃镜片折射强度，必须为正数。 |
| `data-bezel` | `0.046` | 玻璃边缘厚度系数，必须为正数。 |
| `data-start-night` | `false` | 精确设置为 `true` 时，从夜晚状态开始。 |
| `data-friction` | `0.6` | 松手后的惯性阻尼，范围 `0.1–0.9`；值越低，滑动越持久。 |
| `data-bounce` | `3.2` | 边缘回弹力度，范围 `0–12`。 |
| `data-dispersion` | `0.05` | 玻璃边缘 RGB 色散强度，范围 `0–0.25`；`0` 关闭色散。 |
| `data-shine` | `0.44` | 白天玻璃表面高光强度，范围 `0–1.5`。 |
| `data-time-speed` | `1` | 像素世界时间倍率，范围 `0–8`；`0` 冻结世界动态，`2` 为两倍速度。 |
| `data-weather` | `default` | 天气预设：`default` 或 `snow`。 |
| `data-scene` | `countryside` | 场景：`countryside`、`japanese-street`、`apartment`、`seaside`、`mountain-cabin`。 |

### 场景选项

| 值 | 场景 |
| --- | --- |
| `countryside` | 乡村小屋（默认） |
| `japanese-street` | 日本街道 |
| `apartment` | 现代公寓 |
| `seaside` | 海边灯塔 |
| `mountain-cabin` | 山间木屋 |

### 完整配置示例

```html
<div
  data-ld-part="toggle-daylight"
  data-label="昼夜环境切换"
  data-speed="12"
  data-refraction="1.5"
  data-bezel="0.05"
  data-start-night="true"
  data-friction="0.45"
  data-bounce="4.2"
  data-dispersion="0.12"
  data-shine="0.6"
  data-time-speed="1.5"
  data-weather="snow"
  data-scene="mountain-cabin"
></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"
></script>
```

### 参数校验规则

- 数值参数为空、不是有限数字或不符合正数要求时，会回退到默认值。
- `friction`、`bounce`、`dispersion`、`shine` 和 `time-speed` 会限制在表格所示范围内。
- 未知的 `weather` 值回退为 `default`。
- 未知的 `scene` 值回退为 `countryside`。
- `data-start-night` 只有值为字符串 `true` 时才启用。

## 交互与事件

### 用户交互

- **拖动**：连续控制昼夜进度。
- **点击**：在白天和夜晚之间切换。
- **键盘**：聚焦开关后可使用方向键操作。
- **无障碍**：交互按钮使用 `role="switch"` 与 `aria-checked`；状态变化通过 live region 播报。
- **减少动态效果**：尊重系统的 `prefers-reduced-motion` 设置。

### 读取昼夜进度

组件会在根元素上更新 CSS 自定义属性 `--night`：

- `0`：白天。
- `1`：夜晚。
- `0` 到 `1` 之间：昼夜过渡。

可以用它联动页面其他部分：

```css
body {
  background: color-mix(
    in srgb,
    #f5ecd9,
    #1b2146 calc(var(--night, 0) * 100%)
  );
}
```

### 监听状态事件

组件在昼夜状态发生变化时，会在组件根元素上派发可冒泡的 `daylight:change` 事件。事件的 `detail.night` 是布尔值。

```js
document.addEventListener('daylight:change', (event) => {
  document.documentElement.classList.toggle(
    'dark',
    event.detail.night
  );
});
```

如果页面有多个实例，建议在单个根元素上监听，以区分具体是哪一个开关触发了事件：

```js
root.addEventListener('daylight:change', (event) => {
  console.log('当前是否为夜晚：', event.detail.night);
});
```

## 自定义主题

在组件根元素上覆盖以下 CSS 自定义属性：

```css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;
  --ld-surface: #8c9a62;
  --ld-fg: #1b2146;
  --ld-muted: #7f97b3;
  --ld-accent: #efa02c;
  --ld-radius: 9999px;
  --ld-font: system-ui, sans-serif;
}
```

| CSS 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--ld-bg` | `#f5ecd9` | 背景调色输入 |
| `--ld-surface` | `#8c9a62` | 表面与场景调色输入 |
| `--ld-fg` | `#1b2146` | 前景颜色 |
| `--ld-muted` | `#7f97b3` | 次要颜色 |
| `--ld-accent` | `#efa02c` | 强调色与焦点颜色 |
| `--ld-radius` | `9999px` | 交互区域圆角 |
| `--ld-font` | `system-ui, sans-serif` | 组件字体 |
| `--ld-space` | `8px` | 焦点轮廓偏移相关尺寸 |
| `--ld-shadow` | `0 8px 24px rgb(27 33 70 / .2)` | 主题预留变量 |
| `--ld-motion` | `200ms` | 焦点轮廓过渡时长 |

## 动态挂载与卸载

页面加载时，脚本会自动查找已有的 `[data-ld-part="toggle-daylight"]` 元素并挂载。对于之后动态创建的元素，调用公开 API：

```js
const root = document.createElement('div');
root.dataset.ldPart = 'toggle-daylight';
document.querySelector('#app').appendChild(root);

const destroy = PixelDaylightSwitch.mount(root);

// 需要移除时：
PixelDaylightSwitch.unmount(root);
root.remove();
```

`mount(element)` 对同一元素是幂等的：重复调用不会创建重复实例。成功挂载时会返回清理函数；如果挂载失败则返回 `null`。通常使用 `unmount(element)` 即可完成清理。

卸载会停止绘制并释放组件持有的事件监听器和观察器。它不会移除根元素本身。

## 渲染与兼容性

- **WebGL2**：用于绘制玻璃折射效果。
- **Canvas 2D**：WebGL2 不可用时作为渲染回退。
- **响应式布局**：组件保持固定宽高比，并随容器宽度缩放。
- **页面可见性**：页面隐藏或组件离开视口时，会暂停不必要的绘制。
- **减少动态效果**：支持系统减少动态效果偏好。
- **运行时依赖**：原生脚本不需要第三方运行时依赖。

组件需要现代浏览器提供 Canvas 2D；WebGL2 用于增强玻璃渲染体验。

## 本地开发与测试

克隆项目：

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
```

直接用浏览器打开 `index.html` 即可查看基础演示。项目无需打包构建。

### 自动化测试

运行包入口、CommonJS / ESM 和 SSR 安全检查：

```bash
npm test
```

浏览器回归测试使用 Playwright。安装测试运行器和 Chromium 后执行：

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

CI 会在 Node.js 18、20、22 下执行包与 SSR 检查，并在 Chromium 中运行交互、重复挂载/卸载、多实例、事件监听器清理和移动端回归测试。

## 版本记录

### v1.3.1

- 修复组件卸载时主动销毁 WebGL context，导致同一 canvas/root 后续重新挂载可能异常的问题。
- 保留组件资源、事件监听器与观察器的清理，同时允许 canvas 在卸载后重新挂载。
- 增加 CommonJS、ESM、SSR、Node.js 18/20/22 和 Chromium 浏览器自动化检查。
- 增加重复挂载、多实例、指针交互、触控、移动端布局与监听器清理测试。
- 将浏览器回归纳入 NPM 发布前置检查。

### v1.3.0

- 新增日本街道、现代公寓、海边灯塔和山间木屋四种像素环境。
- 保留乡村小屋作为默认场景。
- Playground 支持切换场景并组合调整天气、昼夜和玻璃参数。

### v1.2.0

- 新增惯性阻尼、边缘回弹、玻璃色散和表面高光参数。
- 新增世界时间倍率与飘雪天气。
- 新增独立 Playground，支持参数分组、场景预设和 HTML 代码复制。

### v1.1.0

- 新增运动速度、镜片折射、外框厚度和初始夜晚状态配置。

### v1.0.0

- 首个公开版本。

详细记录见 [CHANGELOG.md](./CHANGELOG.md)。

## 许可证

本项目使用 [Unlicense](https://unlicense.org/) 公有领域协议。允许个人和商业用途，无需署名。

---

<a id="english"></a>

## English

**Pixel Daylight Switch** is a draggable day/night UI component with a tiny animated pixel world inside a refractive glass lens. Drag the control to move through daylight, dusk, and night.

### Features

- An animated pixel environment inside a glass switch.
- WebGL2 refraction rendering with a Canvas 2D fallback.
- Five scenes: countryside, Japanese street, modern apartment, seaside lighthouse, and mountain cabin.
- Continuous day/night transitions, pointer dragging, click, and keyboard interaction.
- Per-instance HTML data attributes for motion, optics, weather, and scene settings.
- Multiple independent instances on the same page.
- No runtime dependencies for the standalone script.
- Accessible switch semantics and reduced-motion support.

### Quick start

No package manager or build step is required:

```html
<div data-ld-part="toggle-daylight"></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"
></script>
```

The script automatically mounts matching elements. It creates the internal canvas, interaction button, and live status region. The component scales with its container and keeps an aspect ratio of approximately **1.6439:1**.

### NPM

```bash
npm install pixel-daylight-switch-gsvegetable
```

ESM:

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');
PixelDaylightSwitch.mount(root);

// Before removing the element:
PixelDaylightSwitch.unmount(root);
```

CommonJS:

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

The package provides ESM and CommonJS entry points and is safe to import in SSR environments. Call `mount()` only after the element exists in the browser.

### Framework integration

For React, Vue 3, and Svelte, mount the component in the client-side lifecycle and call `unmount(element)` during cleanup. See the complete examples in the [Chinese documentation above](#框架集成).

### Playground

Use the [Interactive Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) to adjust motion, glass optics, world speed, weather, and scenes. Apply settings to the preview and copy the generated HTML.

### Configuration

All settings are optional and belong on the component root.

| Attribute | Default | Description |
| --- | ---: | --- |
| `data-speed` | `9.5` | Base motion response speed; positive number. |
| `data-refraction` | `1.24` | Glass lens refraction strength; positive number. |
| `data-bezel` | `0.046` | Glass edge thickness ratio; positive number. |
| `data-start-night` | `false` | Start at night when exactly `true`. |
| `data-friction` | `0.6` | Release inertia damping, clamped to `0.1–0.9`. |
| `data-bounce` | `3.2` | Edge rebound, clamped to `0–12`. |
| `data-dispersion` | `0.05` | RGB edge dispersion, clamped to `0–0.25`. |
| `data-shine` | `0.44` | Daytime highlight intensity, clamped to `0–1.5`. |
| `data-time-speed` | `1` | World simulation speed, clamped to `0–8`; zero freezes world dynamics. |
| `data-weather` | `default` | `default` or `snow`. Unknown values use `default`. |
| `data-scene` | `countryside` | `countryside`, `japanese-street`, `apartment`, `seaside`, or `mountain-cabin`. |

Example:

```html
<div
  data-ld-part="toggle-daylight"
  data-label="Day and night switch"
  data-speed="12"
  data-refraction="1.5"
  data-bezel="0.05"
  data-start-night="true"
  data-friction="0.45"
  data-bounce="4.2"
  data-dispersion="0.12"
  data-shine="0.6"
  data-time-speed="1.5"
  data-weather="snow"
  data-scene="mountain-cabin"
></div>
```

Invalid numeric values fall back to defaults. Range-limited values are clamped. Unknown weather and scene values fall back to `default` and `countryside`, respectively.

### Events and page theme

The component updates `--night` on its root element: `0` means day, `1` means night, and values in between represent the transition.

It also dispatches a bubbling, composed `daylight:change` event from the component root when the day/night state changes. `event.detail.night` is a boolean:

```js
root.addEventListener('daylight:change', (event) => {
  document.documentElement.classList.toggle('dark', event.detail.night);
});
```

### Theme customization

Override these CSS variables on the component root:

```css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;
  --ld-surface: #8c9a62;
  --ld-fg: #1b2146;
  --ld-muted: #7f97b3;
  --ld-accent: #efa02c;
  --ld-radius: 9999px;
  --ld-font: system-ui, sans-serif;
}
```

Supported variables: `--ld-bg`, `--ld-surface`, `--ld-fg`, `--ld-muted`, `--ld-accent`, `--ld-radius`, `--ld-font`, `--ld-space`, `--ld-shadow`, and `--ld-motion`.

### Mounting and cleanup

Elements present when the script loads are mounted automatically. For elements created later:

```js
const destroy = PixelDaylightSwitch.mount(element);

// Before removing the root:
PixelDaylightSwitch.unmount(element);
element.remove();
```

Mounting the same element more than once is safe and does not create duplicate instances. A successful `mount()` returns a cleanup function; a failed mount returns `null`. `unmount()` stops rendering and removes the component's listeners and observers without removing the root element.

### Rendering and browser behavior

- WebGL2 is used for the refractive glass effect.
- Canvas 2D is the rendering fallback when WebGL2 is unavailable.
- The component respects `prefers-reduced-motion`.
- Unnecessary drawing pauses when the page is hidden or the component is offscreen.
- The standalone runtime has no third-party dependencies.

### Development and tests

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
```

Open `index.html` in a modern browser. No build step is required.

Run package and SSR checks:

```bash
npm test
```

Run browser regression tests after installing Playwright and Chromium:

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

### Version history

- **v1.3.1** — lifecycle/remount stability fix and expanded automated regression coverage.
- **v1.3.0** — four additional pixel environments and scene selection in Playground.
- **v1.2.0** — motion, optics, world-speed, weather settings, and the standalone Playground.
- **v1.1.0** — initial HTML configuration options.
- **v1.0.0** — first public release.

See [CHANGELOG.md](./CHANGELOG.md) for details.

### License

[Unlicense](https://unlicense.org/) — public-domain dedication. Free for personal and commercial use without attribution.
