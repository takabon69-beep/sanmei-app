import React from 'react';
import type { Question, QuestionOption } from '../types';

interface QuestionCardProps {
    question: Question;
    onAnswer: (option: QuestionOption) => void;
    currentStep: number;
    totalSteps: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, currentStep, totalSteps }) => {
    // キーボード操作のサポート
    React.useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const key = event.key.toUpperCase();
            const optionIndex = key.charCodeAt(0) - 65; // A=0, B=1, ...

            if (optionIndex >= 0 && optionIndex < question.options.length) {
                onAnswer(question.options[optionIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [question, onAnswer]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Question {currentStep} / {totalSteps}
                </span>
                <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed text-center">
                    {question.text}
                </h2>

                <div className="space-y-4">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => onAnswer(option)}
                            className="w-full block bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group relative overflow-hidden"
                        >
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 font-bold text-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-200 group-hover:border-blue-600">
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="text-lg text-slate-700 group-hover:text-slate-900 font-medium text-center leading-relaxed">
                                    {option.label}
                                </span>
                            </div>
                            <span className="hidden md:inline-block text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                                Key: {String.fromCharCode(65 + index)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
