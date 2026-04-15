---
name: fonts
description: GoogleフォントとローカルフォントのRemotionへの読み込み
metadata:
  tags: fonts, google fonts, local fonts, font loading
---

# Remotionでフォントを使用する

## GoogleフォントのロードJSON方法（推奨）

`@remotion/google-fonts` パッケージを使ってGoogleフォントをロードできます：

```bash
npx remotion add @remotion/google-fonts
```

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const MyComposition = () => {
  return (
    <div style={{ fontFamily }}>
      Hello World
    </div>
  );
};
```

## ローカルフォントのロード

ローカルフォントファイルは `public/` フォルダに配置し、`staticFile()` を使ってロードします：

```tsx
import { staticFile } from "remotion";

// コンポジションの外でフォントをロード
const fontFamily = new FontFace(
  "MyCustomFont",
  `url(${staticFile("fonts/my-font.woff2")})`
);

// フォントをロードしてdocumentに追加
await fontFamily.load();
document.fonts.add(fontFamily);

export const MyComposition = () => {
  return (
    <div style={{ fontFamily: "MyCustomFont" }}>
      Hello World
    </div>
  );
};
```

## continueRender と delayRender を使ったフォントロード

非同期フォントロードをRemotionのレンダリングと確実に同期するために `continueRender` と `delayRender` を使用してください：

```tsx
import { continueRender, delayRender, staticFile } from "remotion";
import { useEffect, useState } from "react";

export const MyComposition = () => {
  const [handle] = useState(() => delayRender("フォントのロード中"));

  useEffect(() => {
    const fontFamily = new FontFace(
      "MyFont",
      `url(${staticFile("font.woff2")})`
    );
    fontFamily.load().then(() => {
      document.fonts.add(fontFamily);
      continueRender(handle);
    });
  }, [handle]);

  return <div style={{ fontFamily: "MyFont" }}>Hello</div>;
};
```

## 重要事項

- フォントはレンダリング前に必ずロードが完了している必要があります
- `delayRender` と `continueRender` でロードの完了を保証してください
- Google Fontsを使う場合は `@remotion/google-fonts` パッケージが最もシンプルです
