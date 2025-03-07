
import React from 'react';
import { WiDaySunny, WiRain, WiStrongWind, WiHumidity, WiCloudy, WiDayThunderstorm, WiSnow } from 'react-icons/wi';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface WeatherInfoProps {
  location: [number, number];
  onClose: () => void;
}

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ location, onClose }) => {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ['weather', location[0].toFixed(2), location[1].toFixed(2)],
    queryFn: async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location[1]}&lon=${location[0]}&appid=2b25b6e6eb45b6df18d92b934c332a7c&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="text-palette-sand text-3xl" />;
      case 'rain':
        return <WiRain className="text-palette-mint text-3xl" />;
      case 'clouds':
        return <WiCloudy className="text-palette-sage text-3xl" />;
      case 'thunderstorm':
        return <WiDayThunderstorm className="text-palette-teal text-3xl" />;
      case 'snow':
        return <WiSnow className="text-palette-mint text-3xl" />;
      default:
        return <WiDaySunny className="text-palette-sand text-3xl" />;
    }
  };

  return (
    <div className="absolute top-4 left-4 sm:left-auto sm:right-4 bg-palette-darkblue/80 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl animate-fade-in w-64 border border-palette-teal/30">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <X size={16} />
      </button>
      
      <h3 className="text-lg font-semibold mb-2 text-palette-mint">Weather Information</h3>
      <p className="text-sm mb-1 text-palette-teal/80 font-mono">
        [{location[0].toFixed(2)}, {location[1].toFixed(2)}]
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-palette-mint border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-palette-mint">Loading data...</span>
        </div>
      ) : weather ? (
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather.weather[0].main)}
            <span className="text-lg font-semibold">{weather.main.temp.toFixed(1)}°C</span>
            <span className="text-sm text-gray-300">({weather.weather[0].description})</span>
          </div>
          <div className="flex items-center space-x-2 text-palette-mint">
            <WiHumidity className="text-palette-mint text-2xl" />
            <span>{weather.main.humidity}% Humidity</span>
          </div>
          <div className="flex items-center space-x-2 text-palette-mint">
            <WiStrongWind className="text-palette-teal text-2xl" />
            <span>{weather.wind.speed} m/s Winds</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-red-400">Failed to load weather data</div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute -z-10 top-0 right-0 w-24 h-24 rounded-full bg-palette-teal/5 animate-pulse-opacity"></div>
    </div>
  );
};

export default WeatherInfo;
