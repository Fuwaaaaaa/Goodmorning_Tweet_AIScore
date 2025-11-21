
import React, { useCallback, useState } from 'react';
import { UploadCloud, ImageIcon, Loader2, Candy, Scale, Flame } from 'lucide-react';
import { EvaluationMode } from '../types';

interface UploadViewProps {
  onImageSelected: (file: File) => void;
  isAnalyzing: boolean;
  mode: EvaluationMode;
  onModeChange: (mode: EvaluationMode) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onImageSelected, isAnalyzing, mode, onModeChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  }, [onImageSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full"></div>
          <Loader2 size={64} className="text-purple-400 animate-spin relative z-10" />
        </div>
        <h2 className="mt-8 text-2xl font-light text-white tracking-wide">AIが写真を分析中...</h2>
        <p className="mt-2 text-gray-400">
          {mode === EvaluationMode.SPICY ? '激辛審査員が目を光らせています...' : 
           mode === EvaluationMode.SWEET ? '良いところを一生懸命探しています...' : 
           '構図、光、色彩を確認しています'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      
      {/* Mode Selection */}
      <div className="mb-8">
        <p className="text-center text-gray-400 mb-4 text-sm font-medium tracking-widest">採点モードを選択</p>
        <div className="grid grid-cols-3 gap-4 p-1 bg-gray-800/50 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => onModeChange(EvaluationMode.SWEET)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
              ${mode === EvaluationMode.SWEET 
                ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 shadow-lg scale-105 border' 
                : 'hover:bg-gray-700/50 text-gray-500 border border-transparent'}
            `}
          >
            <Candy size={24} className="mb-2" />
            <span className="font-bold">甘口</span>
            <span className="text-[10px] mt-1 opacity-70">褒めて伸びる</span>
          </button>

          <button
            onClick={() => onModeChange(EvaluationMode.MEDIUM)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
              ${mode === EvaluationMode.MEDIUM 
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-lg scale-105 border' 
                : 'hover:bg-gray-700/50 text-gray-500 border border-transparent'}
            `}
          >
            <Scale size={24} className="mb-2" />
            <span className="font-bold">中辛</span>
            <span className="text-[10px] mt-1 opacity-70">プロの基準</span>
          </button>

          <button
            onClick={() => onModeChange(EvaluationMode.SPICY)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
              ${mode === EvaluationMode.SPICY 
                ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-lg scale-105 border' 
                : 'hover:bg-gray-700/50 text-gray-500 border border-transparent'}
            `}
          >
            <Flame size={24} className="mb-2" />
            <span className="font-bold">辛口</span>
            <span className="text-[10px] mt-1 opacity-70">強めのアメとムチ</span>
          </button>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-12
          transition-all duration-300 ease-out
          flex flex-col items-center justify-center text-center
          ${isDragging 
            ? 'border-purple-400 bg-purple-400/10 scale-102' 
            : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800/30'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="bg-gray-800 p-6 rounded-full mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
          <UploadCloud size={48} className="text-purple-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">写真をアップロード</h3>
        <p className="text-gray-400 mb-6 max-w-xs mx-auto">
          ドラッグ＆ドロップ、またはクリックして写真を選択してください
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
           <ImageIcon size={14} />
           JPG, PNG, WEBP supported
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <div className="text-2xl mb-2">🎨</div>
          <div className="font-bold text-sm text-gray-300">芸術的スコア</div>
          <div className="text-xs text-gray-500 mt-1">構図や美しさを数値化</div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <div className="text-2xl mb-2">💡</div>
          <div className="font-bold text-sm text-gray-300">改善アドバイス</div>
          <div className="text-xs text-gray-500 mt-1">次の一枚をもっと良く</div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-xl">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-bold text-sm text-gray-300">技術分析</div>
          <div className="text-xs text-gray-500 mt-1">設定や編集のコツ</div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
