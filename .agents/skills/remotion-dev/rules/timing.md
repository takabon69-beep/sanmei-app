---
name: timing
description: Remotionのタイミング — interpolate・Bézierイージング・スプリング
metadata:
  tags: easing, bezier, interpolation, spring, timing
---

`interpolate()` で明示的なフレーム範囲のモーションを駆動します。
タイミングをカスタマイズするには **`Easing.bezier`** を使ってください。
4つのパラメーターはCSSの `cubic-bezier(x1, y1, x2, y2)` と同じです。

シンプルな線形補間：

```ts title="100フレームで0から1へ"
import { interpolate } from "remotion";

const opacity = interpolate(frame, [0, 100], [0, 1]);
```

デフォルトでは値はクランプされないので、[0, 1]の範囲外に出ることがあります。
クランプするには：

```ts title="100フレームで0から1へ（クランプあり）"
const opacity = interpolate(frame, [0, 100], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});
```

## Bézierイージング

`interpolate` のオプションオブジェクト内で `Easing.bezier(x1, y1, x2, y2)` を使います。
カーブはCSSのアニメーションとトランジションと本質的に同一なので、Webや
デザイナースペックからタイミングを流用するのに便利です。

```ts
import { interpolate, Easing } from "remotion";

const opacity = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### すぐ使えるカーブ例

**1. シャープなUI入場（強いease-out、オーバーシュートなし）**

```tsx
const enter = interpolate(frame, [0, 45], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

**2. 編集的・スローフェード（バランスのとれたease-in-out）**

```tsx
const progress = interpolate(frame, [0, 90], [0, 1], {
  easing: Easing.bezier(0.45, 0, 0.55, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

**3. 遊び心のあるオーバーシュート（コントロールポイントのy > 1）**

```tsx
const pop = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

## プリセットイージング

```ts
import { interpolate, Easing } from "remotion";

const value1 = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.inOut(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

デフォルトは `Easing.linear`。

方向性：
- `Easing.in` — ゆっくり始まって加速
- `Easing.out` — 速く始まって減速
- `Easing.inOut`

名前付きカーブ（線形に近い順）：
- `Easing.quad`
- `Easing.cubic`（カスタムcubicが不要なときの良いデフォルト）
- `Easing.sin`
- `Easing.exp`
- `Easing.circle`

### 入場・退場アニメーションのイージング方向

入場アニメーションには `Easing.out`（速く始まって減速してその場に収まる）、
退場アニメーションには `Easing.in`（ゆっくり始まって加速して去る）を使います。
これは自然に感じます。デザインから特定のカーブが必要な場合は、
プリセットを積み重ねるよりも `Easing.bezier(...)` を一つ使うほうが良いです。

## インターポレーションの合成

複数のプロパティが同じタイミングを共有する場合（例：スライドインパネルと動画のシフト）、
各プロパティに完全なインターポレーションを重複させないでください。
代わりに正規化されたプログレス値（0〜1）を一つ作り、各プロパティをそこから導出します：

```tsx
const slideIn = interpolate(
  frame,
  [slideInStart, slideInStart + slideInDuration],
  [0, 1],
  {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  },
);
const slideOut = interpolate(
  frame,
  [slideOutStart, slideOutStart + slideOutDuration],
  [0, 1],
  { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" },
);
const progress = slideIn - slideOut;

// 同じプログレスから複数のプロパティを導出
const overlayX = interpolate(progress, [0, 1], [100, 0]);
const videoX = interpolate(progress, [0, 1], [0, -20]);
const opacity = interpolate(progress, [0, 1], [0, 1]);
```

重要なコンセプト：**タイミング**（いつ・どの速さで）と**マッピング**（どの値の間をアニメーション）を分離する。
