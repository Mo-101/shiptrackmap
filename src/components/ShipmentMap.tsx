
import React, { useState } from 'react';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import MapHUD from './MapHUD';
import MapAnimations from './MapAnimations';
import MapContainer from './map/MapContainer';
import MapEvents from './map/MapEvents';
import { initializeShipmentLayers, updateShipmentData } from '../utils/mapUtils';
import mapboxgl from 'mapbox-gl';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = (loadedMap: mapboxgl.Map) => {
    initializeShipmentLayers(loadedMap);
    setMap(loadedMap);
    setMapLoaded(true);
  };

  // Update map data when shipments or active shipment changes
  React.useEffect(() => {
    if (!mapLoaded || !map?.isStyleLoaded()) return;
    updateShipmentData(map, shipments, activeShipment);
  }, [shipments, activeShipment, mapLoaded, map]);

  return (
    <div className="relative w-full h-full">
      <MapContainer onMapLoad={handleMapLoad} />
      
      <MapEvents
        map={map}
        shipments={shipments}
        onLocationSelect={setSelectedLocation}
        onShipmentHover={setHoveredShipment}
      />
      
      {/* Pass required routeProps to MapAnimations */}
      {map && <MapAnimations.createLineAnimation map={map} />}
      
      <MapHUD shipments={shipments} />
      
      {hoveredShipment && (
        <ShipmentTooltip shipment={hoveredShipment} />
      )}
      
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
