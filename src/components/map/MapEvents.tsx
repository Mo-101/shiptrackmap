
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../../types/shipment';

interface MapEventsProps {
  map: mapboxgl.Map | null;
  shipments: Shipment[];
  onLocationSelect: (location: [number, number]) => void;
  onShipmentHover: (shipment: Shipment | null) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({
  map,
  shipments,
  onLocationSelect,
  onShipmentHover,
}) => {
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
    };

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const shipmentId = e.features[0].properties?.shipmentId;
        const foundShipment = shipments.find(s => s.id === shipmentId);
        if (foundShipment) {
          onShipmentHover(foundShipment);
          const canvas = map.getCanvas();
          if (canvas) {
            canvas.style.cursor = 'pointer';
          }
        }
      }
    };

    const handleMouseLeave = () => {
      onShipmentHover(null);
      const canvas = map.getCanvas();
      if (canvas) {
        canvas.style.cursor = '';
      }
    };

    map.on('click', handleClick);

    ['ship', 'charter', 'truck'].forEach(type => {
      map.on('mousemove', `routes-${type}`, handleMouseMove);
      map.on('mouseleave', `routes-${type}`, handleMouseLeave);
    });

    return () => {
      map.off('click', handleClick);
      ['ship', 'charter', 'truck'].forEach(type => {
        map.off('mousemove', `routes-${type}`, handleMouseMove);
        map.off('mouseleave', `routes-${type}`, handleMouseLeave);
      });
    };
  }, [map, shipments, onLocationSelect, onShipmentHover]);

  return null;
};

export default MapEvents;
