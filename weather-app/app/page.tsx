'use client';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/app/Components/search';
import { WeatherDisplay } from '@/app/Components/display';

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

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const API_KEY = '16a626b8628ed342039362c14dba4b54';

  // THEME
  const getTheme = (temp: number | null): 'warm' | 'cold' | 'mild' => {
    if (temp === null) {
      return 'mild'; 
    }
    if (temp >= 25) {
      return 'warm'; 
    }
    if (temp <= 10) {
      return 'cold'; 
    }
    return 'mild'; 
  };

  const currentTheme = getTheme(weather?.main.temp ?? null);
  

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setGettingLocation(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError('Unable to access location');
        setGettingLocation(false);
      }
    );
  };

  const getLocationName = async (lat: number, lon: number) => {
    try {
      // Try OpenWeatherMap first
      const owmRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      
      if (owmRes.ok) {
        const owmData = await owmRes.json();
        if (owmData && owmData.length > 0) {
          const location = owmData[0];
          return {
            area: location.name,
            city: location.name,
            state: location.state,
            country: location.country
          };
        }
      }

      // Fallback 
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        const addr = nomData.address || {};
        
        return {
          area: addr.suburb || addr.neighbourhood || addr.town || addr.city || addr.state,
          city: addr.city || addr.town || addr.state,
          state: addr.state,
          country: addr.country
        };
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      // Fetch weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!res.ok) throw new Error();
      
      const data = await res.json();
      
      // Get location name
      const locationDetails = await getLocationName(lat, lon);
      
      setWeather({
        ...data,
        coordinates: { lat, lon },
        locationDetails: locationDetails || {
          area: data.name,
          city: data.name,
          country: data.sys.country
        }
      });
    } catch {
      setError('Failed to load weather');
    } finally {
      setLoading(false);
      setGettingLocation(false);
    }
  };

  const getWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');
    setWeather(null);
    
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      
      if (!res.ok) throw new Error();
      
      const data = await res.json();
      
      // Get location details
      const locationDetails = await getLocationName(data.coord.lat, data.coord.lon);
      
      setWeather({
        ...data,
        coordinates: { lat: data.coord.lat, lon: data.coord.lon },
        locationDetails: locationDetails || {
          city: data.name,
          country: data.sys.country
        }
      });
      setCity('');
    } catch {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/assests/Untitled.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="w-full max-w-lg relative z-10 my-auto">
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-thin text-white mb-1 tracking-wider">Weather</h1>
            <p className="text-white/80 text-xs font-light">Real-time conditions</p>
          </div>
          
          <SearchBar
            city={city}
            setCity={setCity}
            getWeather={getWeather}
            getUserLocation={getUserLocation}
            loading={loading}
            gettingLocation={gettingLocation}
            theme={currentTheme} 
          />
          
          <WeatherDisplay
            weather={weather}
            loading={loading}
            error={error}
            gettingLocation={gettingLocation}
            theme={currentTheme} 
          />
          
        </div>
        
        {weather && (
          <p className="text-center text-white/70 text-xs mt-6 font-light">
            Powered by OpenWeatherMap
          </p>
        )}
      </div>
    </div>
  );
}