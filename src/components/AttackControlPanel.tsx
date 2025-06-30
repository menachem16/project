import React, { useState, useEffect } from 'react';
import { X, Target, MapPin, Zap } from 'lucide-react';
import { calculateMissileFlightTime } from '../utils/distanceCalculator';

interface AttackControlPanelProps {
  onClose: () => void;
  onAttack: (attackData: any) => void;
  isDayMode: boolean;
}

const LAUNCH_SITES = [
  { id: 'north', name: 'בסיס צפון', location: 'רמת דוד', coordinates: [32.6650, 35.1833] },
  { id: 'center', name: 'בסיס מרכז', location: 'תל נוף', coordinates: [31.8380, 34.8220] },
  { id: 'south', name: 'בסיס דרום', location: 'נבטים', coordinates: [31.2300, 34.6900] }
];

const WEAPONS = {
  north: [
    { id: 'arrow3', name: 'חץ 3', range: 2400, type: 'interceptor' },
    { id: 'iron_dome', name: 'כיפת ברזל', range: 70, type: 'defense' },
    { id: 'spike', name: 'ספייק NLOS', range: 25, type: 'tactical' },
    { id: 's400', name: 'S-400', range: 400, type: 'defense' },
    { id: 'patriot', name: 'פטריוט', range: 160, type: 'defense' },
  ],
  center: [
    { id: 'jericho3', name: 'יריחו III', range: 4800, type: 'strategic' },
    { id: 'delilah', name: 'דלילה', range: 250, type: 'cruise' },
    { id: 'popeye', name: 'פופאי', range: 1500, type: 'standoff' },
    { id: 'shahed136', name: 'שהד-136', range: 2500, type: 'cruise' },
  ],
  south: [
    { id: 'david_sling', name: 'קלע דוד', range: 300, type: 'interceptor' },
    { id: 'iron_beam', name: 'קרן ברזל', range: 7, type: 'laser' },
    { id: 'tamuz', name: 'תמוז', range: 25, type: 'tactical' },
    { id: 'patriot', name: 'פטריוט', range: 160, type: 'defense' },
  ]
};

const TARGETS = [
  { 
    id: 'iran', 
    name: 'איראן', 
    cities: ['טהרן', 'אספהאן', 'נתנז', 'פורדו'],
    distance: 1600,
    defenseLevel: 'high'
  },
  { 
    id: 'lebanon', 
    name: 'לבנון', 
    cities: ['ביירות', 'בעלבק', 'צידון', 'צור'],
    distance: 120,
    defenseLevel: 'medium'
  },
  { 
    id: 'syria', 
    name: 'סוריה', 
    cities: ['דמשק', 'חלב', 'חומס', 'לטקיה'],
    distance: 200,
    defenseLevel: 'low'
  },
  { 
    id: 'gaza', 
    name: 'עזה', 
    cities: ['עזה', 'חאן יונס', 'רפיח', 'ג\'באליה'],
    distance: 70,
    defenseLevel: 'low'
  },
  { id: 'uae', name: 'איחוד האמירויות', cities: ['אבו דאבי', 'דובאי'], distance: 2100, defenseLevel: 'medium' },
  { id: 'qatar', name: 'קטר', cities: ['דוחה'], distance: 1800, defenseLevel: 'medium' },
  { id: 'bahrain', name: 'בחריין', cities: ['מנאמה'], distance: 1700, defenseLevel: 'medium' },
  { id: 'oman', name: 'עומאן', cities: ['מסקט'], distance: 2500, defenseLevel: 'medium' },
  { id: 'kuwait', name: 'כווית', cities: ['כווית סיטי'], distance: 1600, defenseLevel: 'medium' },
  { id: 'yemen', name: 'תימן', cities: ['צנעא'], distance: 2400, defenseLevel: 'low' },
  { id: 'libya', name: 'לוב', cities: ['טריפולי'], distance: 2200, defenseLevel: 'medium' },
  { id: 'sudan', name: 'סודן', cities: ['חרטום'], distance: 1800, defenseLevel: 'low' },
  { id: 'morocco', name: 'מרוקו', cities: ['רבאט', 'קזבלנקה'], distance: 3900, defenseLevel: 'medium' },
  { id: 'tunisia', name: 'תוניסיה', cities: ['תוניס'], distance: 2700, defenseLevel: 'medium' },
  { id: 'algeria', name: 'אלג׳יריה', cities: ['אלג׳יר'], distance: 3200, defenseLevel: 'medium' },
  { id: 'pakistan', name: 'פקיסטן', cities: ['איסלאמאבאד', 'קראצ׳י'], distance: 4000, defenseLevel: 'high' },
  { id: 'afghanistan', name: 'אפגניסטן', cities: ['קאבול'], distance: 4200, defenseLevel: 'high' },
  { id: 'cyprus', name: 'קפריסין', cities: ['ניקוסיה'], distance: 400, defenseLevel: 'low' },
  { id: 'greece', name: 'יוון', cities: ['אתונה'], distance: 1200, defenseLevel: 'medium' },
];

export const AttackControlPanel: React.FC<AttackControlPanelProps> = ({
  onClose,
  onAttack,
  isDayMode
}) => {
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [outOfRange, setOutOfRange] = useState(false);

  const calculateFlightTime = () => {
    if (!selectedSite || !selectedWeapon || !selectedTarget) return 0;
    
    const target = TARGETS.find(t => t.id === selectedTarget);
    const weapon = WEAPONS[selectedSite as keyof typeof WEAPONS]?.find(w => w.id === selectedWeapon);
    
    if (!target || !weapon) return 0;
    
    // Simple calculation: distance / average speed
    const avgSpeed = weapon.type === 'strategic' ? 3000 : 800; // km/h
    return Math.round((target.distance / avgSpeed) * 60); // minutes
  };

  const calculateSuccessRate = () => {
    if (!selectedTarget || !selectedWeapon) return 0;
    
    const target = TARGETS.find(t => t.id === selectedTarget);
    const weapon = WEAPONS[selectedSite as keyof typeof WEAPONS]?.find(w => w.id === selectedWeapon);
    
    if (!target || !weapon) return 0;
    
    let baseRate = 85;
    
    // Adjust based on defense level
    if (target.defenseLevel === 'high') baseRate -= 30;
    else if (target.defenseLevel === 'medium') baseRate -= 15;
    
    // Adjust based on weapon type
    if (weapon.type === 'strategic') baseRate += 10;
    else if (weapon.type === 'tactical') baseRate -= 5;
    
    return Math.max(20, Math.min(95, baseRate));
  };

  // Check range whenever weapon or target changes
  useEffect(() => {
    if (!selectedSite || !selectedWeapon || !selectedTarget) {
      setOutOfRange(false);
      return;
    }
    // Use calculateMissileFlightTime for real range check
    const result = calculateMissileFlightTime('israel', selectedTarget, selectedWeapon);
    setOutOfRange(result === -1);
  }, [selectedSite, selectedWeapon, selectedTarget]);

  const handleLaunch = () => {
    if (!selectedSite || !selectedWeapon || !selectedTarget || !selectedCity) {
      alert('יש לבחור את כל הפרמטרים');
      return;
    }
    if (outOfRange) {
      alert('המטרה מחוץ לטווח הנשק');
      return;
    }
    const siteObj = LAUNCH_SITES.find(s => s.id === selectedSite);
    const attackData = {
      site: selectedSite,
      weapon: selectedWeapon,
      target: selectedTarget,
      city: selectedCity,
      flightTime: calculateFlightTime(),
      successRate: calculateSuccessRate(),
      timestamp: new Date(),
      launchCoordinates: siteObj ? siteObj.coordinates : undefined
    };
    onAttack(attackData);
    onClose();
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
              <Target className="w-8 h-8 text-red-500" />
              <h2 className={`text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מרכז בקרת תקיפות
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
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Launch Site Selection */}
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              בחירת אתר שיגור
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LAUNCH_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    setSelectedSite(site.id);
                    setSelectedWeapon('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSite === site.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className={`font-medium ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {site.name}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {site.location}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Weapon Selection */}
          {selectedSite && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                בחירת כלי נשק
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {WEAPONS[selectedSite as keyof typeof WEAPONS]?.map((weapon) => (
                  <button
                    key={weapon.id}
                    onClick={() => setSelectedWeapon(weapon.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedWeapon === weapon.id
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : isDayMode
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-red-500" />
                      <span className={`font-medium ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {weapon.name}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isDayMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      טווח: {weapon.range} ק"מ
                    </p>
                    <p className={`text-xs ${
                      isDayMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      סוג: {weapon.type}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Selection */}
          {selectedWeapon && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                בחירת מדינת יעד
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TARGETS.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => {
                      setSelectedTarget(target.id);
                      setSelectedCity('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTarget === target.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : isDayMode
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-medium mb-2 ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {target.name}
                    </div>
                    <p className={`text-sm ${
                      isDayMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      מרחק: {target.distance} ק"מ
                    </p>
                    <p className={`text-xs ${
                      isDayMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      רמת הגנה: {target.defenseLevel}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City Selection */}
          {selectedTarget && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                בחירת עיר יעד
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TARGETS.find(t => t.id === selectedTarget)?.cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedCity === city
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : isDayMode
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <span className={`font-medium ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {city}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attack Summary */}
          {selectedSite && selectedWeapon && selectedTarget && selectedCity && (
            <div className={`p-4 rounded-lg ${
              isDayMode ? 'bg-gray-50' : 'bg-gray-700'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                סיכום התקיפה
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-blue-600' : 'text-blue-400'
                  }`}>
                    {calculateFlightTime()}
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    דקות טיסה
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-green-600' : 'text-green-400'
                  }`}>
                    {calculateSuccessRate()}%
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    סיכוי הצלחה
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-orange-600' : 'text-orange-400'
                  }`}>
                    {TARGETS.find(t => t.id === selectedTarget)?.distance}
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    ק"מ מרחק
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    isDayMode ? 'text-red-600' : 'text-red-400'
                  }`}>
                    גבוה
                  </div>
                  <div className={`text-sm ${
                    isDayMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    רמת סיכון
                  </div>
                </div>
              </div>
              {outOfRange && (
                <div className="mt-4 text-center text-red-600 font-bold text-lg">
                  המטרה מחוץ לטווח הנשק
                </div>
              )}
            </div>
          )}

          {/* Launch Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLaunch}
              disabled={!selectedSite || !selectedWeapon || !selectedTarget || !selectedCity || outOfRange}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedSite && selectedWeapon && selectedTarget && selectedCity && !outOfRange
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              🚀 שגר תקיפה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};