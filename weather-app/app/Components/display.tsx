import { Cloud, Droplets, Gauge, Eye, Thermometer } from 'lucide-react';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{ main: string; description: string }>;
  wind: { speed: number };
  visibility?: number;
}

interface WeatherDisplayProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  gettingLocation: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weather,
  loading,
  error,
  gettingLocation,
}) => {
  if (loading) return null;
  
  if (gettingLocation) {
    return (
      <div className="text-center text-white/90 py-6 text-base font-light">
        Detecting location...
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-white/90 py-6 text-base font-light">
        {error}
      </div>
    );
  }
  
  if (!weather) {
    return (
      <div className="text-center py-20">
        <Cloud className="mx-auto text-white/70 mb-6" size={64} strokeWidth={1} />
        <p className="text-white/80 text-lg font-light">Search a city or allow location</p>
      </div>
    );
  }

  const mainIcon = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  }[weather.weather[0].main] || '☁️';

  return (
    <div className="space-y-5 mt-6">
      {/* Main weather card with darker background for better contrast */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl py-10 px-6 border border-white/20 text-center shadow-xl">
        <p className="text-white text-base mb-1 font-light tracking-wide">
          {weather.name}
        </p>
        <p className="text-white/70 text-xs mb-6 font-light">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
        
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl">{mainIcon}</span>
            <p className="text-white/90 text-lg capitalize font-light">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
        
        <div className="text-8xl font-thin text-white mb-2 tracking-tighter">
          {Math.round(weather.main.temp)}°
        </div>
        
        {/* Temperature and Humidity with icons */}
        <div className="flex items-center justify-center gap-8 mt-6 text-white/90 text-sm">
          <div className="flex items-center gap-1.5">
            <Thermometer size={16} strokeWidth={1.5} className="text-white/70" />
            <span className="font-light">{Math.round(weather.main.feels_like)}°C</span>
          </div>
          <div className="h-4 w-px bg-white/40"></div>
          <div className="flex items-center gap-1.5">
            <Droplets size={16} strokeWidth={1.5} className="text-white/70" />
            <span className="font-light">{weather.main.humidity}%</span>
          </div>
        </div>
      </div>

      {/* Additional details grid with icons */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/25 backdrop-blur-xl rounded-2xl py-5 px-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cloud size={18} strokeWidth={1.5} className="text-white/70" />
            <p className="text-white/70 text-xs font-light uppercase tracking-wide">Wind</p>
          </div>
          <p className="text-3xl font-thin text-white text-center">{weather.wind.speed}</p>
          <p className="text-white/60 text-xs font-light mt-0.5 text-center">m/s</p>
        </div>
        
        <div className="bg-black/25 backdrop-blur-xl rounded-2xl py-5 px-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gauge size={18} strokeWidth={1.5} className="text-white/70" />
            <p className="text-white/70 text-xs font-light uppercase tracking-wide">Pressure</p>
          </div>
          <p className="text-3xl font-thin text-white text-center">{weather.main.pressure}</p>
          <p className="text-white/60 text-xs font-light mt-0.5 text-center">hPa</p>
        </div>
        
        <div className="bg-black/25 backdrop-blur-xl rounded-2xl py-5 px-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Eye size={18} strokeWidth={1.5} className="text-white/70" />
            <p className="text-white/70 text-xs font-light uppercase tracking-wide">Visibility</p>
          </div>
          <p className="text-3xl font-thin text-white text-center">{weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'}</p>
          <p className="text-white/60 text-xs font-light mt-0.5 text-center">km</p>
        </div>
        
        <div className="bg-black/25 backdrop-blur-xl rounded-2xl py-5 px-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Thermometer size={18} strokeWidth={1.5} className="text-white/70" />
            <p className="text-white/70 text-xs font-light uppercase tracking-wide">Feels Like</p>
          </div>
          <p className="text-3xl font-thin text-white text-center">{Math.round(weather.main.feels_like)}°</p>
          <p className="text-white/60 text-xs font-light mt-0.5 text-center">celsius</p>
        </div>
      </div>
    </div>
  );
};