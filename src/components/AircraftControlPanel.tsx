import React, { useState } from 'react';
import { X, Plane, Target, MapPin, Users, Clock } from 'lucide-react';
import { calculateAircraftFlightTime, AIRCRAFT_TYPES, COUNTRY_COORDINATES } from '../utils/distanceCalculator';

interface AircraftControlPanelProps {
  onClose: () => void;
  onLaunchAircraft: (missionData: any) => void;
  isDayMode: boolean;
}

const AIRBASES = [
  { id: 'ramat_david', name: 'רמת דוד', location: 'צפון', coordinates: [32.6650, 35.1833] },
  { id: 'tel_nof', name: 'תל נוף', location: 'מרכז', coordinates: [31.8380, 34.8220] },
  { id: 'nevatim', name: 'נבטים', location: 'דרום', coordinates: [31.2300, 34.6900] },
  { id: 'hatzerim', name: 'חצרים', location: 'דרום', coordinates: [31.2300, 34.6600] }
];

const AIRCRAFT_SQUADRONS = {
  ramat_david: [
    { type: 'f16', available: 12, name: 'F-16I סופה' },
    { type: 'apache', available: 8, name: 'AH-64 אפאצ\'י' }
  ],
  tel_nof: [
    { type: 'f35', available: 6, name: 'F-35I אדיר' },
    { type: 'f15', available: 10, name: 'F-15I רעם' }
  ],
  nevatim: [
    { type: 'f16', available: 18, name: 'F-16I סופה' },
    { type: 'f15', available: 8, name: 'F-15I רעם' }
  ],
  hatzerim: [
    { type: 'f16', available: 14, name: 'F-16I סופה' },
    { type: 'apache', available: 6, name: 'AH-64 אפאצ\'י' }
  ]
};

const TARGET_COUNTRIES = [
  { id: 'iran', name: 'איראן', priority: 'high' },
  { id: 'syria', name: 'סוריה', priority: 'high' },
  { id: 'iraq', name: 'עיראק', priority: 'medium' },
  { id: 'turkey', name: 'טורקיה', priority: 'medium' }
];

const MISSION_TYPES = [
  { id: 'air_strike', name: 'תקיפה אווירית', description: 'תקיפת מטרות קרקע' },
  { id: 'reconnaissance', name: 'סיור', description: 'איסוף מידע מודיעיני' },
  { id: 'escort', name: 'ליווי', description: 'ליווי כלי טיס אחרים' },
  { id: 'patrol', name: 'סיור אווירי', description: 'סיור הגנתי באווירה' }
];

export const AircraftControlPanel: React.FC<AircraftControlPanelProps> = ({
  onClose,
  onLaunchAircraft,
  isDayMode
}) => {
  const [selectedAirbase, setSelectedAirbase] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [aircraftCount, setAircraftCount] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedMission, setSelectedMission] = useState('');

  const calculateMissionDetails = () => {
    if (!selectedAirbase || !selectedAircraft || !selectedTarget) return null;
    
    const flightTimes = calculateAircraftFlightTime('israel', selectedTarget, selectedAircraft);
    const aircraft = AIRCRAFT_TYPES[selectedAircraft];
    
    return {
      flightTimes,
      aircraft,
      fuelConsumption: Math.round(flightTimes.total * 0.8), // Estimated fuel consumption
      successRate: Math.max(60, Math.min(95, 85 - (flightTimes.total * 0.5)))
    };
  };

  const handleLaunchMission = () => {
    if (!selectedAirbase || !selectedAircraft || !selectedTarget || !selectedMission) {
      alert('יש לבחור את כל הפרמטרים');
      return;
    }

    const missionDetails = calculateMissionDetails();
    if (!missionDetails) return;

    if (missionDetails.flightTimes.total === -1) {
      alert('המטרה מחוץ לטווח הכלי טיס');
      return;
    }

    const missionData = {
      airbase: selectedAirbase,
      aircraft: selectedAircraft,
      aircraftCount,
      target: selectedTarget,
      missionType: selectedMission,
      flightTimes: missionDetails.flightTimes,
      timestamp: new Date()
    };

    onLaunchAircraft(missionData);
    onClose();
  };

  const missionDetails = calculateMissionDetails();
  const availableAircraft = selectedAirbase ? AIRCRAFT_SQUADRONS[selectedAirbase as keyof typeof AIRCRAFT_SQUADRONS] || [] : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מרכז בקרת טיסות
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

        <div className="p-4 md:p-6 space-y-6">
          {/* Airbase Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              בחירת בסיס אוויר
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {AIRBASES.map((airbase) => (
                <button
                  key={airbase.id}
                  onClick={() => {
                    setSelectedAirbase(airbase.id);
                    setSelectedAircraft('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAirbase === airbase.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className={`font-medium text-sm ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {airbase.name}
                    </span>
                  </div>
                  <p className={`text-xs ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {airbase.location}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Aircraft Selection */}
          {selectedAirbase && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                בחירת כלי טיס
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableAircraft.map((squadron) => (
                  <button
                    key={squadron.type}
                    onClick={() => setSelectedAircraft(squadron.type)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedAircraft === squadron.type
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : isDayMode
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-green-500" />
                      <span className={`font-medium ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {squadron.name}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className={`${isDayMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        זמינים: {squadron.available} כלי טיס
                      </div>
                      <div className={`${isDayMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        מהירות: {AIRCRAFT_TYPES[squadron.type]?.speed} קמ"ש
                      </div>
                      <div className={`${isDayMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        טווח: {AIRCRAFT_TYPES[squadron.type]?.range} ק"מ
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Aircraft Count */}
          {selectedAircraft && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                כמות כלי טיס
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max={availableAircraft.find(s => s.type === selectedAircraft)?.available || 1}
                  value={aircraftCount}
                  onChange={(e) => setAircraftCount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className={`px-4 py-2 rounded-lg border ${
                  isDayMode ? 'border-gray-300 bg-gray-50' : 'border-gray-600 bg-gray-700'
                }`}>
                  <span className={`font-bold text-lg ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    {aircraftCount}
                  </span>
                  <span className={`text-sm ml-2 ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    כלי טיס
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Target Selection */}
          {selectedAircraft && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                בחירת יעד
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TARGET_COUNTRIES.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => setSelectedTarget(target.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedTarget === target.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : isDayMode
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {target.name}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        target.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {target.priority === 'high' ? 'עדיפות גבוהה' : 'עדיפות בינונית'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mission Type */}
          {selectedTarget && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                סוג משימה
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MISSION_TYPES.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => setSelectedMission(mission.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedMission === mission.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : isDayMode
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-medium mb-1 ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {mission.name}
                    </div>
                    <div className={`text-sm ${
                      isDayMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {mission.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mission Summary */}
          {missionDetails && selectedMission && (
            <div className={`p-4 rounded-lg ${
              isDayMode ? 'bg-gray-50' : 'bg-gray-700'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                סיכום משימה
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-blue-600' : 'text-blue-400'
                  }`}>
                    {Math.round(missionDetails.flightTimes.outbound)}
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    דקות הלוך
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-green-600' : 'text-green-400'
                  }`}>
                    {Math.round(missionDetails.flightTimes.return)}
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    דקות חזור
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-orange-600' : 'text-orange-400'
                  }`}>
                    {Math.round(missionDetails.flightTimes.total)}
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    סה"כ דקות
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-purple-600' : 'text-purple-400'
                  }`}>
                    {Math.round(missionDetails.successRate)}%
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    סיכוי הצלחה
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Launch Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLaunchMission}
              disabled={!selectedAirbase || !selectedAircraft || !selectedTarget || !selectedMission}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedAirbase && selectedAircraft && selectedTarget && selectedMission
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              ✈️ שגר משימה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};