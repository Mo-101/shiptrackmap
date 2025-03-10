
import React from 'react';
import DigitalClock from './DigitalClock';

const TimePanel: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 hidden md:block">
      <div className="text-xs text-white/60 font-mono mb-1">SYSTEM TIME</div>
      <DigitalClock />
    </div>
  );
};

export default TimePanel;
