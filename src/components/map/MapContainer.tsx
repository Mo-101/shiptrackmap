
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

    // Set the access token before initializing the map
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

    // Fix TypeScript error by explicitly typing center as [number, number]
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE || 'mapbox://styles/akanimo1/clcgr62o0003c14mr8b0xg3cn',
      center: MAP_INITIAL_CONFIG.center as [number, number],
      zoom: MAP_INITIAL_CONFIG.zoom,
      pitch: MAP_INITIAL_CONFIG.pitch,
      projection: MAP_INITIAL_CONFIG.projection,
      renderWorldCopies: true,
      antialias: true
    });

    // Make sure we wait for style to load before triggering the onMapLoad callback
    map.current.on('load', () => {
      if (!map.current) return;
      setMapInitialized(true);
      setupMapEffects(map.current);
      onMapLoad(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, [onMapLoad, mapInitialized]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapInitialized && (
        <div className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center">
          <div className="text-accent text-2xl font-bold mb-2">AfriWave CargoLive™</div>
          <div className="text-white text-lg animate-pulse">Initializing logistics network...</div>
        </div>
      )}
      
      {/* Enhanced map styling - decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left corner decorative element */}
        <div className="absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 border-accent/50 rounded-tl-lg"></div>
        
        {/* Bottom-right corner decorative element */}
        <div className="absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 border-accent/50 rounded-br-lg"></div>
        
        {/* Scanner line effect */}
        <div className="scanner-line" style={{top: '30%'}}></div>
      </div>
    </div>
  );
};

const setupMapEffects = (map: mapboxgl.Map) => {
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

  // Uncomment this to enable rotation (disabled by default as it can be disorienting)
  // requestAnimationFrame(rotateCamera);
};

export default MapContainer;
