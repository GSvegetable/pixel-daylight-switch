# Pixel Daylight Switch

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

屈折するガラススイッチの中に、小さなピクセルワールドを。

**Pixel Daylight Switch** は、ドラッグ操作で昼・夕暮れ・夜を切り替えられる UI コンポーネントです。ガラスレンズの中のピクセルアートの世界が、スイッチの動きに合わせて変化します。Vanilla JavaScript、WebGL2、Canvas 2D フォールバックで構成され、実行時にサードパーティ製ライブラリを必要としません。

**[オンライン Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** · **[ソースコード](https://github.com/GSvegetable/pixel-daylight-switch)** · **[変更履歴](CHANGELOG.md)**

### 主な特徴

- **動くピクセルワールド：** 田園風景、日本の街並み、モダンなアパート、海辺の灯台、山小屋の 5 シーン。
- **屈折するガラス：** WebGL2 でレンズ効果を描画し、利用できない場合は Canvas 2D にフォールバック。
- **連続した昼夜の変化：** ドラッグ、タップ、クリック、キーボードで操作可能。
- **柔軟なカスタマイズ：** 動き、慣性、バウンス、屈折、ガラス表現、ワールド速度、天候、シーンを HTML 属性で設定。
- **複数インスタンス：** 1 ページに独立したスイッチを複数配置可能。
- **アクセシビリティ：** switch セマンティクス、状態通知、キーボード操作、`prefers-reduced-motion` に対応。
- **ライフサイクル API：** 動的なアプリケーション向けに `mount()` と `unmount()` を提供。
- **軽量な導入：** 単体ブラウザースクリプトに実行時依存関係はありません。

### Playground

**[インタラクティブ Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html)** でシーンや各種パラメーターを変更し、プレビューを確認して HTML コードをコピーできます。

### クイックスタート：ビルド不要

HTML にマウント要素を配置し、ブラウザースクリプトを読み込みます。

```html
<div data-ld-part="toggle-daylight"></div>

<script
  defer
  src="https://gsvegetable.github.io/pixel-daylight-switch/app.js">
</script>
```

スクリプトは `data-ld-part="toggle-daylight"` を持つ要素を自動検出し、コンポーネントの DOM と描画領域を生成します。レイアウト側でマウント要素の幅を指定してください。コンポーネントはコンテナに合わせて拡大・縮小します。

### npm からインストール

```bash
npm install pixel-daylight-switch-gsvegetable
```

**ES Modules**

```js
import PixelDaylightSwitch from 'pixel-daylight-switch-gsvegetable';

const root = document.querySelector('[data-ld-part="toggle-daylight"]');

PixelDaylightSwitch.mount(root);

// DOM から root を削除する前に呼び出します。
PixelDaylightSwitch.unmount(root);
```

**CommonJS**

```js
const PixelDaylightSwitch = require('pixel-daylight-switch-gsvegetable');
```

ESM と CommonJS の両方を提供し、SSR 環境でも安全にインポートできます。`mount()` はブラウザー上で対象要素が存在してから呼び出してください。ブラウザースクリプトを直接読み込む場合は自動マウントされます。

### 設定属性

すべて任意の設定で、コンポーネントのルート要素に指定します。省略時または無効な値の場合はデフォルト値が使われます。

| HTML 属性 | デフォルト | 説明 |
| --- | ---: | --- |
| `data-speed` | `9.5` | スイッチの基本応答速度。0 より大きい値。 |
| `data-refraction` | `1.24` | ガラスレンズの屈折強度。0 より大きい値。 |
| `data-bezel` | `0.046` | ガラスの縁の相対的な厚さ。0 より大きい値。 |
| `data-start-night` | `false` | 文字列 `"true"` の場合、夜の状態から開始。 |
| `data-friction` | `0.6` | リリース後の慣性減衰。範囲は `0.1–0.9`。 |
| `data-bounce` | `3.2` | 端での跳ね返り。範囲は `0–12`。 |
| `data-dispersion` | `0.05` | ガラス端の RGB 色分散。範囲は `0–0.25`。 |
| `data-shine` | `0.44` | 昼間のガラスハイライト強度。範囲は `0–1.5`。 |
| `data-time-speed` | `1` | ピクセルワールドの時間倍率。範囲は `0–8`、`0` で停止。 |
| `data-weather` | `default` | `default` または `snow`。不明な値は `default` に戻ります。 |
| `data-scene` | `countryside` | `countryside`、`japanese-street`、`apartment`、`seaside`、`mountain-cabin`。 |

**例：夜から開始し、海辺のシーンを使用**

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

### イベントと状態

ルート要素の CSS カスタムプロパティ `--night` が更新されます。

- `0`：昼
- `1`：夜
- `0` と `1` の間：遷移中

確定した昼夜状態が変化すると、ルート要素からバブリングし、Shadow DOM の境界を越える `daylight:change` イベントが発生します。`event.detail.night` は boolean 値です。

```js
const root = document.querySelector('[data-ld-part="toggle-daylight"]');

root.addEventListener('daylight:change', (event) => {
  console.log(event.detail.night ? 'Night' : 'Day');
});
```

このイベントは昼夜状態が変わったときに発生し、アニメーションの各フレームでは発生しません。

### 描画とパフォーマンス

- ガラスの屈折描画には WebGL2 を使用します。
- WebGL2 が利用できない、または初期化に失敗した場合は Canvas 2D に切り替えます。
- ドキュメントが非表示、またはコンポーネントが画面外にある場合、不要な描画を一時停止します。
- コンテナサイズに合わせて描画領域を調整します。
- OS の `prefers-reduced-motion` 設定を尊重します。

フレームワークは不要です。実際の描画性能はブラウザー、GPU、デバイスピクセル比、画面内のインスタンス数によって異なります。

### 開発とテスト

```bash
git clone https://github.com/GSvegetable/pixel-daylight-switch.git
cd pixel-daylight-switch
npm test
```

基本テストではモジュールエントリー、SSR インポート、モバイル準備チェックを検証します。

Chromium ブラウザー回帰テスト：

```bash
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npm run test:browser
```

GitHub Actions は Node.js 18、20、22 でパッケージと SSR のチェックを実行し、Chromium の操作・モバイル回帰テストも実行します。最新の結果は **[GitHub Actions](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml)** を確認してください。

### Android / iOS

リポジトリには Capacitor 8 による Android / iOS のビルド手順が含まれています。ネイティブ版も Web と同じレンダラーを使用し、別の描画実装は持ちません。

ビルド成功は、すべての実機での互換性確認を意味しません。Android 実機での検証は継続中です。iOS シミュレーター向けビルドには対応していますが、署名済み App Store IPA は提供していません。

### プロジェクトへの入口

目的に合わせて、必要なページへ直接アクセスできます。

| 目的 | リンク |
| --- | --- |
| **スイッチを体験する** | [オンラインデモ](https://gsvegetable.github.io/pixel-daylight-switch/) |
| **パラメーターを調整する** | [Playground](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) |
| **コンポーネントのプレビューを見る** | [Preview](https://gsvegetable.github.io/pixel-daylight-switch/preview.html) |
| **自分のサイトに埋め込む** | [embed.js](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/embed.js) |
| **npm からインストールする** | [npm パッケージ](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable) · `npm install pixel-daylight-switch-gsvegetable` |
| **コア実装を読む** | [app.js](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/app.js) · [style.css](https://github.com/GSvegetable/pixel-daylight-switch/blob/main/style.css) |
| **モバイルビルドを確認する** | [ビルド情報](builds/README.md) |
| **変更履歴を見る** | [CHANGELOG](CHANGELOG.md) |
| **自動テストの結果を見る** | [Quality checks](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/ci.yml) |
| **Android / iOS のビルド状況を見る** | [Native mobile builds](https://github.com/GSvegetable/pixel-daylight-switch/actions/workflows/mobile-build.yml) |
| **不具合報告・機能提案をする** | [Issue を作成](https://github.com/GSvegetable/pixel-daylight-switch/issues/new/choose) |
| **ライセンスを確認する** | [Unlicense](LICENSE) |

**よく使う入口：** [デモ](https://gsvegetable.github.io/pixel-daylight-switch/) · [パラメーター調整](https://gsvegetable.github.io/pixel-daylight-switch/playground.html) · [npm](https://www.npmjs.com/package/pixel-daylight-switch-gsvegetable)

### ライセンス

本プロジェクトは **[Unlicense](https://unlicense.org/)** に基づき公開されています。個人利用・商用利用を問わず、帰属表示なしで自由にコピー、変更、公開、配布、利用できます。無保証で提供されます。詳細は [LICENSE](LICENSE) を参照してください。
