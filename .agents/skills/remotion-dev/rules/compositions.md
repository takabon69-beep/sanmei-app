---
name: compositions
description: コンポジション・Still・フォルダ・デフォルトPropsとダイナミックメタデータの定義
metadata:
  tags: composition, still, folder, props, metadata
---

`<Composition>` はレンダリング可能な動画のコンポーネント・幅・高さ・fps・デュレーションを定義します。

通常は `src/Root.tsx` に配置します。

```tsx
import { Composition } from "remotion";
import { MyComposition } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
    />
  );
};
```

## デフォルトProps

`defaultProps` でコンポーネントの初期値を指定します。
値はJSONシリアライズ可能でなければなりません（`Date`・`Map`・`Set`・`staticFile()` はサポート済み）。

```tsx
import { Composition } from "remotion";
import { MyComposition, MyCompositionProps } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={
        {
          title: "Hello World",
          color: "#ff0000",
        } satisfies MyCompositionProps
      }
    />
  );
};
```

`defaultProps` の型安全性のため、Propsには `interface` ではなく `type` 宣言を使ってください。

## フォルダ

`<Folder>` でサイドバーのコンポジションを整理します。
フォルダ名には英数字とハイフンのみ使用可能です。

```tsx
import { Composition, Folder } from "remotion";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Marketing">
        <Composition id="Promo" /* ... */ />
        <Composition id="Ad" /* ... */ />
      </Folder>
      <Folder name="Social">
        <Folder name="Instagram">
          <Composition id="Story" /* ... */ />
          <Composition id="Reel" /* ... */ />
        </Folder>
      </Folder>
    </>
  );
};
```

## Still

`<Still>` は単一フレームの画像に使います。`durationInFrames` や `fps` は不要です。

```tsx
import { Still } from "remotion";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot = () => {
  return (
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
  );
};
```

## calculateMetadata

`calculateMetadata` を使って寸法・デュレーション・Propsをデータに基づいて動的に設定します。

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";
import { MyComposition, MyCompositionProps } from "./MyComposition";

const calculateMetadata: CalculateMetadataFunction<
  MyCompositionProps
> = async ({ props, abortSignal }) => {
  const data = await fetch(`https://api.example.com/video/${props.videoId}`, {
    signal: abortSignal,
  }).then((res) => res.json());

  return {
    durationInFrames: Math.ceil(data.duration * 30),
    props: {
      ...props,
      videoUrl: data.url,
    },
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100} // プレースホルダー（上書きされる）
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ videoId: "abc123" }}
      calculateMetadata={calculateMetadata}
    />
  );
};
```

この関数は `props`・`durationInFrames`・`width`・`height`・`fps`・コーデック関連のデフォルト値を返すことができます。レンダリング開始前に一度実行されます。

## コンポジションのネスト

コンポジション内に別のコンポジションを入れるには、`<Sequence>` コンポーネントに `width` と `height` プロップを指定して使います。

```tsx
<AbsoluteFill>
  <Sequence width={COMPOSITION_WIDTH} height={COMPOSITION_HEIGHT}>
    <CompositionComponent />
  </Sequence>
</AbsoluteFill>
```
