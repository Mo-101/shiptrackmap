
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
  mapContainer: externalMapContainer,
  map: externalMap,
  routeProps,
  animationFrameRef,
  setMapLoaded: externalSetMapLoaded,
  setSelectedLocation,
  setHoveredShipment
}) => {
  const localMapContainer = useRef<HTMLDivElement>(null);
  const localMap = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setLocalMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    // Use either passed-in refs or local refs
    const containerRef = externalMapContainer || localMapContainer;
    const mapRef = externalMap || localMap;
    
    if (mapRef.current) return;
    
    if (containerRef.current) {
      const mapInstance = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [36.8219, -1.2921], // Nairobi
        zoom: 4,
        pitch: 40,
        bearing: 0,
        projection: { name: 'mercator' },
      });
      
      // Fix: use the variable instead of modifying the read-only ref directly
      if (mapRef === localMap) {
        localMap.current = mapInstance;
      } else if (externalMap && mapRef === externalMap) {
        // For external refs, we need to be careful
        // This is a workaround since we cannot modify read-only refs directly
        // The parent component should handle setting the ref value
        (externalMap as any).current = mapInstance;
      }
      
      mapInstance.on('load', () => {
        setLocalMapLoaded(true);
        if (externalSetMapLoaded) externalSetMapLoaded(true);
      });
    }
    
    return () => {
      // Fix: Only access current if it exists, don't try to modify the ref directly
      if (mapRef === localMap && localMap.current) {
        localMap.current.remove();
        localMap.current = null;
      } else if (externalMap && mapRef === externalMap && externalMap.current) {
        externalMap.current.remove();
        // Again, workaround for read-only refs
        (externalMap as any).current = null;
      }
    };
  }, [externalMapContainer, externalMap, externalSetMapLoaded]);

  return (
    <div ref={externalMapContainer || localMapContainer} className="absolute inset-0 w-full h-full" />
  );
};

export default MapContainer;
