import React from 'react';
import { WiDaySunny, WiRain, WiStrongWind, WiHumidity, WiCloudy, WiDayThunderstorm, WiSnow } from 'react-icons/wi';
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
  const fetchWeather = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location[1]}&lon=${location[0]}&appid=2b25b6e6eb45b6df18d92b934c332a7&units=metric`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) throw new Error('Weather data fetch failed');
    return response.json();
  };

  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ['weather', location[0], location[1]],
    queryFn: fetchWeather,
  });

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="text-yellow-400 text-3xl" />;
      case 'rain':
        return <WiRain className="text-blue-400 text-3xl" />;
      case 'clouds':
        return <WiCloudy className="text-gray-400 text-3xl" />;
      case 'thunderstorm':
        return <WiDayThunderstorm className="text-purple-400 text-3xl" />;
      case 'snow':
        return <WiSnow className="text-blue-200 text-3xl" />;
      default:
        return <WiDaySunny className="text-yellow-400 text-3xl" />;
    }
  };

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
      
      {isLoading ? (
        <div className="text-center py-4">Loading weather data...</div>
      ) : weather ? (
        <div className="space-y-2 mt-4">
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather.weather[0].main)}
            <span>{weather.main.temp.toFixed(1)}°C</span>
            <span className="text-sm text-gray-300">({weather.weather[0].description})</span>
          </div>
          <div className="flex items-center space-x-2">
            <WiHumidity className="text-blue-400 text-2xl" />
            <span>{weather.main.humidity}% Humidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <WiStrongWind className="text-gray-400 text-2xl" />
            <span>{weather.wind.speed} m/s Winds</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-red-400">Failed to load weather data</div>
      )}
    </div>
  );
};

export default WeatherInfo;