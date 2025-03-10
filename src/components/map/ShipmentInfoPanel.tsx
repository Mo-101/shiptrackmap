
import React from 'react';
import { Shipment } from '../../types/shipment';

interface ShipmentInfoPanelProps {
  activeShipment: Shipment;
  viewShipmentAnimation: (shipment: Shipment) => void;
  activeAnimation: string | null;
}

const ShipmentInfoPanel: React.FC<ShipmentInfoPanelProps> = ({
  activeShipment,
  viewShipmentAnimation,
  activeAnimation,
}) => {
  return (
    <div className="absolute bottom-4 left-4 z-30 bg-primary/90 p-3 rounded-md border border-accent/30 text-white max-w-xs pointer-events-auto">
      <div className="flex items-center">
        <h3 className="text-accent font-semibold">Supply Chain Pulse™</h3>
        <button 
          onClick={() => viewShipmentAnimation(activeShipment)}
          className="ml-2 text-xs px-2 py-0.5 bg-accent/20 rounded hover:bg-accent/30 transition-colors"
        >
          Animate
        </button>
      </div>
      <p className="text-sm">{activeShipment.id}</p>
      <div className="flex justify-between text-xs mt-1">
        <span>{activeShipment.origin.name}</span>
        <span>→</span>
        <span>{activeShipment.destination.name}</span>
      </div>
      <div className="mt-2 text-xs">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={`font-medium ${
            activeShipment.status === 'in-transit' ? 'text-accent' :
            activeShipment.status === 'delivered' ? 'text-green-400' : 'text-yellow-300'
          }`}>
            {activeShipment.status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>ETA:</span>
          <span>{activeShipment.eta}</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentInfoPanel;
