import { useState, useEffect } from 'react';
import { Eye, Skull, Zap, Users, Play, Pause, RotateCcw } from 'lucide-react';
import { getAllNPCs, updateNPC, type NPC } from '../services/simWorldService';

export default function ShamanEmulator() {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAutonomyActive, setIsAutonomyActive] = useState(false);

  useEffect(() => {
    loadNPCs();
  }, []);

  const loadNPCs = async () => {
    setLoading(true);
    const data = await getAllNPCs();
    setNpcs(data);
    if (data.length > 0 && !selectedNPC) {
      setSelectedNPC(data[0]);
    }
    setLoading(false);
  };

  const handleUpdateNPC = async (field: keyof NPC, value: any) => {
    if (!selectedNPC) return;

    const updated = { ...selectedNPC, [field]: value };
    setSelectedNPC(updated);

    const success = await updateNPC(selectedNPC.id, { [field]: value });
    if (success) {
      setNpcs(npcs.map(npc => npc.id === selectedNPC.id ? updated : npc));
    }
  };

  const toggleAutonomy = () => {
    setIsAutonomyActive(!isAutonomyActive);
  };

  const resetNPC = async () => {
    if (!selectedNPC) return;
    await handleUpdateNPC('mood', 75);
    await handleUpdateNPC('energy', 100);
    await handleUpdateNPC('current_activity', 'idle');
  };

  if (loading) {
    return (
      <div className="bg-black border border-cyan-700 rounded-lg p-8 text-center">
        <Skull className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-pulse" />
        <p className="text-cyan-500 font-mono">LOADING SHAMAN EMULATOR...</p>
      </div>
    );
  }

  return (
    <div className="bg-black border-2 border-cyan-700 rounded-lg overflow-hidden shadow-lg shadow-cyan-900/50">
      {/* Rubilexus #666 Header with 7 Red Eyes */}
      <div className="bg-gradient-to-r from-cyan-950 to-black border-b-2 border-cyan-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Skull className="w-10 h-10 text-cyan-500" />
              <div className="absolute -top-2 -right-2 flex gap-0.5">
                {[...Array(7)].map((_, i) => (
                  <Eye key={i} className="w-2 h-2 text-red-600 fill-red-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-cyan-500 font-mono tracking-wider">
                SHAMAN EMULATOR
              </h2>
              <p className="text-cyan-700 text-xs font-mono">
                RUBILEXUS #666 • MINI-BOLT INTERFACE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutonomy}
              className={`flex items-center gap-2 px-4 py-2 border-2 font-mono font-bold transition-all ${
                isAutonomyActive
                  ? 'bg-green-900 border-green-500 text-green-500 shadow-lg shadow-green-900/50'
                  : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-cyan-700'
              }`}
            >
              {isAutonomyActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>AUTONOMY ON</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>AUTONOMY OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-0">
        {/* NPC List */}
        <div className="bg-gray-950 border-r border-cyan-700 p-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-cyan-500" />
            <h3 className="text-cyan-500 font-mono font-bold">NPCs ({npcs.length})</h3>
          </div>
          <div className="space-y-2">
            {npcs.map((npc) => (
              <button
                key={npc.id}
                onClick={() => setSelectedNPC(npc)}
                className={`w-full text-left p-3 border transition-all ${
                  selectedNPC?.id === npc.id
                    ? 'bg-cyan-900 border-cyan-500 shadow-lg shadow-cyan-900/50'
                    : 'bg-gray-900 border-gray-700 hover:border-cyan-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-400 font-mono font-bold text-sm">{npc.name}</span>
                  <span className="text-xs text-gray-600 font-mono uppercase">{npc.personality}</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">{npc.current_activity}</div>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 bg-gray-800 rounded overflow-hidden h-1.5">
                    <div
                      className="bg-yellow-500 h-full transition-all"
                      style={{ width: `${npc.mood}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded overflow-hidden h-1.5">
                    <div
                      className="bg-green-500 h-full transition-all"
                      style={{ width: `${npc.energy}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Editor */}
        <div className="md:col-span-2 bg-black p-6">
          {selectedNPC ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-cyan-900 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-500 font-mono">{selectedNPC.name}</h3>
                  <p className="text-cyan-700 font-mono text-sm uppercase">{selectedNPC.personality}</p>
                </div>
                <button
                  onClick={resetNPC}
                  className="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-700 text-red-500 hover:bg-red-900 transition-colors font-mono text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  RESET
                </button>
              </div>

              {/* Location & Activity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-500 font-mono text-sm mb-2">LOCATION</label>
                  <input
                    type="text"
                    value={selectedNPC.current_location}
                    onChange={(e) => handleUpdateNPC('current_location', e.target.value)}
                    className="w-full bg-gray-900 border border-cyan-700 px-3 py-2 text-cyan-400 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-cyan-500 font-mono text-sm mb-2">ACTIVITY</label>
                  <input
                    type="text"
                    value={selectedNPC.current_activity}
                    onChange={(e) => handleUpdateNPC('current_activity', e.target.value)}
                    className="w-full bg-gray-900 border border-cyan-700 px-3 py-2 text-cyan-400 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mood Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-cyan-500 font-mono text-sm">MOOD</label>
                  <span className="text-yellow-500 font-mono font-bold">{selectedNPC.mood}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedNPC.mood}
                  onChange={(e) => handleUpdateNPC('mood', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb-yellow"
                />
              </div>

              {/* Energy Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-cyan-500 font-mono text-sm">ENERGY</label>
                  <span className="text-green-500 font-mono font-bold">{selectedNPC.energy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedNPC.energy}
                  onChange={(e) => handleUpdateNPC('energy', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-thumb-green"
                />
              </div>

              {/* Stats Display */}
              <div className="bg-gray-950 border border-cyan-900 rounded p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-cyan-500" />
                  <h4 className="text-cyan-500 font-mono font-bold text-sm">LIVE STATS</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-gray-600">Last Action:</span>
                    <p className="text-cyan-400">{new Date(selectedNPC.last_action_at).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Personality:</span>
                    <p className="text-cyan-400 uppercase">{selectedNPC.personality}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 font-mono">SELECT AN NPC TO EDIT</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-cyan-950 border-t-2 border-cyan-700 p-3">
        <p className="text-cyan-700 font-mono text-xs text-center">
          <span className="text-cyan-500 font-bold">SHAMAN EMULATOR v6.66</span> • Live NPC Editor • Rubilexus #666 Protocol
        </p>
      </div>
    </div>
  );
}
