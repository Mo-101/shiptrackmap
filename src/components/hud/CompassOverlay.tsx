
import React from 'react';

const CompassOverlay: React.FC = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none opacity-10 z-5">
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
  );
};

export default CompassOverlay;
