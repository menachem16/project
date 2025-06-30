import React from 'react';
import { Achievement } from '../types/game';

interface AchievementSummaryPanelProps {
  achievements: Achievement[];
  unlocked: string[];
  score: number;
  onClose: () => void;
}

export const AchievementSummaryPanel: React.FC<AchievementSummaryPanelProps> = ({ achievements, unlocked, score, onClose }) => (
  <div className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl">×</button>
      <h2 className="text-3xl font-bold mb-6 text-yellow-700 text-center">סיכום הישגים</h2>
      <div className="mb-4 text-center text-lg text-gray-700 font-semibold">
        ניקוד סופי: <span className="text-yellow-700">{score}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {achievements.map(a => (
          <li key={a.id}>
            <div className={`p-4 rounded-lg border-2 flex items-center gap-3 ${unlocked.includes(a.id) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-100 opacity-60'}`}>
              <span className="text-2xl">{unlocked.includes(a.id) ? '🏆' : '🔒'}</span>
              <div>
                <div className="font-semibold text-lg text-yellow-800">{a.name}</div>
                <div className="text-sm text-gray-600">{a.description}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center text-xl font-bold text-green-700 mb-4">כל הכבוד! הגעת לסיום התרחיש.</div>
      <div className="flex justify-center">
        <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-3 rounded-full shadow-lg font-bold text-lg">סגור</button>
      </div>
    </div>
  </div>
); 