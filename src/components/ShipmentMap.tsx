
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './MapHUD';
import MapAnimations from './MapAnimations';
import { 
  MAPBOX_ACCESS_TOKEN, 
  MAPBOX_STYLE, 
  MAP_INITIAL_CONFIG, 
  CustomLayerProps,
  setupMapEffects,
  initializeShipmentLayers,
  updateShipmentData
} from '../utils/mapUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

// Update to use the provided token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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
  
  // Custom properties for different route types
  const routeProps = useRef<Record<string, CustomLayerProps>>({
    ship: { dashOffset: 0, active: false, type: 'ship' },
    charter: { dashOffset: 0, active: false, type: 'charter' },
    truck: { dashOffset: 0, active: false, type: 'truck' }
  });
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: MAP_INITIAL_CONFIG.center,
      zoom: MAP_INITIAL_CONFIG.zoom,
      pitch: MAP_INITIAL_CONFIG.pitch,
      projection: MAP_INITIAL_CONFIG.projection
    });

    // Add 3D terrain effect
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      // Setup fog and sky effects
      setupMapEffects(map.current);
      
      // Initialize layers for shipments
      initializeShipmentLayers(map.current);
      
      setMapLoaded(true);
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
      map.current?.remove();
    };
  }, []);

  // Update map data when shipments or active shipment changes
  useEffect(() => {
    if (!mapLoaded || !map.current?.isStyleLoaded()) return;
    
    updateShipmentData(map.current, shipments, activeShipment);
  }, [shipments, activeShipment, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map animations component */}
      <MapAnimations 
        map={map.current} 
        routeProps={routeProps.current} 
      />
      
      {/* HUD elements */}
      <MapHUD shipments={shipments} />
      
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
    </div>
  );
};

export default ShipmentMap;
