import React from 'react';
import { Shipment } from '../types/shipment';
import { Activity, AlertCircle, FileBox, Map, Shield, Waves, Radio, Zap, Layers } from 'lucide-react';

interface MapHUDProps {
  shipments: Shipment[];
}

// New component to display emergency response data with enhanced visuals
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
    <div className="absolute bottom-4 left-4 glass-panel cyber-border rounded-md p-3 text-xs max-w-xs max-h-48 overflow-y-auto scrollbar-hide hidden md:block">
      <div className="text-accent font-semibold mb-2 flex items-center gap-1">
        <AlertCircle size={14} className="animate-pulse" />
        <span className="terminal-text">EMERGENCY RESPONSE</span>
      </div>
      <div className="space-y-1">
        {emergencyData.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <div className={`h-2 w-2 rounded-full ${
              item.type.includes("Cholera") ? "bg-red-400 animate-pulse" :
              item.type.includes("Ebola") ? "bg-orange-400 animate-pulse" :
              item.type.includes("Mpox") ? "bg-yellow-400 animate-pulse" :
              item.type.includes("COVID") ? "bg-purple-400 animate-pulse" :
              item.type.includes("Flood") ? "bg-blue-400 animate-pulse" :
              "bg-gray-400"
            }`}></div>
            <span className="truncate">{item.country}: {item.type}</span>
          </div>
        ))}
      </div>
      {/* Futuristic data stream indicator */}
      <div className="w-full h-1 mt-2 overflow-hidden rounded-full">
        <div className="data-stream"></div>
      </div>
    </div>
  );
};

// New component for a digital clock
const DigitalClock = () => {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="font-mono text-sm">
      <span className="text-accent">{time.getUTCHours().toString().padStart(2, '0')}</span>
      <span className="text-white animate-pulse">:</span>
      <span className="text-accent">{time.getUTCMinutes().toString().padStart(2, '0')}</span>
      <span className="text-white animate-pulse">:</span>
      <span className="text-accent">{time.getUTCSeconds().toString().padStart(2, '0')}</span>
      <span className="text-white/60 ml-1">UTC</span>
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
      {/* Sci-fi overlay elements - more transparent grid pattern and subtle glowing edges */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern - more transparent */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,243,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,243,248,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Corner markers - more subtle */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent/20"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent/20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-accent/20"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-accent/20"></div>
        
        {/* Edge indicators - more transparent */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      </div>
      
      {/* Scanner line effects - more transparent */}
      <div className="absolute inset-x-0 top-1/4 scanner-line opacity-30"></div>
      <div className="absolute inset-x-0 top-2/4 scanner-line opacity-30" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-x-0 top-3/4 scanner-line opacity-30" style={{animationDelay: '4s'}}></div>
      
      {/* System status panel - top right, more transparent */}
      <div className="absolute top-4 right-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden md:block">
        <div className="text-xs text-accent font-mono mb-2 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="glitch" data-text="CARGO MONITORING SYSTEM v2.1">CARGO MONITORING SYSTEM v2.1</span>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-white/80 font-mono flex justify-between">
            <span>ACTIVE ROUTES:</span> 
            <span className="text-accent">{shipments.length}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1">
              <Waves size={12} className="text-secondary" />
              <span className="text-xs text-secondary">{totalByType.ship}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-accent" />
              <span className="text-xs text-accent">{totalByType.charter}</span>
            </div>
            <div className="flex items-center gap-1">
              <Layers size={12} className="text-amber-400" />
              <span className="text-xs text-amber-400">{totalByType.truck}</span>
            </div>
          </div>
        </div>
        
        {/* Active systems indicators */}
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="flex justify-between">
            <span className="text-[10px] text-white/60">SYSTEM</span>
            <span className="text-[10px] text-green-400">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] text-white/60">SIGNAL</span>
            <span className="text-[10px] text-green-400">86%</span>
          </div>
        </div>
      </div>
      
      {/* Legend with enhanced styling - more transparent */}
      <div className="absolute bottom-4 right-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 text-xs font-mono hidden sm:block">
        <div className="text-accent mb-2 flex items-center gap-2">
          <Map size={14} />
          <span className="uppercase">Route Types</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-secondary rounded animate-pulse"></span>
            <span className="text-secondary">SEA FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-accent rounded animate-pulse"></span>
            <span className="text-accent">AIR FREIGHT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-amber-400 rounded animate-pulse"></span>
            <span className="text-amber-400">GROUND TRANSPORT</span>
          </div>
        </div>
      </div>
      
      {/* Time indicator with digital clock - more transparent */}
      <div className="absolute top-4 left-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden md:block">
        <div className="text-xs text-white/60 font-mono mb-1">SYSTEM TIME</div>
        <DigitalClock />
      </div>
      
      {/* Status display with animated indicators - more transparent */}
      <div className="absolute top-24 left-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden lg:block">
        <div className="text-xs text-accent font-mono mb-2 flex items-center gap-2">
          <Activity size={14} />
          <span>SHIPMENT STATUS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-amber-400 text-lg font-bold">{totalByStatus.inTransit}</span>
            <div className="w-full h-1 bg-amber-400/30 mt-1 rounded-full">
              <div className="h-full bg-amber-400 rounded-full" style={{width: `${(totalByStatus.inTransit / shipments.length) * 100}%`}}></div>
            </div>
            <span className="text-[10px] text-white/60 mt-1">IN TRANSIT</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-green-400 text-lg font-bold">{totalByStatus.delivered}</span>
            <div className="w-full h-1 bg-green-400/30 mt-1 rounded-full">
              <div className="h-full bg-green-400 rounded-full" style={{width: `${(totalByStatus.delivered / shipments.length) * 100}%`}}></div>
            </div>
            <span className="text-[10px] text-white/60 mt-1">DELIVERED</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-400 text-lg font-bold">{totalByStatus.delayed}</span>
            <div className="w-full h-1 bg-red-400/30 mt-1 rounded-full">
              <div className="h-full bg-red-400 rounded-full" style={{width: `${(totalByStatus.delayed / shipments.length) * 100}%`}}></div>
            </div>
            <span className="text-[10px] text-white/60 mt-1">DELAYED</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced emergency response panel */}
      <EmergencyResponsePanel />
      
      {/* Central HUD element - subtle compass/directional indicator - very transparent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none opacity-10">
        <div className="absolute inset-0 border-2 border-accent/30 rounded-full"></div>
        <div className="absolute inset-2 border border-accent/20 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-accent/80 font-mono">AFRIWAVE</span>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-accent/80 font-mono">N</div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-[10px] text-accent/80 font-mono">E</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[10px] text-accent/80 font-mono">S</div>
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-accent/80 font-mono">W</div>
      </div>
    </>
  );
};

export default MapHUD;
