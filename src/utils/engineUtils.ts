import { GameState, Country, GameEvent, NewsItem, AIPersonality, GameAction } from '../types/game';

// AI Personalities for each country
export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  israel: { aggression: 70, caution: 80, expansion: 40, cooperation: 60, ideology: 70, priorities: ['security', 'technology', 'alliances'] },
  egypt: { aggression: 40, caution: 70, expansion: 30, cooperation: 70, ideology: 50, priorities: ['stability', 'economy', 'regional_power'] },
  saudi: { aggression: 60, caution: 60, expansion: 80, cooperation: 50, ideology: 90, priorities: ['oil', 'influence', 'security'] },
  turkey: { aggression: 80, caution: 40, expansion: 90, cooperation: 40, ideology: 60, priorities: ['expansion', 'influence', 'economy'] },
  iran: { aggression: 90, caution: 30, expansion: 80, cooperation: 20, ideology: 95, priorities: ['nuclear', 'regional_hegemony', 'ideology'] },
  jordan: { aggression: 20, caution: 90, expansion: 10, cooperation: 80, ideology: 40, priorities: ['stability', 'alliances', 'survival'] },
  syria: { aggression: 60, caution: 40, expansion: 30, cooperation: 30, ideology: 70, priorities: ['survival', 'iranian_alliance', 'control'] },
  iraq: { aggression: 30, caution: 70, expansion: 20, cooperation: 60, ideology: 40, priorities: ['stability', 'reconstruction', 'sovereignty'] }
};

export function generateEvent(): GameEvent {
  const events = [
    {
      type: 'global' as const,
      title: 'Oil Price Surge',
      description: 'Global oil prices increase due to supply concerns',
      effects: { oilPrice: 20, economy: 10 },
      severity: 'medium' as const
    },
    {
      type: 'regional' as const,
      title: 'Regional Summit Called',
      description: 'Major powers call for regional peace talks',
      effects: { diplomacy: 5, tension: -10 },
      severity: 'low' as const
    },
    {
      type: 'global' as const,
      title: 'Cyber Attack Wave',
      description: 'Multiple countries report sophisticated cyber attacks',
      effects: { cyber_defense: -10, tension: 15 },
      severity: 'high' as const
    },
    {
      type: 'regional' as const,
      title: 'Water Crisis Escalates',
      description: 'Regional water shortages threaten stability',
      effects: { stability: -5, tension: 10 },
      severity: 'high' as const
    },
    {
      type: 'global' as const,
      title: 'Economic Sanctions Imposed',
      description: 'International community imposes new sanctions',
      effects: { economy: -15, isolation: 10 },
      severity: 'high' as const
    }
  ];

  const event = events[Math.floor(Math.random() * events.length)];
  return {
    id: `event_${Date.now()}`,
    ...event,
    duration: Math.floor(Math.random() * 3) + 1
  };
}

export function generateNews(gameState: GameState, action?: GameAction): NewsItem[] {
  const newsItems: Omit<NewsItem, 'id' | 'timestamp'>[] = [
    {
      headline: 'Economic Indicators Show Mixed Results',
      content: 'Regional economies face challenges amid global uncertainty',
      type: 'economic'
    },
    {
      headline: 'Military Exercises Conducted',
      content: 'Joint military exercises demonstrate regional cooperation',
      type: 'military'
    },
    {
      headline: 'Diplomatic Talks Resume',
      content: 'High-level diplomatic meetings aim to reduce tensions',
      type: 'diplomatic'
    }
  ];

  if (action) {
    const countryName = gameState.countries[action.country]?.name || 'Unknown';
    const targetName = 'target' in action && action.target ? gameState.countries[action.target]?.name : '';
    switch (action.type) {
      case 'military_exercise':
        newsItems.unshift({
          headline: `${countryName} Conducts Major Military Exercise`,
          content: `Large-scale military exercises demonstrate ${countryName}'s growing military capabilities and readiness`,
          type: 'military',
          country: action.country
        });
        break;
      case 'cyber_attack':
        newsItems.unshift({
          headline: 'Sophisticated Cyber Attack Reported',
          content: `Intelligence agencies report coordinated cyber operations targeting critical infrastructure`,
          type: 'military',
          country: action.country
        });
        break;
      case 'improve_relations':
        if (targetName) {
          newsItems.unshift({
            headline: `${countryName} and ${targetName} Strengthen Ties`,
            content: `High-level diplomatic meetings result in improved bilateral relations`,
            type: 'diplomatic',
            country: action.country
          });
        }
        break;
      case 'trade_agreement':
        if (targetName) {
          newsItems.unshift({
            headline: `${countryName} Signs Trade Deal with ${targetName}`,
            content: `New economic partnership expected to boost bilateral trade significantly`,
            type: 'economic',
            country: action.country
          });
        }
        break;
      case 'economic_sanctions':
        if (targetName) {
          newsItems.unshift({
            headline: `${countryName} Imposes Economic Sanctions on ${targetName}`,
            content: `New sanctions target key economic sectors in escalating diplomatic crisis`,
            type: 'economic',
            country: action.country
          });
        }
        break;
      case 'declare_war':
        if (targetName) {
          newsItems.unshift({
            headline: `WAR DECLARED: ${countryName} vs ${targetName}`,
            content: `Military conflict erupts as diplomatic relations collapse completely`,
            type: 'military',
            country: action.country
          });
        }
        break;
      case 'invest_infrastructure':
        newsItems.unshift({
          headline: `${countryName} Announces Major Infrastructure Investment`,
          content: `Massive infrastructure spending program aims to boost economic growth`,
          type: 'economic',
          country: action.country
        });
        break;
    }
  }

  return newsItems.slice(0, 3).map((item, index) => ({
    id: `news_${Date.now()}_${index}`,
    timestamp: Date.now(),
    ...item
  }));
}

export function calculateActionEffects(action: GameAction, country: Country): Partial<Country> {
  const effects: Partial<Country> = {};
  switch (action.type) {
    case 'military_exercise':
      effects.military = {
        ...country.military,
        experience: Math.min(100, country.military.experience + 5),
        morale: Math.min(100, country.military.morale + 3)
      };
      effects.economy = {
        ...country.economy,
        budget: {
          ...country.economy.budget,
          expenses: {
            ...country.economy.budget.expenses,
            defense: country.economy.budget.expenses.defense * 1.05
          }
        }
      };
      break;
    case 'invest_infrastructure':
      effects.economy = {
        ...country.economy,
        gdp: country.economy.gdp * 1.03,
        budget: {
          ...country.economy.budget,
          expenses: {
            ...country.economy.budget.expenses,
            infrastructure: country.economy.budget.expenses.infrastructure * 1.2
          }
        }
      };
      effects.politics = {
        ...country.politics,
        publicSupport: Math.min(100, country.politics.publicSupport + 3),
        stability: Math.min(100, country.politics.stability + 2)
      };
      break;
    case 'cyber_attack':
      if (Math.random() > 0.4) {
        effects.intelligence = {
          ...country.intelligence,
          capabilities: {
            ...country.intelligence.capabilities,
            cyber: Math.min(100, country.intelligence.capabilities.cyber + 3)
          }
        };
      }
      break;
    case 'improve_relations':
      if ('target' in action && action.target) {
        const currentRelation = country.diplomacy.relationships[action.target] || 0;
        effects.diplomacy = {
          ...country.diplomacy,
          relationships: {
            ...country.diplomacy.relationships,
            [action.target]: Math.min(100, currentRelation + 15)
          }
        };
      }
      break;
    case 'trade_agreement':
      if ('target' in action && action.target) {
        effects.economy = {
          ...country.economy,
          gdp: country.economy.gdp * 1.02
        };
        const currentRelation = country.diplomacy.relationships[action.target] || 0;
        effects.diplomacy = {
          ...country.diplomacy,
          relationships: {
            ...country.diplomacy.relationships,
            [action.target]: Math.min(100, currentRelation + 10)
          }
        };
      }
      break;
    case 'economic_sanctions':
      if ('target' in action && action.target) {
        const currentRelation = country.diplomacy.relationships[action.target] || 0;
        effects.diplomacy = {
          ...country.diplomacy,
          relationships: {
            ...country.diplomacy.relationships,
            [action.target]: Math.max(-100, currentRelation - 20)
          }
        };
      }
      break;
    case 'gather_intelligence':
      effects.intelligence = {
        ...country.intelligence,
        capabilities: {
          ...country.intelligence.capabilities,
          gathering: Math.min(100, country.intelligence.capabilities.gathering + 2),
          analysis: Math.min(100, country.intelligence.capabilities.analysis + 1)
        }
      };
      break;
    case 'declare_war':
      if ('target' in action && action.target) {
        effects.diplomacy = {
          ...country.diplomacy,
          relationships: {
            ...country.diplomacy.relationships,
            [action.target]: -100
          }
        };
        effects.military = {
          ...country.military,
          morale: Math.min(100, country.military.morale + 10)
        };
        effects.politics = {
          ...country.politics,
          stability: Math.max(0, country.politics.stability - 15)
        };
      }
      break;
  }
  return effects;
}

export function executeAITurn(gameState: GameState, countryId: string): GameAction | null {
  const country = gameState.countries[countryId];
  const personality = AI_PERSONALITIES[countryId];
  const possibleActions: (GameAction & { weight: number })[] = [];
  // Military actions
  if (personality.aggression > 60 && country.military.experience < 80) {
    possibleActions.push({ type: 'military_exercise', country: countryId, weight: personality.aggression });
  }
  // Economic actions
  if (country.economy.debt > 60) {
    possibleActions.push({ type: 'invest_infrastructure', country: countryId, weight: 100 - personality.aggression });
  }
  // Intelligence actions
  if (personality.caution > 50) {
    possibleActions.push({ type: 'gather_intelligence', country: countryId, weight: personality.caution });
  }
  // Diplomatic actions
  const hostileRelations = Object.entries(country.diplomacy.relationships)
    .filter(([_, relation]) => (relation as number) < -30);
  if (hostileRelations.length > 2 && personality.cooperation > 40) {
    const targetCountry = hostileRelations[Math.floor(Math.random() * hostileRelations.length)][0];
    possibleActions.push({ type: 'improve_relations', country: countryId, target: targetCountry, weight: personality.cooperation });
  }
  // Aggressive actions
  if (personality.aggression > 80) {
    const enemies = Object.entries(country.diplomacy.relationships)
      .filter(([_, relation]) => (relation as number) < -60);
    if (enemies.length > 0) {
      const target = enemies[Math.floor(Math.random() * enemies.length)][0];
      possibleActions.push({ type: 'cyber_attack', country: countryId, target, weight: personality.aggression });
    }
  }
  // Select action based on weights
  if (possibleActions.length > 0) {
    const totalWeight = possibleActions.reduce((sum, action) => sum + action.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;
    for (const action of possibleActions) {
      currentWeight += action.weight;
      if (random <= currentWeight) {
        const { weight, ...gameAction } = action;
        return gameAction;
      }
    }
  }
  return null;
} 