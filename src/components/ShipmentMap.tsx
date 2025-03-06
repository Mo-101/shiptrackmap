
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import 'mapbox-gl/dist/mapbox-gl.css'; // Added CSS import for Mapbox

// Updated to a valid public token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2xsa2JrY2V3MDloYzNkbW16cmVsbTd4OCJ9.7G9G6QyRdHPXgwj3ZZ4MYw';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

    map.current.on('load', () => {
      setMapLoaded(true);
      
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
          visibility: 'visible'
        },
        paint: {
          'line-color': ['match', ['get', 'active'], true, '#00A3E0', '#666666'],
          'line-width': ['match', ['get', 'active'], true, 4, 2],
          'line-opacity': 0.8,
          'line-dasharray': [2, 1]
        },
      });

      // Add click event
      map.current.on('click', (e) => {
        setSelectedLocation([e.lngLat.lng, e.lngLat.lat]);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current?.isStyleLoaded()) return;

    const features = shipments.map((shipment) => {
      const start = shipment.origin.coordinates;
      const end = shipment.destination.coordinates;
      
      const line = turf.greatCircle(
        turf.point(start),
        turf.point(end),
        { 
          properties: { active: activeShipment?.id === shipment.id },
          npoints: 100
        }
      );

      return line;
    });

    (map.current.getSource('routes') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features,
    });
  }, [shipments, activeShipment, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
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
