import { useState, useEffect } from 'react';
import { BookOpen, Star, Search, Sparkles, Download } from 'lucide-react';
import { getDistrictItems, type DistrictItem } from '../services/districtService';

const AVATAR_STYLES = ['Comic Hero', 'Dark Villain', 'Cyber Entity', 'Occult Shaman', 'Haezarian Ghost'];
const AVATAR_PALETTES = [
  { name: 'Hell Red', bg: '#1a0000', accent: '#ef4444' },
  { name: 'Void Black', bg: '#050505', accent: '#a855f7' },
  { name: 'Neon Toxic', bg: '#001a00', accent: '#22c55e' },
  { name: 'Bone White', bg: '#0a0a08', accent: '#e5e7eb' },
  { name: 'Inferno Gold', bg: '#1a0e00', accent: '#f59e0b' },
];

function NanaBanana2Studio() {
  const [style, setStyle] = useState(AVATAR_STYLES[0]);
  const [palette, setPalette] = useState(AVATAR_PALETTES[0]);
  const [name, setName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sprite, setSprite] = useState<{ name: string; style: string; palette: typeof AVATAR_PALETTES[0] } | null>(null);

  const generate = () => {
    if (!name.trim()) return;
    setGenerating(true);
    setSprite(null);
    setTimeout(() => {
      setSprite({ name: name.trim(), style, palette });
      setGenerating(false);
    }, 1800);
  };

  const SpritePreview = ({ s }: { s: typeof sprite }) => {
    if (!s) return null;
    return (
      <div className="bg-black border border-gray-700 rounded p-4 text-center">
        <div
          className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center mb-3"
          style={{ backgroundColor: s.palette.bg, borderColor: s.palette.accent }}
        >
          <div className="text-3xl font-black font-mono" style={{ color: s.palette.accent }}>
            {s.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div className="text-gray-300 font-bold text-sm">{s.name}</div>
        <div className="text-gray-600 text-xs mt-1">{s.style}</div>
        <div className="text-xs mt-1 font-bold" style={{ color: s.palette.accent }}>{s.palette.name}</div>
        <button className="mt-3 flex items-center gap-1 mx-auto text-xs text-gray-600 hover:text-gray-400 transition-colors">
          <Download className="w-3 h-3" />
          EXPORT SPRITE
        </button>
      </div>
    );
  };

  return (
    <div className="mt-8 bg-gray-900/50 border-2 border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-8 h-8 text-gray-300" />
        <div>
          <h2 className="text-xl font-bold text-gray-300 tracking-widest">NANO BANANA 2</h2>
          <p className="text-gray-600 text-xs font-mono">AVATAR & SPRITE GENERATOR • KADO'S KARDS EXCLUSIVE</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') generate(); }}
            placeholder="Avatar name..."
            className="w-full bg-black border border-gray-700 px-3 py-2 text-gray-300 placeholder-gray-700 font-mono text-sm outline-none focus:border-gray-500"
          />
          <div>
            <div className="text-xs text-gray-600 font-bold mb-2">STYLE</div>
            <div className="flex flex-wrap gap-1">
              {AVATAR_STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-2 py-1 text-xs border font-mono transition-all ${
                    style === s ? 'bg-gray-700 border-gray-500 text-gray-200' : 'bg-black border-gray-800 text-gray-600 hover:border-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-bold mb-2">PALETTE</div>
            <div className="flex flex-wrap gap-1">
              {AVATAR_PALETTES.map(p => (
                <button
                  key={p.name}
                  onClick={() => setPalette(p)}
                  className={`px-2 py-1 text-xs border font-mono transition-all ${
                    palette.name === p.name ? 'border-gray-400' : 'border-gray-800 hover:border-gray-600'
                  }`}
                  style={{ color: p.accent, backgroundColor: p.bg }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={generate}
            disabled={!name.trim() || generating}
            className={`w-full py-3 font-bold text-sm border-2 font-mono transition-all ${
              generating
                ? 'bg-gray-800 border-gray-600 text-gray-500 animate-pulse'
                : 'bg-gray-800 border-gray-500 text-gray-200 hover:bg-gray-700'
            } disabled:opacity-30`}
          >
            {generating ? 'NANO BANANA GENERATING...' : 'GENERATE AVATAR'}
          </button>
        </div>

        <div>
          {generating ? (
            <div className="flex items-center justify-center h-full">
              <Sparkles className="w-8 h-8 text-gray-600 animate-spin" />
            </div>
          ) : sprite ? (
            <SpritePreview s={sprite} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-800 text-xs font-mono text-center">
              Enter a name and click Generate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KadosKomics() {
  const [comics, setComics] = useState<DistrictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DistrictItem | null>(null);
  const [genre, setGenre] = useState<string>('all');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await getDistrictItems('kados_komics');
    setComics(data);
    setLoading(false);
  };

  const genres = ['all', ...Array.from(new Set(comics.map(c => c.metadata?.genre?.split('/')[0] || 'Unknown')))];

  const filtered = comics.filter(c => {
    const matchSearch = c.item_name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === 'all' || (c.metadata?.genre || '').includes(genre);
    return matchSearch && matchGenre;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'text-green-400 border-green-800';
      case 'near_mint': return 'text-teal-400 border-teal-800';
      case 'very_fine': return 'text-cyan-400 border-cyan-800';
      case 'fine': return 'text-blue-400 border-blue-800';
      case 'good': return 'text-yellow-400 border-yellow-800';
      default: return 'text-gray-400 border-gray-700';
    }
  };

  const getCoverPattern = (name: string) => {
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const hues = [0, 15, 30, 200, 270, 120];
    return hues[hash % hues.length];
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono">
      <div className="bg-gradient-to-b from-gray-900 to-black border-b-2 border-red-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-12 h-12 text-red-500" />
            <div>
              <h1 className="text-4xl font-bold text-red-400 tracking-widest">KADO'S KOMICS</h1>
              <p className="text-red-800 font-mono text-sm mt-1">
                SOVEREIGN DISTRICT • HELL-GRADE PRINT SHOP
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-gray-900 border border-gray-700 px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search the collection..."
                className="bg-transparent outline-none text-gray-300 placeholder-gray-700 flex-1 text-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {genres.slice(0, 5).map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`px-3 py-2 border text-xs font-bold transition-all ${
                    genre === g
                      ? 'bg-red-900 border-red-600 text-red-300'
                      : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-red-800'
                  }`}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-gray-500">{comics.length} titles in stock</span>
            <span className="text-red-700">•</span>
            <span className="text-gray-500">{comics.filter(c => c.metadata?.rare).length} rare</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-red-800 mx-auto mb-4 animate-pulse" />
            <p className="text-red-800 font-mono">LOADING COLLECTION...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => {
              const hue = getCoverPattern(item.item_name);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  className={`text-left border-2 rounded transition-all overflow-hidden ${
                    selected?.id === item.id
                      ? 'border-red-500 shadow-lg shadow-red-900/40'
                      : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div
                    className="h-36 relative flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue},70%,10%), hsl(${hue + 30},60%,5%))`,
                      borderBottom: `2px solid hsl(${hue},50%,25%)`
                    }}
                  >
                    <BookOpen
                      className="w-12 h-12 opacity-30"
                      style={{ color: `hsl(${hue},60%,60%)` }}
                    />
                    <div
                      className="absolute bottom-2 left-2 text-[10px] font-bold px-1 py-0.5 rounded"
                      style={{ background: `hsl(${hue},60%,15%)`, color: `hsl(${hue},80%,70%)` }}
                    >
                      {item.metadata?.format === undefined ? 'COMIC' : item.metadata.format}
                    </div>
                    {item.metadata?.rare && (
                      <div className="absolute top-2 right-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-950 p-3">
                    <h3 className="text-gray-200 font-bold text-sm mb-1 truncate">{item.item_name}</h3>

                    {item.metadata?.issue && (
                      <div className="text-xs text-gray-600 mb-1">
                        Issue #{item.metadata.issue} • {item.metadata.year}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{item.metadata?.genre || 'Unknown'}</span>
                      <span className={`text-xs border px-1.5 py-0.5 rounded font-bold ${getConditionColor(item.metadata?.condition || 'good')}`}>
                        {(item.metadata?.condition || 'good').replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {selected?.id === item.id && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                        {item.metadata?.pages && (
                          <p className="text-gray-600 text-xs mt-2">{item.metadata.pages} pages</p>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-700 font-mono">No comics match your search.</p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <NanaBanana2Studio />
      </div>

      <div className="border-t border-red-900 mt-8 p-4 text-center">
        <p className="text-gray-800 font-mono text-xs">
          KADO'S KARDS & KOMICS • SOVEREIGN DISTRICT • NANO BANANA 2 AVATAR ENGINE
        </p>
      </div>
    </div>
  );
}
