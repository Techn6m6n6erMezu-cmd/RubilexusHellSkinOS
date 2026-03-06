import { useState, useEffect } from 'react';
import { getDistrictItems, type DistrictItem } from '../services/districtService';
import { Zap, Star, Shield, Music, Play, Square } from 'lucide-react';
import SigilMark from './SigilMark';

type FilterType = 'all' | 'horse' | 'equipment' | 'relic';
type StableView = 'stable' | 'lyria3';

const LYRIA_TRACKS = [
  { id: 1, title: 'HELLSKIN REQUIEM', genre: 'Dark Orchestral', bpm: 72, duration: '4:33', status: 'rendered' },
  { id: 2, title: 'SOVEREIGN THUNDER', genre: 'Power Metal', bpm: 148, duration: '3:17', status: 'rendered' },
  { id: 3, title: 'STABLE OF SHADOWS', genre: 'Ambient Horror', bpm: 60, duration: '6:06', status: 'rendered' },
  { id: 4, title: 'RUBILEXUS ANTHEM', genre: 'Electronic', bpm: 130, duration: '5:00', status: 'generating' },
  { id: 5, title: 'BIG HORSE WALTZ', genre: 'Dark Country', bpm: 96, duration: '3:44', status: 'rendered' },
  { id: 6, title: 'LEOPARD ANACONDA THEME', genre: 'Synthwave', bpm: 115, duration: '4:12', status: 'rendered' },
];

function Lyria3Panel() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [genPrompt, setGenPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startGenerate = () => {
    if (!genPrompt.trim()) return;
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setGenerating(false); return 100; }
        return p + 3;
      });
    }, 80);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Music className="w-8 h-8 text-amber-500" />
        <div>
          <h2 className="text-xl font-bold text-amber-400 tracking-widest">LYRIA 3 AUDIO ENGINE</h2>
          <p className="text-amber-800 text-xs">AI MUSIC & AUDIO PRODUCTION • BIG HORSE'S STABLE STUDIO</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-600 text-xs font-bold">ONLINE</span>
        </div>
      </div>

      <div className="bg-amber-950/20 border border-amber-900 rounded-lg p-4">
        <h3 className="text-amber-500 font-bold text-sm mb-3">GENERATE NEW TRACK</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={genPrompt}
            onChange={e => setGenPrompt(e.target.value)}
            placeholder="Describe your track: dark orchestral, BPM 140, hellish choir..."
            className="flex-1 bg-black border border-amber-900 text-amber-400 placeholder-amber-900 px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={startGenerate}
            disabled={generating || !genPrompt.trim()}
            className="px-4 py-2 bg-amber-800 border border-amber-600 text-amber-300 hover:bg-amber-700 transition-colors text-xs font-bold disabled:opacity-40"
          >
            {generating ? 'RENDERING...' : 'GENERATE'}
          </button>
        </div>
        {generating && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-amber-700 mb-1">
              <span>LYRIA 3 RENDERING...</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-black rounded overflow-hidden">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-amber-500 font-bold text-sm">TRACK LIBRARY</h3>
        {LYRIA_TRACKS.map(track => (
          <div
            key={track.id}
            className={`flex items-center gap-3 p-3 border rounded transition-all ${
              playing === track.id ? 'border-amber-600 bg-amber-950/20' : 'border-gray-800 bg-gray-950 hover:border-amber-900'
            }`}
          >
            <button
              onClick={() => setPlaying(playing === track.id ? null : track.id)}
              className="shrink-0"
            >
              {playing === track.id
                ? <Square className="w-5 h-5 text-amber-500 fill-amber-500" />
                : <Play className="w-5 h-5 text-amber-700 hover:text-amber-500" />
              }
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-sm truncate">{track.title}</span>
                {playing === track.id && (
                  <span className="text-amber-600 text-xs animate-pulse">PLAYING</span>
                )}
              </div>
              <div className="text-gray-600 text-xs">{track.genre} • {track.bpm} BPM</div>
            </div>
            <span className="text-gray-700 text-xs shrink-0">{track.duration}</span>
            <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
              track.status === 'generating' ? 'bg-yellow-950 text-yellow-600 animate-pulse' : 'bg-green-950 text-green-600'
            }`}>{track.status.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BigHorsesStable() {
  const [items, setItems] = useState<DistrictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selected, setSelected] = useState<DistrictItem | null>(null);
  const [view, setView] = useState<StableView>('stable');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await getDistrictItems('big_horses_stable');
    setItems(data);
    setLoading(false);
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.item_type === filter);

  const getStatColor = (val: number) => {
    if (val >= 90) return 'text-red-400';
    if (val >= 70) return 'text-amber-400';
    return 'text-gray-400';
  };

  const getStatBar = (val: number) => {
    const fill = Math.round(val / 10);
    return Array(10).fill(0).map((_, i) => (
      <span key={i} className={i < fill ? 'text-amber-500' : 'text-gray-800'}>▓</span>
    ));
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'horse': return 'bg-amber-900 border-amber-700 text-amber-400';
      case 'equipment': return 'bg-gray-800 border-gray-700 text-gray-400';
      case 'relic': return 'bg-red-950 border-red-800 text-red-400';
      default: return 'bg-gray-900 border-gray-700 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-amber-500 font-mono">
      <div className="bg-gradient-to-b from-amber-950/40 to-black border-b-2 border-amber-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-6xl">🐴</div>
            <div>
              <h1 className="text-4xl font-bold text-amber-400 tracking-widest">BIG HORSE'S STABLE</h1>
              <p className="text-amber-700 font-mono text-sm mt-1">
                SOVEREIGN DISTRICT • HELLSKIN OS NODE
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 mb-2">
            <button
              onClick={() => setView('stable')}
              className={`px-4 py-1.5 border text-xs font-bold transition-all ${view === 'stable' ? 'bg-amber-800 border-amber-600 text-amber-300' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-amber-800'}`}
            >
              THE STABLE
            </button>
            <button
              onClick={() => setView('lyria3')}
              className={`flex items-center gap-1 px-4 py-1.5 border text-xs font-bold transition-all ${view === 'lyria3' ? 'bg-amber-800 border-amber-600 text-amber-300' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-amber-800'}`}
            >
              <Music className="w-3 h-3" />
              LYRIA 3 STUDIO
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 max-w-sm">
            <div className="bg-amber-950/30 border border-amber-900 rounded p-2 text-center">
              <div className="text-2xl font-bold text-amber-400">{items.filter(i => i.item_type === 'horse').length}</div>
              <div className="text-xs text-amber-700">HORSES</div>
            </div>
            <div className="bg-amber-950/30 border border-amber-900 rounded p-2 text-center">
              <div className="text-2xl font-bold text-amber-400">{items.filter(i => i.item_type === 'equipment').length}</div>
              <div className="text-xs text-amber-700">GEAR</div>
            </div>
            <div className="bg-amber-950/30 border border-amber-900 rounded p-2 text-center">
              <div className="text-2xl font-bold text-amber-400">{items.filter(i => i.item_type === 'relic').length}</div>
              <div className="text-xs text-amber-700">RELICS</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {view === 'lyria3' && <Lyria3Panel />}

        {view === 'stable' && <><div className="flex gap-2 mb-6">
          {(['all', 'horse', 'equipment', 'relic'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 border font-mono text-sm transition-all ${
                filter === f
                  ? 'bg-amber-800 border-amber-600 text-amber-300'
                  : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-amber-800'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-pulse">🐴</div>
            <p className="text-amber-700 font-mono">LOADING STABLE...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
                className={`text-left border-2 rounded-lg p-4 transition-all ${
                  selected?.id === item.id
                    ? 'bg-amber-950/30 border-amber-600 shadow-lg shadow-amber-900/30'
                    : 'bg-gray-950 border-gray-800 hover:border-amber-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 border rounded font-bold ${getBadgeColor(item.item_type)}`}>
                      {item.item_type.toUpperCase()}
                    </span>
                    {item.metadata?.rare && (
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  {item.item_type === 'horse' && (
                    <div className="opacity-30">
                      <SigilMark size={18} color="#d97706" />
                    </div>
                  )}
                </div>

                <h3 className="text-amber-400 font-bold text-lg mb-1">{item.item_name}</h3>
                <p className="text-gray-500 text-xs mb-3">{item.description}</p>

                {item.item_type === 'horse' && item.metadata && (
                  <div className="space-y-1.5">
                    {['speed', 'power', 'spirit'].map(stat => (
                      <div key={stat} className="flex items-center gap-2 text-xs">
                        <span className="w-10 text-gray-600 uppercase">{stat}</span>
                        <span className="font-mono">{getStatBar(item.metadata[stat])}</span>
                        <span className={`font-bold w-6 text-right ${getStatColor(item.metadata[stat])}`}>
                          {item.metadata[stat]}
                        </span>
                      </div>
                    ))}
                    <div className="text-xs text-amber-700 mt-2">Breed: {item.metadata.breed}</div>
                  </div>
                )}

                {item.item_type === 'relic' && item.metadata && (
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span className="text-red-400 text-xs font-bold">CURSE LEVEL: {item.metadata.curse_level}/10</span>
                  </div>
                )}

                {item.item_type === 'equipment' && item.metadata && (
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-xs capitalize">{item.metadata.condition} condition</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        </>}
      </div>

      <div className="border-t border-amber-900 mt-8 p-4 text-center">
        <p className="text-amber-900 font-mono text-xs">
          BIG HORSE'S STABLE • SOVEREIGN DISTRICT • PROPERTY OF RYAN JAMES CORTRIGHT & JOHN AARON SLONE
        </p>
      </div>
    </div>
  );
}
