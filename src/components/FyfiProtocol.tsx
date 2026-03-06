import { useState, useEffect } from 'react';
import { Wifi, Shield, Lock, Activity, Eye, EyeOff } from 'lucide-react';

interface MeshNode {
  id: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
  strength: number;
  color: string;
}

const NODE_LABELS = [
  'IFFY-CORE', 'ONYX-VPN-1', 'SHADOW-NODE-A', 'MESH-RELAY-1',
  'DARK-FIBER-1', 'ONYX-VPN-2', 'RUBILEXUS-HUB', 'ANON-EXIT-1',
  'MESH-RELAY-2', 'SHADOW-NODE-B', 'DARK-FIBER-2', 'ENCRYPTED-GW',
];

function buildNodes(): MeshNode[] {
  return NODE_LABELS.map((label, i) => ({
    id: `n${i}`,
    label,
    x: 15 + (i % 4) * 22 + Math.random() * 8,
    y: 15 + Math.floor(i / 4) * 30 + Math.random() * 8,
    active: Math.random() > 0.2,
    strength: Math.floor(60 + Math.random() * 40),
    color: i === 0 ? '#6b7280' : i < 3 ? '#1d4ed8' : '#374151',
  }));
}

function MeshMap({ nodes }: { nodes: MeshNode[] }) {
  const activeNodes = nodes.filter(n => n.active);
  const edges: [MeshNode, MeshNode][] = [];
  activeNodes.forEach((n, i) => {
    if (i + 1 < activeNodes.length) edges.push([n, activeNodes[i + 1]]);
    if (i + 2 < activeNodes.length && Math.random() > 0.5) edges.push([n, activeNodes[i + 2]]);
  });

  return (
    <svg viewBox="0 0 100 100" className="w-full h-48 bg-gray-950 rounded border border-gray-800">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke="#1d4ed840" strokeWidth="0.4"
        />
      ))}
      {nodes.map(node => (
        <g key={node.id}>
          <circle
            cx={node.x} cy={node.y} r={node.active ? 2.5 : 1.5}
            fill={node.active ? '#1d4ed8' : '#374151'}
            opacity={node.active ? 1 : 0.4}
          />
          {node.active && (
            <circle
              cx={node.x} cy={node.y} r={4}
              fill="none" stroke="#1d4ed830" strokeWidth="1"
            />
          )}
        </g>
      ))}
      <text x="2" y="97" fontSize="2.5" fill="#374151">FYFI MESH • IFFY MANAGED</text>
    </svg>
  );
}

export default function FyfiProtocol() {
  const [nodes, setNodes] = useState<MeshNode[]>(buildNodes());
  const [onyxActive, setOnyxActive] = useState(true);
  const [bandwidth, setBandwidth] = useState('0');
  const [latency, setLatency] = useState('0');
  const [hidden, setHidden] = useState(true);
  const [packetCount, setPacketCount] = useState(0);
  const [routeLogs, setRouteLogs] = useState<string[]>([
    'IFFY: Mesh initialized. All nodes encrypted.',
    'ONYX-VPN: Tunneling via dark fiber route.',
    'FYFI: 12-node mesh established.',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidth((Math.random() * 8.8 + 1.2).toFixed(2));
      setLatency((Math.random() * 8 + 1).toFixed(1));
      setPacketCount(p => p + Math.floor(Math.random() * 400 + 100));
      setNodes(prev => prev.map(n => ({
        ...n,
        active: Math.random() > 0.15,
        strength: Math.floor(60 + Math.random() * 40),
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        `IFFY: Re-routing through node SHADOW-${Math.floor(Math.random() * 9 + 1)}`,
        `ONYX-VPN: IP rotation complete. New exit: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.x.x`,
        `FYFI: Packet burst absorbed. ${Math.floor(Math.random() * 9000 + 1000)} pkts/s`,
        `MESH: Node strength rebalanced across ${nodes.filter(n => n.active).length} active nodes`,
        `SHADOW: Sweep complete. No traces detected.`,
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setRouteLogs(prev => [...prev.slice(-9), msg]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const activeNodeCount = nodes.filter(n => n.active).length;

  return (
    <div className="min-h-screen bg-black text-blue-400 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Wifi className="w-10 h-10 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-blue-400 tracking-widest">FYFI PROTOCOL</h1>
            <p className="text-blue-900 text-sm">INFINITE MESH NETWORK • ONYX VPN • IFFY-MANAGED</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-500 text-xs font-bold">MESH ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-950 border border-blue-900 rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{activeNodeCount}</div>
            <div className="text-xs text-gray-600">ACTIVE NODES</div>
          </div>
          <div className="bg-gray-950 border border-blue-900 rounded p-3 text-center">
            <div className="text-lg font-bold text-cyan-400">{bandwidth} Gb/s</div>
            <div className="text-xs text-gray-600">BANDWIDTH</div>
          </div>
          <div className="bg-gray-950 border border-blue-900 rounded p-3 text-center">
            <div className="text-lg font-bold text-green-400">{latency}ms</div>
            <div className="text-xs text-gray-600">LATENCY</div>
          </div>
          <div className="bg-gray-950 border border-blue-900 rounded p-3 text-center">
            <div className="text-sm font-bold text-yellow-500">{packetCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600">PACKETS ROUTED</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-blue-500 text-sm font-bold">MESH TOPOLOGY</span>
            </div>
            <MeshMap nodes={nodes} />
          </div>

          <div className="space-y-3">
            <div className="bg-gray-950 border border-blue-900 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-400 font-bold text-sm">ONYX VPN</span>
                </div>
                <button
                  onClick={() => setOnyxActive(!onyxActive)}
                  className={`px-3 py-1 text-xs font-bold border transition-colors ${
                    onyxActive
                      ? 'bg-blue-900 border-blue-700 text-blue-300'
                      : 'bg-gray-900 border-gray-700 text-gray-500'
                  }`}
                >
                  {onyxActive ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Protocol</span>
                  <span className="text-blue-400">ONYX-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager</span>
                  <span className="text-gray-400">IFFY (Shadow Hacker)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={onyxActive ? 'text-green-400' : 'text-red-400'}>
                    {onyxActive ? 'TUNNELING' : 'OFFLINE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trace Level</span>
                  <span className="text-green-400">ZERO</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-950 border border-blue-900 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-400 font-bold text-sm">NETWORK ID</span>
                </div>
                <button onClick={() => setHidden(!hidden)} className="text-gray-600 hover:text-gray-400">
                  {hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">SSID</span>
                  <span className="text-blue-400">{hidden ? '••••••••••••' : 'FYFI_SOVEREIGN_NET'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Public IP</span>
                  <span className="text-blue-400">{hidden ? '•••.•••.•••.•••' : '[MASKED BY ONYX]'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Encryption</span>
                  <span className="text-yellow-500">666-BIT SOVEREIGN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-950 border border-blue-900 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-blue-400 font-bold text-sm">ROUTE LOG — IFFY FEED</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {routeLogs.map((log, i) => (
              <div key={i} className="text-xs text-gray-500 flex gap-2">
                <span className="text-blue-900 shrink-0">[{String(i).padStart(2, '0')}]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
