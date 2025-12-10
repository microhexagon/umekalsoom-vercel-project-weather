// app/page.tsx
'use client';
import { useState, useEffect } from 'react';

// Components
import { SearchBar } from '@/app/Components/search';
import { WeatherDisplay } from '@/app/Components/display';

// Data types (
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
  // State management
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // API key
  const API_KEY = '16a626b8628ed342039362c14dba4b54'; 

  // Background change 
  const getBackground = () => {
  
    return 'from-teal-700 via-teal-600 to-emerald-500'; 
  };

  // Auto-detect location 
  useEffect(() => {
    getUserLocation();
  }, []);

  // Geolocation API
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location services');
      return;
    }

    setGettingLocation(true);
    setError('');
    setWeather(null); 

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

  // Fetch data
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
      setWeather(null);
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
    setWeather(null); 

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('City not found');

      const data: WeatherData = await response.json();
      setWeather(data);
      setCity('');
    } catch (err) {
      setError('City not found. Please check the spelling.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Weather App</h1>
            <p className="text-white/80 text-sm">Check weather anywhere</p>
          </div>

          {/* 1. SearchBar Component */}
          <SearchBar
            city={city}
            setCity={setCity}
            getWeather={getWeather}
            getUserLocation={getUserLocation}
            loading={loading}
            gettingLocation={gettingLocation}
          />
          
          {/* 2. WeatherDisplay Component */}
          <WeatherDisplay
            weather={weather}
            loading={loading}
            error={error}
            gettingLocation={gettingLocation}
          />

        </div>
      </div>
    </div>
  );
}