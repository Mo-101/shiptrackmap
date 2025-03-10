import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './MapHUD';
import { createLineAnimation, updateLineAnimation, createMovingDotAnimation, animateShipmentRoute } from '../utils/animations';
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
  const [mapInitError, setMapInitError] = useState<string | null>(null);
  
  const pendingAnimationRef = useRef<Shipment | null>(null);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log("Map loaded successfully");
    
    try {
      initializeShipmentLayers(loadedMap);
      createLineAnimation(loadedMap);
      createMovingDotAnimation(loadedMap);
      setMap(loadedMap);
      setMapLoaded(true);
      
      if (pendingAnimationRef.current) {
        console.log("Processing pending animation for:", pendingAnimationRef.current.id);
        setTimeout(() => {
          jumpToShipment(pendingAnimationRef.current!, true);
          pendingAnimationRef.current = null;
        }, 1000);
      }
      
      toast({
        title: 'AfriWave CargoLive™',
        description: 'Welcome to the cutting-edge shipment tracker dashboard',
        duration: 5000,
      });
    } catch (error) {
      console.error("Error during map initialization:", error);
      setMapInitError("Failed to initialize map components");
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
        pitch: 60,
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
          title: `CargoLive™ Tracking: ${shipment.id}`,
          description: `From ${shipment.origin.name} to ${shipment.destination.name}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error in jumpToShipment:", error);
      toast({
        title: 'Animation Error',
        description: 'Failed to animate shipment route',
        variant: 'destructive',
        duration: 3000,
      });
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
      title: 'CargoLive™ Itinerary Animation',
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
      
      <MapHUD shipments={shipments} />
      
      <div className="absolute top-4 left-4 z-10 flex items-center">
        <div className="bg-primary/80 backdrop-blur-md px-3 py-2 rounded-md border border-accent/30 text-white flex items-center tech-border">
          <span className="text-accent font-bold neon-text">AfriWave</span>
          <span className="ml-1 text-white font-medium">CargoLive™</span>
          <div className="ml-2 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {activeShipment && (
          <button
            onClick={toggleTracking}
            className={`px-4 py-2 rounded-md font-medium transition-colors tech-border ${
              isTracking 
                ? 'bg-accent text-primary shadow-md futuristic-glow' 
                : 'bg-primary/80 text-white hover:bg-primary'
            }`}
          >
            {isTracking ? 'CargoLive™ Active' : 'Start CargoLive™'}
          </button>
        )}
        
        <button
          onClick={startItineraryAnimation}
          className="px-4 py-2 rounded-md font-medium bg-secondary/80 text-white hover:bg-secondary transition-colors tech-border"
        >
          Animate All Routes
        </button>
      </div>
      
      {activeShipment && (
        <div className="absolute bottom-4 left-4 z-10 bg-primary/90 backdrop-blur-sm p-3 rounded-md border border-accent/30 text-white max-w-xs hologram-effect">
          <div className="flex items-center">
            <h3 className="text-accent font-semibold neon-text">Supply Chain Pulse™</h3>
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
      
      {mapInitError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-900/80 text-white p-4 rounded-md border border-red-500 max-w-md">
          <h3 className="text-xl font-bold mb-2">Map Error</h3>
          <p>{mapInitError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md"
          >
            Reload Application
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentMap;
