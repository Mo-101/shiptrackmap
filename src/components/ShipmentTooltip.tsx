
import React from 'react';
import { Shipment } from '../types/shipment';
import { Ship, Plane, Clock, Package } from 'lucide-react';

interface ShipmentTooltipProps {
  shipment: Shipment;
}

const ShipmentTooltip: React.FC<ShipmentTooltipProps> = ({ shipment }) => {
  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md text-white p-4 rounded-lg shadow-xl animate-fade-in w-72 border border-cyan-500/20">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-black/80 border-t border-l border-cyan-500/20"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 mb-2">
          {shipment.type === 'ship' ? (
            <Ship className="text-ocean-dark" size={18} />
          ) : (
            <Plane className="text-primary" size={18} />
          )}
          <h3 className="text-lg font-semibold text-white">{shipment.name}</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-ocean/20 text-ocean-light">
          {shipment.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">From</span>
          <span className="text-sm">{shipment.origin.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">To</span>
          <span className="text-sm">{shipment.destination.name}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-ocean-light" />
          <span className="text-xs text-ocean-light">{shipment.eta}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Package className="w-3 h-3 text-ocean-light" />
          <span className="text-xs text-ocean-light">{shipment.itemCategory}</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTooltip;
