# Pixel Daylight Switch

**Language / 语言 / 言語:** [English](#english) · [简体中文](#简体中文) · [日本語](#日本語)

![Pixel Daylight Switch — five animated pixel-world scenes](assets/scene-gallery.png)

<a id="english"></a>

**Pixel Daylight Switch** is a draggable day/night UI component with a tiny animated pixel world inside a refractive glass lens. Drag the control to move through daylight, dusk, and night.

## Features

- An animated pixel environment inside a refractive glass switch.
- WebGL2 refraction rendering with a Canvas 2D fallback.
- Five scenes: countryside, Japanese street, modern apartment, seaside lighthouse, and mountain cabin.
- Continuous day/night transitions with pointer, touch, click, and keyboard interaction.
- Per-instance HTML attributes for motion, optics, weather, and scene settings.
- Multiple independent instances, accessible switch semantics, and reduced-motion support.
- No third-party runtime dependencies.

## Quick start

No package manager or build step is required:

```html
<div data-ld-part="toggle-daylight"></div>
<script defer src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

The script automatically mounts matching elements and creates the canvas, interaction button, and live status region.

## NPM

```bash
npm install pixel-daylight-switch-gsvegetable
```

ESM:

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');
PixelDaylightSwitch.mount(root);
PixelDaylightSwitch.unmount(root); // Call before removing the root.
```

CommonJS:

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

The package provides ESM and CommonJS entry points and is safe to import in SSR environments. Call `mount()` only after the element exists in the browser.

## Interactive Playground

Open the [Interactive Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) to experiment with motion, glass optics, world speed, weather, and scenes. Apply settings to the preview and copy the generated HTML.

## Configuration

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

## Events and accessibility

The component updates `--night` on its root: `0` means day, `1` means night, and values in between represent the transition.

It dispatches a bubbling `daylight:change` event when the switch reaches a changed day/night state. `event.detail.night` is a boolean.

The switch uses `role="switch"` and `aria-checked`, announces its state through a live region, supports keyboard arrows, and respects `prefers-reduced-motion`.

## Rendering

- WebGL2 renders the refractive glass effect.
- Canvas 2D is used as a fallback when WebGL2 is unavailable.
- Drawing pauses when the page is hidden or the component is offscreen.
- The component scales with its container and keeps an aspect ratio of approximately 1.6439:1.

## Development and tests

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

Browser regression tests:

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

## Version and platform status

Current release: **v2.0.0**. Detailed release history is maintained in [CHANGELOG.md](./CHANGELOG.md).

Capacitor Android and iOS build paths are included. Android real-device runtime validation is still in progress; iOS has passed a simulator build, but no signed IPA is provided. A successful build does not mean every device has been validated.

## License

[Unlicense](https://unlicense.org/) — public-domain dedication. Free for personal and commercial use without attribution.

---

<a id="简体中文"></a>
# 简体中文

**像素昼夜开关** 是一个可拖动的昼夜切换组件。折射玻璃镜片内部有一个持续活动的像素世界，拖动开关即可体验白天、黄昏与夜晚的变化。

## 功能

- 玻璃开关内部的动态像素场景。
- 使用 WebGL2 实现玻璃折射，并提供 Canvas 2D 回退渲染。
- 五种场景：乡村小屋、日本街道、现代公寓、海边灯塔、山间木屋。
- 支持连续昼夜过渡、鼠标/触控拖动、点击和键盘操作。
- 可通过 HTML 属性分别配置运动、光学、天气和场景。
- 支持同一页面挂载多个独立实例。
- 提供无障碍开关语义，并尊重系统减少动态效果设置。
- 独立脚本没有第三方运行时依赖。

## 快速开始

无需安装包管理器或构建工具：

```html
<div data-ld-part="toggle-daylight"></div>
<script defer src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

脚本会自动挂载匹配的元素，并创建 Canvas、交互按钮和状态播报区域。

## NPM

```bash
npm install pixel-daylight-switch-gsvegetable
```

ESM：

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');
PixelDaylightSwitch.mount(root);
PixelDaylightSwitch.unmount(root); // 移除根元素前调用。
```

CommonJS：

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

组件提供 ESM 和 CommonJS 入口，并可安全地在 SSR 环境中导入。请在浏览器中、元素存在之后调用 `mount()`。

## 参数实验室

打开[交互式参数实验室](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)，调整运动、玻璃光学、世界时间倍率、天气和场景。应用参数后可预览效果并复制生成的 HTML。

## 配置参数

所有参数均为可选项，写在组件根元素上。

| HTML 属性 | 默认值 | 说明 |
| --- | ---: | --- |
| `data-speed` | `9.5` | 基础运动响应速度，必须为正数。 |
| `data-refraction` | `1.24` | 玻璃镜片折射强度，必须为正数。 |
| `data-bezel` | `0.046` | 玻璃边缘厚度系数，必须为正数。 |
| `data-start-night` | `false` | 精确设置为 `true` 时，从夜晚状态开始。 |
| `data-friction` | `0.6` | 松手后的惯性阻尼，范围 `0.1–0.9`。 |
| `data-bounce` | `3.2` | 边缘回弹力度，范围 `0–12`。 |
| `data-dispersion` | `0.05` | 玻璃边缘 RGB 色散强度，范围 `0–0.25`。 |
| `data-shine` | `0.44` | 白天玻璃表面高光强度，范围 `0–1.5`。 |
| `data-time-speed` | `1` | 像素世界时间倍率，范围 `0–8`；设为 `0` 可冻结世界动态。 |
| `data-weather` | `default` | `default` 或 `snow`；未知值回退为 `default`。 |
| `data-scene` | `countryside` | `countryside`、`japanese-street`、`apartment`、`seaside` 或 `mountain-cabin`。 |

## 事件与无障碍

组件会在根元素上更新 CSS 变量 `--night`：`0` 表示白天，`1` 表示夜晚，中间值表示昼夜过渡。

昼夜状态变化时会派发可冒泡的 `daylight:change` 事件，其中 `event.detail.night` 为布尔值。

交互按钮使用 `role="switch"` 和 `aria-checked`，通过 live region 播报状态，支持方向键，并尊重系统的 `prefers-reduced-motion` 设置。

## 渲染方式

- WebGL2 用于玻璃折射效果。
- WebGL2 不可用时使用 Canvas 2D 回退渲染。
- 页面隐藏或组件离开视口时暂停不必要的绘制。
- 组件随容器缩放，宽高比约为 1.6439:1。

## 开发与测试

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

浏览器回归测试：

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

## 版本与平台状态

当前版本：**v2.0.0**。详细版本记录请查看 [CHANGELOG.md](./CHANGELOG.md)。

项目已包含 Capacitor Android 和 iOS 构建路径。Android 仍在进行真机运行验证；iOS 已通过模拟器编译，但尚未提供签名 IPA。构建成功不代表所有设备均已完成验证。

## 许可证

本项目采用 [Unlicense](https://unlicense.org/) 公有领域协议，可免费用于个人和商业用途，无需署名。

---

<a id="日本語"></a>
# 日本語

**Pixel Daylight Switch** は、ドラッグ操作で昼と夜を切り替えられる UI コンポーネントです。屈折するガラスレンズの中には、小さなピクセルワールドが広がっています。

## 特徴

- ガラススイッチの中で動き続けるピクセルアニメーション。
- WebGL2 によるガラスの屈折表現と、Canvas 2D によるフォールバック描画。
- 田園風景、日本の街並み、モダンなアパート、海辺の灯台、山小屋の 5 つのシーン。
- 昼・夕暮れ・夜の連続的な変化に対応。
- マウス、タッチ、クリック、キーボードによる操作。
- HTML 属性による動き、光学効果、天候、シーンの個別設定。
- 1 ページに複数の独立したインスタンスを配置可能。
- アクセシビリティに配慮し、OS の視差効果・アニメーション軽減設定にも対応。
- 単体スクリプトの実行時依存関係はありません。

## クイックスタート

パッケージのインストールやビルドは不要です。

```html
<div data-ld-part="toggle-daylight"></div>
<script defer src="https://gsvegetable.github.io/pixel-daylight-switch/app.js"></script>
```

スクリプトが対象要素を自動的にマウントし、Canvas、操作ボタン、状態通知領域を生成します。

## NPM

```bash
npm install pixel-daylight-switch-gsvegetable
```

ESM:

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');
PixelDaylightSwitch.mount(root);
PixelDaylightSwitch.unmount(root); // 要素を削除する前に呼び出してください。
```

CommonJS:

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

ESM と CommonJS の両方に対応し、SSR 環境でも安全にインポートできます。ブラウザー上で対象要素が DOM に追加された後に `mount()` を呼び出してください。

## インタラクティブ・プレイグラウンド

[プレイグラウンド](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) で、動き、ガラスの光学効果、ワールドの時間速度、天候、シーンを調整できます。設定をプレビューに適用し、生成された HTML をコピーできます。

## 設定属性

すべて任意の設定で、コンポーネントのルート要素に指定します。

| HTML 属性 | デフォルト | 説明 |
| --- | ---: | --- |
| `data-speed` | `9.5` | 基本的な動作応答速度。正の数を指定します。 |
| `data-refraction` | `1.24` | ガラスレンズの屈折強度。正の数を指定します。 |
| `data-bezel` | `0.046` | ガラスの縁の厚さ。正の数を指定します。 |
| `data-start-night` | `false` | `true` の場合、夜の状態から開始します。 |
| `data-friction` | `0.6` | ドラッグ終了後の慣性減衰。範囲は `0.1–0.9` です。 |
| `data-bounce` | `3.2` | 端での跳ね返りの強さ。範囲は `0–12` です。 |
| `data-dispersion` | `0.05` | レンズ端の RGB 色分散。範囲は `0–0.25` です。 |
| `data-shine` | `0.44` | 昼間のガラス表面のハイライト強度。範囲は `0–1.5` です。 |
| `data-time-speed` | `1` | ピクセルワールドの時間倍率。範囲は `0–8`、`0` で停止します。 |
| `data-weather` | `default` | `default` または `snow`。不明な値は `default` になります。 |
| `data-scene` | `countryside` | `countryside`、`japanese-street`、`apartment`、`seaside`、`mountain-cabin` を指定します。 |

## イベントとアクセシビリティ

コンポーネントのルート要素にある CSS 変数 `--night` が更新されます。`0` は昼、`1` は夜、その間の値は昼夜の遷移を表します。

昼夜の状態が変化すると、バブリングする `daylight:change` イベントが発生します。`event.detail.night` は真偽値です。

操作ボタンは `role="switch"` と `aria-checked` を使用し、live region で状態を通知します。矢印キーに対応し、`prefers-reduced-motion` の設定も尊重します。

## 描画と互換性

- ガラスの屈折表現には WebGL2 を使用します。
- WebGL2 が利用できない場合は Canvas 2D に切り替えます。
- ページが非表示、またはコンポーネントが画面外にある場合、不要な描画を一時停止します。
- コンポーネントはコンテナ幅に合わせて拡大・縮小し、約 1.6439:1 のアスペクト比を維持します。

## 開発とテスト

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

ブラウザー回帰テスト：

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

## バージョンとプラットフォーム状況

現在のリリース：**v2.0.0**。詳細な変更履歴は [CHANGELOG.md](./CHANGELOG.md) を参照してください。

Capacitor による Android / iOS のビルド手順を含みます。Android は実機での動作検証を継続中です。iOS はシミュレーター向けビルドに成功していますが、署名済み IPA は提供していません。ビルド成功は、すべての端末での動作確認を意味するものではありません。

## ライセンス

[Unlicense](https://unlicense.org/) を採用しています。個人利用・商用利用ともに無料で、クレジット表記は不要です。
