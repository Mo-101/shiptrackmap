
import React from 'react';
import { Shipment } from '../types/shipment';
import { Activity, AlertCircle, FileBox, Map, Shield } from 'lucide-react';

interface MapHUDProps {
  shipments: Shipment[];
}

// New component to display emergency response data
const EmergencyResponsePanel = () => {
  // This data comes from the table provided by the user
  const emergencyData = [
    { country: "Malawi", lat: -13.254308, lng: 34.301525, type: "Cholera" },
    { country: "Malawi", lat: -13.254308, lng: 34.301525, type: "Cyclone, Flooding & Landslide" },
    { country: "Chad", lat: 15.454166, lng: 18.732207, type: "Civil unrest" },
    { country: "Kenya", lat: -0.023559, lng: 37.906193, type: "Cholera" },
    { country: "Kenya", lat: -0.023559, lng: 37.906193, type: "Drought and Food Insecurity" },
    { country: "Uganda", lat: 1.282173, lng: 32.343718, type: "Ebola" },
    { country: "DRC", lat: -3.338630, lng: 23.419828, type: "Mpox" },
  ];

  return (
    <div className="absolute bottom-4 left-4 glass-panel rounded-md p-3 text-xs max-w-xs max-h-48 overflow-y-auto scrollbar-hide hidden md:block">
      <div className="text-secondary font-semibold mb-2 flex items-center gap-1">
        <AlertCircle size={14} />
        <span>EMERGENCY RESPONSE</span>
      </div>
      <div className="space-y-1">
        {emergencyData.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-white/80">
            <div className={`h-2 w-2 rounded-full ${
              item.type.includes("Cholera") ? "bg-red-400" :
              item.type.includes("Ebola") ? "bg-orange-400" :
              item.type.includes("Mpox") ? "bg-yellow-400" :
              item.type.includes("COVID") ? "bg-purple-400" :
              item.type.includes("Flood") ? "bg-blue-400" :
              "bg-gray-400"
            }`}></div>
            <span className="truncate">{item.country}: {item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      {/* Sci-fi overlay elements */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/30 to-transparent">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-secondary/30"></div>
        <div className="absolute inset-y-0 left-0 w-[1px] bg-secondary/30"></div>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-secondary/30"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-secondary/30"></div>
      </div>
      
      {/* Scanner line effect */}
      <div className="absolute inset-x-0 top-0 scanner-line"></div>
      
      {/* Info panel */}
      <div className="absolute top-4 right-4 glass-panel p-3 rounded-md shadow-lg hidden md:block">
        <div className="text-xs text-accent font-mono mb-1 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          SHIPMENT TRACKING SYSTEM v2.0
        </div>
        <div className="text-xs text-white/80 font-mono">
          ACTIVE ROUTES: <span className="text-accent">{shipments.length}</span> | 
          SEA: <span className="text-secondary">{totalByType.ship}</span> | 
          AIR: <span className="text-accent">{totalByType.charter}</span> | 
          GROUND: <span className="text-amber-400">{totalByType.truck}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 glass-panel p-3 rounded-md shadow-lg text-xs font-mono hidden sm:block">
        <div className="text-white/80 mb-2">ROUTE TYPES:</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-secondary rounded"></span>
            <span className="text-secondary">SEA FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-accent rounded"></span>
            <span className="text-accent">AIR FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-amber-400 rounded"></span>
            <span className="text-amber-400">GROUND TRANSPORT</span>
          </div>
        </div>
      </div>
      
      {/* Time indicator */}
      <div className="absolute top-4 left-4 glass-panel p-3 rounded-md shadow-lg hidden md:block">
        <div className="text-xs text-accent font-mono animate-pulse-opacity">
          {new Date().toLocaleTimeString()} UTC
        </div>
      </div>
      
      {/* Status display */}
      <div className="absolute top-16 left-4 glass-panel p-3 rounded-md shadow-lg hidden lg:block">
        <div className="text-xs text-secondary font-mono mb-1 flex items-center gap-2">
          <Activity size={14} />
          <span>SHIPMENT STATUS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-amber-400 text-lg font-bold">{totalByStatus.inTransit}</span>
            <span className="text-[10px] text-white/60">IN TRANSIT</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-green-400 text-lg font-bold">{totalByStatus.delivered}</span>
            <span className="text-[10px] text-white/60">DELIVERED</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-400 text-lg font-bold">{totalByStatus.delayed}</span>
            <span className="text-[10px] text-white/60">DELAYED</span>
          </div>
        </div>
      </div>
      
      {/* Emergency response panel */}
      <EmergencyResponsePanel />
    </>
  );
};

export default MapHUD;
