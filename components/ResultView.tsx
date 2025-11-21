import React, { useMemo } from 'react';
import { AnalysisResult, EvaluationMode } from '../types';
import ScoreBadge from './ScoreBadge';
import { Camera, Palette, Lightbulb, CheckCircle, ArrowUpCircle, Aperture, User, Shirt, Flame, Candy, Scale } from 'lucide-react';

interface ResultViewProps {
  result: AnalysisResult;
  imageSrc: string;
  onReset: () => void;
  mode: EvaluationMode;
}

const ResultView: React.FC<ResultViewProps> = ({ result, imageSrc, onReset, mode }) => {

  // Sort categories by score descending
  const sortedCategories = useMemo(() => {
    const categories = [
      { 
        id: 'composition', 
        label: '構図・構成', 
        icon: Camera, 
        data: result.composition,
        colorClass: 'text-blue-400',
        bgClass: 'bg-blue-400/10 border-blue-400/30'
      },
      { 
        id: 'lighting', 
        label: '照明・光', 
        icon: Lightbulb, 
        data: result.lighting,
        colorClass: 'text-yellow-400',
        bgClass: 'bg-yellow-400/10 border-yellow-400/30'
      },
      { 
        id: 'color', 
        label: '色彩・トーン', 
        icon: Palette, 
        data: result.color,
        colorClass: 'text-pink-400',
        bgClass: 'bg-pink-400/10 border-pink-400/30'
      },
      { 
        id: 'pose', 
        label: 'ポーズ・配置', 
        icon: User, 
        data: result.pose,
        colorClass: 'text-purple-400',
        bgClass: 'bg-purple-400/10 border-purple-400/30'
      },
      { 
        id: 'costume', 
        label: '衣装・スタイリング', 
        icon: Shirt, 
        data: result.costume,
        colorClass: 'text-cyan-400',
        bgClass: 'bg-cyan-400/10 border-cyan-400/30'
      },
    ];

    return categories.sort((a, b) => b.data.score - a.data.score);
  }, [result]);

  const getModeBadge = () => {
    switch(mode) {
      case EvaluationMode.SPICY:
        return (
          <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
            <Flame size={12} /> 辛口 (Spicy)
          </div>
        );
      case EvaluationMode.SWEET:
        return (
          <div className="flex items-center gap-1 bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-xs font-bold border border-pink-500/50">
            <Candy size={12} /> 甘口 (Sweet)
          </div>
        );
      case EvaluationMode.MEDIUM:
      default:
        return (
          <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/50">
            <Scale size={12} /> 中辛 (Medium)
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-8 border border-gray-700">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Preview */}
          <div className="relative h-64 md:h-auto bg-black flex items-center justify-center overflow-hidden group">
            <img 
              src={imageSrc} 
              alt="Uploaded" 
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30 pointer-events-none" />
            
            {/* Mode Badge on Image (Mobile) */}
            <div className="absolute top-4 left-4 md:hidden">
              {getModeBadge()}
            </div>
          </div>

          {/* Main Score & Title */}
          <div className="p-8 flex flex-col justify-center items-center md:items-start relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
               <Camera size={120} />
             </div>
             
             {/* Mode Badge (Desktop) */}
             <div className="hidden md:block mb-4">
                {getModeBadge()}
             </div>

            <div className="flex flex-col md:flex-row items-center gap-6 w-full z-10">
              <ScoreBadge score={result.score} />
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{result.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Ranking Header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="h-px bg-gray-700 flex-1"></div>
        <span className="text-gray-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
          <ArrowUpCircle size={14} /> 評価ランキング
        </span>
        <div className="h-px bg-gray-700 flex-1"></div>
      </div>

      {/* Detailed Analysis Grid (Sorted) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {sortedCategories.map((cat, index) => (
          <div 
            key={cat.id} 
            className={`relative p-6 rounded-xl border ${cat.bgClass} backdrop-blur-sm transition-all hover:translate-y-[-2px]`}
          >
            {/* Ranking Badge */}
            <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gray-900 border flex items-center justify-center text-sm font-bold shadow-lg z-10 ${index === 0 ? 'border-yellow-500 text-yellow-400' : 'border-gray-600 text-gray-400'}`}>
              #{index + 1}
            </div>

            <div className="flex justify-between items-start mb-3">
              <div className={`flex items-center gap-3 ${cat.colorClass}`}>
                <cat.icon size={24} />
                <h3 className="font-bold text-lg">{cat.label}</h3>
              </div>
              <div className="text-2xl font-bold text-white">
                {cat.data.score}<span className="text-xs text-gray-500 ml-1">/100</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 h-1.5 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full ${cat.colorClass.replace('text-', 'bg-')}`} 
                style={{ width: `${cat.data.score}%` }}
              />
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">{cat.data.advice}</p>
          </div>
        ))}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Good Points */}
        <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <CheckCircle size={80} className="text-emerald-500" />
          </div>
          <h3 className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-4 relative z-10">
            <CheckCircle size={20} />
            良かった点
          </h3>
          <ul className="space-y-3 relative z-10">
            {result.strengths.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-orange-900/10 border border-orange-500/30 rounded-xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <ArrowUpCircle size={80} className="text-orange-500" />
          </div>
          <h3 className="flex items-center gap-2 text-orange-400 font-bold text-lg mb-4 relative z-10">
            <ArrowUpCircle size={20} />
            改善アドバイス
          </h3>
          <ul className="space-y-3 relative z-10">
            {result.improvements.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-orange-500 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Technical Advice Footer */}
      <div className="bg-gray-800/80 backdrop-blur p-6 rounded-xl border border-gray-700 flex items-start gap-4">
        <div className="bg-gray-700 p-3 rounded-full text-gray-300 shrink-0">
          <Aperture size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold mb-2">Pro Tip: テクニカルアドバイス</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{result.technical_advice}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/95 to-transparent p-6 flex justify-center z-50">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-white text-black rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Camera size={20} />
          新しい写真を評価する
        </button>
      </div>
    </div>
  );
};

export default ResultView;