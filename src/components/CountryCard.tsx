import React from 'react';
import { Country } from '../types/game';
import { Shield, DollarSign, Users, Zap } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  onSelect: (countryId: string) => void;
  selected: boolean;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onSelect, selected }) => {
  const getIdeologyColor = (ideology: string) => {
    switch (ideology) {
      case 'democracy': return 'bg-blue-500';
      case 'autocracy': return 'bg-red-500';
      case 'theocracy': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getIdeologyText = (ideology: string) => {
    switch (ideology) {
      case 'democracy': return 'Democracy';
      case 'autocracy': return 'Autocracy';
      case 'theocracy': return 'Theocracy';
      default: return 'Unknown';
    }
  };

  return (
    <div 
      className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-700 border-2 ${
        selected ? 'border-blue-400 shadow-lg shadow-blue-400/20' : 'border-gray-600'
      }`}
      onClick={() => onSelect(country.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{country.flag}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{country.name}</h3>
            <p className="text-gray-400 text-sm">{country.capital}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs text-white ${getIdeologyColor(country.ideology)}`}>
          {getIdeologyText(country.ideology)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">
            {(country.population / 1000000).toFixed(1)}M
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">
            ${(country.economy.gdp / 1000000000).toFixed(0)}B
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          <span className="text-sm text-gray-300">
            Military: {country.military.units.infantry + country.military.units.armor + country.military.units.airForce}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">
            Stability: {country.politics.stability}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Military Power</span>
          <span className="text-gray-300">{country.military.experience}/100</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${country.military.experience}%` }}
          />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Economic Health</span>
          <span className="text-gray-300">{Math.max(0, 100 - country.economy.debt)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.max(0, 100 - country.economy.debt)}%` }}
          />
        </div>
      </div>

      {country.military.nuclear.status !== 'none' && (
        <div className="mt-3 px-2 py-1 bg-yellow-600 rounded text-xs text-center">
          ⚛️ Nuclear Program: {country.military.nuclear.status}
        </div>
      )}

      {country.economy.sanctions.length > 0 && (
        <div className="mt-2 px-2 py-1 bg-red-600 rounded text-xs text-center">
          🚫 Under Sanctions
        </div>
      )}
    </div>
  );
};