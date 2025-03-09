
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Shipment } from '../types/shipment';

// Mapbox configuration
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';
export const MAPBOX_STYLE = 'mapbox://styles/akanimo1/clcgr62o0003c14mr8b0xg3cn';

// Map initial settings
export const MAP_INITIAL_CONFIG = {
  center: [20, 5], // Centered on Africa
  zoom: 1.8,
  pitch: 45,
  projection: 'mercator',
  bearing: 0
};

// Type definitions
export type CustomLayerProps = {
  dashOffset: number;
  active: boolean;
  type: 'ship' | 'charter' | 'truck';
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
  
  // Create a curved path with variable points based on distance
  const steps = Math.max(Math.ceil(distance / 500), 12); // Increased points for smoother curve
  const points: [number, number][] = [];
  
  // Add origin point
  points.push(start);
  
  // Create intermediate points for the curve
  for (let i = 1; i < steps - 1; i++) {
    const ratio = i / steps;
    const x = start[0] + (end[0] - start[0]) * ratio;
    const y = start[1] + (end[1] - start[1]) * ratio;
    
    // Create arc by modifying height at each point
    // Sine wave distribution for smooth arcs
    const heightFactor = Math.sin(ratio * Math.PI);
    const elevation = arcHeight * heightFactor;
    
    points.push([x, y]);
  }
  
  // Add destination point
  points.push(end);
  
  // Return GeoJSON feature
  return {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: points
    },
    properties: { 
      active: isActive,
      shipmentId: shipment.id, 
      type: shipment.type
    }
  };
};

// Setup fog and sky effects for map
export const setupMapEffects = (map: mapboxgl.Map) => {
  try {
    map.setFog({
      color: 'rgb(7, 23, 59)', // Darker blue fog
      'high-color': 'rgb(12, 38, 78)',
      'horizon-blend': 0.4,
      'space-color': 'rgb(3, 9, 33)',
      'star-intensity': 0.7
    });
    
    // Add a sky layer if it doesn't exist yet
    if (!map.getLayer('sky')) {
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    }
    
    console.log("Map effects setup completed");
  } catch (error) {
    console.error("Error setting up map effects:", error);
  }
};

// Load map assets and ensure they're available
export const preloadMapAssets = (map: mapboxgl.Map) => {
  // Load grid pattern for sci-fi effect
  try {
    map.loadImage('/grid.png', (error, image) => {
      if (error) {
        console.error('Error loading grid pattern:', error);
        return;
      }
      
      if (image && !map.hasImage('grid')) {
        map.addImage('grid', image);
      }
    });
    
    // Load dot image for moving cargo indicator
    map.loadImage('/dot.png', (error, image) => {
      if (error) {
        console.error('Error loading dot image:', error);
        return;
      }
      
      if (image && !map.hasImage('dot')) {
        map.addImage('dot', image);
      }
    });
  } catch (error) {
    console.error("Error preloading map assets:", error);
  }
};

// Initialize map layers for shipment routes
export const initializeShipmentLayers = (map: mapboxgl.Map) => {
  try {
    console.log("Initializing shipment layers");
    
    // Add source for grid pattern if it doesn't exist
    if (!map.getSource('grid')) {
      map.addSource('grid', {
        type: 'geojson',
        data: {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [-180, -90],
                [180, -90],
                [180, 90],
                [-180, 90],
                [-180, -90]
              ]
            ]
          }
        }
      });
    }
    
    // Add grid pattern layer for sci-fi effect if it doesn't exist
    if (!map.getLayer('grid-layer')) {
      map.addLayer({
        id: 'grid-layer',
        type: 'fill',
        source: 'grid',
        layout: {},
        paint: {
          'fill-color': 'transparent',
          'fill-outline-color': 'rgba(79, 243, 248, 0.1)',
          'fill-pattern': 'grid'
        }
      });
    }
    
    // Add route layers for different shipment types
    ['ship', 'charter', 'truck'].forEach(type => {
      // Add a source for each shipment type routes if it doesn't exist
      if (!map.getSource(`routes-${type}`)) {
        map.addSource(`routes-${type}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      // Define colors for different route types - using hex with alpha
      const lineColors = {
        ship: ['rgba(21, 171, 192, 1)', 'rgba(21, 171, 192, 0.6)'],    // Sea - Teal
        charter: ['rgba(79, 243, 248, 1)', 'rgba(79, 243, 248, 0.6)'], // Air - Bright Cyan
        truck: ['rgba(220, 204, 130, 1)', 'rgba(220, 204, 130, 0.6)']  // Ground - Sand
      };
      
      const lineWidth = type === 'charter' ? 3 : 2;
      const lineColor = lineColors[type as keyof typeof lineColors];
      
      // Add line layers for each type with different styles if they don't exist
      if (!map.getLayer(`routes-${type}`)) {
        map.addLayer({
          id: `routes-${type}`,
          type: 'line',
          source: `routes-${type}`,
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

      // Add glow effect for each route type if it doesn't exist
      if (!map.getLayer(`routes-${type}-glow`)) {
        map.addLayer({
          id: `routes-${type}-glow`,
          type: 'line',
          source: `routes-${type}`,
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

    // Add points for origins and destinations if they don't exist
    if (!map.getSource('points')) {
      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    }

    // Add origin/destination markers if they don't exist
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
    
    // Add a pulsing effect for active points if it doesn't exist
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
      
      const zoom = Math.max(2, 9 - Math.log(distance) / Math.log(2) * 0.5);
      
      map.flyTo({
        center: midpoint,
        zoom: zoom,
        pitch: 60, // Enhanced pitch for dramatic 3D effect
        duration: 2000,
        essential: true
      });
    }
    
    console.log("Shipment data updated successfully");
  } catch (error) {
    console.error("Error updating shipment data:", error);
  }
};
