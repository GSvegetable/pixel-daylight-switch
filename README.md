# Pixel Daylight Switch

一个可以拖动的像素昼夜开关组件。拖动玻璃滑块，场景会从白天流动到夜晚；像素小人生活在开关内部，随着时间变化活动。

<p align="center">
  <a href="https://gsvegetable.github.io/pixel-daylight-switch/">在线演示</a> ·
  <a href="https://gsvegetable.github.io/pixel-daylight-switch/playground.html">参数实验室 Playground</a> ·
  <a href="https://github.com/GSvegetable/pixel-daylight-switch/releases">版本发布</a>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7f248a5-c39c-432c-92f6-73237abdfe6b" width="49%" alt="白天模式" />
  <img src="https://github.com/user-attachments/assets/b2e24e65-a378-4ac6-be7b-efd3070e4da8" width="49%" alt="夜晚模式" />
</p>

**中文文档在前，English documentation is below.** [跳转到 English](#english)

## 目录

- [快速开始](#快速开始)
- [参数实验室](#参数实验室-playground)
- [HTML 参数配置](#html-参数配置)
- [交互与页面主题](#交互与页面主题)
- [自定义外观](#自定义外观)
- [动态挂载](#动态挂载)
- [兼容性与本地开发](#兼容性与本地开发)
- [更新记录](#更新记录)
- [许可证](#许可证)

## 快速开始

无需 npm、依赖安装或构建步骤。把下面两行放进 HTML：

```html
<div data-ld-part="toggle-daylight"></div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

脚本会自动创建组件内部的 Canvas、交互区域和辅助无障碍元素。组件宽度跟随父容器，高度保持固定比例。一个页面可以放置多个独立实例。

如果你需要离线部署，也可以直接下载仓库中的 `app.js` 并自行托管。

## 参数实验室 Playground

**不想手动试参数？打开 [Pixel Daylight Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)。**

- 左侧实时预览组件，直接拖动开关测试手感。
- 右侧按「运动反馈、玻璃光学、世界节奏、场景环境」四组调整参数。
- 使用场景预设快速切换乡村小屋、日本街道、现代公寓、海边灯塔和山间木屋。
- 调整参数时只更新数值；点击「应用参数」后才刷新独立预览，避免拖动滑块时反复重建 WebGL。
- 预览运行在独立页面中，与控制面板隔离，减少渲染状态互相干扰。

Playground 是独立页面，不会改变组件本身的零依赖接入方式。

## HTML 参数配置

所有参数都写在组件容器的 `data-*` 属性上。每个实例可以使用不同配置。参数可省略；缺失、空值或无效数值会回退到默认值。

### 全部参数

| HTML 属性 | 默认值 | 作用 |
| --- | ---: | --- |
| `data-speed` | `9.5` | 开关运动的基础速度 |
| `data-refraction` | `1.24` | 玻璃镜片的折射强度 |
| `data-bezel` | `0.046` | 外框厚度系数，相对于开关高度 |
| `data-start-night` | `false` | 设置为 `true` 时，初始化为夜晚状态 |
| `data-friction` | `0.6` | 松手后的惯性阻尼，范围 `0.1–0.9`；越小越容易继续滑动 |
| `data-bounce` | `3.2` | 滑块到达边缘时的回弹力度；越大弹性反馈越明显 |
| `data-dispersion` | `0.05` | 玻璃边缘 RGB 色散强度，范围 `0–0.25`；设为 `0` 可关闭彩虹边 |
| `data-shine` | `0.44` | 白天玻璃表面高光强度，范围 `0–1.5` |
| `data-time-speed` | `1.0` | 像素世界时间倍率，范围 `0–8`；`0` 冻结世界动态，`2` 为两倍速度 |
| `data-weather` | `default` | 天气预设：`default` 或 `snow`；雪天会出现飘落的像素雪花 |
| `data-scene` | `countryside` | 世界场景：`countryside`、`japanese-street`、`apartment`、`seaside` 或 `mountain-cabin` |

### 完整配置示例

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
  data-scene="mountain-cabin"
></div>

<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

### 参数分组与调校建议

**运动反馈 / Motion**

- `data-speed` 控制开关运动的基础速度。
- `data-friction` 控制松手后的惯性衰减。较小的值更滑，较大的值更黏。
- `data-bounce` 控制滑块触及边缘时的回弹力度。

**玻璃光学 / Glass Optics**

- `data-refraction` 控制镜片折射强度。
- `data-bezel` 控制镜片外框厚度。
- `data-dispersion` 控制边缘色散。数值越大，彩虹色边缘越明显。
- `data-shine` 控制白天镜片高光。

**世界节奏 / World Rhythm**

- `data-time-speed="0"` 可以冻结世界时间和动态。
- `data-time-speed="2"` 会让世界模拟以两倍速度运行。
- `data-weather="snow"` 开启飘雪；省略或填写其他值时使用默认天气。
- `data-scene` 选择完整的像素环境：乡村、日本街道、公寓室内、海边或山间木屋。
- `data-start-night="true"` 让组件从夜晚开始。

### 默认值与兼容性

场景、天气和初始昼夜状态归入「场景环境」；它们不是连续数值，因此使用选择器与开关，而不是滑动条。

如果只写：

```html
<div data-ld-part="toggle-daylight"></div>
```

组件会使用默认参数。v1.2.0 的新增参数默认值与 v1.1.0 的原有参数保持一致，未配置新属性时不会主动改变原有视觉设定。数值参数会进行数字转换、有效性检查和范围限制；未知天气值回退到 `default`。

## 交互与页面主题

- **拖动**：拖动滑块，让世界从白天经过黄昏进入夜晚。
- **点击**：点击开关，在白天和夜晚之间切换。
- **键盘**：聚焦开关后使用方向键调整。
- **无障碍**：使用 switch 语义，并尊重系统的减少动态效果偏好。

组件会把当前夜晚程度写入根元素的 CSS 自定义属性 `--night`：

- `0` 表示白天；
- `1` 表示夜晚；
- 中间值表示昼夜过渡。

例如，让页面背景跟随开关变化：

```css
body {
  background: color-mix(
    in srgb,
    #f5ecd9,
    #1b2146 calc(var(--night, 0) * 100%)
  );
}
```

如果只需要在昼夜状态变化时执行逻辑，可以监听事件：

```js
document.addEventListener('daylight:change', (event) => {
  document.documentElement.classList.toggle('dark', event.detail.night);
});
```

## 自定义外观

在组件容器上覆盖 CSS 自定义属性：

```css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;
  --ld-surface: #8c9a62;
  --ld-fg: #1b2146;
  --ld-muted: #7f97b3;
  --ld-accent: #efa02c;
}
```

| CSS 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--ld-bg` | `#f5ecd9` | 背景色 |
| `--ld-surface` | `#8c9a62` | 表面与场景色 |
| `--ld-fg` | `#1b2146` | 前景色 |
| `--ld-muted` | `#7f97b3` | 次要颜色 |
| `--ld-accent` | `#efa02c` | 强调色 |

## 动态挂载

如果组件容器是在页面加载后动态创建的，可以手动挂载：

```js
const destroy = PixelDaylightSwitch.mount(element);

// 不再需要时：
PixelDaylightSwitch.unmount(element);
```

## 兼容性与本地开发

- 优先使用 WebGL2 渲染玻璃效果；不可用时回退到 Canvas 2D。
- 支持减少动态效果偏好。
- 页面不可见或组件离开视口时会暂停不必要的绘制。
- 不需要构建工具。

本地运行：

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
```

使用浏览器打开 `index.html` 即可。主要文件：

- `app.js`：组件实现。
- `index.html`：基础演示页面。
- `playground.html`：参数实验室与场景切换。

## 更新记录

### v1.3.0

- 新增四个独立像素环境：日本街道、现代公寓、海边灯塔和山间木屋。
- Playground 新增真实场景选择，可与玻璃参数、昼夜和天气效果组合。

### v1.2.0

本次版本包含两轮未发布的更新：

- 新增物理参数：惯性阻尼与边缘回弹。
- 新增液态玻璃参数：色散与表面高光。
- 新增世界时间倍率和像素飘雪天气。
- 新增独立 Playground，可实时调节参数、套用预设并复制 HTML。
- 重组 README，将中文说明置于文档顶部，并提供中英文跳转。

### v1.1.0

- 新增动画速度、镜片折射、外框厚度和初始夜晚状态的 HTML 参数配置。

### v1.0.0

- 首个公开版本。

## 许可证

[Unlicense](https://unlicense.org/) — 公有领域协议。允许自由使用，包括商业用途，无需署名。

---

## English

A draggable day/night switch with a tiny pixel world living inside the glass. Move the switch to transition between daylight, dusk, and night.

**Quick links:** [Live demo](https://gsvegetable.github.io/pixel-daylight-switch/) · [Interactive Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) · [Releases](https://github.com/GSvegetable/pixel-daylight-switch/releases)

### Quick start

No npm, dependencies, or build step required:

```html
<div data-ld-part="toggle-daylight"></div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

The script creates the internal canvas, interaction target, and accessibility elements. The component is responsive and supports multiple independent instances on one page.

### Interactive Playground

Open the [Pixel Daylight Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) to tune all component settings visually, try presets, preview changes, and copy generated HTML.

### HTML configuration

All settings are optional and configured per instance using `data-*` attributes.

| Attribute | Default | Description |
| --- | ---: | --- |
| `data-speed` | `9.5` | Base switch motion speed. |
| `data-refraction` | `1.24` | Glass lens refraction strength. |
| `data-bezel` | `0.046` | Bezel thickness relative to component height. |
| `data-start-night` | `false` | Initialize in night mode when set to `true`. |
| `data-friction` | `0.6` | Release inertia damping; lower values feel more slippery. |
| `data-bounce` | `3.2` | Rebound impulse at the switch edges. |
| `data-dispersion` | `0.05` | RGB chromatic dispersion at the glass edge; `0` disables it. |
| `data-shine` | `0.44` | Daytime glass highlight intensity. |
| `data-time-speed` | `1.0` | World simulation speed; `0` freezes world dynamics and `2` doubles the speed. |
| `data-weather` | `default` | Weather preset: `default` or `snow`. |
| `data-scene` | `countryside` | Pixel environment: `countryside`, `japanese-street`, `apartment`, `seaside`, or `mountain-cabin`. |

Example:

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
  data-scene="mountain-cabin"
></div>
```

Missing or invalid numeric values fall back to defaults. Unknown weather values fall back to `default`; unknown scene values fall back to `countryside`. With no new v1.2.0 or v1.3.0 attributes, the component retains the intended default appearance.

### Page theme integration

The component exposes the current night level as the `--night` CSS custom property on the root element: `0` is day, `1` is night, and intermediate values represent the transition.

```css
body {
  background: color-mix(in srgb, #f5ecd9, #1b2146 calc(var(--night, 0) * 100%));
}
```

Listen for state changes with:

```js
document.addEventListener('daylight:change', (event) => {
  document.documentElement.classList.toggle('dark', event.detail.night);
});
```

### Theme colors

Override `--ld-bg`, `--ld-surface`, `--ld-fg`, `--ld-muted`, and `--ld-accent` on the component element to customize its palette.

### Dynamic mounting

```js
PixelDaylightSwitch.mount(element);
PixelDaylightSwitch.unmount(element);
```

### Browser support

WebGL2 is used for the glass effect when available, with Canvas 2D as a fallback. The component respects reduced-motion preferences and pauses unnecessary rendering when hidden or offscreen.

### Development

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
```

Open `index.html` in a modern browser. No build step is needed.

### Version status

v1.3.0 adds four new pixel environments and a reorganized Playground. See [CHANGELOG.md](./CHANGELOG.md) for the detailed history.

### License

[Unlicense](https://unlicense.org/) — public domain. Free for personal and commercial use without attribution.
