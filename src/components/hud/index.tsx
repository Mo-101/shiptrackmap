
import React from 'react';
import { Shipment } from '../../types/shipment';
import EmergencyResponsePanel from './EmergencyResponsePanel';
import DigitalClock from './DigitalClock';
import StatusPanel from './StatusPanel';
import SystemStatus from './SystemStatus';
import TimePanel from './TimePanel';
import RouteLegend from './RouteLegend';
import CompassOverlay from './CompassOverlay';
import GridOverlay from './GridOverlay';

interface MapHUDProps {
  shipments: Shipment[];
}

const MapHUD: React.FC<MapHUDProps> = ({ shipments }) => {
  return (
    <div className="relative h-full w-full">
      {/* Grid background */}
      <GridOverlay />
      
      {/* Center compass */}
      <CompassOverlay />
      
      {/* Top-right panels */}
      <div className="absolute top-16 right-4 z-20 pointer-events-auto">
        <TimePanel />
        <StatusPanel shipments={shipments} />
        <SystemStatus />
      </div>
      
      {/* Bottom-right panels */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <RouteLegend />
        <EmergencyResponsePanel />
      </div>
      
      {/* Bottom-left clock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <DigitalClock />
      </div>
      
      {/* Scanner line effect */}
      <div className="scanner-line top-1/3 z-10 opacity-20"></div>
    </div>
  );
};

export default MapHUD;
export {
  EmergencyResponsePanel,
  DigitalClock,
  StatusPanel,
  SystemStatus,
  TimePanel,
  RouteLegend,
  CompassOverlay,
  GridOverlay
};
