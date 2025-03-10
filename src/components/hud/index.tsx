
import React from 'react';
import { Shipment } from '../../types/shipment';
import EmergencyResponsePanel from './EmergencyResponsePanel';
import DigitalClock from './DigitalClock';
import SystemStatus from './SystemStatus';
import StatusPanel from './StatusPanel';
import RouteLegend from './RouteLegend';
import TimePanel from './TimePanel';
import GridOverlay from './GridOverlay';
import CompassOverlay from './CompassOverlay';

interface MapHUDProps {
  shipments: Shipment[];
}

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
      {/* Sci-fi overlay elements - enhanced grid pattern and glowing edges */}
      <GridOverlay />
      
      {/* Scanner line effects - made more transparent */}
      <div className="absolute inset-x-0 top-1/4 scanner-line opacity-30"></div>
      <div className="absolute inset-x-0 top-2/4 scanner-line opacity-30" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-x-0 top-3/4 scanner-line opacity-30" style={{animationDelay: '4s'}}></div>
      
      {/* System status panel - top right */}
      <div className="pointer-events-auto absolute top-24 right-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden md:block">
        <SystemStatus totalShipments={shipments.length} typeTotals={totalByType} />
      </div>
      
      {/* Legend with enhanced styling */}
      <div className="pointer-events-auto absolute bottom-4 right-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 text-xs font-mono hidden sm:block">
        <RouteLegend />
      </div>
      
      {/* Time indicator with digital clock */}
      <div className="pointer-events-auto absolute top-24 left-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden md:block">
        <TimePanel />
      </div>
      
      {/* Status display with animated indicators */}
      <div className="pointer-events-auto absolute top-44 left-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden lg:block">
        <StatusPanel totalByStatus={totalByStatus} totalShipments={shipments.length} />
      </div>
      
      {/* Enhanced emergency response panel */}
      <div className="pointer-events-auto">
        <EmergencyResponsePanel />
      </div>
      
      {/* Central HUD element - subtle compass/directional indicator */}
      <CompassOverlay />
    </>
  );
};

export default MapHUD;
