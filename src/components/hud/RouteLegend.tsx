
import React from 'react';
import { Map } from 'lucide-react';

const RouteLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 glass-panel p-3 rounded-md shadow-lg border border-accent/20 text-xs font-mono hidden sm:block">
      <div className="text-accent mb-2 flex items-center gap-2">
        <Map size={14} />
        <span className="uppercase">Route Types</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 bg-secondary rounded animate-pulse"></span>
          <span className="text-secondary">SEA FREIGHT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 bg-accent rounded animate-pulse"></span>
          <span className="text-accent">AIR FREIGHT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1 w-8 bg-amber-400 rounded animate-pulse"></span>
          <span className="text-amber-400">GROUND TRANSPORT</span>
        </div>
      </div>
    </div>
  );
};

export default RouteLegend;
