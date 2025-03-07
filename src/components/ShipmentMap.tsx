
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import 'mapbox-gl/dist/mapbox-gl.css';

// Using a public token that works for demo purposes
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  
  // Track animation frames for cleanup
  const animationFrameRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [20, 5],
      zoom: 2,
      pitch: 45,
      projection: 'mercator'
    });

    // Add 3D terrain effect
    map.current.on('style.load', () => {
      if (map.current) {
        map.current.setFog({
          color: 'rgb(7, 23, 119)', // dark blue from palette
          'high-color': 'rgb(12, 58, 98)', // medium blue from palette
          'horizon-blend': 0.4,
          'space-color': 'rgb(7, 23, 119)', // dark blue from palette
          'star-intensity': 0.6
        });
      
        // Add a sky layer
        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        // Add custom terrain
        if (map.current.getSource('mapbox-dem')) {
          map.current.addLayer({
            'id': 'terrain-3d',
            'source': 'mapbox-dem',
            'type': 'fill-extrusion',
            'paint': {
              'fill-extrusion-base': 0,
              'fill-extrusion-color': '#15ABC0', // teal from palette
              'fill-extrusion-height': ['*', ['get', 'height'], 2],
              'fill-extrusion-opacity': 0.2
            }
          });
        }
      
        setMapLoaded(true);
        
        // Add a source for shipment routes
        if (map.current) {
          map.current.addSource('routes', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          // Add different route layers based on shipment type
          // 1. Ship routes (solid wavy line)
          map.current.addLayer({
            id: 'ship-routes',
            type: 'line',
            source: 'routes',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              visibility: 'visible'
            },
            paint: {
              'line-color': '#15ABC0', // teal from palette
              'line-width': ['case', ['==', ['get', 'active'], true], 4, 2],
              'line-opacity': 0.8,
              'line-dasharray': [2, 1]
            },
            filter: ['==', ['get', 'type'], 'ship']
          });

          // 2. Air routes (arc with gradient)
          map.current.addLayer({
            id: 'air-routes',
            type: 'line',
            source: 'routes',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              visibility: 'visible'
            },
            paint: {
              'line-color': '#62F3F7', // mint from palette
              'line-width': ['case', ['==', ['get', 'active'], true], 4, 2],
              'line-opacity': 0.8,
              'line-dasharray': [0.5, 0.5]
            },
            filter: ['==', ['get', 'type'], 'charter']
          });

          // 3. Vehicle routes (dotted line)
          map.current.addLayer({
            id: 'vehicle-routes',
            type: 'line',
            source: 'routes',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              visibility: 'visible'
            },
            paint: {
              'line-color': '#DCCC82', // sand from palette
              'line-width': ['case', ['==', ['get', 'active'], true], 4, 2],
              'line-opacity': 0.8,
              'line-dasharray': [0.1, 1.5]
            },
            filter: ['==', ['get', 'type'], 'truck']
          });

          // Add glow effects for active routes
          map.current.addLayer({
            id: 'routes-glow',
            type: 'line',
            source: 'routes',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              visibility: 'visible'
            },
            paint: {
              'line-color': [
                'match',
                ['get', 'type'],
                'ship', '#15ABC0',
                'charter', '#62F3F7',
                'truck', '#DCCC82',
                '#76A6B4' // default sage color
              ],
              'line-width': 8,
              'line-opacity': ['case', ['==', ['get', 'active'], true], 0.3, 0],
              'line-blur': 5
            }
          });

          // Add points for origins and destinations
          map.current.addSource('points', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          // Add origin/destination markers
          map.current.addLayer({
            id: 'points',
            type: 'circle',
            source: 'points',
            paint: {
              'circle-radius': ['match', ['get', 'type'], 'origin', 5, 'destination', 5, 3],
              'circle-color': ['match', 
                ['get', 'type'], 
                'origin', '#62F3F7', // mint
                'destination', '#DCCC82', // sand
                '#ffffff'
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 0.8
            }
          });
        
          // Add a pulsing effect for active points
          map.current.addLayer({
            id: 'points-pulse',
            type: 'circle',
            source: 'points',
            paint: {
              'circle-radius': ['match', ['get', 'active'], true, 15, 0],
              'circle-color': ['match', 
                ['get', 'type'], 
                'origin', '#62F3F7', 
                'destination', '#DCCC82',
                '#ffffff'
              ],
              'circle-opacity': ['match', ['get', 'active'], true, 0.5, 0],
              'circle-stroke-width': 0
            }
          });
        }
        
        // Start animations
        startRouteAnimations();
      }
    });

    // Add click and hover events
    map.current.on('click', (e) => {
      setSelectedLocation([e.lngLat.lng, e.lngLat.lat]);
    });
    
    // Hover events for shipment routes
    map.current.on('mousemove', 'ship-routes', (e) => {
      if (e.features && e.features.length > 0) {
        const shipmentId = e.features[0].properties?.shipmentId;
        const foundShipment = shipments.find(s => s.id === shipmentId);
        if (foundShipment && map.current) {
          setHoveredShipment(foundShipment);
          const canvas = map.current.getCanvas();
          canvas.style.cursor = 'pointer';
        }
      }
    });
    
    // Also add hover for air routes
    map.current.on('mousemove', 'air-routes', (e) => {
      if (e.features && e.features.length > 0) {
        const shipmentId = e.features[0].properties?.shipmentId;
        const foundShipment = shipments.find(s => s.id === shipmentId);
        if (foundShipment && map.current) {
          setHoveredShipment(foundShipment);
          const canvas = map.current.getCanvas();
          canvas.style.cursor = 'pointer';
        }
      }
    });
    
    // Also add hover for vehicle routes
    map.current.on('mousemove', 'vehicle-routes', (e) => {
      if (e.features && e.features.length > 0) {
        const shipmentId = e.features[0].properties?.shipmentId;
        const foundShipment = shipments.find(s => s.id === shipmentId);
        if (foundShipment && map.current) {
          setHoveredShipment(foundShipment);
          const canvas = map.current.getCanvas();
          canvas.style.cursor = 'pointer';
        }
      }
    });
    
    // Mouse leave event for all route types
    const resetHover = () => {
      setHoveredShipment(null);
      if (map.current) {
        const canvas = map.current.getCanvas();
        canvas.style.cursor = '';
      }
    };
    
    map.current.on('mouseleave', 'ship-routes', resetHover);
    map.current.on('mouseleave', 'air-routes', resetHover);
    map.current.on('mouseleave', 'vehicle-routes', resetHover);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.current?.remove();
    };
  }, [shipments]);

  // Function to animate routes with moving dash patterns
  const startRouteAnimations = () => {
    let dashOffset = 0;
    
    const animate = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      dashOffset = (dashOffset + 0.5) % 4; // Adjust speed here
      
      // Animate ship routes
      if (map.current.getLayer('ship-routes')) {
        map.current.setPaintProperty('ship-routes', 'line-dasharray', [2, 1, 0.5, 1.5]);
        map.current.setPaintProperty('ship-routes', 'line-dash-offset', dashOffset);
      }
      
      // Animate air routes (faster)
      if (map.current.getLayer('air-routes')) {
        map.current.setPaintProperty('air-routes', 'line-dasharray', [0.5, 0.5]);
        map.current.setPaintProperty('air-routes', 'line-dash-offset', dashOffset * 2);
      }
      
      // Animate vehicle routes (slower, more distinct dots)
      if (map.current.getLayer('vehicle-routes')) {
        map.current.setPaintProperty('vehicle-routes', 'line-dasharray', [0.1, 1.5]);
        map.current.setPaintProperty('vehicle-routes', 'line-dash-offset', dashOffset * 0.7);
      }
      
      // Pulse animation for points
      const pulseSize = 5 + Math.sin(Date.now() / 500) * 5; // Pulsing radius
      if (map.current.getLayer('points-pulse')) {
        map.current.setPaintProperty('points-pulse', 'circle-radius', 
          ['case', 
            ['==', ['get', 'active'], true], 
            pulseSize, 
            0
          ]
        );
        map.current.setPaintProperty('points-pulse', 'circle-opacity', 
          ['case', 
            ['==', ['get', 'active'], true], 
            0.5 - Math.sin(Date.now() / 500) * 0.3, 
            0
          ]
        );
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  useEffect(() => {
    if (!mapLoaded || !map.current?.isStyleLoaded()) return;

    // Create route features
    const routeFeatures = shipments.map((shipment) => {
      const start = shipment.origin.coordinates;
      const end = shipment.destination.coordinates;
      
      const isActive = activeShipment?.id === shipment.id;
      
      // Create an arc path for the route
      const options = { 
        properties: { 
          active: isActive,
          shipmentId: shipment.id, 
          type: shipment.type
        },
        npoints: 100 
      };
      
      // Different arc height for different shipment types
      let arc: any;
      
      if (shipment.type === 'charter') {
        // Higher arc for airplanes
        arc = createArcPath(start, end, 0.5);
      } else if (shipment.type === 'truck') {
        // Straighter path for ground vehicles
        arc = turf.greatCircle(turf.point(start), turf.point(end), options);
      } else {
        // Moderate arc for ships
        arc = createArcPath(start, end, 0.2);
      }
      
      // Set the properties
      if (arc.properties) {
        arc.properties.active = isActive;
        arc.properties.shipmentId = shipment.id;
        arc.properties.type = shipment.type;
      }

      return arc;
    });

    // Update route data
    if (map.current.getSource('routes')) {
      (map.current.getSource('routes') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: routeFeatures,
      });
    }
    
    // Create point features for origins and destinations
    const pointFeatures = shipments.flatMap((shipment) => {
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
    if (map.current.getSource('points')) {
      (map.current.getSource('points') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: pointFeatures,
      });
    }
    
    // If there's an active shipment, fly to it
    if (activeShipment) {
      // Calculate the midpoint of the route to center the map
      const start = activeShipment.origin.coordinates;
      const end = activeShipment.destination.coordinates;
      
      // Create a proper LngLatLike object for the midpoint
      const midpoint: [number, number] = [
        (start[0] + end[0]) / 2, 
        (start[1] + end[1]) / 2
      ];
      
      // Calculate appropriate zoom level based on distance
      const distance = turf.distance(
        turf.point(start),
        turf.point(end),
        { units: 'kilometers' }
      );
      
      const zoom = Math.max(2, 9 - Math.log(distance) / Math.log(2) * 0.5);
      
      map.current.flyTo({
        center: midpoint,
        zoom: zoom,
        duration: 2000,
        essential: true
      });
    }
  }, [shipments, activeShipment, mapLoaded]);

  // Create an arc path between two points with a control point
  const createArcPath = (start: number[], end: number[], heightFactor: number) => {
    // Calculate the mid point
    const midPoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2
    ];
    
    // Calculate distance for height
    const distance = turf.distance(
      turf.point(start),
      turf.point(end),
      { units: 'kilometers' }
    );
    
    // Create a line with multiple points for a curved path
    const line = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: []
      }
    };
    
    // Generate curved line with multiple segments
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      
      // Parametric equation for quadratic bezier curve
      const lat = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * (midPoint[1] + heightFactor * distance / 100) + t * t * end[1];
      const lng = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * midPoint[0] + t * t * end[0];
      
      line.geometry.coordinates.push([lng, lat]);
    }
    
    return line;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Shipment info tooltip on hover */}
      {hoveredShipment && (
        <ShipmentTooltip shipment={hoveredShipment} />
      )}
      
      {/* Weather info on click */}
      {selectedLocation && (
        <WeatherInfo
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
      
      {/* Map overlay gradient for depth effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-palette-darkblue/20 to-transparent" />
      
      {/* High-tech decorative elements */}
      <div className="absolute top-4 right-4 bg-palette-darkblue/80 backdrop-blur-md p-2 rounded-md text-xs text-palette-mint font-mono border border-palette-teal/30 hidden sm:block">
        SHIPMENT TRACKING | ACTIVE ROUTES: {shipments.length}
      </div>
    </div>
  );
};

export default ShipmentMap;
