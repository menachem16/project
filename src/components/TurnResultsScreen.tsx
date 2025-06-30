import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Users, DollarSign, Shield, Heart, Eye, Globe, Zap, Activity } from 'lucide-react';
import { GameState } from '../types/game';

interface TurnResultsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  previousState?: GameState;
  isDayMode: boolean;
}

export const TurnResultsScreen: React.FC<TurnResultsScreenProps> = ({
  isOpen,
  onClose,
  gameState,
  previousState,
  isDayMode
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAnimationPhase(0);
      
      // Generate matrix characters
      const chars = [];
      for (let i = 0; i < 100; i++) {
        chars.push(Math.random().toString(36).substring(2, 15));
      }
      setMatrixChars(chars);
      
      const timer = setInterval(() => {
        setAnimationPhase(prev => {
          if (prev >= 5) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCountry = gameState.countries[gameState.currentPlayer];
  const previousCountry = previousState?.countries[gameState.currentPlayer];

  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return 0;
    return current - previous;
  };

  const changes = {
    gdp: calculateChange(currentCountry.economy.gdp, previousCountry?.economy.gdp),
    stability: calculateChange(currentCountry.politics.stability, previousCountry?.politics.stability),
    publicSupport: calculateChange(currentCountry.politics.publicSupport, previousCountry?.politics.publicSupport),
    militaryExp: calculateChange(currentCountry.military.experience, previousCountry?.military.experience),
    intelligence: calculateChange(currentCountry.intelligence.agencies, previousCountry?.intelligence.agencies)
  };

  const formatChange = (value: number, isPercentage = false, isCurrency = false) => {
    const prefix = value > 0 ? '+' : '';
    const suffix = isPercentage ? '%' : isCurrency ? 'B' : '';
    const displayValue = isCurrency ? (value / 1000000000).toFixed(2) : value.toFixed(1);
    return `${prefix}${displayValue}${suffix}`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 inline ml-1" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 inline ml-1" />;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex items-center justify-center">
      {/* Futuristic Matrix Background */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {matrixChars.map((char, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs font-mono animate-pulse"
              style={{
                left: `${(i % 10) * 10}%`,
                top: `${Math.floor(i / 10) * 10}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {char}
            </div>
          ))}
        </div>
        
        {/* Scanning lines */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-30"
               style={{ top: '20%', animationDuration: '3s' }} />
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-30"
               style={{ top: '60%', animationDuration: '4s', animationDelay: '1s' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`text-4xl md:text-6xl font-mono font-bold mb-4 ${
            animationPhase >= 0 ? 'animate-pulse' : 'opacity-0'
          }`}>
            <>
              <span className="text-green-400">&gt;&gt;&gt; </span>
              <span className="text-white">תור {gameState.turn} הושלם</span>
              <span className="text-green-400"> &lt;&lt;&lt;</span>
            </>
          </div>
          <div className={`text-xl md:text-2xl font-mono text-green-300 ${
            animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000`}>
            דוח מצב מדינה - {currentCountry.name} {currentCountry.flag}
          </div>
          <div className={`text-sm font-mono text-green-500 mt-2 ${
            animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000`}>
            [SYSTEM] ניתוח נתונים הושלם בהצלחה
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 ${
          animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}>
          {/* GDP */}
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">תמ"ג</span>
            </div>
            <div className="text-white text-xl font-bold">
              ${(currentCountry.economy.gdp / 1000000000).toFixed(1)}B
            </div>
            <div className={`text-sm flex items-center ${getChangeColor(changes.gdp)}`}>
              {formatChange(changes.gdp, false, true)}
              {getChangeIcon(changes.gdp)}
            </div>
          </div>

          {/* Stability */}
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">יציבות</span>
            </div>
            <div className="text-white text-xl font-bold">
              {currentCountry.politics.stability}%
            </div>
            <div className={`text-sm flex items-center ${getChangeColor(changes.stability)}`}>
              {formatChange(changes.stability, true)}
              {getChangeIcon(changes.stability)}
            </div>
          </div>

          {/* Public Support */}
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">תמיכה ציבורית</span>
            </div>
            <div className="text-white text-xl font-bold">
              {currentCountry.politics.publicSupport}%
            </div>
            <div className={`text-sm flex items-center ${getChangeColor(changes.publicSupport)}`}>
              {formatChange(changes.publicSupport, true)}
              {getChangeIcon(changes.publicSupport)}
            </div>
          </div>

          {/* Military */}
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">כוח צבאי</span>
            </div>
            <div className="text-white text-xl font-bold">
              {currentCountry.military.experience}/100
            </div>
            <div className={`text-sm flex items-center ${getChangeColor(changes.militaryExp)}`}>
              {formatChange(changes.militaryExp, true)}
              {getChangeIcon(changes.militaryExp)}
            </div>
          </div>

          {/* Intelligence */}
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">מודיעין</span>
            </div>
            <div className="text-white text-xl font-bold">
              {currentCountry.intelligence.agencies}/100
            </div>
            <div className={`text-sm flex items-center ${getChangeColor(changes.intelligence)}`}>
              {formatChange(changes.intelligence, true)}
              {getChangeIcon(changes.intelligence)}
            </div>
          </div>

          {/* Population */}
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">אוכלוסייה</span>
            </div>
            <div className="text-white text-xl font-bold">
              {(currentCountry.population / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-400">
              יציב
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className={`mb-8 ${
          animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}>
          <h3 className="text-green-400 font-mono text-xl mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            &gt;&gt;&gt; אירועי התור &lt;&lt;&lt;
          </h3>
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 max-h-48 overflow-y-auto backdrop-blur-sm">
            {gameState.news.slice(0, 5).map((news, index) => (
              <div key={news.id} className="mb-3 last:mb-0">
                <div className="text-green-300 font-mono text-sm">
                  [{String(index + 1).padStart(2, '0')}] {news.headline}
                </div>
                <div className="text-gray-400 font-mono text-xs ml-6 mt-1">
                  {news.content}
                </div>
              </div>
            ))}
            {gameState.news.length === 0 && (
              <div className="text-gray-500 font-mono text-sm">
                [INFO] אין אירועים חדשים לדיווח
              </div>
            )}
          </div>
        </div>

        {/* System Messages */}
        <div className={`mb-8 ${
          animationPhase >= 4 ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}>
          <h3 className="text-green-400 font-mono text-xl mb-4">&gt;&gt;&gt; הודעות מערכת &lt;&lt;&lt;</h3>
          <div className="bg-gray-900/90 border border-green-400 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-green-300 font-mono text-sm mb-2">
              [SYSTEM] תור {gameState.turn} הושלם בהצלחה
            </div>
            <div className="text-green-300 font-mono text-sm mb-2">
              [STATUS] כל המערכות פעילות ומוכנות
            </div>
            <div className="text-green-300 font-mono text-sm mb-2">
              [AI] יריבים ביצעו {Math.floor(Math.random() * 5) + 3} פעולות
            </div>
            <div className="text-green-300 font-mono text-sm">
              [READY] ממתין לפקודות תור {gameState.turn + 1}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className={`text-center ${
          animationPhase >= 5 ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}>
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-black font-mono font-bold px-8 py-4 rounded-lg border-2 border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/50 hover:scale-105"
          >
            &gt;&gt;&gt; המשך לתור הבא &lt;&lt;&lt;
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};