'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

// Weather data interface
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

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '16a626b8628ed342039362c14dba4b54';

  // Fetch weather
  const getWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      setCity('');
      
      console.log('Weather Data:', data);
    } catch (err) {
      console.error('Error:', err);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Weather App</h1>
            <p className="text-white/90 font-medium">Check weather anywhere</p>
          </div>

          {/* Search input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 pl-12 bg-white/25 border-2 border-white/40 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white/30 transition-all duration-300 font-medium"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80" size={20} />
            </div>

            {/* Search button */}
            <button 
              onClick={getWeather}
              disabled={loading}
              className="w-full mt-4 bg-white/25 hover:bg-white/40 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Weather data */}
          {weather && (
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-md border border-white/30">
              <h3 className="text-white font-bold mb-2">Weather Data:</h3>
              <pre className="text-white text-xs overflow-auto max-h-64">
                {JSON.stringify(weather, null, 2)}
              </pre>
            </div>
          )}

          {/* Empty state */}
          {!weather && !loading && (
            <div className="text-center py-8">
              <p className="text-white/80 font-medium">Search for a city to see weather data</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}