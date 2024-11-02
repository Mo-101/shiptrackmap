import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Shipment } from '../types/shipment';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Changed to dark theme
      center: [20, 5], // Centered on Africa
      zoom: 3,
      pitch: 45,
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
          'line-color': ['match', ['get', 'active'], true, '#00A3E0', '#666666'],
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
  }, [shipments, activeShipment]);

  const createArcCoordinates = (start: [number, number], end: [number, number]) => {
    const points = 100;
    const arc = [];
    
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      
      const lat = start[1] * (1 - t) + end[1] * t;
      const lon = start[0] * (1 - t) + end[0] * t;
      
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