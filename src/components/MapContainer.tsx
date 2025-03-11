
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';

interface MapContainerProps {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  setSelectedShipment: (shipment: Shipment | null) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  shipments, 
  selectedShipment, 
  setSelectedShipment 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return;
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [36.8219, -1.2921], // Nairobi
        zoom: 4,
        pitch: 40,
        bearing: 0,
        projection: { name: 'mercator' },
      });
      
      // Use onload instead of directly mutating the read-only current property
      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
  );
};

export default MapContainer;
