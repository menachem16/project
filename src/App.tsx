import React from 'react';
import { CountrySelection } from './components/CountrySelection';
import { WarRoom } from './components/WarRoom';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const { gameState, processAction, endTurn, startGame } = useGameEngine();

  const handleAction = (action: any) => {
    if (action.type === 'end_turn') {
      endTurn();
    } else {
      processAction(action);
    }
  };

  if (gameState.gamePhase === 'setup') {
    return <CountrySelection onSelectCountry={startGame} />;
  }

  if (gameState.gamePhase === 'ended') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg border-2 border-yellow-500">
          <h1 className="text-4xl font-bold mb-4">Victory Achieved!</h1>
          <div className="text-6xl mb-4">{gameState.countries[gameState.winner!].flag}</div>
          <h2 className="text-2xl mb-4">{gameState.countries[gameState.winner!].name} Triumphant</h2>
          <p className="text-lg text-gray-300 mb-6">
            Victory Type: <span className="text-yellow-400 capitalize">{gameState.victoryType}</span>
          </p>
          <p className="text-gray-400">
            Achieved in {gameState.turn} turns through strategic excellence
          </p>
        </div>
      </div>
    );
  }

  return <WarRoom gameState={gameState} onAction={handleAction} />;
}

export default App;