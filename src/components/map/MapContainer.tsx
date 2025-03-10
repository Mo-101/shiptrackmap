
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
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    console.log("Initializing Mapbox with token:", MAPBOX_ACCESS_TOKEN ? "Token exists" : "No token found");
    
    // Set the access token
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    try {
      // Create the map instance with simpler configuration for reliability
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_STYLE,
        center: MAP_INITIAL_CONFIG.center as [number, number],
        zoom: MAP_INITIAL_CONFIG.zoom,
        pitch: MAP_INITIAL_CONFIG.pitch,
        renderWorldCopies: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle map load event
      map.current.on('load', () => {
        console.log("Map fully loaded");
        if (map.current) {
          setMapInitialized(true);
          onMapLoad(map.current);
        }
      });
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        setMapError(`Map error: ${e.error?.message || "Unknown error"}`);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onMapLoad, mapInitialized]);

  return (
    <div className="relative w-full h-full z-10">
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      
      {/* Loading state */}
      {!mapInitialized && (
        <div className="absolute inset-0 bg-primary/90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-accent text-3xl font-bold mb-4">AfriWave CargoLive™</div>
            <div className="w-64 h-1 bg-secondary/30 rounded-full mb-6 overflow-hidden mx-auto">
              <div className="h-full bg-accent animate-pulse" style={{width: '60%'}}></div>
            </div>
            <div className="text-white text-lg">Initializing map...</div>
            
            {mapError && (
              <div className="mt-4 text-red-500 bg-primary/80 p-2 rounded border border-red-400 max-w-md mx-auto">
                {mapError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
