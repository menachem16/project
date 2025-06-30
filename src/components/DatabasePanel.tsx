import React, { useState } from 'react';
import { X, Database, Search, FileText, Users, MapPin, Shield } from 'lucide-react';
import { GameState } from '../types/game';

interface DatabasePanelProps {
  onClose: () => void;
  onOperation: (operation: any) => void;
  isDayMode: boolean;
  gameState: GameState;
}

const DATABASE_CATEGORIES = [
  {
    id: 'personnel',
    name: 'כוח אדם',
    description: 'מאגר נתוני כוח אדם',
    icon: '👥',
    records: 15420,
    classification: 'secret'
  },
  {
    id: 'intelligence',
    name: 'מודיעין',
    description: 'דוחות מודיעיניים',
    icon: '🕵️',
    records: 8750,
    classification: 'top_secret'
  },
  {
    id: 'operations',
    name: 'מבצעים',
    description: 'תיעוד מבצעים צבאיים',
    icon: '⚔️',
    records: 3240,
    classification: 'classified'
  },
  {
    id: 'equipment',
    name: 'ציוד וחימוש',
    description: 'מלאי ציוד צבאי',
    icon: '🔫',
    records: 25680,
    classification: 'restricted'
  },
  {
    id: 'locations',
    name: 'מיקומים',
    description: 'מאגר מיקומים אסטרטגיים',
    icon: '📍',
    records: 12340,
    classification: 'secret'
  },
  {
    id: 'communications',
    name: 'תקשורת',
    description: 'יומני תקשורת',
    icon: '📡',
    records: 45670,
    classification: 'confidential'
  }
];

const SEARCH_OPERATIONS = [
  {
    id: 'quick_search',
    name: 'חיפוש מהיר',
    description: 'חיפוש בסיסי במאגר',
    duration: 1,
    accuracy: 85
  },
  {
    id: 'deep_search',
    name: 'חיפוש מעמיק',
    description: 'חיפוש מתקדם עם קורלציות',
    duration: 5,
    accuracy: 95
  },
  {
    id: 'pattern_analysis',
    name: 'ניתוח דפוסים',
    description: 'זיהוי דפוסים במידע',
    duration: 10,
    accuracy: 90
  },
  {
    id: 'cross_reference',
    name: 'הצלבת מידע',
    description: 'הצלבה בין מאגרים שונים',
    duration: 8,
    accuracy: 92
  }
];

export const DatabasePanel: React.FC<DatabasePanelProps> = ({
  onClose,
  onOperation,
  isDayMode,
  gameState
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!selectedCategory || !selectedOperation || !searchQuery.trim()) {
      alert('יש למלא את כל השדות');
      return;
    }

    setIsSearching(true);
    const operation = SEARCH_OPERATIONS.find(op => op.id === selectedOperation);
    const category = DATABASE_CATEGORIES.find(cat => cat.id === selectedCategory);
    
    if (!operation || !category) return;

    // Simulate search
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `תוצאה 1 עבור "${searchQuery}"`,
          category: category.name,
          classification: category.classification,
          relevance: Math.floor(Math.random() * 30) + 70,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          title: `תוצאה 2 עבור "${searchQuery}"`,
          category: category.name,
          classification: category.classification,
          relevance: Math.floor(Math.random() * 30) + 70,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          title: `תוצאה 3 עבור "${searchQuery}"`,
          category: category.name,
          classification: category.classification,
          relevance: Math.floor(Math.random() * 30) + 70,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      ];

      setSearchResults(mockResults);
      setIsSearching(false);

      onOperation({
        type: operation.name,
        category: category.name,
        query: searchQuery,
        results: mockResults.length,
        timestamp: new Date()
      });
    }, operation.duration * 1000);
  };

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
              <Database className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מאגר מידע מתקדם
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

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Categories */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              קטגוריות מידע
            </h3>
            <div className="space-y-3">
              {DATABASE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedCategory === category.id
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="flex-1">
                      <span className={`font-bold block ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {category.name}
                      </span>
                      <span className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {category.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.classification === 'top_secret' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        category.classification === 'secret' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        category.classification === 'classified' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        category.classification === 'restricted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {category.classification === 'top_secret' ? 'סודי ביותר' :
                         category.classification === 'secret' ? 'סודי' :
                         category.classification === 'classified' ? 'מסווג' :
                         category.classification === 'restricted' ? 'מוגבל' : 'רגיל'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {category.records.toLocaleString()} רשומות
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Operations */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              סוגי חיפוש
            </h3>
            <div className="space-y-3 mb-6">
              {SEARCH_OPERATIONS.map((operation) => (
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
                    <Search className="w-5 h-5 text-blue-500" />
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
                    <div>דיוק: {operation.accuracy}%</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDayMode ? 'text-gray-700' : 'text-gray-300'
              }`}>
                מונח חיפוש
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="הקלד מונח לחיפוש..."
                className={`w-full p-3 rounded-lg border ${
                  isDayMode 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!selectedCategory || !selectedOperation || !searchQuery.trim() || isSearching}
              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedCategory && selectedOperation && searchQuery.trim() && !isSearching
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSearching ? '🔍 מחפש...' : '🔍 בצע חיפוש'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className={`p-4 md:p-6 border-t ${
            isDayMode ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              תוצאות חיפוש ({searchResults.length})
            </h3>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className={`font-bold ${
                          isDayMode ? 'text-gray-800' : 'text-white'
                        }`}>
                          {result.title}
                        </span>
                      </div>
                      <div className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        קטגוריה: {result.category}
                      </div>
                      <div className={`text-xs ${
                        isDayMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        עודכן: {result.timestamp.toLocaleDateString('he-IL')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.classification === 'top_secret' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        result.classification === 'secret' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {result.classification === 'top_secret' ? 'סודי ביותר' :
                         result.classification === 'secret' ? 'סודי' : 'מסווג'}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        רלוונטיות: {result.relevance}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Database Statistics */}
        <div className={`p-4 md:p-6 border-t ${
          isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-700'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDayMode ? 'text-gray-800' : 'text-white'
          }`}>
            סטטיסטיקות מאגר
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-yellow-600' : 'text-yellow-400'
              }`}>
                {DATABASE_CATEGORIES.reduce((sum, cat) => sum + cat.records, 0).toLocaleString()}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                סה"כ רשומות
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-blue-600' : 'text-blue-400'
              }`}>
                {DATABASE_CATEGORIES.length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                קטגוריות
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-green-600' : 'text-green-400'
              }`}>
                {searchResults.length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                תוצאות אחרונות
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-purple-600' : 'text-purple-400'
              }`}>
                99.9%
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                זמינות מערכת
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};