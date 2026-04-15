---
name: images
description: RemotionのImgコンポーネントを使った画像の埋め込み
metadata:
  tags: images, img, staticFile, png, jpg, svg, webp
---

# Remotionでの画像の使用

## `<Img>` コンポーネント

画像を表示するには常に `remotion` の `<Img>` コンポーネントを使用してください：

```tsx
import { Img, staticFile } from "remotion";

export const MyComposition = () => {
  return <Img src={staticFile("photo.png")} />;
};
```

## 重要な制限

**`remotion` の `<Img>` コンポーネントを必ず使ってください。** 以下は使用禁止：

- ネイティブHTMLの `<img>` 要素
- Next.jsの `<Image>` コンポーネント
- CSSの `background-image`

`<Img>` コンポーネントはレンダリング前に画像が完全にロードされることを保証し、動画エクスポート時のちらつきや空白フレームを防ぎます。

## staticFile()を使ったローカル画像

画像を `public/` フォルダに置いて `staticFile()` で参照します：

```
my-video/
├─ public/
│  ├─ logo.png
│  ├─ avatar.jpg
│  └─ icon.svg
├─ src/
├─ package.json
```

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("logo.png")} />;
```

## リモート画像

リモートURLは `staticFile()` なしで直接使用できます：

```tsx
<Img src="https://example.com/image.png" />
```

リモート画像にはCORSが有効になっていることを確認してください。
アニメーションGIFには `@remotion/gif` の `<Gif>` コンポーネントを使ってください。

## サイズと位置

`style` プロップでサイズと位置を制御します：

```tsx
<Img
  src={staticFile("photo.png")}
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

## 動的な画像パス

動的なファイル参照にはテンプレートリテラルを使います：

```tsx
import { Img, staticFile, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

// 画像シーケンス
<Img src={staticFile(`frames/frame${frame}.png`)} />

// Propsに基づく選択
<Img src={staticFile(`avatars/${props.userId}.png`)} />

// 条件付き画像
<Img src={staticFile(`icons/${isActive ? "active" : "inactive"}.svg`)} />
```

## 画像の寸法取得

`getImageDimensions()` で画像の寸法を取得できます：

```tsx
import { getImageDimensions, staticFile } from "remotion";

const { width, height } = await getImageDimensions(staticFile("photo.png"));
```
