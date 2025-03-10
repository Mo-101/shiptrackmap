
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';
import { createArcRoute } from './mapUtils';
import { 
  updateLineAnimation, 
  animateShipmentRoute 
} from './animations';

export const jumpToShipment = (
  map: mapboxgl.Map | null,
  shipment: Shipment,
  animate: boolean = true,
  setAnimationFrame: (frame: number | null) => void,
  setActiveAnimation: (id: string | null) => void,
) => {
  if (!map || !map.loaded()) {
    console.log("Map not ready, cannot jump to shipment:", shipment.id);
    return false;
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
    
    updateLineAnimation(map, routeCoordinates);
    
    if (animate) {
      setActiveAnimation(shipment.id);
      const duration = Math.max(8000, routeCoordinates.length * 1000);
      const animationId = animateShipmentRoute(map, routeCoordinates, duration);
      setAnimationFrame(animationId);
    }
    
    return true;
  } catch (error) {
    console.error("Error in jumpToShipment:", error);
    return false;
  }
};

export const startItineraryAnimation = (
  map: mapboxgl.Map | null, 
  shipments: Shipment[],
  setAnimationFrame: (frame: number | null) => void,
  animationFrame: number | null,
  jumpToShipmentFn: (shipment: Shipment, animate: boolean) => void
) => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  
  let index = 0;
  
  const animateItineraries = () => {
    if (shipments.length > 0) {
      const shipment = shipments[index % shipments.length];
      jumpToShipmentFn(shipment, true);
      index++;
    }
    
    const frame = setTimeout(() => {
      requestAnimationFrame(animateItineraries);
    }, 12000);
    
    setAnimationFrame(frame as unknown as number);
  };
  
  animateItineraries();
};
