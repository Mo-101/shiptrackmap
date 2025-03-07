
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

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: MAP_INITIAL_CONFIG.center,
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
    color: 'rgb(7, 23, 119)',
    'high-color': 'rgb(12, 58, 98)',
    'horizon-blend': 0.4,
    'space-color': 'rgb(7, 16, 60)',
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
