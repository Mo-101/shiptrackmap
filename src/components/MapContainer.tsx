
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';
import { CustomLayerProps } from '../utils/mapAnimations';

interface MapContainerProps {
  shipments: Shipment[];
  selectedShipment?: Shipment | null;
  setSelectedShipment?: (shipment: Shipment | null) => void;
  mapContainer?: React.RefObject<HTMLDivElement>;
  map?: React.RefObject<mapboxgl.Map | null>;
  routeProps?: React.RefObject<Record<string, CustomLayerProps>>;
  animationFrameRef?: React.RefObject<number | null>;
  setMapLoaded?: (loaded: boolean) => void;
  setSelectedLocation?: (location: [number, number] | null) => void;
  setHoveredShipment?: (shipment: Shipment | null) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  shipments, 
  selectedShipment, 
  setSelectedShipment,
  mapContainer,
  map,
  routeProps,
  animationFrameRef,
  setMapLoaded,
  setSelectedLocation,
  setHoveredShipment
}) => {
  const localMapContainer = useRef<HTMLDivElement>(null);
  const localMap = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setLocalMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    // Use either passed-in refs or local refs
    const containerRef = mapContainer || localMapContainer;
    const mapRef = map || localMap;
    
    if (mapRef.current) return;
    
    if (containerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [36.8219, -1.2921], // Nairobi
        zoom: 4,
        pitch: 40,
        bearing: 0,
        projection: { name: 'mercator' },
      });
      
      mapRef.current.on('load', () => {
        setLocalMapLoaded(true);
        if (setMapLoaded) setMapLoaded(true);
      });
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainer, map, setMapLoaded]);

  return (
    <div ref={mapContainer || localMapContainer} className="absolute inset-0 w-full h-full" />
  );
};

export default MapContainer;
