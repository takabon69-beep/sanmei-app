---
name: animations
description: Remotionの基本アニメーションスキル
metadata:
  tags: animations, transitions, frames, useCurrentFrame
---

すべてのアニメーションは `useCurrentFrame()` フックで駆動しなければなりません。
アニメーションは秒単位で記述し、`useVideoConfig()` の `fps` 値を掛けてください。

イージングモーションには `interpolate` に明示的なフレーム範囲とイージング（特に `Easing.bezier`）を使うことを推奨します。
`Easing.bezier` はCSSの `cubic-bezier` と一致するため、Webのスペックやカーブエディタとタイミングを共有できます。
詳細は [timing](./timing.md) を参照してください。

```tsx
import { useCurrentFrame, Easing } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return <div style={{ opacity }}>Hello World!</div>;
};
```

**CSSのtransitionやanimationは禁止** — レンダリングが正しく行われません。
**TailwindのアニメーションクラスはNGです** — レンダリングが正しく行われません。
