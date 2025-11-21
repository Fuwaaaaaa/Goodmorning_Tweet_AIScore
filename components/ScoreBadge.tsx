import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let colorClass = "text-red-500 border-red-500";
  if (score >= 90) colorClass = "text-emerald-400 border-emerald-400";
  else if (score >= 80) colorClass = "text-blue-400 border-blue-400";
  else if (score >= 70) colorClass = "text-yellow-400 border-yellow-400";
  else if (score >= 60) colorClass = "text-orange-400 border-orange-400";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${colorClass} bg-gray-800 shadow-lg`}>
        <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
        <span className="absolute bottom-4 text-[10px] uppercase tracking-widest text-gray-400">Score</span>
      </div>
    </div>
  );
};

export default ScoreBadge;
