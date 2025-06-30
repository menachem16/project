import React, { useState } from 'react';
import { X, Eye, Search, Camera, Satellite, Users, FileText, Shield } from 'lucide-react';
import { GameState } from '../types/game';

interface IntelligencePanelProps {
  onClose: () => void;
  onOperation: (operation: any) => void;
  isDayMode: boolean;
  gameState: GameState;
}

const INTELLIGENCE_OPERATIONS = [
  {
    id: 'surveillance',
    name: 'מעקב ופיקוח',
    description: 'מעקב אחר פעילות אויב',
    icon: '👁️',
    duration: 2,
    cost: 1000000,
    successRate: 85
  },
  {
    id: 'infiltration',
    name: 'חדירה',
    description: 'חדירה למתקני אויב',
    icon: '🕵️',
    duration: 5,
    cost: 5000000,
    successRate: 60
  },
  {
    id: 'satellite_recon',
    name: 'סיור לוויני',
    description: 'צילום לוויני של מטרות',
    icon: '🛰️',
    duration: 1,
    cost: 2000000,
    successRate: 95
  },
  {
    id: 'signal_intercept',
    name: 'יירוט תקשורת',
    description: 'יירוט תקשורת אויב',
    icon: '📡',
    duration: 3,
    cost: 3000000,
    successRate: 75
  },
  {
    id: 'human_intel',
    name: 'מודיעין אנושי',
    description: 'גיוס מקורות אנושיים',
    icon: '👤',
    duration: 10,
    cost: 10000000,
    successRate: 40
  },
  {
    id: 'cyber_recon',
    name: 'סיור סייבר',
    description: 'חדירה למערכות מחשב',
    icon: '💻',
    duration: 4,
    cost: 4000000,
    successRate: 70
  }
];

const INTELLIGENCE_TARGETS = [
  { id: 'iran', name: 'איראן', priority: 'high', difficulty: 'very_high' },
  { id: 'syria', name: 'סוריה', priority: 'high', difficulty: 'high' },
  { id: 'lebanon', name: 'לבנון', priority: 'medium', difficulty: 'medium' },
  { id: 'gaza', name: 'עזה', priority: 'high', difficulty: 'low' },
  { id: 'turkey', name: 'טורקיה', priority: 'medium', difficulty: 'high' },
  { id: 'egypt', name: 'מצרים', priority: 'low', difficulty: 'medium' }
];

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  onClose,
  onOperation,
  isDayMode,
  gameState
}) => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [activeOperations, setActiveOperations] = useState<any[]>([]);

  const handleExecuteOperation = () => {
    if (!selectedOperation || !selectedTarget) {
      alert('יש לבחור מבצע ומטרה');
      return;
    }

    const operation = INTELLIGENCE_OPERATIONS.find(op => op.id === selectedOperation);
    const target = INTELLIGENCE_TARGETS.find(t => t.id === selectedTarget);
    
    if (!operation || !target) return;

    const newOperation = {
      id: Date.now(),
      type: operation.name,
      target: target.name,
      duration: operation.duration,
      startTime: new Date(),
      status: 'active'
    };

    setActiveOperations(prev => [...prev, newOperation]);
    onOperation(newOperation);

    // Simulate operation completion
    setTimeout(() => {
      setActiveOperations(prev => 
        prev.map(op => 
          op.id === newOperation.id 
            ? { ...op, status: 'completed', success: Math.random() < (operation.successRate / 100) }
            : op
        )
      );
    }, operation.duration * 1000);

    setSelectedOperation('');
    setSelectedTarget('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-indigo-500" />
              <h2 className={`text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מרכז מודיעין ומעקב
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDayMode 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'hover:bg-gray-700 text-gray-400'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operations Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              מבצעי מודיעין זמינים
            </h3>
            <div className="space-y-3">
              {INTELLIGENCE_OPERATIONS.map((operation) => (
                <button
                  key={operation.id}
                  onClick={() => setSelectedOperation(operation.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedOperation === operation.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{operation.icon}</span>
                    <span className={`font-bold ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {operation.name}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {operation.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>משך: {operation.duration} שניות</div>
                    <div>עלות: ${(operation.cost / 1000000).toFixed(1)}M</div>
                    <div>הצלחה: {operation.successRate}%</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              בחירת מטרה
            </h3>
            <div className="space-y-3 mb-6">
              {INTELLIGENCE_TARGETS.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTarget === target.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {target.name}
                    </span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        target.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        target.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {target.priority === 'high' ? 'עדיפות גבוהה' :
                         target.priority === 'medium' ? 'עדיפות בינונית' : 'עדיפות נמוכה'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        target.difficulty === 'very_high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        target.difficulty === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        target.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {target.difficulty === 'very_high' ? 'קשה מאוד' :
                         target.difficulty === 'high' ? 'קשה' :
                         target.difficulty === 'medium' ? 'בינוני' : 'קל'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteOperation}
              disabled={!selectedOperation || !selectedTarget}
              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedOperation && selectedTarget
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              🎯 בצע מבצע מודיעיני
            </button>
          </div>
        </div>

        {/* Active Operations */}
        {activeOperations.length > 0 && (
          <div className={`p-6 border-t ${
            isDayMode ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              מבצעים פעילים
            </h3>
            <div className="space-y-3">
              {activeOperations.map((operation) => (
                <div
                  key={operation.id}
                  className={`p-4 rounded-lg border ${
                    operation.status === 'active' 
                      ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                      : operation.success
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                        : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-bold ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {operation.type} - {operation.target}
                      </span>
                      <div className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        התחיל: {operation.startTime.toLocaleTimeString('he-IL')}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      operation.status === 'active' 
                        ? 'bg-blue-500 text-white animate-pulse'
                        : operation.success
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                    }`}>
                      {operation.status === 'active' ? '🔄 פעיל' :
                       operation.success ? '✅ הצליח' : '❌ נכשל'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Intelligence Summary */}
        <div className={`p-6 border-t ${
          isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-700'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDayMode ? 'text-gray-800' : 'text-white'
          }`}>
            סיכום מודיעיני
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-indigo-600' : 'text-indigo-400'
              }`}>
                {gameState.countries[gameState.currentPlayer]?.intelligence.agencies || 0}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                יכולת מודיעין
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-green-600' : 'text-green-400'
              }`}>
                {activeOperations.filter(op => op.status === 'active').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                מבצעים פעילים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-blue-600' : 'text-blue-400'
              }`}>
                {activeOperations.filter(op => op.success).length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                מבצעים מוצלחים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-purple-600' : 'text-purple-400'
              }`}>
                ${((gameState.countries[gameState.currentPlayer]?.intelligence.budget || 0) / 1000000000).toFixed(1)}B
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                תקציב מודיעין
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};