# Pixel Daylight Switch

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

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
