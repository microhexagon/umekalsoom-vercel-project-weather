import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  getWeather: () => void;
  getUserLocation: () => void;
  loading: boolean;
  gettingLocation: boolean;
  theme: 'warm' | 'cold' | 'mild';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  city,
  setCity,
  getWeather,
  getUserLocation,
  loading,
  gettingLocation,
  theme,
}) => {
  const getButtonStyle = () => {
    const styles = {
      warm: 'bg-gradient-to-r from-orange-500/70 to-red-500/70 hover:from-orange-600/80 hover:to-red-600/80',
      cold: 'bg-gradient-to-r from-blue-500/70 to-indigo-500/70 hover:from-blue-600/80 hover:to-indigo-600/80',
      mild: 'bg-black/30 hover:bg-black/40'
    };
    
    return styles[theme];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && city.trim()) {
      getWeather();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search city..."
            className="w-full px-5 py-3 pl-11 bg-black/25 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:bg-black/30 transition-all font-light"
          />
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" 
            size={18} 
            strokeWidth={1.5} 
          />
        </div>
        
        <button
          onClick={getWeather}
          disabled={loading || !city.trim()}
          className={`px-6 py-3 ${getButtonStyle()} disabled:opacity-50 rounded-2xl text-white font-light border border-white/20 hover:border-white/30 transition`}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      
      <div className="flex justify-center mt-4">
        <button
          onClick={getUserLocation}
          disabled={gettingLocation || loading}
          className={`flex items-center gap-2 px-5 py-2.5 ${getButtonStyle()} rounded-2xl text-white text-sm font-light border border-white/20 hover:border-white/30 transition disabled:opacity-60`}
        >
          <MapPin size={16} strokeWidth={1.5} />
          {gettingLocation ? 'Detecting...' : 'Use My Location'}
        </button>
      </div>
    </div>
  );
};