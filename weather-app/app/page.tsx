'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function Home() {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Weather App</h1>
            <p className="text-white/90 font-medium">Check weather anywhere</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 pl-12 bg-white/25 border-2 border-white/40 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white/30 transition-all duration-300 font-medium"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80" size={20} />
            </div>

            <button 
              onClick={handleSearch}
              className="w-full mt-4 bg-white/25 hover:bg-white/40 text-white font-bold py-3 rounded-xl transition-all duration-300 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Search
            </button>
          </div>

          <div className="text-center py-8">
            <p className="text-white/80 font-medium">Enter a city name to get started</p>
          </div>

        </div>
      </div>
    </div>
  );
}