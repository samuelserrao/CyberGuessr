import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass as CompassIcon, Eye, Info, ImageOff, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export default function StreetView({ location, onClueUsed, cluesUsedCount }) {
  const [showHint, setShowHint] = useState(false);
  const [bearing, setBearing] = useState(180); // POV Heading angle (degrees)
  const [isLoaded, setIsLoaded] = useState(false);
  const [useImageFallback, setUseImageFallback] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const panoramaRef = useRef(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const [imgErrorCount, setImgErrorCount] = useState(0);

  // Reset hint overlay and fallback state on location change
  useEffect(() => {
    setShowHint(false);
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
    setImgErrorCount(0);
  }, [location]);

  // Check if we have a valid API key
  useEffect(() => {
    const apiKey = localStorage.getItem('googleApiKey') || '';
    
    // If no API key, use image fallback immediately
    if (!apiKey || apiKey.trim() === '') {
      setUseImageFallback(true);
      setIsLoaded(true);
      return;
    }

    setUseImageFallback(false);
    
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
        setUseImageFallback(true);
        setIsLoaded(true);
      }
    };

    if (!window.google) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          setUseImageFallback(true);
          setIsLoaded(true);
        };
        document.head.appendChild(script);
      }
      script.onload = () => {
        initPanorama();
      };
    } else {
      initPanorama();
    }
  }, [location]);

  // Image fallback pan handlers
  const handleMouseDown = (e) => {
    if (!useImageFallback) return;
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !useImageFallback) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setImagePan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
    // Update bearing based on horizontal drag
    setBearing(prev => (prev - dx * 0.5 + 360) % 360);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] group select-none">
      
      {/* Google Maps StreetView OR Image Fallback */}
      {useImageFallback ? (
        <div 
          className="w-full h-full bg-black/40 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {location?.imageUrl && imgErrorCount < 2 ? (
            <img 
              src={imgErrorCount === 1 ? "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000" : location.imageUrl}
              onError={() => setImgErrorCount(prev => prev + 1)}
              alt={location.name}
              className="w-full h-full object-cover transition-transform duration-100 select-none"
              style={{
                transform: `scale(${imageZoom}) translate(${imagePan.x / imageZoom}px, ${imagePan.y / imageZoom}px)`,
              }}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <ImageOff className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 font-cyber text-xs">NO SATELLITE FEED AVAILABLE</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
          ref={containerRef} 
          className="w-full h-full bg-black/40"
        />
      )}

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-dark/95 z-10">
          <div className="w-12 h-12 rounded-full border-4 border-cyber-cyan border-t-transparent animate-spin mb-4" />
          <span className="font-cyber text-xs text-cyber-cyan tracking-widest animate-pulse">CONNECTING SATELLITE FEED...</span>
        </div>
      )}

      {/* HUD Scanner Scanlines overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.08)_50%)] bg-[size:100%_4px] pointer-events-none" />

      {/* Top Heading Overlay */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 text-[9px] font-cyber text-cyber-cyan/80 pointer-events-none bg-black/60 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
        <span>W {Math.round(bearing - 90 < 0 ? bearing + 270 : bearing - 90)}°</span>
        <span className="text-white">N {bearing}°</span>
        <span>E {Math.round(bearing + 90) % 360}°</span>
      </div>

      {/* Image mode indicator */}
      {useImageFallback && (
        <div className="absolute top-4 right-4 font-cyber text-[9px] text-cyber-secondary bg-black/75 border border-cyber-secondary/30 px-3 py-1.5 rounded-lg backdrop-blur-md pointer-events-none z-10">
          SATELLITE IMAGE MODE
        </div>
      )}

      {/* Zoom controls for image fallback */}
      {useImageFallback && (
        <div className="absolute top-16 right-4 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => setImageZoom(prev => Math.min(3, prev + 0.3))}
            className="p-2 rounded-lg bg-black/75 border border-white/20 hover:border-cyber-cyan/50 text-gray-400 hover:text-white transition-all duration-200"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setImageZoom(1); setImagePan({ x: 0, y: 0 }); }}
            className="p-2 rounded-lg bg-black/75 border border-white/20 hover:border-cyber-cyan/50 text-gray-400 hover:text-white transition-all duration-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.3))}
            className="p-2 rounded-lg bg-black/75 border border-white/20 hover:border-cyber-cyan/50 text-gray-400 hover:text-white transition-all duration-200"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Left GPS HUD */}
      <div className="absolute bottom-4 left-4 font-cyber text-[10px] text-cyber-cyan bg-black/75 border border-cyber-cyan/30 p-2.5 rounded-lg backdrop-blur-md flex flex-col gap-1 pointer-events-none z-10">
        <div className="flex items-center gap-1.5 text-white">
          <span className="w-1.5 h-1.5 bg-cyber-neonGreen rounded-full animate-ping" />
          <span>SYS: {useImageFallback ? 'IMAGE FEED ACTIVE' : 'GOOGLE API CONNECTED'}</span>
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
