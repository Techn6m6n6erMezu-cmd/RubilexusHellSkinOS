import { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu, HardDrive, Wifi, Zap, Play, Pause, Plus, CheckCircle2, Clock, Activity, Box, MemoryStick } from 'lucide-react';

interface TerabyteJob {
  id: string;
  name: string;
  size: string;
  status: 'queued' | 'processing' | 'done';
  progress: number;
  eta: string;
}

interface RenderFrame {
  id: number;
  ms: number;
  tris: number;
  draw: number;
}

const FOOD_TYPES = [
  'SatansHouse_Level01.uasset',
  'BigHorse_StudioSession_44.wav',
  'KadoKard_DeckExpansion_v3.json',
  'RUBILEXUS_NPC_Batch_12.bin',
  'TrashBound_Tileset_2K.png',
  'HaezarianCore_ScriptDump.txt',
  'NPC_AutonomyMatrix_Update.dat',
  'Council_VaultSnapshot.enc',
  'TOLB_ManifestSeal_v9.json',
  'DistrictMap_Alpha.umap',
];

function MetricBar({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span style={{ color: '#555', fontSize: 8, letterSpacing: '0.1em' }}>{label}</span>
        <span style={{ color, fontSize: 9, fontFamily: 'monospace' }}>{sub}</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 4, background: '#111' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 6px ${color}60`,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

function RenderPipeline({ frames }: { frames: RenderFrame[] }) {
  const recent = frames.slice(-12);
  const avgMs = recent.length ? Math.round(recent.reduce((s, f) => s + f.ms, 0) / recent.length) : 0;
  const fps = avgMs > 0 ? Math.round(1000 / avgMs) : 0;

  return (
    <div
      className="rounded border p-3"
      style={{ background: '#020a02', border: '1px solid #00ff4115' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-3 h-3" style={{ color: '#00ff41' }} />
          <span style={{ color: '#00ff4180', fontSize: 9, letterSpacing: '0.15em' }}>UE5 RENDER PIPELINE</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: '#00ff4160', fontSize: 8 }}>
            {fps} <span style={{ color: '#00ff4130' }}>FPS</span>
          </span>
          <span style={{ color: '#00ff4140', fontSize: 8 }}>
            {avgMs}ms
          </span>
        </div>
      </div>

      <div className="flex items-end gap-0.5" style={{ height: 32 }}>
        {recent.map((f, i) => {
          const h = Math.max(2, Math.min(32, (1000 / f.ms) / 2));
          const color = f.ms < 20 ? '#00ff41' : f.ms < 35 ? '#ffcc00' : '#ff4100';
          return (
            <div
              key={f.id}
              className="flex-1 rounded-sm transition-all"
              style={{
                height: h,
                background: color,
                opacity: 0.4 + (i / recent.length) * 0.6,
              }}
            />
          );
        })}
        {recent.length === 0 && (
          <div className="flex-1 flex items-center justify-center" style={{ color: '#1a3a1a', fontSize: 8 }}>
            AWAITING RENDER JOB
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        {[
          { label: 'DRAW CALLS', value: recent[recent.length - 1]?.draw || 0 },
          { label: 'TRIANGLES', value: recent[recent.length - 1]?.tris.toLocaleString() || '0' },
          { label: 'PIPELINE', value: fps > 55 ? 'OPTIMAL' : fps > 30 ? 'GOOD' : 'DEGRADED' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div style={{ color: '#00ff4140', fontSize: 7 }}>{s.label}</div>
            <div style={{ color: '#00ff41', fontSize: 8, fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TOLBVirtualPi() {
  const [initialized, setInitialized] = useState(false);
  const [initStep, setInitStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [cpu, setCpu] = useState(12);
  const [mem, setMem] = useState(0.8);
  const [netIn, setNetIn] = useState(0);
  const [netOut, setNetOut] = useState(0);
  const [temp, setTemp] = useState(38);
  const [queue, setQueue] = useState<TerabyteJob[]>([]);
  const [frames, setFrames] = useState<RenderFrame[]>([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [uptime, setUptime] = useState(0);
  const processingRef = useRef(false);
  const frameCountRef = useRef(0);

  const INIT_STEPS = [
    'Bootstrapping WASM runtime...',
    'Allocating 4 GB virtual RAM...',
    'Loading Pi kernel modules...',
    'Initializing GPU pipeline...',
    'Mounting Terabyte Food partition...',
    'Linking UE5 render bridge...',
    'HAEZARIAN VIRTUAL PI ONLINE.',
  ];

  useEffect(() => {
    let step = 0;
    const id = setInterval(() => {
      step++;
      setInitStep(step);
      if (step >= INIT_STEPS.length - 1) {
        clearInterval(id);
        setTimeout(() => {
          setInitialized(true);
          setRunning(true);
        }, 600);
      }
    }, 380);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setUptime(s => s + 1);
      setCpu(v => Math.max(5, Math.min(95, v + (Math.random() - 0.48) * 8)));
      setMem(v => Math.max(0.5, Math.min(3.8, v + (Math.random() - 0.5) * 0.15)));
      setNetIn(Math.random() * 12);
      setNetOut(Math.random() * 4);
      setTemp(v => Math.max(35, Math.min(72, v + (Math.random() - 0.5) * 1.2)));

      frameCountRef.current++;
      setFrames(prev => [
        ...prev.slice(-30),
        {
          id: frameCountRef.current,
          ms: 8 + Math.random() * 28,
          tris: Math.round(180000 + Math.random() * 120000),
          draw: Math.round(300 + Math.random() * 400),
        },
      ]);
    }, 900);
    return () => clearInterval(id);
  }, [running]);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (true) {
      const queued = queue.find(j => j.status === 'queued');
      if (!queued) break;

      setQueue(prev => prev.map(j => j.id === queued.id ? { ...j, status: 'processing', progress: 0 } : j));
      setCpu(v => Math.min(95, v + 25));
      setMem(v => Math.min(3.8, v + 0.4));

      for (let p = 0; p <= 100; p += Math.round(3 + Math.random() * 7)) {
        await new Promise(r => setTimeout(r, 120));
        setQueue(prev => prev.map(j => j.id === queued.id ? { ...j, progress: Math.min(100, p) } : j));
      }

      setQueue(prev => prev.map(j => j.id === queued.id ? { ...j, status: 'done', progress: 100 } : j));
      setTotalProcessed(n => n + 1);
      setCpu(v => Math.max(12, v - 20));
      setMem(v => Math.max(0.8, v - 0.3));
      await new Promise(r => setTimeout(r, 400));
    }

    processingRef.current = false;
  }, [queue]);

  useEffect(() => {
    if (running && queue.some(j => j.status === 'queued')) {
      processQueue();
    }
  }, [queue, running, processQueue]);

  const feedTerabyte = useCallback(() => {
    const name = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
    const sizeGB = (Math.random() * 2 + 0.1).toFixed(2);
    const job: TerabyteJob = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      size: `${sizeGB} TB`,
      status: 'queued',
      progress: 0,
      eta: `${Math.round(Math.random() * 8 + 1)}s`,
    };
    setQueue(prev => [...prev.slice(-9), job]);
  }, []);

  const fmtUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  if (!initialized) {
    return (
      <div
        className="font-mono flex flex-col items-center justify-center p-8 rounded-lg min-h-64"
        style={{ background: '#010a01', border: '1px solid #00ff4120' }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 animate-pulse" style={{ background: '#001a00', border: '2px solid #00ff4140' }}>
          <Cpu className="w-6 h-6" style={{ color: '#00ff41' }} />
        </div>
        <div style={{ color: '#00ff41', fontSize: 10, letterSpacing: '0.2em', marginBottom: 12 }}>
          HAEZARIAN VIRTUAL PI — BOOT SEQUENCE
        </div>
        <div className="space-y-1.5 w-full max-w-xs">
          {INIT_STEPS.slice(0, initStep + 1).map((step, i) => (
            <div key={i} className="flex items-center gap-2" style={{ opacity: i === initStep ? 1 : 0.4 }}>
              {i === initStep ? (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00ff41', flexShrink: 0 }} />
              ) : (
                <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: '#00ff4160' }} />
              )}
              <span style={{ color: i === initStep ? '#00ff41' : '#00ff4160', fontSize: 9 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono space-y-4" style={{ color: '#00ff41' }}>
      <style>{`@keyframes vpi-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div
        className="flex items-center justify-between p-3 rounded"
        style={{ background: '#010a01', border: '1px solid #00ff4125' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#001a00', border: '1px solid #00ff4140' }}>
            <Cpu className="w-4 h-4" style={{ color: '#00ff41' }} />
          </div>
          <div>
            <div style={{ color: '#00ff41', fontSize: 10, letterSpacing: '0.15em' }}>VIRTUAL PI NODE</div>
            <div style={{ color: '#00ff4140', fontSize: 7 }}>WASM RUNTIME • 4 GB RAM • HAEZARIAN ARMv8</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#00ff4140', fontSize: 7 }}>UPTIME</div>
            <div style={{ color: '#00ff41', fontSize: 9, fontFamily: 'monospace' }}>{fmtUptime(uptime)}</div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1" style={{ border: '1px solid #00ff4130' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: running ? '#00ff41' : '#ff4100', animation: running ? 'vpi-blink 2s step-end infinite' : 'none' }} />
            <span style={{ color: running ? '#00ff41' : '#ff4100', fontSize: 7 }}>{running ? 'RUNNING' : 'HALTED'}</span>
          </div>
          <button
            onClick={() => setRunning(v => !v)}
            className="p-1.5 transition-opacity hover:opacity-80"
            style={{ border: '1px solid #00ff4130', color: running ? '#ff4100' : '#00ff41' }}
          >
            {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded space-y-3" style={{ background: '#010a01', border: '1px solid #00ff4115' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Activity className="w-3 h-3" style={{ color: '#00ff41' }} />
            <span style={{ color: '#00ff4180', fontSize: 8, letterSpacing: '0.15em' }}>SYSTEM METRICS</span>
          </div>
          <MetricBar
            value={cpu}
            max={100}
            color={cpu > 80 ? '#ff4100' : cpu > 60 ? '#ffcc00' : '#00ff41'}
            label="CPU"
            sub={`${Math.round(cpu)}%`}
          />
          <MetricBar
            value={mem}
            max={4}
            color="#00aaff"
            label="MEMORY"
            sub={`${mem.toFixed(1)} / 4.0 GB`}
          />
          <MetricBar
            value={temp}
            max={85}
            color={temp > 70 ? '#ff4100' : temp > 55 ? '#ffcc00' : '#00ff41'}
            label="TEMP"
            sub={`${Math.round(temp)}°C`}
          />
          <div className="pt-1 space-y-1">
            <div className="flex justify-between">
              <span style={{ color: '#333', fontSize: 7 }}>NET IN</span>
              <span style={{ color: '#00aaff80', fontSize: 8 }}>{netIn.toFixed(1)} MB/s</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#333', fontSize: 7 }}>NET OUT</span>
              <span style={{ color: '#00ff4160', fontSize: 8 }}>{netOut.toFixed(1)} MB/s</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded" style={{ background: '#010a01', border: '1px solid #00ff4115' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3 h-3" style={{ color: '#00ff41' }} />
              <span style={{ color: '#00ff4180', fontSize: 8, letterSpacing: '0.1em' }}>TERABYTE FOOD</span>
            </div>
            <span style={{ color: '#00ff4140', fontSize: 7 }}>{totalProcessed} done</span>
          </div>

          <div className="space-y-1 mb-3 max-h-40 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {queue.length === 0 && (
              <div style={{ color: '#1a3a1a', fontSize: 8, textAlign: 'center', padding: '12px 0' }}>
                QUEUE EMPTY
              </div>
            )}
            {queue.map(job => (
              <div
                key={job.id}
                className="rounded px-2 py-1.5"
                style={{
                  background: job.status === 'processing' ? '#001a0030' : '#050505',
                  border: `1px solid ${job.status === 'processing' ? '#00ff4130' : job.status === 'done' ? '#00ff4110' : '#00ff4108'}`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  {job.status === 'done'
                    ? <CheckCircle2 className="w-2.5 h-2.5 shrink-0" style={{ color: '#00ff4160' }} />
                    : job.status === 'processing'
                    ? <div className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0" style={{ background: '#00ff41' }} />
                    : <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: '#00ff4130' }} />
                  }
                  <span
                    className="truncate"
                    style={{
                      color: job.status === 'done' ? '#00ff4140' : job.status === 'processing' ? '#00ff41' : '#00ff4160',
                      fontSize: 8,
                    }}
                  >
                    {job.name}
                  </span>
                  <span style={{ color: '#00ff4130', fontSize: 7, whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                    {job.size}
                  </span>
                </div>
                {job.status === 'processing' && (
                  <div className="rounded-full overflow-hidden" style={{ height: 2, background: '#001a00', marginLeft: 16 }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${job.progress}%`,
                        background: 'linear-gradient(90deg, #00ff4160, #00ff41)',
                        transition: 'width 0.1s linear',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={feedTerabyte}
            disabled={!running}
            className="w-full flex items-center justify-center gap-1.5 py-2 transition-all hover:opacity-80 disabled:opacity-30"
            style={{ border: '1px solid #00ff4140', color: '#00ff41', background: '#001a00', fontSize: 9 }}
          >
            <Plus className="w-3 h-3" />
            FEED TERABYTE
          </button>
        </div>
      </div>

      <RenderPipeline frames={frames} />

      <div
        className="grid grid-cols-4 gap-2"
      >
        {[
          { label: 'WASM', value: 'STABLE', color: '#00ff41' },
          { label: 'GPU', value: `${Math.round(cpu * 0.6)}%`, color: '#00aaff' },
          { label: 'PROCESSED', value: totalProcessed, color: '#00ff41' },
          { label: 'QUEUE', value: queue.filter(j => j.status === 'queued').length, color: queue.filter(j => j.status === 'queued').length > 0 ? '#ffcc00' : '#00ff4140' },
        ].map(s => (
          <div
            key={s.label}
            className="text-center p-2 rounded"
            style={{ background: '#010a01', border: '1px solid #00ff4110' }}
          >
            <div style={{ color: s.color, fontSize: 11, fontWeight: 'bold' }}>{s.value}</div>
            <div style={{ color: '#00ff4130', fontSize: 7 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
