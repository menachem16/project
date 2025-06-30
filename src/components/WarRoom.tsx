import React, { useState, useEffect, useRef } from 'react';
import { GoogleMapComponent } from './GoogleMapComponent';
import { AttackControlPanel } from './AttackControlPanel';
import { AircraftControlPanel } from './AircraftControlPanel';
import { DefenseSystemPanel } from './DefenseSystemPanel';
import { ThreatMonitor } from './ThreatMonitor';
import { EventLogger } from './EventLogger';
import { IntelligencePanel } from './IntelligencePanel';
import { CyberWarfarePanel } from './CyberWarfarePanel';
import { CommunicationsPanel } from './CommunicationsPanel';
import { SatellitePanel } from './SatellitePanel';
import { DatabasePanel } from './DatabasePanel';
import { SettingsPanel } from './SettingsPanel';
import { NewsMediaPanel } from './NewsMediaPanel';
import { DecisionsActionsPanel } from './DecisionsActionsPanel';
import { StateDashboard } from './StateDashboard';
import { TurnResultsScreen } from './TurnResultsScreen';
import { AudioSystem, AudioSystemRef } from './AudioSystem';
import { GameState } from '../types/game';
import { calculateMissileFlightTime, calculateInterceptionWindow } from '../utils/distanceCalculator';
import { 
  Shield, 
  Target, 
  Radio, 
  AlertTriangle, 
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Activity,
  Zap,
  Eye,
  Satellite,
  Database,
  Newspaper,
  Briefcase,
  BarChart3,
  Plane
} from 'lucide-react';

interface WarRoomProps {
  gameState: GameState;
  onAction: (action: any) => void;
}

export const WarRoom: React.FC<WarRoomProps> = ({ gameState, onAction }) => {
  const [activePanel, setActivePanel] = useState<string>('');
  const [isDayMode, setIsDayMode] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [threats, setThreats] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeMissiles, setActiveMissiles] = useState<any[]>([]);
  const [activeAircraft, setActiveAircraft] = useState<any[]>([]);
  const [showTurnResults, setShowTurnResults] = useState(false);
  const [previousGameState, setPreviousGameState] = useState<GameState | undefined>();
  const [defenseStatus, setDefenseStatus] = useState({
    ironDome: true,
    arrow3: true,
    davidSling: true
  });

  const audioRef = useRef<AudioSystemRef>(null);

  // Generate random threats and enemy missiles
  useEffect(() => {
    const generateThreat = () => {
      const threatTypes = [
        { type: 'missile', source: 'Gaza', severity: 'high' },
        { type: 'rocket', source: 'Lebanon', severity: 'medium' },
        { type: 'drone', source: 'Syria', severity: 'low' },
        { type: 'cyber', source: 'Iran', severity: 'high' }
      ];

      const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const newThreat = {
        id: Date.now(),
        ...threat,
        timestamp: new Date(),
        intercepted: false
      };

      setThreats(prev => [...prev, newThreat]);
      
      if (audioEnabled) {
        audioRef.current?.playAlert('threat_detected');
        audioRef.current?.playAmbient('alert_beep');
      }

      addEvent({
        type: 'defense',
        message: `איום ${threat.type} זוהה מ${threat.source}`,
        severity: 'warning'
      });

      // Auto-intercept based on defense systems with realistic timing
      if (defenseStatus.ironDome && threat.type === 'rocket') {
        const interceptionWindow = calculateInterceptionWindow(2, 'iron_dome');
        setTimeout(() => interceptThreat(newThreat.id), interceptionWindow.interceptTime * 60 * 1000);
      } else if (defenseStatus.arrow3 && threat.type === 'missile') {
        const interceptionWindow = calculateInterceptionWindow(8, 'arrow3');
        setTimeout(() => interceptThreat(newThreat.id), interceptionWindow.interceptTime * 60 * 1000);
      }
    };

    // Generate enemy missile attacks with realistic timing
    const generateEnemyMissile = () => {
      const enemies = Object.entries(gameState.countries[gameState.currentPlayer]?.diplomacy.relationships || {})
        .filter(([_, relation]) => relation < -50)
        .map(([countryId]) => countryId);

      if (enemies.length > 0) {
        const attacker = enemies[Math.floor(Math.random() * enemies.length)];
        
        // Calculate realistic flight time
        const realFlightTime = calculateMissileFlightTime(attacker, gameState.currentPlayer, 'scud');
        
        if (realFlightTime > 0) {
          const missile = {
            id: Date.now(),
            from: attacker,
            to: gameState.currentPlayer,
            type: 'ballistic',
            flightTime: realFlightTime, // Real flight time in minutes
            timestamp: new Date()
          };

          setActiveMissiles(prev => [...prev, missile]);
          
          if (audioEnabled) {
            audioRef.current?.playAlert('missile_incoming');
            audioRef.current?.playAmbient('missile_launch');
          }

          addEvent({
            type: 'attack',
            message: `טיל בליסטי שוגר מ${gameState.countries[attacker]?.name} לעבר ישראל - זמן טיסה: ${Math.round(realFlightTime)} דקות`,
            severity: 'error'
          });

          // Remove missile after realistic flight time
          setTimeout(() => {
            setActiveMissiles(prev => prev.filter(m => m.id !== missile.id));
            
            // Create explosion event
            addEvent({
              type: 'attack',
              message: `פגיעה ישירה - נזק למטרה`,
              severity: 'error'
            });

            if (audioEnabled) {
              audioRef.current?.playAlert('target_eliminated');
            }
          }, realFlightTime * 60 * 1000); // Convert minutes to milliseconds
        }
      }
    };

    const threatInterval = setInterval(generateThreat, Math.random() * 90000 + 30000);
    const missileInterval = setInterval(generateEnemyMissile, Math.random() * 180000 + 120000);
    
    return () => {
      clearInterval(threatInterval);
      clearInterval(missileInterval);
    };
  }, [audioEnabled, defenseStatus, gameState]);

  const interceptThreat = (threatId: number) => {
    setThreats(prev => prev.map(threat => 
      threat.id === threatId ? { ...threat, intercepted: true } : threat
    ));
    
    addEvent({
      type: 'defense',
      message: 'יירוט מוצלח של איום נכנס',
      severity: 'success'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('successful_intercept');
    }
  };

  const addEvent = (event: any) => {
    const newEvent = {
      id: Date.now(),
      timestamp: new Date(),
      ...event
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  };

  const handleAttack = (attackData: any) => {
    // Calculate realistic flight time
    const realFlightTime = calculateMissileFlightTime(gameState.currentPlayer, attackData.target, attackData.weapon);
    
    if (realFlightTime <= 0) {
      alert('המטרה מחוץ לטווח הנשק');
      return;
    }

    const missile = {
      id: Date.now(),
      from: gameState.currentPlayer,
      to: attackData.target,
      type: attackData.weapon,
      flightTime: realFlightTime, // Real flight time in minutes
      timestamp: new Date()
    };

    setActiveMissiles(prev => [...prev, missile]);

    addEvent({
      type: 'attack',
      message: `תקיפה שוגרה: ${attackData.weapon} לעבר ${attackData.city}, ${attackData.target} - זמן טיסה: ${Math.round(realFlightTime)} דקות`,
      severity: 'warning'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('missile_launched');
      audioRef.current?.playAlert('operation_commenced');
      audioRef.current?.playAmbient('missile_launch');
    }

    // Remove missile after realistic flight time
    setTimeout(() => {
      setActiveMissiles(prev => prev.filter(m => m.id !== missile.id));
      
      const success = Math.random() < (attackData.successRate / 100);
      addEvent({
        type: 'attack',
        message: success ? 'פגיעה מדויקת במטרה' : 'הטיל יורט או החטיא',
        severity: success ? 'success' : 'warning'
      });

      if (audioEnabled) {
        audioRef.current?.playAlert(success ? 'target_eliminated' : 'operation_failed');
      }
    }, realFlightTime * 60 * 1000); // Convert minutes to milliseconds

    onAction({
      type: 'launch_attack',
      ...attackData
    });
  };

  const handleAircraftLaunch = (missionData: any) => {
    setActiveAircraft(prev => [...prev, missionData]);

    addEvent({
      type: 'attack',
      message: `משימה אווירית שוגרה: ${missionData.aircraftCount} ${missionData.aircraft} לעבר ${missionData.target}`,
      severity: 'info'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('operation_commenced');
    }

    // Remove aircraft mission after total flight time
    setTimeout(() => {
      setActiveAircraft(prev => prev.filter(m => m.id !== missionData.id));
      
      addEvent({
        type: 'attack',
        message: `משימה אווירית הושלמה בהצלחה - כלי הטיס חזרו לבסיס`,
        severity: 'success'
      });

      if (audioEnabled) {
        audioRef.current?.playAlert('mission_accomplished');
      }
    }, missionData.flightTimes.total * 60 * 1000); // Convert minutes to milliseconds

    onAction({
      type: 'launch_aircraft',
      ...missionData
    });
  };

  const toggleDefenseSystem = (system: string) => {
    setDefenseStatus(prev => ({
      ...prev,
      [system]: !prev[system as keyof typeof prev]
    }));

    const systemNames = {
      ironDome: 'כיפת ברזל',
      arrow3: 'חץ 3',
      davidSling: 'קלע דוד'
    };

    addEvent({
      type: 'system',
      message: `מערכת ${systemNames[system as keyof typeof systemNames]} ${defenseStatus[system as keyof typeof defenseStatus] ? 'הושבתה' : 'הופעלה'}`,
      severity: 'info'
    });

    if (audioEnabled && !defenseStatus[system as keyof typeof defenseStatus]) {
      audioRef.current?.playAlert('defense_ready');
    }
  };

  const handleIntelligenceOperation = (operation: any) => {
    addEvent({
      type: 'intelligence',
      message: `מבצע מודיעיני: ${operation.type} - ${operation.target}`,
      severity: 'info'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('intelligence_gathered');
    }

    onAction({
      type: 'intelligence_operation',
      ...operation
    });
  };

  const handleCyberOperation = (operation: any) => {
    addEvent({
      type: 'system',
      message: `מבצע סייבר: ${operation.type} נגד ${operation.target}`,
      severity: 'warning'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('cyber_attack');
    }

    onAction({
      type: 'cyber_operation',
      ...operation
    });
  };

  const handleCommunicationsOperation = (operation: any) => {
    addEvent({
      type: 'system',
      message: `פעולת תקשורת: ${operation.type}`,
      severity: 'info'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('diplomatic_contact');
    }

    onAction({
      type: 'communications_operation',
      ...operation
    });
  };

  const handleSatelliteOperation = (operation: any) => {
    addEvent({
      type: 'system',
      message: `פעולת לוויין: ${operation.type}`,
      severity: 'info'
    });

    if (audioEnabled) {
      audioRef.current?.playAlert('surveillance_active');
    }

    onAction({
      type: 'satellite_operation',
      ...operation
    });
  };

  const handleDatabaseOperation = (operation: any) => {
    addEvent({
      type: 'system',
      message: `פעולת מאגר מידע: ${operation.type}`,
      severity: 'info'
    });

    onAction({
      type: 'database_operation',
      ...operation
    });
  };

  const handleGameAction = (action: any) => {
    if (action.type === 'end_turn') {
      setPreviousGameState(gameState);
      setShowTurnResults(true);
    }
    onAction(action);
  };

  const closePanel = () => {
    setActivePanel('');
  };

  const actionButtons = [
    { id: 'attack', icon: Target, color: 'bg-red-500 hover:bg-red-600', title: 'מרכז בקרת תקיפות' },
    { id: 'aircraft', icon: Plane, color: 'bg-sky-500 hover:bg-sky-600', title: 'מרכז בקרת טיסות' },
    { id: 'defense', icon: Shield, color: 'bg-blue-500 hover:bg-blue-600', title: 'מערכות הגנה אווירית' },
    { id: 'threats', icon: AlertTriangle, color: 'bg-orange-500 hover:bg-orange-600', title: 'מוקד ניטור איומים' },
    { id: 'events', icon: Activity, color: 'bg-purple-500 hover:bg-purple-600', title: 'יומן אירועים' },
    { id: 'intelligence', icon: Eye, color: 'bg-indigo-500 hover:bg-indigo-600', title: 'מרכז מודיעין' },
    { id: 'cyber', icon: Zap, color: 'bg-green-500 hover:bg-green-600', title: 'מרכז לוחמה סייברנטית' },
    { id: 'satellite', icon: Satellite, color: 'bg-teal-500 hover:bg-teal-600', title: 'מערכות לוויין' },
    { id: 'communications', icon: Radio, color: 'bg-pink-500 hover:bg-pink-600', title: 'מרכז תקשורת' },
    { id: 'database', icon: Database, color: 'bg-yellow-500 hover:bg-yellow-600', title: 'מאגר מידע' },
    { id: 'news', icon: Newspaper, color: 'bg-cyan-500 hover:bg-cyan-600', title: 'חדשות ומדיה' },
    { id: 'decisions', icon: Briefcase, color: 'bg-violet-500 hover:bg-violet-600', title: 'החלטות ופעולות' },
    { id: 'dashboard', icon: BarChart3, color: 'bg-emerald-500 hover:bg-emerald-600', title: 'מצב המדינה' },
    { id: 'settings', icon: Settings, color: 'bg-gray-500 hover:bg-gray-600', title: 'הגדרות מערכת' }
  ];

  return (
    <div className={`min-h-screen relative transition-all duration-500 ${
      isDayMode ? 'bg-blue-50' : 'bg-gray-900'
    }`}>
      {/* Main Map Container */}
      <div className="absolute inset-0">
        <GoogleMapComponent 
          gameState={gameState}
          onCountryClick={() => {}}
          isDayMode={isDayMode}
          threats={threats}
          events={events}
          activeMissiles={activeMissiles}
          activeAircraft={activeAircraft}
        />
      </div>

      {/* Top Control Bar - Mobile Responsive */}
      <div className={`absolute top-0 left-0 right-0 z-40 ${
        isDayMode ? 'bg-white/95' : 'bg-gray-800/95'
      } backdrop-blur-sm border-b border-gray-300/50 p-2 sm:p-3 md:p-4`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-wrap">
            <h1 className={`text-sm sm:text-lg md:text-2xl font-bold ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              🇮🇱 מרכז פיקוד ובקרה
            </h1>
            <div className={`px-1 sm:px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
              threats.filter(t => !t.intercepted).length > 0 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-green-500 text-white'
            }`}>
              {threats.filter(t => !t.intercepted).length > 0 
                ? `🚨 ${threats.filter(t => !t.intercepted).length} איומים`
                : '✅ נקי'
              }
            </div>
            <div className={`px-1 sm:px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
              activeMissiles.length > 0 
                ? 'bg-orange-500 text-white animate-pulse' 
                : 'bg-blue-500 text-white'
            }`}>
              {activeMissiles.length > 0 
                ? `🚀 ${activeMissiles.length} טילים`
                : '🎯 מוכן'
              }
            </div>
            <div className={`px-1 sm:px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
              activeAircraft.length > 0 
                ? 'bg-sky-500 text-white animate-pulse' 
                : 'bg-gray-500 text-white'
            }`}>
              {activeAircraft.length > 0 
                ? `✈️ ${activeAircraft.reduce((sum, mission) => sum + mission.aircraftCount, 0)} מטוסים`
                : '🛩️ זמין'
              }
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-1 sm:p-2 rounded-lg transition-colors ${
                audioEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}
              title={audioEnabled ? 'השתק קול' : 'הפעל קול'}
            >
              {audioEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            </button>
            
            <button
              onClick={() => setIsDayMode(!isDayMode)}
              className={`p-1 sm:p-2 rounded-lg transition-colors ${
                isDayMode 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
              title={isDayMode ? 'מצב לילה' : 'מצב יום'}
            >
              {isDayMode ? <Sun className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons - Mobile Responsive Grid */}
      <div className="absolute left-1 sm:left-2 md:left-4 top-12 sm:top-16 md:top-24 z-30">
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2 md:gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {actionButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActivePanel(activePanel === button.id ? '' : button.id)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 text-white ${
                activePanel === button.id
                  ? button.color.replace('hover:', '') + ' ring-2 ring-white'
                  : button.color
              }`}
              title={button.title}
            >
              <button.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 mx-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Active Threats Alert - Mobile Responsive */}
      {threats.filter(t => !t.intercepted).length > 0 && (
        <div className="absolute top-12 sm:top-16 md:top-20 left-1/2 transform -translate-x-1/2 z-50 px-2">
          <div className="bg-red-600 text-white px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-center gap-1 sm:gap-2">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="font-bold text-xs sm:text-sm md:text-base">
                🚨 {threats.filter(t => !t.intercepted).length} איומים פעילים
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Missiles Alert - Mobile Responsive */}
      {activeMissiles.length > 0 && (
        <div className="absolute top-20 sm:top-28 md:top-36 left-1/2 transform -translate-x-1/2 z-50 px-2">
          <div className="bg-orange-600 text-white px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-1 sm:gap-2">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="font-bold text-xs sm:text-sm md:text-base">
                🚀 {activeMissiles.length} טילים פעילים
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Aircraft Alert - Mobile Responsive */}
      {activeAircraft.length > 0 && (
        <div className="absolute top-28 sm:top-40 md:top-52 left-1/2 transform -translate-x-1/2 z-50 px-2">
          <div className="bg-sky-600 text-white px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-center gap-1 sm:gap-2">
              <Plane className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="font-bold text-xs sm:text-sm md:text-base">
                ✈️ {activeAircraft.reduce((sum, mission) => sum + mission.aircraftCount, 0)} מטוסים במשימה
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Panel Content with proper z-index and mobile responsiveness */}
      {activePanel && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
            {activePanel === 'attack' && (
              <AttackControlPanel
                onClose={closePanel}
                onAttack={handleAttack}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'aircraft' && (
              <AircraftControlPanel
                onClose={closePanel}
                onLaunchAircraft={handleAircraftLaunch}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'defense' && (
              <DefenseSystemPanel
                onClose={closePanel}
                defenseStatus={defenseStatus}
                onToggleSystem={toggleDefenseSystem}
                threats={threats}
                onIntercept={interceptThreat}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'threats' && (
              <ThreatMonitor
                onClose={closePanel}
                threats={threats}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'events' && (
              <EventLogger
                onClose={closePanel}
                events={events}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'intelligence' && (
              <IntelligencePanel
                onClose={closePanel}
                onOperation={handleIntelligenceOperation}
                isDayMode={isDayMode}
                gameState={gameState}
              />
            )}

            {activePanel === 'cyber' && (
              <CyberWarfarePanel
                onClose={closePanel}
                onOperation={handleCyberOperation}
                isDayMode={isDayMode}
                gameState={gameState}
              />
            )}

            {activePanel === 'communications' && (
              <CommunicationsPanel
                onClose={closePanel}
                onOperation={handleCommunicationsOperation}
                isDayMode={isDayMode}
                gameState={gameState}
              />
            )}

            {activePanel === 'satellite' && (
              <SatellitePanel
                onClose={closePanel}
                onOperation={handleSatelliteOperation}
                isDayMode={isDayMode}
                gameState={gameState}
              />
            )}

            {activePanel === 'database' && (
              <DatabasePanel
                onClose={closePanel}
                onOperation={handleDatabaseOperation}
                isDayMode={isDayMode}
                gameState={gameState}
              />
            )}

            {activePanel === 'news' && (
              <NewsMediaPanel
                onClose={closePanel}
                gameState={gameState}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'decisions' && (
              <DecisionsActionsPanel
                onClose={closePanel}
                onAction={handleGameAction}
                gameState={gameState}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'dashboard' && (
              <StateDashboard
                onClose={closePanel}
                gameState={gameState}
                onAction={handleGameAction}
                isDayMode={isDayMode}
              />
            )}

            {activePanel === 'settings' && (
              <SettingsPanel
                onClose={closePanel}
                isDayMode={isDayMode}
                audioEnabled={audioEnabled}
                onToggleAudio={() => setAudioEnabled(!audioEnabled)}
                onToggleDayMode={() => setIsDayMode(!isDayMode)}
              />
            )}
          </div>
        </div>
      )}

      {/* Turn Results Screen */}
      <TurnResultsScreen
        isOpen={showTurnResults}
        onClose={() => setShowTurnResults(false)}
        gameState={gameState}
        previousState={previousGameState}
        isDayMode={false}
      />

      {/* Audio System */}
      <AudioSystem 
        enabled={audioEnabled}
        ref={audioRef}
      />
    </div>
  );
};