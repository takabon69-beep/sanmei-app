---
name: transitions
description: TransitionSeriesを使ったRemotionのシーントランジションとオーバーレイ
metadata:
  tags: transitions, overlays, fade, slide, wipe, scenes
---

## TransitionSeries

`<TransitionSeries>` はシーンを並べ、その間の切り替えポイントを強化する2つの方法をサポートします：

- **トランジション**（`<TransitionSeries.Transition>`）— クロスフェード・スライド・ワイプなど。2つのシーンが同時に再生されるためタイムラインが短くなります。
- **オーバーレイ**（`<TransitionSeries.Overlay>`）— カットポイント上にエフェクト（ライトリークなど）をレンダーします。タイムラインは短くなりません。

子要素はabsoluteで配置されます。

## 前提条件

```bash
npx remotion add @remotion/transitions
```

## トランジションの例

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

## オーバーレイの例

```tsx
import { TransitionSeries } from "@remotion/transitions";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={20}>
    {/* 任意のReactコンポーネントをオーバーレイとして使用 */}
    <MyLightLeakEffect />
  </TransitionSeries.Overlay>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

## 使用可能なトランジション

```tsx
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
```

## 方向付きのスライドトランジション

```tsx
import { slide } from "@remotion/transitions/slide";

<TransitionSeries.Transition
  presentation={slide({ direction: "from-left" })}
  timing={linearTiming({ durationInFrames: 20 })}
/>;
```

方向：`"from-left"`・`"from-right"`・`"from-top"`・`"from-bottom"`

## タイミングオプション

```tsx
import { linearTiming, springTiming } from "@remotion/transitions";

// リニアタイミング（一定速度）
linearTiming({ durationInFrames: 20 });

// スプリングタイミング（有機的なモーション）
springTiming({ config: { damping: 200 }, durationInFrames: 25 });
```

## デュレーションの計算

トランジションは隣接するシーンを重複させるため、合計のコンポジション長はシーケンスのデュレーション合計より**短く**なります。
オーバーレイは合計デュレーションに**影響しません**。

例）2つの60フレームシーケンスと15フレームのトランジション：

- トランジションなし：`60 + 60 = 120`フレーム
- トランジションあり：`60 + 60 - 15 = 105`フレーム

### トランジションのデュレーション取得

```tsx
import { linearTiming, springTiming } from "@remotion/transitions";

const linearDuration = linearTiming({
  durationInFrames: 20,
}).getDurationInFrames({ fps: 30 });
// 20を返す

const springDuration = springTiming({
  config: { damping: 200 },
}).getDurationInFrames({ fps: 30 });
// スプリング物理に基づいて計算されたデュレーションを返す
```
