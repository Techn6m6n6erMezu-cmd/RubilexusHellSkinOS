import { useState, useEffect } from 'react';
import { Film, Search, Star, Video, Play, Zap } from 'lucide-react';
import { getDistrictItems, type DistrictItem } from '../services/districtService';

type FormatFilter = 'all' | 'vhs' | 'dvd';
type StoreView = 'rentals' | 'veo';

const VEO_SCENES = [
  { id: 1, title: 'HELLSKIN OPENING CINEMATIC', duration: '2:12', resolution: '4K', style: 'Dark Fantasy', status: 'rendered', frames: 3168 },
  { id: 2, title: 'BIG HORSE GALLOP SEQUENCE', duration: '0:48', resolution: '4K', style: 'Cinematic', status: 'rendered', frames: 1152 },
  { id: 3, title: 'RUBILEXUS ACTIVATION CUTSCENE', duration: '1:30', resolution: '4K', style: 'Sci-Fi Horror', status: 'rendered', frames: 2160 },
  { id: 4, title: 'PUMPKIN CINEMA INTRO', duration: '0:32', resolution: '1080p', style: 'Horror Comedy', status: 'rendering', frames: 768 },
  { id: 5, title: 'SENTIENT COUNCIL REVEAL', duration: '3:00', resolution: '4K', style: 'Psychological', status: 'queued', frames: 4320 },
  { id: 6, title: 'SOVEREIGN GATE BREACH', duration: '1:15', resolution: '4K', style: 'Action', status: 'rendered', frames: 1800 },
];

function VeoPanel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [genPrompt, setGenPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startGen = () => {
    if (!genPrompt.trim()) return;
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setGenerating(false); return 100; }
        return p + 1.5;
      });
    }, 60);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Video className="w-8 h-8 text-gray-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-300 tracking-widest">VEO CUTSCENE ENGINE</h2>
          <p className="text-gray-600 text-xs">HIGH-FIDELITY AI VIDEO GENERATION • SCARECROW VIDEO STUDIO</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-600 text-xs font-bold">ONLINE</span>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-700 rounded-lg p-4">
        <h3 className="text-gray-400 font-bold text-sm mb-3">GENERATE CUTSCENE</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={genPrompt}
            onChange={e => setGenPrompt(e.target.value)}
            placeholder="Describe the scene: dark forest, hellskin warrior, cinematic 4K..."
            className="flex-1 bg-black border border-gray-800 text-gray-300 placeholder-gray-800 px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={startGen}
            disabled={generating || !genPrompt.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors text-xs font-bold disabled:opacity-40"
          >
            <Zap className="w-3 h-3" />
            {generating ? 'RENDERING...' : 'RENDER'}
          </button>
        </div>
        {generating && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>VEO RENDERING FRAMES...</span><span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-black rounded overflow-hidden">
              <div className="h-full bg-gray-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-gray-700 mt-1">
              {Math.floor(progress * 43.2)} / 4320 frames at 24fps
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-gray-400 font-bold text-sm">CUTSCENE LIBRARY</h3>
        {VEO_SCENES.map(scene => (
          <button
            key={scene.id}
            onClick={() => setSelected(selected === scene.id ? null : scene.id)}
            className={`w-full text-left flex items-start gap-3 p-3 border rounded transition-all ${
              selected === scene.id ? 'border-gray-600 bg-gray-900' : 'border-gray-800 bg-gray-950 hover:border-gray-700'
            }`}
          >
            <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-300 font-bold text-sm truncate">{scene.title}</div>
              <div className="text-gray-600 text-xs mt-0.5">
                {scene.duration} • {scene.resolution} • {scene.style}
              </div>
              {selected === scene.id && (
                <div className="text-gray-700 text-xs mt-1">{scene.frames.toLocaleString()} frames rendered</div>
              )}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
              scene.status === 'rendered' ? 'bg-green-950 text-green-600' :
              scene.status === 'rendering' ? 'bg-yellow-950 text-yellow-600 animate-pulse' :
              'bg-gray-900 text-gray-600'
            }`}>{scene.status.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ScarecrowVideo() {
  const [videos, setVideos] = useState<DistrictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState<FormatFilter>('all');
  const [selected, setSelected] = useState<DistrictItem | null>(null);
  const [view, setView] = useState<StoreView>('rentals');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await getDistrictItems('scarecrow_video');
    setVideos(data);
    setLoading(false);
  };

  const filtered = videos.filter(v => {
    const matchSearch = v.item_name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      (v.metadata?.genre || '').toLowerCase().includes(search.toLowerCase());
    const matchFormat = format === 'all' || v.item_type === format;
    return matchSearch && matchFormat;
  });

  const getFormatBadge = (type: string) => {
    if (type === 'vhs') return 'bg-gray-800 border-gray-600 text-gray-300';
    return 'bg-blue-950 border-blue-700 text-blue-300';
  };

  const getDecadeColor = (year: number) => {
    if (year < 1975) return 'text-orange-400';
    if (year < 1985) return 'text-red-400';
    if (year < 1995) return 'text-amber-400';
    return 'text-gray-400';
  };

  const getCopiesDisplay = (copies: number) => {
    return Array(Math.min(copies, 5)).fill(0).map((_, i) => (
      <span key={i} className="text-green-500 text-xs">▮</span>
    ));
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="bg-gradient-to-b from-gray-950 to-black border-b-2 border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Film className="w-12 h-12 text-gray-400" />
            <div>
              <h1 className="text-4xl font-bold text-gray-300 tracking-widest">SCARECROW VIDEO</h1>
              <p className="text-gray-600 font-mono text-sm mt-1">
                SOVEREIGN DISTRICT • 10,000+ TITLES • HELL BRANCH
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-gray-900 border border-gray-700 px-3 py-2">
              <Search className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search titles, genres..."
                className="bg-transparent outline-none text-gray-300 placeholder-gray-700 flex-1 text-sm"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'vhs', 'dvd'] as FormatFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 border text-xs font-bold transition-all ${
                    format === f
                      ? 'bg-gray-700 border-gray-500 text-gray-200'
                      : 'bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-600'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4 mb-2">
            <button
              onClick={() => setView('rentals')}
              className={`px-4 py-1.5 border text-xs font-bold transition-all ${view === 'rentals' ? 'bg-gray-700 border-gray-500 text-gray-200' : 'bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-700'}`}
            >
              VIDEO RENTALS
            </button>
            <button
              onClick={() => setView('veo')}
              className={`flex items-center gap-1 px-4 py-1.5 border text-xs font-bold transition-all ${view === 'veo' ? 'bg-gray-700 border-gray-500 text-gray-200' : 'bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-700'}`}
            >
              <Video className="w-3 h-3" />
              VEO CUTSCENES
            </button>
          </div>

          <div className="mt-3 flex gap-6 text-sm">
            <span className="text-gray-600">{videos.length} titles</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-600">{videos.filter(v => v.item_type === 'vhs').length} VHS</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-600">{videos.filter(v => v.item_type === 'dvd').length} DVD</span>
            <span className="text-gray-700">•</span>
            <span className="text-gray-600">{videos.filter(v => v.metadata?.rare).length} rare</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {view === 'veo' && <VeoPanel />}
        {view === 'rentals' && <>{loading ? (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-700 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-700 font-mono">REWINDING TAPES...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
                className={`text-left border rounded-lg overflow-hidden transition-all ${
                  selected?.id === item.id
                    ? 'border-gray-500 shadow-lg shadow-gray-900/50'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="bg-gray-950 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-gray-200 font-bold text-sm leading-tight">{item.item_name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.metadata?.rare && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                      <span className={`text-xs px-1.5 py-0.5 border rounded font-bold ${getFormatBadge(item.item_type)}`}>
                        {item.item_type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-bold text-sm ${getDecadeColor(item.metadata?.year || 1980)}`}>
                      {item.metadata?.year}
                    </span>
                    <span className="text-gray-700">•</span>
                    <span className="text-gray-500 text-xs">{item.metadata?.runtime}min</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-gray-600 text-xs">{item.metadata?.genre}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-700 text-xs">Copies:</span>
                    <span className="flex gap-0.5">{getCopiesDisplay(item.metadata?.copies || 1)}</span>
                    <span className="text-gray-600 text-xs">({item.metadata?.copies})</span>
                  </div>

                  {selected?.id === item.id && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-gray-700 text-xs">Condition:</span>
                        <span className={`text-xs font-bold ${
                          item.metadata?.condition === 'excellent' ? 'text-green-400' :
                          item.metadata?.condition === 'very_good' ? 'text-teal-400' :
                          item.metadata?.condition === 'good' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {(item.metadata?.condition || 'good').replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-700 font-mono">No titles match your search. Try rewinding.</p>
          </div>
        )}</>}
      </div>

      <div className="border-t border-gray-800 mt-8 p-4 text-center">
        <p className="text-gray-800 font-mono text-xs">
          SCARECROW VIDEO • SOVEREIGN DISTRICT • BE KIND, REWIND • HELLSKIN OS NODE
        </p>
      </div>
    </div>
  );
}
