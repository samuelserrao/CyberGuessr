import { useState, useRef, useEffect } from 'react';
import { CheckCircle, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Neon Cyberpunk Marker Icons using Leaflet's divIcon
const guessIcon = L.divIcon({
  className: 'custom-guess-marker',
  html: `<div class="relative flex items-center justify-center w-8 h-8 pointer-events-none">
           <div class="absolute w-8 h-8 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 animate-ping"></div>
           <div class="absolute w-4 h-4 rounded-full bg-cyber-cyan border-2 border-white shadow-[0_0_12px_rgba(6,182,212,0.85)]"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const actualIcon = L.divIcon({
  className: 'custom-actual-marker',
  html: `<div class="relative flex items-center justify-center w-8 h-8 pointer-events-none">
           <div class="absolute w-8 h-8 rounded-full bg-cyber-neonGreen/20 border border-cyber-neonGreen/40 animate-pulse"></div>
           <div class="absolute w-4 h-4 rounded-full bg-cyber-neonGreen border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.85)]"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function MapPanel({ 
  onGuess, 
  currentRound, 
  isRoundActive, 
  actualLocation, 
  showResultMap,
  userGuessCoord,
  mapTheme
}) {
  const [marker, setMarker] = useState(null); // { lat, lng }
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('tactical');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const guessMarkerRef = useRef(null);
  const actualMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  // Load standard or custom tile layers dynamically
  const loadTileLayer = (themeName) => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = '';
    let attrib = '';
    let maxZoom = 19;

    if (themeName === 'satellite') {
      // Esri Satellite Feed
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attrib = 'Tiles &copy; Esri &mdash; Source: Esri';
      maxZoom = 18;
    } else if (themeName === 'outline') {
      // CartoDB Voyager (High contrast clear pastel details)
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
    } else {
      // 'tactical' - CartoDB Dark Matter
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom,
      minZoom: 1,
      detectRetina: true,
      attribution: attrib
    }).addTo(map);

    setCurrentTheme(themeName);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 1.2,
      zoomControl: false,
      attributionControl: true
    });

    mapRef.current = map;

    // Load initial theme
    loadTileLayer(mapTheme || 'tactical');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync with prop mapTheme changes from Settings page
  useEffect(() => {
    if (mapTheme && mapTheme !== currentTheme) {
      loadTileLayer(mapTheme);
    }
  }, [mapTheme]);

  // Set up click handler on the Leaflet Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onMapClick = (e) => {
      if (!isRoundActive || showResultMap) return;

      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });

      if (guessMarkerRef.current) {
        guessMarkerRef.current.setLatLng([lat, lng]);
      } else {
        guessMarkerRef.current = L.marker([lat, lng], { icon: guessIcon }).addTo(map);
      }
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [isRoundActive, showResultMap]);

  // Handle resizing / expanding transition to prevent gray regions
  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 350); // wait for tailwind expand transition (duration-300)
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Reset marker state when round transitions
  useEffect(() => {
    if (!showResultMap) {
      setMarker(null);
      if (guessMarkerRef.current) {
        guessMarkerRef.current.remove();
        guessMarkerRef.current = null;
      }
    }
  }, [currentRound, showResultMap]);

  // Update map markers, polyline and bounds on showResultMap changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up result-specific elements
    if (actualMarkerRef.current) {
      actualMarkerRef.current.remove();
      actualMarkerRef.current = null;
    }
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (showResultMap) {
      const points = [];

      // Add/update player guess marker
      const guessCoord = userGuessCoord || marker;
      if (guessCoord && guessCoord.lat !== undefined && guessCoord.lng !== undefined) {
        if (guessMarkerRef.current) {
          guessMarkerRef.current.setLatLng([guessCoord.lat, guessCoord.lng]);
        } else {
          guessMarkerRef.current = L.marker([guessCoord.lat, guessCoord.lng], { icon: guessIcon }).addTo(map);
        }
        points.push([guessCoord.lat, guessCoord.lng]);
      }

      // Add actual target location marker
      if (actualLocation && actualLocation.lat !== undefined && actualLocation.lng !== undefined) {
        actualMarkerRef.current = L.marker([actualLocation.lat, actualLocation.lng], { icon: actualIcon }).addTo(map);
        points.push([actualLocation.lat, actualLocation.lng]);
      }

      // Draw dashed line & fit bounds
      if (points.length === 2) {
        polylineRef.current = L.polyline(points, {
          color: '#ec4899', // pink (cyber-secondary)
          weight: 3,
          dashArray: '6, 6',
          className: 'animate-pulse-slow'
        }).addTo(map);

        map.fitBounds(points, { padding: [50, 50], maxZoom: 10 });
      }
    } else {
      // Normal playing phase
      if (!marker && guessMarkerRef.current) {
        guessMarkerRef.current.remove();
        guessMarkerRef.current = null;
      }
      map.setView([20, 0], 1.2);
    }
  }, [showResultMap, actualLocation, userGuessCoord, marker]);

  const handleReset = () => {
    setMarker(null);
    if (guessMarkerRef.current) {
      guessMarkerRef.current.remove();
      guessMarkerRef.current = null;
    }
  };

  const handleGuessSubmit = () => {
    if (!marker) return;
    onGuess(marker.lat, marker.lng);
  };

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        isExpanded 
          ? 'w-full h-[400px] md:h-[500px] border-cyber-cyan/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]' 
          : 'w-full h-[280px] md:h-[320px] border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)]'
      } bg-cyber-dark/85 backdrop-blur-md flex flex-col group`}
    >
      
      {/* Map Header Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/5 text-xs font-cyber tracking-wider text-gray-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
          <span>TACTICAL WORLD GRID</span>
        </div>
        
        <div className="flex items-center gap-3">
          {marker && !showResultMap && (
            <span className="text-[10px] text-cyber-cyan font-mono">
              TARGET LOCK: {marker.lat.toFixed(2)}°, {marker.lng.toFixed(2)}°
            </span>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors duration-200"
            title={isExpanded ? "Collapse Map" : "Expand Map"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Leaflet Map Interactive Container */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full bg-cyber-dark z-0" />

        {/* Real-time floating HUD Theme Selector Control */}
        <div className="absolute bottom-3 left-3 flex gap-1 z-[1000] bg-black/80 p-1.5 rounded-lg border border-white/10 backdrop-blur-md select-none">
          <button
            type="button"
            onClick={() => loadTileLayer('tactical')}
            className={`px-2.5 py-0.5 text-[9px] font-cyber tracking-wider rounded transition-all duration-200 ${
              currentTheme === 'tactical' 
                ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            DARK
          </button>
          <button
            type="button"
            onClick={() => loadTileLayer('outline')}
            className={`px-2.5 py-0.5 text-[9px] font-cyber tracking-wider rounded transition-all duration-200 ${
              currentTheme === 'outline' 
                ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Detailed high contrast light map"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => loadTileLayer('satellite')}
            className={`px-2.5 py-0.5 text-[9px] font-cyber tracking-wider rounded transition-all duration-200 ${
              currentTheme === 'satellite' 
                ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            SATELLITE
          </button>
        </div>

        {/* Legend Overlay for Result view */}
        {showResultMap && (
          <div className="absolute top-3 left-3 bg-black/75 border border-white/10 p-2.5 rounded-lg text-[10px] font-cyber flex flex-col gap-1.5 pointer-events-none backdrop-blur-md z-[1000]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan" />
              <span className="text-gray-300">YOUR GUESS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonGreen" />
              <span className="text-gray-300">ACTUAL LOCATION</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Action Buttons */}
      {!showResultMap && (
        <div className="flex border-t border-white/5 bg-black/20 p-3 items-center justify-between gap-3 z-[1000]">
          <button
            onClick={handleReset}
            disabled={!marker || !isRoundActive}
            className="flex-1 py-2 rounded-md font-cyber font-medium text-xs tracking-wider border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            RESET
          </button>
          
          <button
            onClick={handleGuessSubmit}
            disabled={!marker || !isRoundActive}
            className="flex-1 py-2 rounded-md font-cyber font-bold text-xs tracking-wider bg-gradient-to-r from-cyber-cyan to-cyber-primary text-white shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            GUESS
          </button>
        </div>
      )}

    </div>
  );
}
