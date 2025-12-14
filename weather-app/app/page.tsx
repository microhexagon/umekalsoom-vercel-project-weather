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
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const API_KEY = '16a626b8628ed342039362c14dba4b54';

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

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWeather(data);
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
      setWeather(data);
      setCity('');
    } catch {
      setError('City not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/assests/Untitled.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-thin text-white mb-1 tracking-wider">Weather</h1>
            <p className="text-white/80 text-sm font-light">Real-time conditions</p>
          </div>

          <SearchBar
            city={city}
            setCity={setCity}
            getWeather={getWeather}
            getUserLocation={getUserLocation}
            loading={loading}
            gettingLocation={gettingLocation}
          />

          <WeatherDisplay
            weather={weather}
            loading={loading}
            error={error}
            gettingLocation={gettingLocation}
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