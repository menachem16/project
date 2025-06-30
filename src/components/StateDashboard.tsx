import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Shield, Heart, Eye, Globe, Calendar, Settings, Play } from 'lucide-react';
import { GameState } from '../types/game';

interface StateDashboardProps {
  onClose: () => void;
  gameState: GameState;
  onAction: (action: any) => void;
  isDayMode: boolean;
  score?: number;
}

export const StateDashboard: React.FC<StateDashboardProps> = ({
  onClose,
  gameState,
  onAction,
  isDayMode,
  score
}) => {
  if (!gameState || !gameState.countries || !gameState.currentPlayer) {
    return <div className="bg-red-900 text-white p-8 rounded-lg shadow-lg text-center">שגיאה: נתוני משחק חסרים</div>;
  }

  const currentCountry = gameState.countries[gameState.currentPlayer];
  
  // Calculate budget breakdown
  const totalExpenses = Object.values(currentCountry.economy.budget.expenses).reduce((sum, val) => sum + val, 0);
  const budgetBalance = currentCountry.economy.budget.income - totalExpenses;

  const handleContinueToNextTurn = () => {
    onAction({ type: 'end_turn', country: gameState.currentPlayer });
    onClose();
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מצב המדינה - {currentCountry.name} {currentCountry.flag}
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

        {/* Show score at the top */}
        <div className="mb-4 p-4 rounded-lg bg-yellow-100 text-yellow-800 text-xl font-bold text-center shadow">
          ⭐ ניקוד מצטבר: {score ?? 0}
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Population */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className={`font-semibold ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  אוכלוסייה
                </span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                {(currentCountry.population / 1000000).toFixed(1)}M
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                יציב - ללא שינוי משמעותי
              </div>
            </div>

            {/* Economy (GDP) */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className={`font-semibold ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  כלכלה (תמ"ג)
                </span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                ${(currentCountry.economy.gdp / 1000000000).toFixed(1)}B
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+2.3% מהתור הקודם</span>
              </div>
            </div>

            {/* Public Happiness */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className={`font-semibold ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  אושר ציבורי
                </span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                {currentCountry.politics.publicSupport}%
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCountry.politics.publicSupport}%` }}
                />
              </div>
            </div>

            {/* Political Stability */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className={`font-semibold ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  יציבות פוליטית
                </span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                {currentCountry.politics.stability}%
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCountry.politics.stability}%` }}
                />
              </div>
            </div>

            {/* Budget */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-yellow-500" />
                <span className={`font-semibold ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  תקציב
                </span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                ${(currentCountry.economy.budget.income / 1000000000).toFixed(1)}B
              </div>
              <div className="space-y-1 text-xs">
                <div className={`flex justify-between ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span>הכנסות:</span>
                  <span>${(currentCountry.economy.budget.income / 1000000000).toFixed(1)}B</span>
                </div>
                <div className={`flex justify-between ${
                  isDayMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span>הוצאות:</span>
                  <span>${(totalExpenses / 1000000000).toFixed(1)}B</span>
                </div>
                <div className={`flex justify-between font-semibold ${
                  budgetBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>יתרה:</span>
                  <span>{budgetBalance >= 0 ? '+' : ''}${(budgetBalance / 1000000000).toFixed(1)}B</span>
                </div>
              </div>
            </div>

            {/* Military Strength */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-red-500" />
                <span className={`font-semibold ${
                  isDayMode ? 'text-gray-800' : 'text-white'
                }`}>
                  כוח צבאי
                </span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                {currentCountry.military.experience}/100
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                מורל: {currentCountry.military.morale}%
              </div>
            </div>
          </div>

          {/* Events from Last Turn */}
          <div className={`p-4 rounded-lg border ${
            isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              <Calendar className="w-5 h-5" />
              אירועים שהתרחשו בתור האחרון
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {gameState.events.slice(0, 5).map((event) => (
                <div key={event.id} className={`p-3 rounded border ${
                  isDayMode ? 'border-gray-200 bg-white' : 'border-gray-600 bg-gray-600'
                }`}>
                  <div className={`font-semibold mb-1 ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    {event.title}
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {event.description}
                  </div>
                  <div className={`text-xs mt-1 ${
                    event.severity === 'high' ? 'text-red-500' :
                    event.severity === 'medium' ? 'text-orange-500' : 'text-green-500'
                  }`}>
                    חומרה: {event.severity === 'high' ? 'גבוהה' :
                            event.severity === 'medium' ? 'בינונית' : 'נמוכה'}
                  </div>
                </div>
              ))}
              {gameState.events.length === 0 && (
                <div className={`text-center py-4 ${
                  isDayMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  אין אירועים חדשים בתור זה
                </div>
              )}
            </div>
          </div>

          {/* System Messages */}
          <div className={`p-4 rounded-lg border ${
            isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              <Settings className="w-5 h-5" />
              הודעות מערכת
            </h3>
            <div className="space-y-2">
              <div className={`p-2 rounded text-sm ${
                isDayMode ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-300'
              }`}>
                ✓ כל המערכות פעילות ותקינות
              </div>
              <div className={`p-2 rounded text-sm ${
                isDayMode ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/30 text-blue-300'
              }`}>
                ℹ תור {gameState.turn} פעיל - ממתין להחלטות
              </div>
              <div className={`p-2 rounded text-sm ${
                isDayMode ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900/30 text-yellow-300'
              }`}>
                ⚠ {Object.values(currentCountry.diplomacy.relationships).filter(r => r < -50).length} איומים דיפלומטיים זוהו
              </div>
              <div className={`p-2 rounded text-sm ${
                isDayMode ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/30 text-purple-300'
              }`}>
                📊 דוח מצב עודכן בהצלחה
              </div>
            </div>
          </div>

          {/* Continue to Next Turn Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinueToNextTurn}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              המשך לתור הבא
            </button>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Military Breakdown */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <h4 className={`font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                פירוט כוחות צבאיים
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(currentCountry.military.units).map(([unit, strength]) => (
                  <div key={unit} className="flex justify-between">
                    <span className={`capitalize ${
                      isDayMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {unit === 'infantry' ? 'חי"ר' :
                       unit === 'armor' ? 'שריון' :
                       unit === 'airForce' ? 'חיל אוויר' :
                       unit === 'navy' ? 'חיל ים' :
                       unit === 'special' ? 'יחידות מיוחדות' :
                       unit === 'missiles' ? 'טילים' :
                       unit === 'drones' ? 'כטב"מים' :
                       unit === 'cyber' ? 'סייבר' : unit}:
                    </span>
                    <span className={`font-medium ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Economic Sectors */}
            <div className={`p-4 rounded-lg border ${
              isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
            }`}>
              <h4 className={`font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מגזרים כלכליים
              </h4>
              <div className="space-y-2 text-sm">
                {Object.entries(currentCountry.economy.sectors).map(([sector, percentage]) => (
                  <div key={sector} className="flex justify-between">
                    <span className={`capitalize ${
                      isDayMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {sector === 'oil' ? 'נפט' :
                       sector === 'technology' ? 'טכנולוגיה' :
                       sector === 'tourism' ? 'תיירות' :
                       sector === 'agriculture' ? 'חקלאות' :
                       sector === 'industry' ? 'תעשייה' : sector}:
                    </span>
                    <span className={`font-medium ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};