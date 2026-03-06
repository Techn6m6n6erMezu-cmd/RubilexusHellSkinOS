import { useState, useEffect } from 'react';
import { Cpu, Zap, Star, Download } from 'lucide-react';

interface AvatarKard {
  id: string;
  name: string;
  class: string;
  rarity: 'common' | 'rare' | 'legendary' | 'cursed';
  power: number;
  colors: [string, string];
  pattern: string;
  generated: boolean;
}

const KARD_CLASSES = ['SHADOW AGENT', 'VOID KNIGHT', 'DATA WITCH', 'SOUL REAPER', 'CYBER MONK', 'HELL SCOUT', 'RUNE SMITH', 'GLITCH LORD'];
const KARD_NAMES = ['KAITO', 'NYXARA', 'VOXX', 'SKEL-9', 'RUNIK', 'ZEPHARA', 'OMREK', 'PYRAXIS', 'LUNIK', 'GREMLIN-X'];
const RARITY_COLORS: Record<AvatarKard['rarity'], string> = {
  common: '#6b7280', rare: '#3b82f6', legendary: '#f59e0b', cursed: '#ef4444',
};
const PATTERNS = ['circuit', 'wave', 'hex', 'static', 'dots'];

function generateKard(): AvatarKard {
  const rarityRoll = Math.random();
  const rarity: AvatarKard['rarity'] =
    rarityRoll > 0.97 ? 'cursed' : rarityRoll > 0.9 ? 'legendary' : rarityRoll > 0.7 ? 'rare' : 'common';

  const hue1 = Math.floor(Math.random() * 360);
  const hue2 = (hue1 + 120 + Math.floor(Math.random() * 80)) % 360;

  return {
    id: `kard-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: KARD_NAMES[Math.floor(Math.random() * KARD_NAMES.length)] + '-' + Math.floor(Math.random() * 99 + 1),
    class: KARD_CLASSES[Math.floor(Math.random() * KARD_CLASSES.length)],
    rarity,
    power: Math.floor(rarity === 'cursed' ? 90 + Math.random() * 10 : rarity === 'legendary' ? 75 + Math.random() * 20 : rarity === 'rare' ? 50 + Math.random() * 30 : 20 + Math.random() * 40),
    colors: [`hsl(${hue1}, 80%, 55%)`, `hsl(${hue2}, 80%, 45%)`],
    pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
    generated: false,
  };
}

function KardAvatar({ kard }: { kard: AvatarKard }) {
  const [c1, c2] = kard.colors;
  const cx = 40; const cy = 38;

  const renderPattern = () => {
    switch (kard.pattern) {
      case 'circuit':
        return (
          <g stroke={c1} strokeWidth="0.6" opacity="0.4">
            {[18, 28, 48, 58].map(x => <line key={x} x1={x} y1="12" x2={x} y2="64" />)}
            {[20, 32, 44, 56].map(y => <line key={y} x1="12" y1={y} x2="68" y2={y} />)}
          </g>
        );
      case 'hex':
        return (
          <g fill="none" stroke={c2} strokeWidth="0.5" opacity="0.3">
            {[30, 50].map(x => [25, 45, 55].map(y => (
              <polygon key={`${x}-${y}`} points={`${x},${y - 8} ${x + 7},${y - 4} ${x + 7},${y + 4} ${x},${y + 8} ${x - 7},${y + 4} ${x - 7},${y - 4}`} />
            )))}
          </g>
        );
      default:
        return (
          <g fill={c1} opacity="0.2">
            {Array.from({ length: 16 }).map((_, i) => (
              <circle key={i} cx={12 + (i % 4) * 18} cy={16 + Math.floor(i / 4) * 14} r={2} />
            ))}
          </g>
        );
    }
  };

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <defs>
        <radialGradient id={`grad-${kard.id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx="8" fill={`url(#grad-${kard.id})`} stroke={c1} strokeWidth="1.5" />
      {renderPattern()}
      <circle cx={cx} cy={cy - 4} r="14" fill={c1} opacity="0.15" stroke={c1} strokeWidth="1" />
      <ellipse cx={cx - 5} cy={cy - 7} rx="3" ry="3.5" fill={c1} />
      <ellipse cx={cx + 5} cy={cy - 7} rx="3" ry="3.5" fill={c1} />
      <circle cx={cx - 5} cy={cy - 7} r="1.2" fill="black" />
      <circle cx={cx + 5} cy={cy - 7} r="1.2" fill="black" />
      <ellipse cx={cx} cy={cy + 2} rx="5" ry="1.5" fill={c1} opacity="0.7" stroke={c1} strokeWidth="0.5" />
      <ellipse cx={cx} cy={cy + 16} rx="10" ry="6" fill={c2} opacity="0.2" />
      <text x={cx} y="74" textAnchor="middle" fontSize="5" fill={c1} opacity="0.6" fontFamily="monospace">{kard.name}</text>
    </svg>
  );
}

function KardDisplay({ kard }: { kard: AvatarKard }) {
  const rarityColor = RARITY_COLORS[kard.rarity];

  return (
    <div
      className="border-2 rounded-xl p-3 transition-all hover:scale-102 cursor-default"
      style={{
        borderColor: rarityColor,
        background: `${rarityColor}08`,
        boxShadow: kard.rarity === 'cursed' || kard.rarity === 'legendary' ? `0 0 16px ${rarityColor}30` : 'none',
      }}
    >
      <div className="flex items-center gap-1 mb-2">
        <span
          className="text-xs px-1.5 py-0.5 rounded font-bold uppercase"
          style={{ background: rarityColor + '30', color: rarityColor, border: `1px solid ${rarityColor}50` }}
        >
          {kard.rarity}
        </span>
        {(kard.rarity === 'legendary' || kard.rarity === 'cursed') && (
          <Star className="w-3 h-3" style={{ color: rarityColor }} />
        )}
      </div>

      <div className="flex justify-center mb-2">
        <KardAvatar kard={kard} />
      </div>

      <div className="text-center">
        <div className="font-bold text-xs" style={{ color: kard.colors[0] }}>{kard.name}</div>
        <div className="text-gray-600 text-xs mt-0.5">{kard.class}</div>
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-yellow-500 text-xs font-bold">{kard.power} PWR</span>
        </div>
      </div>
    </div>
  );
}

export default function KadosKards() {
  const [kards, setKards] = useState<AvatarKard[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genCount, setGenCount] = useState(1);
  const [totalGenerated, setTotalGenerated] = useState(0);

  const generate = () => {
    setGenerating(true);
    let generated = 0;
    const interval = setInterval(() => {
      setKards(prev => {
        const next = [generateKard(), ...prev].slice(0, 20);
        return next;
      });
      setTotalGenerated(t => t + 1);
      generated++;
      if (generated >= genCount) {
        clearInterval(interval);
        setGenerating(false);
      }
    }, 300);
  };

  useEffect(() => {
    generate();
  }, []);

  const legendaryCount = kards.filter(k => k.rarity === 'legendary').length;
  const cursedCount = kards.filter(k => k.rarity === 'cursed').length;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="bg-gradient-to-b from-gray-950 to-black border-b-2 border-yellow-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Cpu className="w-10 h-10 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold text-yellow-500 tracking-widest">KADO'S KARDS</h1>
                <p className="text-yellow-900 text-sm">AVATAR & SPRITE GENERATOR • NANO BANANA 2 ENGINE</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-yellow-700">NANO BANANA 2</div>
              <div className="flex items-center gap-1 justify-end">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-yellow-600 text-xs">GEN ENGINE ONLINE</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3 max-w-lg">
            <div className="bg-gray-900 border border-gray-800 rounded p-2 text-center">
              <div className="text-xl font-bold text-gray-400">{kards.length}</div>
              <div className="text-xs text-gray-700">IN DECK</div>
            </div>
            <div className="bg-yellow-950/30 border border-yellow-900 rounded p-2 text-center">
              <div className="text-xl font-bold text-yellow-500">{totalGenerated}</div>
              <div className="text-xs text-yellow-900">TOTAL GEN</div>
            </div>
            <div className="bg-blue-950/30 border border-blue-900 rounded p-2 text-center">
              <div className="text-xl font-bold text-blue-400">{legendaryCount}</div>
              <div className="text-xs text-blue-900">LEGENDARY</div>
            </div>
            <div className="bg-red-950/30 border border-red-900 rounded p-2 text-center">
              <div className="text-xl font-bold text-red-400">{cursedCount}</div>
              <div className="text-xs text-red-900">CURSED</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-2.5 bg-yellow-900 border-2 border-yellow-700 text-yellow-300 hover:bg-yellow-800 transition-colors font-bold text-sm disabled:opacity-40"
          >
            <Cpu className="w-4 h-4" />
            {generating ? 'GENERATING...' : `GENERATE ${genCount} KARD${genCount > 1 ? 'S' : ''}`}
          </button>

          <div className="flex items-center gap-2">
            {[1, 3, 5, 10].map(n => (
              <button
                key={n}
                onClick={() => setGenCount(n)}
                className={`px-3 py-2 border text-xs font-bold transition-all ${
                  genCount === n
                    ? 'bg-yellow-900 border-yellow-700 text-yellow-300'
                    : 'bg-gray-950 border-gray-800 text-gray-600 hover:border-yellow-900'
                }`}
              >
                x{n}
              </button>
            ))}
          </div>

          <button
            onClick={() => setKards([])}
            className="ml-auto flex items-center gap-1 px-4 py-2 border border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400 transition-colors text-xs"
          >
            <Download className="w-3 h-3" />
            CLEAR DECK
          </button>
        </div>

        {generating && (
          <div className="text-center py-6 mb-4">
            <Cpu className="w-8 h-8 text-yellow-500 mx-auto animate-spin mb-2" />
            <p className="text-yellow-700 text-sm">NANO BANANA 2 GENERATING AVATARS...</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {kards.map(kard => (
            <KardDisplay key={kard.id} kard={kard} />
          ))}
        </div>

        {kards.length === 0 && !generating && (
          <div className="text-center py-16">
            <Cpu className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <p className="text-gray-700">Click GENERATE KARD to summon avatars via Nano Banana 2</p>
          </div>
        )}
      </div>
    </div>
  );
}
