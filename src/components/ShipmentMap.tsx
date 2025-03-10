import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './hud';
import { 
  createLineAnimation, 
  updateLineAnimation, 
  createMovingDotAnimation, 
  animateShipmentRoute 
} from '../utils/animations';
import MapContainer from './map/MapContainer';
import MapEvents from './map/MapEvents';
import { initializeShipmentLayers, updateShipmentData, createArcRoute } from '../utils/mapUtils';
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
              jumpToShipment(pendingAnimationRef.current!, true);
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

  const jumpToShipment = useCallback((shipment: Shipment, animate: boolean = true) => {
    if (!map || !map.loaded()) {
      console.log("Map not ready, setting pending animation for:", shipment.id);
      pendingAnimationRef.current = shipment;
      return;
    }
    
    try {
      console.log("Jumping to shipment:", shipment.id);
      const origin = shipment.origin.coordinates;
      const destination = shipment.destination.coordinates;
      
      const bounds = new mapboxgl.LngLatBounds()
        .extend(origin)
        .extend(destination);
      
      map.fitBounds(bounds, {
        padding: 100,
        duration: 2000,
        essential: true
      });
      
      const routeFeature = createArcRoute(shipment, true);
      const routeCoordinates = (routeFeature.geometry as GeoJSON.LineString).coordinates as [number, number][];
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      updateLineAnimation(map, routeCoordinates);
      
      if (animate) {
        setActiveAnimation(shipment.id);
        const duration = Math.max(8000, routeCoordinates.length * 1000);
        const animationId = animateShipmentRoute(map, routeCoordinates, duration);
        setAnimationFrame(animationId);
        
        toast({
          title: `Tracking: ${shipment.id}`,
          description: `From ${shipment.origin.name} to ${shipment.destination.name}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error in jumpToShipment:", error);
    }
  }, [map, animationFrame]);

  useEffect(() => {
    if (!map || !map.loaded()) return;
    
    try {
      updateShipmentData(map, shipments, activeShipment);
      
      if (activeShipment && isTracking) {
        jumpToShipment(activeShipment, true);
      }
    } catch (error) {
      console.error("Error updating shipment data:", error);
    }
  }, [shipments, activeShipment, mapLoaded, map, isTracking, jumpToShipment]);

  const toggleTracking = () => {
    setIsTracking(prev => {
      const newState = !prev;
      if (newState && activeShipment) {
        jumpToShipment(activeShipment, true);
      }
      return newState;
    });
  };

  const startItineraryAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    toast({
      title: 'Route Animation',
      description: 'Visualizing cargo movements across Africa',
      duration: 3000,
    });
    
    let index = 0;
    
    const animateItineraries = () => {
      if (shipments.length > 0) {
        const shipment = shipments[index % shipments.length];
        jumpToShipment(shipment, true);
        index++;
      }
      
      const frame = setTimeout(() => {
        requestAnimationFrame(animateItineraries);
      }, 12000);
      
      setAnimationFrame(frame as unknown as number);
    };
    
    animateItineraries();
  };

  const viewShipmentAnimation = (shipment: Shipment) => {
    if (activeAnimation === shipment.id) return;
    jumpToShipment(shipment, true);
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
      
      <div className="absolute top-4 left-4 z-30 pointer-events-auto">
        <div className="bg-primary/80 px-3 py-2 rounded-md border border-accent/30 text-white flex items-center">
          <span className="text-accent font-bold">AfriWave</span>
          <span className="ml-1 text-white font-medium">CargoLive™</span>
          <div className="ml-2 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        {activeShipment && (
          <button
            onClick={toggleTracking}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isTracking 
                ? 'bg-accent text-primary shadow-md' 
                : 'bg-primary/80 text-white hover:bg-primary'
            }`}
          >
            {isTracking ? 'CargoLive™ Active' : 'Start CargoLive™'}
          </button>
        )}
        
        <button
          onClick={startItineraryAnimation}
          className="px-4 py-2 rounded-md font-medium bg-secondary/80 text-white hover:bg-secondary transition-colors"
        >
          Animate All Routes
        </button>
      </div>
      
      {activeShipment && (
        <div className="absolute bottom-4 left-4 z-30 bg-primary/90 p-3 rounded-md border border-accent/30 text-white max-w-xs pointer-events-auto">
          <div className="flex items-center">
            <h3 className="text-accent font-semibold">Supply Chain Pulse™</h3>
            <button 
              onClick={() => viewShipmentAnimation(activeShipment)}
              className="ml-2 text-xs px-2 py-0.5 bg-accent/20 rounded hover:bg-accent/30 transition-colors"
            >
              Animate
            </button>
          </div>
          <p className="text-sm">{activeShipment.id}</p>
          <div className="flex justify-between text-xs mt-1">
            <span>{activeShipment.origin.name}</span>
            <span>→</span>
            <span>{activeShipment.destination.name}</span>
          </div>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-medium ${
                activeShipment.status === 'in-transit' ? 'text-accent' :
                activeShipment.status === 'delivered' ? 'text-green-400' : 'text-yellow-300'
              }`}>
                {activeShipment.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>ETA:</span>
              <span>{activeShipment.eta}</span>
            </div>
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
