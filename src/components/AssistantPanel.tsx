import { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Zap, BookOpen, Activity, Mic, MicOff, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { getAllNPCs, getAllContent, getMagikMemories } from '../services/simWorldService';
import { processDialect } from '../lib/dialectProcessor';

interface Message {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

const QUICK_COMMANDS = [
  { label: 'NPC Status', action: 'npcs' },
  { label: 'World Memory', action: 'memories' },
  { label: 'Content List', action: 'content' },
  { label: 'Dialect Check', action: 'dialect sekku detai' },
];

async function runLocalCommand(cmd: string): Promise<string | null> {
  const lower = cmd.trim().toLowerCase();

  const dialect = await processDialect(lower);
  if (dialect.matched) return dialect.response;

  if (lower === 'npcs' || lower === 'npc status' || lower.includes('show npcs')) {
    const npcs = await getAllNPCs();
    if (npcs.length === 0) return 'No NPCs found. Start autonomy to initialize the sim-world.';
    const lines = npcs.map(n =>
      `  ${n.name.padEnd(16)} | ${n.personality.padEnd(12)} | Mood: ${n.mood}% | Energy: ${n.energy}% | ${n.current_activity}`
    );
    return `NPC ROSTER (${npcs.length} active)\n${'━'.repeat(70)}\n${lines.join('\n')}\n${'━'.repeat(70)}`;
  }

  if (lower === 'memories' || lower === 'world memory' || lower.includes('magik')) {
    const mems = await getMagikMemories(undefined, 5);
    if (mems.length === 0) return 'Magik Core empty. Create a snapshot to begin memory recording.';
    const lines = mems.map(m =>
      `  [${m.memory_type.toUpperCase()}] ${new Date(m.timestamp).toLocaleString()}`
    );
    return `RECENT MAGIK MEMORIES\n${'━'.repeat(60)}\n${lines.join('\n')}\n${'━'.repeat(60)}`;
  }

  if (lower === 'content' || lower.includes('show content')) {
    const content = await getAllContent();
    if (content.length === 0) return 'No content in database.';
    const lines = content.map(c =>
      `  ${c.title.padEnd(30)} | ${c.type.padEnd(8)} | ★ ${c.average_rating} (${c.total_ratings} ratings)`
    );
    return `CONTENT LIBRARY (${content.length} items)\n${'━'.repeat(70)}\n${lines.join('\n')}\n${'━'.repeat(70)}`;
  }

  if (lower.startsWith('dialect ')) {
    const phrase = cmd.slice(8);
    const result = await processDialect(phrase);
    if (result.matched) return result.response;
    return `Phrase "${phrase}" not found in Dialect Library.`;
  }

  if (lower === 'help' || lower === '?') {
    return `ASSISTANT COMMANDS
${'━'.repeat(60)}
  npcs              Show all NPC status
  memories          View recent Magik Core memories
  content           List all sim-world content
  dialect <phrase>  Process a dialect phrase
  help              Show this menu

POWER PHRASES:
  rubilexus
  sekku detai
  soul for your phone
  leopard anaconda
  magik core
${'━'.repeat(60)}`;
  }

  return null;
}

async function askGemini(text: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const fallbackKey = import.meta.env.VITE_SECONDARY_CORE;
  const key = apiKey && apiKey !== 'your_actual_key_here' ? apiKey : fallbackKey;

  if (!key) return 'Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env';

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are TOLB, the AI assistant for Satan's World / Haezarian OS. Be concise and direct. User says: ${text}`
        }]
      }]
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as any)?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No response from Gemini.';
}

function speakText(text: string, onEnd?: () => void) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const clean = text.replace(/[═╔╗╚╝║━]/g, '').replace(/\s{2,}/g, ' ').trim();
  const utter = new SpeechSynthesisUtterance(clean.slice(0, 800));
  utter.lang = 'en-US';
  utter.rate = 1.0;
  utter.pitch = 0.9;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

export default function AssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      text: `╔═══════════════════════════════════════════════════════════════╗
║         BOLT ASSISTANT — SATAN'S WORLD LIVE HOOK          ║
║         Linked to Rubilexus Terminal & Magik Core         ║
╚═══════════════════════════════════════════════════════════════╝

Type commands or use the microphone to interact with Satan's World.
Type "help" for available commands. All other input goes to Gemini.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);


  const addMessage = (role: Message['role'], text: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: new Date() }]);
  };

  const send = async (cmd?: string) => {
    const text = (cmd || input).trim();
    if (!text || loading) return;

    addMessage('user', text);
    setInput('');
    setLoading(true);
    setMicError(null);

    try {
      const local = await runLocalCommand(text);
      if (local !== null) {
        addMessage('assistant', local);
        if (ttsEnabled) speakText(local, () => setSpeaking(false));
      } else {
        const geminiReply = await askGemini(text);
        addMessage('assistant', geminiReply);
        if (ttsEnabled) {
          setSpeaking(true);
          speakText(geminiReply, () => setSpeaking(false));
        }
      }
    } catch (err: any) {
      const errMsg = `Gemini error: ${err?.message || 'Unknown error'}`;
      addMessage('assistant', errMsg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const startVoice = async () => {
    setMicError(null);

    if (window.speechSynthesis) {
      const unlock = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(unlock);
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError('Microphone permission denied. Allow mic access in browser settings.');
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicError('Speech recognition not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setListening(false);
        send(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setMicError('Microphone access denied. Check browser permissions.');
          break;
        case 'no-speech':
          setMicError('No speech detected. Try again.');
          break;
        case 'network':
          setMicError('Network error during speech recognition. Check connection.');
          break;
        default:
          setMicError(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setMicError('Failed to start microphone. Try again.');
      setListening(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const getTextColor = (role: Message['role']) => {
    switch (role) {
      case 'user': return 'text-amber-400';
      case 'system': return 'text-cyan-500';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      <div className="bg-gradient-to-b from-gray-950 to-black border-b-2 border-green-900 p-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-8 h-8 text-green-500" />
            <div>
              <h1 className="text-2xl font-bold text-green-400 tracking-widest">BOLT ASSISTANT</h1>
              <p className="text-green-800 text-xs">LIVE HOOK • GEMINI AI • VOICE I/O • SATAN'S WORLD v6.66</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {voiceSupported && (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
                <span className={`text-xs ${listening ? 'text-red-400' : 'text-gray-600'}`}>
                  {listening ? 'LISTENING' : 'VOICE'}
                </span>
              </div>
            )}
            <button
              onClick={() => { setTtsEnabled(v => !v); if (!ttsEnabled === false) stopSpeaking(); }}
              className="flex items-center gap-1.5 px-2 py-1 border border-green-900 text-xs transition-colors hover:border-green-700"
              title={ttsEnabled ? 'Mute voice output' : 'Enable voice output'}
            >
              {ttsEnabled ? <Volume2 className="w-3 h-3 text-green-600" /> : <VolumeX className="w-3 h-3 text-gray-600" />}
              <span className={ttsEnabled ? 'text-green-600' : 'text-gray-600'}>{ttsEnabled ? 'TTS ON' : 'TTS OFF'}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-600 text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col p-4 gap-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_COMMANDS.map(qc => (
            <button
              key={qc.action}
              onClick={() => send(qc.action)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-950/40 border border-green-900 text-green-400 hover:bg-green-900/40 transition-colors text-xs font-bold"
            >
              <Zap className="w-3 h-3" />
              {qc.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-3 text-xs">
          <div className="bg-gray-950 border border-green-900 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-bold">TERMINAL LINK</span>
            </div>
            <p className="text-gray-600">Rubilexus Protocol v6.66 active. Commands route to sim-world.</p>
          </div>
          <div className="bg-gray-950 border border-green-900 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-bold">GEMINI AI</span>
            </div>
            <p className="text-gray-600">Unknown commands go to Gemini. Responses spoken aloud via TTS.</p>
          </div>
          <div className="bg-gray-950 border border-green-900 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-bold">VOICE I/O</span>
            </div>
            <p className="text-gray-600">
              {voiceSupported
                ? 'Tap mic to speak. Permission requested on first use.'
                : 'Voice not supported. Use Chrome or Edge.'}
            </p>
          </div>
        </div>

        {micError && (
          <div className="flex items-start gap-2 px-3 py-2 bg-red-950/30 border border-red-900 rounded text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-red-400">{micError}</span>
            <button onClick={() => setMicError(null)} className="ml-auto text-red-700 hover:text-red-500">✕</button>
          </div>
        )}

        {speaking && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-950/20 border border-green-900 rounded text-xs">
            <Volume2 className="w-3.5 h-3.5 text-green-500 animate-pulse" />
            <span className="text-green-600">Speaking response...</span>
            <button onClick={stopSpeaking} className="ml-auto text-green-800 hover:text-green-600 text-xs">STOP</button>
          </div>
        )}

        <div
          ref={outputRef}
          className="flex-1 min-h-[50vh] bg-gray-950 border border-green-900 rounded-lg p-4 overflow-y-auto space-y-3"
        >
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'user' && (
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">{'>'}</span>
                  <span className="text-amber-400">{msg.text}</span>
                </div>
              )}
              {(msg.role === 'assistant' || msg.role === 'system') && (
                <pre className={`whitespace-pre-wrap text-sm leading-relaxed ${getTextColor(msg.role)}`}>
                  {msg.text}
                </pre>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-green-700">
              <span className="animate-pulse">▊</span>
              <span>Processing...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-gray-950 border border-green-800 p-3">
          <span className="text-green-700">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder={listening ? 'Listening...' : 'Enter command or speak to Gemini...'}
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-900 text-sm"
            autoFocus
            disabled={listening}
          />
          {voiceSupported && (
            <button
              onClick={startVoice}
              disabled={listening || loading}
              className={`p-1.5 transition-all disabled:opacity-50 ${
                listening
                  ? 'text-red-400 animate-pulse'
                  : 'text-green-700 hover:text-green-400 active:scale-95'
              }`}
              title={listening ? 'Listening...' : 'Tap to speak'}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="p-1.5 text-green-600 hover:text-green-400 disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
