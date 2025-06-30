import React, { useState } from 'react';
import { X, Briefcase, Users, Shield, Globe, Settings, Play, Clock, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { GameState } from '../types/game';

interface DecisionsActionsPanelProps {
  onClose: () => void;
  onAction: (action: any) => void;
  gameState: GameState;
  isDayMode: boolean;
}

interface Action {
  id: string;
  name: string;
  description: string;
  category: 'economy' | 'society' | 'security' | 'diplomacy' | 'reforms';
  cost: {
    money?: number;
    time?: number;
    political?: number;
  };
  effects: {
    gdp?: number;
    stability?: number;
    publicSupport?: number;
    military?: number;
    intelligence?: number;
  };
  requirements?: {
    minStability?: number;
    minSupport?: number;
    minBudget?: number;
  };
  icon: string;
}

const AVAILABLE_ACTIONS: Action[] = [
  // Economy
  {
    id: 'infrastructure_investment',
    name: 'השקעה בתשתיות',
    description: 'השקעה מסיבית בתשתיות תחבורה ותקשורת',
    category: 'economy',
    cost: { money: 10000000000, time: 2 },
    effects: { gdp: 5, stability: 3, publicSupport: 2 },
    icon: '🏗️'
  },
  {
    id: 'tech_innovation',
    name: 'חדשנות טכנולוגית',
    description: 'השקעה במחקר ופיתוח טכנולוגי',
    category: 'economy',
    cost: { money: 5000000000, time: 3 },
    effects: { gdp: 8, intelligence: 5 },
    icon: '💻'
  },
  {
    id: 'trade_expansion',
    name: 'הרחבת סחר',
    description: 'פתיחת שווקים חדשים ושיפור יחסי סחר',
    category: 'economy',
    cost: { money: 3000000000, political: 2 },
    effects: { gdp: 6, stability: 2 },
    icon: '📈'
  },

  // Society
  {
    id: 'education_reform',
    name: 'רפורמה בחינוך',
    description: 'שיפור מערכת החינוך והכשרה מקצועית',
    category: 'society',
    cost: { money: 8000000000, time: 4 },
    effects: { publicSupport: 8, stability: 5 },
    icon: '🎓'
  },
  {
    id: 'healthcare_improvement',
    name: 'שיפור הבריאות',
    description: 'השקעה במערכת הבריאות ובתשתיות רפואיות',
    category: 'society',
    cost: { money: 6000000000, time: 2 },
    effects: { publicSupport: 10, stability: 3 },
    icon: '🏥'
  },
  {
    id: 'social_programs',
    name: 'תוכניות חברתיות',
    description: 'הרחבת רשת הביטחון הסוציאלי',
    category: 'society',
    cost: { money: 4000000000, political: 3 },
    effects: { publicSupport: 12, stability: 4 },
    requirements: { minStability: 40 },
    icon: '🤝'
  },

  // Security
  {
    id: 'military_modernization',
    name: 'מודרניזציה צבאית',
    description: 'שדרוג ציוד צבאי וטכנולוגיות לחימה',
    category: 'security',
    cost: { money: 15000000000, time: 3 },
    effects: { military: 10, stability: 2 },
    icon: '⚔️'
  },
  {
    id: 'intelligence_expansion',
    name: 'הרחבת מודיעין',
    description: 'חיזוק יכולות המודיעין והביון',
    category: 'security',
    cost: { money: 8000000000, political: 4 },
    effects: { intelligence: 15, military: 3 },
    icon: '🕵️'
  },
  {
    id: 'cyber_defense',
    name: 'הגנה סייברנטית',
    description: 'בניית מערכות הגנה סייברנטיות מתקדמות',
    category: 'security',
    cost: { money: 5000000000, time: 2 },
    effects: { intelligence: 8, stability: 3 },
    icon: '🛡️'
  },

  // Diplomacy
  {
    id: 'regional_summit',
    name: 'ועידה אזורית',
    description: 'ארגון ועידה דיפלומטית אזורית',
    category: 'diplomacy',
    cost: { money: 2000000000, political: 5 },
    effects: { stability: 5, publicSupport: 3 },
    icon: '🤝'
  },
  {
    id: 'peace_initiative',
    name: 'יוזמת שלום',
    description: 'השקת יוזמה דיפלומטית לשלום אזורי',
    category: 'diplomacy',
    cost: { political: 8, time: 4 },
    effects: { stability: 8, publicSupport: 5 },
    requirements: { minSupport: 60 },
    icon: '🕊️'
  },

  // Reforms
  {
    id: 'democratic_reforms',
    name: 'רפורמות דמוקרטיות',
    description: 'חיזוק המוסדות הדמוקרטיים',
    category: 'reforms',
    cost: { political: 10, time: 5 },
    effects: { stability: 10, publicSupport: 8 },
    requirements: { minStability: 50 },
    icon: '🗳️'
  },
  {
    id: 'anti_corruption',
    name: 'מלחמה בשחיתות',
    description: 'יוזמה נרחבת למלחמה בשחיתות',
    category: 'reforms',
    cost: { political: 15, time: 3 },
    effects: { stability: 12, publicSupport: 10 },
    icon: '⚖️'
  }
];

// Mock dilemma for demonstration
const ACTIVE_DILEMMA = {
  id: 'water_crisis',
  title: 'משבר המים האזורי',
  description: 'מחסור חמור במים מאיים על יציבות האזור. יש לבחור באסטרטגיה להתמודדות עם המשבר.',
  options: [
    {
      id: 'cooperation',
      title: 'שיתוף פעולה אזורי',
      description: 'יוזמת שיתוף פעולה עם מדינות שכנות לפתרון משותף',
      effects: { stability: 5, publicSupport: 3, gdp: -2 }
    },
    {
      id: 'technology',
      title: 'פתרון טכנולוגי',
      description: 'השקעה בטכנולוגיות התפלה וחיסכון במים',
      effects: { gdp: -5, stability: 3, intelligence: 2 }
    },
    {
      id: 'military',
      title: 'הבטחת משאבים',
      description: 'שימוש בכוח צבאי להבטחת גישה למקורות מים',
      effects: { military: 3, stability: -5, publicSupport: -3 }
    }
  ]
};

export const DecisionsActionsPanel: React.FC<DecisionsActionsPanelProps> = ({
  onClose,
  onAction,
  gameState,
  isDayMode
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('economy');
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showDilemma, setShowDilemma] = useState(true);

  const currentCountry = gameState.countries[gameState.currentPlayer];

  const categories = [
    { id: 'economy', name: 'כלכלה', icon: DollarSign, color: 'green' },
    { id: 'society', name: 'חברה', icon: Users, color: 'blue' },
    { id: 'security', name: 'ביטחון', icon: Shield, color: 'red' },
    { id: 'diplomacy', name: 'דיפלומטיה', icon: Globe, color: 'purple' },
    { id: 'reforms', name: 'רפורמות', icon: Settings, color: 'orange' }
  ];

  const filteredActions = AVAILABLE_ACTIONS.filter(action => action.category === activeCategory);

  const canExecuteAction = (action: Action) => {
    if (action.requirements) {
      if (action.requirements.minStability && currentCountry.politics.stability < action.requirements.minStability) {
        return false;
      }
      if (action.requirements.minSupport && currentCountry.politics.publicSupport < action.requirements.minSupport) {
        return false;
      }
      if (action.requirements.minBudget && currentCountry.economy.budget.income < action.requirements.minBudget) {
        return false;
      }
    }
    return true;
  };

  const handleExecuteAction = (action: Action) => {
    onAction({
      type: 'execute_action',
      actionId: action.id,
      country: gameState.currentPlayer,
      cost: action.cost,
      effects: action.effects
    });
    setSelectedAction(null);
  };

  const handleDilemmaChoice = (optionId: string) => {
    onAction({
      type: 'resolve_dilemma',
      dilemmaId: ACTIVE_DILEMMA.id,
      optionId: optionId,
      country: gameState.currentPlayer
    });
    setShowDilemma(false);
  };

  if (!gameState || !gameState.countries || !gameState.currentPlayer) {
    return <div className="bg-red-900 text-white p-8 rounded-lg shadow-lg text-center">שגיאה: נתוני משחק חסרים</div>;
  }

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
              <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-indigo-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                החלטות ופעולות
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
          {/* Active Dilemma */}
          {showDilemma && (
            <div className={`mb-6 p-4 rounded-lg border-2 border-yellow-500 ${
              isDayMode ? 'bg-yellow-50' : 'bg-yellow-900/20'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">דילמה פעילה</span>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                {ACTIVE_DILEMMA.title}
              </h3>
              <p className={`text-sm mb-4 ${
                isDayMode ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {ACTIVE_DILEMMA.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ACTIVE_DILEMMA.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDilemmaChoice(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                      isDayMode 
                        ? 'border-gray-200 bg-white hover:border-yellow-400' 
                        : 'border-gray-600 bg-gray-700 hover:border-yellow-400'
                    }`}
                  >
                    <h4 className={`font-bold mb-2 ${
                      isDayMode ? 'text-gray-800' : 'text-white'
                    }`}>
                      {option.title}
                    </h4>
                    <p className={`text-sm mb-3 ${
                      isDayMode ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {option.description}
                    </p>
                    <div className="text-xs space-y-1">
                      {Object.entries(option.effects).map(([key, value]) => (
                        <div key={key} className={`${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {key}: {value > 0 ? '+' : ''}{value}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? `bg-${category.color}-500 text-white`
                    : isDayMode
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredActions.map((action) => {
              const canExecute = canExecuteAction(action);
              return (
                <div
                  key={action.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    canExecute
                      ? isDayMode
                        ? 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
                        : 'border-gray-600 bg-gray-700 hover:border-blue-400'
                      : 'border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{action.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-1 ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {action.name}
                      </h3>
                      <p className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {action.description}
                      </p>
                    </div>
                  </div>

                  {/* Costs */}
                  <div className="mb-3">
                    <h4 className={`text-xs font-semibold mb-1 ${
                      isDayMode ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      עלויות:
                    </h4>
                    <div className="space-y-1 text-xs">
                      {action.cost.money && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${(action.cost.money / 1000000000).toFixed(1)}B
                        </div>
                      )}
                      {action.cost.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {action.cost.time} תורות
                        </div>
                      )}
                      {action.cost.political && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {action.cost.political} נקודות פוליטיות
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Effects */}
                  <div className="mb-3">
                    <h4 className={`text-xs font-semibold mb-1 ${
                      isDayMode ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      השפעות צפויות:
                    </h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(action.effects).map(([key, value]) => (
                        <div key={key} className={`${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {key}: {value > 0 ? '+' : ''}{value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execute Button */}
                  <button
                    onClick={() => handleExecuteAction(action)}
                    disabled={!canExecute}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      canExecute
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    בצע פעולה
                  </button>

                  {/* Requirements warning */}
                  {!canExecute && action.requirements && (
                    <div className="mt-2 text-xs text-red-600">
                      דרישות לא מתקיימות
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Projects in Progress */}
          <div className={`p-4 rounded-lg ${
            isDayMode ? 'bg-gray-50' : 'bg-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              פרויקטים בתהליך
            </h3>
            <div className="space-y-2">
              <div className={`p-3 rounded border ${
                isDayMode ? 'border-gray-200 bg-white' : 'border-gray-600 bg-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    🏗️ השקעה בתשתיות
                  </span>
                  <span className="text-sm text-blue-600">תור 2/3</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
              
              <div className={`p-3 rounded border ${
                isDayMode ? 'border-gray-200 bg-white' : 'border-gray-600 bg-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${
                    isDayMode ? 'text-gray-800' : 'text-white'
                  }`}>
                    🎓 רפורמה בחינוך
                  </span>
                  <span className="text-sm text-green-600">תור 4/4</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};