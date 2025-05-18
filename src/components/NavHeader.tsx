
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
        <h1 className="text-xl md:text-2xl font-extrabold text-white mr-6 leading-tight">
          <span className="text-cyan-300">DeepCAL:</span> <span className="text-cyan-100">DeepCAL++</span>
          <span className="block text-xs md:text-base font-normal text-cyan-200 mt-1">Decision Engine for Emergency Prioritization and Carrier Analytics for Logistics</span>
          <span className="block text-xs md:text-base font-semibold text-blue-300">Neuro-Symbolic Decision Engine</span>
        </h1>
        {/* Navigation Buttons */}
        <nav className="flex items-center gap-2 ml-2">
          <Link to="/analytics" className="flex items-center gap-2 bg-cyan-700/80 hover:bg-cyan-700 text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" /></svg>
            Analytics
          </Link>
          <Link to="/deepcal" className="flex items-center gap-2 bg-cyan-500/80 hover:bg-cyan-500 text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" /></svg>
            DeepCAL
          </Link>
          <Link to="/deepcalchat" className="flex items-center gap-2 bg-purple-500/80 hover:bg-purple-500 text-white py-2 px-4 rounded-full text-sm font-semibold transition-colors shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2" /></svg>
            DeepCAL Chat
          </Link>
        </nav>
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
        <a href="/training" className="flex items-center gap-2 bg-purple-600/80 hover:bg-purple-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors shadow-lg ml-4">
          {/* Graduation Cap SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0a9 9 0 01-9-9" /></svg>
          <span>Training</span>
        </a>
      </div>
    </div>
  );
};

export default NavHeader;
