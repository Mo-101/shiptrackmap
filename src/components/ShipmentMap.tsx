import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Ship, Plane } from 'lucide-react';
import { Shipment } from '../types/shipment';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
      pitch: 30,
    });

    map.current.on('load', () => {
      map.current?.addSource('routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.current?.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['match', ['get', 'active'], true, '#0057B8', '#B0BEC5'],
          'line-width': ['match', ['get', 'active'], true, 3, 2],
          'line-opacity': 0.8,
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current?.isStyleLoaded()) return;

    const features = shipments.map((shipment) => {
      const start = shipment.origin.coordinates;
      const end = shipment.destination.coordinates;
      
      const route = {
        type: 'Feature' as const,
        properties: {
          active: activeShipment?.id === shipment.id,
          shipmentId: shipment.id,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: createArcCoordinates(start, end),
        },
      };

      return route;
    });

    (map.current.getSource('routes') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features,
    });

    setRoutes(features);
  }, [shipments, activeShipment]);

  const createArcCoordinates = (start: [number, number], end: [number, number]) => {
    const points = 100;
    const arc = [];
    
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      
      const lat = start[1] * (1 - t) + end[1] * t;
      const lon = start[0] * (1 - t) + end[0] * t;
      
      // Create the arc by adding altitude
      const altitude = Math.sin(Math.PI * t) * 
        turf.distance(turf.point(start), turf.point(end)) * 0.15;
      
      arc.push([lon, lat]);
    }
    
    return arc;
  };

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
};

export default ShipmentMap;