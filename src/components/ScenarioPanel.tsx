import React from 'react';

interface Scenario {
  id: string;
  name: string;
  description: string;
}

interface ScenarioPanelProps {
  scenarios: Scenario[];
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ scenarios, selected, onSelect, onClose }) => (
  <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl">×</button>
      <h2 className="text-2xl font-bold mb-4 text-purple-700">בחר תרחיש</h2>
      <ul className="space-y-3">
        {scenarios.map(s => (
          <li key={s.id}>
            <button
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selected === s.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-400'}`}
              onClick={() => onSelect(s.id)}
            >
              <div className="font-semibold text-lg text-purple-800">{s.name}</div>
              <div className="text-sm text-gray-600">{s.description}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
); 