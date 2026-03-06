import { useState, useEffect, useRef } from 'react';
import { Trash2, Wifi, Eye, Lock, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface DumpItem {
  id: number;
  label: string;
  size: number;
  crunched: boolean;
}

function TrashDumpster() {
  const [items, setItems] = useState<DumpItem[]>([]);
  const [crunching, setCrunching] = useState(false);
  const [inputLabel, setInputLabel] = useState('');
  const [shake, setShake] = useState(false);
  const [totalCrunched, setTotalCrunched] = useState(0);
  const idRef = useRef(0);

  const addItem = () => {
    if (!inputLabel.trim()) return;
    const newItem: DumpItem = {
      id: ++idRef.current,
      label: inputLabel.trim(),
      size: Math.floor(Math.random() * 900) + 100,
      crunched: false,
    };
    setItems(prev => [...prev, newItem]);
    setInputLabel('');
  };

  const crunchAll = () => {
    if (items.filter(i => !i.crunched).length === 0) return;
    setCrunching(true);
    setShake(true);
    setTimeout(() => setShake(false), 600);
    let delay = 0;
    items.forEach((item, idx) => {
      if (!item.crunched) {
        delay += 300;
        setTimeout(() => {
          setItems(prev => prev.map((it, i) => i === idx ? { ...it, crunched: true } : it));
          setTotalCrunched(prev => prev + item.size);
        }, delay);
      }
    });
    setTimeout(() => {
      setCrunching(false);
    }, delay + 300);
  };

  const clearAll = () => {
    setItems([]);
    setTotalCrunched(0);
  };

  return (
    <div className="bg-gray-950 border-2 border-gray-700 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`transition-transform duration-100 ${shake ? 'rotate-12' : ''}`}
        >
          <Trash2 className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-300 tracking-widest">TRASH-PACT DUMPSTER</h2>
          <p className="text-gray-600 text-xs">Infinite capacity • Data crunch engine</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-lg font-bold text-green-400">{(totalCrunched / 1024).toFixed(1)} MB</div>
          <div className="text-xs text-gray-600">CRUNCHED</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={inputLabel}
          onChange={e => setInputLabel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addItem(); }}
          placeholder="Drop data into dumpster..."
          className="flex-1 bg-black border border-gray-700 px-3 py-2 text-gray-300 placeholder-gray-700 font-mono text-sm outline-none focus:border-gray-500"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 text-sm font-bold hover:bg-gray-700 transition-colors"
        >
          DUMP
        </button>
      </div>

      <div className="min-h-24 max-h-48 overflow-y-auto space-y-1 mb-4 bg-black border border-gray-900 rounded p-2">
        {items.length === 0 ? (
          <p className="text-gray-800 text-xs font-mono text-center py-4">Dumpster empty. Drop some data.</p>
        ) : items.map(item => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-2 py-1 text-xs font-mono rounded transition-all duration-500 ${
              item.crunched ? 'bg-green-950/30 border border-green-900/40 opacity-50' : 'bg-gray-900 border border-gray-800'
            }`}
          >
            <span className={item.crunched ? 'text-green-700 line-through' : 'text-gray-400'}>{item.label}</span>
            <span className={item.crunched ? 'text-green-700' : 'text-gray-600'}>{item.size} KB</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={crunchAll}
          disabled={crunching || items.filter(i => !i.crunched).length === 0}
          className={`flex-1 py-2 font-bold text-sm border-2 transition-all ${
            crunching
              ? 'bg-gray-800 border-gray-600 text-gray-400 animate-pulse'
              : 'bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-800'
          } disabled:opacity-30`}
        >
          {crunching ? 'CRUNCHING...' : 'CRUNCH ALL'}
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 border border-gray-800 text-gray-600 hover:border-gray-600 text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const FYFI_NODES = [
  { id: 'node_alpha', label: 'Alpha Node', latency: 12, region: 'HELL-WEST', active: true },
  { id: 'node_beta', label: 'Beta Node', latency: 8, region: 'SHADOW-EAST', active: true },
  { id: 'node_gamma', label: 'Gamma Node', latency: 34, region: 'VOID-NORTH', active: false },
  { id: 'node_iffy', label: 'Iffy Relay', latency: 4, region: 'ONYX-VPN', active: true },
];

function FyfiProtocol() {
  const [vpnActive, setVpnActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [bytes, setBytes] = useState(0);

  useEffect(() => {
    if (!vpnActive) return;
    const interval = setInterval(() => {
      setBytes(prev => prev + Math.floor(Math.random() * 512 + 128));
    }, 800);
    return () => clearInterval(interval);
  }, [vpnActive]);

  const toggleVpn = () => {
    if (connecting) return;
    if (vpnActive) {
      setVpnActive(false);
      setActiveNode(null);
      setBytes(0);
    } else {
      setConnecting(true);
      setTimeout(() => {
        setVpnActive(true);
        setActiveNode('node_iffy');
        setConnecting(false);
      }, 1800);
    }
  };

  const formatBytes = (b: number) => {
    if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(2)} MB`;
    if (b > 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${b} B`;
  };

  return (
    <div className="bg-gray-950 border-2 border-green-900 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-4">
        <Wifi className={`w-10 h-10 ${vpnActive ? 'text-green-400' : 'text-gray-600'} transition-colors`} />
        <div>
          <h2 className="text-xl font-bold text-green-400 tracking-widest">FYFI-PROTOCOL</h2>
          <p className="text-green-800 text-xs">Private untraceable mesh • Managed by Iffy</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${vpnActive ? 'bg-green-400 animate-pulse' : 'bg-gray-700'}`} />
          <span className={`text-xs font-bold ${vpnActive ? 'text-green-400' : 'text-gray-600'}`}>
            {connecting ? 'CONNECTING...' : vpnActive ? 'ACTIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {vpnActive && (
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="bg-black border border-green-900 rounded p-2">
            <div className="text-green-400 font-bold text-sm">{formatBytes(bytes)}</div>
            <div className="text-green-800 text-xs">TRANSFERRED</div>
          </div>
          <div className="bg-black border border-green-900 rounded p-2">
            <div className="text-green-400 font-bold text-sm">4ms</div>
            <div className="text-green-800 text-xs">LATENCY</div>
          </div>
          <div className="bg-black border border-green-900 rounded p-2">
            <div className="text-green-400 font-bold text-sm">256-bit</div>
            <div className="text-green-800 text-xs">ONYX ENC</div>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {FYFI_NODES.map(node => (
          <div
            key={node.id}
            onClick={() => vpnActive && setActiveNode(node.id)}
            className={`flex items-center justify-between px-3 py-2 border rounded text-xs font-mono cursor-pointer transition-all ${
              activeNode === node.id
                ? 'bg-green-950/30 border-green-600'
                : node.active
                ? 'bg-gray-900 border-gray-700 hover:border-green-800'
                : 'bg-black border-gray-900 opacity-40'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-green-500' : 'bg-gray-600'}`} />
              <span className={activeNode === node.id ? 'text-green-300' : 'text-gray-400'}>{node.label}</span>
              <span className="text-gray-700">{node.region}</span>
            </div>
            <span className={node.latency < 15 ? 'text-green-400' : node.latency < 30 ? 'text-amber-400' : 'text-red-400'}>
              {node.latency}ms
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={toggleVpn}
        disabled={connecting}
        className={`w-full py-3 font-bold text-sm border-2 transition-all ${
          vpnActive
            ? 'bg-green-900/40 border-green-600 text-green-400 hover:bg-red-950/30 hover:border-red-700 hover:text-red-400'
            : connecting
            ? 'bg-gray-900 border-gray-600 text-gray-400 animate-pulse'
            : 'bg-gray-900 border-green-800 text-green-600 hover:bg-green-950/30 hover:border-green-600 hover:text-green-400'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          {connecting ? 'ROUTING THROUGH IFFY...' : vpnActive ? 'DISCONNECT ONYX VPN' : 'ACTIVATE ONYX VPN'}
        </div>
      </button>
    </div>
  );
}

function ShadowLibrarian() {
  const [saves, setSaves] = useState<{ id: number; label: string; ts: string; status: 'saving' | 'saved' }[]>([]);
  const [sweeping, setSweeping] = useState(false);
  const [sweepY, setSweepY] = useState(-10);
  const idRef = useRef(0);

  const triggerSave = (label: string) => {
    const id = ++idRef.current;
    setSaves(prev => [...prev, { id, label, ts: new Date().toLocaleTimeString(), status: 'saving' }]);
    setSweeping(true);
    setSweepY(-10);

    const sweepInterval = setInterval(() => {
      setSweepY(y => {
        if (y >= 110) {
          clearInterval(sweepInterval);
          setSweeping(false);
          setSaves(prev => prev.map(s => s.id === id ? { ...s, status: 'saved' } : s));
          return -10;
        }
        return y + 4;
      });
    }, 20);
  };

  const SAVE_POINTS = [
    'Vault State',
    'Council Memories',
    'World Snapshot',
    'District Index',
    'Dialect Library',
  ];

  return (
    <div className="bg-gray-950 border-2 border-gray-600 rounded-lg p-5 relative overflow-hidden">
      {sweeping && (
        <div
          className="absolute left-0 right-0 h-0.5 z-20 pointer-events-none transition-none"
          style={{
            top: `${sweepY}%`,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            boxShadow: '0 0 12px 4px rgba(255,255,255,0.15)',
          }}
        />
      )}

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <Eye className="w-10 h-10 text-gray-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-300 tracking-widest">SHADOW LIBRARIAN</h2>
          <p className="text-gray-600 text-xs">Ghost-sweep save engine • Silent archivist</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {SAVE_POINTS.map(sp => (
          <button
            key={sp}
            onClick={() => triggerSave(sp)}
            disabled={sweeping}
            className="py-2 px-3 bg-black border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 text-xs font-mono transition-all disabled:opacity-40 text-left"
          >
            {sp}
          </button>
        ))}
      </div>

      <div className="space-y-1 max-h-28 overflow-y-auto">
        {saves.length === 0 ? (
          <p className="text-gray-800 text-xs font-mono text-center py-3">No saves logged.</p>
        ) : [...saves].reverse().map(s => (
          <div key={s.id} className="flex items-center justify-between text-xs font-mono px-2 py-1 bg-black border border-gray-900 rounded">
            <div className="flex items-center gap-2">
              {s.status === 'saving' ? (
                <AlertCircle className="w-3 h-3 text-amber-500 animate-pulse" />
              ) : (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
              <span className={s.status === 'saved' ? 'text-gray-400' : 'text-amber-400'}>{s.label}</span>
            </div>
            <span className="text-gray-700">{s.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InfrastructurePanel() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono">
      <div className="bg-gradient-to-b from-gray-950 to-black border-b-2 border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-300 tracking-widest">INFRASTRUCTURE</h1>
          <p className="text-gray-600 text-sm mt-1">TRASH-PACT • FYFI-PROTOCOL • SHADOW LIBRARIAN • SOVEREIGN CORE</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrashDumpster />
        <FyfiProtocol />
        <ShadowLibrarian />
      </div>

      <div className="border-t border-gray-800 mt-8 p-4 text-center">
        <p className="text-gray-800 font-mono text-xs">
          INFRASTRUCTURE CORE • IFFY-MANAGED • HELLSKIN OS • ALL SYSTEMS SOVEREIGN
        </p>
      </div>
    </div>
  );
}
