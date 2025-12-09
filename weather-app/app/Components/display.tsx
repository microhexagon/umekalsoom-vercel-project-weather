
import { Cloud } from 'lucide-react';

// Data types 
interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: { speed: number };
  visibility: number;
}

type WeatherCondition = 'Clear' | 'Clouds' | 'Rain' | 'Drizzle' | 'Thunderstorm' | 'Snow' | 'Mist' | 'Fog';

const weatherIcons: Record<WeatherCondition, string> = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
};

interface WeatherDisplayProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  gettingLocation: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, loading, error, gettingLocation }) => {
  
  if (loading) return null; 
  
  // Loader for Geolocation
  if (gettingLocation) {
    return (
      <div className="mb-6 bg-blue-500/20 border border-blue-400/40 text-white px-4 py-3 rounded-2xl text-center backdrop-blur-sm text-sm">
        📍 Detecting your location...
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="mb-6 bg-red-500/20 border border-red-400/40 text-white px-4 py-3 rounded-2xl backdrop-blur-sm text-sm">
        <span className="font-semibold">⚠️ Error:</span> {error}
      </div>
    );
  }

  // Initial state or City not found
  if (!weather || !weather.weather[0]) {
    return (
      <div className="text-center py-16">
        <Cloud className="mx-auto text-white/60 mb-4" size={56} />
        <p className="text-white/90 font-medium text-sm">Enter a city name or use location to get started</p>
      </div>
    );
  }

  const weatherMain = weather.weather[0].main as WeatherCondition;

  return (
    <div className="space-y-5">
      {/* City & temperature */}
      <div className="text-center bg-white/15 rounded-2xl p-8 backdrop-blur-xl border border-white/20">
        <div className="text-7xl mb-3 drop-shadow-lg">
          {weatherIcons[weatherMain] || '🌤️'}
        </div>
        
        <h2 className="text-xl font-semibold text-white/90 mb-1">
          {weather.name}, {weather.sys.country}
        </h2>
        
        <div className="text-7xl font-bold text-white my-3 tracking-tight">
          {Math.round(weather.main.temp)}°
        </div>
        
        {/* Weather description */}
        <p className="text-base text-white/80 capitalize font-medium">
          {weather.weather[0].description}
        </p>
      </div>

      {/* Weather details */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Humidity */}
        <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💧</span>
            <span className="text-white/90 text-xs font-medium uppercase tracking-wide">Humidity</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {weather.main.humidity}<span className="text-xl">%</span>
          </p>
        </div>

        {/* Wind speed */}
        <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💨</span>
            <span className="text-white/90 text-xs font-medium uppercase tracking-wide">Wind</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {weather.wind.speed}<span className="text-base ml-1">m/s</span>
          </p>
        </div>

        {/* Pressure */}
        <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌡️</span>
            <span className="text-white/90 text-xs font-medium uppercase tracking-wide">Pressure</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {weather.main.pressure}<span className="text-sm ml-1">hPa</span>
          </p>
        </div>

        {/* Visibility */}
        <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👁️</span>
            <span className="text-white/90 text-xs font-medium uppercase tracking-wide">Visibility</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {(weather.visibility / 1000).toFixed(1)}<span className="text-base ml-1">km</span>
          </p>
        </div>

      </div>

      {/* Feels like */}
      <div className="bg-white/15 rounded-2xl p-5 text-center backdrop-blur-xl border border-white/20">
        <p className="text-white/90 text-xs mb-2 font-medium uppercase tracking-wide">Feels Like</p>
        <p className="text-4xl font-bold text-white">
          {Math.round(weather.main.feels_like)}°C
        </p>
      </div>

    </div>
  );
};