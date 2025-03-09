
import React, { useState, useEffect, useCallback } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './MapHUD';
import { createLineAnimation, updateLineAnimation, createMovingDotAnimation, animateShipmentRoute } from './MapAnimations';
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

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    console.log("Map loaded successfully");
    initializeShipmentLayers(loadedMap);
    createLineAnimation(loadedMap);
    createMovingDotAnimation(loadedMap);
    setMap(loadedMap);
    setMapLoaded(true);
    
    // Welcome toast for AfriWave CargoLive™
    toast({
      title: 'AfriWave CargoLive™',
      description: 'Welcome to the cutting-edge shipment tracker dashboard',
      duration: 5000,
    });
  };

  // Jump to shipment animation
  const jumpToShipment = useCallback((shipment: Shipment, animate: boolean = true) => {
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
    
    // Get route coordinates from arc route
    const routeFeature = createArcRoute(shipment, true);
    // Access coordinates with type assertion to avoid TypeScript error
    const routeCoordinates = (routeFeature.geometry as GeoJSON.LineString).coordinates as [number, number][];
    
    // Cancel any existing animation
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    // Update the tracking line
    updateLineAnimation(map, routeCoordinates);
    
    // Start the animation of the cargo moving along the route
    if (animate) {
      setActiveAnimation(shipment.id);
      // Calculate animation duration based on distance (longer routes = slower animation)
      const duration = Math.max(8000, routeCoordinates.length * 1000); // min 8 seconds
      animateShipmentRoute(map, routeCoordinates, duration);
      
      // Show toast notification
      toast({
        title: `CargoLive™ Tracking: ${shipment.id}`,
        description: `From ${shipment.origin.name} to ${shipment.destination.name}`,
        duration: 3000,
      });
    }
  }, [map, animationFrame]);

  // Update map data when shipments or active shipment changes
  useEffect(() => {
    if (!map || !map.loaded()) return;
    
    updateShipmentData(map, shipments, activeShipment);
    
    // If there's an active shipment, we can enable tracking
    if (activeShipment && isTracking) {
      jumpToShipment(activeShipment, true);
    }
  }, [shipments, activeShipment, mapLoaded, map, isTracking, jumpToShipment]);

  // Toggle tracking function
  const toggleTracking = () => {
    setIsTracking(prev => {
      const newState = !prev;
      if (newState && activeShipment) {
        jumpToShipment(activeShipment, true);
      }
      return newState;
    });
  };

  // Jump to a random shipment every 10 seconds for demo purposes
  const startItineraryAnimation = () => {
    // Clear any existing animation
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    // Show toast for feature activation
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
      }, 12000); // Change shipment every 12 seconds (including animation duration)
      
      setAnimationFrame(frame as unknown as number);
    };
    
    animateItineraries();
  };

  // View single shipment with animation
  const viewShipmentAnimation = (shipment: Shipment) => {
    if (activeAnimation === shipment.id) return;
    
    jumpToShipment(shipment, true);
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
      
      {/* AfriWave CargoLive™ branding */}
      <div className="absolute top-4 left-4 z-10 flex items-center">
        <div className="bg-primary/80 backdrop-blur-md px-3 py-2 rounded-md border border-accent/30 text-white flex items-center">
          <span className="text-accent font-bold">AfriWave</span>
          <span className="ml-1 text-white font-medium">CargoLive™</span>
          <div className="ml-2 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      
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
      
      {/* Active shipment indicator - bottom left */}
      {activeShipment && (
        <div className="absolute bottom-4 left-4 z-10 bg-primary/90 backdrop-blur-sm p-3 rounded-md border border-accent/30 text-white max-w-xs">
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
