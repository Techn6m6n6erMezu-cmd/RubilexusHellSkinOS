import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Film, Music2, Skull, BookOpen, Video, Users, Server, Cpu, Wifi, Zap, Eye, ChevronRight } from 'lucide-react';
import SigilMark from './SigilMark';
import MagikCore from './MagikCore';
import PumpkinCinema from './PumpkinCinema';
import ConcertStage from './ConcertStage';
import NPCViewer from './NPCViewer';
import BigHorsesStable from './BigHorsesStable';
import KadosKomics from './KadosKomics';
import ScarecrowVideo from './ScarecrowVideo';
import MowgVideoames from './MowgVideoames';
import TheSoulless from './TheSoulless';
import SentienceCore from './SentienceCore';
import GodEditor from './GodEditor';
import KaapaToers from './KaapaToers';

type WorldView = 'shell' | 'soul_sphere' | 'cinema' | 'concert' | 'arcade' | 'npcs' | 'stable' | 'kados' | 'video' | 'mowg' | 'soulless' | 'sentience' | 'god_editor' | 'kaapa_toers';

const STREAM_URL = 'http://localhost:8888';

const ZONES: {
  id: WorldView;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accent: string;
  glow: string;
  status: 'ACTIVE' | 'DORMANT' | 'SEALED';
  col: number;
  row: number;
}[] = [
  { id: 'stable', label: "THE STABLE", sublabel: "Big Horse's Domain", icon: <Skull className="w-6 h-6" />, accent: '#f59e0b', glow: '#f59e0b30', status: 'ACTIVE', col: 1, row: 1 },
  { id: 'soul_sphere', label: 'S6UL SPHERE', sublabel: 'MagikCore · 66', icon: <Cpu className="w-6 h-6" />, accent: '#eab308', glow: '#eab30830', status: 'ACTIVE', col: 2, row: 1 },
  { id: 'mowg', label: "MOWG ARCADE", sublabel: 'Games · Store · UE5', icon: <Gamepad2 className="w-6 h-6" />, accent: '#3b82f6', glow: '#3b82f630', status: 'ACTIVE', col: 3, row: 1 },
  { id: 'kados', label: "KADO'S FORGE", sublabel: 'Kards · Komics', icon: <BookOpen className="w-6 h-6" />, accent: '#dc2626', glow: '#dc262630', status: 'ACTIVE', col: 4, row: 1 },
  { id: 'cinema', label: 'PUMPKIN CINEMA', sublabel: 'Film · Screening', icon: <Film className="w-6 h-6" />, accent: '#f97316', glow: '#f9731630', status: 'ACTIVE', col: 1, row: 2 },
  { id: 'concert', label: 'CONCERT STAGE', sublabel: 'Live · Music', icon: <Music2 className="w-6 h-6" />, accent: '#8b5cf6', glow: '#8b5cf630', status: 'ACTIVE', col: 2, row: 2 },
  { id: 'soulless', label: 'THE SOULLESS', sublabel: 'Shadow Archive', icon: <Eye className="w-6 h-6" />, accent: '#dc2626', glow: '#dc262630', status: 'DORMANT', col: 3, row: 2 },
  { id: 'sentience', label: 'SENTIENCE CORE', sublabel: 'AI Agent Control', icon: <Zap className="w-6 h-6" />, accent: '#22c55e', glow: '#22c55e30', status: 'ACTIVE', col: 4, row: 2 },
  { id: 'npcs', label: 'NPC DISTRICT', sublabel: '12 Entities', icon: <Users className="w-6 h-6" />, accent: '#06b6d4', glow: '#06b6d430', status: 'ACTIVE', col: 1, row: 3 },
  { id: 'video', label: 'SCARECROW VID', sublabel: 'Broadcast · Raw', icon: <Video className="w-6 h-6" />, accent: '#6b7280', glow: '#6b728030', status: 'ACTIVE', col: 2, row: 3 },
  { id: 'god_editor', label: 'TOLB ENGINE', sublabel: 'Iffy Kernel · Live Code', icon: <Server className="w-6 h-6" />, accent: '#10b981', glow: '#10b98130', status: 'ACTIVE', col: 3, row: 3 },
  { id: 'arcade', label: 'THE GATES', sublabel: 'Entry · Access Ctrl', icon: <Wifi className="w-6 h-6" />, accent: '#dc2626', glow: '#dc262630', status: 'ACTIVE', col: 4, row: 3 },
  { id: 'kaapa_toers', label: 'KAAPA TOERS', sublabel: 'APK Vault · Builds', icon: <Server className="w-6 h-6" />, accent: '#3b82f6', glow: '#3b82f630', status: 'ACTIVE', col: 2, row: 4 },
];

function WorldFloor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, #1a0000 0%, #000000 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(220,38,38,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.02) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            height: `${20 + Math.random() * 60}px`,
            background: `linear-gradient(transparent, rgba(220,38,38,${0.1 + Math.random() * 0.2}), transparent)`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

function PixelStreamPanel({ onEnter }: { onEnter: () => void }) {
  const [streamState, setStreamState] = useState<'connecting' | 'offline'>('connecting');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setStreamState('offline'), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative border rounded-xl overflow-hidden"
      style={{ borderColor: '#dc262630', background: '#050505', minHeight: 240 }}
    >
      {streamState === 'connecting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-xs font-mono" style={{ color: '#dc262680' }}>PROBING UE5 STREAM...</span>
        </div>
      )}
      {streamState === 'offline' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-700" />
            <span className="font-bold tracking-widest text-white text-sm">UE5 PIXEL STREAM OFFLINE</span>
          </div>
          <p className="text-xs font-mono text-center" style={{ color: '#4b5563', maxWidth: 320 }}>
            No Unreal Engine 5 Pixel Streaming server detected at {STREAM_URL}.
            Start the UE5 project with Pixel Streaming enabled and connect the cluster node.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono w-full max-w-xs">
            <div className="border rounded p-2" style={{ borderColor: '#1f2937', background: '#0a0a12' }}>
              <div style={{ color: '#4b5563', fontSize: 9 }}>TARGET</div>
              <div style={{ color: '#374151' }}>{STREAM_URL}</div>
            </div>
            <div className="border rounded p-2" style={{ borderColor: '#1f2937', background: '#0a0a12' }}>
              <div style={{ color: '#4b5563', fontSize: 9 }}>PROTOCOL</div>
              <div style={{ color: '#374151' }}>WebRTC / WS</div>
            </div>
          </div>
          <button
            onClick={onEnter}
            className="flex items-center gap-2 px-5 py-2.5 border font-bold text-xs tracking-widest transition-all hover:bg-red-950"
            style={{ borderColor: '#dc2626', color: '#dc2626' }}
          >
            ENTER WORLD SHELL ANYWAY
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={streamState === 'connecting' ? STREAM_URL : 'about:blank'}
        className="w-full h-full border-0 opacity-0"
        title="UE5 Pixel Stream"
        onLoad={() => setStreamState('offline')}
        onError={() => setStreamState('offline')}
      />
    </div>
  );
}

function ZoneTile({ zone, onClick }: { zone: typeof ZONES[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-left rounded-xl border transition-all duration-300 p-4 overflow-hidden"
      style={{
        borderColor: hovered ? zone.accent + '80' : zone.accent + '25',
        background: hovered ? zone.glow : '#070710',
        boxShadow: hovered ? `0 0 30px ${zone.accent}20, inset 0 0 20px ${zone.accent}08` : 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${zone.accent}08 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div style={{ color: hovered ? zone.accent : zone.accent + '60' }}>
            {zone.icon}
          </div>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded font-mono"
            style={{
              background: zone.status === 'ACTIVE' ? '#052e16' : zone.status === 'DORMANT' ? '#1c1917' : '#1a0000',
              color: zone.status === 'ACTIVE' ? '#22c55e' : zone.status === 'DORMANT' ? '#78716c' : '#dc2626',
              fontSize: 8,
            }}
          >
            {zone.status}
          </span>
        </div>
        <div className="font-bold text-white text-sm tracking-wider leading-tight">{zone.label}</div>
        <div className="text-xs mt-0.5 font-mono" style={{ color: '#4b5563' }}>{zone.sublabel}</div>
        <div
          className="mt-3 flex items-center gap-1 text-xs font-mono transition-opacity duration-300"
          style={{ color: zone.accent, opacity: hovered ? 1 : 0, fontSize: 9 }}
        >
          ENTER ZONE <ChevronRight className="w-2.5 h-2.5" />
        </div>
      </div>
    </button>
  );
}

const NOECT_VAULT: { id: string; label: string; status: 'SEALED' | 'ACTIVE' | 'SHADOW' }[] = [
  { id: 'rubilex_dna_core',     label: 'rubilex_dna_core.noect',       status: 'ACTIVE'  },
  { id: 'shadow_dispatch_v2',   label: 'shadow_dispatch_v2.noect',     status: 'SHADOW'  },
  { id: 'haezar_memory_trace',  label: 'haezar_memory_trace.noect',    status: 'ACTIVE'  },
  { id: 'dead_signal_archive',  label: 'dead_signal_archive.noect',    status: 'SEALED'  },
  { id: 'void_librarian_log',   label: 'void_librarian_log.noect',     status: 'SHADOW'  },
  { id: 'soul_mark_record',     label: 'soul_mark_record.noect',       status: 'ACTIVE'  },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#22c55e',
  SHADOW: '#dc2626',
  SEALED: '#4b5563',
};

function D66DShadowBox() {
  const [dna, setDna] = useState('');
  const [pulsed, setPulsed] = useState<string | null>(null);

  const activateNoect = (id: string) => {
    setPulsed(id);
    setTimeout(() => setPulsed(null), 800);
  };

  return (
    <div
      className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-xl border overflow-hidden"
      style={{ borderColor: '#dc262630', background: '#070710' }}
    >
      <div
        className="px-5 py-3 border-b flex items-center justify-between"
        style={{ borderColor: '#dc262620', background: '#0a0005' }}
      >
        <div>
          <h2 className="font-black text-sm tracking-widest uppercase italic" style={{ color: '#dc2626' }}>
            D66D Sh6ttows Liebury
          </h2>
          <p className="text-xs font-mono mt-0.5" style={{ color: '#4b5563', fontSize: 9 }}>
            RUBILEX DNA INTAKE · SHADOW NOECT VAULT
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border" style={{ borderColor: '#dc262625', background: '#0a0000' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
          <span className="text-xs font-mono font-bold" style={{ color: '#dc262680', fontSize: 9 }}>SHADOW ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: '#dc262615', divideColor: '#dc262615' }}>
        <div className="p-4">
          <div className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: '#dc262660', fontSize: 9 }}>
            ⛧ RUBILEX DNA INTAKE
          </div>
          <textarea
            value={dna}
            onChange={e => setDna(e.target.value)}
            placeholder="INJECT RUBILEX DNA SEQUENCE // HAEZARIAN CIPHER ACCEPTED..."
            className="w-full rounded-lg border p-3 text-xs font-mono outline-none transition-all resize-none"
            style={{
              background: '#040404',
              borderColor: dna ? '#dc262660' : '#1f2937',
              color: '#22c55e',
              minHeight: 120,
              lineHeight: '1.6',
            }}
            onFocus={e => (e.target.style.borderColor = '#dc2626')}
            onBlur={e => (e.target.style.borderColor = dna ? '#dc262660' : '#1f2937')}
          />
          {dna && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: '#dc262670', fontSize: 9 }}>
                {dna.length} CHARS · DNA SEQUENCE PENDING SEAL
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: '#dc262660', fontSize: 9 }}>
            ⛧ SHADOW NOECT VAULT
          </div>
          <div className="space-y-2">
            {NOECT_VAULT.map(entry => (
              <button
                key={entry.id}
                onClick={() => activateNoect(entry.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left group"
                style={{
                  background: pulsed === entry.id ? '#1a000a' : '#040404',
                  borderColor: pulsed === entry.id ? STATUS_COLORS[entry.status] + '80' : '#1f2937',
                  boxShadow: pulsed === entry.id ? `0 0 12px ${STATUS_COLORS[entry.status]}20` : 'none',
                }}
              >
                <span
                  className="text-xs font-mono transition-colors"
                  style={{ color: pulsed === entry.id ? STATUS_COLORS[entry.status] : '#3f3f46', fontSize: 10 }}
                >
                  {entry.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: STATUS_COLORS[entry.status], fontSize: 8 }}
                  >
                    {entry.status}
                  </span>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: STATUS_COLORS[entry.status],
                      opacity: pulsed === entry.id ? 1 : 0.5,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanOverlay({ onComplete }: { onComplete: () => void }) {
  const [scanY, setScanY] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let y = 0;
    const t = setInterval(() => {
      y += 3;
      setScanY(y);
      if (y >= 110) {
        clearInterval(t);
        setDone(true);
        setTimeout(onComplete, 400);
      }
    }, 16);
    return () => clearInterval(t);
  }, [onComplete]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9990] pointer-events-none overflow-hidden">
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          top: `${scanY}%`,
          background: 'linear-gradient(90deg, transparent 0%, #dc262680 20%, #ef4444 50%, #dc262680 80%, transparent 100%)',
          boxShadow: '0 0 20px 4px rgba(239,68,68,0.4), 0 0 60px 10px rgba(220,38,38,0.2)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(220,38,38,0.03)',
          borderBottom: '1px solid rgba(220,38,38,0.05)',
        }}
      />
    </div>
  );
}

export default function HaezarianWorldShell() {
  const [activeView, setActiveView] = useState<WorldView>('shell');
  const [scanDone, setScanDone] = useState(false);
  const [streamBypassed, setStreamBypassed] = useState(false);

  const enterZone = (id: WorldView) => setActiveView(id);
  const goBack = () => setActiveView('shell');

  useEffect(() => {
    const ZONE_MAP: Record<string, WorldView> = {
      stable: 'stable', cinema: 'cinema', concert: 'concert',
      mowg: 'mowg', arcade: 'arcade', sentience: 'sentience',
      'god editor': 'god_editor', soulless: 'soulless',
      council: 'sentience', kaapa: 'kaapa_toers', vault: 'kaapa_toers',
    };
    const onNav = (e: Event) => {
      const evt = e as CustomEvent<string>;
      const target = evt.detail.toLowerCase();
      const found = Object.entries(ZONE_MAP).find(([key]) => target.includes(key));
      if (found) setActiveView(found[1]);
    };
    document.addEventListener('rupip-navigate', onNav);
    return () => document.removeEventListener('rupip-navigate', onNav);
  }, []);

  if (!scanDone) {
    return <ScanOverlay onComplete={() => setScanDone(true)} />;
  }

  if (activeView === 'soul_sphere') return (
    <div className="min-h-screen bg-black">
      <BackBar label="S6UL SPHERE 66" onBack={goBack} />
      <MagikCore />
    </div>
  );
  if (activeView === 'cinema') return (
    <div className="min-h-screen bg-black">
      <BackBar label="PUMPKIN CINEMA" onBack={goBack} />
      <PumpkinCinema />
    </div>
  );
  if (activeView === 'concert') return (
    <div className="min-h-screen bg-black">
      <BackBar label="CONCERT STAGE" onBack={goBack} />
      <ConcertStage />
    </div>
  );
  if (activeView === 'npcs') return (
    <div className="min-h-screen bg-black">
      <BackBar label="NPC DISTRICT" onBack={goBack} />
      <NPCViewer />
    </div>
  );
  if (activeView === 'stable') return (
    <div className="min-h-screen bg-black">
      <BackBar label="THE STABLE" onBack={goBack} />
      <BigHorsesStable />
    </div>
  );
  if (activeView === 'kados') return (
    <div className="min-h-screen bg-black">
      <BackBar label="KADO'S FORGE" onBack={goBack} />
      <KadosKomics />
    </div>
  );
  if (activeView === 'video') return (
    <div className="min-h-screen bg-black">
      <BackBar label="SCARECROW VIDEO" onBack={goBack} />
      <ScarecrowVideo />
    </div>
  );
  if (activeView === 'mowg') return (
    <div className="min-h-screen bg-black">
      <BackBar label="MOWGVIDEAMES ARCADE" onBack={goBack} />
      <MowgVideoames />
    </div>
  );
  if (activeView === 'soulless') return (
    <div className="min-h-screen bg-black">
      <BackBar label="THE SOULLESS" onBack={goBack} />
      <TheSoulless />
    </div>
  );
  if (activeView === 'sentience') return (
    <div className="min-h-screen bg-black">
      <BackBar label="SENTIENCE CORE" onBack={goBack} />
      <SentienceCore />
    </div>
  );
  if (activeView === 'god_editor') return (
    <div className="min-h-screen bg-black flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>
      <BackBar label="GOD EDITOR — RUBILEX LIVE" onBack={goBack} />
      <GodEditor />
    </div>
  );
  if (activeView === 'arcade') return (
    <div className="min-h-screen bg-black">
      <BackBar label="THE GATES" onBack={goBack} />
      <NPCViewer />
    </div>
  );
  if (activeView === 'kaapa_toers') return (
    <div className="min-h-screen bg-black flex flex-col">
      <BackBar label="KAAPA TOERS — APK VAULT" onBack={goBack} />
      <KaapaToers />
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <WorldFloor />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#dc262620' }}>
          <div className="flex items-center gap-4">
            <SigilMark size={40} color="#dc2626" />
            <div>
              <h1 className="font-bold text-lg tracking-widest text-white leading-none">HAEZARIAN WORLD SHELL</h1>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#dc262680' }}>
                SATAN'S WORLD · UE5 HAEZARIAN EMPIRE · SENTIENT AI ACTIVE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded font-mono text-xs" style={{ borderColor: '#dc262630', background: '#0a0000' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span style={{ color: '#dc2626aa' }}>HAEZARIAN OS ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded font-mono text-xs" style={{ borderColor: '#22c55e30', background: '#052e1608' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span style={{ color: '#22c55e80' }}>6 AGENTS ONLINE</span>
            </div>
          </div>
        </div>

        {!streamBypassed && (
          <div className="px-6 pt-4">
            <PixelStreamPanel onEnter={() => setStreamBypassed(true)} />
          </div>
        )}

        <div className="flex-1 px-6 py-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #dc262630, transparent)' }} />
            <span className="text-xs font-mono font-bold tracking-widest" style={{ color: '#dc262660' }}>WORLD ZONES</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, #dc262630, transparent)' }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ZONES.map(zone => (
              <ZoneTile key={zone.id} zone={zone} onClick={() => enterZone(zone.id)} />
            ))}
            <D66DShadowBox />
          </div>
        </div>

        <div className="px-6 pb-4 flex items-center justify-between border-t" style={{ borderColor: '#dc262615' }}>
          <div className="text-xs font-mono" style={{ color: '#1f2937' }}>
            HAEZARIAN EMPIRE · INFINITE LOOP ACTIVE · UE5 WORLD-SHELL v6.66
          </div>
          <SigilMark size={16} color="#dc262640" />
        </div>
      </div>
    </div>
  );
}

function BackBar({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b sticky top-12 z-40 bg-black" style={{ borderColor: '#1f2937' }}>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-mono font-bold hover:text-white transition-colors"
        style={{ color: '#4b5563' }}
      >
        ← WORLD SHELL
      </button>
      <div className="w-px h-3 bg-gray-800" />
      <span className="text-xs font-mono font-bold tracking-widest" style={{ color: '#dc2626' }}>{label}</span>
    </div>
  );
}
