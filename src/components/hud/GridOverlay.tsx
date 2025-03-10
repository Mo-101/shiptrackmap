
import React from 'react';

interface GridOverlayProps {
  opacity?: number;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ opacity = 0.05 }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div 
        className="w-full h-full bg-repeat" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%234FF2F8\' fill-opacity=\'" + opacity + "\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3Cpath d=\'M0 0h20v1H0zM0 19h20v1H0zM0 0v20h1V0zM19 0v20h1V0z\'/%3E%3C/g%3E%3C/svg%3E")',
          opacity: opacity 
        }}
      />
    </div>
  );
};

export default GridOverlay;
