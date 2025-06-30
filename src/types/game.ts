export interface Country {
  id: string;
  name: string;
  capital: string;
  flag: string;
  ideology: 'democracy' | 'autocracy' | 'theocracy';
  population: number;
  demographics: {
    ethnic: Record<string, number>;
    religious: Record<string, number>;
  };
  economy: {
    gdp: number;
    sectors: {
      oil: number;
      technology: number;
      tourism: number;
      agriculture: number;
      industry: number;
    };
    budget: {
      income: number;
      expenses: {
        defense: number;
        health: number;
        education: number;
        infrastructure: number;
      };
    };
    debt: number;
    inflation: number;
    sanctions: string[];
  };
  military: {
    units: {
      infantry: number;
      armor: number;
      airForce: number;
      navy: number;
      special: number;
      missiles: number;
      drones: number;
      cyber: number;
    };
    doctrine: 'defensive' | 'offensive' | 'asymmetric';
    nuclear: {
      status: 'none' | 'developing' | 'operational';
      warheads: number;
      delivery: string[];
    };
    experience: number;
    morale: number;
  };
  politics: {
    stability: number;
    corruption: number;
    publicSupport: number;
    freedomIndex: number;
    pressureGroups: {
      opposition: number;
      minorities: number;
      military: number;
      religious: number;
    };
  };
  diplomacy: {
    relationships: Record<string, number>; // -100 to 100
    agreements: string[];
    organizations: string[];
  };
  intelligence: {
    agencies: number;
    budget: number;
    capabilities: {
      gathering: number;
      analysis: number;
      cyber: number;
      counterIntel: number;
    };
  };
  resources: {
    water: number;
    oil: number;
    gas: number;
    minerals: number;
    food: number;
  };
}

export interface GameState {
  currentPlayer: string;
  turn: number;
  countries: Record<string, Country>;
  events: GameEvent[];
  news: NewsItem[];
  globalFactors: {
    oilPrice: number;
    globalTension: number;
    economicGrowth: number;
  };
  gamePhase: 'setup' | 'playing' | 'ended';
  winner?: string;
  victoryType?: 'military' | 'economic' | 'diplomatic' | 'technological';
}

export interface GameEvent {
  id: string;
  type: 'global' | 'regional' | 'internal';
  title: string;
  description: string;
  effects: Record<string, any>;
  duration: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface NewsItem {
  id: string;
  headline: string;
  content: string;
  type: 'military' | 'diplomatic' | 'economic' | 'internal';
  country?: string;
  timestamp: number;
}

export interface Action {
  type: string;
  country: string;
  target?: string;
  parameters: Record<string, any>;
  cost: Record<string, number>;
  effects: Record<string, any>;
  riskLevel: number;
}

export interface AIPersonality {
  aggression: number;
  caution: number;
  expansion: number;
  cooperation: number;
  ideology: number;
  priorities: string[];
}

// טיפוס פעולה מדויק למשחק
export type GameAction =
  | { type: 'military_exercise'; country: string }
  | { type: 'invest_infrastructure'; country: string }
  | { type: 'cyber_attack'; country: string; target: string }
  | { type: 'improve_relations'; country: string; target: string }
  | { type: 'trade_agreement'; country: string; target: string }
  | { type: 'economic_sanctions'; country: string; target: string }
  | { type: 'gather_intelligence'; country: string }
  | { type: 'declare_war'; country: string; target: string };