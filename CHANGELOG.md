# Changelog

All notable changes to Pixel Daylight Switch are documented here.

## [2.1.0] — Android visual and versioning fix

### Android app
- Replace the warm yellow-beige native page background with a neutral cool gray.
- Match the Capacitor native window background and mobile theme color to the page background.
- Set Android versionName and versionCode from the package version so new APKs no longer appear as version 1.0.

### Build reliability
- Apply package-driven Android version metadata after each generated Capacitor project.
- Keep the shared WebGL renderer and scene implementation unchanged.

## [2.0.0] — Released

### Android 与 iOS
- 引入 Capacitor 8 原生应用构建路径，支持 Android 与 iOS 共用现有 Web 渲染器。
- 新增独立移动端入口与全屏布局，处理 viewport、安全区域、横竖屏和触控拖动。
- 新增移动资源准备脚本与 smoke test，确保原生包使用与 Web 完全相同的 `app.js`。
- 新增 Android Debug APK 与 iOS Simulator 自动构建工作流。

### 架构与兼容性
- Web 继续保持独立运行；不重写、不复制 WebGL shader、场景数据或交互物理逻辑。
- 原生 Android / iOS 工程按需由 Capacitor 生成，不把 IDE 派生文件提交到仓库。
- 本版本不包含已签名商店包；正式发布仍需开发者签名与商店配置。

## [1.3.1]

### 稳定性与生命周期
- 修复组件卸载时主动销毁 WebGL context，导致同一 canvas/root 后续重新挂载可能异常的问题。
- 保留 GPU 资源释放与事件监听器、观察器清理，同时允许 canvas 在卸载后重新挂载。

### 自动化验证
- 增加 CommonJS、ESM 与 SSR 导入检查。
- 增加 Node.js 18、20、22 的 CI 兼容性检查。
- 增加 Chromium 浏览器回归：自动挂载、重复挂载/卸载、多实例、指针交互、事件监听器清理。
- 增加移动端触控、Playground 小屏布局与参数应用检查。
- 将浏览器回归纳入 npm 发布前置检查。

## [1.3.0]

<details>
<summary>查看 v1.3.0 详细更新</summary>

### 场景与世界
- 新增日本街道：店铺、暖帘、路灯、自动售货机、自行车与道路细节。
- 新增现代公寓：城市窗景、沙发、茶几、落地灯、室内植物与地毯。
- 新增海边：海面、沙滩、灯塔、帆船与海岸植被。
- 新增山间木屋：层叠山脉、针叶林、雪顶、木屋与烟囱。
- 保留乡村小屋作为默认场景。
- 新增 `data-scene` 场景属性，并在 Playground 中加入场景选择。

### Playground 与参数组织
- 参数按用途拆分：滑动响应速度、惯性与回弹归入运动反馈；折射、边缘厚度、色散与高光归入玻璃光学；时间倍率单独归入世界节奏；场景、天气和初始昼夜归入场景环境。

### 兼容性
- 默认仍为 `countryside`，既有接入方式不需要修改。
- 场景切换不改变开关物理、玻璃 shader 与昼夜时间逻辑。

</details>

## [1.2.0]

<details>
<summary>查看 v1.2.0 详细更新</summary>

### 参数与世界
- 新增 `data-friction`、`data-bounce`，分别调节惯性阻尼与边缘回弹。
- 新增 `data-dispersion`、`data-shine`，调节玻璃边缘色散与表面高光。
- 新增 `data-time-speed` 时间倍率，以及 `data-weather="snow"` 飘雪天气。

### Playground
- 新增独立参数实验室，支持分组调节、预设和 HTML 代码复制。
- 重构实验室视觉，采用更克制的编辑式布局。
- 通过独立预览与双缓冲切换，减少快速调参时的 WebGL 重建与白屏。

### 文档
- README 改为中文优先，并整理参数说明与英文文档。

### 兼容性
- 新增参数均为可选项；未设置时保留原有默认行为。

</details>

## [1.1.0]
- 新增动画速度、镜片折射、外框厚度和初始夜晚状态的 HTML 参数配置。

## [1.0.0]
- 首个公开版本。

