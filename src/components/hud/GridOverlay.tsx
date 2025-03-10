
import React from 'react';

const GridOverlay: React.FC = () => {
  return (
    <>
      {/* Sci-fi overlay elements - more transparent grid pattern and subtle glowing edges */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern - more transparent */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,243,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,243,248,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Corner markers - more subtle */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent/20"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent/20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-accent/20"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-accent/20"></div>
        
        {/* Edge indicators - more transparent */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      </div>
      
      {/* Scanner line effects - more transparent */}
      <div className="absolute inset-x-0 top-1/4 scanner-line opacity-30"></div>
      <div className="absolute inset-x-0 top-2/4 scanner-line opacity-30" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-x-0 top-3/4 scanner-line opacity-30" style={{animationDelay: '4s'}}></div>
    </>
  );
};

export default GridOverlay;
