
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import 'mapbox-gl/dist/mapbox-gl.css';

// Update to use the provided token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

// Type for our custom layer properties
type CustomLayerProps = {
  dashOffset: number;
  active: boolean;
  type: 'ship' | 'charter' | 'truck';
};

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  
  // Track animation frames for cleanup
  const animationFrameRef = useRef<number | null>(null);
  // Custom properties for different route types
  const routeProps = useRef<Record<string, CustomLayerProps>>({});
  
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/clcgr62o0003c14mr8b0xg3cn',
      center: [20, 5],
      zoom: 1.8,
      pitch: 45,
      projection: 'mercator'
    });

    // Add 3D terrain effect
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(7, 23, 119)', // Dark blue fog (palette.darkblue)
        'high-color': 'rgb(12, 58, 98)', // palette.blue
        'horizon-blend': 0.4,
        'space-color': 'rgb(7, 16, 60)',
        'star-intensity': 0.8
      });
      
      // Add a sky layer
      map.current?.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
      
      setMapLoaded(true);
      
      // Add source for grid pattern
      map.current?.addSource('grid', {
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
      
      // Add grid pattern layer for sci-fi effect
      map.current?.addLayer({
        id: 'grid-layer',
        type: 'fill',
        source: 'grid',
        layout: {},
        paint: {
          'fill-color': 'transparent',
          'fill-outline-color': 'rgba(98, 243, 247, 0.1)',
          'fill-pattern': 'grid'
        }
      });
      
      // Add sources for different shipment types
      ['ship', 'charter', 'truck'].forEach(type => {
        // Add a source for each shipment type routes
        map.current?.addSource(`routes-${type}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        const lineColor = type === 'ship' ? '#15ABC0' : type === 'charter' ? '#62F3F7' : '#DCCC82';
        const lineWidth = type === 'charter' ? 3 : 2;
        
        // Add line layers for each type with different styles
        map.current?.addLayer({
          id: `routes-${type}`,
          type: 'line',
          source: `routes-${type}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': ['case', ['boolean', ['get', 'active'], false], lineColor, `${lineColor}99`],
            'line-width': ['case', ['boolean', ['get', 'active'], false], lineWidth + 1, lineWidth],
            'line-opacity': 0.8,
            'line-dasharray': type === 'ship' ? [0.5, 1, 2, 1] : type === 'charter' ? [1, 3] : [0.5, 1.5]
          },
        });

        // Add glow effect for each route type
        map.current?.addLayer({
          id: `routes-${type}-glow`,
          type: 'line',
          source: `routes-${type}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: 'visible'
          },
          paint: {
            'line-color': lineColor,
            'line-width': lineWidth + 6,
            'line-opacity': ['case', ['boolean', ['get', 'active'], false], 0.3, 0.1],
            'line-blur': 3
          },
        });
        
        // Initialize custom props for animations
        routeProps.current[type] = { dashOffset: 0, active: false, type: type as 'ship' | 'charter' | 'truck' };
      });

      // Add points for origins and destinations
      map.current?.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Add origin/destination markers
      map.current?.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': ['match', ['get', 'type'], 'origin', 5, 'destination', 5, 3],
          'circle-color': ['match', 
            ['get', 'type'], 
            'origin', '#15ABC0', 
            'destination', '#62F3F7', 
            '#76A6B4'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 0.8
        }
      });
      
      // Add a pulsing effect for active points
      map.current?.addLayer({
        id: 'points-pulse',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': ['case', ['boolean', ['get', 'active'], false], 15, 0],
          'circle-color': ['match', 
            ['get', 'type'], 
            'origin', '#15ABC0', 
            'destination', '#62F3F7', 
            '#76A6B4'
          ],
          'circle-opacity': ['case', ['boolean', ['get', 'active'], false], 0.5, 0],
          'circle-stroke-width': 0
        }
      });
      
      // Start animations
      startRouteAnimations();
    });

    // Add click and hover events
    map.current.on('click', (e) => {
      setSelectedLocation([e.lngLat.lng, e.lngLat.lat]);
    });
    
    // Hover events for shipment routes
    ['ship', 'charter', 'truck'].forEach(type => {
      map.current?.on('mousemove', `routes-${type}`, (e) => {
        if (e.features && e.features.length > 0) {
          const shipmentId = e.features[0].properties?.shipmentId;
          const foundShipment = shipments.find(s => s.id === shipmentId);
          if (foundShipment) {
            setHoveredShipment(foundShipment);
            const canvas = map.current?.getCanvas();
            if (canvas) {
              canvas.style.cursor = 'pointer';
            }
          }
        }
      });
      
      map.current?.on('mouseleave', `routes-${type}`, () => {
        setHoveredShipment(null);
        const canvas = map.current?.getCanvas();
        if (canvas) {
          canvas.style.cursor = '';
        }
      });
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.current?.remove();
    };
  }, []);

  // Function to animate routes with specific patterns for each shipment type
  const startRouteAnimations = () => {
    const animate = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Update each route type with different animations
      ['ship', 'charter', 'truck'].forEach(type => {
        if (routeProps.current[type]) {
          // Different speeds for different types
          const speed = type === 'ship' ? 0.2 : type === 'charter' ? 0.4 : 0.3;
          routeProps.current[type].dashOffset = (routeProps.current[type].dashOffset + speed) % 8;
          
          if (map.current?.getLayer(`routes-${type}`)) {
            // Using setPaintProperty for 'line-dash-offset'
            (map.current as any).setPaintProperty(`routes-${type}`, 'line-dash-offset', 
              routeProps.current[type].dashOffset);
          }
        }
      });
      
      // Pulse animation for points
      const pulseSize = 5 + Math.sin(Date.now() / 500) * 5; // Pulsing radius
      if (map.current?.getLayer('points-pulse')) {
        map.current.setPaintProperty('points-pulse', 'circle-radius', 
          ['case', 
            ['boolean', ['get', 'active'], false], 
            pulseSize, 
            0
          ]
        );
        map.current.setPaintProperty('points-pulse', 'circle-opacity', 
          ['case', 
            ['boolean', ['get', 'active'], false], 
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

    // Create route features for each type of shipment
    const shipRoutes: GeoJSON.Feature[] = [];
    const charterRoutes: GeoJSON.Feature[] = [];
    const truckRoutes: GeoJSON.Feature[] = [];
    
    shipments.forEach((shipment) => {
      const start = shipment.origin.coordinates;
      const end = shipment.destination.coordinates;
      
      const isActive = activeShipment?.id === shipment.id;
      
      // Create curved arcs for all shipment types - more pronounced for air and sea
      const createArcRoute = (type: 'ship' | 'charter' | 'truck') => {
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
        
        // Create a curved arc by adding control points
        // First, find the midpoint
        const midCoord: [number, number] = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2
        ];
        
        // Create a bezier curve with elevated control points
        const points = [];
        points.push(start);
        
        // Add control points for the curve - more points = smoother curve
        const steps = Math.max(Math.ceil(distance / 500), 8); // More points for longer distances
        
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
        
        points.push(end);
        
        // Create a curved line with the points
        const line = {
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
        
        return line;
      };
      
      // Create appropriate route based on shipment type
      if (shipment.type === 'charter') {
        charterRoutes.push(createArcRoute('charter'));
      } else if (shipment.type === 'ship') {
        shipRoutes.push(createArcRoute('ship'));
      } else if (shipment.type === 'truck') {
        truckRoutes.push(createArcRoute('truck'));
      }
    });

    // Update route data for each type
    if (map.current.getSource('routes-ship')) {
      (map.current.getSource('routes-ship') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: shipRoutes,
      });
    }
    
    if (map.current.getSource('routes-charter')) {
      (map.current.getSource('routes-charter') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: charterRoutes,
      });
    }
    
    if (map.current.getSource('routes-truck')) {
      (map.current.getSource('routes-truck') as mapboxgl.GeoJSONSource).setData({
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
      
      const midpoint: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
      
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
      
      {/* Sci-fi overlay elements */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-palette-darkblue/40 to-transparent">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
        <div className="absolute inset-y-0 left-0 w-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
      </div>
      
      {/* Scanner line effect */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-palette-mint/50 animate-scanner pointer-events-none"></div>
      
      {/* HUD elements */}
      <div className="absolute top-4 right-4 bg-palette-blue/80 backdrop-blur-md p-3 rounded-md border border-palette-teal/30 shadow-lg shadow-palette-mint/10 hidden md:block">
        <div className="text-xs text-palette-mint font-mono mb-1 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-palette-mint animate-blink"></span>
          SHIPMENT TRACKING SYSTEM v2.0
        </div>
        <div className="text-xs text-white/80 font-mono">
          ACTIVE ROUTES: <span className="text-palette-mint">{shipments.length}</span> | 
          SEA: <span className="text-palette-teal">{shipments.filter(s => s.type === 'ship').length}</span> | 
          AIR: <span className="text-palette-mint">{shipments.filter(s => s.type === 'charter').length}</span> | 
          GROUND: <span className="text-palette-sand">{shipments.filter(s => s.type === 'truck').length}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-palette-blue/80 backdrop-blur-md p-3 rounded-md border border-palette-teal/30 shadow-lg shadow-palette-mint/10 text-xs font-mono hidden sm:block">
        <div className="text-white/80 mb-2">ROUTE TYPES:</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-palette-teal rounded"></span>
            <span className="text-palette-teal">SEA FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-palette-mint rounded"></span>
            <span className="text-palette-mint">AIR FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-palette-sand rounded"></span>
            <span className="text-palette-sand">GROUND TRANSPORT</span>
          </div>
        </div>
      </div>
      
      {/* Time indicator */}
      <div className="absolute top-4 left-4 bg-palette-blue/80 backdrop-blur-md p-3 rounded-md border border-palette-teal/30 shadow-lg shadow-palette-mint/10 hidden md:block">
        <div className="text-xs text-palette-mint font-mono animate-pulse-opacity">
          {new Date().toLocaleTimeString()} UTC
        </div>
      </div>
    </div>
  );
};

export default ShipmentMap;
