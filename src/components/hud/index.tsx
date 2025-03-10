
import React from 'react';
import GridOverlay from './GridOverlay';
import CompassOverlay from './CompassOverlay';
import { Shipment } from '../../types/shipment';

interface MapHUDProps {
  shipments: Shipment[];
}

export const MapHUD: React.FC<MapHUDProps> = ({ shipments }) => {
  return (
    <div className="relative h-full w-full pointer-events-none">
      {/* Grid background - reduced opacity */}
      <GridOverlay opacity={0.05} />
      
      {/* Compass overlay - reduced opacity */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <CompassOverlay opacity={0.4} />
      </div>
    </div>
  );
};

// Export other components
export {
  GridOverlay,
  CompassOverlay
};
