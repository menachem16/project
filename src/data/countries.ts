import { Country } from '../types/game';

export const COUNTRIES: Record<string, Country> = {
  israel: {
    id: 'israel',
    name: 'Israel',
    capital: 'Jerusalem',
    flag: '🇮🇱',
    ideology: 'democracy',
    population: 9500000,
    demographics: {
      ethnic: { jewish: 74, arab: 21, other: 5 },
      religious: { jewish: 73, muslim: 18, christian: 2, other: 7 }
    },
    economy: {
      gdp: 481000000000,
      sectors: { oil: 0, technology: 45, tourism: 15, agriculture: 8, industry: 32 },
      budget: {
        income: 120000000000,
        expenses: { defense: 24000000000, health: 18000000000, education: 15000000000, infrastructure: 12000000000 }
      },
      debt: 72,
      inflation: 3.5,
      sanctions: []
    },
    military: {
      units: { infantry: 45, armor: 85, airForce: 95, navy: 60, special: 90, missiles: 85, drones: 80, cyber: 95 },
      doctrine: 'offensive',
      nuclear: { status: 'operational', warheads: 90, delivery: ['missiles', 'submarines'] },
      experience: 95,
      morale: 85
    },
    politics: {
      stability: 70,
      corruption: 25,
      publicSupport: 65,
      freedomIndex: 85,
      pressureGroups: { opposition: 40, minorities: 30, military: 20, religious: 35 }
    },
    diplomacy: {
      relationships: {
        egypt: 40, saudi: 30, turkey: -20, iran: -90, jordan: 60, syria: -80, iraq: -40
      },
      agreements: ['Camp David', 'Abraham Accords'],
      organizations: ['UN', 'OECD']
    },
    intelligence: {
      agencies: 90,
      budget: 3000000000,
      capabilities: { gathering: 95, analysis: 90, cyber: 85, counterIntel: 90 }
    },
    resources: { water: 30, oil: 5, gas: 40, minerals: 60, food: 40 }
  },
  
  egypt: {
    id: 'egypt',
    name: 'Egypt',
    capital: 'Cairo',
    flag: '🇪🇬',
    ideology: 'autocracy',
    population: 104000000,
    demographics: {
      ethnic: { arab: 99, other: 1 },
      religious: { muslim: 90, christian: 10 }
    },
    economy: {
      gdp: 469000000000,
      sectors: { oil: 20, technology: 8, tourism: 25, agriculture: 20, industry: 27 },
      budget: {
        income: 85000000000,
        expenses: { defense: 12000000000, health: 8000000000, education: 10000000000, infrastructure: 15000000000 }
      },
      debt: 85,
      inflation: 8.5,
      sanctions: []
    },
    military: {
      units: { infantry: 75, armor: 70, airForce: 65, navy: 50, special: 60, missiles: 50, drones: 40, cyber: 35 },
      doctrine: 'defensive',
      nuclear: { status: 'none', warheads: 0, delivery: [] },
      experience: 70,
      morale: 65
    },
    politics: {
      stability: 60,
      corruption: 70,
      publicSupport: 55,
      freedomIndex: 25,
      pressureGroups: { opposition: 60, minorities: 20, military: 80, religious: 50 }
    },
    diplomacy: {
      relationships: {
        israel: 40, saudi: 70, turkey: 30, iran: -30, jordan: 80, syria: 20, iraq: 40
      },
      agreements: ['Camp David', 'Arab League Charter'],
      organizations: ['UN', 'Arab League', 'African Union']
    },
    intelligence: {
      agencies: 60,
      budget: 1500000000,
      capabilities: { gathering: 65, analysis: 60, cyber: 40, counterIntel: 70 }
    },
    resources: { water: 20, oil: 60, gas: 70, minerals: 40, food: 30 }
  },

  saudi: {
    id: 'saudi',
    name: 'Saudi Arabia',
    capital: 'Riyadh',
    flag: '🇸🇦',
    ideology: 'autocracy',
    population: 35000000,
    demographics: {
      ethnic: { arab: 90, other: 10 },
      religious: { muslim: 100 }
    },
    economy: {
      gdp: 833000000000,
      sectors: { oil: 70, technology: 5, tourism: 5, agriculture: 3, industry: 17 },
      budget: {
        income: 280000000000,
        expenses: { defense: 70000000000, health: 20000000000, education: 25000000000, infrastructure: 50000000000 }
      },
      debt: 25,
      inflation: 2.5,
      sanctions: []
    },
    military: {
      units: { infantry: 60, armor: 80, airForce: 85, navy: 40, special: 70, missiles: 75, drones: 60, cyber: 50 },
      doctrine: 'offensive',
      nuclear: { status: 'developing', warheads: 0, delivery: ['missiles'] },
      experience: 55,
      morale: 70
    },
    politics: {
      stability: 75,
      corruption: 60,
      publicSupport: 70,
      freedomIndex: 15,
      pressureGroups: { opposition: 20, minorities: 10, military: 30, religious: 80 }
    },
    diplomacy: {
      relationships: {
        israel: 30, egypt: 70, turkey: 40, iran: -70, jordan: 85, syria: -20, iraq: 50
      },
      agreements: ['Abraham Accords', 'GCC Charter'],
      organizations: ['UN', 'Arab League', 'GCC', 'OPEC']
    },
    intelligence: {
      agencies: 70,
      budget: 8000000000,
      capabilities: { gathering: 75, analysis: 70, cyber: 60, counterIntel: 65 }
    },
    resources: { water: 10, oil: 95, gas: 85, minerals: 30, food: 15 }
  },

  turkey: {
    id: 'turkey',
    name: 'Turkey',
    capital: 'Ankara',
    flag: '🇹🇷',
    ideology: 'autocracy',
    population: 85000000,
    demographics: {
      ethnic: { turkish: 70, kurdish: 20, other: 10 },
      religious: { muslim: 99, other: 1 }
    },
    economy: {
      gdp: 819000000000,
      sectors: { oil: 5, technology: 15, tourism: 20, agriculture: 25, industry: 35 },
      budget: {
        income: 200000000000,
        expenses: { defense: 20000000000, health: 25000000000, education: 30000000000, infrastructure: 35000000000 }
      },
      debt: 40,
      inflation: 15.2,
      sanctions: ['EU partial', 'US targeted']
    },
    military: {
      units: { infantry: 80, armor: 75, airForce: 70, navy: 65, special: 75, missiles: 60, drones: 90, cyber: 55 },
      doctrine: 'offensive',
      nuclear: { status: 'none', warheads: 0, delivery: [] },
      experience: 80,
      morale: 75
    },
    politics: {
      stability: 50,
      corruption: 65,
      publicSupport: 60,
      freedomIndex: 30,
      pressureGroups: { opposition: 70, minorities: 80, military: 40, religious: 60 }
    },
    diplomacy: {
      relationships: {
        israel: -20, egypt: 30, saudi: 40, iran: 20, jordan: 50, syria: -60, iraq: 60
      },
      agreements: ['NATO Charter'],
      organizations: ['UN', 'NATO', 'G20']
    },
    intelligence: {
      agencies: 75,
      budget: 3500000000,
      capabilities: { gathering: 80, analysis: 75, cyber: 70, counterIntel: 70 }
    },
    resources: { water: 60, oil: 20, gas: 25, minerals: 70, food: 80 }
  },

  iran: {
    id: 'iran',
    name: 'Iran',
    capital: 'Tehran',
    flag: '🇮🇷',
    ideology: 'theocracy',
    population: 85000000,
    demographics: {
      ethnic: { persian: 61, azeri: 16, kurd: 10, other: 13 },
      religious: { muslim: 99, other: 1 }
    },
    economy: {
      gdp: 231000000000,
      sectors: { oil: 60, technology: 8, tourism: 2, agriculture: 15, industry: 15 },
      budget: {
        income: 60000000000,
        expenses: { defense: 25000000000, health: 8000000000, education: 10000000000, infrastructure: 12000000000 }
      },
      debt: 45,
      inflation: 40.0,
      sanctions: ['US comprehensive', 'EU comprehensive', 'UN targeted']
    },
    military: {
      units: { infantry: 70, armor: 60, airForce: 45, navy: 50, special: 80, missiles: 90, drones: 85, cyber: 75 },
      doctrine: 'asymmetric',
      nuclear: { status: 'developing', warheads: 0, delivery: ['missiles'] },
      experience: 75,
      morale: 80
    },
    politics: {
      stability: 45,
      corruption: 80,
      publicSupport: 40,
      freedomIndex: 10,
      pressureGroups: { opposition: 85, minorities: 70, military: 70, religious: 90 }
    },
    diplomacy: {
      relationships: {
        israel: -90, egypt: -30, saudi: -70, turkey: 20, jordan: -40, syria: 80, iraq: 70
      },
      agreements: ['JCPOA (suspended)'],
      organizations: ['UN', 'OIC']
    },
    intelligence: {
      agencies: 85,
      budget: 4000000000,
      capabilities: { gathering: 80, analysis: 75, cyber: 85, counterIntel: 80 }
    },
    resources: { water: 40, oil: 90, gas: 95, minerals: 60, food: 50 }
  },

  jordan: {
    id: 'jordan',
    name: 'Jordan',
    capital: 'Amman',
    flag: '🇯🇴',
    ideology: 'autocracy',
    population: 11000000,
    demographics: {
      ethnic: { arab: 98, other: 2 },
      religious: { muslim: 95, christian: 4, other: 1 }
    },
    economy: {
      gdp: 47000000000,
      sectors: { oil: 2, technology: 10, tourism: 20, agriculture: 15, industry: 53 },
      budget: {
        income: 12000000000,
        expenses: { defense: 2000000000, health: 1500000000, education: 2000000000, infrastructure: 1800000000 }
      },
      debt: 95,
      inflation: 4.2,
      sanctions: []
    },
    military: {
      units: { infantry: 50, armor: 45, airForce: 40, navy: 20, special: 70, missiles: 30, drones: 25, cyber: 30 },
      doctrine: 'defensive',
      nuclear: { status: 'none', warheads: 0, delivery: [] },
      experience: 65,
      morale: 70
    },
    politics: {
      stability: 65, 
      corruption: 50,
      publicSupport: 60,
      freedomIndex: 40,
      pressureGroups: { opposition: 50, minorities: 30, military: 40, religious: 45 }
    },
    diplomacy: {
      relationships: {
        israel: 60, egypt: 80, saudi: 85, turkey: 50, iran: -40, syria: 30, iraq: 60
      },
      agreements: ['Wadi Araba Treaty'],
      organizations: ['UN', 'Arab League']
    },
    intelligence: {
      agencies: 60,
      budget: 500000000,
      capabilities: { gathering: 65, analysis: 60, cyber: 35, counterIntel: 70 }
    },
    resources: { water: 15, oil: 5, gas: 10, minerals: 40, food: 25 }
  },

  syria: {
    id: 'syria',
    name: 'Syria',
    capital: 'Damascus',
    flag: '🇸🇾',
    ideology: 'autocracy',
    population: 19000000,
    demographics: {
      ethnic: { arab: 90, kurd: 9, other: 1 },
      religious: { muslim: 87, christian: 10, other: 3 }
    },
    economy: {
      gdp: 40000000000,
      sectors: { oil: 40, technology: 2, tourism: 5, agriculture: 25, industry: 28 },
      budget: {
        income: 8000000000,
        expenses: { defense: 4000000000, health: 800000000, education: 1000000000, infrastructure: 1200000000 }
      },
      debt: 120,
      inflation: 25.0,
      sanctions: ['US comprehensive', 'EU comprehensive']
    },
    military: {
      units: { infantry: 40, armor: 35, airForce: 25, navy: 15, special: 45, missiles: 40, drones: 30, cyber: 20 },
      doctrine: 'defensive',
      nuclear: { status: 'none', warheads: 0, delivery: [] },
      experience: 85,
      morale: 50
    },
    politics: {
      stability: 25,
      corruption: 90,
      publicSupport: 30,
      freedomIndex: 5,
      pressureGroups: { opposition: 90, minorities: 85, military: 60, religious: 40 }
    },
    diplomacy: {
      relationships: {
        israel: -80, egypt: 20, saudi: -20, turkey: -60, iran: 80, jordan: 30, iraq: 60
      },
      agreements: [],
      organizations: ['UN', 'Arab League (suspended)']
    },
    intelligence: {
      agencies: 70,
      budget: 800000000,
      capabilities: { gathering: 60, analysis: 50, cyber: 30, counterIntel: 75 }
    },
    resources: { water: 25, oil: 40, gas: 35, minerals: 30, food: 20 }
  },

  iraq: {
    id: 'iraq',
    name: 'Iraq',
    capital: 'Baghdad',
    flag: '🇮🇶',
    ideology: 'democracy',
    population: 41000000,
    demographics: {
      ethnic: { arab: 75, kurd: 20, other: 5 },
      religious: { muslim: 99, other: 1 }
    },
    economy: {
      gdp: 234000000000,
      sectors: { oil: 85, technology: 2, tourism: 1, agriculture: 5, industry: 7 },
      budget: {
        income: 80000000000,
        expenses: { defense: 8000000000, health: 4000000000, education: 6000000000, infrastructure: 15000000000 }
      },
      debt: 65,
      inflation: 6.0,
      sanctions: []
    },
    military: {
      units: { infantry: 45, armor: 40, airForce: 30, navy: 10, special: 50, missiles: 25, drones: 20, cyber: 15 },
      doctrine: 'defensive',
      nuclear: { status: 'none', warheads: 0, delivery: [] },
      experience: 60,
      morale: 55
    },
    politics: {
      stability: 30,
      corruption: 85,
      publicSupport: 35,
      freedomIndex: 35,
      pressureGroups: { opposition: 75, minorities: 60, military: 50, religious: 70 }
    },
    diplomacy: {
      relationships: {
        israel: -40, egypt: 40, saudi: 50, turkey: 60, iran: 70, jordan: 60, syria: 60
      },
      agreements: [],
      organizations: ['UN', 'Arab League', 'OPEC']
    },
    intelligence: {
      agencies: 40,
      budget: 1200000000,
      capabilities: { gathering: 45, analysis: 40, cyber: 25, counterIntel: 50 }
    },
    resources: { water: 70, oil: 95, gas: 80, minerals: 50, food: 35 }
  },

  uae: {
    id: 'uae',
    name: 'United Arab Emirates',
    capital: 'Abu Dhabi',
    flag: '🇦🇪',
    ideology: 'autocracy',
    population: 9800000,
    demographics: { ethnic: { arab: 12, other: 88 }, religious: { muslim: 76, christian: 9, hindu: 15 } },
    economy: { gdp: 421000000000, sectors: { oil: 30, technology: 10, tourism: 20, agriculture: 2, industry: 38 }, budget: { income: 120000000000, expenses: { defense: 25000000000, health: 12000000000, education: 10000000000, infrastructure: 15000000000 } }, debt: 20, inflation: 2.2, sanctions: [] },
    military: { units: { infantry: 30, armor: 40, airForce: 50, navy: 30, special: 40, missiles: 30, drones: 40, cyber: 30 }, doctrine: 'defensive', nuclear: { status: 'none', warheads: 0, delivery: [] }, experience: 50, morale: 60 },
    politics: { stability: 80, corruption: 30, publicSupport: 80, freedomIndex: 20, pressureGroups: { opposition: 10, minorities: 10, military: 20, religious: 40 } },
    diplomacy: { relationships: { israel: 60, saudi: 80, iran: -40, egypt: 70, qatar: 30, bahrain: 80 }, agreements: ['Abraham Accords'], organizations: ['UN', 'Arab League', 'GCC'] },
    intelligence: { agencies: 40, budget: 1000000000, capabilities: { gathering: 40, analysis: 40, cyber: 30, counterIntel: 40 } },
    resources: { water: 5, oil: 80, gas: 60, minerals: 10, food: 10 }
  }
};