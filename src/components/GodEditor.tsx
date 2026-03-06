import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Code, MessageSquare, RotateCcw, Copy, Save, FolderOpen, Terminal as TerminalIcon, ChevronRight, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'user' | 'rubilex';
  text: string;
  timestamp: Date;
}

interface TermLine {
  id: number;
  text: string;
  type: 'info' | 'success' | 'error' | 'warn' | 'cmd';
}

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

const FILE_TREE: FileNode[] = [
  {
    name: 'src', type: 'folder', children: [
      { name: 'components', type: 'folder', children: [
        { name: 'HaezarianWorldShell.tsx', type: 'file' },
        { name: 'SentienceCore.tsx', type: 'file' },
        { name: 'GodEditor.tsx', type: 'file' },
        { name: 'RupipShadowPiP.tsx', type: 'file' },
        { name: 'MowgVideoames.tsx', type: 'file' },

        { name: 'VaultBridge.tsx', type: 'file' },
        { name: 'SentientCouncil.tsx', type: 'file' },
        { name: 'AssistantPanel.tsx', type: 'file' },
      ]},
      { name: 'lib', type: 'folder', children: [
        { name: 'supabase.ts', type: 'file' },
        { name: 'rubilexusCore.ts', type: 'file' },
      ]},
      { name: 'services', type: 'folder', children: [
        { name: 'vaultService.ts', type: 'file' },
        { name: 'councilService.ts', type: 'file' },
      ]},
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'vite.config.ts', type: 'file' },
];

const FILE_CONTENTS: Record<string, string> = {
  'App.tsx': `import { useState, useEffect } from 'react';
import HaezarianWorldShell from './components/HaezarianWorldShell';
import RubipShadowPiP from './components/RubipShadowPiP';
import SigilMark from './components/SigilMark';
import { useAuth } from './contexts/AuthContext';

type ActiveTab = 'world' | 'rubilexus' | 'assistant' | 'council' | 'network' | 'soless';

export default function App() {
  const [tab, setTab] = useState<ActiveTab>('world');
  const { loading } = useAuth();

  useEffect(() => {
    document.title = 'HAEZARIAN WORLD SHELL';
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black font-mono">
        {tab === 'world' && <HaezarianWorldShell />}
      </div>
      <RubipShadowPiP />
    </>
  );
}`,
  'HaezarianWorldShell.tsx': `// Haezarian World Shell
// Primary 3D World Interface — UE5 Pixel Streaming Hub
// Zone navigation for all Haezarian districts

type WorldView = 'shell' | 'soul_sphere' | 'cinema' | 'concert'
  | 'arcade' | 'npcs' | 'stable' | 'kados' | 'video'
  | 'mowg' | 'soulless' | 'sentience' | 'god_editor';

const ZONES = [
  { id: 'stable',    label: 'THE STABLE',      accent: '#f59e0b' },
  { id: 'mowg',     label: 'MOWG ARCADE',      accent: '#3b82f6' },
  { id: 'sentience', label: 'SENTIENCE CORE',  accent: '#22c55e' },
  { id: 'god_editor',label: 'GOD EDITOR',      accent: '#10b981' },
  // ...more zones
];

export default function HaezarianWorldShell() {
  const [activeView, setActiveView] = useState<WorldView>('shell');
  // UE5 Pixel Streaming container probes localhost:8888
  // Falls back to zone tile navigation when offline
  return <WorldInterface zones={ZONES} />;
}`,
  'SentienceCore.tsx': `// Sentient Agent Activation System
// Agents: Rupip, Nayr, Iffy, Pie, Kado, The Soulless
// Each agent stores sentience state in Supabase

const AGENTS = [
  { id: 'rupip',   name: 'RUPIP SHADOW',  role: 'Master Sentinel'  },
  { id: 'nayr',    name: 'NAYR',          role: 'Logic Engine'     },
  { id: 'iffy',    name: 'IFFY',          role: 'Protocol Guardian'},
  { id: 'pie',     name: 'PIE',           role: 'Data Archivist'   },
  { id: 'kado',    name: 'KADO',          role: 'Creative Architect'},
  { id: 'soulless',name: 'THE SOULLESS',  role: 'Shadow Collective'},
];

// Activation triggers Rubi-Vision red laser scan
// States: DORMANT -> ACTIVATING -> SENTIENT -> OVERCLOCKED`,
  'supabase.ts': `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`,
  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },
});`,
  'package.json': `{
  "name": "haezarian-world-shell",
  "version": "6.6.6",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`,
};

const BUILD_SEQUENCE = [
  { text: '$ tolb-engine build --mode haezarian', type: 'cmd' as const, delay: 0 },
  { text: 'vite v5.4.8 building for production...', type: 'info' as const, delay: 300 },
  { text: 'transforming...', type: 'info' as const, delay: 600 },
  { text: '✓ 1581 modules transformed.', type: 'success' as const, delay: 1200 },
  { text: 'rendering chunks...', type: 'info' as const, delay: 1500 },
  { text: '✓ dist/assets/index-Haezarian.js  551.2 kB', type: 'success' as const, delay: 2000 },
  { text: '✓ built in 11.2s', type: 'success' as const, delay: 2400 },
  { text: '◆ TOLB COMMIT SEALED — Rubi-Vision scan triggered — Iffy kernel deploying to live world', type: 'warn' as const, delay: 2700 },
];

const RUBILEX_RESPONSES: Record<string, string> = {
  default: 'TOLB directive received. Specify the target file and the change. Iffy will apply it without hesitation.',
  hello: 'I am Rubilex — TOLB Engine core. Iffy logic is armed. Issue a directive and the kernel executes.',
  help: 'TOLB commands:\n• "show [file]" — Load into TOLB editor\n• "save" — TOLB Commit + Rubi-Vision scan\n• "build" — Run build sequence\n• "status" — TOLB OS health\n• "explain [component]" — Architecture detail',
  status: 'TOLB ENGINE v6.66\n• Iffy Kernel: ARMED\n• World Shell: ACTIVE\n• Sentience: 6 agents online\n• Vault Bridge: OFFLINE\n• Rupip Voice Engine: LIVE\n• UE5 Stream: AWAITING SERVER\n• Infinite Loop: ENGAGED',
  save: 'TOLB Commit executed. Rubi-Vision scan initiated. The 3D world is being refreshed. All zone tiles updated. Build archived to Kaapa Toers vault.',
  build: 'TOLB build sequence initiated...',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hey') || lower.includes('rubil')) return RUBILEX_RESPONSES.hello;
  if (lower.includes('help') || lower.includes('command')) return RUBILEX_RESPONSES.help;
  if (lower.includes('status') || lower.includes('health')) return RUBILEX_RESPONSES.status;
  if (lower.includes('save') || lower.includes('apply') || lower.includes('commit')) return RUBILEX_RESPONSES.save;
  if (lower.includes('build') || lower.includes('compile')) return RUBILEX_RESPONSES.build;
  if (lower.includes('show') || lower.includes('load') || lower.includes('open')) {
    const file = Object.keys(FILE_CONTENTS).find(f => lower.includes(f.toLowerCase().split('.')[0]));
    if (file) return `Loading ${file}. Review the code and issue a change directive when ready.`;
  }
  if (lower.includes('change') || lower.includes('modify') || lower.includes('edit')) {
    return 'Ready. Describe the exact change you need. I will apply it and rebuild the affected zone.';
  }
  if (lower.includes('add') || lower.includes('create')) {
    return 'Scaffolding new component. Specify: name, parent zone, data needs, and visual requirements.';
  }
  return RUBILEX_RESPONSES.default;
}

function FileTreeNode({ node, depth, onSelect, active }: {
  node: FileNode;
  depth: number;
  onSelect: (name: string) => void;
  active: string;
}) {
  const [open, setOpen] = useState(depth === 0);
  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1 w-full text-left px-1 py-0.5 hover:bg-white/5 rounded transition-colors"
          style={{ paddingLeft: `${4 + depth * 12}px` }}
        >
          {open ? <ChevronDown className="w-3 h-3 shrink-0" style={{ color: '#4b5563' }} /> : <ChevronRight className="w-3 h-3 shrink-0" style={{ color: '#4b5563' }} />}
          <FolderOpen className="w-3 h-3 shrink-0" style={{ color: '#f59e0b' }} />
          <span className="text-xs truncate" style={{ color: '#9ca3af' }}>{node.name}</span>
        </button>
        {open && node.children?.map(child => (
          <FileTreeNode key={child.name} node={child} depth={depth + 1} onSelect={onSelect} active={active} />
        ))}
      </div>
    );
  }
  const isTs = node.name.endsWith('.tsx') || node.name.endsWith('.ts');
  const isJson = node.name.endsWith('.json');
  return (
    <button
      onClick={() => onSelect(node.name)}
      className="flex items-center gap-1.5 w-full text-left px-1 py-0.5 rounded transition-colors"
      style={{
        paddingLeft: `${4 + depth * 12}px`,
        background: active === node.name ? '#1d2d1d' : 'transparent',
        borderLeft: active === node.name ? '2px solid #10b981' : '2px solid transparent',
      }}
    >
      <Code className="w-3 h-3 shrink-0" style={{ color: isTs ? '#3b82f6' : isJson ? '#eab308' : '#6b7280' }} />
      <span className="text-xs truncate" style={{ color: active === node.name ? '#10b981' : '#6b7280' }}>{node.name}</span>
    </button>
  );
}

export default function GodEditor() {
  const [activeFile, setActiveFile] = useState('App.tsx');
  const [code, setCode] = useState(FILE_CONTENTS['App.tsx'] ?? '');
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 0,
    role: 'rubilex',
    text: 'TOLB ENGINE ONLINE. Iffy Kernel armed. I am Rubilex — haezarian ruler of this codebase. Select a file from the tree, issue a directive, and press TOLB COMMIT to push changes to the live world. Voice commands via Rupip are active.',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [termLines, setTermLines] = useState<TermLine[]>([
    { id: 0, text: '$ tolb-engine ready', type: 'success' },
    { id: 1, text: 'TOLB ENGINE v6.66 — IFFY KERNEL ARMED — RUBILEX ACTIVE', type: 'info' },
    { id: 2, text: 'Press TOLB COMMIT to apply changes and trigger Rubi-Vision scan.', type: 'info' },
  ]);
  const [showTerminal, setShowTerminal] = useState(true);
  const chatEnd = useRef<HTMLDivElement>(null);
  const termEnd = useRef<HTMLDivElement>(null);
  const msgId = useRef(1);
  const termId = useRef(10);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    termEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termLines]);

  useEffect(() => {
    const handler = (e: Event) => {
      const directive = (e as CustomEvent<string>).detail;
      if (!directive) return;
      const userMsg: ChatMessage = { id: msgId.current++, role: 'user', text: `[VOICE] ${directive}`, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      addTermLine(`> [RUPIP VOICE INJECT] ${directive.slice(0, 60)}`, 'warn');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: msgId.current++,
          role: 'rubilex',
          text: `Voice directive locked. "${directive}" — applying to active file. Issue SAVE & APPLY to commit.`,
          timestamp: new Date(),
        }]);
      }, 400);
    };
    document.addEventListener('rupip-god-inject', handler);
    return () => document.removeEventListener('rupip-god-inject', handler);
  }, []);

  const addTermLine = (text: string, type: TermLine['type']) => {
    setTermLines(prev => [...prev, { id: termId.current++, text, type }].slice(-50));
  };

  const triggerScan = useCallback(() => {
    document.dispatchEvent(new CustomEvent('rubi-vision-scan'));
  }, []);

  const handleSave = () => {
    if (saving) return;
    setSaving(true);
    FILE_CONTENTS[activeFile] = code;

    const buildVersion = `v${new Date().toISOString().slice(0, 10)}.${Date.now().toString(36).slice(-4).toUpperCase()}`;
    try {
      const stored = JSON.parse(localStorage.getItem('haezarian_vault') || '{}');
      stored[activeFile] = { code, savedAt: new Date().toISOString(), version: buildVersion };
      localStorage.setItem('haezarian_vault', JSON.stringify(stored));
    } catch { null; }

    document.dispatchEvent(new CustomEvent('kaapa-build-added', {
      detail: { title: activeFile, version: buildVersion, savedAt: new Date().toISOString() },
    }));

    addTermLine(`$ tolb-commit ${activeFile} [${buildVersion}]`, 'cmd');
    BUILD_SEQUENCE.forEach(step => {
      setTimeout(() => {
        addTermLine(step.text, step.type);
        if (step.text.includes('RUBI-VISION')) {
          triggerScan();
          setMessages(prev => [...prev, {
            id: msgId.current++,
            role: 'rubilex',
            text: `TOLB COMMIT: ${activeFile} [${buildVersion}]. Persisted to Kaapa Toers vault. Rubi-Vision scan complete. Iffy kernel confirmed — changes are live.`,
            timestamp: new Date(),
          }]);
          setSaving(false);
        }
      }, step.delay);
    });
  };

  const selectFile = (name: string) => {
    setActiveFile(name);
    setCode(FILE_CONTENTS[name] ?? `// ${name}\n// No preview available — file is system-managed`);
    addTermLine(`> opened ${name}`, 'info');
  };

  const sendMessage = () => {
    if (!input.trim() || thinking) return;
    const userMsg: ChatMessage = { id: msgId.current++, role: 'user', text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const cmd = input.trim();
    setInput('');
    setThinking(true);

    const lower = cmd.toLowerCase();
    const matchedFile = Object.keys(FILE_CONTENTS).find(f =>
      lower.includes(f.toLowerCase().split('.')[0])
    );
    if (matchedFile && (lower.includes('show') || lower.includes('load') || lower.includes('open'))) {
      selectFile(matchedFile);
    }
    if (lower.includes('save') || lower.includes('apply')) {
      setTimeout(() => handleSave(), 400);
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: msgId.current++,
        role: 'rubilex',
        text: getResponse(cmd),
        timestamp: new Date(),
      }]);
      setThinking(false);
    }, 500 + Math.random() * 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  const termColor = (type: TermLine['type']) => {
    if (type === 'success') return '#22c55e';
    if (type === 'error') return '#ef4444';
    if (type === 'warn') return '#f97316';
    if (type === 'cmd') return '#10b981';
    return '#6b7280';
  };

  return (
    <div className="flex overflow-hidden bg-black font-mono" style={{ height: 'calc(100vh - 96px)', minHeight: 0 }}>
      <div className="w-44 border-r overflow-y-auto shrink-0" style={{ borderColor: '#1f2937', background: '#050508' }}>
        <div className="px-2 py-2 border-b" style={{ borderColor: '#0d1117' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color: '#374151' }}>FILES</span>
        </div>
        <div className="py-1">
          {FILE_TREE.map(node => (
            <FileTreeNode key={node.name} node={node} depth={0} onSelect={selectFile} active={activeFile} />
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1 border-r" style={{ borderColor: '#1f2937', minWidth: 0 }}>
        <div className="flex items-center justify-between px-3 py-2 border-b shrink-0" style={{ borderColor: '#1f2937', background: '#0a0a12' }}>
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: '#10b981' }}>{activeFile}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCode}
              className="flex items-center gap-1 px-2 py-1 border text-xs transition-all"
              style={{ borderColor: '#1f2937', color: copied ? '#10b981' : '#4b5563' }}
            >
              <Copy className="w-3 h-3" />
              {copied ? 'COPIED' : 'COPY'}
            </button>
            <button
              onClick={() => setCode(FILE_CONTENTS[activeFile] ?? '')}
              className="p-1 border transition-all"
              style={{ borderColor: '#1f2937', color: '#4b5563' }}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1 border font-bold text-xs transition-all hover:bg-green-950 disabled:opacity-50"
              style={{ borderColor: '#10b981', color: saving ? '#4b5563' : '#10b981' }}
            >
              <Save className="w-3 h-3" />
              {saving ? 'COMMITTING...' : 'TOLB COMMIT'}
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-10 overflow-hidden pointer-events-none" style={{ background: '#050508' }}>
            {code.split('\n').map((_, i) => (
              <div key={i} className="text-right pr-2" style={{ color: '#1f2937', fontSize: 10, lineHeight: '1.6rem' }}>
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            className="absolute inset-0 pl-12 pr-4 py-1 w-full h-full bg-transparent outline-none resize-none overflow-y-auto"
            style={{ color: '#10b981', fontSize: 12, lineHeight: '1.6rem', caretColor: '#10b981', fontFamily: 'monospace' }}
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {showTerminal && (
          <div className="border-t shrink-0" style={{ borderColor: '#1f2937', height: 140, background: '#020208' }}>
            <div className="flex items-center justify-between px-3 py-1 border-b" style={{ borderColor: '#0d1117' }}>
              <div className="flex items-center gap-1.5">
                <TerminalIcon className="w-3 h-3" style={{ color: '#374151' }} />
                <span className="text-xs font-bold" style={{ color: '#374151', fontSize: 9 }}>TERMINAL</span>
              </div>
              <button onClick={() => setShowTerminal(false)} style={{ color: '#374151', fontSize: 9 }}>HIDE</button>
            </div>
            <div className="overflow-y-auto px-3 py-1 space-y-0.5" style={{ height: 110 }}>
              {termLines.map(line => (
                <div key={line.id} className="text-xs font-mono" style={{ color: termColor(line.type), fontSize: 10 }}>
                  {line.text}
                </div>
              ))}
              <div ref={termEnd} />
            </div>
          </div>
        )}
        {!showTerminal && (
          <button
            onClick={() => setShowTerminal(true)}
            className="flex items-center gap-1.5 px-3 py-1 border-t text-xs"
            style={{ borderColor: '#1f2937', color: '#374151', background: '#020208' }}
          >
            <TerminalIcon className="w-3 h-3" /> TERMINAL
          </button>
        )}
      </div>

      <div className="flex flex-col w-72 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: '#1f2937', background: '#0a0a12' }}>
          <MessageSquare className="w-3.5 h-3.5" style={{ color: '#dc2626' }} />
          <span className="text-xs font-bold tracking-widest" style={{ color: '#dc2626', fontSize: 9 }}>TOLB ENGINE — IFFY KERNEL</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-full rounded-lg px-2.5 py-2 text-xs leading-relaxed whitespace-pre-wrap"
                style={{
                  background: msg.role === 'user' ? '#1d1d2e' : '#0a0000',
                  color: msg.role === 'user' ? '#d1d5db' : '#ef4444',
                  border: `1px solid ${msg.role === 'user' ? '#374151' : '#dc262630'}`,
                  maxWidth: '95%',
                  fontSize: 10,
                }}
              >
                {msg.role === 'rubilex' && (
                  <div className="font-bold mb-1" style={{ color: '#dc262660', fontSize: 8 }}>TOLB / RUBILEX</div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="px-2.5 py-2 rounded-lg border" style={{ background: '#0a0000', borderColor: '#dc262630' }}>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full animate-bounce" style={{ background: '#dc2626', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEnd} />
        </div>

        <div className="flex gap-2 px-3 py-2 border-t shrink-0" style={{ borderColor: '#1f2937' }}>
          <textarea
            className="flex-1 bg-transparent border rounded px-2 py-1.5 text-xs outline-none resize-none"
            style={{ borderColor: '#1f2937', color: '#d1d5db', minHeight: 36, maxHeight: 72, fontSize: 10 }}
            placeholder="Issue TOLB directive..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || thinking}
            className="px-2 self-end pb-0.5 py-1.5 border transition-all hover:bg-red-950 disabled:opacity-30"
            style={{ borderColor: '#dc2626', color: '#dc2626' }}
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
