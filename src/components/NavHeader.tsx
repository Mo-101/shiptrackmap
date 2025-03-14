
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ArrowLeft, Map } from 'lucide-react';

interface NavHeaderProps {
  toggleSidebar: () => void;
}

const NavHeader: React.FC<NavHeaderProps> = ({ toggleSidebar }) => {
  // Google Maps API key for routing
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDLd1r_Pl9A4VW8Otd56lbxUXu0HK6NKLM';
  
  return (
    <div className="p-4 flex items-center justify-between bg-palette-darkblue border-b border-palette-mint/20">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full bg-palette-blue/30 hover:bg-palette-blue/50 transition-colors"
        >
          <Menu size={20} className="text-palette-mint" />
        </button>
        <Link to="/" className="p-2 rounded-full bg-palette-blue/30 hover:bg-palette-blue/50 transition-colors">
          <ArrowLeft size={20} className="text-palette-mint" />
        </Link>
        <h1 className="text-2xl font-bold text-white">
          <span className="text-palette-mint">AfroTrack</span> Live™
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-palette-blue/30 px-3 py-1 rounded-full">
          <Map size={14} className="text-palette-mint" />
          <span className="text-xs text-white/80">Google Maps Routing</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-palette-blue/30 px-3 py-1 rounded-full">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-white/80">LIVE DATA</span>
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
