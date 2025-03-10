
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';
import { setupRouteAnimations, CustomLayerProps } from '../utils/mapAnimations';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.RefObject<mapboxgl.Map | null>;
  routeProps: React.MutableRefObject<Record<string, CustomLayerProps>>;
  animationFrameRef: React.MutableRefObject<number | null>;
  shipments: Shipment[];
  setMapLoaded: (loaded: boolean) => void;
  setSelectedLocation: (location: [number, number] | null) => void;
  setHoveredShipment: (shipment: Shipment | null) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  mapContainer, 
  map, 
  routeProps, 
  animationFrameRef, 
  shipments, 
  setMapLoaded, 
  setSelectedLocation, 
  setHoveredShipment 
}) => {
  
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/clcgr62o0003c14mr8b0xg3cn',
      center: [20, 5],
      zoom: 2,
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
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
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
            'line-opacity': 0.8
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
      setupRouteAnimations(map.current, routeProps.current, animationFrameRef);
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

  return null;
};

export default MapContainer;
