import React from 'react';
import type { TypeDefinition } from '../types';

interface ResultCardProps {
    result: TypeDefinition;
    onRetry: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onRetry }) => {
    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 animate-fade-in-up">
            <div className={`${result.imageColor} h-32 flex items-center justify-center`}>
                <h2 className="text-4xl px-4 text-white font-bold drop-shadow-md text-center">
                    {result.id === 'preparation' && '🐢'}
                    {result.id === 'overthinking' && '🌀'}
                    {result.id === 'impulsive' && '🚀'}
                    {result.id === 'busy' && '🏃'}
                    {result.id === 'stable' && '🧸'}
                    {result.id === 'vigilant' && '👀'}
                </h2>
            </div>

            <div className="p-8 text-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                    あなたの行動タイプ
                </h3>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                    {result.name}
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                    {result.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                            <span className="bg-slate-200 p-1 rounded mr-2 text-xs">👀</span> 特徴
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {result.features.map((feature, idx) => (
                                <span key={idx} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-600">
                                    #{feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-3 flex items-center">
                            <span className="bg-indigo-200 p-1 rounded mr-2 text-xs">💡</span> アドバイス
                        </h4>
                        <p className="text-indigo-800 text-sm leading-relaxed">
                            {result.advice}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onRetry}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    もう一度診断する
                </button>
            </div>
        </div>
    );
};
