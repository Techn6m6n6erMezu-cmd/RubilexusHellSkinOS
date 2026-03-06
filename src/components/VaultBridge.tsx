import { useState, useEffect, useCallback } from 'react';
import { Server, Wifi, WifiOff, RefreshCw, Activity, Cpu, Thermometer, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { createVaultConnection, VAULT_WS_URL, RECONNECT_INTERVAL_MS, type VaultStatus } from '../services/vaultService';

function NodeCard({ index, cpu, mem, totalMem, temp }: {
  index: number;
  cpu: number;
  mem: number;
  totalMem: number;
  temp: number;
}) {
  const cpuColor = cpu > 80 ? '#ef4444' : cpu > 50 ? '#f97316' : '#22c55e';
  const tempColor = temp > 70 ? '#ef4444' : temp > 55 ? '#f97316' : '#22c55e';
  return (
    <div className="border rounded-lg p-3 space-y-2" style={{ borderColor: '#1f2937', background: '#0d0d18' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-mono" style={{ color: '#6b7280' }}>NODE {index + 1}</span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
      </div>
      <div className="space-y-1.5">
        <div>
          <div className="flex justify-between mb-0.5">
            <span className="text-xs font-mono" style={{ color: '#4b5563', fontSize: 9 }}>CPU</span>
            <span className="text-xs font-mono" style={{ color: cpuColor, fontSize: 9 }}>{cpu.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1">
            <div className="h-1 rounded-full transition-all duration-1000" style={{ width: `${cpu}%`, background: cpuColor }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-0.5">
            <span className="text-xs font-mono" style={{ color: '#4b5563', fontSize: 9 }}>MEM</span>
            <span className="text-xs font-mono" style={{ color: '#60a5fa', fontSize: 9 }}>{mem}MB / {totalMem}MB</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1">
            <div className="h-1 rounded-full transition-all duration-1000" style={{ width: `${(mem / totalMem) * 100}%`, background: '#3b82f6' }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="w-2.5 h-2.5" style={{ color: tempColor }} />
          <span style={{ color: tempColor, fontSize: 9 }} className="font-mono">{temp.toFixed(1)}°C</span>
        </div>
      </div>
    </div>
  );
}

function OfflineBanner({ error, onRetry, retryIn }: { error: string; onRetry: () => void; retryIn: number }) {
  return (
    <div className="border rounded-xl p-6 text-center space-y-4" style={{ borderColor: '#7f1d1d50', background: '#0d0505' }}>
      <div className="flex items-center justify-center gap-3">
        <WifiOff className="w-8 h-8" style={{ color: '#dc2626' }} />
        <div className="text-left">
          <div className="font-bold text-white text-sm tracking-widest">HARDWARE OFFLINE</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: '#dc2626aa' }}>RASPBERRY PI CLUSTER UNREACHABLE</div>
        </div>
      </div>
      <div
        className="border rounded px-4 py-2 text-xs font-mono text-left"
        style={{ borderColor: '#7f1d1d40', background: '#1a0505', color: '#ef4444' }}
      >
        <div style={{ color: '#6b7280', fontSize: 9 }}>ERROR</div>
        {error}
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs font-mono text-left" style={{ color: '#4b5563' }}>
        <div><span style={{ color: '#6b7280', fontSize: 9 }}>TARGET</span><div className="mt-0.5" style={{ color: '#374151' }}>{VAULT_WS_URL}</div></div>
        <div><span style={{ color: '#6b7280', fontSize: 9 }}>RETRY IN</span><div className="mt-0.5" style={{ color: '#374151' }}>{retryIn}s</div></div>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 mx-auto px-4 py-2 border font-bold text-xs tracking-widest transition-all hover:bg-red-950"
        style={{ borderColor: '#dc262650', color: '#dc2626' }}
      >
        <RefreshCw className="w-3 h-3" />
        RETRY CONNECTION
      </button>
      <div className="text-xs font-mono" style={{ color: '#1f2937', fontSize: 9 }}>
        Ensure Pi cluster is powered on and accessible at 192.168.4.1:9090
      </div>
    </div>
  );
}

export default function VaultBridge() {
  const [status, setStatus] = useState<VaultStatus>({
    state: 'idle',
    error: null,
    metrics: null,
    lastAttempt: null,
    lastOnline: null,
  });
  const [retryIn, setRetryIn] = useState(0);
  const [destroyFn, setDestroyFn] = useState<(() => void) | null>(null);

  const startConnection = useCallback(() => {
    if (destroyFn) destroyFn();
    const cleanup = createVaultConnection(setStatus);
    setDestroyFn(() => cleanup);
    return cleanup;
  }, [destroyFn]);

  useEffect(() => {
    const cleanup = createVaultConnection(setStatus);
    setDestroyFn(() => cleanup);
    return cleanup;
  }, []);

  useEffect(() => {
    if (status.state !== 'offline') { setRetryIn(0); return; }
    let t = Math.floor(RECONNECT_INTERVAL_MS / 1000);
    setRetryIn(t);
    const tick = setInterval(() => {
      t -= 1;
      if (t <= 0) { clearInterval(tick); setRetryIn(0); }
      else setRetryIn(t);
    }, 1000);
    return () => clearInterval(tick);
  }, [status.state, status.lastAttempt]);

  const demoMetrics = status.metrics ?? (status.state === 'online' ? {
    nodeCount: 4,
    cpuLoad: [12.4, 8.1, 45.2, 3.7],
    memUsedMB: [512, 780, 1024, 256],
    totalMemMB: [2048, 2048, 4096, 2048],
    uptime: 86400,
    activeJobs: 3,
    clusterTemp: [42.1, 44.8, 51.3, 38.9],
  } : null);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6" style={{ color: '#3b82f6' }} />
            <div>
              <h2 className="font-bold text-lg tracking-widest text-white">VAULT BRIDGE</h2>
              <p className="text-xs" style={{ color: '#4b5563' }}>RASPBERRY PI CLUSTER — DAEMONI HARDWARE NODE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status.state === 'online' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded" style={{ borderColor: '#14532d50', background: '#052e16' }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>ONLINE</span>
              </div>
            )}
            {status.state === 'offline' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded" style={{ borderColor: '#7f1d1d50', background: '#0d0505' }}>
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#dc2626' }} />
                <span className="text-xs font-bold" style={{ color: '#dc2626' }}>OFFLINE</span>
              </div>
            )}
            {status.state === 'connecting' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded" style={{ borderColor: '#1d3f7f50', background: '#050d1a' }}>
                <Wifi className="w-3.5 h-3.5 animate-pulse" style={{ color: '#3b82f6' }} />
                <span className="text-xs font-bold" style={{ color: '#3b82f6' }}>CONNECTING</span>
              </div>
            )}
            <button
              onClick={startConnection}
              className="p-2 border hover:border-blue-800 transition-colors"
              style={{ borderColor: '#1f2937', color: '#4b5563' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          {[
            { label: 'ENDPOINT', value: VAULT_WS_URL, icon: <Wifi className="w-3 h-3" /> },
            { label: 'PROTOCOL', value: 'WebSocket / JSON', icon: <Activity className="w-3 h-3" /> },
            { label: 'LAST ATTEMPT', value: status.lastAttempt ? status.lastAttempt.toLocaleTimeString() : '—', icon: <RefreshCw className="w-3 h-3" /> },
          ].map(item => (
            <div key={item.label} className="border rounded p-3" style={{ borderColor: '#1f2937', background: '#0a0a12' }}>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: '#4b5563' }}>
                {item.icon}
                <span style={{ fontSize: 9 }}>{item.label}</span>
              </div>
              <div style={{ color: '#9ca3af', fontSize: 10 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {(status.state === 'offline' || status.state === 'idle') && status.error && (
          <OfflineBanner error={status.error} onRetry={startConnection} retryIn={retryIn} />
        )}

        {status.state === 'connecting' && (
          <div className="border rounded-xl p-8 text-center space-y-4" style={{ borderColor: '#1d3f7f40', background: '#020d1a' }}>
            <Wifi className="w-10 h-10 mx-auto animate-pulse" style={{ color: '#3b82f6' }} />
            <div>
              <div className="font-bold text-white text-sm tracking-widest">ESTABLISHING LINK</div>
              <div className="text-xs mt-1 font-mono" style={{ color: '#3b82f6aa' }}>Probing {VAULT_WS_URL}...</div>
            </div>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: '#3b82f6', animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {status.state === 'online' && demoMetrics && (
          <>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              {[
                { label: 'ACTIVE NODES', value: demoMetrics.nodeCount, icon: <Server className="w-3.5 h-3.5" />, color: '#22c55e' },
                { label: 'ACTIVE JOBS', value: demoMetrics.activeJobs, icon: <Activity className="w-3.5 h-3.5" />, color: '#3b82f6' },
                { label: 'UPTIME', value: `${Math.floor(demoMetrics.uptime / 3600)}h ${Math.floor((demoMetrics.uptime % 3600) / 60)}m`, icon: <Cpu className="w-3.5 h-3.5" />, color: '#f97316' },
              ].map(stat => (
                <div key={stat.label} className="border rounded-lg p-4 text-center" style={{ borderColor: stat.color + '30', background: stat.color + '08' }}>
                  <div className="flex items-center justify-center gap-1.5 mb-1" style={{ color: stat.color }}>
                    {stat.icon}
                    <span style={{ fontSize: 9 }}>{stat.label}</span>
                  </div>
                  <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4b5563' }}>NODE TELEMETRY</div>
              <div className="grid grid-cols-2 gap-3">
                {demoMetrics.cpuLoad.map((cpu, i) => (
                  <NodeCard
                    key={i}
                    index={i}
                    cpu={cpu}
                    mem={demoMetrics.memUsedMB[i]}
                    totalMem={demoMetrics.totalMemMB[i]}
                    temp={demoMetrics.clusterTemp[i]}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {status.state === 'idle' && !status.error && (
          <div className="border rounded-xl p-8 text-center space-y-3" style={{ borderColor: '#1f2937', background: '#0a0a12' }}>
            <Server className="w-8 h-8 mx-auto" style={{ color: '#374151' }} />
            <div className="font-bold tracking-widest" style={{ color: '#374151' }}>VAULT BRIDGE IDLE</div>
            <button
              onClick={startConnection}
              className="px-4 py-2 border text-xs font-bold transition-all hover:border-blue-800 hover:text-blue-400"
              style={{ borderColor: '#1f2937', color: '#4b5563' }}
            >
              CONNECT TO CLUSTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
