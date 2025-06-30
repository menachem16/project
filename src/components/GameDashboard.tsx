import React, { useState } from 'react';
import { GameState, Country } from '../types/game';
import { GoogleMapComponent } from './GoogleMapComponent';
import { SimulationModal } from './SimulationModal';
import { TurnResultsScreen } from './TurnResultsScreen';
import { 
  Shield, 
  DollarSign, 
  Users, 
  Activity, 
  Globe, 
  Eye, 
  Sword, 
  Heart,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Target,
  Zap,
  Cpu,
  Briefcase,
  Plane,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';

interface GameDashboardProps {
  gameState: GameState;
  onAction: (action: any) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ gameState, onAction }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [pendingSimulation, setPendingSimulation] = useState<any>(null);
  const [showTurnResults, setShowTurnResults] = useState(false);
  const [previousGameState, setPreviousGameState] = useState<GameState | undefined>();
  const [activePanel, setActivePanel] = useState<string>('');
  
  const currentCountry = gameState.countries[gameState.currentPlayer];

  const handleCountryClick = (countryId: string) => {
    setSelectedCountry(countryId);
  };

  const executeAction = (actionType: string, target?: string) => {
    const targetCountry = target || selectedCountry;
    const fromCountry = gameState.countries[gameState.currentPlayer];
    const toCountry = gameState.countries[targetCountry];
    
    // Create simulation for visual actions
    const needsSimulation = [
      'missile_attack', 'troop_movement', 'diplomatic_meeting', 
      'cyber_attack', 'trade_agreement', 'declare_war'
    ].includes(actionType);

    if (needsSimulation && targetCountry && targetCountry !== gameState.currentPlayer) {
      const simulation = {
        type: actionType,
        from: gameState.currentPlayer,
        to: targetCountry,
        fromName: fromCountry.name,
        toName: toCountry.name,
        riskLevel: getRiskLevel(actionType),
        description: getActionDescription(actionType, fromCountry.name, toCountry.name)
      };

      setPendingSimulation(simulation);
      setShowSimulationModal(true);
      setActiveSimulation(simulation);
    } else {
      // Execute action directly
      const action = {
        type: actionType,
        country: gameState.currentPlayer,
        target: targetCountry,
        timestamp: Date.now()
      };
      
      onAction(action);
    }
    
    setSelectedCountry('');
  };

  const getRiskLevel = (actionType: string): string => {
    switch (actionType) {
      case 'missile_attack':
      case 'declare_war':
        return 'high';
      case 'cyber_attack':
      case 'troop_movement':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getActionDescription = (actionType: string, fromName: string, toName: string): string => {
    switch (actionType) {
      case 'missile_attack':
        return `${fromName} launching precision missile strike against ${toName}`;
      case 'troop_movement':
        return `${fromName} deploying military forces near ${toName} border`;
      case 'diplomatic_meeting':
        return `High-level diplomatic summit between ${fromName} and ${toName}`;
      case 'cyber_attack':
        return `${fromName} conducting cyber operations against ${toName}`;
      case 'trade_agreement':
        return `${fromName} negotiating trade partnership with ${toName}`;
      case 'declare_war':
        return `${fromName} declaring war on ${toName}`;
      default:
        return `${fromName} conducting operation against ${toName}`;
    }
  };

  const handleSimulationComplete = (result: any) => {
    // Apply simulation results to game state
    const action = {
      type: pendingSimulation.type,
      country: gameState.currentPlayer,
      target: pendingSimulation.to,
      result: result,
      timestamp: Date.now()
    };
    
    onAction(action);
    
    // Clear simulation after a delay
    setTimeout(() => {
      setActiveSimulation(null);
    }, 3000);
  };

  const handleEndTurn = () => {
    setPreviousGameState(gameState);
    onAction({ type: 'end_turn', country: gameState.currentPlayer });
    setShowTurnResults(true);
  };

  const getThreatLevel = (relationships: Record<string, number>) => {
    const threats = Object.values(relationships).filter(r => r < -50).length;
    if (threats >= 3) return { level: 'Critical', color: 'text-red-400', count: threats };
    if (threats >= 2) return { level: 'High', color: 'text-orange-400', count: threats };
    if (threats >= 1) return { level: 'Medium', color: 'text-yellow-400', count: threats };
    return { level: 'Low', color: 'text-green-400', count: 0 };
  };

  const threat = getThreatLevel(currentCountry.diplomacy.relationships);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-2xl md:text-3xl">{currentCountry.flag}</span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{currentCountry.name}</h1>
              <p className="text-gray-400 text-sm">Turn {gameState.turn} • {currentCountry.capital}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Threat Level</div>
              <div className={`font-bold ${threat.color}`}>{threat.level}</div>
            </div>
            <button 
              className="bg-green-600 hover:bg-green-700 px-4 md:px-6 py-2 rounded font-medium transition-colors"
              onClick={handleEndTurn}
            >
              End Turn
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Left Sidebar - Quick Stats */}
        <div className="w-full lg:w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            National Status
          </h2>
          
          {/* Key Metrics */}
          <div className="space-y-4 mb-6">
            {/* Population */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">אוכלוסייה</span>
              </div>
              <div className="text-xl font-bold">{(currentCountry.population / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-400">יציב</div>
            </div>

            {/* Economy (GDP) */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">כלכלה (תמ"ג)</span>
              </div>
              <div className="text-xl font-bold">${(currentCountry.economy.gdp / 1000000000).toFixed(0)}B</div>
              <div className="text-xs text-gray-400">Debt: {currentCountry.economy.debt}% | Inflation: {currentCountry.economy.inflation}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(0, 100 - currentCountry.economy.debt)}%` }}
                />
              </div>
            </div>

            {/* Public Support */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium">אושר ציבורי</span>
              </div>
              <div className="text-xl font-bold">{currentCountry.politics.publicSupport}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCountry.politics.publicSupport}%` }}
                />
              </div>
            </div>

            {/* Political Stability */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">יציבות פוליטית</span>
              </div>
              <div className="text-xl font-bold">{currentCountry.politics.stability}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCountry.politics.stability}%` }}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">תקציב</span>
              </div>
              <div className="text-xl font-bold">${(currentCountry.economy.budget.income / 1000000000).toFixed(0)}B</div>
              <div className="text-xs text-gray-400">
                הכנסות: ${(currentCountry.economy.budget.income / 1000000000).toFixed(1)}B
              </div>
              <div className="text-xs text-gray-400">
                הוצאות: ${(Object.values(currentCountry.economy.budget.expenses).reduce((a, b) => a + b, 0) / 1000000000).toFixed(1)}B
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium">Military</span>
              </div>
              <div className="text-xl font-bold">{currentCountry.military.experience}/100</div>
              <div className="text-xs text-gray-400">Morale: {currentCountry.military.morale}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCountry.military.experience}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Intelligence</span>
              </div>
              <div className="text-xl font-bold">{currentCountry.intelligence.agencies}/100</div>
              <div className="text-xs text-gray-400">Budget: ${(currentCountry.intelligence.budget / 1000000000).toFixed(1)}B</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCountry.intelligence.agencies}%` }}
                />
              </div>
            </div>
          </div>

          {/* Events from Last Turn */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              אירועים מהתור האחרון
            </h3>
            <div className="bg-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto">
              {gameState.events.slice(0, 3).map((event) => (
                <div key={event.id} className="mb-2 last:mb-0">
                  <div className="text-xs font-semibold text-yellow-400">{event.title}</div>
                  <div className="text-xs text-gray-300">{event.description}</div>
                </div>
              ))}
              {gameState.events.length === 0 && (
                <div className="text-xs text-gray-400">אין אירועים חדשים</div>
              )}
            </div>
          </div>

          {/* System Messages */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              הודעות מערכת
            </h3>
            <div className="bg-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto">
              <div className="text-xs text-green-400 mb-1">✓ כל המערכות פעילות</div>
              <div className="text-xs text-blue-400 mb-1">ℹ תור {gameState.turn} פעיל</div>
              <div className="text-xs text-yellow-400">⚠ {threat.count} איומים זוהו</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-md font-bold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                onClick={() => executeAction('military_exercise')}
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Exercise
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                onClick={() => executeAction('invest_infrastructure')}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Invest
              </button>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                onClick={() => executeAction('improve_relations')}
              >
                <Globe className="w-4 h-4 inline mr-1" />
                Diplomacy
              </button>
              <button 
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
                onClick={() => executeAction('gather_intelligence')}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Intel
              </button>
            </div>
          </div>

          {/* Continue to Next Turn Button */}
          <div className="mb-6">
            <button
              onClick={handleEndTurn}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg"
            >
              המשך לתור הבא
            </button>
          </div>

          {/* Recent News */}
          <div>
            <h3 className="text-md font-bold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Latest News
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {gameState.news.slice(0, 5).map((news) => (
                <div key={news.id} className="p-2 bg-gray-700 rounded text-xs">
                  <div className="font-semibold text-white mb-1">{news.headline}</div>
                  <div className="text-gray-300">{news.content}</div>
                  <div className="text-gray-400 mt-1">Turn {gameState.turn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Google Maps */}
        <div className="flex-1 p-2 md:p-4">
          <div className="h-full">
            <GoogleMapComponent 
              gameState={gameState} 
              onCountryClick={handleCountryClick}
              activeSimulation={activeSimulation}
            />
          </div>
        </div>

        {/* Right Sidebar - Detailed Info */}
        <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          {selectedCountry ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{gameState.countries[selectedCountry].flag}</span>
                <div>
                  <h2 className="text-lg font-bold">{gameState.countries[selectedCountry].name}</h2>
                  <p className="text-gray-400 text-sm">{gameState.countries[selectedCountry].capital}</p>
                </div>
              </div>

              {/* Country Details */}
              <div className="space-y-4">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h3 className="font-bold mb-2">Military Strength</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(gameState.countries[selectedCountry].military.units).map(([unit, strength]) => (
                      <div key={unit} className="flex justify-between">
                        <span className="capitalize text-gray-300">{unit}:</span>
                        <span className="text-white">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700 p-3 rounded-lg">
                  <h3 className="font-bold mb-2">Relations</h3>
                  <div className="text-sm">
                    {selectedCountry !== gameState.currentPlayer && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">With You:</span>
                        <span className={`font-bold ${
                          (currentCountry.diplomacy.relationships[selectedCountry] || 0) > 0 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {currentCountry.diplomacy.relationships[selectedCountry] || 0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCountry !== gameState.currentPlayer && (
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <h3 className="font-bold mb-3">Available Actions</h3>
                    <div className="space-y-2">
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        onClick={() => executeAction('diplomatic_meeting', selectedCountry)}
                      >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Diplomatic Summit
                      </button>
                      <button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        onClick={() => executeAction('trade_agreement', selectedCountry)}
                      >
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Trade Agreement
                      </button>
                      <button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        onClick={() => executeAction('cyber_attack', selectedCountry)}
                      >
                        <Cpu className="w-4 h-4 inline mr-2" />
                        Cyber Attack
                      </button>
                      <button 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        onClick={() => executeAction('troop_movement', selectedCountry)}
                      >
                        <Users className="w-4 h-4 inline mr-2" />
                        Deploy Forces
                      </button>
                      <button 
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        onClick={() => executeAction('economic_sanctions', selectedCountry)}
                      >
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        Economic Sanctions
                      </button>
                      {(currentCountry.diplomacy.relationships[selectedCountry] || 0) < -30 && (
                        <button 
                          className="w-full bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded text-sm transition-colors"
                          onClick={() => executeAction('missile_attack', selectedCountry)}
                        >
                          <Target className="w-4 h-4 inline mr-2" />
                          Missile Strike
                        </button>
                      )}
                      {(currentCountry.diplomacy.relationships[selectedCountry] || 0) < -70 && (
                        <button 
                          className="w-full bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded text-sm transition-colors"
                          onClick={() => executeAction('declare_war', selectedCountry)}
                        >
                          <Sword className="w-4 h-4 inline mr-2" />
                          Declare War
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-8">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click on a country on the map to view details and available actions</p>
            </div>
          )}

          {/* Global Factors */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-bold mb-3">Global Factors</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Oil Price:</span>
                <span className="text-white">${gameState.globalFactors.oilPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Global Tension:</span>
                <span className={`font-bold ${
                  gameState.globalFactors.globalTension > 70 ? 'text-red-400' :
                  gameState.globalFactors.globalTension > 40 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {gameState.globalFactors.globalTension.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Economic Growth:</span>
                <span className={`font-bold ${
                  gameState.globalFactors.economicGrowth > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {gameState.globalFactors.economicGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Turn Results Screen */}
      <TurnResultsScreen
        isOpen={showTurnResults}
        onClose={() => setShowTurnResults(false)}
        gameState={gameState}
        previousState={previousGameState}
        isDayMode={false}
      />

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={showSimulationModal}
        onClose={() => {
          setShowSimulationModal(false);
          setPendingSimulation(null);
        }}
        simulation={pendingSimulation}
        onComplete={handleSimulationComplete}
      />
    </div>
  );
};