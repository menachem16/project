import React, { useState } from 'react';
import { X, Settings, Volume2, VolumeX, Sun, Moon, Monitor, Smartphone, Tablet } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
  isDayMode: boolean;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onToggleDayMode: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  isDayMode,
  audioEnabled,
  onToggleAudio,
  onToggleDayMode
}) => {
  const [language, setLanguage] = useState('hebrew');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [difficulty, setDifficulty] = useState('normal');

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                הגדרות מערכת
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

        <div className="p-4 md:p-6 space-y-8">
          {/* Display Settings */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              הגדרות תצוגה
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    מצב תצוגה
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    בחר בין מצב יום למצב לילה
                  </p>
                </div>
                <button
                  onClick={onToggleDayMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDayMode 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {isDayMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDayMode ? 'מצב יום' : 'מצב לילה'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    התאמה למכשיר
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    האפליקציה מותאמת אוטומטית למחשב, טאבלט ומובייל
                  </p>
                </div>
                <div className="flex gap-2">
                  <Monitor className="w-5 h-5 text-green-500" />
                  <Tablet className="w-5 h-5 text-green-500" />
                  <Smartphone className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              הגדרות שמע
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    הודעות קוליות
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    הפעל/השבת הודעות קוליות בעברית
                  </p>
                </div>
                <button
                  onClick={onToggleAudio}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    audioEnabled 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {audioEnabled ? 'מופעל' : 'מושבת'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    שפת הודעות
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    כל ההודעות הקוליות בעברית בלבד
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                  עברית
                </span>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              הגדרות משחק
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    התראות
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    הצג התראות על איומים ואירועים
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    notifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    שמירה אוטומטית
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    שמור התקדמות אוטומטית
                  </p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    autoSave ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    רמת קושי
                  </span>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    בחר רמת קושי למשחק
                  </p>
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    isDayMode 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="easy">קל</option>
                  <option value="normal">רגיל</option>
                  <option value="hard">קשה</option>
                  <option value="expert">מומחה</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              מידע מערכת
            </h3>
            <div className={`p-4 rounded-lg ${
              isDayMode ? 'bg-gray-50' : 'bg-gray-700'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    גרסה:
                  </span>
                  <span className={`ml-2 ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    1.0.0
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    סטטוס:
                  </span>
                  <span className="ml-2 text-green-500">מחובר</span>
                </div>
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    שרת:
                  </span>
                  <span className={`ml-2 ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    IL-Central
                  </span>
                </div>
                <div>
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    זמן פעילות:
                  </span>
                  <span className={`ml-2 ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    99.9%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              onClick={() => {
                alert('הגדרות נשמרו בהצלחה');
                onClose();
              }}
            >
              שמור הגדרות
            </button>
            <button
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                isDayMode 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              onClick={() => {
                if (confirm('האם אתה בטוח שברצונך לאפס את כל ההגדרות?')) {
                  alert('ההגדרות אופסו לברירת מחדל');
                }
              }}
            >
              איפוס הגדרות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};