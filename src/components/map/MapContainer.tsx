
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE, MAP_INITIAL_CONFIG } from '../../utils/mapUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  onMapLoad: (map: mapboxgl.Map) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ onMapLoad }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    console.log("Initializing Mapbox with token:", MAPBOX_ACCESS_TOKEN);
    
    // Set the access token before initializing the map
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

    try {
      // Fix TypeScript error by explicitly typing center as [number, number]
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_STYLE || 'mapbox://styles/mapbox/dark-v11', // Fallback to dark style for futuristic look
        center: MAP_INITIAL_CONFIG.center as [number, number],
        zoom: MAP_INITIAL_CONFIG.zoom,
        pitch: MAP_INITIAL_CONFIG.pitch,
        projection: MAP_INITIAL_CONFIG.projection,
        renderWorldCopies: true,
        antialias: true
      });

      console.log("Map instance created");

      // Make sure we wait for style to load before triggering the onMapLoad callback
      map.current.on('load', () => {
        if (!map.current) return;
        console.log("Map style loaded successfully");
        setMapInitialized(true);
        setupMapEffects(map.current);
        onMapLoad(map.current);
      });
      
      // Add error handling
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e.error);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      console.log("Cleaning up map");
      map.current?.remove();
    };
  }, [onMapLoad, mapInitialized]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Enhanced loading state with ultra-futuristic design */}
      {!mapInitialized && (
        <div className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center z-50">
          <div className="text-accent text-3xl font-bold mb-4 tracking-wider animate-pulse">AfriWave CargoLive™</div>
          <div className="w-64 h-1 bg-secondary/30 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-accent animate-gradient-shift" style={{width: '60%', backgroundImage: 'linear-gradient(90deg, rgba(79,243,248,0.8) 0%, rgba(79,243,248,0.2) 50%, rgba(79,243,248,0.8) 100%)', backgroundSize: '200% 100%'}}></div>
          </div>
          <div className="text-white text-lg animate-pulse-opacity">Initializing logistics network...</div>
          
          {/* Futuristic hexagon pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <polygon points="24.8,22 37.3,29 37.3,43 24.8,50 12.4,43 12.4,29" fill="none" stroke="#4FF2F8" strokeWidth="0.5" />
                <polygon points="0,22 12.4,29 12.4,43 0,50 -12.4,43 -12.4,29" fill="none" stroke="#4FF2F8" strokeWidth="0.5" />
                <polygon points="24.8,0 37.3,7 37.3,21 24.8,28 12.4,21 12.4,7" fill="none" stroke="#4FF2F8" strokeWidth="0.5" />
                <polygon points="0,0 12.4,7 12.4,21 0,28 -12.4,21 -12.4,7" fill="none" stroke="#4FF2F8" strokeWidth="0.5" />
                <polygon points="12.4,10.7 24.8,17.7 24.8,31.7 12.4,38.7 0,31.7 0,17.7" fill="none" stroke="#4FF2F8" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Enhanced map styling - futuristic decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Data streams effect - vertical lines that move from top to bottom */}
        <div className="absolute left-1/4 h-full w-[1px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-30 animate-scanner"></div>
        <div className="absolute left-3/4 h-full w-[1px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-30 animate-scanner" style={{animationDelay: '1s'}}></div>
        
        {/* Top-left corner decorative element */}
        <div className="absolute top-6 left-6 w-32 h-32 border-t-2 border-l-2 border-accent/60 rounded-tl-lg"></div>
        
        {/* Bottom-right corner decorative element */}
        <div className="absolute bottom-6 right-6 w-32 h-32 border-b-2 border-r-2 border-accent/60 rounded-br-lg"></div>
        
        {/* Scanner lines effect */}
        <div className="absolute left-0 right-0 h-[2px] bg-accent/40 top-1/4 scanner-line"></div>
        <div className="absolute left-0 right-0 h-[2px] bg-accent/40 top-3/4 scanner-line" style={{animationDelay: '5s'}}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_transparent_1px),_linear-gradient(to_right,_transparent_1px,_transparent_1px)] bg-[size:40px_40px] [background-position:center] opacity-10"></div>
      </div>
    </div>
  );
};

const setupMapEffects = (map: mapboxgl.Map) => {
  // Add futuristic map effects
  map.setFog({
    color: 'rgb(7, 23, 59)', // Darker blue for a futuristic look
    'high-color': 'rgb(12, 38, 78)',
    'horizon-blend': 0.4,
    'space-color': 'rgb(3, 9, 33)',
    'star-intensity': 0.8
  });

  map.addLayer({
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [0.0, 90.0],
      'sky-atmosphere-sun-intensity': 18,
      'sky-atmosphere-color': 'rgba(12, 38, 78, 1)'
    }
  });

  // Add a subtle globe rotation for enhanced visual effect
  const rotateCamera = (timestamp: number) => {
    // Rotate very slowly
    map.rotateTo((timestamp / 1000) * 0.5 % 360, { duration: 0 });
    requestAnimationFrame(rotateCamera);
  };

  // Enable rotation for better futuristic feeling
  requestAnimationFrame(rotateCamera);
};

export default MapContainer;
