import React, { useState } from 'react';
import { X, Activity, Filter, Download, Search } from 'lucide-react';

interface EventLoggerProps {
  onClose: () => void;
  events: any[];
  isDayMode: boolean;
}

export const EventLogger: React.FC<EventLoggerProps> = ({
  onClose,
  events,
  isDayMode
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'attack': return '🚀';
      case 'defense': return '🛡️';
      case 'system': return '⚙️';
      case 'intelligence': return '🕵️';
      case 'diplomatic': return '🤝';
      default: return '📋';
    }
  };

  const getEventColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return isDayMode ? 'text-gray-600' : 'text-gray-400';
    }
  };

  const exportEvents = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "זמן,סוג,הודעה,חומרה\n"
      + filteredEvents.map(event => 
          `${event.timestamp.toLocaleString('he-IL')},${event.type},${event.message},${event.severity}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `events_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <Activity className="w-8 h-8 text-purple-500" />
              <h2 className={`text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                יומן אירועים
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportEvents}
                className={`p-2 rounded-lg transition-colors ${
                  isDayMode 
                    ? 'hover:bg-gray-100 text-gray-600' 
                    : 'hover:bg-gray-700 text-gray-400'
                }`}
                title="ייצא לקובץ CSV"
              >
                <Download className="w-5 h-5" />
              </button>
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
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש באירועים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDayMode 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
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
                הכל ({events.length})
              </button>
              <button
                onClick={() => setFilter('attack')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'attack'
                    ? 'bg-red-500 text-white'
                    : isDayMode
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                תקיפות ({events.filter(e => e.type === 'attack').length})
              </button>
              <button
                onClick={() => setFilter('defense')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'defense'
                    ? 'bg-green-500 text-white'
                    : isDayMode
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                הגנה ({events.filter(e => e.type === 'defense').length})
              </button>
              <button
                onClick={() => setFilter('system')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'system'
                    ? 'bg-purple-500 text-white'
                    : isDayMode
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                מערכת ({events.filter(e => e.type === 'system').length})
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className={`text-center py-8 ${
                isDayMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>אין אירועים להצגה</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    isDayMode 
                      ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' 
                      : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getEventIcon(event.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${getEventColor(event.severity)}`}>
                          {event.message}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`${
                          isDayMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {event.timestamp.toLocaleString('he-IL')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.type === 'attack' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          event.type === 'defense' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          event.type === 'system' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                        }`}>
                          {event.type === 'attack' ? 'תקיפה' :
                           event.type === 'defense' ? 'הגנה' :
                           event.type === 'system' ? 'מערכת' :
                           event.type === 'intelligence' ? 'מודיעין' :
                           event.type === 'diplomatic' ? 'דיפלומטיה' : 'כללי'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.severity === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          event.severity === 'warning' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          event.severity === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {event.severity === 'success' ? 'הצלחה' :
                           event.severity === 'warning' ? 'אזהרה' :
                           event.severity === 'error' ? 'שגיאה' : 'מידע'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Statistics */}
          <div className={`mt-6 p-4 rounded-lg ${
            isDayMode ? 'bg-gray-50' : 'bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              סטטיסטיקות אירועים
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-red-600' : 'text-red-400'
                }`}>
                  {events.filter(e => e.type === 'attack').length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  תקיפות
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-green-600' : 'text-green-400'
                }`}>
                  {events.filter(e => e.type === 'defense').length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  פעולות הגנה
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {events.filter(e => e.type === 'system').length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  אירועי מערכת
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-purple-600' : 'text-purple-400'
                }`}>
                  {events.length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  סה"כ אירועים
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};