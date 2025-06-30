import React, { useState } from 'react';
import { X, Newspaper, Globe, Home, Tv, Radio, Clock } from 'lucide-react';
import { GameState, NewsItem } from '../types/game';

interface NewsMediaPanelProps {
  onClose: () => void;
  gameState: GameState;
  isDayMode: boolean;
}

export const NewsMediaPanel: React.FC<NewsMediaPanelProps> = ({
  onClose,
  gameState,
  isDayMode
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'internal'>('global');

  // Separate news into global and internal
  const globalNews = gameState.news.filter(news => 
    news.type === 'military' || news.type === 'diplomatic' || news.type === 'economic'
  );
  
  const internalNews = gameState.news.filter(news => 
    news.type === 'internal' || news.country === gameState.currentPlayer
  );

  // Get breaking news (most recent and important)
  const breakingNews = gameState.news.find(news => 
    news.type === 'military' && news.timestamp > Date.now() - 3600000 // Last hour
  ) || gameState.news[0];

  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'military': return '⚔️';
      case 'diplomatic': return '🤝';
      case 'economic': return '💰';
      case 'internal': return '🏛️';
      default: return '📰';
    }
  };

  const getNewsTypeText = (type: string) => {
    switch (type) {
      case 'military': return 'צבאי';
      case 'diplomatic': return 'דיפלומטי';
      case 'economic': return 'כלכלי';
      case 'internal': return 'פנימי';
      default: return 'כללי';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `לפני ${hours} שעות`;
    if (minutes > 0) return `לפני ${minutes} דקות`;
    return 'עכשיו';
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
              <Newspaper className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                חדשות ומדיה
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

        <div className="p-4 md:p-6">
          {/* Breaking News TV */}
          {breakingNews && (
            <div className={`mb-6 p-4 rounded-lg border-2 border-red-500 ${
              isDayMode ? 'bg-red-50' : 'bg-red-900/20'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Tv className="w-6 h-6 text-red-500" />
                <span className="text-red-500 font-bold text-lg animate-pulse">מבזק טלוויזיה</span>
              </div>
              <div className={`text-lg font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                {breakingNews.headline}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {breakingNews.content}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>{getNewsIcon(breakingNews.type)} {getNewsTypeText(breakingNews.type)}</span>
                <span><Clock className="w-3 h-3 inline mr-1" />{formatTimeAgo(breakingNews.timestamp)}</span>
              </div>
            </div>
          )}

          {/* News Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('global')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'global'
                  ? 'bg-blue-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Globe className="w-4 h-4" />
              חדשות גלובליות ({globalNews.length})
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'internal'
                  ? 'bg-green-500 text-white'
                  : isDayMode
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Home className="w-4 h-4" />
              חדשות המדינה ({internalNews.length})
            </button>
          </div>

          {/* News Content */}
          <div className="space-y-4">
            {(activeTab === 'global' ? globalNews : internalNews).map((news) => (
              <div
                key={news.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  isDayMode 
                    ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' 
                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {news.headline}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      isDayMode ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {news.content}
                    </p>
                  </div>
                  <div className="text-3xl ml-4">
                    {getNewsIcon(news.type)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full ${
                      news.type === 'military' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      news.type === 'diplomatic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      news.type === 'economic' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {getNewsTypeText(news.type)}
                    </span>
                    {news.country && (
                      <span className={`${
                        isDayMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        מקור: {gameState.countries[news.country]?.name || news.country}
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 ${
                    isDayMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(news.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'global' ? globalNews : internalNews).length === 0 && (
              <div className={`text-center py-8 ${
                isDayMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>אין חדשות זמינות בקטגוריה זו</p>
              </div>
            )}
          </div>

          {/* Media Sources */}
          <div className={`mt-8 p-4 rounded-lg ${
            isDayMode ? 'bg-gray-50' : 'bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              מקורות מדיה
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {globalNews.length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  חדשות גלובליות
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-green-600' : 'text-green-400'
                }`}>
                  {internalNews.length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  חדשות פנימיות
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-orange-600' : 'text-orange-400'
                }`}>
                  {gameState.news.filter(n => n.type === 'military').length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  חדשות צבאיות
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  isDayMode ? 'text-purple-600' : 'text-purple-400'
                }`}>
                  {gameState.news.filter(n => n.timestamp > Date.now() - 3600000).length}
                </div>
                <div className={`text-sm ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  בשעה האחרונה
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};