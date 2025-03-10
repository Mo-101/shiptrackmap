
import React from 'react';

interface CompassOverlayProps {
  opacity?: number;
}

const CompassOverlay: React.FC<CompassOverlayProps> = ({ opacity = 0.6 }) => {
  return (
    <div className="relative pointer-events-none" style={{ opacity }}>
      <div className="border-2 border-accent/30 w-32 h-32 rounded-full flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border border-accent/20"></div>
        <div className="absolute w-16 h-16 rounded-full border border-accent/10"></div>
        
        {/* Cardinal directions */}
        <div className="absolute top-2 w-full text-center text-accent text-xs font-bold">N</div>
        <div className="absolute bottom-2 w-full text-center text-accent text-xs font-bold">S</div>
        <div className="absolute right-2 h-full flex items-center text-accent text-xs font-bold">E</div>
        <div className="absolute left-2 h-full flex items-center text-accent text-xs font-bold">W</div>
        
        {/* Compass arrow */}
        <div className="relative w-2 h-16">
          <div className="absolute -top-1 w-full flex justify-center">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-accent"></div>
          </div>
          <div className="absolute w-0.5 h-full bg-accent/50 left-1/2 transform -translate-x-1/2"></div>
          <div className="absolute -bottom-1 w-full flex justify-center">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompassOverlay;
