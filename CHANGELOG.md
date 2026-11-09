# Changelog

All notable changes to Pixel Daylight Switch are documented here.

## [1.3.0] — 开发中，尚未发布\n\n<details>\n<summary>查看 v1.3.0 详细更新</summary>\n\n### 场景与世界\n- 新增日本街道：店铺、暖帘、路灯、自动售货机、自行车与道路细节。\n- 新增现代公寓：城市窗景、沙发、茶几、落地灯、室内植物与地毯。\n- 新增海边：海面、沙滩、灯塔、帆船与海岸植被。\n- 新增山间木屋：层叠山脉、针叶林、雪顶、木屋与烟囱。\n- 保留乡村小屋作为默认场景。\n- 新增 `data-scene` 场景属性，并在 Playground 中加入场景选择。\n\n### 兼容性\n- 默认仍为 `countryside`，既有接入方式不需要修改。\n- 场景切换不改变开关物理、玻璃 shader 与昼夜时间逻辑。\n\n</details>\n\n## [1.2.0] — 开发中，尚未发布

### Added
- `data-friction` to tune release inertia and damping (default: `0.6`, clamped to `0.1–0.9`).
- `data-bounce` to tune the edge rebound impulse (default: `3.2`, clamped to `0–12`).
- `data-dispersion` to tune RGB chromatic dispersion at the glass edge (default: `0.05`, clamped to `0–0.25`).
- `data-shine` to tune daytime glass highlight intensity (default: `0.44`, clamped to `0–1.5`).
- `data-time-speed` to scale world simulation time (default: `1.0`; `0` pauses world dynamics).
- `data-weather="snow"` to enable deterministic falling pixel snow with day/night-aware tones.

### Playground
- Add a standalone interactive Playground with live preview, grouped controls, presets, and copyable HTML configuration.
- Redesign the Playground with a restrained editorial layout instead of generic gradient cards.
- Isolate the component renderer in `preview.html`; parameter controls no longer unmount and recreate the WebGL canvas on every slider movement.
- Make preview updates explicit through an Apply action, preventing rapid context churn, white frames, and unnecessary rendering work.

### Documentation
- Restructure README with Chinese documentation first, a table of contents, Playground entry points, and a concise English section.

### Compatibility
- All new attributes are optional.
- Omitted or invalid numeric values fall back to the v1.1.0-equivalent defaults.
- Unknown weather presets fall back to `default`.
- With no new attributes, the intended v1.1.0 appearance and behavior are preserved.

<details>\n<summary>查看 v1.2.0 详细更新</summary>\n\n## v1.2.0 详细更新\n\n
- Added per-instance HTML data attributes for animation speed, lens refraction, bezel thickness, and initial night mode.

</details>\n\n## [1.0.0]
- Initial public release of the zero-dependency day/night switch.
