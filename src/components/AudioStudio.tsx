import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Trash2, Download, Radio, Volume2 } from 'lucide-react';

interface Recording {
  id: string;
  url: string;
  size: number;
  duration: number;
  createdAt: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function WaveformBars({ active }: { active: boolean }) {
  const bars = 24;
  return (
    <div className="flex items-center gap-0.5" style={{ height: 36 }}>
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 3,
            background: active ? '#22c55e' : '#1f2937',
            height: active
              ? `${14 + Math.sin(Date.now() / 80 + i * 0.7) * 12}%`
              : '20%',
            minHeight: 4,
            maxHeight: '100%',
            animation: active ? `wave-bar ${0.5 + (i % 5) * 0.08}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AudioStudio() {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [activePlay, setActivePlay] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recordings.forEach(r => URL.revokeObjectURL(r.url));
    };
  }, [recordings]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '' });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = (Date.now() - startTimeRef.current) / 1000;
        setRecordings(prev => [
          {
            id: crypto.randomUUID(),
            url,
            size: blob.size,
            duration,
            createdAt: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(100);
      mediaRecorderRef.current = mr;
      startTimeRef.current = Date.now();
      setElapsed(0);
      setRecording(true);
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 500);
    } catch {
      setPermissionDenied(true);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(false);
      setElapsed(0);
    }
  }, [recording]);

  const deleteRecording = useCallback((id: string) => {
    setRecordings(prev => {
      const rec = prev.find(r => r.id === id);
      if (rec) URL.revokeObjectURL(rec.url);
      return prev.filter(r => r.id !== id);
    });
  }, []);

  const downloadRecording = useCallback((rec: Recording, idx: number) => {
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = `haezarian-audio-${idx + 1}.webm`;
    a.click();
  }, []);

  return (
    <div
      className="rounded-xl border overflow-hidden flex flex-col"
      style={{ background: '#02050a', borderColor: '#052e16', minHeight: 420 }}
    >
      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
      `}</style>

      <div
        className="flex items-center gap-3 px-5 py-3 border-b"
        style={{ borderColor: '#052e16', background: '#030e06' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ background: '#052e1640', borderColor: '#22c55e40' }}
        >
          <Radio className="w-4 h-4" style={{ color: '#22c55e' }} />
        </div>
        <div>
          <div className="font-bold tracking-widest" style={{ color: '#e5e7eb', fontSize: 11 }}>AUDIO STUDIO</div>
          <div style={{ color: '#22c55e40', fontSize: 8 }}>HAEZARIAN VOICE RECORDER — MEDIARECORDER API</div>
        </div>
        {recording && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 700 }}>REC {formatTime(elapsed)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-4">
        <div
          className="w-full flex flex-col items-center gap-3 p-5 rounded-xl border"
          style={{ borderColor: recording ? '#22c55e40' : '#1f2937', background: recording ? '#052e1615' : '#020508', transition: 'all 0.4s' }}
        >
          <WaveformBars active={recording} />

          <div className="flex items-center gap-3 mt-2">
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={permissionDenied}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-40"
                style={{ background: '#052e16', border: '1.5px solid #22c55e', color: '#22c55e', fontSize: 11 }}
              >
                <Mic className="w-4 h-4" />
                START RECORDING
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: '#450a0a', border: '1.5px solid #ef4444', color: '#ef4444', fontSize: 11 }}
              >
                <Square className="w-4 h-4" />
                STOP
              </button>
            )}
          </div>

          {permissionDenied && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#ef4444' }}>
              <MicOff className="w-3 h-3" />
              Microphone access denied. Allow mic in browser settings.
            </div>
          )}

          <div className="flex items-center gap-2 w-full max-w-[220px]">
            <Volume2 className="w-3 h-3 shrink-0" style={{ color: '#374151' }} />
            <input
              type="range" min="0" max="1" step="0.01"
              value={volume}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                Object.values(audioRefs.current).forEach(el => { el.volume = v; });
              }}
              className="flex-1 h-1 rounded-full accent-green-500"
              style={{ background: '#1f2937' }}
            />
            <span style={{ color: '#374151', fontSize: 9, width: 28, textAlign: 'right' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        <div className="w-full space-y-2 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          {recordings.length === 0 && (
            <div className="text-center py-4" style={{ color: '#1f2937', fontSize: 10 }}>
              No recordings yet. Press Start to record.
            </div>
          )}
          {recordings.map((rec, idx) => (
            <div
              key={rec.id}
              className="flex flex-col gap-1.5 p-3 rounded-lg border"
              style={{ borderColor: activePlay === rec.id ? '#22c55e40' : '#1f2937', background: '#020508' }}
            >
              <div className="flex items-center gap-2">
                <div style={{ color: '#22c55e80', fontSize: 9, fontWeight: 700 }}>
                  TAKE {recordings.length - idx}
                </div>
                <div style={{ color: '#374151', fontSize: 8 }}>{rec.createdAt}</div>
                <div style={{ color: '#374151', fontSize: 8 }}>{formatTime(rec.duration)}</div>
                <div style={{ color: '#374151', fontSize: 8 }}>{formatBytes(rec.size)}</div>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() => downloadRecording(rec, idx)}
                    className="p-1 rounded hover:bg-white/5 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3 h-3" style={{ color: '#3b82f6' }} />
                  </button>
                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="p-1 rounded hover:bg-white/5 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" style={{ color: '#ef4444' }} />
                  </button>
                </div>
              </div>
              <audio
                ref={el => { if (el) { audioRefs.current[rec.id] = el; el.volume = volume; } }}
                src={rec.url}
                controls
                onPlay={() => setActivePlay(rec.id)}
                onPause={() => setActivePlay(null)}
                onEnded={() => setActivePlay(null)}
                className="w-full"
                style={{ height: 28, filter: 'invert(1) hue-rotate(90deg) brightness(0.8)' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-auto px-5 py-2 border-t flex items-center gap-3"
        style={{ borderColor: '#052e16', background: '#020508' }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: recording ? '#22c55e' : '#1f2937', animation: recording ? 'pulse 1s infinite' : 'none' }} />
        <span style={{ color: '#1f2937', fontSize: 8 }}>
          {recording ? `RECORDING — ${formatTime(elapsed)}` : `${recordings.length} RECORDING${recordings.length !== 1 ? 'S' : ''} IN VAULT`}
        </span>
        <Play className="w-3 h-3 ml-auto" style={{ color: '#1f2937' }} />
        <span style={{ color: '#1f2937', fontSize: 8 }}>WEBM / OGG CODEC</span>
      </div>
    </div>
  );
}
