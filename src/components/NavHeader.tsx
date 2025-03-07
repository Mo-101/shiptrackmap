
import React from 'react';
import { Menu, Ship, Bell, ChevronDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavHeaderProps {
  toggleSidebar: () => void;
}

const NavHeader: React.FC<NavHeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  return (
    <header className="bg-palette-darkblue/90 backdrop-blur-md border-b border-palette-teal/20 px-4 py-3 flex items-center justify-between w-full">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-white hover:bg-palette-midblue/20 rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center space-x-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Ship className="text-palette-mint h-6 w-6" />
          <h1 className="text-white text-xl font-bold tracking-tight hidden sm:block">
            AFREXPRESS<span className="text-palette-mint">TRACK</span>
          </h1>
        </div>
      </div>
      
      {/* Center - Time Display */}
      <div className="hidden md:flex items-center space-x-2 bg-palette-darkblue/50 px-3 py-1.5 rounded-md">
        <div className="text-xs text-palette-mint font-mono">
          {currentTime} <span className="text-palette-teal">PM UTC</span>
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        <button className="p-1.5 text-white hover:bg-palette-midblue/20 rounded-full transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 bg-palette-mint h-2 w-2 rounded-full"></span>
        </button>
        
        <div className="hidden sm:flex items-center space-x-2 bg-palette-darkblue/50 px-2 py-1 rounded-md cursor-pointer">
          <div className="h-7 w-7 rounded-full bg-palette-midblue grid place-items-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-white text-sm">Admin</span>
          <ChevronDown size={14} className="text-palette-teal" />
        </div>
      </div>
    </header>
  );
};

export default NavHeader;
