import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Film, Music2, Star, Wand2, ChevronLeft, ChevronRight, RotateCcw, Cpu, Zap, HardDrive, CheckCircle2, Loader2, Clock, Package, Trash2 } from 'lucide-react';
import { getMowgAssets, incrementRemakeCount, type MowgAsset } from '../services/mowgService';

type AssetType = 'game' | 'movie' | 'music';

const UE5_STAGES = [
  'Asset Import',
  'Shader Compile',
  'LOD Generation',
  'Physics Bake',
  'Package Build',
  'Deploy to Vault',
];

interface ManufactureJob {
  id: string;
  assetTitle: string;
  assetType: AssetType;
  stageIndex: number;
  stageProgress: number;
  queued: Date;
  status: 'queued' | 'active' | 'done' | 'failed';
}

function TrashBoundPanel({ assets }: { assets: MowgAsset[] }) {
  const [jobs, setJobs] = useState<ManufactureJob[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const queueAsset = () => {
    const asset = assets.find(a => a.id === selectedAsset);
    if (!asset) return;
    const job: ManufactureJob = {
      id: `${asset.id}-${Date.now()}`,
      assetTitle: asset.title,
      assetType: asset.asset_type,
      stageIndex: 0,
      stageProgress: 0,
      queued: new Date(),
      status: 'queued',
    };
    setJobs(prev => [job, ...prev].slice(0, 10));
    setSelectedAsset('');
  };

  useEffect(() => {
    tickerRef.current = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status === 'done' || job.status === 'failed') return job;
        if (job.status === 'queued') return { ...job, status: 'active' };
        const newProgress = job.stageProgress + (Math.random() * 8 + 2);
        if (newProgress >= 100) {
          const nextStage = job.stageIndex + 1;
          if (nextStage >= UE5_STAGES.length) return { ...job, status: 'done', stageProgress: 100 };
          return { ...job, stageIndex: nextStage, stageProgress: 0 };
        }
        return { ...job, stageProgress: newProgress };
      }));
    }, 200);
    return () => { if (tickerRef.current) clearInterval(tickerRef.current); };
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'active');
  const queuedJobs = jobs.filter(j => j.status === 'queued');
  const doneJobs = jobs.filter(j => j.status === 'done');

  const getJobAccent = (type: AssetType) => TYPE_CONFIG[type].accent;

  return (
    <div className="mt-8 border rounded-xl overflow-hidden" style={{ borderColor: '#f9731630', background: '#0a0500' }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#f9731620', background: '#f9731608' }}>
        <Trash2 className="w-5 h-5" style={{ color: '#f97316' }} />
        <div>
          <h3 className="font-bold text-white text-sm tracking-widest">TRASH BOUND — UE5 MANUFACTURING</h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: '#f97316aa' }}>
            UNREAL ENGINE 5 ASSET PIPELINE — {activeJobs.length} ACTIVE · {queuedJobs.length} QUEUED · {doneJobs.length} COMPLETE
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <select
            value={selectedAsset}
            onChange={e => setSelectedAsset(e.target.value)}
            className="flex-1 bg-black border text-xs font-mono px-3 py-2 outline-none focus:border-orange-700 transition-colors"
            style={{ borderColor: '#1f2937', color: selectedAsset ? '#d1d5db' : '#4b5563' }}
          >
            <option value="">— Select asset to manufacture —</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.title} [{a.asset_type.toUpperCase()}]</option>
            ))}
          </select>
          <button
            onClick={queueAsset}
            disabled={!selectedAsset}
            className="flex items-center gap-2 px-4 py-2 border font-bold text-xs tracking-widest transition-all disabled:opacity-30"
            style={{ borderColor: '#f97316', color: '#f97316', background: selectedAsset ? '#f9731615' : 'transparent' }}
          >
            <Package className="w-3.5 h-3.5" />
            QUEUE UE5 BUILD
          </button>
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-6" style={{ color: '#374151' }}>
            <HardDrive className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <div className="text-xs font-mono">No manufacturing jobs — queue an asset above</div>
          </div>
        )}

        <div className="space-y-3">
          {jobs.map(job => {
            const accent = getJobAccent(job.assetType);
            const overallPct = job.status === 'done'
              ? 100
              : ((job.stageIndex / UE5_STAGES.length) * 100) + (job.stageProgress / UE5_STAGES.length);

            return (
              <div
                key={job.id}
                className="border rounded-lg p-3 space-y-2"
                style={{
                  borderColor: job.status === 'done' ? '#14532d50' : job.status === 'active' ? accent + '40' : '#1f2937',
                  background: job.status === 'done' ? '#052e1608' : '#0a0a12',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {job.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />}
                    {job.status === 'active' && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: accent }} />}
                    {job.status === 'queued' && <Clock className="w-3.5 h-3.5" style={{ color: '#4b5563' }} />}
                    <span className="text-xs font-bold text-white">{job.assetTitle}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: accent + '20', color: accent, fontSize: 9 }}>
                      {job.assetType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: job.status === 'done' ? '#22c55e' : accent }}>
                    {job.status === 'done' ? 'COMPLETE' : job.status === 'queued' ? 'QUEUED' : `${Math.floor(overallPct)}%`}
                  </span>
                </div>

                <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-200"
                    style={{
                      width: `${overallPct}%`,
                      background: job.status === 'done'
                        ? '#22c55e'
                        : `linear-gradient(90deg, ${accent}cc, ${accent})`,
                    }}
                  />
                </div>

                {job.status === 'active' && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {UE5_STAGES.map((stage, i) => (
                        <div
                          key={stage}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: i < job.stageIndex
                              ? accent
                              : i === job.stageIndex
                              ? accent + '80'
                              : '#1f2937',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono shrink-0" style={{ color: accent + 'aa', fontSize: 9 }}>
                      {UE5_STAGES[job.stageIndex]}
                    </span>
                  </div>
                )}

                {job.status === 'done' && (
                  <div className="flex gap-1">
                    {UE5_STAGES.map(stage => (
                      <div key={stage} className="flex-1 h-1 rounded-full" style={{ background: '#22c55e' }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const TYPE_CONFIG = {
  game: { label: 'GAMES', icon: <Gamepad2 className="w-4 h-4" />, accent: '#3b82f6', bg: 'from-blue-950' },
  movie: { label: 'MOVIES', icon: <Film className="w-4 h-4" />, accent: '#f97316', bg: 'from-orange-950' },
  music: { label: 'MUSIC', icon: <Music2 className="w-4 h-4" />, accent: '#a855f7', bg: 'from-purple-950' },
};

function CreativeStudio({ asset, onClose, onRemake }: {
  asset: MowgAsset;
  onClose: () => void;
  onRemake: () => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [phase, setPhase] = useState<'idle' | 'rendering' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState('');

  const cfg = TYPE_CONFIG[asset.asset_type];

  const startRender = async () => {
    if (!prompt.trim()) return;
    setPhase('rendering');
    setProgress(0);
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 60));
      setProgress(i);
    }
    setOutput(`Haezarian Creative Engine complete. "${asset.title}" reimagined as: ${prompt}. Veo/Sora synthesis applied. ${asset.asset_type === 'movie' ? '5-minute loop generated.' : asset.asset_type === 'music' ? 'Spittler-ready audio export prepared.' : 'Cutscene engine compiled.'}`);
    setPhase('done');
    onRemake();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6">
      <div className="w-full max-w-lg border rounded-xl overflow-hidden shadow-2xl" style={{ borderColor: cfg.accent + '60', background: '#0a0a0a' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: cfg.accent + '30', background: cfg.accent + '15' }}>
          <div className="flex items-center gap-3">
            <Wand2 className="w-5 h-5" style={{ color: cfg.accent }} />
            <div>
              <h3 className="font-bold text-white text-sm tracking-widest">HAEZARIAN CREATIVE STUDIO</h3>
              <p className="text-gray-500 text-xs font-mono">SORA/VEO ENGINE — {asset.title.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-lg leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-4">
            <div className="w-16 h-20 rounded flex items-center justify-center shrink-0 text-center" style={{ background: asset.cover_color, border: `1px solid ${cfg.accent}30` }}>
              <div className="text-xs text-white/60 font-bold px-1">{asset.title.slice(0, 8)}</div>
            </div>
            <div>
              <h4 className="text-white font-bold">{asset.title}</h4>
              <div className="text-xs mt-0.5" style={{ color: cfg.accent }}>{asset.genre} • {asset.release_year}</div>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{asset.description}</p>
              <div className="text-gray-700 text-xs mt-1">Remakes: {asset.remake_count}</div>
            </div>
          </div>

          {phase === 'idle' && (
            <div className="space-y-3">
              <label className="text-gray-500 text-xs font-mono block">SORA/VEO DIRECTIVE:</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={`Describe your remake vision for "${asset.title}"...\nExample: Dark anime adaptation. Main character redesigned as a void-walker.`}
                className="w-full bg-black border border-gray-800 text-gray-300 text-xs p-3 resize-none outline-none focus:border-gray-600 transition-colors font-mono"
                rows={4}
                style={{ borderColor: prompt ? cfg.accent + '40' : undefined }}
              />
              <button
                onClick={startRender}
                disabled={!prompt.trim()}
                className="w-full py-2.5 font-bold text-sm tracking-widest transition-all disabled:opacity-30"
                style={{
                  background: prompt.trim() ? cfg.accent + '20' : undefined,
                  border: `1px solid ${cfg.accent}50`,
                  color: cfg.accent,
                }}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                INITIATE SORA/VEO RENDER
              </button>
            </div>
          )}

          {phase === 'rendering' && (
            <div className="space-y-3 text-center">
              <Cpu className="w-10 h-10 mx-auto animate-spin" style={{ color: cfg.accent }} />
              <p className="text-xs font-mono" style={{ color: cfg.accent }}>HAEZARIAN ENGINE RENDERING...</p>
              <div className="w-full bg-gray-900 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%`, background: cfg.accent }}
                />
              </div>
              <p className="text-gray-600 text-xs font-mono">{progress}% — {
                progress < 30 ? 'Parsing source material...' :
                progress < 60 ? 'Applying Sora diffusion...' :
                progress < 85 ? 'Veo stitching 5-min loop...' :
                'Finalizing Haezarian output...'
              }</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="space-y-3">
              <div className="border rounded p-3 text-xs font-mono leading-relaxed" style={{ borderColor: cfg.accent + '40', color: cfg.accent, background: cfg.accent + '08' }}>
                {output}
              </div>
              <button
                onClick={() => setPhase('idle')}
                className="w-full py-2 text-xs border border-gray-800 text-gray-500 hover:border-gray-600 transition-colors"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                NEW RENDER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AssetCard({
  asset,
  isActive,
  depth,
  onClick,
}: {
  asset: MowgAsset;
  isActive: boolean;
  depth: number;
  onClick: () => void;
}) {
  const cfg = TYPE_CONFIG[asset.asset_type];
  const scale = isActive ? 1 : Math.max(0.6, 1 - depth * 0.12);
  const translateZ = isActive ? 80 : -depth * 60;
  const opacity = Math.max(0.3, 1 - depth * 0.2);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-500"
      style={{
        transform: `translateX(${depth * (isActive ? 0 : 160) - (isActive ? 0 : 0)}px) translateZ(${translateZ}px) scale(${scale})`,
        opacity,
        zIndex: 10 - depth,
        left: '50%',
        top: '50%',
        marginLeft: depth === 0 ? -80 : depth > 0 ? depth * 100 - 80 : depth * 100 - 80,
        marginTop: -110,
      }}
      onClick={onClick}
    >
      <div
        className="w-40 h-52 rounded-lg overflow-hidden border shadow-xl relative"
        style={{
          background: `linear-gradient(160deg, ${asset.cover_color} 0%, #000 100%)`,
          borderColor: isActive ? cfg.accent + '80' : cfg.accent + '20',
          boxShadow: isActive ? `0 0 30px ${cfg.accent}40` : 'none',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <div className="text-2xl mb-2">
            {asset.asset_type === 'game' ? '🎮' : asset.asset_type === 'movie' ? '🎬' : '🎵'}
          </div>
          <div className="text-white font-bold text-xs leading-tight">{asset.title}</div>
          <div className="text-xs mt-1" style={{ color: cfg.accent + 'aa' }}>{asset.genre}</div>
          <div className="text-gray-600 text-xs">{asset.release_year}</div>
          {asset.is_featured && (
            <div className="mt-1.5">
              <Star className="w-3 h-3 inline" style={{ color: cfg.accent }} />
            </div>
          )}
          {asset.remake_count > 0 && (
            <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: cfg.accent + '30', color: cfg.accent }}>
              {asset.remake_count}×
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MowgVideoames() {
  const [activeType, setActiveType] = useState<AssetType>('game');
  const [assets, setAssets] = useState<MowgAsset[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<MowgAsset | null>(null);
  const [remakeTarget, setRemakeTarget] = useState<MowgAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, [activeType]);

  const loadAssets = async () => {
    setLoading(true);
    setActiveIndex(0);
    const data = await getMowgAssets(activeType);
    setAssets(data);
    setLoading(false);
  };

  const handleRemake = async () => {
    if (!remakeTarget) return;
    await incrementRemakeCount(remakeTarget.id, remakeTarget.remake_count);
    setAssets(prev => prev.map(a => a.id === remakeTarget.id ? { ...a, remake_count: a.remake_count + 1 } : a));
    setRemakeTarget(null);
  };

  const cfg = TYPE_CONFIG[activeType];
  const visibleRange = 3;

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      <div className="border-b border-gray-800 bg-gray-950 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white">MOWGVIDEA<span style={{ color: cfg.accent }}>MES</span></h1>
            <p className="text-gray-600 text-xs mt-0.5">HAEZARIAN OMNI-STORE — EVERY GAME, MOVIE & SONG EVER MADE</p>
          </div>
          <div className="flex gap-2">
            {(Object.entries(TYPE_CONFIG) as [AssetType, typeof TYPE_CONFIG.game][]).map(([type, c]) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-1.5 px-3 py-2 border text-xs font-bold transition-all ${
                  activeType === type ? 'text-black' : 'border-gray-800 text-gray-600 hover:border-gray-600'
                }`}
                style={activeType === type ? { background: c.accent, borderColor: c.accent } : {}}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-700 text-xs font-mono animate-pulse">LOADING VAULT...</div>
          </div>
        ) : (
          <>
            <div
              className="relative overflow-hidden"
              style={{
                height: 280,
                perspective: '800px',
                perspectiveOrigin: '50% 50%',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, ${cfg.accent}08 0%, transparent 70%)`,
                }}
              />
              {[0, -3, -2, -1, 1, 2, 3].map(offset => {
                const idx = activeIndex + offset;
                if (idx < 0 || idx >= assets.length) return null;
                return (
                  <AssetCard
                    key={assets[idx].id}
                    asset={assets[idx]}
                    isActive={offset === 0}
                    depth={Math.abs(offset)}
                    onClick={() => {
                      if (offset === 0) setSelected(assets[idx]);
                      else setActiveIndex(idx);
                    }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
                disabled={activeIndex === 0}
                className="p-2 border border-gray-800 text-gray-500 hover:border-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-700 text-xs">{activeIndex + 1} / {assets.length}</span>
              <button
                onClick={() => setActiveIndex(i => Math.min(assets.length - 1, i + 1))}
                disabled={activeIndex === assets.length - 1}
                className="p-2 border border-gray-800 text-gray-500 hover:border-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {selected && (
              <div className="mt-8 border rounded-xl p-6" style={{ borderColor: cfg.accent + '40', background: cfg.accent + '08' }}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-5">
                    <div
                      className="w-20 h-28 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: selected.cover_color, border: `1px solid ${cfg.accent}30` }}
                    >
                      <span className="text-3xl">
                        {selected.asset_type === 'game' ? '🎮' : selected.asset_type === 'movie' ? '🎬' : '🎵'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-xl">{selected.title}</h3>
                        {selected.is_featured && <Star className="w-4 h-4" style={{ color: cfg.accent }} />}
                      </div>
                      <div className="text-xs mb-2" style={{ color: cfg.accent }}>{selected.genre} • {selected.release_year}</div>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{selected.description}</p>
                      {selected.remake_count > 0 && (
                        <div className="text-xs mt-2" style={{ color: cfg.accent }}>
                          Remade {selected.remake_count}× in the Haezarian Creative Studio
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setRemakeTarget(selected)}
                      className="flex items-center gap-2 px-4 py-2 border font-bold text-sm transition-all"
                      style={{ borderColor: cfg.accent, color: cfg.accent, background: cfg.accent + '15' }}
                    >
                      <Wand2 className="w-4 h-4" />
                      REMAKE
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="px-4 py-2 border border-gray-800 text-gray-600 text-xs hover:border-gray-600 transition-colors"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {assets.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => { setActiveIndex(i); setSelected(a); }}
                  className="text-left text-xs p-2 rounded border transition-all hover:border-gray-600"
                  style={{
                    background: activeIndex === i ? cfg.accent + '15' : '#111',
                    borderColor: activeIndex === i ? cfg.accent + '60' : '#1f2937',
                    color: activeIndex === i ? 'white' : '#6b7280',
                  }}
                >
                  <div className="font-bold truncate" style={{ fontSize: 10 }}>{a.title}</div>
                  <div style={{ fontSize: 9, color: cfg.accent + 'aa' }}>{a.release_year}</div>
                </button>
              ))}
            </div>

            <TrashBoundPanel assets={assets} />
          </>
        )}
      </div>

      {remakeTarget && (
        <CreativeStudio
          asset={remakeTarget}
          onClose={() => setRemakeTarget(null)}
          onRemake={handleRemake}
        />
      )}
    </div>
  );
}
