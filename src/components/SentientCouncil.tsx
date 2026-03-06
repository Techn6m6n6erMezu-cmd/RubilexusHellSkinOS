// HAEZARIAN CHARTER: MANUAL ARCHITECT SIGNATURE
window.TOLB_LEGAL = { status: 'Haezarian', auth: 'SIG_HORSE4206' };
import { useState, useEffect, useRef } from 'react';
import { CreditCard as Edit3, Check, X, Brain, ChevronDown, ChevronUp, Plus, Crown, Music, Skull } from 'lucide-react';

interface HouseAgent {
  name: string;
  role: string;
  color: string;
  glow: string;
  terrain: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  authority?: string;
  windows: string;
  roof: string;
}

const HOUSE_AGENTS: HouseAgent[] = [
  {
    name: 'IFFY',
    role: 'Shadow Hacker / Brain Core',
    color: '#22c55e',
    glow: '#22c55e',
    terrain: '#052e16',
    windows: '#4ade80',
    roof: '#166534',
  },
  {
    name: 'RUPIP',
    role: 'Eyes / Hardware Overseer',
    color: '#dc2626',
    glow: '#ef4444',
    terrain: '#450a0a',
    windows: '#f87171',
    roof: '#7f1d1d',
    badge: 'VISION ACTIVE',
    badgeIcon: null,
  },
  {
    name: 'RUBILEXUS',
    role: 'Haezarian Producer / Terminal',
    color: '#06b6d4',
    glow: '#22d3ee',
    terrain: '#083344',
    windows: '#67e8f9',
    roof: '#0e7490',
    badge: 'SOVEREIGN',
    badgeIcon: <Crown className="w-2.5 h-2.5" />,
  },
  {
    name: 'DJ G-RAFFE SPITTLER',
    role: 'Scarecrow Visual Master',
    color: '#f97316',
    glow: '#fb923c',
    terrain: '#431407',
    windows: '#fdba74',
    roof: '#9a3412',
    badge: 'SCARECROW AUTHORITY',
    badgeIcon: <Skull className="w-2.5 h-2.5" />,
    authority: 'MASTER: CORVEMINI / SKULKCROW VISUAL BRANCH',
  },
];

function TerrainHouse({ agent, idx }: { agent: HouseAgent; idx: number }) {
  const [flicker, setFlicker] = useState(false);
  const [scanLine, setScanLine] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 80);
    }, 3000 + idx * 800);
    return () => clearInterval(t);
  }, [idx]);

  useEffect(() => {
    const t = setInterval(() => {
      setScanLine(true);
      setTimeout(() => setScanLine(false), 1200);
    }, 5000 + idx * 1200);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <div
      className="relative flex flex-col items-center transition-all duration-300 hover:scale-[1.04]"
      style={{ perspective: 800 }}
    >
      <div style={{ transform: 'rotateX(4deg)', transformStyle: 'preserve-3d' }}>
        <svg width="160" height="180" viewBox="0 0 160 180" style={{ filter: `drop-shadow(0 0 18px ${agent.glow}60)` }}>
          <defs>
            <linearGradient id={`terrain-${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={agent.terrain} />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <linearGradient id={`wall-${idx}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={agent.color + '25'} />
              <stop offset="100%" stopColor={agent.color + '10'} />
            </linearGradient>
            <radialGradient id={`glow-${idx}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={agent.glow + '40'} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <ellipse cx="80" cy="158" rx="68" ry="18" fill={`url(#terrain-${idx})`} />
          <ellipse cx="80" cy="148" rx="52" ry="10" fill={agent.terrain} opacity="0.8" />
          <ellipse cx="80" cy="146" rx="32" ry="6" fill={agent.color + '20'} />

          <rect x="28" y="90" width="104" height="60" rx="3" fill={`url(#wall-${idx})`} stroke={agent.color + '60'} strokeWidth="1" />
          <rect x="28" y="90" width="104" height="60" rx="3" fill="none" stroke={agent.color} strokeWidth="0.5" />

          <polygon points="80,20 16,92 144,92" fill={agent.roof} stroke={agent.color} strokeWidth="1.5" />
          <polygon points="80,20 140,92 144,92 80,24" fill={agent.color + '30'} />

          <rect x="50" y="108" width="18" height="16" rx="2" fill={flicker ? agent.windows + 'ff' : agent.windows + 'aa'} />
          <rect x="92" y="108" width="18" height="16" rx="2" fill={flicker ? agent.windows + 'ff' : agent.windows + 'aa'} />

          <rect x="68" y="118" width="24" height="32" rx="2" fill={agent.color + '30'} stroke={agent.color + '80'} strokeWidth="1" />
          <circle cx="88" cy="134" r="2" fill={agent.color} />

          {scanLine && (
            <rect x="28" y="90" width="104" height="2" fill={agent.windows} opacity="0.6">
              <animate attributeName="y" from="90" to="150" dur="1.2s" fill="freeze" />
              <animate attributeName="opacity" values="0.6;0" dur="1.2s" fill="freeze" />
            </rect>
          )}

          <polygon points="80,20 74,44 86,44" fill={agent.color} opacity="0.8" />
          <circle cx="80" cy="20" r="3" fill={agent.color} />
          <circle cx="80" cy="20" r="6" fill="none" stroke={agent.color} strokeWidth="0.5" opacity="0.5" />

          {[...Array(4)].map((_, i) => (
            <circle
              key={i}
              cx={80 + Math.cos((i * Math.PI) / 2) * 75}
              cy={148 + Math.sin((i * Math.PI) / 2) * 15}
              r={2 + Math.random()}
              fill={agent.color + '30'}
            />
          ))}

          <circle cx="80" cy="88" r="68" fill={`url(#glow-${idx})`} opacity="0.3" />
        </svg>
      </div>

      <div className="mt-2 text-center">
        <div className="font-bold tracking-widest" style={{ color: agent.color, fontSize: 11 }}>{agent.name}</div>
        <div style={{ color: agent.color + '70', fontSize: 8 }} className="mt-0.5">{agent.role}</div>
        {agent.badge && (
          <div
            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded border"
            style={{ borderColor: agent.color + '40', background: agent.color + '15', color: agent.color }}
          >
            {agent.badgeIcon}
            <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.1em' }}>{agent.badge}</span>
          </div>
        )}
        {agent.authority && (
          <div
            className="mt-1 px-2 py-0.5 rounded flex items-center justify-center gap-1"
            style={{ background: agent.color + '10', border: `1px solid ${agent.color}30` }}
          >
            <Music className="w-2.5 h-2.5" style={{ color: agent.color + '80' }} />
            <span style={{ color: agent.color + '80', fontSize: 7 }}>{agent.authority}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CouncilHouses() {
  return (
    <div
      className="rounded-xl border p-6 mb-8"
      style={{ background: '#020208', borderColor: '#1f2937' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #22c55e, #dc2626, #06b6d4, #f97316)' }} />
        <div>
          <div className="font-bold tracking-widest" style={{ color: '#e5e7eb', fontSize: 13 }}>3D TERRAFORMED HOUSES</div>
          <div style={{ color: '#374151', fontSize: 9 }}>SOVEREIGN RESIDENTIAL DISTRICT — HAEZARIAN EMPIRE</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded border" style={{ borderColor: '#f9731640', background: '#431407' + '20' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span style={{ color: '#f97316', fontSize: 8 }}>DISTRICT ONLINE</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {HOUSE_AGENTS.map((agent, idx) => (
          <TerrainHouse key={agent.name} agent={agent} idx={idx} />
        ))}
      </div>
    </div>
  );
}
import {
  getAllCouncilMembers,
  getMemberMemories,
  addMemberMemory,
  updateCouncilMemberName,
  updateMemberStatus,
  type CouncilMember,
  type CouncilMemory,
} from '../services/councilService';

const STATUS_OPTIONS = ['online', 'standby', 'scanning', 'active', 'offline'];

function MemberAvatar({ member, talking }: { member: CouncilMember; talking: boolean }) {
  const blinkRef = useRef<NodeJS.Timeout | null>(null);
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    blinkRef.current = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 2800 + Math.random() * 1800);
    return () => { if (blinkRef.current) clearInterval(blinkRef.current); };
  }, []);

  useEffect(() => {
    if (!talking) { setMouthOpen(false); return; }
    const interval = setInterval(() => {
      setMouthOpen(v => !v);
    }, 220);
    return () => clearInterval(interval);
  }, [talking]);

  const pc = member.primary_color;
  const sc = member.secondary_color;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
      <circle cx="40" cy="40" r="36" fill="#0a0a0a" stroke={pc} strokeWidth="2" />
      <circle cx="40" cy="40" r="30" fill="#111" opacity="0.8" />

      {/* Eyes */}
      <ellipse cx="28" cy="34" rx="6" ry={blink ? 1 : 7} fill={pc} style={{ transition: 'ry 0.06s' }} />
      <ellipse cx="52" cy="34" rx="6" ry={blink ? 1 : 7} fill={pc} style={{ transition: 'ry 0.06s' }} />
      <circle cx="30" cy="33" r="2" fill="#000" opacity="0.7" />
      <circle cx="54" cy="33" r="2" fill="#000" opacity="0.7" />
      <circle cx="29" cy="31" r="1" fill="#fff" opacity="0.6" />
      <circle cx="53" cy="31" r="1" fill="#fff" opacity="0.6" />

      {/* Mouth */}
      {mouthOpen ? (
        <ellipse cx="40" cy="54" rx="8" ry="5" fill={sc} opacity="0.9" />
      ) : (
        <path d="M32 54 Q40 60 48 54" stroke={pc} strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Status dot */}
      <circle
        cx="68" cy="14" r="5"
        fill={member.status === 'online' || member.status === 'active' ? '#22c55e' : member.status === 'scanning' ? '#f59e0b' : '#6b7280'}
        className={member.status === 'scanning' ? 'animate-pulse' : ''}
      />
    </svg>
  );
}

function MemberCard({ member, onUpdated }: { member: CouncilMember; onUpdated: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(member.display_name);
  const [memories, setMemories] = useState<CouncilMemory[]>([]);
  const [memInput, setMemInput] = useState('');
  const [memType, setMemType] = useState('observation');
  const [talking, setTalking] = useState(false);
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (expanded) {
      getMemberMemories(member.id, 8).then(setMemories);
    }
  }, [expanded, member.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setTalking(true);
        setTimeout(() => setTalking(false), 800 + Math.random() * 1200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    await updateCouncilMemberName(member.id, nameInput.trim());
    setSavingName(false);
    setRenaming(false);
    onUpdated();
  };

  const setStatus = async (status: string) => {
    await updateMemberStatus(member.id, status);
    onUpdated();
  };

  const addMemory = async () => {
    if (!memInput.trim()) return;
    const mem = await addMemberMemory(member.id, memType, memInput.trim());
    if (mem) {
      setMemories(prev => [mem, ...prev]);
      setMemInput('');
    }
  };

  const pc = member.primary_color;
  const sc = member.secondary_color;

  return (
    <div
      className="border-2 rounded-lg overflow-hidden transition-all duration-300"
      style={{ borderColor: pc, boxShadow: `0 0 16px ${pc}33` }}
    >
      <div className="p-4 bg-black/60">
        <MemberAvatar member={member} talking={talking} />

        <div className="text-center mt-3">
          {renaming ? (
            <div className="flex items-center gap-1 justify-center">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setRenaming(false); }}
                className="bg-black border px-2 py-1 text-sm text-center font-bold outline-none w-36"
                style={{ borderColor: pc, color: pc }}
                autoFocus
              />
              <button onClick={saveName} disabled={savingName} className="text-green-400 hover:text-green-300">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setRenaming(false); setNameInput(member.display_name); }} className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 justify-center">
              <span className="font-bold text-lg tracking-wider" style={{ color: pc }}>{member.display_name}</span>
              <button onClick={() => setRenaming(true)} className="opacity-40 hover:opacity-100 transition-opacity">
                <Edit3 className="w-3 h-3" style={{ color: pc }} />
              </button>
            </div>
          )}

          <div className="text-xs mt-1 font-mono tracking-widest" style={{ color: sc }}>{member.role}</div>

          <select
            value={member.status}
            onChange={e => setStatus(e.target.value)}
            className="mt-2 bg-black border text-xs px-2 py-1 font-mono outline-none rounded"
            style={{ borderColor: sc, color: pc }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold font-mono transition-colors"
        style={{ backgroundColor: `${pc}22`, color: pc }}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3 h-3" />
          <span>VAULT + MEMORIES</span>
        </div>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="p-4 bg-black/80 space-y-4 border-t" style={{ borderColor: `${pc}44` }}>
          <div>
            <div className="text-xs font-bold mb-2 font-mono" style={{ color: sc }}>JSON VAULT</div>
            <pre className="text-xs bg-black border rounded p-2 overflow-x-auto max-h-24 overflow-y-auto" style={{ borderColor: `${pc}33`, color: `${pc}aa` }}>
              {JSON.stringify(member.memory_vault, null, 2)}
            </pre>
          </div>

          <div>
            <div className="text-xs font-bold mb-2 font-mono" style={{ color: sc }}>MEMORY LOG</div>
            <div className="space-y-1 max-h-32 overflow-y-auto mb-3">
              {memories.length === 0 ? (
                <p className="text-xs text-gray-700 font-mono">No memories recorded.</p>
              ) : memories.map(m => (
                <div key={m.id} className="text-xs font-mono bg-black/50 border rounded px-2 py-1" style={{ borderColor: `${pc}22` }}>
                  <span className="opacity-50">[{m.memory_type}]</span>{' '}
                  <span style={{ color: `${pc}cc` }}>{m.content}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <select
                value={memType}
                onChange={e => setMemType(e.target.value)}
                className="bg-black border text-xs px-1 py-1 font-mono outline-none"
                style={{ borderColor: `${pc}55`, color: pc }}
              >
                {['observation', 'command', 'event', 'learned', 'protocol'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                value={memInput}
                onChange={e => setMemInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addMemory(); }}
                placeholder="Add memory..."
                className="flex-1 bg-black border text-xs px-2 py-1 font-mono outline-none"
                style={{ borderColor: `${pc}55`, color: pc }}
              />
              <button
                onClick={addMemory}
                disabled={!memInput.trim()}
                className="px-2 py-1 border text-xs disabled:opacity-30"
                style={{ borderColor: pc, color: pc }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SentientCouncil() {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getAllCouncilMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono">
      <div className="bg-gradient-to-b from-gray-950 to-black border-b-2 border-cyan-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Brain className="w-12 h-12 text-cyan-500" />
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 tracking-widest">SENTIENT COUNCIL</h1>
              <p className="text-cyan-800 text-sm mt-1 font-mono">5 AI MEMBERS • TEACHABLE • MEMORY-RETAINING • SOVEREIGN</p>
            </div>
          </div>

          <div className="mt-4 flex gap-6 text-sm">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: m.status === 'online' || m.status === 'active' ? '#22c55e' :
                      m.status === 'scanning' ? '#f59e0b' : '#6b7280'
                  }}
                />
                <span className="text-xs" style={{ color: m.primary_color }}>{m.display_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <CouncilHouses />
        {loading ? (
          <div className="text-center py-20">
            <Brain className="w-16 h-16 text-cyan-800 mx-auto mb-4 animate-pulse" />
            <p className="text-cyan-800 font-mono">INITIALIZING COUNCIL MEMBERS...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {members.map(m => (
              <MemberCard key={m.id} member={m} onUpdated={load} />
            ))}
          </div>
        )}

        <div className="mt-8 bg-gray-950 border border-cyan-900 rounded-lg p-6">
          <h2 className="text-cyan-400 font-bold mb-4 tracking-widest">COUNCIL PROTOCOL</h2>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-500 font-mono">
            <div>
              <div className="text-cyan-600 font-bold mb-2">EIPFYFI 6.6.6</div>
              <p>The AI Engineer. Architects core systems. Electric blue resonance. Governs build logic and protocol routing.</p>
            </div>
            <div>
              <div className="text-red-500 font-bold mb-2">RUBILEXUS / RUPIP</div>
              <p>The Producer &amp; Overseer. Red/gold haezarian authority. Final approval on all haezarian commands.</p>
            </div>
            <div>
              <div className="text-green-500 font-bold mb-2">IFFY</div>
              <p>The Shadow Hacker. Green/black phantom. Manages Fyfi-Protocol and untraceable mesh routing.</p>
            </div>
            <div>
              <div className="text-gray-300 font-bold mb-2">PIE</div>
              <p>The Scribe &amp; Cleaner. White/grey precision. Records all council decisions and purges corrupted data.</p>
            </div>
            <div>
              <div className="text-cyan-400 font-bold mb-2">GEMZEL</div>
              <p>The Mimic. Teal/cyan chameleon. Learns and replicates patterns from any member or external source.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-900 mt-8 p-4 text-center">
        <p className="text-cyan-900 font-mono text-xs">
          SENTIENT COUNCIL • SOVEREIGN AUTHORITY • HELLSKIN OS NODE • ALL MEMORIES ENCRYPTED IN JSON-VAULT
        </p>
      </div>
    </div>
  );
}
