---
name: text-animations
description: Remotionのテキストアニメーションパターン
metadata:
  tags: typography, text, typewriter, highlighter
---

## テキストアニメーション

`useCurrentFrame()` を使って文字単位の文字列スライスでタイプライターエフェクトを作成します。

## タイプライターエフェクト

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

export const Typewriter = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1秒あたり10文字のタイプライター速度
  const charsPerSecond = 10;
  const charsVisible = Math.floor((frame / fps) * charsPerSecond);
  const visibleText = text.slice(0, charsVisible);

  return (
    <div style={{ fontFamily: "monospace", fontSize: 40 }}>
      {visibleText}
      {/* カーソル点滅 */}
      {Math.floor(frame / 15) % 2 === 0 ? "|" : ""}
    </div>
  );
};
```

タイプライターエフェクトには必ず文字列スライスを使ってください。
文字ごとの透明度操作は使用禁止です。

## ワードハイライト

```tsx
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const WordHighlight = ({
  words,
  highlightIndex,
}: {
  words: string[];
  highlightIndex: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {words.map((word, i) => {
        // ハイライトがそのワードに来たときのアニメーション
        const highlightProgress = interpolate(
          frame,
          [(highlightIndex === i ? i : i + 1) * fps, (i + 1) * fps],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <span
            key={i}
            style={{
              backgroundColor: `rgba(255, 200, 0, ${
                i === highlightIndex ? highlightProgress : 0
              })`,
              padding: "0 4px",
              borderRadius: 4,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

## フェードインテキスト

```tsx
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const FadeInText = ({
  text,
  startFrame = 0,
}: {
  text: string;
  startFrame?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + fps * 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame,
    [startFrame, startFrame + fps * 0.5],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </div>
  );
};
```
