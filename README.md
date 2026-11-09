# 🌓 像素昼夜开关 (Pixel Day-Night Switch)

一个住着像素小人的昼夜开关。拖一下，天黑了；再拖一下，天亮了。

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7f248a5-c39c-432c-92f6-73237abdfe6b" width="49%" />
  <img src="https://github.com/user-attachments/assets/b2e24e65-a378-4ac6-be7b-efd3070e4da8" width="49%" />
</p>

<p align="center">
  <b><a href="https://gsvegetable.github.io/pixel-daylight-switch/" target="_blank">👉 点击这里直接在线体验 👈</a></b>
</p>

## ✨ 为什么用它？

- **极简接入**：只需要 **两行代码**，不用 NPM，不用配构建工具，复制粘贴就能跑。
- **零依赖**：纯原生 JavaScript 渲染，极致轻量。
- **开箱即用**：组件会自动注入样式并生成内部结构，不污染你原有页面的代码。
- **高级联动**：自带 CSS 变量 `--night`，能轻松让你的整个网页背景跟着开关一起平滑变暗或变亮。

## 🚀 快速接入 (Quick Start)

只需要将以下 **两行代码** 粘贴到你 HTML 的 `<body>` 中（注意顺序，先写 div，后写 script）：

~~~html
<!-- 1. 放置组件容器 -->
<div data-ld-part="toggle-daylight"></div>

<!-- 2. 引入组件脚本 -->
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
~~~

*组件会自动居并适配宽度，你可以把它放在任何你想放的 `<div>` 容器里。*

## 🪄 进阶：与你的网页主题联动

开关在切换时，会自动在元素上更新 CSS 变量 `--night`（`0` 表示白天，`1` 表示黑夜）。你可以利用它，让你的整个网页背景跟着小人的昼夜一起平滑过渡：

~~~css
/* 在你的 CSS 里这样写，网页背景就会随着开关拖动而变色 */
body {
  background-color: rgb(
    calc(245 - 200 * var(--night, 0)), 
    calc(236 - 200 * var(--night, 0)), 
    calc(217 - 150 * var(--night, 0))
  );
  transition: background-color 0.3s ease;
}
~~~

## 🎨 自定义外观

如果你觉得默认颜色不适合你的网站，可以直接在你自己的 CSS 里覆盖以下变量，组件会自动读取并重新渲染像素世界的配色：

~~~css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;      /* 背景色 */
  --ld-accent: #efa02c;  /* 强调色（如太阳、灯光） */
  /* 还支持 --ld-surface, --ld-fg 等 */
}
~~~

## 🛠️ 本地运行

不需要任何环境配置，直接把仓库克隆下来，双击用浏览器打开 `index.html` 即可查看演示。

- `index.html`：演示页面
- `app.js`：核心组件代码（包含样式、像素渲染、WebGL 外壳）

<br>

<details>
<summary><b>🇬🇧 Click here to expand English Documentation (点击展开英文版)</b></summary>
<br>

### Pixel Day-Night Switch

A day-night switch with a tiny pixel person living inside. Drag it and the sky goes dark; drag again and it's morning.

**Why use it?**
- **Two-line Integration**: No NPM, no build tools. Just copy, paste, and it works.
- **Zero Dependencies**: Pure vanilla JavaScript, extremely lightweight.
- **Out-of-the-box**: Auto-injects styles and DOM structure. No pollution to your existing code.
- **Theme Sync**: Exposes a `--night` CSS variable, allowing your entire webpage to seamlessly transition to dark mode.

**Quick Start**
Just copy the following two lines into the `<body>` of your HTML (make sure to place the `<div>` before the `<script>`):

~~~html
<div data-ld-part="toggle-daylight"></div>
<script src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
~~~

**Advanced: Theme Sync**
When toggled, the component updates a CSS variable `--night` (`0` for day, `1` for night). You can use it to smoothly transition your webpage background:

~~~css
body {
  background-color: rgb(
    calc(245 - 200 * var(--night, 0)), 
    calc(236 - 200 * var(--night, 0)), 
    calc(217 - 150 * var(--night, 0))
  );
  transition: background-color 0.3s ease;
}
~~~

**Under the hood.** A 192×112 pixel world updated at 30 Hz, Oklab color ramps with Bayer dithering, a WebGL2 glass shader with a Canvas 2D fallback.

**License:** Unlicense, public domain. Do whatever you want, including commercial use, no attribution required.

</details>

<br>

## 📄 协议

Unlicense，公有领域。想怎么用都行，包括商业用途，不需要署名。
