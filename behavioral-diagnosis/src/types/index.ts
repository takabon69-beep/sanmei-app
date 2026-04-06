export interface Big5Scores {
    openness: number;         // 開放性
    conscientiousness: number; // 誠実性
    extraversion: number;      // 外向性
    agreeableness: number;     // 協調性
    neuroticism: number;       // 神経症的傾向
}

export type PersonalityType =
    | 'preparation'   // じっくり準備くん
    | 'overthinking'  // ぐるぐる考えさん
    | 'impulsive'     // きもちまかせちゃん
    | 'busy'          // やることいっぱいマン
    | 'stable'        // ぬくぬく現状さん
    | 'vigilant';     // きょろきょろ見回りくん

export interface TypeDefinition {
    id: PersonalityType;
    name: string;
    description: string;
    features: string[]; // 特徴
    advice: string;     // アドバイス
    imageColor: string; // テーマカラー
}

export interface QuestionOption {
    label: string;
    score: Partial<Big5Scores>;
}

export interface Question {
    id: number;
    text: string;
    options: QuestionOption[];
}
