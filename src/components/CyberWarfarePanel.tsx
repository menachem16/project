import React, { useState } from 'react';
import { X, Zap, Shield, Wifi, Database, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { GameState } from '../types/game';

interface CyberWarfarePanelProps {
  onClose: () => void;
  onOperation: (operation: any) => void;
  isDayMode: boolean;
  gameState: GameState;
}

const CYBER_OPERATIONS = [
  {
    id: 'ddos_attack',
    name: 'התקפת DDoS',
    description: 'השבתת שירותים ברשת',
    icon: '⚡',
    duration: 3,
    cost: 500000,
    successRate: 80,
    type: 'offensive'
  },
  {
    id: 'data_breach',
    name: 'פריצת מידע',
    description: 'גניבת מידע רגיש',
    icon: '🔓',
    duration: 8,
    cost: 2000000,
    successRate: 60,
    type: 'offensive'
  },
  {
    id: 'infrastructure_hack',
    name: 'פריצת תשתיות',
    description: 'השבתת תשתיות קריטיות',
    icon: '🏭',
    duration: 12,
    cost: 5000000,
    successRate: 40,
    type: 'offensive'
  },
  {
    id: 'malware_deployment',
    name: 'פריסת תוכנה זדונית',
    description: 'הטמעת וירוסים במערכות',
    icon: '🦠',
    duration: 6,
    cost: 1500000,
    successRate: 70,
    type: 'offensive'
  },
  {
    id: 'firewall_upgrade',
    name: 'שדרוג חומת אש',
    description: 'חיזוק הגנות סייבר',
    icon: '🛡️',
    duration: 4,
    cost: 1000000,
    successRate: 95,
    type: 'defensive'
  },
  {
    id: 'intrusion_detection',
    name: 'זיהוי חדירות',
    description: 'מערכת זיהוי התקפות',
    icon: '🔍',
    duration: 2,
    cost: 800000,
    successRate: 90,
    type: 'defensive'
  }
];

const CYBER_TARGETS = [
  { 
    id: 'power_grid', 
    name: 'רשת החשמל', 
    vulnerability: 'medium',
    impact: 'critical',
    icon: '⚡'
  },
  { 
    id: 'banking_system', 
    name: 'מערכת בנקאית', 
    vulnerability: 'low',
    impact: 'high',
    icon: '🏦'
  },
  { 
    id: 'military_networks', 
    name: 'רשתות צבאיות', 
    vulnerability: 'very_low',
    impact: 'critical',
    icon: '🎖️'
  },
  { 
    id: 'government_systems', 
    name: 'מערכות ממשלתיות', 
    vulnerability: 'low',
    impact: 'high',
    icon: '🏛️'
  },
  { 
    id: 'communication_networks', 
    name: 'רשתות תקשורת', 
    vulnerability: 'medium',
    impact: 'high',
    icon: '📡'
  },
  { 
    id: 'water_systems', 
    name: 'מערכות מים', 
    vulnerability: 'high',
    impact: 'critical',
    icon: '💧'
  }
];

const ENEMY_COUNTRIES = [
  { id: 'iran', name: 'איראן', cyberCapability: 'high' },
  { id: 'syria', name: 'סוריה', cyberCapability: 'medium' },
  { id: 'lebanon', name: 'לבנון', cyberCapability: 'low' },
  { id: 'turkey', name: 'טורקיה', cyberCapability: 'high' }
];

export const CyberWarfarePanel: React.FC<CyberWarfarePanelProps> = ({
  onClose,
  onOperation,
  isDayMode,
  gameState
}) => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [activeOperations, setActiveOperations] = useState<any[]>([]);
  const [cyberThreats, setCyberThreats] = useState<any[]>([]);

  // Generate random cyber threats
  React.useEffect(() => {
    const generateThreat = () => {
      const threat = {
        id: Date.now(),
        source: ENEMY_COUNTRIES[Math.floor(Math.random() * ENEMY_COUNTRIES.length)],
        target: CYBER_TARGETS[Math.floor(Math.random() * CYBER_TARGETS.length)],
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        timestamp: new Date(),
        blocked: false
      };
      
      setCyberThreats(prev => [...prev, threat].slice(-10));
    };

    const interval = setInterval(generateThreat, Math.random() * 30000 + 15000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteOperation = () => {
    if (!selectedOperation) {
      alert('יש לבחור מבצע');
      return;
    }

    const operation = CYBER_OPERATIONS.find(op => op.id === selectedOperation);
    if (!operation) return;

    // For offensive operations, require target and country
    if (operation.type === 'offensive' && (!selectedTarget || !selectedCountry)) {
      alert('יש לבחור מטרה ומדינה למבצע התקפי');
      return;
    }

    const newOperation = {
      id: Date.now(),
      type: operation.name,
      target: operation.type === 'offensive' ? `${selectedTarget} - ${selectedCountry}` : 'מערכות פנימיות',
      duration: operation.duration,
      startTime: new Date(),
      status: 'active',
      operationType: operation.type
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
    setSelectedCountry('');
  };

  const blockThreat = (threatId: number) => {
    setCyberThreats(prev => 
      prev.map(threat => 
        threat.id === threatId ? { ...threat, blocked: true } : threat
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-green-500" />
              <h2 className={`text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מרכז לוחמה סייברנטית
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

        <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Operations Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              מבצעי סייבר
            </h3>
            <div className="space-y-3">
              {CYBER_OPERATIONS.map((operation) => (
                <button
                  key={operation.id}
                  onClick={() => setSelectedOperation(operation.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedOperation === operation.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{operation.icon}</span>
                    <div>
                      <span className={`font-bold block ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {operation.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        operation.type === 'offensive' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {operation.type === 'offensive' ? 'התקפי' : 'הגנתי'}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {operation.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>משך: {operation.duration}ש</div>
                    <div>עלות: ${(operation.cost / 1000000).toFixed(1)}M</div>
                    <div>הצלחה: {operation.successRate}%</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target & Country Selection */}
          <div>
            {selectedOperation && CYBER_OPERATIONS.find(op => op.id === selectedOperation)?.type === 'offensive' && (
              <>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  בחירת מטרה
                </h3>
                <div className="space-y-3 mb-6">
                  {CYBER_TARGETS.map((target) => (
                    <button
                      key={target.id}
                      onClick={() => setSelectedTarget(target.name)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedTarget === target.name
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : isDayMode
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{target.icon}</span>
                        <div className="flex-1">
                          <span className={`font-medium block ${
                            isDayMode ? 'text-gray-800' : 'text-white'
                          }`}>
                            {target.name}
                          </span>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              target.vulnerability === 'very_low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              target.vulnerability === 'low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              target.vulnerability === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              פגיעות: {target.vulnerability === 'very_low' ? 'נמוכה מאוד' :
                                      target.vulnerability === 'low' ? 'נמוכה' :
                                      target.vulnerability === 'medium' ? 'בינונית' : 'גבוהה'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              target.impact === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                            }`}>
                              השפעה: {target.impact === 'critical' ? 'קריטית' : 'גבוהה'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <h3 className={`text-lg font-semibold mb-4 ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  בחירת מדינת יעד
                </h3>
                <div className="space-y-3 mb-6">
                  {ENEMY_COUNTRIES.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => setSelectedCountry(country.name)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedCountry === country.name
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : isDayMode
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          isDayMode ? 'text-gray-800' : 'text-white'
                        }`}>
                          {country.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          country.cyberCapability === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          country.cyberCapability === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          יכולת סייבר: {country.cyberCapability === 'high' ? 'גבוהה' :
                                        country.cyberCapability === 'medium' ? 'בינונית' : 'נמוכה'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Execute Button */}
            <button
              onClick={handleExecuteOperation}
              disabled={!selectedOperation}
              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedOperation
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              ⚡ בצע מבצע סייבר
            </button>
          </div>

          {/* Cyber Threats Monitor */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              איומי סייבר פעילים
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cyberThreats.filter(t => !t.blocked).map((threat) => (
                <div
                  key={threat.id}
                  className={`p-3 rounded-lg border-2 ${
                    threat.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                    threat.severity === 'medium' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800' :
                    'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${
                        threat.severity === 'high' ? 'text-red-500' :
                        threat.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                      }`} />
                      <span className={`font-medium ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {threat.source.name} → {threat.target.name}
                      </span>
                    </div>
                    <button
                      onClick={() => blockThreat(threat.id)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      חסום
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    זוהה: {threat.timestamp.toLocaleTimeString('he-IL')}
                  </div>
                </div>
              ))}
              
              {cyberThreats.filter(t => !t.blocked).length === 0 && (
                <div className={`text-center py-8 ${
                  isDayMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>אין איומי סייבר פעילים</p>
                </div>
              )}
            </div>
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
              מבצעי סייבר פעילים
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {operation.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      operation.status === 'active' 
                        ? 'bg-blue-500 text-white animate-pulse'
                        : operation.success
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                    }`}>
                      {operation.status === 'active' ? '🔄 פעיל' :
                       operation.success ? '✅ הצליח' : '❌ נכשל'}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    מטרה: {operation.target}
                  </div>
                  <div className={`text-xs ${
                    isDayMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    התחיל: {operation.startTime.toLocaleTimeString('he-IL')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cyber Defense Status */}
        <div className={`p-6 border-t ${
          isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-700'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDayMode ? 'text-gray-800' : 'text-white'
          }`}>
            מצב הגנת סייבר
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-green-600' : 'text-green-400'
              }`}>
                {gameState.countries[gameState.currentPlayer]?.intelligence.capabilities.cyber || 0}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                יכולת סייבר
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-blue-600' : 'text-blue-400'
              }`}>
                {cyberThreats.filter(t => t.blocked).length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                איומים חסומים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-orange-600' : 'text-orange-400'
              }`}>
                {cyberThreats.filter(t => !t.blocked).length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                איומים פעילים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-purple-600' : 'text-purple-400'
              }`}>
                {activeOperations.filter(op => op.operationType === 'offensive').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                מבצעים התקפיים
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};