
import React from 'react';

const GridOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,243,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(79,243,248,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/20"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent/20"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent/20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/20"></div>
      
      {/* Edge indicators */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent"></div>
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-accent/15 to-transparent"></div>
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-accent/15 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent"></div>
    </div>
  );
};

export default GridOverlay;
