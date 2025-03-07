
import React, { useState, useEffect } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './MapHUD';
import { createLineAnimation, updateLineAnimation } from './MapAnimations';
import MapContainer from './map/MapContainer';
import MapEvents from './map/MapEvents';
import { initializeShipmentLayers, updateShipmentData } from '../utils/mapUtils';
import mapboxgl from 'mapbox-gl';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    initializeShipmentLayers(loadedMap);
    setMap(loadedMap);
    setMapLoaded(true);
  };

  // Update map data when shipments or active shipment changes
  React.useEffect(() => {
    if (!mapLoaded || !map?.isStyleLoaded()) return;
    updateShipmentData(map, shipments, activeShipment);
    
    // If there's an active shipment, we can enable tracking
    if (activeShipment) {
      // Create or update the tracking animation line with the active shipment's route
      const originCoords = activeShipment.origin.coordinates;
      const destCoords = activeShipment.destination.coordinates;
      
      // Create a route path between origin and destination
      // This would typically come from a real-time API in production
      const routeCoordinates = [originCoords, destCoords];
      
      // Update the animated line
      updateLineAnimation(map, routeCoordinates);
      
      // If tracking is enabled, center the map on the current shipment
      if (isTracking) {
        const midpoint: [number, number] = [
          (originCoords[0] + destCoords[0]) / 2,
          (originCoords[1] + destCoords[1]) / 2
        ];
        
        map.flyTo({
          center: midpoint,
          zoom: 4,
          duration: 2000,
          essential: true
        });
      }
    }
  }, [shipments, activeShipment, mapLoaded, map, isTracking]);

  // Create animation when map is loaded
  useEffect(() => {
    if (map) {
      createLineAnimation(map);
    }
  }, [map]);

  // Toggle tracking function
  const toggleTracking = () => {
    setIsTracking(prev => !prev);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer onMapLoad={handleMapLoad} />
      
      <MapEvents
        map={map}
        shipments={shipments}
        onLocationSelect={setSelectedLocation}
        onShipmentHover={setHoveredShipment}
      />
      
      <MapHUD shipments={shipments} />
      
      {/* Add tracking toggle button */}
      {activeShipment && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleTracking}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isTracking 
                ? 'bg-accent text-primary shadow-md' 
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {isTracking ? 'Tracking Active' : 'Start Tracking'}
          </button>
        </div>
      )}
      
      {hoveredShipment && (
        <ShipmentTooltip shipment={hoveredShipment} />
      )}
      
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
