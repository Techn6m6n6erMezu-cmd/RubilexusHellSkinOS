import { useState, useEffect } from 'react';
import { Film, Tv, Play, Star, Users } from 'lucide-react';
import { getContentByBuilding, getBuildingByType, type Content } from '../services/simWorldService';

export default function PumpkinCinema() {
  const [content, setContent] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buildingId, setBuildingId] = useState<string>('');

  useEffect(() => {
    loadCinema();
  }, []);

  const loadCinema = async () => {
    const building = await getBuildingByType('pumpkin_cinema');
    if (building) {
      setBuildingId(building.id);
      const movies = await getContentByBuilding(building.id);
      setContent(movies);
      if (movies.length > 0) {
        setSelectedContent(movies[0]);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-gray-900 border border-orange-900 rounded-lg p-6">
      {/* Header with Giant Pumpkin */}
      <div className="relative mb-6">
        {/* Giant Pumpkin on Roof */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            {/* Pumpkin */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
              {/* Pumpkin ridges */}
              <div className="absolute inset-0 flex items-center justify-around">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-full bg-orange-900 opacity-30"
                    style={{ transform: `rotate(${i * 22.5}deg)` }}
                  ></div>
                ))}
              </div>
              {/* Pumpkin face */}
              <div className="relative z-10 text-center">
                <div className="flex gap-4 mb-2">
                  <div className="w-4 h-4 bg-black rotate-45"></div>
                  <div className="w-4 h-4 bg-black rotate-45"></div>
                </div>
                <div className="w-12 h-6 bg-black rounded-b-full"></div>
              </div>
              {/* Stem */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-800 rounded"></div>
            </div>
          </div>
        </div>

        {/* Cinema Sign */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-500 font-mono mb-1">
            THE PUMPKIN CINEMA
          </h2>
          <p className="text-orange-700 text-sm font-mono">NOW SHOWING - HELLSKIN OS PRESENTS</p>
        </div>
      </div>

      {/* Main Screen */}
      <div className="bg-black border-4 border-orange-900 rounded-lg mb-6 overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
          {isPlaying && selectedContent ? (
            <div className="text-center p-8">
              <Film className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-orange-500 mb-2">{selectedContent.title}</h3>
              <p className="text-gray-500 font-mono text-sm">
                {selectedContent.metadata?.genre || 'Mystery'} • {selectedContent.metadata?.duration || 0} min
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(selectedContent.average_rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-700'
                    }`}
                  />
                ))}
                <span className="text-gray-500 font-mono text-xs ml-2">
                  ({selectedContent.total_ratings} ratings)
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Play className="w-24 h-24 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 font-mono">Press play to start screening</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handlePlay}
          className="flex-1 bg-orange-700 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded font-mono transition-colors flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <>
              <div className="w-3 h-3 bg-white"></div>
              <div className="w-3 h-3 bg-white"></div>
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              PLAY
            </>
          )}
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 text-orange-500 font-bold py-3 px-6 rounded font-mono transition-colors flex items-center gap-2">
          <Users className="w-5 h-5" />
          NPCs: {Math.floor(Math.random() * 20)}
        </button>
      </div>

      {/* Kopeland TV Monitors Grid */}
      <div className="bg-black border border-orange-900 rounded p-4">
        <h3 className="text-orange-500 font-mono font-bold mb-3 flex items-center gap-2">
          <Tv className="w-4 h-4" />
          KOPELAND TV MONITORS (12)
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-gradient-to-br from-blue-950 to-black border border-gray-800 rounded flex items-center justify-center hover:border-orange-700 transition-colors cursor-pointer group"
            >
              <Tv className="w-4 h-4 text-gray-700 group-hover:text-orange-500 transition-colors" />
            </div>
          ))}
        </div>
        <p className="text-gray-600 font-mono text-xs mt-3 text-center">
          Multi-screen media playback system
        </p>
      </div>

      {/* Now Showing List */}
      <div className="mt-6 bg-black border border-orange-900 rounded p-4">
        <h3 className="text-orange-500 font-mono font-bold mb-3">NOW SHOWING</h3>
        <div className="space-y-2">
          {content.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelectedContent(movie)}
              className={`w-full text-left p-3 rounded transition-colors ${
                selectedContent?.id === movie.id
                  ? 'bg-orange-900 border border-orange-700'
                  : 'bg-gray-900 border border-gray-800 hover:border-orange-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-orange-400 font-mono font-bold">{movie.title}</h4>
                  <p className="text-gray-500 font-mono text-xs">
                    {movie.metadata?.genre} • {movie.metadata?.rating}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-500 font-mono text-sm">
                    {movie.average_rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Legal Patent */}
      <div className="mt-4 p-3 bg-orange-950/20 border border-orange-900 rounded">
        <p className="text-orange-700 font-mono text-xs">
          <strong className="text-orange-500">LEGAL PATENT:</strong> Property of Ryan James
          Cortright (Lucie Forebs) and John Aaron Slone (DJ G-raffe)
        </p>
      </div>
    </div>
  );
}
