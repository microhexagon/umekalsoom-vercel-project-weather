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
    <div className="mb-8">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getWeather()}
            placeholder="Search city..."
            className="w-full px-5 py-3 pl-11 bg-black/25 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:bg-black/30 transition-all font-light"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} strokeWidth={1.5} />
        </div>
        <button
          onClick={getWeather}
          disabled={loading || !city.trim()}
          className="px-6 py-3 bg-black/30 hover:bg-black/40 disabled:opacity-50 rounded-2xl text-white font-light border border-white/20 hover:border-white/30 transition"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={getUserLocation}
          disabled={gettingLocation || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-black/30 hover:bg-black/40 rounded-2xl text-white text-sm font-light border border-white/20 hover:border-white/30 transition disabled:opacity-60"
        >
          <MapPin size={16} strokeWidth={1.5} />
          {gettingLocation ? 'Detecting...' : 'Use My Location'}
        </button>
      </div>
    </div>
  );
};