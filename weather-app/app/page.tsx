'use client';
import { useState, useEffect } from 'react';
import { Search, Droplets, Wind, Eye, Gauge, Cloud, MapPin } from 'lucide-react';

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

export default function Home() {
  // State management
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // API key
  const API_KEY = '16a626b8628ed342039362c14dba4b54';

  // Weather icons
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

  // Auto-detect location
  useEffect(() => {
    getUserLocation();
  }, []);

  // Background change based on weather
  const getBackground = () => {
    return 'from-purple-600 via-purple-500 to-pink-500';
  };

  // Geolocation API
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location services');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError('Could not get your location');
        setGettingLocation(false);
      }
    );
  };

  // Fetch by coordinates
  const getWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Could not fetch weather data');

      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setGettingLocation(false);
    }
  };

  // Fetch weather data
  const getWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('City not found');

      // Parse JSON
      const data: WeatherData = await response.json();
      setWeather(data);
      setCity('');
    } catch (err) {
      // Error handling
      setError('City not found. Please check the spelling.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="w-full max-w-md">
        {/* TailwindCSS Design */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Weather App</h1>
            <p className="text-white/80 text-sm">Check weather anywhere</p>
          </div>

          {/* Input field */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                placeholder="Enter city name..."
                className="w-full px-5 py-4 pl-12 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all duration-300 text-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={18} />
            </div>

            {/* Search button */}
            <div className="flex gap-3 mt-4">
              <button 
                onClick={getWeather}
                disabled={loading}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-white/20 hover:border-white/40 backdrop-blur-xl text-sm"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>

              {/* Location button */}
              <button 
                onClick={getUserLocation}
                disabled={gettingLocation || loading}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-3.5 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-white/20 hover:border-white/40 backdrop-blur-xl"
                title="Use my location"
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400/40 text-white px-4 py-3 rounded-2xl backdrop-blur-sm text-sm">
              <span className="font-semibold">⚠️ Error:</span> {error}
            </div>
          )}

          {/* Loader */}
          {gettingLocation && (
            <div className="mb-6 bg-blue-500/20 border border-blue-400/40 text-white px-4 py-3 rounded-2xl text-center backdrop-blur-sm text-sm">
              📍 Detecting your location...
            </div>
          )}

          {/* Display weather */}
          {weather && weather.weather[0] ? (
            <div className="space-y-5">
              
              {/* City & temperature */}
              <div className="text-center bg-white/15 rounded-2xl p-8 backdrop-blur-xl border border-white/20">
                <div className="text-7xl mb-3 drop-shadow-lg">
                  {weatherIcons[weather.weather[0].main as WeatherCondition] || '🌤️'}
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
          ) : (
            !loading && !error && !gettingLocation && (
              <div className="text-center py-16">
                <Cloud className="mx-auto text-white/60 mb-4" size={56} />
                <p className="text-white/90 font-medium text-sm">Enter a city name to get started</p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}