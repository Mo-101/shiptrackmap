
import React from 'react';
import { Activity } from 'lucide-react';
import { Shipment } from '@/types/shipment';

interface StatusPanelProps {
  totalByStatus: {
    inTransit: number;
    delivered: number;
    delayed: number;
  };
  totalShipments: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ totalByStatus, totalShipments }) => {
  return (
    <div className="absolute top-24 left-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden lg:block">
      <div className="text-xs text-accent font-mono mb-2 flex items-center gap-2">
        <Activity size={14} />
        <span>SHIPMENT STATUS</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-amber-400 text-lg font-bold">{totalByStatus.inTransit}</span>
          <div className="w-full h-1 bg-amber-400/30 mt-1 rounded-full">
            <div className="h-full bg-amber-400 rounded-full" style={{width: `${(totalByStatus.inTransit / totalShipments) * 100}%`}}></div>
          </div>
          <span className="text-[10px] text-white/60 mt-1">IN TRANSIT</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-green-400 text-lg font-bold">{totalByStatus.delivered}</span>
          <div className="w-full h-1 bg-green-400/30 mt-1 rounded-full">
            <div className="h-full bg-green-400 rounded-full" style={{width: `${(totalByStatus.delivered / totalShipments) * 100}%`}}></div>
          </div>
          <span className="text-[10px] text-white/60 mt-1">DELIVERED</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-red-400 text-lg font-bold">{totalByStatus.delayed}</span>
          <div className="w-full h-1 bg-red-400/30 mt-1 rounded-full">
            <div className="h-full bg-red-400 rounded-full" style={{width: `${(totalByStatus.delayed / totalShipments) * 100}%`}}></div>
          </div>
          <span className="text-[10px] text-white/60 mt-1">DELAYED</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
