// components/SearchBar.tsx
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  getWeather: () => void;
  getUserLocation: () => void;
  loading: boolean;
  gettingLocation: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  city,
  setCity,
  getWeather,
  getUserLocation,
  loading,
  gettingLocation,
}) => {
  return (
    <div className="mb-6">
      <div className="flex gap-3"> 
        <div className="relative flex-1">
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

        <button
          onClick={getWeather}
          disabled={loading || !city.trim()}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-white/20 hover:border-white/40 backdrop-blur-xl text-sm whitespace-nowrap"
          style={{ minWidth: 'auto' }}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      <div className="flex justify-center mt-4"> 
         <button 
          onClick={getUserLocation}
          disabled={gettingLocation || loading}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-3.5 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-white/20 hover:border-white/40 backdrop-blur-xl"
          title="Use my location"
        >
          <MapPin size={18} />
          {gettingLocation ? 'Locating...' : 'Use My Location'}
        </button>
      </div>
    </div>
  );
};