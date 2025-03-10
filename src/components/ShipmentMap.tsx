
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapHUD from './MapHUD';
import RadarPulse from './RadarPulse';
import MapOverlay from './MapOverlay';
import MapContainer from './MapContainer';
import { generateMapRoutes } from '../utils/mapRouteGenerator';
import { CustomLayerProps } from '../utils/mapAnimations';

// Update to use the provided token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  
  // Track animation frames for cleanup
  const animationFrameRef = useRef<number | null>(null);
  // Custom properties for different route types
  const routeProps = useRef<Record<string, CustomLayerProps>>({});

  useEffect(() => {
    if (!mapLoaded || !map.current?.isStyleLoaded()) return;

    generateMapRoutes(map.current, shipments, activeShipment);
  }, [shipments, activeShipment, mapLoaded]);

  return (
    <div className="relative w-full h-full bg-palette-darkblue">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Initialize the map */}
      <MapContainer
        mapContainer={mapContainer}
        map={map}
        routeProps={routeProps}
        animationFrameRef={animationFrameRef}
        shipments={shipments}
        setMapLoaded={setMapLoaded}
        setSelectedLocation={setSelectedLocation}
        setHoveredShipment={setHoveredShipment}
      />
      
      {/* Sci-fi overlay elements */}
      <MapOverlay />
      
      {/* HUD Components */}
      <MapHUD 
        shipments={shipments}
        activeShipments={shipments.filter(s => s.status === 'in-transit').length}
        delayedShipments={shipments.filter(s => s.status === 'delayed').length}
      />
      
      {/* Shipment info tooltip */}
      {hoveredShipment && (
        <ShipmentTooltip shipment={hoveredShipment} />
      )}
      
      {/* Weather info */}
      {selectedLocation && (
        <WeatherInfo
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default ShipmentMap;
