import { useState, useEffect } from 'react';
import { Image, Link, RotateCcw, Check, Settings2, AlignJustify, Grid2x2 as Grid, Play, Globe } from 'lucide-react';
import SigilMark from './SigilMark';
import { HorseSigilSVG } from './SigilMark';
import { useSigil } from '../contexts/SigilContext';
import { getFeedMode, setFeedMode, getBubbleConfig, setBubbleConfig, type FeedMode } from '../services/solessService';

function SigilPreview({ url, isDefault }: { url: string; isDefault: boolean }) {
  return (
    <div className="flex items-center gap-6 p-4 bg-black border border-gray-800 rounded-lg">
      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">GATEKEEPER</p>
        <div className="w-14 h-14 rounded-full bg-gray-900 border border-red-900 flex items-center justify-center">
          {isDefault || !url ? <HorseSigilSVG size={36} color="#dc2626" /> : <img src={url} alt="" className="w-9 h-9 object-contain" />}
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">DASHBOARD</p>
        <div className="w-14 h-14 bg-gray-900 border border-gray-800 flex items-center justify-center">
          {isDefault || !url ? <HorseSigilSVG size={32} color="#dc2626" /> : <img src={url} alt="" className="w-8 h-8 object-contain" />}
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">PiP</p>
        <div className="w-14 h-14 rounded bg-gray-900 border border-cyan-900 flex items-center justify-center relative">
          <div className="w-8 h-8 rounded-full bg-cyan-900/40 flex items-center justify-center">
            <span className="text-cyan-500 text-xs font-bold">AI</span>
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4">
            {isDefault || !url ? <HorseSigilSVG size={14} color="#dc262640" /> : <img src={url} alt="" className="w-3.5 h-3.5 object-contain opacity-30" />}
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">STABLE</p>
        <div className="w-14 h-14 bg-amber-950/30 border border-amber-900 rounded flex items-center justify-center relative">
          <span className="text-3xl">🐴</span>
          <div className="absolute bottom-0.5 right-0.5 opacity-50">
            {isDefault || !url ? <HorseSigilSVG size={12} color="#d97706" /> : <img src={url} alt="" className="w-3 h-3 object-contain" />}
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono mb-2">APP ICON</p>
        <div className="w-14 h-14 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center">
          {isDefault || !url ? <HorseSigilSVG size={32} color="#dc2626" /> : <img src={url} alt="" className="w-9 h-9 object-contain" />}
        </div>
      </div>
    </div>
  );
}

export default function SystemBranding() {
  const { sigil, isDefault, updateSigil } = useSigil();
  const [urlInput, setUrlInput] = useState(sigil.sigil_url);
  const [previewUrl, setPreviewUrl] = useState(sigil.sigil_url);
  const [previewIsDefault, setPreviewIsDefault] = useState(isDefault);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [siteTitle, setSiteTitle] = useState(() => localStorage.getItem('haezarian_site_title') ?? document.title);
  const [feedMode, setFeedModeState] = useState<FeedMode>('pulse');
  const [bubbleSize, setBubbleSizeState] = useState('medium');
  const [bubbleOpacity, setBubbleOpacityState] = useState(0.9);
  const [cfgSaving, setCfgSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const [mode, bubble] = await Promise.all([getFeedMode(), getBubbleConfig()]);
    setFeedModeState(mode);
    setBubbleSizeState(bubble.bubble_size);
    setBubbleOpacityState(bubble.bubble_opacity);
  };

  const handlePreview = () => {
    if (!urlInput.trim()) {
      setPreviewIsDefault(true);
      setPreviewUrl('');
    } else {
      setPreviewIsDefault(false);
      setPreviewUrl(urlInput.trim());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const isEmpty = !urlInput.trim();
    await updateSigil(
      isEmpty ? '' : urlInput.trim(),
      isEmpty ? 'default_horse' : 'custom_url'
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    setUrlInput('');
    setPreviewUrl('');
    setPreviewIsDefault(true);
    await updateSigil('', 'default_horse');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCfgSave = async () => {
    setCfgSaving(true);
    await Promise.all([
      setFeedMode(feedMode),
      setBubbleConfig(bubbleSize, bubbleOpacity),
    ]);
    setCfgSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center gap-3 mb-2">
        <Settings2 className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-red-400 tracking-widest">SYSTEM BRANDING</h2>
        <div className="flex items-center gap-1.5 ml-auto text-xs text-green-500 opacity-0 transition-opacity" style={{ opacity: saved ? 1 : 0 }}>
          <Check className="w-3.5 h-3.5" />
          SAVED
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
        <h3 className="text-red-500 text-sm font-bold flex items-center gap-2">
          <Image className="w-4 h-4" /> PRIMARY SIGIL
        </h3>

        <SigilPreview url={previewUrl} isDefault={previewIsDefault} />

        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1.5 flex items-center gap-1">
              <Link className="w-3 h-3" /> PASTE SIGIL URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => { setUrlInput(e.target.value); setPreviewIsDefault(!e.target.value.trim()); setPreviewUrl(e.target.value.trim()); }}
                placeholder="https://example.com/your-sigil.png"
                className="flex-1 bg-black border border-gray-800 text-gray-300 placeholder-gray-700 px-3 py-2 text-xs outline-none focus:border-red-800 transition-colors"
              />
              <button
                onClick={handlePreview}
                className="px-3 py-2 bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-500 text-xs transition-colors"
              >
                PREVIEW
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 bg-red-900 border border-red-700 text-red-300 hover:bg-red-800 disabled:opacity-50 text-xs font-bold transition-colors"
            >
              {saving ? 'PROPAGATING...' : 'APPLY SIGIL GLOBALLY'}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-gray-900 border border-gray-700 text-gray-500 hover:border-amber-800 hover:text-amber-600 text-xs transition-colors flex items-center gap-1"
              title="Reset to default horse sigil"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              HORSE DEFAULT
            </button>
          </div>

          <p className="text-gray-700 text-xs">
            Sigil propagates instantly to: Gatekeeper login, OS dashboard, PiP watermark, Stable brand, App icon. If no URL is set, the default Horse Sigil is used.
          </p>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
        <h3 className="text-blue-500 text-sm font-bold">SO LLESS STEM: FEED MODE</h3>
        <div className="flex gap-2">
          {([
            { mode: 'stream' as FeedMode, label: 'STREAM', icon: <Play className="w-3.5 h-3.5" />, desc: 'TikTok vertical video' },
            { mode: 'grid' as FeedMode, label: 'GRID', icon: <Grid className="w-3.5 h-3.5" />, desc: 'Instagram gallery' },
            { mode: 'pulse' as FeedMode, label: 'PULSE', icon: <AlignJustify className="w-3.5 h-3.5" />, desc: 'Twitter text status' },
          ]).map(({ mode, label, icon, desc }) => (
            <button
              key={mode}
              onClick={() => setFeedModeState(mode)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 border text-xs transition-all ${
                feedMode === mode
                  ? 'bg-blue-950 border-blue-700 text-blue-300'
                  : 'bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-600'
              }`}
            >
              {icon}
              <span className="font-bold">{label}</span>
              <span className="text-gray-600 text-xs">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
        <h3 className="text-green-500 text-sm font-bold">POP BUBBLE MESSENGER</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-500 text-xs block mb-2">BUBBLE SIZE</label>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(s => (
                <button
                  key={s}
                  onClick={() => setBubbleSizeState(s)}
                  className={`flex-1 py-2 border text-xs font-bold transition-all ${
                    bubbleSize === s
                      ? 'bg-green-950 border-green-700 text-green-300'
                      : 'bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-600'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs block mb-2">
              OPACITY: {Math.round(bubbleOpacity * 100)}%
            </label>
            <input
              type="range"
              min={30}
              max={100}
              value={Math.round(bubbleOpacity * 100)}
              onChange={e => setBubbleOpacityState(Number(e.target.value) / 100)}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-gray-700 text-xs mt-1">
              <span>GHOST</span>
              <span>SOLID</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-black border border-gray-800 rounded">
          <span className="text-gray-500 text-xs">BUBBLE PREVIEW:</span>
          {['IF', 'KD', 'LY', 'SC'].map((initials, i) => {
            const colors = ['#ef4444', '#f97316', '#3b82f6', '#eab308'];
            const sizes = { small: 28, medium: 36, large: 48 };
            const sz = sizes[bubbleSize as keyof typeof sizes] ?? 36;
            return (
              <div
                key={i}
                className="rounded-full flex items-center justify-center font-bold text-black"
                style={{
                  width: sz,
                  height: sz,
                  background: colors[i],
                  opacity: bubbleOpacity,
                  fontSize: sz * 0.3,
                }}
              >
                {initials}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
        <h3 className="text-orange-500 text-sm font-bold flex items-center gap-2">
          <Globe className="w-4 h-4" /> SITE DOMAIN TITLE
        </h3>
        <div className="space-y-2">
          <label className="text-gray-500 text-xs block">BROWSER TITLE / OS NAME</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={siteTitle}
              onChange={e => setSiteTitle(e.target.value)}
              placeholder="Satan's World: Hellskin OS"
              className="flex-1 bg-black border border-gray-800 text-gray-300 placeholder-gray-700 px-3 py-2 text-xs outline-none focus:border-orange-800 transition-colors"
            />
            <button
              onClick={() => {
                document.title = siteTitle;
                localStorage.setItem('haezarian_site_title', siteTitle);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="px-3 py-2 bg-orange-950 border border-orange-800 text-orange-400 hover:bg-orange-900 text-xs font-bold transition-colors"
            >
              APPLY
            </button>
            <button
              onClick={() => {
                const def = "HAEZARIAN EMPIRE — HELLSKIN OS";
                setSiteTitle(def);
                document.title = def;
                localStorage.setItem('haezarian_site_title', def);
              }}
              className="px-3 py-2 bg-gray-900 border border-gray-700 text-gray-500 hover:border-gray-500 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-gray-700 text-xs">Updates the browser tab title and OS window name instantly.</p>
        </div>
      </div>

      <button
        onClick={handleCfgSave}
        disabled={cfgSaving}
        className="w-full py-2.5 bg-red-900 border border-red-700 text-red-300 hover:bg-red-800 disabled:opacity-50 text-xs font-bold transition-colors"
      >
        {cfgSaving ? 'SAVING ALL SETTINGS...' : 'SAVE FEED + BUBBLE CONFIG'}
      </button>
    </div>
  );
}
