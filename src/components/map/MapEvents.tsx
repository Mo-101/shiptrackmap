
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../../types/shipment';
import { toast } from '@/components/ui/use-toast';

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
      // Check if we clicked on a route or point
      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          'routes-ship', 'routes-charter', 'routes-truck',
          'points'
        ]
      });
      
      if (features.length > 0) {
        // If we clicked on a shipment feature, find the related shipment
        const shipmentId = features[0].properties?.shipmentId;
        if (shipmentId) {
          const clickedShipment = shipments.find(s => s.id === shipmentId);
          if (clickedShipment) {
            toast({
              title: `Shipment Selected: ${clickedShipment.id}`,
              description: `Type: ${clickedShipment.type} • Status: ${clickedShipment.status}`,
              duration: 3000,
            });
          }
        }
      } else {
        // If we clicked on the map itself (not a feature), select the location for weather
        onLocationSelect([e.lngLat.lng, e.lngLat.lat]);
      }
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

    // Set up interactivity for all route and point layers
    ['ship', 'charter', 'truck'].forEach(type => {
      map.on('mousemove', `routes-${type}`, handleMouseMove);
      map.on('mouseleave', `routes-${type}`, handleMouseLeave);
    });
    
    map.on('mousemove', 'points', handleMouseMove);
    map.on('mouseleave', 'points', handleMouseLeave);

    return () => {
      map.off('click', handleClick);
      ['ship', 'charter', 'truck'].forEach(type => {
        map.off('mousemove', `routes-${type}`, handleMouseMove);
        map.off('mouseleave', `routes-${type}`, handleMouseLeave);
      });
      map.off('mousemove', 'points', handleMouseMove);
      map.off('mouseleave', 'points', handleMouseLeave);
    };
  }, [map, shipments, onLocationSelect, onShipmentHover]);

  return null;
};

export default MapEvents;
