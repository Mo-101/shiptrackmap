
import React from 'react';
import { Activity, MapPin, BarChart2, AlertTriangle } from 'lucide-react';
import { Shipment } from '@/types/shipment';

interface MapHUDProps {
  shipments: Shipment[];
  activeShipments: number;
  delayedShipments: number;
}

import { useEffect, useState } from 'react';
import { useHistoricalShipments } from '@/hooks/useHistoricalShipments';

const MapHUD: React.FC<MapHUDProps> = ({ shipments, activeShipments, delayedShipments }) => {
  const historicalShipments = useHistoricalShipments();
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (!historicalShipments.length || !shipments.length) {
      setAccuracy(null);
      return;
    }
    // Compare by request_reference or id if available
    let matchCount = 0;
    shipments.forEach(live => {
      const found = historicalShipments.find(
        hist => (hist.request_reference && live.request_reference && hist.request_reference === live.request_reference) ||
                 (hist.id && live.id && hist.id === live.id)
      );
      if (found) matchCount++;
    });
    setAccuracy(Math.round((matchCount / shipments.length) * 100));
  }, [shipments, historicalShipments]);

  return (
    <div className="absolute top-4 left-4 space-y-4">
      {/* Status Panel */}
      <div className="bg-palette-darkblue/90 backdrop-blur-sm p-4 rounded-lg border border-palette-mint/30 shadow-lg shadow-palette-mint/10">
        {/* Data Accuracy Panel */}
        <div className="mb-2 p-2 rounded bg-palette-blue/20 border border-palette-mint/10">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-palette-mint" />
            <span className="text-xs font-bold text-palette-mint">Data Accuracy</span>
          </div>
          <div className="text-xs text-white/80 mt-1">
            {accuracy !== null ? (
              <span>Live vs. Base Data: <span className="font-bold text-palette-mint">{accuracy}%</span> match</span>
            ) : (
              <span>Comparing data...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-palette-mint mb-2">
          <Activity size={16} className="animate-pulse" />
          <span className="text-xs font-mono">SYSTEM STATUS: ACTIVE</span>
        </div>
        
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">Total Shipments:</span>
            <span className="text-palette-mint">{shipments.length}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">Active Tracking:</span>
            <span className="text-palette-teal">{activeShipments}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">Delayed:</span>
            <span className="text-red-400">{delayedShipments}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-2">
        <div className="bg-palette-darkblue/90 backdrop-blur-sm p-2 rounded-lg border border-palette-mint/30 shadow-lg shadow-palette-mint/10">
          <MapPin size={16} className="text-palette-mint" />
        </div>
        <div className="bg-palette-darkblue/90 backdrop-blur-sm p-2 rounded-lg border border-palette-mint/30 shadow-lg shadow-palette-mint/10">
          <BarChart2 size={16} className="text-palette-teal" />
        </div>
        <div className="bg-palette-darkblue/90 backdrop-blur-sm p-2 rounded-lg border border-palette-mint/30 shadow-lg shadow-palette-mint/10">
          <AlertTriangle size={16} className="text-palette-sand" />
        </div>
      </div>
    </div>
  );
};

export default MapHUD;
