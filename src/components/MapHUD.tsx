
import React from 'react';
import { Shipment } from '../types/shipment';

interface MapHUDProps {
  shipments: Shipment[];
}

const MapHUD: React.FC<MapHUDProps> = ({ shipments }) => {
  return (
    <>
      {/* Sci-fi overlay elements */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-palette-darkblue/40 to-transparent">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
        <div className="absolute inset-y-0 left-0 w-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-palette-mint/30 shadow-lg shadow-palette-mint/20"></div>
      </div>
      
      {/* Scanner line effect */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-palette-mint/50 animate-scanner pointer-events-none"></div>
      
      {/* Info panel */}
      <div className="absolute top-4 right-4 bg-palette-blue/80 backdrop-blur-md p-3 rounded-md border border-palette-teal/30 shadow-lg shadow-palette-mint/10 hidden md:block">
        <div className="text-xs text-palette-mint font-mono mb-1 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-palette-mint animate-blink"></span>
          SHIPMENT TRACKING SYSTEM v2.0
        </div>
        <div className="text-xs text-white/80 font-mono">
          ACTIVE ROUTES: <span className="text-palette-mint">{shipments.length}</span> | 
          SEA: <span className="text-palette-teal">{shipments.filter(s => s.type === 'ship').length}</span> | 
          AIR: <span className="text-palette-mint">{shipments.filter(s => s.type === 'charter').length}</span> | 
          GROUND: <span className="text-palette-sand">{shipments.filter(s => s.type === 'truck').length}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-palette-blue/80 backdrop-blur-md p-3 rounded-md border border-palette-teal/30 shadow-lg shadow-palette-mint/10 text-xs font-mono hidden sm:block">
        <div className="text-white/80 mb-2">ROUTE TYPES:</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-palette-teal rounded"></span>
            <span className="text-palette-teal">SEA FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-palette-mint rounded"></span>
            <span className="text-palette-mint">AIR FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-palette-sand rounded"></span>
            <span className="text-palette-sand">GROUND TRANSPORT</span>
          </div>
        </div>
      </div>
      
      {/* Time indicator */}
      <div className="absolute top-4 left-4 bg-palette-blue/80 backdrop-blur-md p-3 rounded-md border border-palette-teal/30 shadow-lg shadow-palette-mint/10 hidden md:block">
        <div className="text-xs text-palette-mint font-mono animate-pulse-opacity">
          {new Date().toLocaleTimeString()} UTC
        </div>
      </div>
    </>
  );
};

export default MapHUD;
