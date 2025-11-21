import React, { useState } from 'react';
import { AppState, AnalysisResult, EvaluationMode } from './types';
import { analyzePhoto, fileToBase64 } from './services/geminiService';
import UploadView from './components/UploadView';
import ResultView from './components/ResultView';
import { Aperture, Github } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<EvaluationMode>(EvaluationMode.MEDIUM);

  const handleImageSelected = async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      setError(null);

      // Convert file to display locally and send to API
      const base64Data = await fileToBase64(file);
      setImageSrc(URL.createObjectURL(file));
      
      // Call Gemini API with selected mode
      const analysis = await analyzePhoto(base64Data, file.type, mode);
      
      setResult(analysis);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("画像の分析中にエラーが発生しました。もう一度お試しください。");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setImageSrc(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-2 rounded-lg">
              <Aperture className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Photo<span className="text-purple-400">Mentor</span> AI
            </h1>
          </div>
          
          {/* Optional: Add link to repo or simple about */}
          <a href="#" className="text-gray-500 hover:text-white transition-colors">
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex flex-col items-center min-h-[calc(100vh-80px)]">
        
        {appState === AppState.ERROR && (
           <div className="w-full max-w-md bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-8 text-center">
             <p>{error}</p>
             <button 
               onClick={handleReset} 
               className="mt-2 text-sm font-bold underline hover:text-white"
             >
               やり直す
             </button>
           </div>
        )}

        {appState === AppState.IDLE || appState === AppState.ANALYZING ? (
          <div className="w-full">
            <div className="text-center mb-8 space-y-4">
               <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 pb-2">
                 あなたの写真を<br className="md:hidden" />プロ視点で評価
               </h2>
               <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                 Gemini 2.5 Flash モデルを使用して、構図・照明・ポーズ・衣装などを瞬時に分析。<br/>
                 甘口から辛口まで、あなたに合わせたアドバイスを提供します。
               </p>
            </div>
            <UploadView 
              onImageSelected={handleImageSelected} 
              isAnalyzing={appState === AppState.ANALYZING} 
              mode={mode}
              onModeChange={setMode}
            />
          </div>
        ) : (
          result && imageSrc && (
            <ResultView 
              result={result} 
              imageSrc={imageSrc} 
              onReset={handleReset} 
              mode={mode}
            />
          )
        )}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-600 text-sm">
        Powered by Gemini 2.5 Flash
      </footer>
    </div>
  );
};

export default App;