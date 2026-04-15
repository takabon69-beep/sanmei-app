---
name: assets
description: 画像・動画・音声・フォントのRemotionへのインポート
metadata:
  tags: assets, staticFile, images, fonts, public
---

# Remotionでのアセットのインポート

## publicフォルダ

アセットはプロジェクトルートの `public/` フォルダに配置してください。

## staticFile()の使用

`public/` フォルダのファイルを参照する際は必ず `staticFile()` を使用してください：

```tsx
import { Img, staticFile } from "remotion";

export const MyComposition = () => {
  return <Img src={staticFile("logo.png")} />;
};
```

この関数はサブディレクトリへのデプロイ時も正しく動作するエンコードされたURLを返します。

## コンポーネントとの使用

**画像：**

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("photo.png")} />;
```

**動画：**

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

<Video src={staticFile("clip.mp4")} />;
```

**音声：**

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

<Audio src={staticFile("music.mp3")} />;
```

**フォント：**

```tsx
import { staticFile } from "remotion";

const fontFamily = new FontFace("MyFont", `url(${staticFile("font.woff2")})`);
await fontFamily.load();
document.fonts.add(fontFamily);
```

## リモートURL

リモートURLは `staticFile()` なしで直接使用できます：

```tsx
<Img src="https://example.com/image.png" />
<Video src="https://remotion.media/video.mp4" />
```

## 重要事項

- Remotionのコンポーネント（`<Img>`、`<Video>`、`<Audio>`）はレンダリング前にアセットが完全に読み込まれることを保証します
- ファイル名の特殊文字（`#`、`?`、`&`）は自動的にエンコードされます
