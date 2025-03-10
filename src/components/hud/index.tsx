
import React from 'react';
import GridOverlay from './GridOverlay';
import CompassOverlay from './CompassOverlay';
import EmergencyResponsePanel from './EmergencyResponsePanel';
import DigitalClock from './DigitalClock';
import ShipmentStatusPanel from './ShipmentStatusPanel';
import { Shipment } from '../../types/shipment';

interface MapHUDProps {
  shipments: Shipment[];
}

// Export as named export for proper importing
export const MapHUD: React.FC<MapHUDProps> = ({ shipments }) => {
  return (
    <div className="relative h-full w-full pointer-events-none">
      {/* Grid background - reduced opacity and made transparent */}
      <GridOverlay opacity={0.1} />
      
      {/* Digital display elements */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-3">
        <DigitalClock />
      </div>
      
      {/* Compass overlay - reduced opacity */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <CompassOverlay opacity={0.6} />
      </div>
      
      {/* Emergency response panel */}
      <div className="absolute top-4 right-4 z-20">
        <EmergencyResponsePanel />
      </div>
      
      {/* Shipment status panel */}
      <div className="absolute top-16 right-4 z-20">
        <ShipmentStatusPanel shipments={shipments} />
      </div>
    </div>
  );
};

// Export other components
export {
  EmergencyResponsePanel,
  DigitalClock,
  ShipmentStatusPanel,
  GridOverlay,
  CompassOverlay
};
