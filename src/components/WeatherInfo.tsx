import React from 'react';
import { WiDaySunny, WiRain, WiStrongWind, WiHumidity } from 'react-icons/wi';

interface WeatherInfoProps {
  location: [number, number];
  onClose: () => void;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ location, onClose }) => {
  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl animate-fade-in w-64">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
      >
        ×
      </button>
      <h3 className="text-lg font-semibold mb-2">Weather Information</h3>
      <p className="text-sm mb-1">Coordinates: {location[0].toFixed(2)}, {location[1].toFixed(2)}</p>
      <div className="space-y-2 mt-4">
        <div className="flex items-center space-x-2">
          <WiDaySunny className="text-yellow-400 text-2xl" />
          <span>28°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <WiHumidity className="text-blue-400 text-2xl" />
          <span>65% Humidity</span>
        </div>
        <div className="flex items-center space-x-2">
          <WiStrongWind className="text-gray-400 text-2xl" />
          <span>12 km/h Winds</span>
        </div>
        <div className="flex items-center space-x-2">
          <WiRain className="text-blue-300 text-2xl" />
          <span>20% Precipitation</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;