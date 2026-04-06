import { useState } from 'react';
import { QuestionCard } from './components/QuestionCard';
import { ResultCard } from './components/ResultCard';
import { questions, calculateType, typeDefinitions } from './data/questions';
import type { Big5Scores, PersonalityType, QuestionOption } from './types';

function App() {
  const [gameState, setGameState] = useState<'start' | 'quiz' | 'result'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Big5Scores>({
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  });
  const [resultType, setResultType] = useState<PersonalityType | null>(null);

  const startQuiz = () => {
    setGameState('quiz');
    setCurrentQuestionIndex(0);
    setScores({
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    });
    setResultType(null);
  };

  const handleAnswer = (option: QuestionOption) => {
    const newScores = { ...scores };

    // スコアの加算
    Object.entries(option.score).forEach(([key, value]) => {
      if (value) {
        newScores[key as keyof Big5Scores] += value;
      }
    });
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz(newScores);
    }
  };

  const finishQuiz = (finalScores: Big5Scores) => {
    const result = calculateType(finalScores);
    setResultType(result.id);
    setGameState('result');
  };

  const currentResult = resultType ? typeDefinitions.find(t => t.id === resultType) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <span className="bg-blue-600 text-white p-1 rounded mr-2 text-sm">LM</span>
            リードマインド行動タイプ診断
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {gameState === 'start' && (
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              あなたの<span className="text-blue-600">行動パターン</span>を<br />科学的に分析します。
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              簡単な質問に答えるだけで、あなたの行動傾向を診断します。
              自己理解を深め、次のアクションにつなげましょう。
            </p>
            <button
              onClick={startQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
            >
              診断を始める
            </button>
            <div className="mt-12 flex justify-center space-x-4 text-slate-400 text-sm">
              <span>⏱ 所要時間: 約1分</span>
              <span>📝 全{questions.length}問</span>
            </div>
          </div>
        )}

        {gameState === 'quiz' && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentStep={currentQuestionIndex + 1}
            totalSteps={questions.length}
          />
        )}

        {gameState === 'result' && currentResult && (
          <ResultCard
            result={currentResult}
            onRetry={startQuiz}
          />
        )}
      </main>

      <footer className="text-center py-6 text-slate-400 text-sm">
        © 2025 一般社団法人リードマインドジャパン
      </footer>
    </div>
  );
}

export default App;
