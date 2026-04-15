---
name: videos
description: Remotionでの動画の埋め込み — トリミング・音量・速度・ループ・ピッチ
metadata:
  tags: video, media, trim, volume, speed, loop, pitch
---

# Remotionでの動画の使用

## 前提条件

まず @remotion/media パッケージをインストールしてください。
インストールされていない場合は以下のコマンドを使用します：

```bash
npx remotion add @remotion/media    # npmの場合
bunx remotion add @remotion/media   # bunの場合
yarn remotion add @remotion/media   # yarnの場合
pnpm exec remotion add @remotion/media  # pnpmの場合
```

`@remotion/media` の `<Video>` でコンポジションに動画を埋め込みます。

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Video src={staticFile("video.mp4")} />;
};
```

リモートURLも使用できます：

```tsx
<Video src="https://remotion.media/video.mp4" />
```

## トリミング

`trimBefore` と `trimAfter` で動画の一部を除去します。値はフレーム単位です。

```tsx
const { fps } = useVideoConfig();

return (
  <Video
    src={staticFile("video.mp4")}
    trimBefore={2 * fps} // 最初の2秒をスキップ
    trimAfter={10 * fps} // 10秒地点で終了
  />
);
```

## 遅延

`<Sequence>` でラップして表示タイミングを遅らせます：

```tsx
import { Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Sequence from={1 * fps}>
    <Video src={staticFile("video.mp4")} />
  </Sequence>
);
```

## サイズと位置

`style` プロップでサイズと位置を制御します：

```tsx
<Video
  src={staticFile("video.mp4")}
  style={{
    width: 500,
    height: 300,
    position: "absolute",
    top: 100,
    left: 50,
    objectFit: "cover",
  }}
/>
```

## 音量

静的な音量（0〜1）：

```tsx
<Video src={staticFile("video.mp4")} volume={0.5} />
```

ミュート：

```tsx
<Video src={staticFile("video.mp4")} muted />
```

## 速度

`playbackRate` で再生速度を変更します：

```tsx
<Video src={staticFile("video.mp4")} playbackRate={2} /> {/* 2倍速 */}
<Video src={staticFile("video.mp4")} playbackRate={0.5} /> {/* 0.5倍速 */}
```

逆再生はサポートされていません。

## ループ

`loop` で無限ループします：

```tsx
<Video src={staticFile("video.mp4")} loop />
```

## ピッチ

`toneFrequency` でスピードを変えずにピッチを調整します（0.01〜2）：

```tsx
<Video
  src={staticFile("video.mp4")}
  toneFrequency={1.5} // 高いピッチ
/>
<Video
  src={staticFile("video.mp4")}
  toneFrequency={0.8} // 低いピッチ
/>
```

ピッチシフトはサーバーサイドレンダリング時のみ機能します。Remotion StudioプレビューやPlayer内では機能しません。
