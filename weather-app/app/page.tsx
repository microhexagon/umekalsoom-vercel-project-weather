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

type WeatherTheme = 'warm' | 'cold' | 'mild';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [theme, setTheme] = useState<WeatherTheme>('mild');
  
  const API_KEY = '16a626b8628ed342039362c14dba4b54';

  useEffect(() => {
    getUserLocation();
  }, []);

  const getWeatherTheme = (temp: number): WeatherTheme => {
    if (temp > 25) return 'warm';
    if (temp < 10) return 'cold';
    return 'mild';
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setGettingLocation(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('GPS Coordinates:', latitude, longitude);
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to access location');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const getLocationName = async (lat: number, lon: number) => {
    try {
      // Method 1: Nominatim (most detailed)
      const nomResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WeatherApp/1.0',
            'Accept-Language': 'en'
          }
        }
      );
      
      if (nomResponse.ok) {
        const data = await nomResponse.json();
        const addr = data.address || {};
        
        console.log('Nominatim response:', data);
        
        // Get area - prioritize most specific
        const area = 
          addr.neighbourhood || 
          addr.suburb || 
          addr.quarter ||
          addr.residential ||
          addr.hamlet ||
          addr.village ||
          addr.town || 
          addr.city_district ||
          data.name;

        // Get city - multiple fallbacks
        const city = 
          addr.city || 
          addr.town || 
          addr.municipality ||
          addr.county ||
          addr.state_district;

        const state = addr.state;
        const country = addr.country;

        if (area || city) {
          return {
            area: area,
            city: city || area,
            state: state,
            country: country
          };
        }
      }

      // Method 2: OpenWeatherMap Geocoding
      const owmResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=10&appid=${API_KEY}`
      );
      
      if (owmResponse.ok) {
        const data = await owmResponse.json();
        console.log('OpenWeatherMap response:', data);
        
        if (data?.length > 0) {
          // Find the most relevant result
          const location = data[0];
          
          return {
            area: location.name,
            city: location.name,
            state: location.state,
            country: location.country
          };
        }
      }

      // Method 3: BigDataCloud (backup)
      const bdcResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      
      if (bdcResponse.ok) {
        const data = await bdcResponse.json();
        console.log('BigDataCloud response:', data);
        
        return {
          area: data.locality || data.localityInfo?.administrative?.[3]?.name,
          city: data.city || data.locality,
          state: data.principalSubdivision,
          country: data.countryName
        };
      }
      
      return null;
    } catch (err) {
      console.error('Location fetch error:', err);
      return null;
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const weatherData = await response.json();
      setTheme(getWeatherTheme(weatherData.main.temp));
      
      // Get detailed location from multiple sources
      const locationInfo = await getLocationName(lat, lon);
      
      console.log('Final location info:', locationInfo);
      
      setWeather({
        ...weatherData,
        coordinates: { lat, lon },
        locationDetails: locationInfo || {
          area: weatherData.name,
          city: weatherData.name,
          country: weatherData.sys.country
        }
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to load weather');
    } finally {
      setLoading(false);
      setGettingLocation(false);
    }
  };

  const getWeather = async () => {
    const cityName = city.trim();
    if (!cityName) return;
    
    setLoading(true);
    setError('');
    setWeather(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('City not found');
      
      const weatherData = await response.json();
      setTheme(getWeatherTheme(weatherData.main.temp));
      
      const { lat, lon } = weatherData.coord;
      const locationInfo = await getLocationName(lat, lon);
      
      setWeather({
        ...weatherData,
        coordinates: { lat, lon },
        locationDetails: locationInfo || {
          city: weatherData.name,
          country: weatherData.sys.country
        }
      });
      
      setCity('');
    } catch (err) {
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
            theme={theme}
          />
          
          <WeatherDisplay
            weather={weather}
            loading={loading}
            error={error}
            gettingLocation={gettingLocation}
            theme={theme}
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