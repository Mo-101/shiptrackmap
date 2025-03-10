
import React from 'react';
import { AlertCircle } from 'lucide-react';

// Component to display emergency response data with enhanced visuals
const EmergencyResponsePanel: React.FC = () => {
  // This data comes from the table provided by the user
  const emergencyData = [
    { country: "Malawi", lat: -13.254308, lng: 34.301525, type: "Cholera" },
    { country: "Malawi", lat: -13.254308, lng: 34.301525, type: "Cyclone, Flooding & Landslide" },
    { country: "Chad", lat: 15.454166, lng: 18.732207, type: "Civil unrest" },
    { country: "Kenya", lat: -0.023559, lng: 37.906193, type: "Cholera" },
    { country: "Kenya", lat: -0.023559, lng: 37.906193, type: "Drought and Food Insecurity" },
    { country: "Uganda", lat: 1.282173, lng: 32.343718, type: "Ebola" },
    { country: "DRC", lat: -3.338630, lng: 23.419828, type: "Mpox" },
  ];

  return (
    <div className="absolute bottom-4 left-4 glass-panel cyber-border rounded-md p-3 text-xs max-w-xs max-h-48 overflow-y-auto scrollbar-hide hidden md:block">
      <div className="text-accent font-semibold mb-2 flex items-center gap-1">
        <AlertCircle size={14} className="animate-pulse" />
        <span className="terminal-text">EMERGENCY RESPONSE</span>
      </div>
      <div className="space-y-1">
        {emergencyData.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <div className={`h-2 w-2 rounded-full ${
              item.type.includes("Cholera") ? "bg-red-400 animate-pulse" :
              item.type.includes("Ebola") ? "bg-orange-400 animate-pulse" :
              item.type.includes("Mpox") ? "bg-yellow-400 animate-pulse" :
              item.type.includes("COVID") ? "bg-purple-400 animate-pulse" :
              item.type.includes("Flood") ? "bg-blue-400 animate-pulse" :
              "bg-gray-400"
            }`}></div>
            <span className="truncate">{item.country}: {item.type}</span>
          </div>
        ))}
      </div>
      {/* Futuristic data stream indicator */}
      <div className="w-full h-1 mt-2 overflow-hidden rounded-full">
        <div className="data-stream"></div>
      </div>
    </div>
  );
};

export default EmergencyResponsePanel;
