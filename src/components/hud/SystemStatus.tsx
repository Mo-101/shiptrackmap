
import React from 'react';
import { Waves, Zap, Layers } from 'lucide-react';
import { Shipment } from '@/types/shipment';

interface SystemStatusProps {
  totalByType: {
    ship: number;
    charter: number;
    truck: number;
  };
  shipments: Shipment[];
}

const SystemStatus: React.FC<SystemStatusProps> = ({ totalByType, shipments }) => {
  return (
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
  );
};

export default SystemStatus;
