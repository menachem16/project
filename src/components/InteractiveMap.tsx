import React from 'react';
import { GameState } from '../types/game';
import { Shield, DollarSign, AlertTriangle, Zap } from 'lucide-react';

interface InteractiveMapProps {
  gameState: GameState;
  onCountryClick: (countryId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ gameState, onCountryClick }) => {
  const getCountryColor = (countryId: string) => {
    const country = gameState.countries[countryId];
    if (countryId === gameState.currentPlayer) return '#3B82F6'; // Blue for player
    
    const relationship = gameState.countries[gameState.currentPlayer]?.diplomacy.relationships[countryId] || 0;
    if (relationship > 50) return '#10B981'; // Green for allies
    if (relationship < -50) return '#EF4444'; // Red for enemies
    return '#6B7280'; // Gray for neutral
  };

  const getThreatLevel = (countryId: string) => {
    const country = gameState.countries[countryId];
    const militaryStrength = Object.values(country.military.units).reduce((sum, val) => sum + val, 0) / 8;
    const stability = country.politics.stability;
    
    if (militaryStrength > 70 && stability < 40) return 'high';
    if (militaryStrength > 50 || stability < 60) return 'medium';
    return 'low';
  };

  const countries = [
    { id: 'turkey', name: 'Turkey', x: 45, y: 25, flag: '🇹🇷' },
    { id: 'syria', name: 'Syria', x: 50, y: 45, flag: '🇸🇾' },
    { id: 'iraq', name: 'Iraq', x: 65, y: 50, flag: '🇮🇶' },
    { id: 'iran', name: 'Iran', x: 80, y: 45, flag: '🇮🇷' },
    { id: 'israel', name: 'Israel', x: 45, y: 60, flag: '🇮🇱' },
    { id: 'jordan', name: 'Jordan', x: 55, y: 65, flag: '🇯🇴' },
    { id: 'saudi', name: 'Saudi Arabia', x: 70, y: 75, flag: '🇸🇦' },
    { id: 'egypt', name: 'Egypt', x: 35, y: 70, flag: '🇪🇬' }
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-gray-800 to-green-900 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Simplified Middle East outline */}
          <path
            d="M20,30 L30,20 L60,15 L85,25 L95,40 L90,60 L85,80 L70,90 L40,85 L25,75 L15,50 Z"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Countries */}
      {countries.map((country) => {
        const gameCountry = gameState.countries[country.id];
        const isPlayer = country.id === gameState.currentPlayer;
        const threatLevel = getThreatLevel(country.id);
        
        return (
          <div
            key={country.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
              isPlayer ? 'z-20' : 'z-10'
            }`}
            style={{ left: `${country.x}%`, top: `${country.y}%` }}
            onClick={() => onCountryClick(country.id)}
          >
            {/* Country Circle */}
            <div
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center relative ${
                isPlayer 
                  ? 'border-blue-400 bg-blue-600 shadow-lg shadow-blue-400/50' 
                  : 'border-gray-400 bg-gray-700 hover:border-white'
              }`}
              style={{ borderColor: getCountryColor(country.id) }}
            >
              <span className="text-2xl">{country.flag}</span>
              
              {/* Threat Indicator */}
              {threatLevel === 'high' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-white m-0.5" />
                </div>
              )}
              
              {/* Nuclear Indicator */}
              {gameCountry.military.nuclear.status !== 'none' && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full">
                  <span className="text-xs">⚛️</span>
                </div>
              )}
            </div>

            {/* Country Info Tooltip */}
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white p-3 rounded-lg shadow-lg min-w-48 ${
              isPlayer ? 'block' : 'opacity-0 hover:opacity-100'
            } transition-opacity duration-200 z-30`}>
              <div className="text-center mb-2">
                <h3 className="font-bold text-lg">{country.name}</h3>
                <p className="text-gray-300 text-sm">{gameCountry.capital}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-red-400" />
                  <span>Military: {gameCountry.military.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span>GDP: ${(gameCountry.economy.gdp / 1000000000).toFixed(0)}B</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Stability: {gameCountry.politics.stability}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                  <span>Threat: {threatLevel}</span>
                </div>
              </div>

              {!isPlayer && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="text-xs text-gray-400">
                    Relations: <span className={`font-bold ${
                      (gameState.countries[gameState.currentPlayer]?.diplomacy.relationships[country.id] || 0) > 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {gameState.countries[gameState.currentPlayer]?.diplomacy.relationships[country.id] || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Tension Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {countries.map((country1) => 
          countries.map((country2) => {
            if (country1.id >= country2.id) return null;
            
            const relationship = gameState.countries[country1.id]?.diplomacy.relationships[country2.id] || 0;
            if (Math.abs(relationship) < 30) return null;
            
            const color = relationship > 0 ? '#10B981' : '#EF4444';
            const opacity = Math.abs(relationship) / 100;
            
            return (
              <line
                key={`${country1.id}-${country2.id}`}
                x1={`${country1.x}%`}
                y1={`${country1.y}%`}
                x2={`${country2.x}%`}
                y2={`${country2.y}%`}
                stroke={color}
                strokeWidth="2"
                strokeOpacity={opacity * 0.6}
                strokeDasharray={relationship > 0 ? "0" : "5,5"}
              />
            );
          })
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg text-xs">
        <h4 className="font-bold text-white mb-2">Map Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Your Nation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Allies (+50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Enemies (-50)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⚛️</span>
            <span className="text-gray-300">Nuclear Program</span>
          </div>
        </div>
      </div>
    </div>
  );
};