
import React from 'react';
import { Shipment } from '../types/shipment';
import {
  EmergencyResponsePanel,
  StatusPanel,
  SystemStatus,
  TimePanel,
  RouteLegend,
  CompassOverlay,
  GridOverlay
} from './hud';

interface MapHUDProps {
  shipments: Shipment[];
}

const MapHUD: React.FC<MapHUDProps> = ({ shipments }) => {
  // Calculate summary statistics from shipments
  const totalByType = {
    ship: shipments.filter(s => s.type === 'ship').length,
    charter: shipments.filter(s => s.type === 'charter').length,
    truck: shipments.filter(s => s.type === 'truck').length
  };
  
  const totalByStatus = {
    inTransit: shipments.filter(s => s.status === 'in-transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    delayed: shipments.filter(s => s.status === 'delayed').length
  };

  return (
    <>
      <GridOverlay />
      <SystemStatus totalByType={totalByType} shipments={shipments} />
      <RouteLegend />
      <TimePanel />
      <StatusPanel totalByStatus={totalByStatus} totalShipments={shipments.length} />
      <EmergencyResponsePanel />
      <CompassOverlay />
    </>
  );
};

export default MapHUD;
