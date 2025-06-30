import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types/game';
import { calculateMissileFlightTime, calculateInterceptionWindow, MISSILE_TYPES } from '../utils/distanceCalculator';

interface GoogleMapComponentProps {
  gameState: GameState;
  onCountryClick: (countryId: string) => void;
  activeSimulation?: any;
  isDayMode?: boolean;
  threats?: any[];
  events?: any[];
  activeMissiles?: any[];
  activeAircraft?: any[];
  missileLaunches?: any[];
  aircraftLaunches?: any[];
}

interface CountryLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  flag: string;
}

const COUNTRY_LOCATIONS: CountryLocation[] = [
  { id: 'israel', name: 'Israel', lat: 31.0461, lng: 34.8516, flag: '🇮🇱' },
  { id: 'egypt', name: 'Egypt', lat: 26.8206, lng: 30.8025, flag: '🇪🇬' },
  { id: 'saudi', name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, flag: '🇸🇦' },
  { id: 'turkey', name: 'Turkey', lat: 38.9637, lng: 35.2433, flag: '🇹🇷' },
  { id: 'iran', name: 'Iran', lat: 32.4279, lng: 53.6880, flag: '🇮🇷' },
  { id: 'jordan', name: 'Jordan', lat: 30.5852, lng: 36.2384, flag: '🇯🇴' },
  { id: 'syria', name: 'Syria', lat: 34.8021, lng: 38.9968, flag: '🇸🇾' },
  { id: 'iraq', name: 'Iraq', lat: 33.2232, lng: 43.6793, flag: '🇮🇶' }
];

const ISRAELI_CITIES = [
  { name: 'תל אביב', lat: 32.0853, lng: 34.7818, type: 'major' },
  { name: 'ירושלים', lat: 31.7683, lng: 35.2137, type: 'capital' },
  { name: 'חיפה', lat: 32.7940, lng: 34.9896, type: 'major' },
  { name: 'באר שבע', lat: 31.2518, lng: 34.7915, type: 'major' },
  { name: 'אילת', lat: 29.5581, lng: 34.9482, type: 'strategic' },
  { name: 'נתניה', lat: 32.3215, lng: 34.8532, type: 'city' },
  { name: 'אשדוד', lat: 31.7940, lng: 34.6446, type: 'port' },
  { name: 'רמת גן', lat: 32.0719, lng: 34.8225, type: 'city' },
  { name: 'פתח תקווה', lat: 32.0878, lng: 34.8878, type: 'city' },
  { name: 'ראשון לציון', lat: 31.9730, lng: 34.8066, type: 'city' }
];

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ 
  gameState, 
  onCountryClick, 
  activeSimulation,
  isDayMode = true,
  threats = [],
  events = [],
  activeMissiles = [],
  activeAircraft = [],
  missileLaunches = [],
  aircraftLaunches = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapElement, setMapElement] = useState<any>(null);
  const [missileMarkers, setMissileMarkers] = useState<any[]>([]);
  const [aircraftMarkers, setAircraftMarkers] = useState<any[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        await customElements.whenDefined('gmp-map');
        await customElements.whenDefined('gmp-advanced-marker');
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps components:', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = document.createElement('gmp-map') as any;
    map.center = { lat: 31.0461, lng: 34.8516 };
    map.zoom = 7;
    map.mapId = 'DEMO_MAP_ID';
    
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(map);
    setMapElement(map);

    // Add country markers
    COUNTRY_LOCATIONS.forEach(location => {
      const country = gameState.countries[location.id];
      const isPlayer = location.id === gameState.currentPlayer;
      const relationship = gameState.countries[gameState.currentPlayer]?.diplomacy.relationships[location.id] || 0;
      
      const marker = document.createElement('gmp-advanced-marker') as any;
      marker.position = { lat: location.lat, lng: location.lng };
      marker.title = location.name;
      
      const markerContent = document.createElement('div');
      markerContent.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px solid white;
        background-color: ${
          isPlayer ? '#3B82F6' : 
          relationship > 50 ? '#10B981' : 
          relationship < -50 ? '#EF4444' : '#6B7280'
        };
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        position: relative;
        transition: all 0.3s ease;
        z-index: 10;
      `;
      markerContent.textContent = location.flag;
      
      if (country.military.nuclear.status !== 'none') {
        const nuclearIndicator = document.createElement('div');
        nuclearIndicator.style.cssText = `
          position: absolute;
          top: -5px;
          right: -5px;
          width: 16px;
          height: 16px;
          background-color: #FCD34D;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          animation: nuclear-pulse 2s infinite;
        `;
        nuclearIndicator.textContent = '⚛';
        markerContent.appendChild(nuclearIndicator);
      }
      
      marker.appendChild(markerContent);
      
      marker.addEventListener('click', () => {
        onCountryClick(location.id);
      });
      
      map.appendChild(marker);
    });

    // Add Israeli cities
    ISRAELI_CITIES.forEach(city => {
      const cityMarker = document.createElement('gmp-advanced-marker') as any;
      cityMarker.position = { lat: city.lat, lng: city.lng };
      cityMarker.title = city.name;
      
      const cityContent = document.createElement('div');
      cityContent.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        background-color: ${
          city.type === 'capital' ? '#FFD700' :
          city.type === 'major' ? '#FF6B6B' :
          city.type === 'strategic' ? '#4ECDC4' :
          city.type === 'port' ? '#45B7D1' :
          '#95E1D3'
        };
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        z-index: 5;
      `;
      cityContent.textContent = '●';
      
      cityMarker.appendChild(cityContent);
      map.appendChild(cityMarker);
    });

  }, [mapLoaded, gameState, onCountryClick]);

  // Handle missile animations with realistic timing
  useEffect(() => {
    if (!mapElement || !activeMissiles || activeMissiles.length === 0) return;

    activeMissiles.forEach(missile => {
      const fromLocation = COUNTRY_LOCATIONS.find(c => c.id === missile.from);
      const toLocation = COUNTRY_LOCATIONS.find(c => c.id === missile.to);
      
      if (!fromLocation || !toLocation) return;

      // Calculate realistic flight time
      const realFlightTime = calculateMissileFlightTime(missile.from, missile.to, 'jericho3');
      const animationDuration = Math.max(realFlightTime * 1000, 5000); // Minimum 5 seconds for visibility

      // Create missile marker with air2.png icon
      const missileMarker = document.createElement('gmp-advanced-marker') as any;
      missileMarker.position = { lat: fromLocation.lat, lng: fromLocation.lng };
      
      const missileContent = document.createElement('div');
      missileContent.style.cssText = `
        width: 40px;
        height: 40px;
        position: relative;
        z-index: 2000;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      // Create missile icon using air2.png
      const missileIcon = document.createElement('div');
      missileIcon.style.cssText = `
        width: 32px;
        height: 32px;
        background-image: url('/src/assets/air2.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.8));
        animation: missile-pulse 0.5s infinite alternate;
        position: relative;
      `;
      
      // Add flame trail effect
      const flameTrail = document.createElement('div');
      flameTrail.style.cssText = `
        position: absolute;
        width: 20px;
        height: 4px;
        background: linear-gradient(90deg, #FF0000, #FF4444, #FFAA00, transparent);
        left: -25px;
        top: 50%;
        transform: translateY(-50%);
        animation: flame-flicker 0.2s infinite;
        border-radius: 2px;
        z-index: 1999;
      `;
      missileIcon.appendChild(flameTrail);
      
      missileContent.appendChild(missileIcon);
      missileMarker.appendChild(missileContent);
      mapElement.appendChild(missileMarker);

      // Animate missile movement with realistic trajectory
      const startLat = fromLocation.lat;
      const startLng = fromLocation.lng;
      const endLat = toLocation.lat;
      const endLng = toLocation.lng;
      
      let progress = 0;
      const startTime = Date.now();
      
      const animateMissile = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / animationDuration, 1);
        
        // Calculate current position with realistic arc trajectory
        const midProgress = 0.5;
        const arcHeight = 1.2; // Degrees of arc for realistic trajectory
        
        let currentLat, currentLng;
        if (progress <= midProgress) {
          const t = progress / midProgress;
          currentLat = startLat + (endLat - startLat) * t + Math.sin(t * Math.PI) * arcHeight;
          currentLng = startLng + (endLng - startLng) * t;
        } else {
          const t = (progress - midProgress) / midProgress;
          currentLat = startLat + (endLat - startLat) * (midProgress + t * midProgress) + Math.sin((midProgress + t * midProgress) * Math.PI) * arcHeight;
          currentLng = startLng + (endLng - startLng) * (midProgress + t * midProgress);
        }
        
        // Calculate rotation angle based on direction
        const angle = Math.atan2(endLat - currentLat, endLng - currentLng) * 180 / Math.PI;
        missileIcon.style.transform = `rotate(${angle + 45}deg)`;
        
        missileMarker.position = { lat: currentLat, lng: currentLng };
        
        if (progress < 1) {
          requestAnimationFrame(animateMissile);
        } else {
          // Create massive explosion effect
          const explosionMarker = document.createElement('gmp-advanced-marker') as any;
          explosionMarker.position = { lat: endLat, lng: endLng };
          
          const explosionContent = document.createElement('div');
          explosionContent.style.cssText = `
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, #FF0000, #FF4444, #FF8800, #FFAA00, transparent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            animation: massive-explosion 4s ease-out forwards;
            box-shadow: 0 0 100px rgba(255, 0, 0, 1), 0 0 200px rgba(255, 68, 68, 0.8);
            z-index: 2001;
            position: relative;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.8));
          `;
          explosionContent.textContent = '💥';
          explosionMarker.appendChild(explosionContent);
          mapElement.appendChild(explosionMarker);
          
          // Remove missile marker
          missileMarker.remove();
          
          // Remove explosion after animation
          setTimeout(() => {
            explosionMarker.remove();
          }, 4000);
        }
      };
      
      animateMissile();
    });

  }, [mapElement, activeMissiles]);

  // Handle aircraft animations with round trip
  useEffect(() => {
    if (!mapElement || !activeAircraft || activeAircraft.length === 0) return;

    activeAircraft.forEach(mission => {
      const fromLocation = COUNTRY_LOCATIONS.find(c => c.id === 'israel');
      const toLocation = COUNTRY_LOCATIONS.find(c => c.id === mission.target);
      
      if (!fromLocation || !toLocation) return;

      // Create multiple aircraft based on aircraftCount
      for (let i = 0; i < mission.aircraftCount; i++) {
        setTimeout(() => {
          const aircraftMarker = document.createElement('gmp-advanced-marker') as any;
          aircraftMarker.position = { lat: fromLocation.lat, lng: fromLocation.lng };
          
          const aircraftContent = document.createElement('div');
          aircraftContent.style.cssText = `
            width: 32px;
            height: 32px;
            position: relative;
            z-index: 1500;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
          `;
          
          // Create aircraft icon using air3.png
          const aircraftIcon = document.createElement('div');
          aircraftIcon.style.cssText = `
            width: 28px;
            height: 28px;
            background-image: url('/src/assets/air3.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            filter: drop-shadow(0 0 5px rgba(0, 100, 255, 0.8));
            transition: transform 0.3s ease;
          `;
          
          aircraftContent.appendChild(aircraftIcon);
          aircraftMarker.appendChild(aircraftContent);
          mapElement.appendChild(aircraftMarker);

          // Animate outbound flight
          const animateOutbound = () => {
            const outboundDuration = mission.flightTimes.outbound * 60 * 1000; // Convert minutes to milliseconds
            let progress = 0;
            const startTime = Date.now();
            
            const outboundAnimation = () => {
              const elapsed = Date.now() - startTime;
              progress = Math.min(elapsed / outboundDuration, 1);
              
              const currentLat = fromLocation.lat + (toLocation.lat - fromLocation.lat) * progress;
              const currentLng = fromLocation.lng + (toLocation.lng - fromLocation.lng) * progress;
              
              // Calculate rotation angle
              const angle = Math.atan2(toLocation.lat - fromLocation.lat, toLocation.lng - fromLocation.lng) * 180 / Math.PI;
              aircraftIcon.style.transform = `rotate(${angle}deg)`;
              
              aircraftMarker.position = { lat: currentLat, lng: currentLng };
              
              if (progress < 1) {
                requestAnimationFrame(outboundAnimation);
              } else {
                // Start return flight after a brief pause
                setTimeout(() => {
                  animateReturn();
                }, 2000);
              }
            };
            
            outboundAnimation();
          };

          // Animate return flight
          const animateReturn = () => {
            const returnDuration = mission.flightTimes.return * 60 * 1000; // Convert minutes to milliseconds
            let progress = 0;
            const startTime = Date.now();
            
            const returnAnimation = () => {
              const elapsed = Date.now() - startTime;
              progress = Math.min(elapsed / returnDuration, 1);
              
              const currentLat = toLocation.lat + (fromLocation.lat - toLocation.lat) * progress;
              const currentLng = toLocation.lng + (fromLocation.lng - toLocation.lng) * progress;
              
              // Calculate rotation angle for return
              const angle = Math.atan2(fromLocation.lat - toLocation.lat, fromLocation.lng - toLocation.lng) * 180 / Math.PI;
              aircraftIcon.style.transform = `rotate(${angle}deg)`;
              
              aircraftMarker.position = { lat: currentLat, lng: currentLng };
              
              if (progress < 1) {
                requestAnimationFrame(returnAnimation);
              } else {
                // Remove aircraft marker when mission complete
                aircraftMarker.remove();
              }
            };
            
            returnAnimation();
          };

          animateOutbound();
        }, i * 500); // Stagger aircraft launches by 500ms
      }
    });

  }, [mapElement, activeAircraft]);

  // Handle active threats with enhanced visibility
  useEffect(() => {
    if (!mapElement || threats.length === 0) return;

    threats.filter(t => !t.intercepted).forEach(threat => {
      const threatMarker = document.createElement('gmp-advanced-marker') as any;
      threatMarker.position = { lat: 31.0461, lng: 34.8516 };
      
      const threatContent = document.createElement('div');
      threatContent.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: rgba(239, 68, 68, 0.9);
        border: 4px solid #DC2626;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        animation: threat-pulse 1s infinite;
        box-shadow: 0 0 40px rgba(239, 68, 68, 0.9);
        z-index: 1500;
        filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));
      `;
      threatContent.textContent = '🚨';
      
      threatMarker.appendChild(threatContent);
      mapElement.appendChild(threatMarker);
    });

  }, [mapElement, threats]);

  // Animate missile launches with air2.png
  useEffect(() => {
    if (!mapElement || !missileLaunches || missileLaunches.length === 0) return;
    missileLaunches.forEach(missile => {
      if (!missile.launchCoordinates) return;
      const from = { lat: missile.launchCoordinates[0], lng: missile.launchCoordinates[1] };
      const to = COUNTRY_LOCATIONS.find(c => c.id === missile.to);
      if (!to) return;
      const missileImg = document.createElement('img');
      missileImg.src = '/src/assets/air2.png';
      missileImg.style.position = 'absolute';
      missileImg.style.width = '32px';
      missileImg.style.height = '32px';
      missileImg.style.zIndex = '2000';
      missileImg.style.pointerEvents = 'none';
      missileImg.style.transition = 'transform 0.3s linear';
      mapElement.appendChild(missileImg);

      // Simple linear animation (for demo)
      let progress = 0;
      const steps = 60;
      const animate = () => {
        progress += 1 / steps;
        const lat = from.lat + (to.lat - from.lat) * progress;
        const lng = from.lng + (to.lng - from.lng) * progress;
        // Convert lat/lng to pixel (approximate, for demo)
        const x = (lng + 180) * (mapElement.offsetWidth / 360);
        const y = (90 - lat) * (mapElement.offsetHeight / 180);
        missileImg.style.transform = `translate(${x}px, ${y}px)`;
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          missileImg.remove();
        }
      };
      animate();
    });
  }, [mapElement, missileLaunches]);

  // Animate aircraft launches with air3.png
  useEffect(() => {
    if (!mapElement || !aircraftLaunches || aircraftLaunches.length === 0) return;
    aircraftLaunches.forEach(aircraft => {
      if (!aircraft.launchCoordinates) return;
      const from = { lat: aircraft.launchCoordinates[0], lng: aircraft.launchCoordinates[1] };
      const to = COUNTRY_LOCATIONS.find(c => c.id === aircraft.target);
      if (!to) return;
      const aircraftImg = document.createElement('img');
      aircraftImg.src = '/src/assets/air3.png';
      aircraftImg.style.position = 'absolute';
      aircraftImg.style.width = '36px';
      aircraftImg.style.height = '36px';
      aircraftImg.style.zIndex = '2000';
      aircraftImg.style.pointerEvents = 'none';
      aircraftImg.style.transition = 'transform 0.3s linear, opacity 0.5s linear';
      aircraftImg.style.opacity = '1';
      mapElement.appendChild(aircraftImg);

      let progress = 0;
      const steps = 80;
      const animate = () => {
        progress += 1 / steps;
        const lat = from.lat + (to.lat - from.lat) * progress;
        const lng = from.lng + (to.lng - from.lng) * progress;
        const x = (lng + 180) * (mapElement.offsetWidth / 360);
        const y = (90 - lat) * (mapElement.offsetHeight / 180);
        aircraftImg.style.transform = `translate(${x}px, ${y}px)`;
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          aircraftImg.style.opacity = '0';
          setTimeout(() => aircraftImg.remove(), 500);
        }
      };
      animate();
    });
  }, [mapElement, aircraftLaunches]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">טוען מפה...</p>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes threat-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        
        @keyframes nuclear-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 5px #FCD34D; }
          50% { transform: scale(1.3); box-shadow: 0 0 25px #FCD34D; }
        }
        
        @keyframes missile-pulse {
          0% { filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.8)); }
          100% { filter: drop-shadow(0 0 20px rgba(255, 0, 0, 1)); }
        }
        
        @keyframes flame-flicker {
          0%, 100% { opacity: 1; transform: translateY(-50%) scaleX(1); }
          25% { opacity: 0.8; transform: translateY(-50%) scaleX(0.8); }
          50% { opacity: 0.6; transform: translateY(-50%) scaleX(0.6); }
          75% { opacity: 0.9; transform: translateY(-50%) scaleX(1.2); }
        }
        
        @keyframes massive-explosion {
          0% { transform: scale(0); opacity: 1; }
          15% { transform: scale(0.3); opacity: 1; }
          30% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.9; }
          70% { transform: scale(2.5); opacity: 0.7; }
          85% { transform: scale(4); opacity: 0.4; }
          100% { transform: scale(6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};