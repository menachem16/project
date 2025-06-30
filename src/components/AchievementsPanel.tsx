import React from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
}

interface AchievementsPanelProps {
  achievements: Achievement[];
  unlocked: string[];
  onClose: () => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements, unlocked, onClose }) => (
  <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl">×</button>
      <h2 className="text-2xl font-bold mb-4 text-yellow-600">הישגים</h2>
      <ul className="space-y-3">
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
    </div>
  </div>
); 