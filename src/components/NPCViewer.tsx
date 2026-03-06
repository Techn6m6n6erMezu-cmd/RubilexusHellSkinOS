import { useState, useEffect } from 'react';
import { Users, Activity, Star, MessageSquare, Brain, Zap } from 'lucide-react';
import {
  getAllNPCs,
  getAllRatings,
  type NPC,
  type Rating,
} from '../services/simWorldService';
import { startAutonomy, stopAutonomy, getNPCStatus } from '../services/npcAutonomyService';

export default function NPCViewer() {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isAutonomyRunning, setIsAutonomyRunning] = useState(false);
  const [autonomyInterval, setAutonomyInterval] = useState<NodeJS.Timeout | null>(null);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const npcData = await getAllNPCs();
    const ratingData = await getAllRatings();
    setNpcs(npcData);
    setRatings(ratingData.slice(0, 10)); // Show last 10 ratings

    if (isAutonomyRunning) {
      const status = await getNPCStatus();
      setStatusLog((prev) => [...status, ...prev].slice(0, 20));
    }
  };

  const toggleAutonomy = () => {
    if (isAutonomyRunning && autonomyInterval) {
      stopAutonomy(autonomyInterval);
      setAutonomyInterval(null);
      setIsAutonomyRunning(false);
    } else {
      const interval = startAutonomy(15000); // 15 second intervals
      setAutonomyInterval(interval);
      setIsAutonomyRunning(true);
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 75) return 'text-green-500';
    if (mood >= 50) return 'text-yellow-500';
    if (mood >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 75) return 'bg-green-500';
    if (energy >= 50) return 'bg-yellow-500';
    if (energy >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Autonomy Control Panel */}
      <div className="bg-gray-900 border border-cyan-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-500" />
            <div>
              <h2 className="text-2xl font-bold text-cyan-500 font-mono">NPC AUTONOMY SYSTEM</h2>
              <p className="text-cyan-700 text-xs font-mono">Sims-Style Behavior Engine</p>
            </div>
          </div>
          <button
            onClick={toggleAutonomy}
            className={`px-6 py-3 rounded font-mono font-bold transition-colors ${
              isAutonomyRunning
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-green-700 hover:bg-green-600 text-white'
            }`}
          >
            {isAutonomyRunning ? 'STOP AUTONOMY' : 'START AUTONOMY'}
          </button>
        </div>

        {isAutonomyRunning && (
          <div className="bg-black border border-cyan-900 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span className="text-cyan-500 font-mono text-sm font-bold">
                AUTONOMY ACTIVE - NPCs making autonomous decisions
              </span>
            </div>
            <p className="text-gray-500 font-mono text-xs">
              NPCs will enter buildings, consume content, and rate experiences automatically
            </p>
          </div>
        )}
      </div>

      {/* NPC Grid */}
      <div className="bg-gray-900 border border-cyan-900 rounded-lg p-6">
        <h3 className="text-cyan-500 font-mono font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          12 AUTONOMOUS NPCs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {npcs.map((npc) => (
            <div
              key={npc.id}
              className="bg-black border border-gray-800 rounded p-4 hover:border-cyan-900 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-cyan-400 font-mono font-bold">{npc.name}</h4>
                  <p className="text-gray-500 font-mono text-xs uppercase">{npc.personality}</p>
                </div>
                <div className={`text-2xl ${getMoodColor(npc.mood)}`}>
                  {npc.mood >= 75 ? '😊' : npc.mood >= 50 ? '😐' : npc.mood >= 25 ? '😟' : '😢'}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-500">Mood</span>
                    <span className={getMoodColor(npc.mood)}>{npc.mood}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getMoodColor(npc.mood).replace('text-', 'bg-')}`}
                      style={{ width: `${npc.mood}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-500">Energy</span>
                    <span className="text-gray-400">{npc.energy}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getEnergyColor(npc.energy)}`}
                      style={{ width: `${npc.energy}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded p-2">
                <p className="text-gray-500 font-mono text-xs mb-1">
                  <Zap className="w-3 h-3 inline mr-1" />
                  {npc.current_activity}
                </p>
                <p className="text-gray-600 font-mono text-xs">📍 {npc.current_location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="bg-gray-900 border border-yellow-900 rounded-lg p-6">
        <h3 className="text-yellow-500 font-mono font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          RECENT NPC RATINGS & FEEDBACK
        </h3>
        <div className="space-y-3">
          {ratings.length === 0 ? (
            <p className="text-gray-600 font-mono text-sm text-center py-8">
              No ratings yet. Start autonomy to see NPC feedback!
            </p>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="bg-black border border-gray-800 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-500" />
                    <span className="text-cyan-400 font-mono text-sm font-bold">
                      NPC Rating
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 font-mono text-sm mb-2">{rating.comment}</p>
                <p className="text-gray-600 font-mono text-xs">
                  {new Date(rating.rated_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status Log */}
      {isAutonomyRunning && statusLog.length > 0 && (
        <div className="bg-gray-900 border border-cyan-900 rounded-lg p-6">
          <h3 className="text-cyan-500 font-mono font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            LIVE ACTIVITY LOG
          </h3>
          <div className="bg-black border border-gray-800 rounded p-3 max-h-64 overflow-y-auto font-mono text-xs space-y-1">
            {statusLog.map((log, i) => (
              <div key={i} className="text-gray-500">
                <span className="text-cyan-600">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Patent */}
      <div className="p-3 bg-cyan-950/20 border border-cyan-900 rounded">
        <p className="text-cyan-700 font-mono text-xs">
          <strong className="text-cyan-500">LEGAL PATENT:</strong> Property of Ryan James Cortright
          (Lucie Forebs) and John Aaron Slone (DJ G-raffe)
        </p>
      </div>
    </div>
  );
}
