
import React, { useState, useEffect, useCallback } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './MapHUD';
import { createLineAnimation, updateLineAnimation } from './MapAnimations';
import MapContainer from './map/MapContainer';
import MapEvents from './map/MapEvents';
import { initializeShipmentLayers, updateShipmentData } from '../utils/mapUtils';
import mapboxgl from 'mapbox-gl';
import { toast } from '@/components/ui/use-toast';

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
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    initializeShipmentLayers(loadedMap);
    setMap(loadedMap);
    setMapLoaded(true);
  };

  // Jump to shipment animation
  const jumpToShipment = useCallback((shipment: Shipment) => {
    if (!map) return;
    
    const origin = shipment.origin.coordinates;
    const destination = shipment.destination.coordinates;
    
    // Calculate bounds that include both origin and destination
    const bounds = new mapboxgl.LngLatBounds()
      .extend(origin)
      .extend(destination);
    
    // Fly to the bounding box with animation
    map.fitBounds(bounds, {
      padding: 100,
      duration: 2000,
      pitch: 60, // Dramatic pitch for better visualization
      essential: true
    });
    
    // Show toast notification
    toast({
      title: `Viewing Shipment: ${shipment.id}`,
      description: `From ${shipment.origin.name} to ${shipment.destination.name}`,
      duration: 3000,
    });
  }, [map]);

  // Update map data when shipments or active shipment changes
  useEffect(() => {
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
        jumpToShipment(activeShipment);
      }
    }
  }, [shipments, activeShipment, mapLoaded, map, isTracking, jumpToShipment]);

  // Create animation when map is loaded
  useEffect(() => {
    if (map) {
      createLineAnimation(map);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [map, animationFrame]);

  // Toggle tracking function
  const toggleTracking = () => {
    setIsTracking(prev => {
      const newState = !prev;
      if (newState && activeShipment) {
        jumpToShipment(activeShipment);
      }
      return newState;
    });
  };

  // Jump to a random shipment every 10 seconds for demo purposes
  const startItineraryAnimation = () => {
    let index = 0;
    
    const animateItineraries = () => {
      if (shipments.length > 0) {
        const shipment = shipments[index % shipments.length];
        jumpToShipment(shipment);
        index++;
      }
      
      const frame = setTimeout(() => {
        requestAnimationFrame(animateItineraries);
      }, 10000); // Change shipment every 10 seconds
      
      setAnimationFrame(frame as unknown as number);
    };
    
    animateItineraries();
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
      
      {/* Control Panel - top right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {activeShipment && (
          <button
            onClick={toggleTracking}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isTracking 
                ? 'bg-accent text-primary shadow-md' 
                : 'bg-primary/80 text-white hover:bg-primary'
            }`}
          >
            {isTracking ? 'Tracking Active' : 'Start Tracking'}
          </button>
        )}
        
        <button
          onClick={startItineraryAnimation}
          className="px-4 py-2 rounded-md font-medium bg-secondary/80 text-white hover:bg-secondary transition-colors"
        >
          Animate Itineraries
        </button>
      </div>
      
      {/* Active shipment indicator - bottom left */}
      {activeShipment && (
        <div className="absolute bottom-4 left-4 z-10 bg-primary/80 backdrop-blur-sm p-3 rounded-md border border-accent/30 text-white max-w-xs">
          <h3 className="text-accent font-semibold">Active Shipment</h3>
          <p className="text-sm">{activeShipment.id}</p>
          <div className="flex justify-between text-xs mt-1">
            <span>{activeShipment.origin.name}</span>
            <span>→</span>
            <span>{activeShipment.destination.name}</span>
          </div>
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
