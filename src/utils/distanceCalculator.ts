// Distance and timing calculations for realistic missile and aircraft operations
export interface CountryCoordinates {
  lat: number;
  lng: number;
}

export const COUNTRY_COORDINATES: Record<string, CountryCoordinates> = {
  israel: { lat: 31.0461, lng: 34.8516 },
  egypt: { lat: 26.8206, lng: 30.8025 },
  saudi: { lat: 23.8859, lng: 45.0792 },
  turkey: { lat: 38.9637, lng: 35.2433 },
  iran: { lat: 32.4279, lng: 53.6880 },
  jordan: { lat: 30.5852, lng: 36.2384 },
  syria: { lat: 34.8021, lng: 38.9968 },
  iraq: { lat: 33.2232, lng: 43.6793 },
  uae: { lat: 24.4539, lng: 54.3773 },
  qatar: { lat: 25.276987, lng: 51.520008 },
  bahrain: { lat: 26.0667, lng: 50.5577 },
  oman: { lat: 23.5859, lng: 58.4059 },
  kuwait: { lat: 29.3759, lng: 47.9774 },
  yemen: { lat: 15.5527, lng: 48.5164 },
  libya: { lat: 26.3351, lng: 17.2283 },
  sudan: { lat: 12.8628, lng: 30.2176 },
  morocco: { lat: 31.7917, lng: -7.0926 },
  tunisia: { lat: 33.8869, lng: 9.5375 },
  algeria: { lat: 28.0339, lng: 1.6596 },
  pakistan: { lat: 30.3753, lng: 69.3451 },
  afghanistan: { lat: 33.9391, lng: 67.7100 },
  cyprus: { lat: 35.1264, lng: 33.4299 },
  greece: { lat: 39.0742, lng: 21.8243 }
};

// Calculate distance between two points using Haversine formula
export function calculateDistance(from: CountryCoordinates, to: CountryCoordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Missile types with their characteristics
export interface MissileType {
  id: string;
  name: string;
  speed: number; // km/h
  range: number; // km
  type: 'ballistic' | 'cruise' | 'tactical';
}

export const MISSILE_TYPES: Record<string, MissileType> = {
  jericho3: { id: 'jericho3', name: 'יריחו III', speed: 7000, range: 4800, type: 'ballistic' },
  delilah: { id: 'delilah', name: 'דלילה', speed: 900, range: 250, type: 'cruise' },
  spike: { id: 'spike', name: 'ספייק NLOS', speed: 400, range: 25, type: 'tactical' },
  scud: { id: 'scud', name: 'סקאד', speed: 2000, range: 700, type: 'ballistic' },
  fateh: { id: 'fateh', name: 'פאתח', speed: 3000, range: 500, type: 'ballistic' },
  qassam: { id: 'qassam', name: 'קסאם', speed: 800, range: 40, type: 'tactical' },
  s400: { id: 's400', name: 'S-400', speed: 4800, range: 400, type: 'ballistic' },
  patriot: { id: 'patriot', name: 'Patriot', speed: 5000, range: 160, type: 'ballistic' },
  shahed136: { id: 'shahed136', name: 'Shahed-136', speed: 185, range: 2500, type: 'cruise' }
};

// Aircraft types with their characteristics
export interface AircraftType {
  id: string;
  name: string;
  speed: number; // km/h
  range: number; // km
  type: 'fighter' | 'bomber' | 'transport';
}

export const AIRCRAFT_TYPES: Record<string, AircraftType> = {
  f35: { id: 'f35', name: 'F-35', speed: 1900, range: 2200, type: 'fighter' },
  f16: { id: 'f16', name: 'F-16', speed: 2100, range: 4200, type: 'fighter' },
  f15: { id: 'f15', name: 'F-15', speed: 2650, range: 4800, type: 'fighter' },
  apache: { id: 'apache', name: 'אפאצ\'י', speed: 365, range: 480, type: 'fighter' },
  bayraktar: { id: 'bayraktar', name: 'Bayraktar TB2', speed: 130, range: 150, type: 'fighter' },
  rafale: { id: 'rafale', name: 'Rafale', speed: 1912, range: 3700, type: 'fighter' },
  su35: { id: 'su35', name: 'Su-35', speed: 2400, range: 3600, type: 'fighter' },
  f22: { id: 'f22', name: 'F-22 Raptor', speed: 2410, range: 2960, type: 'fighter' },
  f4: { id: 'f4', name: 'F-4 Phantom', speed: 2370, range: 2600, type: 'fighter' },
  f7: { id: 'f7', name: 'F-7', speed: 1700, range: 2200, type: 'fighter' },
  mig29: { id: 'mig29', name: 'MiG-29', speed: 2450, range: 2100, type: 'fighter' }
};

// Calculate flight time for missiles
export function calculateMissileFlightTime(
  fromCountry: string, 
  toCountry: string, 
  missileType: string
): number {
  const fromCoords = COUNTRY_COORDINATES[fromCountry];
  const toCoords = COUNTRY_COORDINATES[toCountry];
  const missile = MISSILE_TYPES[missileType];
  
  if (!fromCoords || !toCoords || !missile) return 0;
  
  const distance = calculateDistance(fromCoords, toCoords);
  
  // Check if target is within range
  if (distance > missile.range) return -1; // Out of range
  
  // Calculate flight time in minutes
  const flightTimeHours = distance / missile.speed;
  return flightTimeHours * 60; // Convert to minutes
}

// Calculate flight time for aircraft (round trip)
export function calculateAircraftFlightTime(
  fromCountry: string, 
  toCountry: string, 
  aircraftType: string
): { outbound: number; return: number; total: number } {
  const fromCoords = COUNTRY_COORDINATES[fromCountry];
  const toCoords = COUNTRY_COORDINATES[toCountry];
  const aircraft = AIRCRAFT_TYPES[aircraftType];
  
  if (!fromCoords || !toCoords || !aircraft) {
    return { outbound: 0, return: 0, total: 0 };
  }
  
  const distance = calculateDistance(fromCoords, toCoords);
  
  // Check if target is within range
  if (distance > aircraft.range) return { outbound: -1, return: -1, total: -1 };
  
  // Calculate flight time in minutes (one way)
  const flightTimeHours = distance / aircraft.speed;
  const oneWayMinutes = flightTimeHours * 60;
  
  return {
    outbound: oneWayMinutes,
    return: oneWayMinutes,
    total: oneWayMinutes * 2
  };
}

// Calculate interception window
export function calculateInterceptionWindow(
  missileFlightTime: number, // in minutes
  defenseSystem: 'iron_dome' | 'arrow3' | 'david_sling'
): { interceptTime: number; windowStart: number; windowEnd: number } {
  const interceptRanges = {
    iron_dome: { min: 0.5, max: 2 }, // minutes before impact
    arrow3: { min: 3, max: 8 }, // minutes before impact
    david_sling: { min: 1, max: 4 } // minutes before impact
  };
  
  const range = interceptRanges[defenseSystem];
  const interceptTime = missileFlightTime - range.min;
  
  return {
    interceptTime,
    windowStart: missileFlightTime - range.max,
    windowEnd: missileFlightTime - range.min
  };
}