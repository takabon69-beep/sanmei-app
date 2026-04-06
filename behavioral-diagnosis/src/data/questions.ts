import type { Question, TypeDefinition, Big5Scores } from '../types';

export const questions: Question[] = [
    {
        id: 1,
        text: "新しいプロジェクトが始まるとき、まず何をしますか？",
        options: [
            { label: "とりあえずやってみる！", score: { extraversion: 2, openness: 2 } },
            { label: "計画を綿密に立てる", score: { conscientiousness: 3 } },
            { label: "リスクがないか心配になる", score: { neuroticism: 3 } },
            { label: "周りの意見を聞く", score: { agreeableness: 2 } },
        ]
    },
    {
        id: 2,
        text: "休日の過ごし方は？",
        options: [
            { label: "外に出かけて人に会う", score: { extraversion: 3 } },
            { label: "家でゆっくり本を読む", score: { openness: 1, extraversion: -1 } },
            { label: "溜まっていた家事を片付ける", score: { conscientiousness: 2 } },
            { label: "疲れて何もしないことが多い", score: { neuroticism: 1 } },
        ]
    },
    {
        id: 3,
        text: "急な予定変更があったとき、どう感じますか？",
        options: [
            { label: "ワクワクする", score: { openness: 3 } },
            { label: "イライラする", score: { neuroticism: 2, conscientiousness: 1 } },
            { label: "仕方ないと受け入れる", score: { agreeableness: 2 } },
            { label: "どうしようとパニックになる", score: { neuroticism: 3 } },
        ]
    },
    {
        id: 4,
        text: "チームでの作業中、意見が対立したら？",
        options: [
            { label: "自分の意見を主張する", score: { extraversion: 2, agreeableness: -1 } },
            { label: "相手に合わせる", score: { agreeableness: 3 } },
            { label: "論理的に解決策を探る", score: { conscientiousness: 2, openness: 1 } },
            { label: "気まずくて黙ってしまう", score: { neuroticism: 2, extraversion: -1 } },
        ]
    },
    {
        id: 5,
        text: "欲しいものを見つけたとき、どうしますか？",
        options: [
            { label: "即購入！", score: { extraversion: 2, conscientiousness: -2 } },
            { label: "口コミを徹底的に調べる", score: { conscientiousness: 2, neuroticism: 1 } },
            { label: "本当に必要か自問自答する", score: { conscientiousness: 1 } },
            { label: "誰かに相談する", score: { agreeableness: 2 } },
        ]
    },
    {
        id: 6,
        text: "将来について考えることは？",
        options: [
            { label: "いつも漠然とした不安がある", score: { neuroticism: 3 } },
            { label: "具体的な目標がある", score: { conscientiousness: 3 } },
            { label: "その時が楽しければいい", score: { openness: 2, conscientiousness: -1 } },
            { label: "周りの人と幸せに暮らしたい", score: { agreeableness: 3 } },
        ]
    },
    {
        id: 7,
        text: "新しい技術やトレンドには？",
        options: [
            { label: "すぐに飛びつく", score: { openness: 3, extraversion: 1 } },
            { label: "様子を見てから取り入れる", score: { conscientiousness: 1, neuroticism: 1 } },
            { label: "興味がない", score: { openness: -2 } },
            { label: "みんなが使っていれば使う", score: { agreeableness: 2 } },
        ]
    },
    // 追加質問
    {
        id: 8,
        text: "締め切りが近づいてきたとき、どういう状態ですか？",
        options: [
            { label: "すでに終わっている", score: { conscientiousness: 3 } },
            { label: "焦ってラストスパート", score: { openness: 1, conscientiousness: -1 } },
            { label: "プレッシャーで胃が痛い", score: { neuroticism: 3 } },
            { label: "誰かに助けを求める", score: { agreeableness: 2 } },
        ]
    },
    {
        id: 9,
        text: "パーティーや懇親会での振る舞いは？",
        options: [
            { label: "色々な人に話しかける", score: { extraversion: 3 } },
            { label: "知っている人と静かに過ごす", score: { extraversion: -1, openness: -1 } },
            { label: "運営や準備を手伝う", score: { conscientiousness: 2, agreeableness: 1 } },
            { label: "早く帰りたいと思う", score: { neuroticism: 1, extraversion: -1 } },
        ]
    },
    {
        id: 10,
        text: "毎日同じルーティンワークをすることは？",
        options: [
            { label: "安心する", score: { conscientiousness: 2, openness: -1 } },
            { label: "すぐに飽きてしまう", score: { openness: 3, conscientiousness: -1 } },
            { label: "効率化を工夫する", score: { conscientiousness: 1, openness: 1 } },
            { label: "苦ではない", score: { agreeableness: 1 } },
        ]
    },
    {
        id: 11,
        text: "失敗をしてしまったとき、どう切り替えますか？",
        options: [
            { label: "すぐに次の手を考える", score: { openness: 1, extraversion: 1 } },
            { label: "原因を分析する", score: { conscientiousness: 2 } },
            { label: "しばらく引きずる", score: { neuroticism: 3 } },
            { label: "周りに謝って回る", score: { agreeableness: 2, neuroticism: 1 } },
        ]
    },
    {
        id: 12,
        text: "困っている人を見かけたら？",
        options: [
            { label: "すぐに声をかける", score: { agreeableness: 3, extraversion: 1 } },
            { label: "状況を見てから判断する", score: { conscientiousness: 1, agreeableness: 1 } },
            { label: "関わるのが少し怖い", score: { neuroticism: 2 } },
            { label: "具体的な解決策を考える", score: { conscientiousness: 2 } },
        ]
    },
    {
        id: 13,
        text: "週末の予定の立て方は？",
        options: [
            { label: "分刻みで計画する", score: { conscientiousness: 3 } },
            { label: "その日の気分で決める", score: { openness: 2, conscientiousness: -1 } },
            { label: "友達からの誘いを待つ", score: { agreeableness: 1, extraversion: -1 } },
            { label: "家でゴロゴロする予定のみ", score: { openness: -1 } },
        ]
    },
    {
        id: 14,
        text: "新しいことを学ぶときの方法は？",
        options: [
            { label: "本を読んで体系的に学ぶ", score: { conscientiousness: 2, openness: 1 } },
            { label: "実践しながら覚える", score: { extraversion: 2, openness: 1 } },
            { label: "詳しい人に聞く", score: { agreeableness: 2, extraversion: 1 } },
            { label: "失敗しないよう慎重に進める", score: { neuroticism: 2, conscientiousness: 1 } },
        ]
    },
    {
        id: 15,
        text: "リスクのある大きなチャンスが巡ってきたら？",
        options: [
            { label: "迷わず飛び込む！", score: { extraversion: 3, openness: 2 } },
            { label: "成功確率を計算する", score: { conscientiousness: 3 } },
            { label: "失敗が怖くて断る", score: { neuroticism: 3 } },
            { label: "家族や友人に相談する", score: { agreeableness: 2 } },
        ]
    }
];

export const typeDefinitions: TypeDefinition[] = [
    {
        id: 'preparation',
        name: 'じっくり準備くん',
        description: '石橋を叩いて渡る慎重派。計画を立てるのは得意ですが、実行に移すまでに時間がかかることがあります。',
        features: ['計画的', '慎重', 'リスク回避'],
        advice: 'まずは「7割の完成度」で動き出してみましょう。完璧でなくても大丈夫です。',
        imageColor: 'bg-blue-500'
    },
    {
        id: 'overthinking',
        name: 'ぐるぐる考えさん',
        description: '物事を深く考えすぎてしまい、行動する前に疲れてしまうことがあります。内省的で感受性が豊かです。',
        features: ['思慮深い', '心配性', '内省的'],
        advice: '考えを紙に書き出してみましょう。頭の中が整理されると、第一歩が踏み出しやすくなります。',
        imageColor: 'bg-purple-500'
    },
    {
        id: 'impulsive',
        name: 'きもちまかせちゃん',
        description: '直感と感情で動くエネルギッシュなタイプ。行動力は抜群ですが、後先考えずに突っ走ることも。',
        features: ['行動力', '直感的', '楽観的'],
        advice: '動き出す前に「なぜ？」と一度だけ自問してみましょう。それだけで精度が上がります。',
        imageColor: 'bg-yellow-500'
    },
    {
        id: 'busy',
        name: 'やることいっぱいマン',
        description: '責任感が強く活発で、常に何かをしています。素晴らしい行動力ですが、抱え込みすぎてキャパオーバーになりがち。',
        features: ['責任感', '多忙', 'エネルギッシュ'],
        advice: '意識的に「やらないこと」を決めましょう。休息も立派な仕事の一部です。',
        imageColor: 'bg-red-500'
    },
    {
        id: 'stable',
        name: 'ぬくぬく現状さん',
        description: '変化よりも安定を好むタイプ。今の環境を大切にしますが、新しいチャンスを逃してしまうことも。',
        features: ['安定志向', '堅実', '保守的'],
        advice: '「小さな変化」を日常に取り入れてみましょう。いつもと違う道で帰るだけでもOKです。',
        imageColor: 'bg-green-500'
    },
    {
        id: 'vigilant',
        name: 'きょろきょろ見回りくん',
        description: '周りの空気を読むのが得意な協調性タイプ。ですが、他人の目を気にしすぎて自分のしたいことができないことも。',
        features: ['協調性', '気配り', '優柔不断'],
        advice: '「自分がどうしたいか」を主語にして考えてみましょう。あなたの意見も大切です。',
        imageColor: 'bg-teal-500'
    }
];

export const calculateType = (scores: Big5Scores): TypeDefinition => {
    // スコアに基づく判定ロジック
    // ここでは簡易的に、特徴的なスコアの組み合わせで判定します

    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;

    // 1. じっくり準備くん: 誠実性が高く、神経症的傾向もやや高い
    if (conscientiousness >= 4 && neuroticism >= 2) return typeDefinitions.find(t => t.id === 'preparation')!;

    // 2. ぐるぐる考えさん: 神経症的傾向が非常に高い
    if (neuroticism >= 6) return typeDefinitions.find(t => t.id === 'overthinking')!;

    // 4. やることいっぱいマン: 誠実性と外向性が共に高い
    if (conscientiousness >= 4 && extraversion >= 4) return typeDefinitions.find(t => t.id === 'busy')!;

    // 3. きもちまかせちゃん: 開放性と外向性が高い
    if (openness >= 4 && extraversion >= 2) return typeDefinitions.find(t => t.id === 'impulsive')!;

    // 6. きょろきょろ見回りくん: 協調性が高く、神経症的傾向もやや高い
    if (agreeableness >= 4 && neuroticism >= 2) return typeDefinitions.find(t => t.id === 'vigilant')!;

    // 5. ぬくぬく現状さん: 開放性が低く、協調性が高い（または消去法）
    if (openness <= 2 && agreeableness >= 2) return typeDefinitions.find(t => t.id === 'stable')!;

    // Fallback logic based on dominant trait if no specific combo is hit
    if (neuroticism > Math.max(openness, conscientiousness, extraversion, agreeableness)) return typeDefinitions.find(t => t.id === 'overthinking')!;
    if (extraversion > Math.max(openness, conscientiousness, neuroticism, agreeableness)) return typeDefinitions.find(t => t.id === 'impulsive')!;
    if (conscientiousness > Math.max(openness, extraversion, neuroticism, agreeableness)) return typeDefinitions.find(t => t.id === 'preparation')!;

    // Default
    return typeDefinitions.find(t => t.id === 'preparation')!;
};
