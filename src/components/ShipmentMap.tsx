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
          color: 'rgb(5, 5, 25)', // night fog
          'high-color': 'rgb(20, 20, 40)',
          'horizon-blend': 0.4,
          'space-color': 'rgb(5, 5, 15)',
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

        // Add a route layer with animated dash line
        map.current.addLayer({
          id: 'routes',
          type: 'line',
          source: 'routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': ['match', ['get', 'active'], true, '#00A3E0', '#666666'],
            'line-width': ['match', ['get', 'active'], true, 4, 2],
            'line-opacity': 0.8,
            'line-dasharray': [2, 1]
          },
        });

        // Add a glow effect for active routes
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
            'line-color': '#00A3E0',
            'line-width': 8,
            'line-opacity': ['match', ['get', 'active'], true, 0.2, 0],
            'line-blur': 5
          },
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
            'circle-color': ['match', ['get', 'type'], 'origin', '#16a34a', 'destination', '#dc2626', '#ffffff'],
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
            'circle-color': ['match', ['get', 'type'], 'origin', '#16a34a', 'destination', '#dc2626', '#ffffff'],
            'circle-opacity': ['match', ['get', 'active'], true, 0.5, 0],
            'circle-stroke-width': 0
          }
        });
      }
      
      // Start animations
      startRouteAnimations();
    });

    // Add click and hover events
    map.current.on('click', (e) => {
      setSelectedLocation([e.lngLat.lng, e.lngLat.lat]);
    });
    
    // Hover events for shipment routes
    map.current.on('mousemove', 'routes', (e) => {
      if (e.features && e.features.length > 0) {
        const shipmentId = e.features[0].properties?.shipmentId;
        const foundShipment = shipments.find(s => s.id === shipmentId);
        if (foundShipment) {
          setHoveredShipment(foundShipment);
          if (map.current) {
            const canvas = map.current.getCanvas();
            canvas.style.cursor = 'pointer';
          }
        }
      }
    });
    
    map.current.on('mouseleave', 'routes', () => {
      setHoveredShipment(null);
      if (map.current) {
        const canvas = map.current.getCanvas();
        canvas.style.cursor = '';
      }
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.current?.remove();
    };
  }, []);

  // Function to animate routes with moving dash patterns
  const startRouteAnimations = () => {
    let dashOffset = 0;
    
    const animate = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      dashOffset = (dashOffset + 0.5) % 4; // Adjust speed here
      
      if (map.current.getLayer('routes')) {
        map.current.setPaintProperty('routes', 'line-dasharray', [2, 1, 0.5, 1.5]);
        // Fixed: use a valid property name
        map.current.setPaintProperty('routes', 'line-dash-offset' as any, dashOffset);
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

      return line;
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
      
      // Fixed: Explicitly use GeoJSON Feature type
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
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
      
      {/* High-tech decorative elements */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-md text-xs text-cyan-400 font-mono hidden sm:block">
        SHIPMENT TRACKING | ACTIVE ROUTES: {shipments.length}
      </div>
    </div>
  );
};

export default ShipmentMap;
