import React, { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import { CountryCard } from './CountryCard';
import { Globe, Play } from 'lucide-react';

interface CountrySelectionProps {
  onSelectCountry: (countryId: string) => void;
}

export const CountrySelection: React.FC<CountrySelectionProps> = ({ onSelectCountry }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleStart = () => {
    if (selectedCountry) {
      onSelectCountry(selectedCountry);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Globe className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Conflict: Evolved Middle East
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master the complex geopolitical landscape of the modern Middle East. 
            Command your nation through diplomacy, military strategy, economic development, 
            and intelligence operations to achieve regional dominance.
          </p>
        </div>

        {/* Difficulty & Game Mode Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Nation</h2>
          <p className="text-gray-300 text-center mb-4">
            Each country offers unique challenges, advantages, and strategic opportunities. 
            Select wisely - your choice will determine your path to victory.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-blue-400 font-bold">🏛️ Political Systems</div>
              <div className="text-gray-400">Democracy • Autocracy • Theocracy</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">🎯 Victory Paths</div>
              <div className="text-gray-400">Military • Economic • Diplomatic • Tech</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold">⚡ Game Features</div>
              <div className="text-gray-400">AI Opponents • Dynamic Events • Real Consequences</div>
            </div>
          </div>
        </div>

        {/* Country Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.values(COUNTRIES).map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              onSelect={setSelectedCountry}
              selected={selectedCountry === country.id}
            />
          ))}
        </div>

        {/* Selected Country Info */}
        {selectedCountry && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-blue-500/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                You have selected: {COUNTRIES[selectedCountry].name} {COUNTRIES[selectedCountry].flag}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-400 mb-2">Starting Advantages</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedCountry === 'israel' && (
                      <>
                        <li>• Advanced military technology</li>
                        <li>• Strong intelligence capabilities</li>
                        <li>• Nuclear weapons program</li>
                      </>
                    )}
                    {selectedCountry === 'saudi' && (
                      <>
                        <li>• Vast oil reserves</li>
                        <li>• Strong economy</li>
                        <li>• Regional influence</li>
                      </>
                    )}
                    {selectedCountry === 'turkey' && (
                      <>
                        <li>• NATO membership</li>
                        <li>• Strategic location</li>
                        <li>• Advanced drone technology</li>
                      </>
                    )}
                    {selectedCountry === 'iran' && (
                      <>
                        <li>• Nuclear program</li>
                        <li>• Proxy network</li>
                        <li>• Asymmetric warfare</li>
                      </>
                    )}
                    {selectedCountry === 'egypt' && (
                      <>
                        <li>• Large population</li>
                        <li>• Suez Canal control</li>
                        <li>• Regional mediator</li>
                      </>
                    )}
                    {selectedCountry === 'jordan' && (
                      <>
                        <li>• Strategic alliances</li>
                        <li>• Stability bonus</li>
                        <li>• Diplomatic expertise</li>
                      </>
                    )}
                    {selectedCountry === 'syria' && (
                      <>
                        <li>• Iranian support</li>
                        <li>• Battle-hardened military</li>
                        <li>• Strategic position</li>
                      </>
                    )}
                    {selectedCountry === 'iraq' && (
                      <>
                        <li>• Oil resources</li>
                        <li>• US partnership</li>
                        <li>• Reconstruction potential</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-bold text-red-400 mb-2">Key Challenges</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedCountry === 'israel' && (
                      <>
                        <li>• Regional isolation</li>
                        <li>• Security threats</li>
                        <li>• International pressure</li>
                      </>
                    )}
                    {selectedCountry === 'saudi' && (
                      <>
                        <li>• Oil dependency</li>
                        <li>• Regional rivals</li>
                        <li>• Social tensions</li>
                      </>
                    )}
                    {selectedCountry === 'turkey' && (
                      <>
                        <li>• Kurdish insurgency</li>
                        <li>• Economic instability</li>
                        <li>• NATO tensions</li>
                      </>
                    )}
                    {selectedCountry === 'iran' && (
                      <>
                        <li>• International sanctions</li>
                        <li>• Economic crisis</li>
                        <li>• Internal unrest</li>
                      </>
                    )}
                    {selectedCountry === 'egypt' && (
                      <>
                        <li>• Economic struggles</li>
                        <li>• High debt levels</li>
                        <li>• Water scarcity</li>
                      </>
                    )}
                    {selectedCountry === 'jordan' && (
                      <>
                        <li>• Resource scarcity</li>
                        <li>• Refugee burden</li>
                        <li>• Economic dependence</li>
                      </>
                    )}
                    {selectedCountry === 'syria' && (
                      <>
                        <li>• Post-war reconstruction</li>
                        <li>• International isolation</li>
                        <li>• Economic collapse</li>
                      </>
                    )}
                    {selectedCountry === 'iraq' && (
                      <>
                        <li>• Political instability</li>
                        <li>• Sectarian tensions</li>
                        <li>• Corruption issues</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-400 mb-2">Victory Strategy</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedCountry === 'israel' && (
                      <>
                        <li>• Technological superiority</li>
                        <li>• Strategic alliances</li>
                        <li>• Defensive dominance</li>
                      </>
                    )}
                    {selectedCountry === 'saudi' && (
                      <>
                        <li>• Economic influence</li>
                        <li>• Regional leadership</li>
                        <li>• Energy dominance</li>
                      </>
                    )}
                    {selectedCountry === 'turkey' && (
                      <>
                        <li>• Regional expansion</li>
                        <li>• Economic growth</li>
                        <li>• Neo-Ottoman influence</li>
                      </>
                    )}
                    {selectedCountry === 'iran' && (
                      <>
                        <li>• Nuclear deterrence</li>
                        <li>• Proxy influence</li>
                        <li>• Regional hegemony</li>
                      </>
                    )}
                    {selectedCountry === 'egypt' && (
                      <>
                        <li>• Arab leadership</li>
                        <li>• Economic recovery</li>
                        <li>• Strategic partnerships</li>
                      </>
                    )}
                    {selectedCountry === 'jordan' && (
                      <>
                        <li>• Diplomatic solutions</li>
                        <li>• Alliance building</li>
                        <li>• Stability focus</li>
                      </>
                    )}
                    {selectedCountry === 'syria' && (
                      <>
                        <li>• National reconstruction</li>
                        <li>• Axis strengthening</li>
                        <li>• Territorial control</li>
                      </>
                    )}
                    {selectedCountry === 'iraq' && (
                      <>
                        <li>• National unity</li>
                        <li>• Economic recovery</li>
                        <li>• Sovereignty restoration</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start Game Button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={!selectedCountry}
            className={`
              px-12 py-4 text-xl font-bold rounded-lg transition-all duration-300 transform
              ${selectedCountry 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:scale-105 shadow-lg hover:shadow-blue-500/25' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Play className="w-6 h-6 inline mr-2" />
            Begin Strategic Campaign
          </button>
          
          {!selectedCountry && (
            <p className="text-gray-400 mt-3">Select a country to begin your campaign</p>
          )}
        </div>

        {/* Game Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800/30 rounded-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Strategic Depth</h3>
            <p className="text-gray-400">
              Master complex interconnected systems of military, economy, diplomacy, and intelligence
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">Advanced AI</h3>
            <p className="text-gray-400">
              Face sophisticated AI opponents with unique personalities and adaptive strategies
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-lg">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">Dynamic World</h3>
            <p className="text-gray-400">
              Experience unpredictable events, shifting alliances, and real geopolitical consequences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};