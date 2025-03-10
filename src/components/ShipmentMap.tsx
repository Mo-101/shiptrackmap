
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import { MapHUD } from './hud/index';
import { 
  createLineAnimation, 
  createMovingDotAnimation, 
} from '../utils/animations';
import MapContainer from './map/MapContainer';
import MapEvents from './map/MapEvents';
import MapControls from './map/MapControls';
import ShipmentInfoPanel from './map/ShipmentInfoPanel';
import { initializeShipmentLayers, updateShipmentData } from '../utils/mapUtils';
import { jumpToShipment, startItineraryAnimation } from '../utils/mapAnimation';
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
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  
  const pendingAnimationRef = useRef<Shipment | null>(null);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log("Map loaded successfully in ShipmentMap");
    
    try {
      setMap(loadedMap);
      setMapLoaded(true);
      
      setTimeout(() => {
        try {
          initializeShipmentLayers(loadedMap);
          createLineAnimation(loadedMap);
          createMovingDotAnimation(loadedMap);
          
          if (pendingAnimationRef.current) {
            console.log("Processing pending animation for:", pendingAnimationRef.current.id);
            setTimeout(() => {
              jumpToShipmentHandler(pendingAnimationRef.current!, true);
              pendingAnimationRef.current = null;
            }, 1000);
          }
          
          toast({
            title: 'AfriWave CargoLive™',
            description: 'Tracking system initialized successfully',
            duration: 3000,
          });
        } catch (err) {
          console.error("Error during map initialization:", err);
        }
      }, 500);
    } catch (error) {
      console.error("Error in handleMapLoad:", error);
    }
  };

  const jumpToShipmentHandler = useCallback((shipment: Shipment, animate: boolean = true) => {
    if (!map || !map.loaded()) {
      console.log("Map not ready, setting pending animation for:", shipment.id);
      pendingAnimationRef.current = shipment;
      return;
    }
    
    const success = jumpToShipment(
      map, 
      shipment, 
      animate, 
      setAnimationFrame, 
      setActiveAnimation
    );
    
    if (success && animate) {
      toast({
        title: `Tracking: ${shipment.id}`,
        description: `From ${shipment.origin.name} to ${shipment.destination.name}`,
        duration: 3000,
      });
    }
  }, [map]);

  useEffect(() => {
    if (!map || !map.loaded()) return;
    
    try {
      updateShipmentData(map, shipments, activeShipment);
      
      if (activeShipment && isTracking) {
        jumpToShipmentHandler(activeShipment, true);
      }
    } catch (error) {
      console.error("Error updating shipment data:", error);
    }
  }, [shipments, activeShipment, mapLoaded, map, isTracking, jumpToShipmentHandler]);

  const toggleTracking = () => {
    setIsTracking(prev => {
      const newState = !prev;
      if (newState && activeShipment) {
        jumpToShipmentHandler(activeShipment, true);
      }
      return newState;
    });
  };

  const handleStartItineraryAnimation = () => {
    toast({
      title: 'Route Animation',
      description: 'Visualizing cargo movements across Africa',
      duration: 3000,
    });
    
    startItineraryAnimation(
      map, 
      shipments, 
      setAnimationFrame, 
      animationFrame, 
      jumpToShipmentHandler
    );
  };

  const viewShipmentAnimation = (shipment: Shipment) => {
    if (activeAnimation === shipment.id) return;
    jumpToShipmentHandler(shipment, true);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer onMapLoad={handleMapLoad} />
      
      {mapLoaded && map && (
        <MapEvents
          map={map}
          shipments={shipments}
          onLocationSelect={setSelectedLocation}
          onShipmentHover={setHoveredShipment}
        />
      )}
      
      <div className="absolute inset-0 pointer-events-none z-20">
        <MapHUD shipments={shipments} />
      </div>
      
      <MapControls 
        activeShipment={activeShipment} 
        isTracking={isTracking}
        toggleTracking={toggleTracking}
        startItineraryAnimation={handleStartItineraryAnimation}
        viewShipmentAnimation={viewShipmentAnimation}
      />
      
      {activeShipment && (
        <ShipmentInfoPanel 
          activeShipment={activeShipment}
          viewShipmentAnimation={viewShipmentAnimation}
          activeAnimation={activeAnimation}
        />
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
