---
name: subtitles
description: Remotionでのキャプション・字幕のルール
metadata:
  tags: subtitles, captions, remotion, json
---

すべてのキャプションはJSONで処理しなければなりません。キャプションには `@remotion/captions` の `Caption` 型を使ってください：

```ts
import type { Caption } from "@remotion/captions";
```

型の定義：

```ts
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
```

## キャプションの生成方法

動画・音声ファイルを文字起こししてキャプションを生成するには、`@remotion/captions` パッケージを使います：

```bash
npx remotion add @remotion/captions
```

## キャプションの表示

キャプションを動画内に表示するには、`@remotion/captions` の `Subtitles` コンポーネントを使います：

```tsx
import { Subtitles } from "@remotion/captions";

export const MyComposition = () => {
  const captions: Caption[] = [
    {
      text: "こんにちは",
      startMs: 0,
      endMs: 1000,
      timestampMs: null,
      confidence: null,
    },
  ];

  return (
    <Subtitles
      captions={captions}
      // Sequenceコンポーネントが自動的にタイミングを処理します
    />
  );
};
```

## .srtファイルからのインポート

.srtファイルからキャプションをインポートするには `parseSrt` を使います：

```ts
import { parseSrt } from "@remotion/captions";

const srtContent = `1
00:00:01,000 --> 00:00:02,000
Hello World`;

const captions = parseSrt({ input: srtContent });
```
