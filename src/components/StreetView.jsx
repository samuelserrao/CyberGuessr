import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass as CompassIcon, Eye, Info } from 'lucide-react';

export default function StreetView({ location, onClueUsed, cluesUsedCount }) {
  const [showHint, setShowHint] = useState(false);
  const [bearing, setBearing] = useState(180); // POV Heading angle (degrees)
  const [isLoaded, setIsLoaded] = useState(false);
  
  const containerRef = useRef(null);
  const panoramaRef = useRef(null);

  // Reset hint overlay on location change
  useEffect(() => {
    setShowHint(false);
  }, [location]);

  // Load Google Maps API & Initialize Street View Panorama
  useEffect(() => {
    const apiKey = localStorage.getItem('googleApiKey') || '';
    const scriptId = 'google-maps-streetview-script';
    let script = document.getElementById(scriptId);

    const initPanorama = () => {
      if (!containerRef.current || !window.google) return;

      try {
        // Create or update panorama position
        if (!panoramaRef.current) {
          panoramaRef.current = new window.google.maps.StreetViewPanorama(
            containerRef.current,
            {
              position: { lat: location.lat, lng: location.lng },
              pov: { heading: 180, pitch: 0 },
              zoom: 1,
              addressControl: false,
              showRoadLabels: false,
              motionTracking: false,
              motionTrackingControl: false,
              fullscreenControl: false,
              panControl: false,
              zoomControl: true,
              linksControl: true,
            }
          );

          // Listen to point-of-view (heading) changes to update our compass!
          panoramaRef.current.addListener('pov_changed', () => {
            const pov = panoramaRef.current.getPov();
            setBearing(Math.round(pov.heading) % 360);
          });

          setIsLoaded(true);
        } else {
          // If already instantiated, just update coordinates and reset POV
          panoramaRef.current.setPosition({ lat: location.lat, lng: location.lng });
          panoramaRef.current.setPov({ heading: 180, pitch: 0 });
          setBearing(180);
        }
      } catch (err) {
        console.error("Google Street View load error:", err);
      }
    };

    if (!window.google) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.onload = () => {
        initPanorama();
      };
    } else {
      initPanorama();
    }
  }, [location]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] group select-none">
      
      {/* Google Maps StreetView Div Wrapper */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-black/40"
      />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-dark/95 z-10">
          <div className="w-12 h-12 rounded-full border-4 border-cyber-cyan border-t-transparent animate-spin mb-4" />
          <span className="font-cyber text-xs text-cyber-cyan tracking-widest animate-pulse">CONNECTING GOOGLE SATELLITE FEED...</span>
        </div>
      )}

      {/* HUD Scanner Scanlines overlay (pointer-events-none so it doesn't block StreetView interaction) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.08)_50%)] bg-[size:100%_4px] pointer-events-none" />

      {/* Top Heading Overlay */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 text-[9px] font-cyber text-cyber-cyan/80 pointer-events-none bg-black/60 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
        <span>W {Math.round(bearing - 90 < 0 ? bearing + 270 : bearing - 90)}°</span>
        <span className="text-white">N {bearing}°</span>
        <span>E {Math.round(bearing + 90) % 360}°</span>
      </div>

      {/* Bottom Left GPS HUD */}
      <div className="absolute bottom-4 left-4 font-cyber text-[10px] text-cyber-cyan bg-black/75 border border-cyber-cyan/30 p-2.5 rounded-lg backdrop-blur-md flex flex-col gap-1 pointer-events-none z-10">
        <div className="flex items-center gap-1.5 text-white">
          <span className="w-1.5 h-1.5 bg-cyber-neonGreen rounded-full animate-ping" />
          <span>SYS: GOOGLE API CONNECTED</span>
        </div>
        <div className="text-[9px] text-gray-400 font-mono">
          POV BEARING: {bearing}°
          <br />
          GRID RESOLVE: ONLINE
        </div>
      </div>

      {/* Bottom Right Floating Controls */}
      <div className="absolute right-4 bottom-4 flex items-center gap-3 z-10">
        {/* Interactive Clue Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowHint(!showHint);
              if (cluesUsedCount < 3) {
                onClueUsed();
              }
            }}
            className="p-2.5 px-3.5 rounded-lg bg-black/75 border border-cyber-secondary/50 hover:border-cyber-secondary hover:bg-cyber-secondary/15 text-cyber-secondary flex items-center gap-1.5 text-xs font-cyber tracking-wider transition-all duration-200 shadow-[0_0_10px_rgba(236,72,153,0.15)]"
          >
            <Info className="w-4 h-4" />
            <span>HINT ({3 - cluesUsedCount} LEFT)</span>
          </button>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="absolute right-0 bottom-12 w-64 bg-glass border border-cyber-secondary/30 p-3 rounded-lg backdrop-blur-md text-xs z-20 shadow-xl">
              <h4 className="font-cyber text-cyber-secondary mb-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                CLUE PROTOCOL
              </h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                {location.clues.slice(0, Math.max(1, cluesUsedCount)).map((clue, idx) => (
                  <li key={idx} className="leading-relaxed">{clue}</li>
                ))}
                {cluesUsedCount === 0 && (
                  <li className="text-gray-500 italic">Click hint button to reveal clues (adds +1 hint penalty).</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Real-time Compass UI */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/75 border border-cyber-cyan/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <motion.div
            style={{ rotate: bearing }}
            className="text-cyber-cyan"
          >
            <CompassIcon className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

    </div>
  );
}
