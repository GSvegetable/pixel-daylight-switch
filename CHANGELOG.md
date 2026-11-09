# Changelog

All notable changes to Pixel Daylight Switch are documented here.

## [1.2.0] - 2026-11-10

### Added
- `data-friction` to tune release inertia and damping (default: `0.6`, clamped to `0.1–0.9`).
- `data-bounce` to tune the edge rebound impulse (default: `3.2`, clamped to `0–12`).
- `data-dispersion` to tune RGB chromatic dispersion at the glass edge (default: `0.05`, clamped to `0–0.25`).
- `data-shine` to tune daytime glass highlight intensity (default: `0.44`, clamped to `0–1.5`).
- `data-time-speed` to scale world simulation time (default: `1.0`; `0` pauses world dynamics).
- `data-weather="snow"` to enable deterministic falling pixel snow with day/night-aware tones.

### Compatibility
- All new attributes are optional.
- Omitted or invalid numeric values fall back to the v1.1.0-equivalent defaults.
- Unknown weather presets fall back to `default`.
- With no new attributes, the intended v1.1.0 appearance and behavior are preserved.

## [1.1.0]
- Added per-instance HTML data attributes for animation speed, lens refraction, bezel thickness, and initial night mode.

## [1.0.0]
- Initial public release of the zero-dependency day/night switch.
