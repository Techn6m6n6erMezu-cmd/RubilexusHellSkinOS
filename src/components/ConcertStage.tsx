import { useState, useEffect } from 'react';
import { Music, Radio, Disc, Users, Star, Play } from 'lucide-react';
import { getContentByBuilding, getBuildingByType, type Content } from '../services/simWorldService';

export default function ConcertStage() {
  const [content, setContent] = useState<Content[]>([]);
  const [isPerforming, setIsPerforming] = useState(false);
  const [lightPhase, setLightPhase] = useState(0);
  const [selectedConcert, setSelectedConcert] = useState<Content | null>(null);

  useEffect(() => {
    loadStage();

    // Light show animation
    const lightInterval = setInterval(() => {
      setLightPhase((prev) => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(lightInterval);
  }, []);

  const loadStage = async () => {
    const building = await getBuildingByType('concert_stage');
    if (building) {
      const concerts = await getContentByBuilding(building.id);
      setContent(concerts);
      if (concerts.length > 0) {
        setSelectedConcert(concerts[0]);
      }
    }
  };

  const togglePerformance = () => {
    setIsPerforming(!isPerforming);
  };

  return (
    <div className="bg-gray-900 border border-purple-900 rounded-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Radio className="w-10 h-10 text-purple-500" />
          <h2 className="text-3xl font-bold text-purple-500 font-mono">THE CONCERT STAGE</h2>
          <Music className="w-10 h-10 text-purple-500" />
        </div>
        <p className="text-purple-700 text-sm font-mono">AI BAND LIVE PERFORMANCE</p>
      </div>

      {/* Stage with Light Show */}
      <div className="relative bg-black border-4 border-purple-900 rounded-lg mb-6 overflow-hidden">
        {/* Light Show */}
        {isPerforming && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 w-1 h-full opacity-50"
                style={{
                  left: `${(i + 1) * 14}%`,
                  background: `linear-gradient(to bottom, ${
                    ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i]
                  }, transparent)`,
                  transform: `rotate(${
                    Math.sin((lightPhase + i * 60) * (Math.PI / 180)) * 30
                  }deg)`,
                  transformOrigin: 'top',
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Stage Floor */}
        <div className="aspect-video relative flex items-end justify-center p-8">
          {/* AI Band Members */}
          <div className="relative z-10 flex items-end gap-6">
            {/* Drummer */}
            <div className="text-center">
              <div className={`w-16 h-20 bg-purple-700 rounded-t-full flex items-center justify-center ${isPerforming ? 'animate-bounce' : ''}`}>
                <Disc className={`w-8 h-8 text-white ${isPerforming ? 'animate-spin' : ''}`} />
              </div>
              <p className="text-purple-400 font-mono text-xs mt-1">DRUMS</p>
            </div>

            {/* Guitarist */}
            <div className="text-center">
              <div className={`w-16 h-24 bg-purple-600 rounded-t-full flex items-center justify-center ${isPerforming ? 'animate-pulse' : ''}`}>
                <Music className="w-8 h-8 text-white" />
              </div>
              <p className="text-purple-400 font-mono text-xs mt-1">GUITAR</p>
            </div>

            {/* Lead Singer */}
            <div className="text-center">
              <div className={`w-20 h-28 bg-purple-500 rounded-t-full flex items-center justify-center ${isPerforming ? 'animate-bounce' : ''}`}>
                <Radio className="w-10 h-10 text-white" />
              </div>
              <p className="text-purple-400 font-mono text-xs mt-1">VOCALS</p>
            </div>

            {/* Bassist */}
            <div className="text-center">
              <div className={`w-16 h-24 bg-purple-600 rounded-t-full flex items-center justify-center ${isPerforming ? 'animate-pulse' : ''}`}>
                <Music className="w-8 h-8 text-white" />
              </div>
              <p className="text-purple-400 font-mono text-xs mt-1">BASS</p>
            </div>

            {/* Keyboardist */}
            <div className="text-center">
              <div className={`w-16 h-20 bg-purple-700 rounded-t-full flex items-center justify-center ${isPerforming ? 'animate-bounce' : ''}`}>
                <Disc className="w-8 h-8 text-white" />
              </div>
              <p className="text-purple-400 font-mono text-xs mt-1">KEYS</p>
            </div>
          </div>

          {/* Stage Lights at Top */}
          <div className="absolute top-0 left-0 right-0 flex justify-around p-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  isPerforming ? 'animate-pulse' : ''
                }`}
                style={{
                  background: isPerforming
                    ? ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'][i % 8]
                    : '#374151',
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={togglePerformance}
          className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded font-mono transition-colors flex items-center justify-center gap-2"
        >
          {isPerforming ? (
            <>
              <div className="w-3 h-3 bg-white"></div>
              <div className="w-3 h-3 bg-white"></div>
              STOP SHOW
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              START SHOW
            </>
          )}
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 text-purple-500 font-bold py-3 px-6 rounded font-mono transition-colors flex items-center gap-2">
          <Users className="w-5 h-5" />
          CROWD: {Math.floor(Math.random() * 100)}
        </button>
      </div>

      {/* Now Playing */}
      {selectedConcert && (
        <div className="bg-purple-950/30 border border-purple-900 rounded p-4 mb-6">
          <h3 className="text-purple-500 font-mono font-bold mb-2">NOW PLAYING</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-purple-300 font-mono text-lg">{selectedConcert.title}</h4>
              <p className="text-gray-500 font-mono text-sm">
                {selectedConcert.metadata?.genre} • {selectedConcert.metadata?.duration} min
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-500 font-mono text-lg">
                {selectedConcert.average_rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Shows */}
      <div className="bg-black border border-purple-900 rounded p-4">
        <h3 className="text-purple-500 font-mono font-bold mb-3">UPCOMING SHOWS</h3>
        <div className="space-y-2">
          {content.map((concert) => (
            <button
              key={concert.id}
              onClick={() => setSelectedConcert(concert)}
              className={`w-full text-left p-3 rounded transition-colors ${
                selectedConcert?.id === concert.id
                  ? 'bg-purple-900 border border-purple-700'
                  : 'bg-gray-900 border border-gray-800 hover:border-purple-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="text-purple-400 font-mono font-bold">{concert.title}</h4>
                    <p className="text-gray-500 font-mono text-xs">
                      {concert.metadata?.genre} • {concert.metadata?.ai_band ? 'AI Band' : 'Live'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-500 font-mono text-sm">
                    {concert.average_rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Legal Patent */}
      <div className="mt-4 p-3 bg-purple-950/20 border border-purple-900 rounded">
        <p className="text-purple-700 font-mono text-xs">
          <strong className="text-purple-500">LEGAL PATENT:</strong> Property of Ryan James
          Cortright (Lucie Forebs) and John Aaron Slone (DJ G-raffe)
        </p>
      </div>
    </div>
  );
}
