---
name: audio
description: Remotionでの音声の使用 — インポート・トリミング・音量・速度・ピッチ
metadata:
  tags: audio, media, trim, volume, speed, loop, pitch, mute, sound, sfx
---

# Remotionでの音声の使用

## 前提条件

まず @remotion/media パッケージをインストールしてください。
インストールされていない場合は以下のコマンドを使用します：

```bash
npx remotion add @remotion/media
```

## 音声のインポート

`@remotion/media` の `<Audio>` を使ってコンポジションに音声を追加します。

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Audio src={staticFile("audio.mp3")} />;
};
```

リモートURLも使用できます：

```tsx
<Audio src="https://remotion.media/audio.mp3" />
```

デフォルトでは音声は最初からフルボリュームで全長再生されます。
複数の `<Audio>` コンポーネントを追加することで複数の音声トラックを重ねることができます。

## トリミング

`trimBefore` と `trimAfter` で音声の一部を除去します。値はフレーム単位です。

```tsx
const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    trimBefore={2 * fps} // 最初の2秒をスキップ
    trimAfter={10 * fps} // 10秒地点で終了
  />
);
```

## 遅延

`<Sequence>` でラップして開始タイミングを遅らせます：

```tsx
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Sequence from={1 * fps}>
    <Audio src={staticFile("audio.mp3")} />
  </Sequence>
);
```

## 音量

静的な音量（0〜1）を設定：

```tsx
<Audio src={staticFile("audio.mp3")} volume={0.5} />
```

現在のフレームに基づく動的な音量：

```tsx
import { interpolate } from "remotion";

const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    volume={(f) =>
      interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })
    }
  />
);
```

`f` の値は音声の再生開始時に0から始まり、コンポジションのフレームではありません。

## ミュート

動的に設定可能な `muted` プロップを使って音声をミュートします：

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    muted={frame >= 2 * fps && frame <= 4 * fps} // 2秒〜4秒の間をミュート
  />
);
```

## 速度

`playbackRate` で再生速度を変更します：

```tsx
<Audio src={staticFile("audio.mp3")} playbackRate={2} /> {/* 2倍速 */}
<Audio src={staticFile("audio.mp3")} playbackRate={0.5} /> {/* 0.5倍速 */}
```

逆再生はサポートされていません。

## ループ

`loop` で無限ループします：

```tsx
<Audio src={staticFile("audio.mp3")} loop />
```

## ピッチ

`toneFrequency` でスピードを変えずにピッチを調整します（0.01〜2）：

```tsx
<Audio
  src={staticFile("audio.mp3")}
  toneFrequency={1.5} // 高いピッチ
/>
<Audio
  src={staticFile("audio.mp3")}
  toneFrequency={0.8} // 低いピッチ
/>
```

ピッチシフトはサーバーサイドレンダリング時のみ機能します。Remotion StudioプレビューやPlayer内では機能しません。
