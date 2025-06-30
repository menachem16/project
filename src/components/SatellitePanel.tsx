import React, { useState } from 'react';
import { X, Satellite, Camera, MapPin, Radar, Globe, Zap } from 'lucide-react';
import { GameState } from '../types/game';

interface SatellitePanelProps {
  onClose: () => void;
  onOperation: (operation: any) => void;
  isDayMode: boolean;
  gameState: GameState;
}

const SATELLITES = [
  {
    id: 'ofek_16',
    name: 'אופק 16',
    type: 'reconnaissance',
    status: 'active',
    orbit: 'low',
    capabilities: ['imaging', 'signals'],
    coverage: 'middle_east'
  },
  {
    id: 'amos_17',
    name: 'עמוס 17',
    type: 'communication',
    status: 'active',
    orbit: 'geostationary',
    capabilities: ['communication', 'internet'],
    coverage: 'global'
  },
  {
    id: 'tecsar',
    name: 'תקסר',
    type: 'radar',
    status: 'active',
    orbit: 'low',
    capabilities: ['radar', 'weather'],
    coverage: 'regional'
  },
  {
    id: 'shavit_next',
    name: 'שביט נקסט',
    type: 'experimental',
    status: 'standby',
    orbit: 'medium',
    capabilities: ['research', 'testing'],
    coverage: 'limited'
  }
];

const SATELLITE_OPERATIONS = [
  {
    id: 'high_res_imaging',
    name: 'צילום ברזולוציה גבוהה',
    description: 'צילום מפורט של מטרות',
    duration: 5,
    requiredSatellite: 'reconnaissance',
    cost: 100000
  },
  {
    id: 'real_time_monitoring',
    name: 'ניטור בזמן אמת',
    description: 'מעקב רציף אחר אזור',
    duration: 30,
    requiredSatellite: 'reconnaissance',
    cost: 500000
  },
  {
    id: 'communication_relay',
    name: 'ממסר תקשורת',
    description: 'העברת תקשורת מוצפנת',
    duration: 2,
    requiredSatellite: 'communication',
    cost: 50000
  },
  {
    id: 'radar_sweep',
    name: 'סריקת רדאר',
    description: 'זיהוי תנועה באזור',
    duration: 10,
    requiredSatellite: 'radar',
    cost: 200000
  },
  {
    id: 'weather_analysis',
    name: 'ניתוח מזג אוויר',
    description: 'תחזית מזג אוויר מדויקת',
    duration: 3,
    requiredSatellite: 'radar',
    cost: 30000
  }
];

const TARGET_AREAS = [
  { id: 'iran_nuclear', name: 'מתקנים גרעיניים איראן', priority: 'critical' },
  { id: 'syria_bases', name: 'בסיסים סוריים', priority: 'high' },
  { id: 'lebanon_south', name: 'דרום לבנון', priority: 'high' },
  { id: 'gaza_strip', name: 'רצועת עזה', priority: 'medium' },
  { id: 'sinai_peninsula', name: 'חצי האי סיני', priority: 'medium' },
  { id: 'red_sea', name: 'ים סוף', priority: 'low' }
];

export const SatellitePanel: React.FC<SatellitePanelProps> = ({
  onClose,
  onOperation,
  isDayMode,
  gameState
}) => {
  const [selectedSatellite, setSelectedSatellite] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [activeOperations, setActiveOperations] = useState<any[]>([]);

  const handleExecuteOperation = () => {
    if (!selectedSatellite || !selectedOperation || !selectedTarget) {
      alert('יש לבחור לוויין, פעולה ומטרה');
      return;
    }

    const satellite = SATELLITES.find(s => s.id === selectedSatellite);
    const operation = SATELLITE_OPERATIONS.find(op => op.id === selectedOperation);
    const target = TARGET_AREAS.find(t => t.id === selectedTarget);
    
    if (!satellite || !operation || !target) return;

    const newOperation = {
      id: Date.now(),
      satellite: satellite.name,
      operation: operation.name,
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
            ? { ...op, status: 'completed', success: Math.random() > 0.1 }
            : op
        )
      );
    }, operation.duration * 1000);

    setSelectedSatellite('');
    setSelectedOperation('');
    setSelectedTarget('');
  };

  const availableOperations = SATELLITE_OPERATIONS.filter(op => {
    if (!selectedSatellite) return true;
    const satellite = SATELLITES.find(s => s.id === selectedSatellite);
    return satellite && satellite.type === op.requiredSatellite;
  });

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="w-6 h-6 md:w-8 md:h-8 text-teal-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מערכות לוויין ומעקב
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
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Satellite Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              לוויינים זמינים
            </h3>
            <div className="space-y-3">
              {SATELLITES.map((satellite) => (
                <button
                  key={satellite.id}
                  onClick={() => setSelectedSatellite(satellite.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSatellite === satellite.id
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Satellite className="w-6 h-6 text-teal-500" />
                    <div className="flex-1">
                      <span className={`font-bold block ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {satellite.name}
                      </span>
                      <span className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {satellite.type === 'reconnaissance' ? 'סיור' :
                         satellite.type === 'communication' ? 'תקשורת' :
                         satellite.type === 'radar' ? 'רדאר' : 'ניסיוני'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        satellite.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {satellite.status === 'active' ? 'פעיל' : 'המתנה'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        satellite.orbit === 'low' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        satellite.orbit === 'geostationary' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      }`}>
                        {satellite.orbit === 'low' ? 'מסלול נמוך' :
                         satellite.orbit === 'geostationary' ? 'גיאוסטציונרי' : 'מסלול בינוני'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    יכולות: {satellite.capabilities.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Operation Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              פעולות זמינות
            </h3>
            <div className="space-y-3">
              {availableOperations.map((operation) => (
                <button
                  key={operation.id}
                  onClick={() => setSelectedOperation(operation.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedOperation === operation.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {operation.id.includes('imaging') && <Camera className="w-5 h-5 text-blue-500" />}
                    {operation.id.includes('monitoring') && <Radar className="w-5 h-5 text-green-500" />}
                    {operation.id.includes('communication') && <Globe className="w-5 h-5 text-purple-500" />}
                    {operation.id.includes('radar') && <Zap className="w-5 h-5 text-orange-500" />}
                    {operation.id.includes('weather') && <MapPin className="w-5 h-5 text-teal-500" />}
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
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>משך: {operation.duration} שניות</div>
                    <div>עלות: ${(operation.cost / 1000).toFixed(0)}K</div>
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
              אזורי מטרה
            </h3>
            <div className="space-y-3 mb-6">
              {TARGET_AREAS.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedTarget === target.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {target.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      target.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      target.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      target.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {target.priority === 'critical' ? 'קריטי' :
                       target.priority === 'high' ? 'גבוה' :
                       target.priority === 'medium' ? 'בינוני' : 'נמוך'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteOperation}
              disabled={!selectedSatellite || !selectedOperation || !selectedTarget}
              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedSatellite && selectedOperation && selectedTarget
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              🛰️ הפעל לוויין
            </button>
          </div>
        </div>

        {/* Active Operations */}
        {activeOperations.length > 0 && (
          <div className={`p-4 md:p-6 border-t ${
            isDayMode ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              פעולות לוויין פעילות
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {operation.operation}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      operation.status === 'active' 
                        ? 'bg-blue-500 text-white animate-pulse'
                        : operation.success
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                    }`}>
                      {operation.status === 'active' ? '🛰️ פעיל' :
                       operation.success ? '✅ הושלם' : '❌ נכשל'}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    לוויין: {operation.satellite}
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

        {/* Satellite Status */}
        <div className={`p-4 md:p-6 border-t ${
          isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-700'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDayMode ? 'text-gray-800' : 'text-white'
          }`}>
            סטטוס מערכות לוויין
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-teal-600' : 'text-teal-400'
              }`}>
                {SATELLITES.filter(s => s.status === 'active').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                לוויינים פעילים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-blue-600' : 'text-blue-400'
              }`}>
                {activeOperations.filter(op => op.status === 'active').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                משימות פעילות
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-green-600' : 'text-green-400'
              }`}>
                {activeOperations.filter(op => op.success).length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                משימות מוצלחות
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-purple-600' : 'text-purple-400'
              }`}>
                100%
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                כיסוי אזורי
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};