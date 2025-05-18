
import * as turf from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';

export const generateMapRoutes = (
  map: mapboxgl.Map | null,
  shipments: Shipment[],
  activeShipment?: Shipment
) => {
  if (!map || !map.isStyleLoaded()) return;

  // Create route features for each type of shipment
  const shipRoutes: GeoJSON.Feature[] = [];
  const charterRoutes: GeoJSON.Feature[] = [];
  const truckRoutes: GeoJSON.Feature[] = [];
  
  shipments.forEach((shipment) => {
    const start = shipment.origin.coordinates;
    const end = shipment.destination.coordinates;
    
    const isActive = activeShipment?.id === shipment.id;
    
    // Create a curved line for air routes (charter)
    if (shipment.type === 'charter') {
      // Create a curved arc for flights
      const midPoint = turf.midpoint(
        turf.point(start),
        turf.point(end)
      );
      
      // Add elevation to create an arc
      const midCoord = midPoint.geometry.coordinates;
      const distance = turf.distance(turf.point(start), turf.point(end), { units: 'kilometers' });
      const elevation = Math.min(distance * 0.1, 100); // Limit max height
      
      midCoord[2] = elevation;
      
      // Create a bezier curve
      const line = turf.bezierSpline(turf.lineString([
        start,
        midCoord,
        end
      ]), { sharpness: 0.8 });
      
      // Add properties
      line.properties = { 
        active: isActive,
        shipmentId: shipment.id, 
        type: shipment.type
      };
      
      charterRoutes.push(line);
    } 
    // Create slightly curved lines for sea routes (ship)
    else if (shipment.type === 'ship') {
      const line = turf.greatCircle(
        turf.point(start),
        turf.point(end),
        { 
          properties: { 
            active: isActive,
            shipmentId: shipment.id, 
            type: shipment.type
          },
          npoints: 100
        }
      );
      
      shipRoutes.push(line);
    }
    // Create straight lines for ground routes (truck)
    else if (shipment.type === 'truck') {
      const line = turf.lineString(
        [start, end],
        { 
          active: isActive,
          shipmentId: shipment.id, 
          type: shipment.type
        }
      );
      
      truckRoutes.push(line);
    }
  });

  // Update route data for each type
  if (map.getSource('routes-ship')) {
    (map.getSource('routes-ship') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: shipRoutes,
    });
  }
  
  if (map.getSource('routes-charter')) {
    (map.getSource('routes-charter') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: charterRoutes,
    });
  }
  
  if (map.getSource('routes-truck')) {
    (map.getSource('routes-truck') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: truckRoutes,
    });
  }
  
  // Create point features for origins and destinations
  const pointFeatures: GeoJSON.Feature[] = shipments.flatMap((shipment) => {
    const isActive = activeShipment?.id === shipment.id;
    
    return [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: shipment.origin.coordinates
        },
        properties: {
          type: 'origin',
          name: shipment.origin.name,
          shipmentId: shipment.id,
          active: isActive
        }
      },
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: shipment.destination.coordinates
        },
        properties: {
          type: 'destination',
          name: shipment.destination.name,
          shipmentId: shipment.id,
          active: isActive
        }
      }
    ];
  });
  
  // Update point data
  if (map.getSource('points')) {
    (map.getSource('points') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: pointFeatures,
    });
  }
  
  // If there's an active shipment, fly to it
  if (activeShipment) {
    // Calculate the midpoint of the route to center the map
    const start = activeShipment.origin.coordinates;
    const end = activeShipment.destination.coordinates;
    
    const midpoint: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    
    // Calculate appropriate zoom level based on distance
    const distance = turf.distance(
      turf.point(start),
      turf.point(end),
      { units: 'kilometers' }
    );
    
    const zoom = Math.max(19, 9 - Math.log(distance) / Math.log(2) * 0.5);
    
    map.flyTo({
      center: midpoint,
      zoom: zoom,
      duration: 2000,
      essential: true
    });
  }
};
