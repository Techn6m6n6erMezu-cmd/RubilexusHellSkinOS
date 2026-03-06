import { useState, useEffect } from 'react';
import { Package, Download, CheckCircle2, Cpu, Clock, HardDrive, Zap, Code, RefreshCw, FileJson, Lock } from 'lucide-react';

const KAAPA_MANIFEST_KEY = 'kaapa_toers_manifest_locked';

function generateApkManifest(build: Build): void {
  const manifest = {
    package: `com.haezarian.tolb.${build.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
    versionName: build.version,
    versionCode: Math.floor(Date.now() / 1000),
    compileSdkVersion: 34,
    minSdkVersion: 24,
    targetSdkVersion: 34,
    applicationLabel: build.title,
    applicationIcon: '@mipmap/ic_launcher',
    theme: '@style/HaezarianTheme.Dark',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
    features: ['android.hardware.camera', 'android.hardware.microphone'],
    activities: [
      { name: '.MainActivity', label: build.title, exported: true, launchMode: 'singleTop' },
    ],
    services: [
      { name: '.TOLBEngineService', exported: false, foreground: true },
      { name: '.RupipVoiceService', exported: false },
    ],
    metadata: {
      tolbCert: 'HAEZARIAN_SOVEREIGN_SIGNED',
      buildType: build.type,
      buildDate: build.savedAt,
      vaultId: build.id,
      rupipBind: 'ENABLED',
      iffyCore: 'BOUND',
    },
    signing: {
      keystore: 'haezarian_release.keystore',
      alias: 'tolb_haezarian_key',
      algorithm: 'SHA256withRSA',
      signed: true,
    },
  };
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${build.title.replace(/[^a-zA-Z0-9]/g, '_')}_AndroidManifest.json`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Build {
  id: string;
  title: string;
  version: string;
  savedAt: string;
  status: 'ready' | 'installing' | 'installed' | 'failed';
  size: string;
  type: 'component' | 'service' | 'config' | 'asset';
}

function getFileType(name: string): Build['type'] {
  if (name.endsWith('.json') || name.endsWith('config')) return 'config';
  if (name.includes('Service') || name.includes('service')) return 'service';
  if (name.includes('assets') || name.includes('Assets')) return 'asset';
  return 'component';
}

function typeAccent(type: Build['type']): string {
  if (type === 'component') return '#3b82f6';
  if (type === 'service') return '#22c55e';
  if (type === 'config') return '#eab308';
  return '#f97316';
}

function typeLabel(type: Build['type']): string {
  if (type === 'component') return 'COMPONENT';
  if (type === 'service') return 'SERVICE';
  if (type === 'config') return 'CONFIG';
  return 'ASSET';
}

const SEED_BUILDS: Build[] = [
  { id: 'seed-1', title: 'HaezarianWorldShell.tsx', version: 'v1.0.0-SEED', savedAt: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'installed', size: '42 KB', type: 'component' },
  { id: 'seed-2', title: 'SentienceCore.tsx', version: 'v1.0.0-SEED', savedAt: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'installed', size: '28 KB', type: 'component' },
  { id: 'seed-3', title: 'councilService.ts', version: 'v1.0.0-SEED', savedAt: new Date(Date.now() - 86400000).toISOString(), status: 'installed', size: '8 KB', type: 'service' },
];

function loadBuildsFromStorage(): Build[] {
  try {
    const stored = JSON.parse(localStorage.getItem('haezarian_vault') || '{}');
    return Object.entries(stored).map(([title, data]: [string, unknown]) => {
      const d = data as { code: string; savedAt: string; version: string };
      return {
        id: `vault-${title}-${d.savedAt}`,
        title,
        version: d.version || 'v?.?.?',
        savedAt: d.savedAt,
        status: 'installed' as const,
        size: `${Math.ceil((d.code?.length ?? 0) / 1024)} KB`,
        type: getFileType(title),
      };
    });
  } catch {
    return [];
  }
}

function BuildCard({ build, onInstall }: { build: Build; onInstall: (id: string) => void; }) {
  const accent = typeAccent(build.type);
  const label = typeLabel(build.type);
  const date = new Date(build.savedAt);

  return (
    <div
      className="shrink-0 rounded-xl border overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        width: 200,
        background: '#0a0a12',
        borderColor: build.status === 'installed' ? accent + '40' : '#1f2937',
        boxShadow: build.status === 'installed' ? `0 0 20px ${accent}15` : 'none',
      }}
    >
      <div
        className="px-3 py-2 border-b flex items-center justify-between"
        style={{ borderColor: accent + '20', background: accent + '08' }}
      >
        <div className="flex items-center gap-1.5">
          <Code className="w-3 h-3 shrink-0" style={{ color: accent }} />
          <span className="font-bold text-xs truncate max-w-[110px]" style={{ color: '#e5e7eb' }}>{build.title}</span>
        </div>
        <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: accent + '20', color: accent, fontSize: 8 }}>
          {label}
        </span>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono font-bold" style={{ color: accent, fontSize: 10 }}>{build.version}</div>
            <div style={{ color: '#4b5563', fontSize: 8 }}>
              {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="text-right">
            <div style={{ color: '#374151', fontSize: 9 }}>{build.size}</div>
          </div>
        </div>

        <div className="w-full rounded-full h-1" style={{ background: '#1f2937' }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: build.status === 'installed' ? '100%' : build.status === 'installing' ? '60%' : '0%',
              background: build.status === 'installed' ? accent : '#374151',
            }}
          />
        </div>

        <button
          onClick={() => onInstall(build.id)}
          disabled={build.status === 'installed' || build.status === 'installing'}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded border font-bold transition-all text-xs hover:opacity-80 disabled:opacity-50"
          style={{
            borderColor: build.status === 'installed' ? '#14532d' : accent + '60',
            color: build.status === 'installed' ? '#22c55e' : accent,
            background: build.status === 'installed' ? '#052e1610' : 'transparent',
            fontSize: 9,
          }}
        >
          {build.status === 'installed' && <><CheckCircle2 className="w-3 h-3" /> TOLB CERTIFIED</>}
          {build.status === 'installing' && <><RefreshCw className="w-3 h-3 animate-spin" /> INSTALLING...</>}
          {build.status === 'ready' && <><Download className="w-3 h-3" /> INSTALL BUILD</>}
          {build.status === 'failed' && <><Zap className="w-3 h-3" /> RETRY</>}
        </button>
        <button
          onClick={() => generateApkManifest(build)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded border font-bold transition-all hover:opacity-80"
          style={{
            borderColor: '#f9731640',
            color: '#f97316',
            background: '#0a030000',
            fontSize: 9,
          }}
        >
          <FileJson className="w-3 h-3" /> GENERATE APK MANIFEST
        </button>
      </div>
    </div>
  );
}

export default function KaapaToers() {
  const [builds, setBuilds] = useState<Build[]>(() => [...SEED_BUILDS, ...loadBuildsFromStorage()]);
  const [filter, setFilter] = useState<'all' | Build['type']>('all');
  const [pulse, setPulse] = useState(false);
  const [manifestLocked, setManifestLocked] = useState(() => !!localStorage.getItem(KAAPA_MANIFEST_KEY));

  useEffect(() => {
    const onBuild = (e: Event) => {
      const evt = e as CustomEvent<{ title: string; version: string; savedAt: string }>;
      const { title, version, savedAt } = evt.detail;
      const newBuild: Build = {
        id: `build-${Date.now()}`,
        title,
        version,
        savedAt,
        status: 'ready',
        size: '— KB',
        type: getFileType(title),
      };
      setBuilds(prev => [newBuild, ...prev]);
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
      setTimeout(() => {
        setBuilds(prev => prev.map(b => b.id === newBuild.id ? { ...b, status: 'installing' } : b));
        setTimeout(() => {
          setBuilds(prev => prev.map(b => b.id === newBuild.id ? { ...b, status: 'installed' } : b));
        }, 2200);
      }, 400);
    };
    document.addEventListener('kaapa-build-added', onBuild);
    return () => document.removeEventListener('kaapa-build-added', onBuild);
  }, []);

  const handleInstall = (id: string) => {
    setBuilds(prev => prev.map(b => b.id === id ? { ...b, status: 'installing' } : b));
    setTimeout(() => {
      setBuilds(prev => prev.map(b => b.id === id ? { ...b, status: 'installed' } : b));
    }, 2000);
  };

  const displayed = filter === 'all' ? builds : builds.filter(b => b.type === filter);
  const stats = {
    total: builds.length,
    installed: builds.filter(b => b.status === 'installed').length,
    components: builds.filter(b => b.type === 'component').length,
    services: builds.filter(b => b.type === 'service').length,
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: pulse ? '#3b82f640' : '#1f2937', boxShadow: pulse ? '0 0 40px #3b82f615' : 'none', transition: 'all 0.5s' }}
      >
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#1f2937', background: '#050510' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: '#0a1030', borderColor: '#3b82f640' }}>
              <Package className="w-5 h-5" style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest" style={{ color: '#e5e7eb' }}>KAAPA TOERS</h1>
              <p className="text-xs mt-0.5" style={{ color: '#3b82f6aa' }}>APK VAULT — TOLB SECURITY CERTIFIED</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span style={{ color: '#3b82f680', fontSize: 9 }}>LIVE SYNC ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-4 border-b" style={{ borderColor: '#1f2937' }}>
          {[
            { label: 'TOTAL BUILDS', value: stats.total, icon: <HardDrive className="w-4 h-4" />, color: '#3b82f6' },
            { label: 'INSTALLED', value: stats.installed, icon: <CheckCircle2 className="w-4 h-4" />, color: '#22c55e' },
            { label: 'COMPONENTS', value: stats.components, icon: <Cpu className="w-4 h-4" />, color: '#3b82f6' },
            { label: 'SERVICES', value: stats.services, icon: <Zap className="w-4 h-4" />, color: '#22c55e' },
          ].map(stat => (
            <div key={stat.label} className="px-6 py-4 border-r last:border-r-0" style={{ borderColor: '#1f2937', background: '#03030a' }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: stat.color + '80' }}>{stat.icon}</span>
                <span style={{ color: '#374151', fontSize: 9 }}>{stat.label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-b flex items-center gap-2" style={{ borderColor: '#0d1117', background: '#020208' }}>
          {(['all', 'component', 'service', 'config', 'asset'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded border text-xs font-bold transition-all"
              style={{
                borderColor: filter === f ? typeAccent(f as Build['type']) + '60' : '#1f2937',
                color: filter === f ? typeAccent(f as Build['type']) : '#4b5563',
                background: filter === f ? typeAccent(f as Build['type']) + '15' : 'transparent',
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <span className="ml-auto" style={{ color: '#374151', fontSize: 9 }}>
            {displayed.length} BUILD{displayed.length !== 1 ? 'S' : ''}
          </span>
        </div>

        <div className="p-6">
          {displayed.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-10" />
              <p style={{ color: '#1f2937', fontSize: 12 }}>No builds in vault</p>
              <p style={{ color: '#111827', fontSize: 10 }} className="mt-1">Save a file in the TOLB Engine to create a certified build</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarColor: '#1f2937 transparent' }}>
              {displayed.map(build => (
                <BuildCard key={build.id} build={build} onInstall={handleInstall} />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t flex items-center gap-3 flex-wrap" style={{ borderColor: '#0d1117', background: '#020208' }}>
          <Clock className="w-3 h-3 shrink-0" style={{ color: '#374151' }} />
          <span style={{ color: '#1f2937', fontSize: 9 }}>
            TOLB CERT VAULT: ZERO-PUBLISH MODE — No credits burned. All builds TOLB-signed. 1581 modules compiled.
          </span>
          <button
            onClick={() => {
              const manifest = {
                locked: true,
                lockedAt: new Date().toISOString(),
                prince: 'horse4206@gmail.com',
                modules: 1581,
                builds: builds.map(b => ({ id: b.id, title: b.title, version: b.version, type: b.type, status: b.status })),
                charter: 'HAEZARIAN_SOVEREIGN_PERMANENT',
              };
              localStorage.setItem(KAAPA_MANIFEST_KEY, JSON.stringify(manifest));
              setManifestLocked(true);
              const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'KAAPA_TOERS_MANIFEST_LOCKED.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            disabled={manifestLocked}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded border font-bold transition-all hover:opacity-80 disabled:opacity-60 shrink-0"
            style={{
              borderColor: manifestLocked ? '#22c55e40' : '#3b82f640',
              color: manifestLocked ? '#22c55e' : '#3b82f6',
              background: manifestLocked ? '#052e1615' : '#0a153015',
              fontSize: 9,
            }}
          >
            {manifestLocked ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {manifestLocked ? '1581 MODULES LOCKED' : 'LOCK 1581 MODULES'}
          </button>
        </div>
      </div>
    </div>
  );
}
