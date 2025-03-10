
import React from 'react';

const MapOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-50 opacity-5" />
      
      {/* Edge highlights */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-palette-mint/30 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-palette-mint/30 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-palette-mint/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-palette-mint/30 to-transparent" />
      
      {/* Scanner effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-[2px] bg-palette-mint/20 animate-scanner" />
      </div>
    </div>
  );
};

export default MapOverlay;
