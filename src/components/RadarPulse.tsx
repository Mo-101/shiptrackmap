
import React from 'react';

const RadarPulse = () => {
  return (
    <div className="relative">
      <div className="absolute w-4 h-4">
        <div className="absolute w-full h-full bg-palette-mint rounded-full animate-ping opacity-75"></div>
        <div className="absolute w-full h-full bg-palette-mint rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default RadarPulse;
