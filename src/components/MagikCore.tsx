import { useState, useEffect } from 'react';
import { Database, Zap, Brain, Eye, Activity } from 'lucide-react';
import {
  getMagikMemories,
  createWorldSnapshot,
  type MagikMemory,
} from '../services/simWorldService';

export default function MagikCore() {
  const [memories, setMemories] = useState<MagikMemory[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    loadMemories();

    // Pulse animation
    const pulseInterval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, []);

  const loadMemories = async () => {
    const data = await getMagikMemories(undefined, 10);
    setMemories(data);
  };

  const handleSnapshot = async () => {
    await createWorldSnapshot();
    loadMemories();
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'npc_state':
        return <Eye className="w-4 h-4" />;
      case 'world_event':
        return <Zap className="w-4 h-4" />;
      case 'rating':
        return <Activity className="w-4 h-4" />;
      case 'snapshot':
        return <Database className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-900 border border-yellow-900 rounded-lg p-6 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(234, 179, 8, ${
            0.3 + Math.sin((pulsePhase * Math.PI) / 180) * 0.2
          }), transparent 70%)`,
        }}
      ></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Rotating Sphere */}
              <div
                className="w-12 h-12 rounded-full border-4 border-yellow-500 flex items-center justify-center"
                style={{
                  transform: `rotate(${pulsePhase}deg)`,
                  boxShadow: '0 0 20px rgba(234, 179, 8, 0.6)',
                }}
              >
                <Brain className="w-6 h-6 text-yellow-500" />
              </div>
              {/* Orbital Ring */}
              <div
                className="absolute inset-0 w-12 h-12 rounded-full border-2 border-yellow-600 opacity-50"
                style={{
                  transform: `rotate(${-pulsePhase * 2}deg) scale(1.3)`,
                }}
              ></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-500 font-mono">
                S6UL SPHERE 66
              </h2>
              <p className="text-yellow-700 text-xs font-mono">MAGIK CORE - ABSOLUTE MEMORY</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            ></div>
            <span className="text-gray-400 text-sm font-mono">
              {isActive ? 'ACTIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-black border border-yellow-900 p-3 rounded text-center">
            <Database className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-400">{memories.length}</div>
            <div className="text-xs text-gray-500 font-mono">MEMORIES</div>
          </div>
          <div className="bg-black border border-yellow-900 p-3 rounded text-center">
            <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-xs text-gray-500 font-mono">SYNC</div>
          </div>
          <div className="bg-black border border-yellow-900 p-3 rounded text-center">
            <Brain className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-400">∞</div>
            <div className="text-xs text-gray-500 font-mono">CAPACITY</div>
          </div>
          <div className="bg-black border border-yellow-900 p-3 rounded text-center">
            <Activity className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-400">LIVE</div>
            <div className="text-xs text-gray-500 font-mono">STATUS</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleSnapshot}
            className="flex-1 bg-yellow-700 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded font-mono transition-colors"
          >
            CREATE SNAPSHOT
          </button>
          <button
            onClick={loadMemories}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-yellow-500 font-bold py-2 px-4 rounded font-mono transition-colors"
          >
            REFRESH
          </button>
        </div>

        {/* Memory Log */}
        <div className="bg-black border border-yellow-900 rounded p-4">
          <h3 className="text-yellow-500 font-mono font-bold mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            RECENT MEMORIES
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {memories.length === 0 ? (
              <p className="text-gray-600 text-sm font-mono text-center py-4">
                No memories stored yet
              </p>
            ) : (
              memories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-gray-900 border border-gray-800 p-2 rounded hover:border-yellow-900 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="text-yellow-500 mt-1">{getMemoryIcon(memory.memory_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-yellow-400 font-mono text-xs uppercase">
                          {memory.memory_type.replace('_', ' ')}
                        </span>
                        <span className="text-gray-600 font-mono text-xs">
                          {new Date(memory.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-500 font-mono text-xs truncate">
                        {JSON.stringify(memory.data).substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legal Patent Tag */}
        <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-900 rounded">
          <p className="text-yellow-700 font-mono text-xs">
            <strong className="text-yellow-500">LEGAL PATENT:</strong> Property of Ryan James
            Cortright (Lucie Forebs) and John Aaron Slone (DJ G-raffe)
          </p>
        </div>
      </div>
    </div>
  );
}
