import React from 'react';
import { X, Shield, Zap, Target, AlertTriangle } from 'lucide-react';

interface DefenseSystemPanelProps {
  onClose: () => void;
  defenseStatus: {
    ironDome: boolean;
    arrow3: boolean;
    davidSling: boolean;
  };
  onToggleSystem: (system: string) => void;
  threats: any[];
  onIntercept: (threatId: number) => void;
  isDayMode: boolean;
}

const DEFENSE_SYSTEMS = [
  {
    id: 'ironDome',
    name: 'כיפת ברזל',
    description: 'מערכת יירוט טילים קצרי טווח',
    range: '4-70 ק"מ',
    targets: 'רקטות, מרגמות',
    icon: '🛡️',
    color: 'blue'
  },
  {
    id: 'arrow3',
    name: 'חץ 3',
    description: 'מערכת יירוט טילים בליסטיים',
    range: '100-2400 ק"מ',
    targets: 'טילים בליסטיים',
    icon: '🏹',
    color: 'green'
  },
  {
    id: 'davidSling',
    name: 'קלע דוד',
    description: 'מערכת יירוט טווח בינוני',
    range: '40-300 ק"מ',
    targets: 'טילי שיוט, מטוסים',
    icon: '🎯',
    color: 'purple'
  }
];

export const DefenseSystemPanel: React.FC<DefenseSystemPanelProps> = ({
  onClose,
  defenseStatus,
  onToggleSystem,
  threats,
  onIntercept,
  isDayMode
}) => {
  const activeThreatCount = threats.filter(t => !t.intercepted).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <h2 className={`text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מערכות הגנה אווירית
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

        <div className="p-6 space-y-6">
          {/* Threat Status */}
          <div className={`p-4 rounded-lg ${
            activeThreatCount > 0 
              ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
          }`}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-6 h-6 ${
                activeThreatCount > 0 ? 'text-red-500' : 'text-green-500'
              }`} />
              <div>
                <h3 className={`font-bold ${
                  activeThreatCount > 0 
                    ? isDayMode ? 'text-red-800' : 'text-red-300'
                    : isDayMode ? 'text-green-800' : 'text-green-300'
                }`}>
                  {activeThreatCount > 0 
                    ? `${activeThreatCount} איומים פעילים זוהו`
                    : 'מרחב אווירי נקי'
                  }
                </h3>
                <p className={`text-sm ${
                  activeThreatCount > 0 
                    ? isDayMode ? 'text-red-600' : 'text-red-400'
                    : isDayMode ? 'text-green-600' : 'text-green-400'
                }`}>
                  {activeThreatCount > 0 
                    ? 'מערכות ההגנה במוכנות מלאה'
                    : 'כל המערכות פעילות ומוכנות'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Defense Systems */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              מערכות הגנה זמינות
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEFENSE_SYSTEMS.map((system) => {
                const isActive = defenseStatus[system.id as keyof typeof defenseStatus];
                return (
                  <div
                    key={system.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive
                        ? `border-${system.color}-500 bg-${system.color}-50 dark:bg-${system.color}-900/20`
                        : isDayMode
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-gray-600 bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{system.icon}</span>
                        <span className={`font-bold ${
                          isDayMode ? 'text-gray-800' : 'text-white'
                        }`}>
                          {system.name}
                        </span>
                      </div>
                      <button
                        onClick={() => onToggleSystem(system.id)}
                        className={`w-12 h-6 rounded-full transition-all ${
                          isActive
                            ? `bg-${system.color}-500`
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          isActive ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <p className={`text-sm mb-2 ${
                      isDayMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {system.description}
                    </p>
                    
                    <div className="space-y-1 text-xs">
                      <div className={`${
                        isDayMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        טווח: {system.range}
                      </div>
                      <div className={`${
                        isDayMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        יעדים: {system.targets}
                      </div>
                    </div>

                    <div className={`mt-3 text-center ${
                      isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="font-medium">
                        {isActive ? '🟢 פעיל' : '🔴 לא פעיל'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Threats */}
          {threats.filter(t => !t.intercepted).length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                איומים פעילים
              </h3>
              <div className="space-y-3">
                {threats.filter(t => !t.intercepted).map((threat) => (
                  <div
                    key={threat.id}
                    className={`p-4 rounded-lg border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-red-500" />
                        <div>
                          <span className={`font-medium ${
                            isDayMode ? 'text-red-800' : 'text-red-300'
                          }`}>
                            {threat.type === 'missile' ? 'טיל' : 
                             threat.type === 'rocket' ? 'רקטה' :
                             threat.type === 'drone' ? 'כטב"ם' : 'סייבר'}
                          </span>
                          <span className={`ml-2 text-sm ${
                            isDayMode ? 'text-red-600' : 'text-red-400'
                          }`}>
                            מ{threat.source}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onIntercept(threat.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        יירט
                      </button>
                    </div>
                    <div className={`mt-2 text-xs ${
                      isDayMode ? 'text-red-500' : 'text-red-400'
                    }`}>
                      זוהה: {threat.timestamp.toLocaleTimeString('he-IL')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Statistics */}
          <div className={`p-4 rounded-lg ${
            isDayMode ? 'bg-gray-50' : 'bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              סטטיסטיקות מערכת
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-green-600' : 'text-green-400'
                }`}>
                  {threats.filter(t => t.intercepted).length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  יירוטים מוצלחים
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-red-600' : 'text-red-400'
                }`}>
                  {threats.filter(t => !t.intercepted).length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  איומים פעילים
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {Object.values(defenseStatus).filter(Boolean).length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  מערכות פעילות
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-purple-600' : 'text-purple-400'
                }`}>
                  {threats.length > 0 ? Math.round((threats.filter(t => t.intercepted).length / threats.length) * 100) : 0}%
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  אחוז הצלחה
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};