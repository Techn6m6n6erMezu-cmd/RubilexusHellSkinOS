import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Cpu, Terminal, Zap, AlertTriangle, CheckCircle2, MonitorPlay, Power, RotateCcw } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  core: string;
  rom: string;
  description: string;
  genre: string;
  players: number;
  status: 'ready' | 'missing' | 'loading';
}

const GAMES: Game[] = [
  {
    id: 'satans_house',
    title: "SATAN'S HOUSE",
    core: 'arcade',
    rom: '/roms/satans_house.zip',
    description: 'Original homebrew. Navigate the cursed halls of the infernal estate. Collect soul fragments, avoid the damned.',
    genre: 'ACTION / PLATFORMER',
    players: 2,
    status: 'missing',
  },
  {
    id: 'trash_bound',
    title: 'TRASH BOUND',
    core: 'arcade',
    rom: '/roms/trash_bound.zip',
    description: 'Original homebrew. Survive the post-apocalyptic wasteland. Scavenge, fight, and build your trash empire.',
    genre: 'SURVIVAL / ROGUELIKE',
    players: 1,
    status: 'missing',
  },
];

function ScanLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
      }}
    />
  );
}

function PhosphorGlow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ textShadow: '0 0 8px #00ff41, 0 0 16px #00ff4160' }}>
      {children}
    </span>
  );
}

function TerminalBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative border font-mono ${className}`}
      style={{ borderColor: '#00ff4130', background: '#010a01' }}
    >
      <div
        className="absolute -top-px left-3 px-1 text-xs font-bold"
        style={{ color: '#00ff4160', background: '#010a01', fontSize: 8 }}
      >
        ▶
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: Game['status'] }) {
  if (status === 'ready') return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#00ff4115', border: '1px solid #00ff4140' }}>
      <CheckCircle2 className="w-2.5 h-2.5" style={{ color: '#00ff41' }} />
      <span style={{ color: '#00ff41', fontSize: 8, letterSpacing: '0.1em' }}>ROM DETECTED</span>
    </div>
  );
  if (status === 'missing') return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#ff410015', border: '1px solid #ff410040' }}>
      <AlertTriangle className="w-2.5 h-2.5" style={{ color: '#ff4100' }} />
      <span style={{ color: '#ff4100', fontSize: 8, letterSpacing: '0.1em' }}>ROM NOT FOUND</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: '#ffcc0015', border: '1px solid #ffcc0040' }}>
      <span className="animate-pulse" style={{ color: '#ffcc00', fontSize: 8 }}>▊ LOADING...</span>
    </div>
  );
}

function GameCard({ game, onLaunch, active }: { game: Game; onLaunch: (g: Game) => void; active: boolean }) {
  return (
    <div
      className="relative overflow-hidden cursor-pointer transition-all"
      style={{
        background: active ? '#001a00' : '#010a01',
        border: `1.5px solid ${active ? '#00ff41' : '#00ff4125'}`,
        boxShadow: active ? '0 0 24px #00ff4120, inset 0 0 20px #00ff4108' : 'none',
        transition: 'all 0.2s',
      }}
      onClick={() => onLaunch(game)}
    >
      <ScanLines />
      <div className="relative z-20 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div style={{ color: '#00ff4160', fontSize: 8, letterSpacing: '0.2em' }}>{game.genre}</div>
            <h3
              className="font-bold tracking-widest mt-0.5"
              style={{
                color: active ? '#00ff41' : '#00cc34',
                fontSize: 18,
                textShadow: active ? '0 0 12px #00ff41' : 'none',
              }}
            >
              {game.title}
            </h3>
          </div>
          <StatusBadge status={game.status} />
        </div>

        <p style={{ color: '#00aa2860', fontSize: 10, lineHeight: 1.6, marginBottom: 12 }}>
          {game.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          {[
            { label: 'CORE', value: game.core.toUpperCase() },
            { label: 'PLAYERS', value: `${game.players}P` },
            { label: 'ROM', value: game.rom.split('/').pop() || '' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: '#00ff4130', fontSize: 7, letterSpacing: '0.1em' }}>{s.label}</div>
              <div style={{ color: '#00ff4180', fontSize: 9, fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onLaunch(game); }}
          className="w-full flex items-center justify-center gap-2 py-2 font-bold tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: active ? '#00ff4120' : '#001a00',
            border: `1px solid ${active ? '#00ff41' : '#00ff4140'}`,
            color: active ? '#00ff41' : '#00cc34',
            fontSize: 10,
          }}
        >
          <Power className="w-3 h-3" />
          {active ? 'LOADED — PRESS START' : 'BOOT GAME'}
        </button>
      </div>

      {active && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #00ff41, transparent)', animation: 'arcade-scan 2s linear infinite' }}
        />
      )}
    </div>
  );
}

function EmulatorFrame({ game, onEject }: { game: Game; onEject: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [romChecked, setRomChecked] = useState(false);
  const [romExists, setRomExists] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setRomChecked(false);
    setRomExists(false);

    fetch(game.rom, { method: 'HEAD' })
      .then(r => {
        setRomExists(r.ok);
        setRomChecked(true);
        if (r.ok) setLoaded(true);
      })
      .catch(() => {
        setRomExists(false);
        setRomChecked(true);
      });
  }, [game.rom]);

  useEffect(() => {
    if (!romExists || !romChecked || !containerRef.current) return;

    const existing = containerRef.current.querySelector('script[data-emulatorjs]');
    if (existing) return;

    const w = window as any;
    w.EJS_player = '#emulator-canvas';
    w.EJS_core = game.core;
    w.EJS_gameUrl = game.rom;
    w.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    w.EJS_color = '#00ff41';
    w.EJS_startOnLoaded = true;
    w.EJS_backgroundColor = '#010a01';

    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.setAttribute('data-emulatorjs', '1');
    containerRef.current.appendChild(script);
  }, [romExists, romChecked, game]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: '#010a01', border: '1.5px solid #00ff4140' }}
    >
      <ScanLines />
      <div
        className="relative z-20 flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: '#00ff4120', background: '#020e02' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {['#00ff41', '#ffcc00', '#ff4100'].map((c, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ color: '#00ff4180', fontSize: 9, letterSpacing: '0.15em' }}>
            RUIN-CORE EMU v1.0 // {game.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" style={{ color: '#00ff4160', fontSize: 8 }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: loaded && romExists ? '#00ff41' : '#ff4100' }} />
            {!romChecked ? 'CHECKING ROM...' : romExists ? 'EMULATOR ACTIVE' : 'ROM NOT FOUND'}
          </div>
          <button
            onClick={onEject}
            className="flex items-center gap-1 px-2 py-1 transition-colors hover:opacity-80"
            style={{ border: '1px solid #ff410040', color: '#ff4100', fontSize: 8 }}
          >
            <RotateCcw className="w-2.5 h-2.5" />
            EJECT
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative z-20"
        style={{ minHeight: 400, background: '#010a01' }}
      >
        {!romChecked && (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Cpu className="w-10 h-10 animate-spin" style={{ color: '#00ff4160' }} />
            <span style={{ color: '#00ff4160', fontSize: 10, letterSpacing: '0.2em' }}>CHECKING ROM PATH...</span>
          </div>
        )}

        {romChecked && !romExists && (
          <div className="flex flex-col items-center justify-center h-96 gap-6 px-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: '#1a0000', border: '2px solid #ff410040' }}
            >
              <AlertTriangle className="w-7 h-7" style={{ color: '#ff4100' }} />
            </div>
            <div className="text-center space-y-2">
              <div style={{ color: '#ff4100', fontSize: 14, fontWeight: 'bold', letterSpacing: '0.2em' }}>
                ROM NOT FOUND
              </div>
              <div style={{ color: '#ff410060', fontSize: 10, letterSpacing: '0.1em' }}>
                {game.rom}
              </div>
              <div
                className="mt-4 p-4 text-left"
                style={{ background: '#0a0000', border: '1px solid #ff410020', maxWidth: 400 }}
              >
                <div style={{ color: '#ff410080', fontSize: 8, letterSpacing: '0.1em', marginBottom: 8 }}>
                  INSTALL INSTRUCTIONS:
                </div>
                {[
                  `1. Place your ROM file at: public${game.rom}`,
                  `2. Ensure filename matches: ${game.rom.split('/').pop()}`,
                  '3. Supported formats: .zip .rom .bin .nes .sfc',
                  '4. Reload this page to detect the ROM',
                ].map((line, i) => (
                  <div key={i} style={{ color: '#ff410050', fontSize: 9, lineHeight: 1.8 }}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {romChecked && romExists && (
          <div id="emulator-canvas" style={{ width: '100%', minHeight: 400 }} />
        )}
      </div>
    </div>
  );
}

function SystemReadout({ label, value, color = '#00ff4180' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b" style={{ borderColor: '#00ff4110' }}>
      <span style={{ color: '#00ff4140', fontSize: 8, letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ color, fontSize: 9, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}

export default function RuinCoreArcade() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();

  const handleLaunch = (game: Game) => {
    setSelectedGame(prev => prev?.id === game.id ? null : game);
  };

  return (
    <div
      className="min-h-screen font-mono relative overflow-hidden"
      style={{ background: '#000a00', color: '#00ff41' }}
    >
      <style>{`
        @keyframes arcade-scan {
          0% { top: 0; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink { animation: blink 1s step-end infinite; }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, #001a0030 0%, #000a00 70%)',
        }}
      />

      <div
        className="relative z-10 border-b-2 px-6 py-4"
        style={{ borderColor: '#00ff4130', background: '#000e00' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center border-2"
              style={{ borderColor: '#00ff41', background: '#001a00', boxShadow: '0 0 20px #00ff4140' }}
            >
              <Terminal className="w-6 h-6" style={{ color: '#00ff41' }} />
            </div>
            <div>
              <h1
                className="font-bold tracking-widest"
                style={{ fontSize: 22, color: '#00ff41', textShadow: '0 0 16px #00ff41, 0 0 32px #00ff4160' }}
              >
                RUIN<span style={{ color: '#00ff4160' }}>-</span>CORE ARCADE
              </h1>
              <div style={{ color: '#00ff4150', fontSize: 8, letterSpacing: '0.3em' }}>
                HAEZARIAN HOMEBREW DIVISION // SATAN'S WORLD ENTERTAINMENT SYSTEM
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <div style={{ color: '#00ff4140', fontSize: 7, letterSpacing: '0.2em' }}>SYSTEM CLOCK</div>
              <div style={{ color: '#00ff41', fontSize: 11, fontFamily: 'monospace' }}>
                {now.toLocaleTimeString('en-US', { hour12: false })}
                <span className="blink" style={{ color: '#00ff4160' }}>_</span>
              </div>
            </div>
            <div className="text-right">
              <div style={{ color: '#00ff4140', fontSize: 7, letterSpacing: '0.2em' }}>UPTIME CYCLES</div>
              <div style={{ color: '#00ff41', fontSize: 11, fontFamily: 'monospace' }}>
                {String(tick).padStart(6, '0')}
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 border" style={{ borderColor: '#00ff4140', background: '#001a00' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff41' }} />
              <span style={{ color: '#00ff41', fontSize: 8, letterSpacing: '0.2em' }}>ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-6">
        <div
          className="flex items-center gap-3 px-4 py-2 border-l-2"
          style={{ borderColor: '#00ff41', background: '#001a0060' }}
        >
          <Zap className="w-3.5 h-3.5" style={{ color: '#00ff41' }} />
          <span style={{ color: '#00ff4180', fontSize: 9, letterSpacing: '0.2em' }}>
            EMULATORJS ENGINE READY // PLACE ROMS IN <span style={{ color: '#00ff41' }}>/public/roms/</span> // {GAMES.length} TITLES CATALOGUED
          </span>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div style={{ color: '#00ff4160', fontSize: 9, letterSpacing: '0.2em' }}>
              ━━ GAME LIBRARY // {GAMES.length} HOMEBREW TITLES ━━
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {GAMES.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onLaunch={handleLaunch}
                  active={selectedGame?.id === game.id}
                />
              ))}
            </div>

            {selectedGame && (
              <div className="mt-4">
                <div style={{ color: '#00ff4160', fontSize: 9, letterSpacing: '0.2em', marginBottom: 12 }}>
                  ━━ EMULATOR DISPLAY // {selectedGame.title} ━━
                </div>
                <EmulatorFrame
                  game={selectedGame}
                  onEject={() => setSelectedGame(null)}
                />
              </div>
            )}

            {!selectedGame && (
              <TerminalBorder className="p-6">
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <MonitorPlay className="w-12 h-12" style={{ color: '#00ff4130' }} />
                  <div style={{ color: '#00ff4150', fontSize: 10, letterSpacing: '0.2em', textAlign: 'center' }}>
                    SELECT A GAME TO BOOT THE EMULATOR
                  </div>
                  <div style={{ color: '#00ff4130', fontSize: 8, letterSpacing: '0.15em', textAlign: 'center' }}>
                    EMULATORJS ENGINE WILL LOAD AUTOMATICALLY WHEN ROM IS DETECTED
                  </div>
                </div>
              </TerminalBorder>
            )}
          </div>

          <div className="space-y-4">
            <div style={{ color: '#00ff4160', fontSize: 9, letterSpacing: '0.2em' }}>━━ SYSTEM STATUS ━━</div>

            <TerminalBorder className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-3 h-3" style={{ color: '#00ff41' }} />
                <span style={{ color: '#00ff41', fontSize: 9, letterSpacing: '0.15em' }}>HARDWARE MATRIX</span>
              </div>
              <SystemReadout label="ENGINE" value="EMULATORJS" color="#00ff41" />
              <SystemReadout label="CDN" value="STABLE BUILD" color="#00ff4180" />
              <SystemReadout label="ROM PATH" value="/public/roms/" color="#00ff4180" />
              <SystemReadout label="CORES" value="ARCADE/NES/SNES" color="#00ff4180" />
              <SystemReadout label="TITLES" value={`${GAMES.length} LOADED`} color="#00ff41" />
            </TerminalBorder>

            <TerminalBorder className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gamepad2 className="w-3 h-3" style={{ color: '#00ff41' }} />
                <span style={{ color: '#00ff41', fontSize: 9, letterSpacing: '0.15em' }}>CATALOG</span>
              </div>
              {GAMES.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => handleLaunch(g)}
                  className="w-full flex items-center justify-between py-2 border-b transition-colors hover:bg-white/5"
                  style={{ borderColor: '#00ff4110' }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#00ff4140', fontSize: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span
                      style={{
                        color: selectedGame?.id === g.id ? '#00ff41' : '#00cc34',
                        fontSize: 9,
                        letterSpacing: '0.05em',
                        textShadow: selectedGame?.id === g.id ? '0 0 8px #00ff41' : 'none',
                      }}
                    >
                      {g.title}
                    </span>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: g.status === 'ready' ? '#00ff41' : '#ff410060' }}
                  />
                </button>
              ))}
            </TerminalBorder>

            <TerminalBorder className="p-4">
              <div style={{ color: '#00ff4160', fontSize: 8, letterSpacing: '0.15em', marginBottom: 10 }}>
                ROM SETUP GUIDE
              </div>
              {[
                '1. Add ROM files to:',
                '   /public/roms/',
                '',
                '2. Naming convention:',
                '   satans_house.zip',
                '   trash_bound.zip',
                '',
                '3. Formats supported:',
                '   .zip .rom .bin',
                '   .nes .sfc .gba',
                '',
                '4. EmulatorJS detects',
                '   ROMs automatically',
                '   on page load.',
              ].map((line, i) => (
                <div key={i} style={{ color: line.startsWith('  ') ? '#00ff4140' : line === '' ? 'transparent' : '#00ff4160', fontSize: 8, lineHeight: 1.9 }}>
                  {line || '\u00a0'}
                </div>
              ))}
            </TerminalBorder>

            <TerminalBorder className="p-4">
              <div style={{ color: '#00ff4160', fontSize: 8, letterSpacing: '0.15em', marginBottom: 8 }}>ABOUT RUIN-CORE</div>
              <p style={{ color: '#00ff4140', fontSize: 8, lineHeight: 1.8 }}>
                Official homebrew arcade for Satan's World. Built on EmulatorJS. Haezarian Homebrew Division property.
              </p>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: '#00ff4115' }}>
                <div style={{ color: '#00ff4130', fontSize: 7, letterSpacing: '0.1em' }}>
                  RUIN-CORE v1.0 // HAEZARIAN<br />
                  HOMEBREW DIVISION // 2026
                </div>
              </div>
            </TerminalBorder>
          </div>
        </div>
      </div>
    </div>
  );
}
