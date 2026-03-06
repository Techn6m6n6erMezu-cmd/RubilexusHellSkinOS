import { useState, useEffect } from 'react';
import { Gamepad2, Zap, Activity, Cpu, Database, Triangle, Square, Circle, X } from 'lucide-react';
import { getAllNPCs, type NPC } from '../services/simWorldService';

interface PSGame {
  id: string;
  title: string;
  genre: string;
  score: number;
  topPlayer: string;
  color: string;
}

const HELL_GAMES: PSGame[] = [
  { id: '1', title: 'RUBILEXUS: THE PROTOCOL', genre: 'RPG', score: 99999, topPlayer: 'TECHNOMANCER', color: '#ef4444' },
  { id: '2', title: 'PUMPKIN CINEMA HORROR', genre: 'HORROR', score: 88420, topPlayer: 'NPC-CROW', color: '#f97316' },
  { id: '3', title: 'HELLSKIN KOMBAT', genre: 'FIGHTING', score: 76550, topPlayer: 'SATAN', color: '#dc2626' },
  { id: '4', title: 'MAGIK CORE RUNNER', genre: 'ARCADE', score: 65000, topPlayer: 'NPC-MARROW', color: '#eab308' },
  { id: '5', title: 'DAEMONI DRIVE', genre: 'RACING', score: 54200, topPlayer: 'NPC-SHADE', color: '#06b6d4' },
  { id: '6', title: 'SOUL SPHERE 66', genre: 'PLATFORMER', score: 43100, topPlayer: 'NPC-FLUX', color: '#84cc16' },
];

interface HellSpherePSCoreProps {
  onTerminalCommand?: (cmd: string) => void;
}

export default function HellSpherePSCore({ onTerminalCommand }: HellSpherePSCoreProps) {
  const [booted, setBooted] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [selectedGame, setSelectedGame] = useState<PSGame | null>(null);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [systemLoad, setSystemLoad] = useState(0);

  const BOOT_SEQUENCE = [
    'HELL SPHERE PS4 CORE — INITIALIZING...',
    'Loading Satan\'s World kernel...',
    'Syncing with Rubilexus Terminal...',
    'Mounting S6ul Sphere 66...',
    'NPC autonomy system: ONLINE',
    'LEOPARD ANACONDA LINK: ESTABLISHED',
    '[ HELL SPHERE CORE — ONLINE ]',
  ];

  useEffect(() => {
    if (!booted) {
      const interval = setInterval(() => {
        setBootStep(prev => {
          if (prev >= BOOT_SEQUENCE.length - 1) {
            clearInterval(interval);
            setBooted(true);
            loadNPCs();
            return prev;
          }
          return prev + 1;
        });
      }, 350);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (booted) {
      const interval = setInterval(() => {
        setSystemLoad(Math.floor(40 + Math.random() * 35));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [booted]);

  const loadNPCs = async () => {
    const data = await getAllNPCs();
    setNpcs(data.slice(0, 6));
  };

  const sendToTerminal = (cmd: string) => {
    if (onTerminalCommand) {
      onTerminalCommand(cmd);
    }
  };

  if (!booted) {
    return (
      <div className="bg-black min-h-[400px] flex items-center justify-center p-8 font-mono border-2 border-blue-900">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Gamepad2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <div className="text-blue-400 text-2xl font-bold tracking-widest">HELL SPHERE</div>
            <div className="text-blue-700 text-sm">PS4 CORE — SOVEREIGN EDITION</div>
          </div>
          <div className="space-y-2">
            {BOOT_SEQUENCE.slice(0, bootStep + 1).map((line, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm ${i === bootStep ? 'text-blue-400 animate-pulse' : 'text-blue-800'}`}>
                <span className="text-blue-700">{i < bootStep ? '✓' : '►'}</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 h-1 bg-gray-900 rounded overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((bootStep + 1) / BOOT_SEQUENCE.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-blue-400 font-mono border-2 border-blue-900">
      <div className="bg-gradient-to-r from-blue-950/40 to-black border-b-2 border-blue-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-xl font-bold text-blue-300 tracking-widest">HELL SPHERE PS4 CORE</div>
              <div className="text-xs text-blue-700">LINKED: LEOPARD ANACONDA TERMINAL</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span className="text-blue-500">{systemLoad}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">ONLINE</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-3 text-xs">
          <div className="flex items-center gap-1.5 text-blue-600">
            <Triangle className="w-3 h-3 text-green-400 fill-green-400" />
            <Square className="w-3 h-3 text-pink-400 fill-pink-400" />
            <Circle className="w-3 h-3 text-red-400 fill-red-400" />
            <X className="w-3 h-3 text-blue-400 fill-blue-400" />
            <span className="ml-1 text-blue-700">CONTROLLER 1: CONNECTED</span>
          </div>
        </div>
      </div>

      <div className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-blue-400">GAME LIBRARY</h3>
          </div>
          <div className="space-y-1.5">
            {HELL_GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game);
                  sendToTerminal(`hellsphere launch ${game.title.toLowerCase().replace(/\s/g, '_')}`);
                }}
                className={`w-full text-left p-2.5 border transition-all ${
                  selectedGame?.id === game.id
                    ? 'border-blue-500 bg-blue-950/40'
                    : 'border-gray-800 bg-gray-950 hover:border-blue-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: game.color }}></div>
                    <span className="text-gray-200 text-xs font-bold">{game.title}</span>
                  </div>
                  <span className="text-gray-600 text-xs">{game.genre}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-yellow-500 text-xs">{game.score.toLocaleString()} PTS</span>
                  <span className="text-gray-600 text-xs">TOP: {game.topPlayer}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-blue-400">NPC PLAYERS</h3>
          </div>
          <div className="space-y-1.5">
            {npcs.length === 0 ? (
              <p className="text-gray-700 text-xs">No NPC data — start autonomy to populate</p>
            ) : (
              npcs.map(npc => (
                <div key={npc.id} className="border border-gray-800 p-2 bg-gray-950">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-300 text-xs font-bold">{npc.name}</span>
                    <span className="text-gray-600 text-xs uppercase">{npc.personality}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-1 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-yellow-600" style={{ width: `${npc.energy}%` }}></div>
                    </div>
                    <span className="text-yellow-600 text-xs w-8 text-right">{npc.energy}%</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 border border-blue-900 bg-blue-950/20 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-400">TERMINAL LINK</span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Query NPCs', cmd: 'status' },
                { label: 'World Snapshot', cmd: 'magik core snapshot' },
                { label: 'District Scan', cmd: 'districts' },
              ].map(item => (
                <button
                  key={item.cmd}
                  onClick={() => sendToTerminal(item.cmd)}
                  className="w-full text-left px-3 py-1.5 bg-black border border-blue-900 text-blue-400 hover:border-blue-600 transition-colors text-xs flex items-center gap-2"
                >
                  <Zap className="w-3 h-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedGame && (
        <div className="border-t border-blue-900 p-4 bg-blue-950/10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: selectedGame.color }}></div>
            <span className="text-blue-300 font-bold">{selectedGame.title}</span>
            <span className="text-blue-700 text-xs">— LAUNCHED VIA TERMINAL</span>
          </div>
        </div>
      )}
    </div>
  );
}
