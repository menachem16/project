import React, { useState } from 'react';
import { X, AlertTriangle, Filter, Clock, MapPin } from 'lucide-react';

interface ThreatMonitorProps {
  onClose: () => void;
  threats: any[];
  isDayMode: boolean;
}

export const ThreatMonitor: React.FC<ThreatMonitorProps> = ({
  onClose,
  threats,
  isDayMode
}) => {
  const [filter, setFilter] = useState('all');

  const filteredThreats = threats.filter(threat => {
    if (filter === 'all') return true;
    if (filter === 'active') return !threat.intercepted;
    if (filter === 'intercepted') return threat.intercepted;
    return threat.type === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'medium': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'low': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600';
    }
  };

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
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h2 className={`text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מוקד ניטור איומים
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

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              הכל ({threats.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-red-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              פעילים ({threats.filter(t => !t.intercepted).length})
            </button>
            <button
              onClick={() => setFilter('intercepted')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'intercepted'
                  ? 'bg-green-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              יורטו ({threats.filter(t => t.intercepted).length})
            </button>
            <button
              onClick={() => setFilter('missile')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'missile'
                  ? 'bg-purple-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              טילים ({threats.filter(t => t.type === 'missile').length})
            </button>
            <button
              onClick={() => setFilter('rocket')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rocket'
                  ? 'bg-orange-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              רקטות ({threats.filter(t => t.type === 'rocket').length})
            </button>
          </div>

          {/* Threat List */}
          <div className="space-y-4">
            {filteredThreats.length === 0 ? (
              <div className={`text-center py-8 ${
                isDayMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>אין איומים להצגה</p>
              </div>
            ) : (
              filteredThreats.map((threat) => (
                <div
                  key={threat.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityBg(threat.severity)} ${
                    threat.intercepted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          threat.intercepted ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                        }`} />
                        <span className={`font-bold text-lg ${
                          isDayMode ? 'text-gray-800' : 'text-white'
                        }`}>
                          {threat.type === 'missile' ? '🚀 טיל בליסטי' : 
                           threat.type === 'rocket' ? '🎯 רקטה' :
                           threat.type === 'drone' ? '🛩️ כטב"ם' : '💻 סייבר'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          threat.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          threat.severity === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {threat.severity === 'high' ? 'חמור' :
                           threat.severity === 'medium' ? 'בינוני' : 'נמוך'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className={`${
                            isDayMode ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            מקור: {threat.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className={`${
                            isDayMode ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            זוהה: {threat.timestamp.toLocaleTimeString('he-IL')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${getSeverityColor(threat.severity)}`} />
                          <span className={`${
                            isDayMode ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            סטטוס: {threat.intercepted ? '✅ יורט' : '🔴 פעיל'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!threat.intercepted && (
                      <div className="flex flex-col gap-2">
                        <span className="text-red-500 font-bold animate-pulse">
                          ACTIVE
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Statistics */}
          <div className={`mt-6 p-4 rounded-lg ${
            isDayMode ? 'bg-gray-50' : 'bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              סיכום איומים
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                  isDayMode ? 'text-orange-600' : 'text-orange-400'
                }`}>
                  {threats.filter(t => t.severity === 'high').length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  איומים חמורים
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {threats.length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  סה"כ איומים
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};