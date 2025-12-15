import { Cloud, Droplets, Gauge, Eye, Thermometer, MapPin } from 'lucide-react';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  }
  weather: Array<{ main: string; description: string }>;
  wind: { speed: number };
  visibility?: number;
  coordinates?: {
    lat: number;
    lon: number;
  };
  locationDetails?: {
    area?: string;
    city: string;
    state?: string;
    country: string;
  };
}

interface WeatherDisplayProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  gettingLocation: boolean;
  theme: 'warm' | 'cold' | 'mild';
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

  const weatherIcons: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  };

  const mainIcon = weatherIcons[weather.weather[0].main] || '☁️';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const detailCards = [
    {
      icon: Cloud,
      label: 'WIND',
      value: weather.wind.speed,
      unit: 'm/s'
    },
    {
      icon: Gauge,
      label: 'PRESSURE',
      value: weather.main.pressure,
      unit: 'hPa'
    },
    {
      icon: Eye,
      label: 'VISIBILITY',
      value: weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A',
      unit: 'km'
    },
    {
      icon: Thermometer,
      label: 'FEELS LIKE',
      value: Math.round(weather.main.feels_like) + '°',
      unit: 'celsius'
    }
  ];

  return (
    <div className="space-y-4 mt-4">
      {/* Main card */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl py-8 px-6 border border-white/20 text-center shadow-xl">
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MapPin className="text-pink-300" size={16} strokeWidth={1.5} />
            <p className="text-white text-lg font-light tracking-wide">
              {weather.locationDetails?.area || weather.name}
            </p>
          </div>
          
          <p className="text-white/70 text-sm font-light">
            {weather.locationDetails?.state && `${weather.locationDetails.state}, `}
            {weather.locationDetails?.country || weather.sys.country}
          </p>
        </div>
        
        <p className="text-white/70 text-xs mb-4 font-light">
          {currentDate}
        </p>
        
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl">{mainIcon}</span>
            <p className="text-white/90 text-lg capitalize font-light">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
        
        <div className="text-7xl font-thin text-white mb-2 tracking-tighter">
          {Math.round(weather.main.temp)}°
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center justify-center gap-8 mt-4 text-white/90 text-sm">
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

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {detailCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              className="bg-black/25 backdrop-blur-xl rounded-2xl py-4 px-4 border border-white/20"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon size={18} strokeWidth={1.5} className="text-white/70" />
                <p className="text-white/90 text-xs font-light uppercase tracking-wide">
                  {card.label}
                </p>
              </div>
              <p className="text-2xl font-thin text-white text-center">
                {card.value}
              </p>
              <p className="text-white/60 text-xs font-light mt-0.5 text-center">
                {card.unit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};