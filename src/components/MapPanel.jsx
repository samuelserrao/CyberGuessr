import { useState, useRef, useEffect } from 'react';
import { MapPin, CheckCircle, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

export default function MapPanel({ 
  onGuess, 
  currentRound, 
  isRoundActive, 
  actualLocation, 
  showResultMap,
  userGuessCoord
}) {
  const [marker, setMarker] = useState(null); // { x, y, lat, lng }
  const [isExpanded, setIsExpanded] = useState(false);
  const svgRef = useRef(null);

  // Reset marker when round changes
  useEffect(() => {
    if (!showResultMap) {
      setMarker(null);
    }
  }, [currentRound, showResultMap]);

  // Handle map click to place marker
  const handleMapClick = (e) => {
    if (!isRoundActive || showResultMap) return;

    const svg = svgRef.current;
    if (!svg) return;

    // Use SVG's built-in coordinate transformation matrix
    // This correctly handles any preserveAspectRatio mode (meet, slice, etc.)
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const inverseCTM = ctm.inverse();

    // Create an SVGPoint in the screen coordinate space
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    // Transform screen coordinates to SVG viewBox coordinates natively
    const svgPoint = pt.matrixTransform(inverseCTM);

    // Clamp to viewBox bounds
    const clampedX = Math.max(0, Math.min(1000, svgPoint.x));
    const clampedY = Math.max(0, Math.min(500, svgPoint.y));

    // Convert SVG coordinates to Lat/Lng with 18.6° E longitude split calibration
    let rawLng = (clampedX * 360) / 1000 - 180 + 18.6;
    if (rawLng > 180) {
      rawLng -= 360;
    }
    const lng = rawLng;
    const lat = 90 - (clampedY * 180) / 500;

    console.log("Map Click Calibrated Details:", {
      screen: { x: e.clientX, y: e.clientY },
      viewBox: { x: clampedX, y: clampedY },
      computed: { lat, lng }
    });

    setMarker({ x: clampedX, y: clampedY, lat, lng });
  };

  const handleReset = () => {
    setMarker(null);
  };

  const handleGuessSubmit = () => {
    if (!marker) return;
    onGuess(marker.lat, marker.lng);
  };

  // Convert actual coordinates to SVG x/y for drawing the result line
  const getSvgCoords = (lat, lng) => {
    let l = lng;
    // Map bounds split at -161.4° longitude: wrap anything west of that to positive space
    if (l < -161.4) {
      l += 360;
    }
    const x = ((l - 18.6 + 180) * 1000) / 360;
    const y = ((90 - lat) * 500) / 180;
    return { x, y };
  };

  const actualCoords = actualLocation ? getSvgCoords(actualLocation.lat, actualLocation.lng) : null;
  const guessCoords = userGuessCoord ? getSvgCoords(userGuessCoord.lat, userGuessCoord.lng) : (marker ? { x: marker.x, y: marker.y } : null);

  // Draw Grid Lines helper (Latitude & Longitude)
  const renderGridLines = () => {
    const lines = [];
    // Vertical longitudes (every 30 degrees)
    for (let i = 1; i < 12; i++) {
      const x = i * (1000 / 12);
      lines.push(
        <line 
          key={`lon-${i}`} 
          x1={x} y1={0} x2={x} y2={500} 
          className="stroke-cyber-cyan/10" 
          strokeDasharray="4 6" 
        />
      );
    }
    // Horizontal latitudes (every 15 degrees)
    for (let i = 1; i < 8; i++) {
      const y = i * (500 / 8);
      lines.push(
        <line 
          key={`lat-${i}`} 
          x1={0} y1={y} x2={1000} y2={y} 
          className="stroke-cyber-cyan/10" 
          strokeDasharray="4 6" 
        />
      );
    }
    return lines;
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

      {/* SVG Interactive Canvas */}
      <div className="relative flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          onClick={handleMapClick}
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full select-none ${
            isRoundActive && !showResultMap ? 'cursor-crosshair' : 'cursor-default'
          }`}
        >
          {/* Base Ocean Background */}
          <rect width="1000" height="500" fill="#090d16" />

          {/* Premium Vector SVG World Map (Infinite Sharpness) */}
          <image
            href="/world-map.svg"
            x="0"
            y="0"
            width="1000"
            height="500"
            preserveAspectRatio="none"
            style={{
              opacity: 0.65,
              filter: 'invert(1) sepia(1) saturate(5) hue-rotate(185deg) brightness(1.2)'
            }}
          />

          {/* Map Grid Background */}
          {renderGridLines()}

          {/* Dotted Connection Line on Result */}
          {showResultMap && actualCoords && guessCoords && (
            <>
              <line
                x1={guessCoords.x}
                y1={guessCoords.y}
                x2={actualCoords.x}
                y2={actualCoords.y}
                className="stroke-cyber-secondary animate-pulse-slow"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              {/* Dotted path glow */}
              <line
                x1={guessCoords.x}
                y1={guessCoords.y}
                x2={actualCoords.x}
                y2={actualCoords.y}
                className="stroke-cyber-secondary/30 blur-xs"
                strokeWidth="5"
              />
            </>
          )}

          {/* Actual Location Marker (Only shown at round-over) */}
          {showResultMap && actualCoords && (
            <g className="marker-bounce">
              <circle
                cx={actualCoords.x}
                cy={actualCoords.y}
                r="16"
                className="fill-cyber-neonGreen/10 stroke-cyber-neonGreen/40 animate-pulse"
                strokeWidth="1"
              />
              <circle
                cx={actualCoords.x}
                cy={actualCoords.y}
                r="7"
                className="fill-cyber-neonGreen shadow-lg shadow-cyber-neonGreen"
              />
              <circle
                cx={actualCoords.x}
                cy={actualCoords.y}
                r="2"
                className="fill-white"
              />
            </g>
          )}

          {/* User Guess Marker */}
          {guessCoords && (
            <g className={!showResultMap ? 'marker-bounce' : ''}>
              {/* Glow circle */}
              <circle
                cx={guessCoords.x}
                cy={guessCoords.y}
                r="16"
                className="fill-cyber-cyan/15 stroke-cyber-cyan/40"
                strokeWidth="1.5"
              />
              {/* Point coordinate marker */}
              <circle
                cx={guessCoords.x}
                cy={guessCoords.y}
                r="6"
                className="fill-cyber-cyan"
              />
              <circle
                cx={guessCoords.x}
                cy={guessCoords.y}
                r="2.2"
                className="fill-white"
              />
            </g>
          )}
        </svg>

        {/* Legend Overlay for Result view */}
        {showResultMap && (
          <div className="absolute top-3 left-3 bg-black/75 border border-white/10 p-2.5 rounded-lg text-[10px] font-cyber flex flex-col gap-1.5 pointer-events-none backdrop-blur-md">
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
        <div className="flex border-t border-white/5 bg-black/20 p-3 items-center justify-between gap-3">
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
