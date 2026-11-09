# Pixel Daylight Switch

一个带有像素居民的昼夜开关组件。拖动开关，像素世界会从白天逐渐进入夜晚；再拖回来，日光重新出现。

A day/night switch with a tiny pixel resident. Drag the switch to move the scene from day to night, then bring the daylight back.

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7f248a5-c39c-432c-92f6-73237abdfe6b" width="49%" alt="Day mode preview" />
  <img src="https://github.com/user-attachments/assets/b2e24e65-a378-4ac6-be7b-efd3070e4da8" width="49%" alt="Night mode preview" />
</p>

<p align="center">
  <a href="https://gsvegetable.github.io/pixel-daylight-switch/">Live Demo</a>
  ·
  <a href="https://github.com/GSvegetable/pixel-daylight-switch/releases">Releases</a>
</p>

## Features

- **Zero dependencies** — one JavaScript file, no npm install or build step.
- **Interactive day/night transition** — drag, fling, click, or use the keyboard.
- **Pixel-art world** — a small resident follows a daily routine as the light changes.
- **Live page theme value** — exposes the current night level through the `--night` CSS custom property.
- **Customizable per instance** — configure animation speed, lens refraction, bezel size, and initial night state with HTML data attributes.
- **Themeable colors** — override CSS custom properties.
- **Accessible** — keyboard-operable switch semantics and reduced-motion support.
- **Adaptive rendering** — WebGL2 glass rendering with a Canvas 2D fallback; pauses when offscreen or when the page is in the background.

## Quick start

Add the component wherever you want it to appear, then load the script:

```html
<div data-ld-part="toggle-daylight"></div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

That's it. The script generates the component's internal markup and styles automatically. Its width follows its container, and its height keeps the component's aspect ratio. Add multiple matching elements to create multiple independent switches.

You can also download `app.js` and host it yourself.

## Configure with HTML attributes

Each component instance can override its core settings directly in HTML. All attributes are optional; omitted or invalid values fall back to the defaults.

| Attribute | Default | Description |
| --- | ---: | --- |
| `data-speed` | `9.5` | Animation speed used by the switch's motion/tick calculation. |
| `data-refraction` | `1.24` | Refraction strength of the glass lens. |
| `data-bezel` | `0.046` | Bezel thickness as a proportion of the switch height. |
| `data-start-night` | `false` | Set to `true` to initialize the switch in night mode. |
| `data-friction` | `0.6` | Release inertia/damping. Range: `0.1–0.9`; lower values preserve more fling momentum. |
| `data-bounce` | `3.2` | Edge rebound impulse. Range: `0–12`; higher values create a stronger elastic kick. |
| `data-dispersion` | `0.05` | RGB edge dispersion in the glass lens. Range: `0–0.25`; set to `0` to disable chromatic fringes. |
| `data-shine` | `0.44` | Daytime lens highlight intensity. Range: `0–1.5`; higher values create a stronger glossy reflection. |
| `data-time-speed` | `1.0` | World simulation speed. Range: `0–8`; `0` freezes world motion and `2` runs it at double speed. |
| `data-weather` | `default` | World weather preset: `default` or `snow`. Snow adds falling pixel flakes. |

### Example

```html
<div
  data-ld-part="toggle-daylight"
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
></div>

<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

The values are read from the element's `dataset` during mounting. Numeric settings are converted to numbers and validated; missing, empty, non-finite, or non-positive values use the defaults. The initial night setting is enabled only when `data-start-night="true"`.

### Attribute examples

Start in day mode with the standard appearance:

```html
<div data-ld-part="toggle-daylight"></div>
```

Use a slower animation and a thicker bezel:

```html
<div
  data-ld-part="toggle-daylight"
  data-speed="7"
  data-bezel="0.06"
></div>
```

Start in night mode with stronger lens refraction:

```html
<div
  data-ld-part="toggle-daylight"
  data-refraction="1.6"
  data-start-night="true"
></div>
```

## Interaction

- **Drag** the switch. When released, it settles toward the nearest end; a quick fling can carry it across.
- **Click** the switch to toggle between day and night.
- **Keyboard**: focus the switch and use the arrow keys to move it in small steps.

Dragging represents the passage of time: sunrise, daytime, dusk, and night. The tiny resident has a daily routine, moving around the pixel world as the light changes.

## Sync your page theme

While the switch is running, it writes the current night level to the `--night` custom property on the root `<html>` element:

- `0` means day.
- `1` means night.
- Values between `0` and `1` represent the transition.

Use it to make the rest of your page follow the switch:

```css
body {
  background: color-mix(
    in srgb,
    #f5ecd9,
    #1b2146 calc(var(--night, 0) * 100%)
  );
}
```

The value updates continuously while dragging, so an additional CSS transition is not required. `color-mix()` is supported by modern browsers.

If you only need to react when the day/night state changes, listen for `daylight:change`:

```js
document.addEventListener('daylight:change', (event) => {
  document.documentElement.classList.toggle('dark', event.detail.night);
});
```

## Customize colors

Override the CSS custom properties on the component:

```css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;
  --ld-accent: #efa02c;
}
```

Available color properties and their defaults:

| CSS property | Default |
| --- | --- |
| `--ld-bg` | `#f5ecd9` |
| `--ld-surface` | `#8c9a62` |
| `--ld-fg` | `#1b2146` |
| `--ld-muted` | `#7f97b3` |
| `--ld-accent` | `#efa02c` |

## Dynamic mounting

For single-page applications or elements added after the initial page load, mount and unmount instances through the global API:

```js
const destroy = PixelDaylightSwitch.mount(element);

// When the component is no longer needed:
PixelDaylightSwitch.unmount(element);
```

## Browser support

- WebGL2 is used for the glass/lens rendering when available.
- Canvas 2D is used as the fallback renderer.
- The component respects `prefers-reduced-motion`.
- The switch is focusable and exposes switch semantics for assistive technology.

## Local development

Clone the repository and open `index.html` in a modern browser:

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
```

- `app.js` — the component implementation.
- `index.html` — the demo page.

No build step is required.

## Changelog

### v1.2.0

- Add per-instance physics controls for release friction and edge bounce.
- Add shader controls for glass chromatic dispersion and surface shine.
- Add world simulation speed control, including a full pause at `0`.
- Add an optional pixel-snow weather preset with day/night-aware appearance.
- Preserve v1.1.0 visuals and behavior when the new attributes are omitted.
- Validate and clamp numeric parameters; unknown weather values fall back to `default`.

### v1.1.0

- Add per-instance HTML data attribute configuration.
- Add `data-speed` to control animation speed.
- Add `data-refraction` to control glass lens refraction.
- Add `data-bezel` to control bezel thickness.
- Add `data-start-night="true"` to initialize the component in night mode.
- Validate numeric values and preserve defaults when attributes are missing or invalid.
- Expand the documentation with configuration examples in Chinese/English-friendly terminology.

### v1.0.0

- Initial public version of the zero-dependency day/night switch component.

## License

[Unlicense](https://unlicense.org/) — public domain. Use it freely, including in commercial projects; attribution is not required.

---

# 中文说明

## 像素昼夜开关

一个带有像素居民的昼夜开关组件。拖动开关，场景会从白天逐渐进入夜晚；再拖回来，日光重新出现。

### 快速接入

只需要两行代码，无需 npm、依赖安装或构建：

```html
<div data-ld-part="toggle-daylight"></div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

脚本会自动生成组件内部结构和样式。组件宽度跟随容器，高度保持比例。页面中可以放置多个实例。

### HTML 参数配置

每个组件实例都可以通过 HTML 的 `data-*` 属性独立配置。所有参数都是可选的；未填写或填写无效时会使用默认值。

| 属性 | 默认值 | 作用 |
| --- | ---: | --- |
| `data-speed` | `9.5` | 控制开关动画速度 |
| `data-refraction` | `1.24` | 控制玻璃镜片的折射强度 |
| `data-bezel` | `0.046` | 控制外框厚度系数 |
| `data-start-night` | `false` | 设置为 `true` 时，组件初始化为黑夜状态 |
| `data-friction` | `0.6` | 松手后的惯性/阻尼系数，范围 `0.1–0.9`；数值越小，甩动后保留的惯性越强 |
| `data-bounce` | `3.2` | 滑块到达边缘时的回弹力度，范围 `0–12`；数值越大，弹性反馈越明显 |
| `data-dispersion` | `0.05` | 玻璃镜片边缘的 RGB 色散强度，范围 `0–0.25`；设为 `0` 可关闭彩虹边 |
| `data-shine` | `0.44` | 白天镜片表面高光强度，范围 `0–1.5`；数值越大，玻璃反光越明显 |
| `data-time-speed` | `1.0` | 像素世界模拟速度，范围 `0–8`；`0` 冻结世界动态，`2` 表示以两倍速度运行 |
| `data-weather` | `default` | 天气预设，支持 `default` 和 `snow`；`snow` 会在世界中加入飘落的像素雪花 |

完整示例：

```html
<div
  data-ld-part="toggle-daylight"
  data-speed="12"
  data-refraction="1.5"
  data-bezel="0.05"
  data-start-night="true"
></div>

<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

数值参数会在组件挂载时从 `root.dataset` 读取并转换为数字。缺失、空值、非有限数值或非正数都会自动回退到默认值。只有明确写入 `data-start-night="true"` 才会在初始化时进入黑夜。

### 交互方式

- 拖动滑块：松手后自动吸附到最近的一端，快速甩动也可以切换。
- 点击开关：直接切换昼夜。
- 键盘操作：聚焦开关后使用方向键逐步调整。

拖动过程对应日出、白天、黄昏和夜晚。像素世界中的小居民也会随着时间变化进行自己的日常活动。

### 让整个页面跟随昼夜变化

组件会持续把当前夜晚程度写入根元素的 `--night` CSS 变量：

- `0` 表示白天；
- `1` 表示夜晚；
- 中间值表示昼夜过渡。

例如：

```css
body {
  background: color-mix(
    in srgb,
    #f5ecd9,
    #1b2146 calc(var(--night, 0) * 100%)
  );
}
```

如果只需要在昼夜状态改变时执行逻辑，可以监听 `daylight:change` 事件：

```js
document.addEventListener('daylight:change', (event) => {
  document.documentElement.classList.toggle('dark', event.detail.night);
});
```

### 自定义颜色

在组件选择器上覆盖以下 CSS 变量：

```css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;
  --ld-accent: #efa02c;
}
```

| CSS 变量 | 默认值 |
| --- | --- |
| `--ld-bg` | `#f5ecd9` |
| `--ld-surface` | `#8c9a62` |
| `--ld-fg` | `#1b2146` |
| `--ld-muted` | `#7f97b3` |
| `--ld-accent` | `#efa02c` |

### 动态挂载与卸载

单页应用中，如果组件容器是在页面加载后才添加的，可以调用全局 API：

```js
const destroy = PixelDaylightSwitch.mount(element);

// 不再需要时卸载：
PixelDaylightSwitch.unmount(element);
```

### 本地运行

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
```

使用浏览器打开 `index.html` 即可，无需构建。

- `app.js`：组件主体。
- `index.html`：交互演示页面。

### 更新记录

**v1.2.0**

- 新增物理参数：松手惯性阻尼与边缘回弹力度。
- 新增 WebGL 着色器参数：玻璃边缘色散与表面高光强度。
- 新增像素世界时间倍率，支持设置为 `0` 完全冻结世界动态。
- 新增 `snow` 飘雪天气预设，雪花外观会随昼夜变化。
- 不传入新增参数时，沿用 v1.1.0 的默认视觉与行为。
- 对数值参数进行类型转换、范围限制和默认值兜底；未知天气值回退为 `default`。

**v1.1.0**

- 新增 HTML `data-*` 参数配置。
- 新增动画速度、镜片折射强度和外框厚度的独立控制。
- 新增初始化时默认进入黑夜的选项。
- 增加数值转换、参数校验和默认值兜底。

**v1.0.0**

- 首个公开版本。

### 开源协议

[Unlicense](https://unlicense.org/)，属于公有领域。允许自由使用，包括商业用途，无需署名。
