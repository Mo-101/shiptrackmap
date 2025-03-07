
import React from 'react';
import { Shipment } from '../types/shipment';
import { Ship, Plane, Clock, Package, Truck, AlertTriangle, Calendar, GitCommitHorizontal } from 'lucide-react';

interface ShipmentTooltipProps {
  shipment: Shipment;
}

const ShipmentTooltip: React.FC<ShipmentTooltipProps> = ({ shipment }) => {
  // Get the appropriate icon and color based on shipment type
  const getShipmentTypeInfo = (type: string) => {
    switch(type) {
      case 'ship':
        return { icon: <Ship size={18} />, color: 'text-palette-teal', label: 'Sea Freight', bgColor: 'bg-palette-teal/20' };
      case 'charter':
        return { icon: <Plane size={18} />, color: 'text-palette-mint', label: 'Air Freight', bgColor: 'bg-palette-mint/20' };
      case 'truck':
        return { icon: <Truck size={18} />, color: 'text-palette-sand', label: 'Ground Transport', bgColor: 'bg-palette-sand/20' };
      default:
        return { icon: <Package size={18} />, color: 'text-palette-sage', label: 'Unspecified', bgColor: 'bg-palette-sage/20' };
    }
  };

  const typeInfo = getShipmentTypeInfo(shipment.type);
  
  // Progress calculation (simplified for demo)
  const progressPercentage = Math.random() * 100;

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-palette-darkblue/90 backdrop-blur-md text-white p-4 rounded-lg shadow-xl animate-fade-in w-80 border border-palette-teal/30">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-palette-darkblue/90 border-t border-l border-palette-teal/30"></div>
      
      {/* Decorative scanner line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-palette-mint/50 animate-scanner rounded-t-lg"></div>
      
      {/* Header with status indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`p-1.5 rounded-full ${typeInfo.bgColor} ${typeInfo.color} animate-pulse-opacity`}>
            {typeInfo.icon}
          </span>
          <h3 className="text-lg font-semibold text-white">{shipment.name}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
          shipment.status === 'in-transit' 
            ? 'bg-amber-500/20 text-amber-300' 
            : shipment.status === 'delivered' 
              ? 'bg-green-500/20 text-green-300'
              : 'bg-red-500/20 text-red-300'
        }`}>
          {shipment.status === 'in-transit' && <GitCommitHorizontal size={10} className="animate-pulse" />}
          {shipment.status === 'delivered' && <Package size={10} />}
          {shipment.status === 'delayed' && <AlertTriangle size={10} />}
          {shipment.status}
        </span>
      </div>
      
      {/* Shipment type indicator */}
      <div className={`text-sm ${typeInfo.color} mb-3 flex items-center gap-1.5`}>
        {typeInfo.icon}
        <span>{typeInfo.label}</span>
        <div className="ml-auto text-white/60 text-xs font-mono">ID: {shipment.id}</div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 w-full bg-palette-blue/40 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              shipment.type === 'ship' 
                ? 'bg-palette-teal' 
                : shipment.type === 'charter' 
                  ? 'bg-palette-mint' 
                  : 'bg-palette-sand'
            }`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{shipment.origin.name}</span>
          <span>{Math.round(progressPercentage)}%</span>
          <span>{shipment.destination.name}</span>
        </div>
      </div>
      
      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-palette-blue/30 rounded-md border border-palette-teal/10">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">From</span>
          <span className="text-sm text-palette-mint">{shipment.origin.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">To</span>
          <span className="text-sm text-palette-mint">{shipment.destination.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Country</span>
          <span className="text-sm">{shipment.destination.country}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Category</span>
          <span className="text-sm">{shipment.itemCategory}</span>
        </div>
      </div>
      
      {/* Footer with time estimation */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-palette-mint" />
          <span className="text-xs text-palette-mint">{shipment.eta}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-palette-teal" />
          <span className="text-xs text-palette-teal">ETA</span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-bl-lg bg-gradient-radial from-palette-teal/5 to-transparent animate-pulse-opacity z-[-1]"></div>
      
      {/* Tech grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-50 opacity-10 z-[-1] rounded-lg"></div>
    </div>
  );
};

export default ShipmentTooltip;
