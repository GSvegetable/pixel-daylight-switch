# 像素昼夜开关

一个住着像素小人的昼夜开关。拖一下，天黑了；再拖一下，天亮了。

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7f248a5-c39c-432c-92f6-73237abdfe6b" width="49%" />
  <img src="https://github.com/user-attachments/assets/b2e24e65-a378-4ac6-be7b-efd3070e4da8" width="49%" />
</p>

[在线体验](https://gsvegetable.github.io/pixel-daylight-switch/)

## 它是什么

一个网页开关。开关里是一间小屋和一个像素小人，拖动滑块就是让时间走：日出、白天、黄昏、入夜，天色一路跟着变。

小人有自己的日程：上午在屋外忙活，中午坐着看书，傍晚散步，天黑了回屋点灯睡觉。拖得太快，他会被吓一跳。

开关外面那层玻璃是 WebGL 做的，带折射和高光。

## 怎么玩

- 拖动滑块。松手后会自己滑到最近的一端，甩一下也能带过去
- 点一下，直接切换
- 聚焦后用方向键，每按一次推进一小步

## 放进你的页面

没有依赖。带上 `style.css` 和 `app.js`，页面里放这一段：

```html
<div data-ld-part="toggle-daylight">
  <canvas class="scene" aria-hidden="true"></canvas>
  <button class="hit" type="button" role="switch" aria-checked="false" aria-label="昼夜开关"></button>
  <span class="vh" role="status" aria-live="polite" data-status></span>
  <span class="probe" aria-hidden="true"></span>
</div>
<script src="app.js"></script>
```

`app.js` 会挂载页面上第一个 `data-ld-part="toggle-daylight"` 的元素，所以 `<script>` 要放在它后面。

昼夜切换时，这个元素会发出 `daylight:change` 事件，`detail.night` 为 `true` 表示夜晚：

```js
const toggle = document.querySelector('[data-ld-part="toggle-daylight"]');
toggle.addEventListener('daylight:change', (e) => {
  document.body.classList.toggle('night', e.detail.night);
});
```

## 改颜色

画面配色来自 CSS 变量，在开关元素上覆盖就行：

```css
[data-ld-part="toggle-daylight"] {
  --ld-bg: #f5ecd9;
  --ld-accent: #efa02c;
}
```

可用的有 `--ld-bg`、`--ld-surface`、`--ld-fg`、`--ld-muted`、`--ld-accent`，另外 `--ld-radius`、`--ld-font`、`--ld-space`、`--ld-shadow`、`--ld-motion` 控制外形和动效。

## 实现上的几件事

- 画面是 192×112 的像素世界，每秒更新 30 次。配色在 Oklab 空间里取，再用 Bayer 抖动打散色阶
- 玻璃壳是 WebGL2 着色器，不支持时退回 Canvas 2D
- 开关不在屏幕内、或页面切到后台时，会暂停绘制
- 遵循系统的「减少动态效果」设置。开关本身是 `role="switch"`，可聚焦，状态会播报给读屏软件

## 本地运行

下载仓库，用浏览器打开 `index.html`。

- `index.html`：页面
- `style.css`：样式和 CSS 变量
- `app.js`：像素世界、小人、玻璃渲染和交互

## 协议

Unlicense，公有领域。想怎么用都行，包括商用，不用署名。

<details>
<summary>English</summary>
<br>

### Pixel Day-Night Switch

A day-night switch with a tiny pixel person living inside. Drag it and the sky goes dark; drag again and it's morning.

**What it is.** The slider is a timeline: sunrise, daytime, dusk, night. The resident has a routine. Outside tending things in the morning, reading at noon, a short walk in the evening, then home to light the lamp and sleep. Drag too fast and he gets startled. The glass shell is a WebGL shader with refraction and highlights.

**How to play.** Drag the slider; on release it settles at the nearest end, and a quick fling carries it over. Click to toggle. When focused, arrow keys move it in small steps.

**Use it in your page.** No dependencies. Include `style.css` and `app.js`, and put the markup shown above on the page, before the `<script>`. The element fires a `daylight:change` event with `detail.night` (boolean).

**Theming.** Colors come from CSS custom properties on the element: `--ld-bg`, `--ld-surface`, `--ld-fg`, `--ld-muted`, `--ld-accent`, plus `--ld-radius`, `--ld-font`, `--ld-space`, `--ld-shadow`, `--ld-motion`.

**Under the hood.** A 192×112 pixel world updated at 30 Hz, Oklab color ramps with Bayer dithering, a WebGL2 glass shader with a Canvas 2D fallback. Drawing pauses when offscreen or in a background tab. Respects `prefers-reduced-motion`; the switch is a focusable `role="switch"` with screen-reader status.

**Run locally.** Download the repo and
