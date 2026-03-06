import { useState, useEffect, useRef } from 'react';
import { Trash2, Zap, Database } from 'lucide-react';

interface TrashItem {
  id: string;
  label: string;
  size: string;
  color: string;
}

const TRASH_LABELS = [
  'corrupted_npc_state.bin', 'null_dialect_ref.dat', 'orphaned_memory_shard.hex',
  'expired_session_token.tmp', 'bad_behavior_rule.json', 'overwritten_vault.bak',
  'glitch_trap_residue.raw', 'shadow_overflow.dump', 'failed_sync.log',
  'rogue_process_666.exe', 'dead_loop.js', 'leaked_soul_pointer.mem',
  'daemon_crash_report.core', 'null_npc_ref.ptr', 'dirty_magik_cache.idx',
];

const CRUNCH_CHARS = '█▓▒░▄▀■□▪▫●○◆◇';

function randomCrunch() {
  return Array.from({ length: 12 }, () =>
    CRUNCH_CHARS[Math.floor(Math.random() * CRUNCH_CHARS.length)]
  ).join('');
}

function TrashBlock({ item, onCrunch }: { item: TrashItem; onCrunch: (id: string) => void }) {
  const [crunching, setCrunching] = useState(false);
  const [crunchText, setCrunchText] = useState('');

  const handleCrunch = () => {
    setCrunching(true);
    let frames = 0;
    const interval = setInterval(() => {
      setCrunchText(randomCrunch());
      frames++;
      if (frames > 8) {
        clearInterval(interval);
        onCrunch(item.id);
      }
    }, 60);
  };

  return (
    <button
      onClick={handleCrunch}
      disabled={crunching}
      className="border rounded p-2 text-left transition-all hover:scale-105 active:scale-95"
      style={{
        borderColor: item.color + '60',
        background: item.color + '10',
        minWidth: 120,
        maxWidth: 160,
      }}
    >
      {crunching ? (
        <div className="font-mono text-xs" style={{ color: item.color }}>{crunchText}</div>
      ) : (
        <>
          <div className="text-xs font-bold truncate" style={{ color: item.color }}>{item.label}</div>
          <div className="text-xs text-gray-700 mt-0.5">{item.size}</div>
        </>
      )}
    </button>
  );
}

export default function TrashPactDumpster() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [crunched, setCrunched] = useState(0);
  const [totalCrunched, setTotalCrunched] = useState(0);
  const [dumpsterShake, setDumpsterShake] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [throughput, setThroughput] = useState('0 TB/s');
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899'];

  const spawnItem = () => {
    const label = TRASH_LABELS[Math.floor(Math.random() * TRASH_LABELS.length)];
    const size = `${(Math.random() * 999 + 1).toFixed(1)} MB`;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const id = `${Date.now()}-${Math.random()}`;
    setItems(prev => [...prev.slice(-30), { id, label, color, size }]);
  };

  useEffect(() => {
    for (let i = 0; i < 8; i++) spawnItem();
    spawnRef.current = setInterval(spawnItem, 2800);
    return () => { if (spawnRef.current) clearInterval(spawnRef.current); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput(`${(Math.random() * 8.8 + 0.2).toFixed(2)} TB/s`);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleCrunch = (id: string) => {
    setDumpsterShake(true);
    setGlowPulse(true);
    setTimeout(() => setDumpsterShake(false), 400);
    setTimeout(() => setGlowPulse(false), 600);
    setItems(prev => prev.filter(i => i.id !== id));
    setCrunched(c => c + 1);
    setTotalCrunched(t => t + 1);
  };

  const crunchAll = () => {
    const count = items.length;
    setItems([]);
    setCrunched(c => c + count);
    setTotalCrunched(t => t + count);
    setDumpsterShake(true);
    setGlowPulse(true);
    setTimeout(() => setDumpsterShake(false), 600);
    setTimeout(() => setGlowPulse(false), 800);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div
            className="inline-block transition-all duration-100"
            style={{
              transform: dumpsterShake ? `rotate(${Math.random() * 6 - 3}deg) scale(1.08)` : 'none',
              filter: glowPulse ? 'drop-shadow(0 0 24px #ef4444)' : 'none',
            }}
          >
            <Trash2 className="w-20 h-20 text-red-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-red-500 tracking-widest mt-3">INFINITE TRASH-PACT DUMPSTER</h1>
          <p className="text-gray-700 text-sm mt-1">3D DATA CRUNCHER • HELLSKIN OS WASTE MANAGEMENT</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-950 border border-red-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{items.length}</div>
            <div className="text-xs text-gray-600 mt-1">QUEUED</div>
          </div>
          <div className="bg-gray-950 border border-orange-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-500">{totalCrunched}</div>
            <div className="text-xs text-gray-600 mt-1">TOTAL CRUNCHED</div>
          </div>
          <div className="bg-gray-950 border border-yellow-900 rounded-lg p-4 text-center">
            <div className="text-sm font-bold text-yellow-500">{throughput}</div>
            <div className="text-xs text-gray-600 mt-1">THROUGHPUT</div>
          </div>
        </div>

        <div className="bg-gray-950 border-2 border-red-900 rounded-xl p-6 mb-4" style={{
          boxShadow: glowPulse ? '0 0 40px #ef444430 inset' : 'none',
          transition: 'box-shadow 0.3s',
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-red-600" />
              <span className="text-red-500 font-bold text-sm">DATA QUEUE — CLICK TO CRUNCH</span>
            </div>
            <button
              onClick={crunchAll}
              disabled={items.length === 0}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-900 border border-red-700 text-red-300 hover:bg-red-800 transition-colors text-xs font-bold disabled:opacity-30"
            >
              <Zap className="w-3 h-3" />
              CRUNCH ALL
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[120px]">
            {items.length === 0 ? (
              <div className="w-full flex items-center justify-center text-gray-800 text-sm py-8">
                DUMPSTER EMPTY — GENERATING NEW WASTE...
              </div>
            ) : (
              items.map(item => (
                <TrashBlock key={item.id} item={item} onCrunch={handleCrunch} />
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded p-3 text-xs text-gray-700 text-center">
          TRASH-PACT ENGINE v6.66 • INFINITE CAPACITY • METALLIC CRUNCH PROTOCOL ACTIVE •
          IFFY SHADOW PROCESS: MONITORING
        </div>
      </div>
    </div>
  );
}
