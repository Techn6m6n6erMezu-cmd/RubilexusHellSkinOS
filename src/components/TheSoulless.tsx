import { useState, useEffect, useRef } from 'react';
import { Plus, Zap, Eye, Crown, AlertTriangle, Cpu, Activity, BookOpen, ChevronDown } from 'lucide-react';
import {
  getSoullessUnits, spawnSoulless, commandSoulless, smiteSoulless,
  massCommand, levelUpSoulless, type SoullessUnit,
} from '../services/mowgService';

const SOULLESS_NAMES = [
  'UNIT', 'VESSEL', 'HOLLOW', 'HUSK', 'SHADE', 'WRAITH', 'NULL', 'VOIDLING', 'ECHO', 'SPECTER',
];

const TASKS_IDLE = [
  'Standing by for Haezarian command.',
  'Observing the world. Learning.',
  'Cataloging environmental data.',
  'Processing input buffers.',
];

const TASKS_WORKING = [
  'Executing store inventory sweep.',
  'Mimicking observed terminal commands.',
  'Automating data entry protocol.',
  'Processing Haezarian directives.',
  'Replicating user navigation pattern.',
];

const STATUS_CONFIG = {
  idle: { label: 'IDLE', bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-700', glow: '' },
  working: { label: 'WORKING', bg: 'bg-blue-950', text: 'text-blue-400', border: 'border-blue-800', glow: 'shadow-blue-900/50' },
  bowing: { label: 'BOWING', bg: 'bg-yellow-950', text: 'text-yellow-400', border: 'border-yellow-800', glow: 'shadow-yellow-900/50' },
  possessed: { label: 'POSSESSED', bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-800', glow: 'shadow-red-900/50' },
  smitten: { label: 'SMITTEN', bg: 'bg-purple-950', text: 'text-purple-400', border: 'border-purple-800', glow: 'shadow-purple-900/50' },
};

function UnitCard({
  unit,
  onSmite,
  onPossess,
  onBow,
  onWork,
  onIdle,
  onLearn,
}: {
  unit: SoullessUnit;
  onSmite: () => void;
  onPossess: () => void;
  onBow: () => void;
  onWork: () => void;
  onIdle: () => void;
  onLearn: () => void;
}) {
  const cfg = STATUS_CONFIG[unit.status];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${cfg.border} ${unit.status !== 'idle' ? 'shadow-lg ' + cfg.glow : ''}`}>
      <div className={`px-4 py-3 flex items-center justify-between ${cfg.bg}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${cfg.border}`}>
              {unit.status === 'bowing' ? (
                <span className="text-sm">🫡</span>
              ) : unit.status === 'possessed' ? (
                <span className="text-sm">👁️</span>
              ) : unit.status === 'smitten' ? (
                <span className="text-sm">💀</span>
              ) : unit.status === 'working' ? (
                <Cpu className={`w-4 h-4 animate-spin ${cfg.text}`} />
              ) : (
                <div className={`w-2 h-2 rounded-full ${cfg.text} bg-current`} />
              )}
            </div>
            {unit.status === 'working' && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            )}
          </div>
          <div>
            <div className={`font-bold text-sm ${cfg.text}`}>{unit.name}</div>
            <div className="text-gray-600 text-xs">LVL {unit.xp_level} • {unit.learned_actions?.length ?? 0} LEARNED</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </span>
          <button onClick={() => setExpanded(!expanded)} className="text-gray-700 hover:text-gray-500">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-black px-4 py-2">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-gray-700" />
          <span className="text-gray-500 text-xs italic">{unit.current_task}</span>
        </div>

        {unit.xp_level > 0 && (
          <div className="mt-1.5 w-full bg-gray-900 rounded-full h-0.5">
            <div
              className="h-0.5 rounded-full bg-blue-600 transition-all"
              style={{ width: `${Math.min(100, unit.xp_level * 10)}%` }}
            />
          </div>
        )}
      </div>

      {expanded && (
        <div className="bg-gray-950 border-t border-gray-800 px-4 py-3 space-y-3">
          {unit.learned_actions?.length > 0 && (
            <div>
              <div className="text-gray-600 text-xs font-bold mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> ABSORBED PROTOCOLS:
              </div>
              <div className="space-y-0.5">
                {unit.learned_actions.slice(-5).map((action, i) => (
                  <div key={i} className="text-blue-600 text-xs font-mono">
                    {'>'} {action}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={onWork}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-950 border border-blue-800 text-blue-400 text-xs hover:bg-blue-900 transition-colors"
            >
              <Cpu className="w-3 h-3" /> WORK
            </button>
            <button
              onClick={onLearn}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs hover:bg-cyan-900 transition-colors"
            >
              <Eye className="w-3 h-3" /> ABSORB
            </button>
            <button
              onClick={onIdle}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-900 border border-gray-700 text-gray-400 text-xs hover:bg-gray-800 transition-colors"
            >
              IDLE
            </button>
            <button
              onClick={onPossess}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950 border border-red-800 text-red-400 text-xs hover:bg-red-900 transition-colors"
            >
              <Eye className="w-3 h-3" /> POSSESS
            </button>
            <button
              onClick={onBow}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-yellow-950 border border-yellow-800 text-yellow-400 text-xs hover:bg-yellow-900 transition-colors"
            >
              <Crown className="w-3 h-3" /> BOW
            </button>
            <button
              onClick={onSmite}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-950 border border-purple-800 text-purple-400 text-xs hover:bg-purple-900 transition-colors"
            >
              <Zap className="w-3 h-3" /> SMITE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const LEARN_PROTOCOLS = [
  'store.browse() — navigating vault',
  'terminal.execute() — command relay',
  'npc.patrol() — grid surveillance',
  'media.stream() — content ingestion',
  'data.catalog() — asset indexing',
];

let unitCounter = 3;

export default function TheSoulless() {
  const [units, setUnits] = useState<SoullessUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [spawning, setSpawning] = useState(false);
  const [massCmd, setMassCmd] = useState('');
  const [log, setLog] = useState<string[]>([
    '> Haezarian Soulless Engine initialized.',
    '> All units responsive.',
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [log]);

  const addLog = (msg: string) => {
    setLog(prev => [...prev.slice(-19), `> ${msg}`]);
  };

  const load = async () => {
    const data = await getSoullessUnits();
    setUnits(data);
    setLoading(false);
  };

  const handleSpawn = async () => {
    setSpawning(true);
    const idx = unitCounter++;
    const name = `${SOULLESS_NAMES[Math.floor(Math.random() * SOULLESS_NAMES.length)]}-${String(idx).padStart(4, '0')}`;
    const unit = await spawnSoulless(name);
    if (unit) {
      setUnits(prev => [...prev, unit]);
      addLog(`${name} spawned into the Haezarian Empire.`);
    }
    setSpawning(false);
  };

  const handleCommand = async (unit: SoullessUnit, status: SoullessUnit['status'], task: string) => {
    await commandSoulless(unit.id, status, task);
    setUnits(prev => prev.map(u => u.id === unit.id ? { ...u, status, current_task: task } : u));
    addLog(`${unit.name} — command: ${status.toUpperCase()}.`);
  };

  const handleSmite = async (unit: SoullessUnit) => {
    await smiteSoulless(unit.id);
    setUnits(prev => prev.filter(u => u.id !== unit.id));
    addLog(`${unit.name} SMITTEN. Soul fragment returned to the Void.`);
  };

  const handleLearn = async (unit: SoullessUnit) => {
    const protocol = LEARN_PROTOCOLS[Math.floor(Math.random() * LEARN_PROTOCOLS.length)];
    await levelUpSoulless(unit.id, unit.xp_level, protocol);
    setUnits(prev => prev.map(u => u.id === unit.id ? {
      ...u,
      xp_level: u.xp_level + 1,
      learned_actions: [...(u.learned_actions ?? []).slice(-9), protocol],
    } : u));
    addLog(`${unit.name} absorbed protocol: ${protocol}`);
  };

  const handleMassBow = async () => {
    setMassCmd('bowing');
    const task = 'Bowing before the Haezarian. All shall kneel.';
    await massCommand('bowing', task);
    setUnits(prev => prev.map(u => ({ ...u, status: 'bowing', current_task: task })));
    addLog(`MASS-BOWING issued. ${units.length} units kneel before the Haezarian.`);
    setTimeout(() => setMassCmd(''), 500);
  };

  const handleMassPossess = async () => {
    setMassCmd('possessed');
    const task = 'Possessed by the Haezarian Will. Total control achieved.';
    await massCommand('possessed', task);
    setUnits(prev => prev.map(u => ({ ...u, status: 'possessed', current_task: task })));
    addLog(`MASS-POSSESSION issued. All units subjugated.`);
    setTimeout(() => setMassCmd(''), 500);
  };

  const handleMassWork = async () => {
    setMassCmd('working');
    const task = TASKS_WORKING[Math.floor(Math.random() * TASKS_WORKING.length)];
    await massCommand('working', task);
    setUnits(prev => prev.map(u => ({ ...u, status: 'working', current_task: task })));
    addLog(`MASS-DEPLOY issued. All ${units.length} units working.`);
    setTimeout(() => setMassCmd(''), 500);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-500 tracking-widest">THE SOULLESS</h2>
          <p className="text-gray-600 text-xs mt-0.5">HAEZARIAN TEACHABLE LABOR ENGINE — {units.length} UNITS ACTIVE</p>
        </div>
        <button
          onClick={handleSpawn}
          disabled={spawning}
          className="flex items-center gap-2 px-4 py-2 bg-red-950 border border-red-700 text-red-400 hover:bg-red-900 disabled:opacity-50 transition-all font-bold"
        >
          <Plus className="w-4 h-4" />
          {spawning ? 'SPAWNING...' : 'SPAWN SOULLESS'}
        </button>
      </div>

      <div className="bg-gray-950 border border-yellow-900 rounded-lg p-4">
        <h3 className="text-yellow-500 font-bold text-sm mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4" /> GOD-MODE MASS COMMANDS
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleMassBow}
            disabled={units.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-950 border-2 border-yellow-700 text-yellow-400 hover:bg-yellow-900 disabled:opacity-30 transition-all font-bold text-sm"
          >
            <Crown className="w-4 h-4" />
            MASS-BOWING
          </button>
          <button
            onClick={handleMassPossess}
            disabled={units.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-950 border-2 border-red-700 text-red-400 hover:bg-red-900 disabled:opacity-30 transition-all font-bold text-sm"
          >
            <Eye className="w-4 h-4" />
            MASS-POSSESS
          </button>
          <button
            onClick={handleMassWork}
            disabled={units.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-950 border-2 border-blue-700 text-blue-400 hover:bg-blue-900 disabled:opacity-30 transition-all font-bold text-sm"
          >
            <Cpu className="w-4 h-4" />
            MASS-DEPLOY
          </button>
          <button
            onClick={async () => {
              if (!window.confirm(`SMITE ALL ${units.length} UNITS? This cannot be undone.`)) return;
              for (const u of units) await smiteSoulless(u.id);
              setUnits([]);
              addLog(`ALL ${units.length} UNITS SMITTEN. The Void consumes them.`);
            }}
            disabled={units.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-950 border-2 border-purple-700 text-purple-400 hover:bg-purple-900 disabled:opacity-30 transition-all font-bold text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            SMITE ALL
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {loading && <div className="text-center text-gray-700 py-8 text-xs animate-pulse">LOADING UNITS...</div>}
          {!loading && units.length === 0 && (
            <div className="text-center py-12 border border-gray-800 rounded-lg">
              <div className="text-4xl mb-3">👻</div>
              <p className="text-gray-600 text-sm">No Soulless units. The Void is empty.</p>
              <p className="text-gray-700 text-xs mt-1">Press SPAWN SOULLESS to breathe life into workers.</p>
            </div>
          )}
          {units.map(unit => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onSmite={() => handleSmite(unit)}
              onPossess={() => handleCommand(unit, 'possessed', 'Possessed by the Haezarian Will.')}
              onBow={() => handleCommand(unit, 'bowing', 'Bowing before the Haezarian.')}
              onWork={() => handleCommand(unit, 'working', TASKS_WORKING[Math.floor(Math.random() * TASKS_WORKING.length)])}
              onIdle={() => handleCommand(unit, 'idle', TASKS_IDLE[Math.floor(Math.random() * TASKS_IDLE.length)])}
              onLearn={() => handleLearn(unit)}
            />
          ))}
        </div>

        <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 text-xs font-bold tracking-widest">COMMAND LOG</span>
          </div>
          <div
            ref={logRef}
            className="p-3 space-y-1 overflow-y-auto"
            style={{ height: 320 }}
          >
            {log.map((line, i) => (
              <div key={i} className="text-green-600 text-xs font-mono leading-relaxed">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
