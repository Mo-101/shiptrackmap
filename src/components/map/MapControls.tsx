
import React from 'react';
import { Shipment } from '../../types/shipment';
import { toast } from '@/components/ui/use-toast';

interface MapControlsProps {
  activeShipment: Shipment | undefined;
  isTracking: boolean;
  toggleTracking: () => void;
  startItineraryAnimation: () => void;
  viewShipmentAnimation: (shipment: Shipment) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  activeShipment,
  isTracking,
  toggleTracking,
  startItineraryAnimation,
  viewShipmentAnimation,
}) => {
  return (
    <>
      <div className="absolute top-4 left-4 z-30 pointer-events-auto">
        <div className="bg-primary/80 px-3 py-2 rounded-md border border-accent/30 text-white flex items-center">
          <span className="text-accent font-bold">AfriWave</span>
          <span className="ml-1 text-white font-medium">CargoLive™</span>
          <div className="ml-2 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        {activeShipment && (
          <button
            onClick={toggleTracking}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isTracking 
                ? 'bg-accent text-primary shadow-md' 
                : 'bg-primary/80 text-white hover:bg-primary'
            }`}
          >
            {isTracking ? 'CargoLive™ Active' : 'Start CargoLive™'}
          </button>
        )}
        
        <button
          onClick={startItineraryAnimation}
          className="px-4 py-2 rounded-md font-medium bg-secondary/80 text-white hover:bg-secondary transition-colors"
        >
          Animate All Routes
        </button>
      </div>
    </>
  );
};

export default MapControls;
