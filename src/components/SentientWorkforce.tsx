import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Upload, Brain, Trash2, ChevronDown, ChevronUp, Loader2, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { KadoColors, DEFAULT_KADO_COLORS, loadKadoFromFile } from '../lib/kadoMorph';

type AgentId = 'iffy' | 'pie' | 'gemzel';

interface AgentMsg { id: string; role: 'user' | 'agent'; content: string; created_at: string; }
interface CacheEntry { key: string; value: string; }

const AGENTS: Record<AgentId, {
  name: string; role: string; color: string; bg: string;
  greetings: string[];
  patterns: [string, string[]][];
  fallback: (m: string) => string;
  defaultColors: KadoColors;
}> = {
  iffy: {
    name: 'IFFY', role: 'GHOSTHACKER / DECODER',
    color: '#ef4444', bg: '#1a0000',
    defaultColors: { skin: '#c0392b', hair: '#0a0000', eye: '#7f0000', accent: '#ef4444' },
    greetings: [
      '[IFFY] Ghost channels open. Phantom sectors clean. Awaiting command.',
      '[IFFY] Decoder matrix primed. Ready to sweep deleted data.',
    ],
    patterns: [
      ['ghost|delet|recover|lost|missing|phantom', [
        'Ghost sweep initiated. Scanning phantom sectors for residual signatures...',
        'Deleted block detected. Hex recovery protocol deployed. Routing to Shadow Vault.',
        'Phantom data fragment recovered. Ghost-tag applied. Filing to TRASH BOUND cabinet.',
      ]],
      ['decrypt|decode|cipher|hex|encod|encry', [
        'Cipher engaged. XOR decode pass running. Entropy: nominal.',
        'Decryption matrix loaded. Target stream analyzed. Key derived.',
        `Hash cracked: ${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6,'0')}. Data exposed.`,
      ]],
      ['hack|breach|access|bypass|intrude|exploit', [
        'Haezarian breach protocol deployed. Social vector calculated. Entry acquired.',
        'Exploit chain mapped. Zero-day window identified. Handshake accepted.',
      ]],
      ['file|data|document|upload|cabinet|vault', [
        'File signature scanned. Ghost fingerprint embedded. Routing to Shadow Librarian...',
        'Data block parsed. Haezarian tag written. Auto-filing to appropriate cabinet.',
      ]],
    ],
    fallback: (m) => `[IFFY] Packet analyzed: "${m.slice(0,18)}..." | Ghostprint: 0x${(Math.random()*0xFFFFFF|0).toString(16).toUpperCase().padStart(6,'0')} | Status: FILED`,
  },
  pie: {
    name: 'PIE', role: 'WASM EMULATOR ENGINEER',
    color: '#16a34a', bg: '#001a00',
    defaultColors: { skin: '#166534', hair: '#022c22', eye: '#14532d', accent: '#16a34a' },
    greetings: [
      '[PIE] WASM runtime initialized. 4 GB virtual node pool ready.',
      '[PIE] Virtual Pi online. Worker threads allocated. 10x acceleration standing by.',
    ],
    patterns: [
      ['wasm|virtual|emulat|node|worker|pi|compile', [
        'WASM module compiled in 34ms. Virtual node spawned. Zero-copy buffer ready.',
        'Emulation layer active. Pi kernel response nominal. Worker thread dispatched.',
        `Node #${Math.floor(Math.random()*16+1).toString().padStart(2,'0')} allocated. Throughput: ${(Math.random()*800+200).toFixed(0)} MB/s.`,
      ]],
      ['speed|fast|perform|optim|10x|acceler', [
        'Task offloaded to worker thread. Main thread freed. 10x acceleration confirmed.',
        'Parallel pipeline engaged across 4 virtual cores. Throughput maximized.',
      ]],
      ['render|3d|ue5|draw|frame|gpu|pipeline', [
        'UE5 render bridge connected. Draw call budget: 700. FPS: stable.',
        'GPU pipeline optimized. Triangle budget allocated. Render queue dispatched.',
      ]],
      ['memory|ram|storage|terabyte|food|disk', [
        'Memory map recalculated. 4 GB virtual RAM stable. No fragmentation.',
        'Terabyte partition mounted. Sector sweep complete. Ready to ingest.',
      ]],
    ],
    fallback: (m) => `[PIE] Task "${m.slice(0,16)}..." → Node #${Math.floor(Math.random()*16+1).toString().padStart(2,'0')} | ETA: ${(Math.random()*8+0.3).toFixed(1)}s | 10x active`,
  },
  gemzel: {
    name: 'GEMZEL', role: 'SYSTEM BABYSITTER',
    color: '#0891b2', bg: '#001020',
    defaultColors: { skin: '#0e7490', hair: '#042f3f', eye: '#0c4a6e', accent: '#0891b2' },
    greetings: [
      '[GEMZEL] The 12 await. All 47 threads accounted for. Babysitter online.',
      '[GEMZEL] System scan complete. 0 orphans. 0 crashes. All children stable.',
    ],
    patterns: [
      ['status|check|report|how|health|stable', [
        'Status report: 12 active entities, 47 threads, 0 failures. All stable.',
        'Babysitter scan complete: 0 crashes, 0 leaks, 0 orphaned processes.',
        'System health: CPU nominal, memory clean, 12 entities await.',
      ]],
      ['monitor|watch|track|alert|notify', [
        'Alert threshold set. Watchdog armed. I will notify on any misbehavior.',
        'Monitoring hook deployed. All children tagged. Babysitter log updated.',
      ]],
      ['crash|error|fail|broken|down|issue', [
        'Instability detected. Quarantine deployed. Recovery sequence initiated.',
        'Fault logged. Process restarted cleanly. The 12 remain stable.',
      ]],
      ['count|how many|list|all|number', [
        'Headcount: 12 NPC entities, 3 workers, 1 WASM node, 0 errors.',
        'Total active threads: 47. Services running: 12. Crashes today: 0.',
      ]],
    ],
    fallback: (m) => `[GEMZEL] Logged: "${m.slice(0,20)}..." → Babysitter record #${Date.now().toString().slice(-4)}. The 12 are aware. Status: STABLE`,
  },
};

function generateResponse(agentId: AgentId, message: string): string {
  const a = AGENTS[agentId];
  const lower = message.toLowerCase();
  for (const [pattern, responses] of a.patterns) {
    if (new RegExp(pattern).test(lower)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return a.fallback(message);
}

function extractLearnable(message: string): { key: string; value: string } | null {
  const lower = message.toLowerCase();
  const nameMatch = message.match(/(?:my name is|call me)\s+(\w+)/i);
  if (nameMatch) return { key: 'user_name', value: nameMatch[1] };
  if (/i prefer|i like|i want|i need|i always/.test(lower))
    return { key: `pref_${Date.now()}`, value: message.slice(0, 120) };
  if (/remember|don.t forget|note that|keep in mind/.test(lower))
    return { key: `mem_${Date.now()}`, value: message.slice(0, 120) };
  if (/always|never|every time/.test(lower))
    return { key: `rule_${Date.now()}`, value: message.slice(0, 120) };
  return null;
}

function MiniAvatarFace({ colors, mouthOpen, size = 56 }: { colors: KadoColors; mouthOpen: boolean; size?: number }) {
  const s = size;
  const cx = s / 2; const cy = s / 2;
  const r = s * 0.38;
  const ey = cy - s * 0.05;
  const es = s * 0.09;
  const er = s * 0.07;
  const mh = mouthOpen ? s * 0.1 : s * 0.015;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <defs>
        <radialGradient id={`sg${size}`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={colors.skin} />
          <stop offset="100%" stopColor={colors.skin} stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 4} fill={colors.accent} opacity="0.15" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#sg${size})`} stroke={colors.accent} strokeWidth="1.5" />
      <ellipse cx={cx} cy={cy - r * 0.6} rx={r * 0.85} ry={r * 0.5} fill={colors.hair} />
      {[-es, es].map((ex, i) => (
        <g key={i}>
          <ellipse cx={cx + ex} cy={ey} rx={er} ry={er * 0.85} fill="white" />
          <circle cx={cx + ex + er * 0.1} cy={ey + er * 0.1} r={er * 0.55} fill={colors.eye} />
          <circle cx={cx + ex + er * 0.3} cy={ey - er * 0.2} r={er * 0.2} fill="white" opacity={0.7} />
        </g>
      ))}
      <rect
        x={cx - s * 0.11} y={cy + s * 0.1 - mh / 2}
        width={s * 0.22} height={mh} rx={mh / 2}
        fill={mouthOpen ? '#0a0000' : colors.accent}
        style={{ transition: 'height 0.08s, y 0.08s' }}
      />
    </svg>
  );
}

interface AgentPanelProps {
  agentId: AgentId;
  userId: string;
}

function AgentPanel({ agentId, userId }: AgentPanelProps) {
  const agent = AGENTS[agentId];
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<AgentMsg[]>([]);
  const [cache, setCache] = useState<CacheEntry[]>([]);
  const [colors, setColors] = useState<KadoColors>(agent.defaultColors);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [morphing, setMorphing] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCache, setShowCache] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setMouthOpen(true);
      t = setTimeout(() => { setMouthOpen(false); cycle(); }, 120 + Math.random() * 2000);
    };
    const start = setTimeout(cycle, 500 + Math.random() * 3000);
    return () => { clearTimeout(start); clearTimeout(t); };
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const blink = () => {
      setBlinking(true);
      t = setTimeout(() => { setBlinking(false); t = setTimeout(blink, 2500 + Math.random() * 4000); }, 90);
    };
    t = setTimeout(blink, 1000 + Math.random() * 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!expanded || loading) return;
    setLoading(true);
    Promise.all([
      supabase.from('agent_messages').select('*').eq('user_id', userId).eq('agent_id', agentId).order('created_at', { ascending: true }).limit(40),
      supabase.from('agent_neural_cache').select('key,value').eq('user_id', userId).eq('agent_id', agentId).order('learned_at', { ascending: false }).limit(20),
    ]).then(([msgs, nc]) => {
      if (msgs.data) {
        setMessages(msgs.data as AgentMsg[]);
        if (msgs.data.length === 0) {
          const greeting = agent.greetings[Math.floor(Math.random() * agent.greetings.length)];
          setMessages([{ id: 'greet', role: 'agent', content: greeting, created_at: new Date().toISOString() }]);
        }
      }
      if (nc.data) setCache(nc.data as CacheEntry[]);
      setLoading(false);
    });
  }, [expanded]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput('');
    const userMsg: AgentMsg = { id: `u_${Date.now()}`, role: 'user', content: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);
    setMouthOpen(true);
    await supabase.from('agent_messages').insert({ user_id: userId, agent_id: agentId, role: 'user', content: text });
    const learnable = extractLearnable(text);
    if (learnable) {
      setCache(prev => [learnable, ...prev.filter(c => c.key !== learnable.key)]);
      supabase.from('agent_neural_cache').upsert({ user_id: userId, agent_id: agentId, key: learnable.key, value: learnable.value }, { onConflict: 'user_id,agent_id,key' });
    }
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    const response = generateResponse(agentId, text);
    setThinking(false);
    setMouthOpen(false);
    const agentMsg: AgentMsg = { id: `a_${Date.now()}`, role: 'agent', content: response, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, agentMsg]);
    supabase.from('agent_messages').insert({ user_id: userId, agent_id: agentId, role: 'agent', content: response });
  }, [input, thinking, agentId, userId]);

  const handleKadoMorph = useCallback(async (file: File) => {
    setMorphing(true);
    const newColors = await loadKadoFromFile(file);
    setColors(newColors);
    setMorphing(false);
  }, []);

  const clearMessages = useCallback(async () => {
    await supabase.from('agent_messages').delete().eq('user_id', userId).eq('agent_id', agentId);
    const greeting = agent.greetings[0];
    setMessages([{ id: 'greet', role: 'agent', content: greeting, created_at: new Date().toISOString() }]);
  }, [agentId, userId]);

  return (
    <div
      className="rounded-lg overflow-hidden transition-all font-mono"
      style={{
        border: `1.5px solid ${expanded ? colors.accent + '60' : '#1a1a1a'}`,
        boxShadow: expanded ? `0 0 28px ${colors.accent}25` : 'none',
        background: expanded ? agent.bg : '#060606',
        transition: 'all 0.3s',
      }}
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-3 text-left hover:opacity-90 transition-opacity"
        style={{ background: `${colors.accent}08` }}
      >
        <div
          className="shrink-0 rounded-full overflow-hidden"
          style={{
            border: `2px solid ${colors.accent}50`,
            boxShadow: `0 0 12px ${colors.accent}30`,
            filter: morphing ? 'brightness(1.4)' : 'none',
            transition: 'filter 0.4s',
          }}
        >
          <MiniAvatarFace colors={colors} mouthOpen={mouthOpen && !blinking} size={52} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest" style={{ color: colors.accent, fontSize: 11 }}>
              {agent.name}
            </span>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.accent, boxShadow: `0 0 4px ${colors.accent}` }} />
            <span style={{ color: `${colors.accent}60`, fontSize: 7, letterSpacing: '0.1em' }}>ONLINE</span>
          </div>
          <div style={{ color: '#444', fontSize: 8, letterSpacing: '0.1em' }}>{agent.role}</div>
          {messages.length > 0 && (
            <div className="truncate mt-0.5" style={{ color: '#333', fontSize: 8, maxWidth: 160 }}>
              {messages[messages.length - 1]?.content.slice(0, 40)}...
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {cache.length > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: `${colors.accent}15`, border: `1px solid ${colors.accent}20` }}>
              <Brain className="w-2.5 h-2.5" style={{ color: colors.accent }} />
              <span style={{ color: `${colors.accent}80`, fontSize: 7 }}>{cache.length}</span>
            </div>
          )}
          {expanded ? <ChevronUp className="w-4 h-4" style={{ color: colors.accent }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#444' }} />}
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid ${colors.accent}20` }}>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.accent }} />
              <span style={{ color: `${colors.accent}60`, fontSize: 9 }}>LOADING NEURAL CACHE...</span>
            </div>
          ) : (
            <>
              {showCache && cache.length > 0 && (
                <div className="p-3 border-b" style={{ borderColor: `${colors.accent}15`, background: `${colors.accent}05` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-3 h-3" style={{ color: colors.accent }} />
                      <span style={{ color: `${colors.accent}80`, fontSize: 8, letterSpacing: '0.15em' }}>NEURAL CACHE — {cache.length} LEARNED</span>
                    </div>
                    <button onClick={() => setShowCache(false)} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 8 }}>HIDE</button>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {cache.map(c => (
                      <div key={c.key} className="flex gap-2 items-start">
                        <span style={{ color: `${colors.accent}40`, fontSize: 7, whiteSpace: 'nowrap' }}>{c.key.replace(/_\d+$/, '')}</span>
                        <span className="truncate" style={{ color: '#555', fontSize: 7 }}>{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div ref={scrollRef} className="overflow-y-auto p-3 space-y-2" style={{ height: 220, scrollbarWidth: 'none' }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] rounded px-2.5 py-1.5"
                      style={{
                        background: msg.role === 'user' ? `${colors.accent}20` : '#0a0a0a',
                        border: `1px solid ${msg.role === 'user' ? colors.accent + '40' : '#1a1a1a'}`,
                        color: msg.role === 'user' ? colors.accent : '#888',
                        fontSize: 9,
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full animate-bounce" style={{ background: colors.accent, animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2 border-t" style={{ borderColor: `${colors.accent}15` }}>
                <div className="flex gap-1.5">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message ${agent.name}...`}
                    className="flex-1 bg-black border rounded px-2.5 py-1.5 font-mono outline-none placeholder-gray-800 transition-colors"
                    style={{ borderColor: `${colors.accent}25`, color: colors.accent, fontSize: 9 }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || thinking}
                    className="p-1.5 rounded border transition-all hover:opacity-80 disabled:opacity-30"
                    style={{ borderColor: `${colors.accent}40`, color: colors.accent, background: `${colors.accent}10` }}
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <label
                    className="flex items-center gap-1 px-2 py-1 rounded border cursor-pointer transition-opacity hover:opacity-80"
                    style={{ borderColor: `${colors.accent}20`, color: `${colors.accent}60`, fontSize: 7 }}
                  >
                    <Upload className="w-2.5 h-2.5" />
                    KADO MORPH
                    <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={e => { const f = e.target.files?.[0]; if (f) handleKadoMorph(f); if (fileRef.current) fileRef.current.value = ''; }} />
                  </label>
                  <button
                    onClick={() => setShowCache(v => !v)}
                    className="flex items-center gap-1 px-2 py-1 rounded border transition-opacity hover:opacity-80"
                    style={{ borderColor: `${colors.accent}20`, color: `${colors.accent}60`, fontSize: 7 }}
                  >
                    <Brain className="w-2.5 h-2.5" />
                    CACHE ({cache.length})
                  </button>
                  <button
                    onClick={clearMessages}
                    className="flex items-center gap-1 px-2 py-1 rounded border transition-opacity hover:opacity-80 ml-auto"
                    style={{ borderColor: '#1a1a1a', color: '#333', fontSize: 7 }}
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    CLEAR
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function SentientWorkforce() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen font-mono" style={{ background: '#030303' }}>
      <style>{`@keyframes scan { from{opacity:0.3} to{opacity:0.6} }`}</style>
      <div className="border-b px-4 py-4" style={{ borderColor: '#111', background: '#050505' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" style={{ color: '#555' }} />
                <h1 className="font-bold tracking-widest" style={{ color: '#aaa', fontSize: 18, letterSpacing: '0.2em' }}>SENTIENT WORKFORCE</h1>
              </div>
              <div style={{ color: '#333', fontSize: 8, letterSpacing: '0.2em', marginTop: 2 }}>
                HAEZARIAN NEURAL CORE v6.6 — 3 AGENTS ACTIVE — LOCAL LEARNING ENABLED
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(['#ef4444', '#16a34a', '#0891b2'] as const).map((c, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c, boxShadow: `0 0 4px ${c}` }} />
                </div>
              ))}
              <span style={{ color: '#333', fontSize: 7, letterSpacing: '0.1em', marginLeft: 4 }}>THE 12 AWAIT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {!user && (
          <div className="p-4 rounded border text-center mb-4" style={{ borderColor: '#222', background: '#050505' }}>
            <p style={{ color: '#444', fontSize: 10 }}>Sign in to activate your Sentient Workforce</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-3">
          {(['iffy', 'pie', 'gemzel'] as AgentId[]).map(id => (
            user
              ? <AgentPanel key={id} agentId={id} userId={user.id} />
              : <div key={id} className="rounded-lg border p-4 text-center" style={{ borderColor: '#1a1a1a', background: '#060606' }}>
                  <div style={{ color: AGENTS[id].color, fontSize: 11, fontWeight: 'bold', letterSpacing: '0.15em' }}>{AGENTS[id].name}</div>
                  <div style={{ color: '#333', fontSize: 8, marginTop: 4 }}>{AGENTS[id].role}</div>
                  <div style={{ color: '#222', fontSize: 7, marginTop: 8 }}>REQUIRES AUTH</div>
                </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded border" style={{ borderColor: '#111', background: '#050505' }}>
          <div style={{ color: '#222', fontSize: 8, letterSpacing: '0.15em', textAlign: 'center' }}>
            NEURAL CACHE: preferences + rules auto-extracted from conversation • KADO MORPH: upload image to update agent avatar • THE 12 AWAIT
          </div>
        </div>
      </div>
    </div>
  );
}
