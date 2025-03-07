
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE, MAP_INITIAL_CONFIG } from '../../utils/mapUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  onMapLoad: (map: mapboxgl.Map) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ onMapLoad }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set the access token before initializing the map
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2s4eXF1aDh5MDd1ZzNsbzQ0b3psZXIzNyJ9.xeI8BpZ6g6jV-IUasnS0ZA';

    // Fix TypeScript error by explicitly typing center as [number, number]
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: MAP_INITIAL_CONFIG.center as [number, number],
      zoom: MAP_INITIAL_CONFIG.zoom,
      pitch: MAP_INITIAL_CONFIG.pitch,
      projection: MAP_INITIAL_CONFIG.projection
    });

    map.current.on('style.load', () => {
      if (!map.current) return;
      setupMapEffects(map.current);
      onMapLoad(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, [onMapLoad]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

const setupMapEffects = (map: mapboxgl.Map) => {
  map.setFog({
    color: 'rgb(27, 36, 58)', // Darker blue for a more professional look
    'high-color': 'rgb(36, 47, 73)',
    'horizon-blend': 0.4,
    'space-color': 'rgb(11, 22, 39)',
    'star-intensity': 0.8
  });

  map.addLayer({
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [0.0, 90.0],
      'sky-atmosphere-sun-intensity': 15
    }
  });
};

export default MapContainer;
