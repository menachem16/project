import { useState, useCallback } from 'react';
import { GameState, Country, GameEvent, NewsItem, GameAction, AIPersonality } from '../types/game';
import { COUNTRIES } from '../data/countries';
import { generateEvent, generateNews, calculateActionEffects, executeAITurn } from '../utils/engineUtils';

// AI Personalities for each country
const AI_PERSONALITIES: Record<string, AIPersonality> = {
  israel: { aggression: 70, caution: 80, expansion: 40, cooperation: 60, ideology: 70, priorities: ['security', 'technology', 'alliances'] },
  egypt: { aggression: 40, caution: 70, expansion: 30, cooperation: 70, ideology: 50, priorities: ['stability', 'economy', 'regional_power'] },
  saudi: { aggression: 60, caution: 60, expansion: 80, cooperation: 50, ideology: 90, priorities: ['oil', 'influence', 'security'] },
  turkey: { aggression: 80, caution: 40, expansion: 90, cooperation: 40, ideology: 60, priorities: ['expansion', 'influence', 'economy'] },
  iran: { aggression: 90, caution: 30, expansion: 80, cooperation: 20, ideology: 95, priorities: ['nuclear', 'regional_hegemony', 'ideology'] },
  jordan: { aggression: 20, caution: 90, expansion: 10, cooperation: 80, ideology: 40, priorities: ['stability', 'alliances', 'survival'] },
  syria: { aggression: 60, caution: 40, expansion: 30, cooperation: 30, ideology: 70, priorities: ['survival', 'iranian_alliance', 'control'] },
  iraq: { aggression: 30, caution: 70, expansion: 20, cooperation: 60, ideology: 40, priorities: ['stability', 'reconstruction', 'sovereignty'] }
};

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: '',
    turn: 1,
    countries: { ...COUNTRIES },
    events: [],
    news: [],
    globalFactors: {
      oilPrice: 80,
      globalTension: 50,
      economicGrowth: 2.5
    },
    gamePhase: 'setup'
  });

  const processAction = useCallback((action: GameAction) => {
    setGameState((prevState: GameState) => {
      if (!prevState || !prevState.countries || !prevState.currentPlayer) {
        return prevState;
      }
      const newState: GameState = { ...prevState };
      const country = newState.countries[action.country];
      // טיפול בפעולות מותאמות
      if (action.type === 'execute_action') {
        // עדכון state לפי effects
        const effects = action.effects || {};
        newState.countries[action.country] = { ...country, ...effects };
        // ניקוד לדוג' על שיפור GDP/יציבות/תמיכה
        let scoreDelta = 0;
        if (effects.economy && effects.economy.gdp && effects.economy.gdp > country.economy.gdp) scoreDelta += 10;
        if (effects.politics && effects.politics.stability && effects.politics.stability > country.politics.stability) scoreDelta += 5;
        if (effects.politics && effects.politics.publicSupport && effects.politics.publicSupport > country.politics.publicSupport) scoreDelta += 5;
        newState.score = (newState.score || 0) + scoreDelta;
        // אירוע ליומן
        newState.events.push({
          id: `event_${Date.now()}`,
          type: 'internal',
          title: 'החלטה בוצעה',
          description: `המדינה ביצעה את הפעולה: ${action.actionId}`,
          effects: effects,
          duration: 2,
          severity: 'medium'
        });
        return newState;
      }
      if (action.type === 'resolve_dilemma') {
        // סימון דילמה כיושבת, אפשר להרחיב ל-state
        newState.events.push({
          id: `event_${Date.now()}`,
          type: 'internal',
          title: 'דילמה נפתרה',
          description: `המדינה בחרה באופציה: ${action.optionId}`,
          effects: {},
          duration: 2,
          severity: 'low'
        });
        return newState;
      }
      // Calculate and apply effects to acting country
      const effects = calculateActionEffects(action, country);
      newState.countries[action.country] = { ...country, ...effects };
      // Apply reciprocal effects to target country if applicable
      if ('target' in action && action.target && newState.countries[action.target]) {
        const targetCountry = newState.countries[action.target];
        const targetEffects: Partial<Country> = {};
        switch (action.type) {
          case 'improve_relations': {
            const currentRelation = targetCountry.diplomacy.relationships[action.country] || 0;
            targetEffects.diplomacy = {
              ...targetCountry.diplomacy,
              relationships: {
                ...targetCountry.diplomacy.relationships,
                [action.country]: Math.min(100, currentRelation + 10)
              }
            };
            break;
          }
          case 'trade_agreement': {
            targetEffects.economy = {
              ...targetCountry.economy,
              gdp: targetCountry.economy.gdp * 1.015
            };
            const tradeRelation = targetCountry.diplomacy.relationships[action.country] || 0;
            targetEffects.diplomacy = {
              ...targetCountry.diplomacy,
              relationships: {
                ...targetCountry.diplomacy.relationships,
                [action.country]: Math.min(100, tradeRelation + 8)
              }
            };
            break;
          }
          case 'economic_sanctions': {
            targetEffects.economy = {
              ...targetCountry.economy,
              gdp: targetCountry.economy.gdp * 0.95
            };
            const sanctionRelation = targetCountry.diplomacy.relationships[action.country] || 0;
            targetEffects.diplomacy = {
              ...targetCountry.diplomacy,
              relationships: {
                ...targetCountry.diplomacy.relationships,
                [action.country]: Math.max(-100, sanctionRelation - 25)
              }
            };
            break;
          }
          case 'cyber_attack': {
            if (Math.random() > 0.3) {
              targetEffects.economy = {
                ...targetCountry.economy,
                gdp: targetCountry.economy.gdp * 0.98
              };
              targetEffects.politics = {
                ...targetCountry.politics,
                stability: Math.max(0, targetCountry.politics.stability - 5)
              };
            }
            break;
          }
        }
        if (Object.keys(targetEffects).length > 0) {
          newState.countries[action.target] = { ...targetCountry, ...targetEffects };
        }
      }
      // Generate news
      const news = generateNews(newState, action);
      newState.news = [...news, ...newState.news].slice(0, 20);
      // Update global factors based on action
      if (action.type === 'declare_war') {
        newState.globalFactors.globalTension = Math.min(100, newState.globalFactors.globalTension + 15);
      } else if (action.type === 'improve_relations') {
        newState.globalFactors.globalTension = Math.max(0, newState.globalFactors.globalTension - 2);
      }
      // Random events
      if (Math.random() < 0.15) {
        const event = generateEvent();
        newState.events.push(event);
      }
      return newState;
    });
  }, []);

  const endTurn = useCallback(() => {
    setGameState((prevState: GameState) => {
      const newState: GameState = { ...prevState };
      // Execute AI turns for all non-player countries
      Object.keys(newState.countries).forEach(countryId => {
        if (countryId !== newState.currentPlayer) {
          const aiAction = executeAITurn(newState, countryId);
          if (aiAction) {
            const country = newState.countries[countryId];
            const effects = calculateActionEffects(aiAction, country);
            newState.countries[countryId] = { ...country, ...effects };
            // Apply reciprocal effects for AI actions too
            if ('target' in aiAction && aiAction.target && newState.countries[aiAction.target]) {
              const targetCountry = newState.countries[aiAction.target];
              const targetEffects: Partial<Country> = {};
              if (aiAction.type === 'improve_relations') {
                const currentRelation = targetCountry.diplomacy.relationships[countryId] || 0;
                targetEffects.diplomacy = {
                  ...targetCountry.diplomacy,
                  relationships: {
                    ...targetCountry.diplomacy.relationships,
                    [countryId]: Math.min(100, currentRelation + 8)
                  }
                };
              }
              if (Object.keys(targetEffects).length > 0) {
                newState.countries[aiAction.target] = { ...targetCountry, ...targetEffects };
              }
            }
            // Generate news for AI actions
            const aiNews = generateNews(newState, aiAction);
            newState.news = [...aiNews, ...newState.news].slice(0, 20);
          }
        }
      });
      // Update global factors
      newState.globalFactors.oilPrice += (Math.random() - 0.5) * 8;
      newState.globalFactors.oilPrice = Math.max(30, Math.min(150, newState.globalFactors.oilPrice));
      newState.globalFactors.globalTension += (Math.random() - 0.5) * 5;
      newState.globalFactors.globalTension = Math.max(0, Math.min(100, newState.globalFactors.globalTension));
      newState.globalFactors.economicGrowth += (Math.random() - 0.5) * 1;
      newState.globalFactors.economicGrowth = Math.max(-5, Math.min(8, newState.globalFactors.economicGrowth));
      // Increment turn
      newState.turn += 1;
      // Process events
      newState.events = newState.events.filter((event: GameEvent) => {
        event.duration -= 1;
        return event.duration > 0;
      });
      // Check victory conditions
      const currentCountry = newState.countries[newState.currentPlayer];
      // Military victory
      if (currentCountry.military.experience >= 95 && currentCountry.politics.stability >= 80) {
        newState.gamePhase = 'ended';
        newState.winner = newState.currentPlayer;
        newState.victoryType = 'military';
      }
      // Economic victory
      if (currentCountry.economy.gdp > 1000000000000 && currentCountry.economy.debt < 30) {
        newState.gamePhase = 'ended';
        newState.winner = newState.currentPlayer;
        newState.victoryType = 'economic';
      }
      // Diplomatic victory
      const positiveRelations = Object.values(currentCountry.diplomacy.relationships)
        .filter(r => (r as number) > 70).length;
      if (positiveRelations >= 6) {
        newState.gamePhase = 'ended';
        newState.winner = newState.currentPlayer;
        newState.victoryType = 'diplomatic';
      }
      // Technological victory
      if (currentCountry.military.nuclear.status === 'operational' && 
          currentCountry.intelligence.capabilities.cyber >= 90) {
        newState.gamePhase = 'ended';
        newState.winner = newState.currentPlayer;
        newState.victoryType = 'technological';
      }
      return newState;
    });
  }, []);

  const startGame = useCallback((selectedCountry: string) => {
    setGameState((prevState: GameState) => ({
      ...prevState,
      currentPlayer: selectedCountry,
      gamePhase: 'playing',
      news: [{
        id: 'start_game',
        headline: `${COUNTRIES[selectedCountry].name} Leadership Takes Office`,
        content: `New leadership in ${COUNTRIES[selectedCountry].name} begins ambitious reform program to strengthen the nation`,
        type: 'internal',
        country: selectedCountry,
        timestamp: Date.now()
      }]
    }));
  }, []);

  return {
    gameState,
    processAction,
    endTurn,
    startGame
  };
};