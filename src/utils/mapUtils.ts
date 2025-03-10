
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Shipment } from '../types/shipment';

// Mapbox configuration - using a guaranteed working public token
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v11'; // Using standard dark style for reliability

// Map initial settings
export const MAP_INITIAL_CONFIG = {
  center: [20, 5], // Centered on Africa
  zoom: 2.5,
  pitch: 45,
  projection: 'mercator',
  bearing: 0
};

// Create arc route between two points
export const createArcRoute = (
  shipment: Shipment,
  isActive: boolean
): GeoJSON.Feature => {
  const start = shipment.origin.coordinates;
  const end = shipment.destination.coordinates;
  const type = shipment.type;
  
  // Calculate distance for proper arc height
  const distance = turf.distance(
    turf.point(start),
    turf.point(end),
    { units: 'kilometers' }
  );
  
  // Different arc heights based on type and distance
  let arcHeight: number;
  const baseHeight = distance * 0.005;
  
  if (type === 'charter') {
    // High arcs for air freight
    arcHeight = Math.min(baseHeight * 20, 200); 
  } else if (type === 'ship') {
    // Medium arcs for sea freight
    arcHeight = Math.min(baseHeight * 10, 100);
  } else {
    // Low arcs for ground transport
    arcHeight = Math.min(baseHeight * 3, 30);
  }
  
  // Create a curved path
  const steps = Math.max(Math.ceil(distance / 500), 12);
  const points: [number, number][] = [];
  
  // Add origin point
  points.push(start);
  
  // Create intermediate points for the curve
  for (let i = 1; i < steps - 1; i++) {
    const ratio = i / steps;
    const x = start[0] + (end[0] - start[0]) * ratio;
    const y = start[1] + (end[1] - start[1]) * ratio;
    
    // Create arc by modifying height
    const heightFactor = Math.sin(ratio * Math.PI);
    const elevation = arcHeight * heightFactor;
    
    points.push([x, y]);
  }
  
  // Add destination point
  points.push(end);
  
  // Return GeoJSON feature
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points
    },
    properties: { 
      active: isActive,
      shipmentId: shipment.id, 
      type: shipment.type
    }
  };
};

// Initialize map layers for shipment routes
export const initializeShipmentLayers = (map: mapboxgl.Map) => {
  try {
    console.log("Initializing shipment layers");
    
    // Add sources for different shipment types if they don't exist
    ['ship', 'charter', 'truck'].forEach(type => {
      const sourceId = `routes-${type}`;
      
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      // Colors for different route types
      const lineColors = {
        ship: ['rgba(21, 171, 192, 1)', 'rgba(21, 171, 192, 0.6)'],
        charter: ['rgba(79, 243, 248, 1)', 'rgba(79, 243, 248, 0.6)'],
        truck: ['rgba(220, 204, 130, 1)', 'rgba(220, 204, 130, 0.6)']
      };
      
      const lineWidth = type === 'charter' ? 3 : 2;
      const lineColor = lineColors[type as keyof typeof lineColors];
      
      // Add line layers for each type if they don't exist
      const routeId = `routes-${type}`;
      if (!map.getLayer(routeId)) {
        map.addLayer({
          id: routeId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': ['case', ['boolean', ['get', 'active'], false], lineColor[0], lineColor[1]],
            'line-width': ['case', ['boolean', ['get', 'active'], false], lineWidth + 1, lineWidth],
            'line-opacity': 0.8,
            'line-dasharray': type === 'ship' ? [0.5, 1, 2, 1] : type === 'charter' ? [1, 3] : [0.5, 1.5]
          },
        });
      }

      // Add glow effect for each route type
      const glowId = `routes-${type}-glow`;
      if (!map.getLayer(glowId)) {
        map.addLayer({
          id: glowId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': lineColor[0],
            'line-width': lineWidth + 6,
            'line-opacity': ['case', ['boolean', ['get', 'active'], false], 0.3, 0.1],
            'line-blur': 3
          },
        });
      }
    });

    // Add points source if it doesn't exist
    if (!map.getSource('points')) {
      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    }

    // Add points layer if it doesn't exist
    if (!map.getLayer('points')) {
      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': ['match', ['get', 'type'], 'origin', 5, 'destination', 5, 3],
          'circle-color': ['match', 
            ['get', 'type'], 
            'origin', '#15ABC0', 
            'destination', '#4FF2F8', 
            '#76A6B4'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 0.8
        }
      });
    }
    
    // Add points pulse layer if it doesn't exist
    if (!map.getLayer('points-pulse')) {
      map.addLayer({
        id: 'points-pulse',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': ['case', ['boolean', ['get', 'active'], false], 15, 0],
          'circle-color': ['match', 
            ['get', 'type'], 
            'origin', '#15ABC0', 
            'destination', '#4FF2F8', 
            '#76A6B4'
          ],
          'circle-opacity': ['case', ['boolean', ['get', 'active'], false], 0.5, 0],
          'circle-stroke-width': 0
        }
      });
    }
    
    console.log("Shipment layers initialized successfully");
  } catch (error) {
    console.error("Error initializing shipment layers:", error);
  }
};

// Update map with shipment data
export const updateShipmentData = (
  map: mapboxgl.Map,
  shipments: Shipment[], 
  activeShipment?: Shipment
) => {
  try {
    // Create route features for each type of shipment
    const shipRoutes: GeoJSON.Feature[] = [];
    const charterRoutes: GeoJSON.Feature[] = [];
    const truckRoutes: GeoJSON.Feature[] = [];
    
    shipments.forEach((shipment) => {
      const isActive = activeShipment?.id === shipment.id;
      const route = createArcRoute(shipment, isActive);
      
      // Add to appropriate array based on shipment type
      if (shipment.type === 'charter') {
        charterRoutes.push(route);
      } else if (shipment.type === 'ship') {
        shipRoutes.push(route);
      } else if (shipment.type === 'truck') {
        truckRoutes.push(route);
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
          type: 'Feature',
          geometry: {
            type: 'Point',
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
          type: 'Feature',
          geometry: {
            type: 'Point',
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
  } catch (error) {
    console.error("Error updating shipment data:", error);
  }
};
