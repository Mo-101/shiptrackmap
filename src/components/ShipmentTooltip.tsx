
import React from 'react';
import { Shipment } from '../types/shipment';
import { Ship, Plane, Clock, Package, Truck } from 'lucide-react';

interface ShipmentTooltipProps {
  shipment: Shipment;
}

const ShipmentTooltip: React.FC<ShipmentTooltipProps> = ({ shipment }) => {
  // Get the appropriate icon and color based on shipment type
  const getShipmentTypeInfo = (type: string) => {
    switch(type) {
      case 'ship':
        return { icon: <Ship size={18} />, color: 'text-palette-teal', label: 'Sea Freight' };
      case 'charter':
        return { icon: <Plane size={18} />, color: 'text-palette-mint', label: 'Air Freight' };
      case 'truck':
        return { icon: <Truck size={18} />, color: 'text-palette-sand', label: 'Ground Transport' };
      default:
        return { icon: <Package size={18} />, color: 'text-palette-sage', label: 'Unspecified' };
    }
  };

  const typeInfo = getShipmentTypeInfo(shipment.type);

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-palette-darkblue/80 backdrop-blur-md text-white p-4 rounded-lg shadow-xl animate-fade-in w-72 border border-palette-teal/30">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-palette-darkblue/80 border-t border-l border-palette-teal/30"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 mb-2">
          <span className={typeInfo.color}>
            {typeInfo.icon}
          </span>
          <h3 className="text-lg font-semibold text-white">{shipment.name}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          shipment.status === 'in-transit' 
            ? 'bg-amber-500/20 text-amber-300' 
            : shipment.status === 'delivered' 
              ? 'bg-green-500/20 text-green-300'
              : 'bg-red-500/20 text-red-300'
        }`}>
          {shipment.status}
        </span>
      </div>
      
      <div className="text-sm text-palette-mint mb-1">{typeInfo.label}</div>
      
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
          <Clock className="w-3 h-3 text-palette-mint" />
          <span className="text-xs text-palette-mint">{shipment.eta}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Package className="w-3 h-3 text-palette-teal" />
          <span className="text-xs text-palette-teal">{shipment.itemCategory}</span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -z-10 bottom-0 right-0 w-16 h-16 rounded-full bg-palette-teal/10 animate-pulse-opacity"></div>
    </div>
  );
};

export default ShipmentTooltip;
