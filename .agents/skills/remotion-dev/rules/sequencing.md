---
name: sequencing
description: Remotionのシーケンシングパターン — 遅延・トリミング・デュレーション制限
metadata:
  tags: sequence, series, timing, delay, trim
---

`<Sequence>` を使って要素がタイムラインに表示されるタイミングを遅らせます。

```tsx
import { Sequence } from "remotion";

const {fps} = useVideoConfig();

<Sequence from={1 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>
  <Title />
</Sequence>
<Sequence from={2 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>
  <Subtitle />
</Sequence>
```

デフォルトではコンポーネントはabsolute fillの要素でラップされます。
ラップしない場合は `layout` プロップを使います：

```tsx
<Sequence layout="none">
  <Title />
</Sequence>
```

## プリマウント

コンポーネントが実際に再生される前にタイムラインにロードします。
すべての `<Sequence>` は必ずプリマウントしてください！

```tsx
<Sequence premountFor={1 * fps}>
  <Title />
</Sequence>
```

## Series

要素を重複なく順番に再生する場合は `<Series>` を使います。

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={45}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <MainContent />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30}>
    <Outro />
  </Series.Sequence>
</Series>;
```

`<Sequence>` と同様、`<Series.Sequence>` もデフォルトでabsolute fillにラップされます。
`layout` プロップを `none` に設定することで無効化できます。

### オーバーラップするSeries

負のオフセットで重複するシーケンスを作ります：

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <SceneA />
  </Series.Sequence>
  <Series.Sequence offset={-15} durationInFrames={60}>
    {/* SceneAが終わる15フレーム前に開始 */}
    <SceneB />
  </Series.Sequence>
</Series>
```

## Sequence内のフレーム参照

Sequence内では `useCurrentFrame()` はローカルフレーム（0から始まる）を返します：

```tsx
<Sequence from={60} durationInFrames={30}>
  <MyComponent />
  {/* MyComponent内でuseCurrentFrame()は60-89ではなく0-29を返す */}
</Sequence>
```

## ネストされたSequence

複雑なタイミングのためにSequenceをネストできます：

```tsx
<Sequence from={0} durationInFrames={120}>
  <Background />
  <Sequence from={15} durationInFrames={90} layout="none">
    <Title />
  </Sequence>
  <Sequence from={45} durationInFrames={60} layout="none">
    <Subtitle />
  </Sequence>
</Sequence>
```
