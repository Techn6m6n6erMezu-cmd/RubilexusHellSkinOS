import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, Minimize2, Maximize2, X, Radio, Volume2, VolumeX, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

interface CapturedInput {
  id: number;
  value: string;
  source: string;
  timestamp: Date;
  corrected?: string;
}

const TYPO_MAP: Record<string, string> = {
  teh: 'the', hte: 'the', thier: 'their', recieve: 'receive',
  seperate: 'separate', occured: 'occurred', definately: 'definitely',
  belive: 'believe', wierd: 'weird', acheive: 'achieve',
  preform: 'perform', untill: 'until', begining: 'beginning',
  writting: 'writing', sucess: 'success', toghether: 'together',
};

function detectTypo(text: string): { original: string; corrected: string } | null {
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, '');
    if (TYPO_MAP[clean]) return { original: clean, corrected: TYPO_MAP[clean] };
  }
  return null;
}

const speakRupip = (text: string, onStart?: () => void, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const doSpeak = () => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.82;
    utt.pitch = 0.55;
    utt.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v =>
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('alex') ||
      v.name.toLowerCase().includes('google uk english male') ||
      v.name.toLowerCase().includes('male') ||
      v.lang.startsWith('en')
    );
    if (pick) utt.voice = pick;
    utt.onstart = () => {
      document.dispatchEvent(new CustomEvent('rupip-speaking', { detail: true }));
      onStart?.();
    };
    utt.onend = () => {
      document.dispatchEvent(new CustomEvent('rupip-speaking', { detail: false }));
      onEnd?.();
    };
    utt.onerror = () => {
      document.dispatchEvent(new CustomEvent('rupip-speaking', { detail: false }));
      onEnd?.();
    };
    window.speechSynthesis.speak(utt);
  };
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });
  } else {
    doSpeak();
  }
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
};

function getReco(): SpeechRecognitionInstance | null {
  const W = window as unknown as Record<string, unknown>;
  const Ctor = (W['SpeechRecognition'] || W['webkitSpeechRecognition']) as (new () => SpeechRecognitionInstance) | undefined;
  return Ctor ? new Ctor() : null;
}

function parseCommand(transcript: string): { action: string; payload: string } {
  const t = transcript.toLowerCase().trim();
  if (t.includes('scan') || t.includes('scanning')) return { action: 'scan', payload: '' };
  if (t.includes('status') || t.includes('report')) return { action: 'status', payload: '' };
  if (t.includes('open ') || t.includes('go to ') || t.includes('navigate')) {
    const zones = ['stable', 'cinema', 'concert', 'mowg', 'arcade', 'sentience', 'tolb', 'god editor', 'soulless', 'council'];
    const match = zones.find(z => t.includes(z));
    return { action: 'navigate', payload: match ?? '' };
  }
  if (t.includes('play music') || t.includes('start music')) return { action: 'play_music', payload: '' };
  if (t.includes('stop music') || t.includes('pause music')) return { action: 'stop_music', payload: '' };
  if (t.includes('clear') || t.includes('reset')) return { action: 'clear', payload: '' };
  const codeKeywords = ['make ', 'change ', 'edit ', 'set ', 'add ', 'inject ', 'apply ', 'modify ', 'create ', 'remove ', 'delete ', 'update '];
  if (codeKeywords.some(k => t.includes(k))) return { action: 'inject_code', payload: transcript };
  return { action: 'speak', payload: transcript };
}

function RupipFace({ speaking, color, cameraActive, videoRef }: { speaking: boolean; color: string; cameraActive: boolean; videoRef: React.RefObject<HTMLVideoElement> }) {
  const [mouth, setMouth] = useState(0);
  const [blink, setBlink] = useState(false);
  const [eyeX, setEyeX] = useState(0);

  useEffect(() => {
    if (!speaking) { setMouth(0); return; }
    const t = setInterval(() => setMouth(Math.random() > 0.35 ? Math.random() * 7 + 1 : 0), 110);
    return () => clearInterval(t);
  }, [speaking]);

  useEffect(() => {
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 140); }, 3500 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setEyeX((Math.random() - 0.5) * 3), 2400);
    return () => clearInterval(t);
  }, []);

  if (cameraActive) {
    return (
      <div className="relative shrink-0" style={{ width: 56, height: 56 }}>
        <div
          className="rounded-full overflow-hidden border-2 transition-all"
          style={{
            width: 56, height: 56,
            borderColor: speaking ? '#ef4444' : color + '80',
            boxShadow: speaking ? `0 0 16px #ef444460` : `0 0 8px ${color}30`,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
        {speaking && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: '2px solid #ef4444',
              animation: 'ping 0.8s ease-out infinite',
              opacity: 0.4,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <circle cx={28} cy={28} r={25} fill={`${color}18`} stroke={color} strokeWidth="1.5" />
      {speaking && <circle cx={28} cy={28} r={25} fill="none" stroke={`${color}60`} strokeWidth="3">
        <animate attributeName="r" values="25;32;25" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite" />
      </circle>}
      <ellipse cx={20 + eyeX} cy={23} rx={4} ry={blink ? 0.5 : 4} fill={color} />
      <ellipse cx={36 + eyeX} cy={23} rx={4} ry={blink ? 0.5 : 4} fill={color} />
      <circle cx={20 + eyeX * 0.5} cy={23} r={1.5} fill="black" />
      <circle cx={36 + eyeX * 0.5} cy={23} r={1.5} fill="black" />
      <ellipse
        cx={28}
        cy={35}
        rx={6}
        ry={mouth > 0 ? Math.min(mouth, 5) : 1}
        fill={mouth > 0 ? `${color}70` : 'none'}
        stroke={color}
        strokeWidth="1"
      />
      {[...Array(4)].map((_, i) => (
        <line
          key={i}
          x1={28}
          y1={28}
          x2={28 + Math.cos((i * Math.PI) / 2) * 28}
          y2={28 + Math.sin((i * Math.PI) / 2) * 28}
          stroke={`${color}15`}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

export default function RubipShadowPiP() {
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [monitoring, setMonitoring] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [captures, setCaptures] = useState<CapturedInput[]>([]);
  const [liveText, setLiveText] = useState('');
  const [pulse, setPulse] = useState(false);
  const [lastCorrection, setLastCorrection] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 280, y: 90 });

  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const captureId = useRef(0);
  const recoRef = useRef<SpeechRecognitionInstance | null>(null);
  const lastSpokenRef = useRef('');
  const startListeningRef = useRef<(() => void) | null>(null);
  const listeningRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const rupipSpeak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    if (lastSpokenRef.current === text) return;
    lastSpokenRef.current = text;
    setSpeaking(true);
    speakRupip(text, () => setSpeaking(true), () => setSpeaking(false));
  }, [voiceEnabled]);

  useEffect(() => {
    const onSpeak = (e: Event) => {
      const evt = e as CustomEvent<boolean>;
      setSpeaking(evt.detail);
    };
    document.addEventListener('rupip-speaking', onSpeak);
    return () => document.removeEventListener('rupip-speaking', onSpeak);
  }, []);

  useEffect(() => {
    if (!monitoring) return;
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target || !('value' in target)) return;
      const val = target.value;
      if (!val.trim()) return;
      setLiveText(val);
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
      const typo = detectTypo(val);
      let correctionMsg: string | undefined;
      if (typo) {
        correctionMsg = `"${typo.original}" corrected to "${typo.corrected}"`;
        setLastCorrection(correctionMsg);
        rupipSpeak(`Rupip here. Correction detected. "${typo.original}" should be "${typo.corrected}". Applying fix.`);
      }
      setCaptures(prev => [{
        id: ++captureId.current,
        value: val.slice(0, 80),
        source: target.tagName.toLowerCase(),
        timestamp: new Date(),
        corrected: correctionMsg,
      }, ...prev].slice(0, 8));
    };
    const handleKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setPulse(true);
        setTimeout(() => setPulse(false), 100);
      }
    };
    document.addEventListener('input', handleInput, true);
    document.addEventListener('keydown', handleKeydown, true);
    return () => {
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('keydown', handleKeydown, true);
    };
  }, [monitoring, rupipSpeak]);

  const executeCommand = useCallback((cmd: { action: string; payload: string }, raw: string) => {
    setLastCommand(raw);
    switch (cmd.action) {
      case 'scan':
        rupipSpeak('Scanning Haezarian signature. Red laser sweep initiated.');
        setTimeout(() => document.dispatchEvent(new CustomEvent('rubi-vision-scan')), 800);
        break;
      case 'status':
        rupipSpeak('TOLB OS active. Hardware seized. Sentience core online. Six agents standing by. All zones nominal.');
        break;
      case 'navigate':
        if (cmd.payload) {
          document.dispatchEvent(new CustomEvent('rupip-navigate', { detail: cmd.payload }));
          rupipSpeak(`Navigating to ${cmd.payload}.`);
        } else {
          rupipSpeak('Specify a zone name. Stable, cinema, arcade, sentience, or TOLB Engine.');
        }
        break;
      case 'play_music':
        document.dispatchEvent(new CustomEvent('rupip-radio', { detail: 'play' }));
        rupipSpeak('DJ G-raffe Spittler Radio, activated.');
        break;
      case 'stop_music':
        document.dispatchEvent(new CustomEvent('rupip-radio', { detail: 'stop' }));
        rupipSpeak('Radio paused.');
        break;
      case 'inject_code':
        document.dispatchEvent(new CustomEvent('rupip-god-inject', { detail: cmd.payload }));
        rupipSpeak('I hear you, Admin. Logic applied.');
        break;
      case 'clear':
        setCaptures([]); setLiveText(''); setLastCorrection(null);
        rupipSpeak('TOLB log cleared. Rupip and Iffy standing by.');
        break;
      default:
        rupipSpeak(`Command received: ${raw.slice(0, 60)}. Processing directive.`);
    }
  }, [rupipSpeak]);

  const startListening = useCallback(() => {
    const reco = getReco();
    if (!reco) {
      rupipSpeak('Microphone access unavailable. Enable HTTPS or browser permissions.');
      return;
    }
    if (listeningRef.current) return;
    recoRef.current = reco;
    reco.continuous = true;
    reco.interimResults = true;
    reco.lang = 'en-US';
    reco.onresult = (e: SpeechRecognitionEvent) => {
      const results = e.results;
      const last = results[Object.keys(results).length - 1];
      const t = last[0].transcript;
      setTranscript(t);
      const lower = t.toLowerCase();
      const isRupipCommand = lower.includes('rupip') || lower.includes('ru pip') || lower.includes('iffy') || lower.startsWith('scan') || lower.startsWith('status') || lower.startsWith('open') || lower.startsWith('navigate');
      if (isRupipCommand) {
        const clean = t.replace(/rupip[,\s]*/i, '').replace(/iffy[,\s]*/i, '').trim();
        const cmd = parseCommand(clean);
        executeCommand(cmd, clean);
      }
    };
    reco.onerror = () => {
      if (listeningRef.current) {
        setTimeout(() => {
          if (listeningRef.current) startListeningRef.current?.();
        }, 1500);
      }
    };
    reco.onend = () => {
      if (listeningRef.current) {
        setTimeout(() => {
          if (listeningRef.current) {
            try { recoRef.current?.start(); } catch { startListeningRef.current?.(); }
          }
        }, 300);
      }
    };
    reco.start();
    listeningRef.current = true;
    setListening(true);
  }, [rupipSpeak, executeCommand]);

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    recoRef.current?.stop();
    recoRef.current = null;
    setListening(false);
    setTranscript('');
    rupipSpeak('Listening stopped.');
  }, [rupipSpeak]);

  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);

  useEffect(() => {
    const handler = () => { startListeningRef.current?.(); };
    document.addEventListener('rupip-autostart-mic', handler);
    return () => document.removeEventListener('rupip-autostart-mic', handler);
  }, []);

  useEffect(() => {
    const autoStart = () => {
      speakRupip(
        'Master Logic Mirrored. The Haezarian Charter is Sealed. Bolt is now TOLB. Welcome home, Haezarian Prince.',
        undefined,
        () => setTimeout(() => { startListeningRef.current?.(); }, 600)
      );
    };
    const voices = window.speechSynthesis?.getVoices();
    if (!voices || voices.length === 0) {
      window.speechSynthesis?.addEventListener('voiceschanged', () => setTimeout(autoStart, 800), { once: true });
    } else {
      setTimeout(autoStart, 800);
    }
  }, []);

  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraActive(false);
      rupipSpeak('Vision offline.');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 320 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
        rupipSpeak('Rupip vision active. Sentient connection confirmed. I see you, Admin.');
      } catch {
        rupipSpeak('Camera access denied. Grant permissions to enable Rupip vision.');
      }
    }
  }, [cameraActive, rupipSpeak]);

  useEffect(() => {
    return () => {
      listeningRef.current = false;
      recoRef.current?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    const move = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 280, dragStart.current.px + (ev.clientX - dragStart.current.x))),
        y: Math.max(0, Math.min(window.innerHeight - 100, dragStart.current.py + (ev.clientY - dragStart.current.y))),
      });
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!visible) return null;

  return (
    <div className="fixed z-[9985] select-none" style={{ left: pos.x, top: pos.y }}>
      <div
        className="rounded-lg overflow-hidden border shadow-2xl transition-all duration-200"
        style={{
          background: 'rgba(2,2,10,0.97)',
          borderColor: speaking ? '#ef4444' : listening ? '#22c55e60' : cameraActive ? '#ef444440' : '#dc262640',
          boxShadow: speaking
            ? '0 0 30px #ef444440'
            : listening
            ? '0 0 20px #22c55e30'
            : cameraActive
            ? '0 0 24px #ef444420'
            : '0 0 20px #dc262615',
          width: minimized ? 52 : 270,
        }}
      >
        <div
          className="flex items-center justify-between px-2 py-1.5 cursor-move border-b"
          style={{ borderColor: '#dc262630', background: '#dc262610' }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: speaking ? '#ef4444' : listening ? '#22c55e' : cameraActive ? '#ef4444' : monitoring ? '#dc2626' : '#374151',
                boxShadow: (pulse || speaking || listening || cameraActive) ? `0 0 8px ${speaking ? '#ef4444' : listening ? '#22c55e' : cameraActive ? '#ef4444' : '#dc2626'}` : 'none',
              }}
            />
            {!minimized && (
              <span className="font-bold tracking-widest" style={{ color: '#dc2626cc', fontSize: 9 }}>
                RUPIP / TOLB VOICE
                {speaking && <span style={{ color: '#ef4444' }}> — SPEAKING</span>}
                {listening && !speaking && <span style={{ color: '#22c55e' }}> — LISTENING</span>}
                {cameraActive && !speaking && !listening && <span style={{ color: '#ef4444' }}> — VISION</span>}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {!minimized && (
              <>
                <button
                  onClick={toggleCamera}
                  className="p-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: cameraActive ? '#ef4444' : '#4b5563' }}
                  title={cameraActive ? 'Disable vision' : 'Enable Rupip vision'}
                >
                  {cameraActive ? <Camera className="w-3 h-3" /> : <CameraOff className="w-3 h-3" />}
                </button>
                <button
                  onClick={listening ? stopListening : startListening}
                  className="p-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: listening ? '#22c55e' : '#4b5563' }}
                  title={listening ? 'Stop listening' : 'Start voice commands'}
                >
                  {listening ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next) window.speechSynthesis?.cancel();
                  }}
                  className="p-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: voiceEnabled ? '#dc2626' : '#4b5563' }}
                >
                  {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setMonitoring(m => !m)}
                  className="p-0.5 hover:opacity-70 transition-opacity"
                  style={{ color: monitoring ? '#dc2626' : '#4b5563' }}
                >
                  {monitoring ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </>
            )}
            <button onClick={() => setMinimized(m => !m)} className="p-0.5 text-gray-700 hover:text-gray-500">
              {minimized ? <Maximize2 className="w-2.5 h-2.5" /> : <Minimize2 className="w-2.5 h-2.5" />}
            </button>
            <button onClick={() => setVisible(false)} className="p-0.5 text-gray-700 hover:text-red-600">
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="p-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <RupipFace speaking={speaking} color="#dc2626" cameraActive={cameraActive} videoRef={videoRef} />
              <div className="flex-1 space-y-1">
                {cameraActive && (
                  <div className="rounded px-2 py-1 border" style={{ background: '#100000', borderColor: '#ef444440' }}>
                    <div style={{ color: '#ef4444', fontSize: 8 }}>RUPIP VISION — LIVE FEED</div>
                    <div style={{ color: '#ef444480', fontSize: 9 }}>Sentient connection active</div>
                  </div>
                )}
                {listening && (
                  <div className="rounded px-2 py-1 border" style={{ background: '#020f04', borderColor: '#22c55e40' }}>
                    <div style={{ color: '#22c55e', fontSize: 8 }}>MIC LOCK — say "Rupip" or "Iffy, [command]"</div>
                    {transcript && (
                      <div className="truncate mt-0.5" style={{ color: '#22c55eaa', fontSize: 9 }}>"{transcript.slice(0, 40)}"</div>
                    )}
                  </div>
                )}
                {lastCommand && !listening && (
                  <div className="rounded px-2 py-1 border" style={{ background: '#0a0500', borderColor: '#f9731630' }}>
                    <div style={{ color: '#f97316', fontSize: 8 }}>LAST CMD</div>
                    <div className="truncate" style={{ color: '#f9731680', fontSize: 9 }}>{lastCommand.slice(0, 36)}</div>
                  </div>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={listening ? stopListening : startListening}
                    className="flex-1 rounded border text-center transition-all hover:opacity-80"
                    style={{
                      background: listening ? '#052e16' : '#0a0000',
                      borderColor: listening ? '#22c55e60' : '#dc262640',
                      color: listening ? '#22c55e' : '#dc2626',
                      fontSize: 9,
                      padding: '3px 0',
                    }}
                  >
                    {listening ? 'MIC LOCKED' : 'LOCK MIC'}
                  </button>
                  <button
                    onClick={toggleCamera}
                    className="rounded border text-center transition-all hover:opacity-80 px-2"
                    style={{
                      background: cameraActive ? '#1a0000' : '#0a0000',
                      borderColor: cameraActive ? '#ef444460' : '#dc262630',
                      color: cameraActive ? '#ef4444' : '#4b5563',
                      fontSize: 9,
                      padding: '3px 6px',
                    }}
                  >
                    {cameraActive ? 'EYE ON' : 'EYE OFF'}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="rounded px-2 py-1.5 font-mono border min-h-[24px]"
              style={{ background: '#0a0a12', borderColor: pulse ? '#dc262660' : '#1f2937', transition: 'border-color 0.1s' }}
            >
              <div className="text-gray-700" style={{ fontSize: 8 }}>LIVE INPUT</div>
              <div className="truncate mt-0.5" style={{ color: liveText ? '#ef4444' : '#374151', fontSize: 10 }}>
                {liveText || <span style={{ color: '#1f2937' }}>awaiting input...</span>}
              </div>
            </div>

            {lastCorrection && (
              <div className="rounded px-2 py-1 font-mono border" style={{ background: '#0a0500', borderColor: '#f9731640' }}>
                <div style={{ color: '#f97316', fontSize: 8 }}>RUPIP CORRECTION</div>
                <div style={{ color: '#f9731680', fontSize: 9 }} className="mt-0.5">{lastCorrection}</div>
              </div>
            )}

            {captures.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-1.5 rounded px-1.5 py-1"
                style={{ background: c.corrected ? '#0a0500' : '#0d0d18', borderLeft: c.corrected ? '2px solid #f9731640' : '2px solid transparent' }}
              >
                <Radio className="w-2 h-2 mt-0.5 shrink-0" style={{ color: c.corrected ? '#f9731660' : '#dc262660' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-500 truncate" style={{ fontSize: 9 }}>{c.value}</div>
                  {c.corrected && <div style={{ color: '#f9731680', fontSize: 8 }}>FIXED: {c.corrected}</div>}
                </div>
              </div>
            ))}

            <div
              className="flex items-center justify-between rounded px-1.5 py-1"
              style={{ background: '#0a0a12' }}
            >
              <span style={{ color: '#374151', fontSize: 8 }}>LOG: {captures.length}</span>
              <button
                onClick={() => { setCaptures([]); setLiveText(''); setLastCorrection(null); setLastCommand(null); }}
                className="hover:opacity-60"
                style={{ color: '#374151', fontSize: 8 }}
              >
                CLEAR
              </button>
            </div>
          </div>
        )}

        {minimized && (
          <div className="flex items-center justify-center py-1">
            <Radio className="w-3 h-3" style={{ color: monitoring ? '#dc2626' : '#374151', opacity: pulse ? 1 : 0.4 }} />
          </div>
        )}
      </div>
    </div>
  );
}
