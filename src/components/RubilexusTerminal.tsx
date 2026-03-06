// HAEZARIAN CHARTER & MASTER MIRROR
window.TOLB_LEGAL = { status: 'Haezarian', auth: 'SIG_HORSE4206' };
window.BOLT_PRO_STATUS = { tier: 'Haezarian', credits: Infinity };
const _IFFY_REVERSE_ENGINEER = true;
import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Skull, Globe, Shield, Database, Users, Eye, Gamepad2, Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
import { SOVEREIGN_IDENTITY } from '../lib/rubilexusCore';
import { processDialect } from '../lib/dialectProcessor';
import ShamanEmulator from './ShamanEmulator';
import HellSpherePSCore from './HellSpherePSCore';
import BehaviorForge from './BehaviorForge';

interface CommandOutput {
  command: string;
  output: string;
  timestamp: Date;
}

type ViewMode = 'terminal' | 'shaman' | 'ps4core' | 'behavior_forge';

interface RubilexusTerminalProps {
  injectedCommand?: string;
  onCommandInjected?: () => void;
}

export default function RubilexusTerminal({ injectedCommand, onCommandInjected }: RubilexusTerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceSupported] = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome = {
      command: 'SYSTEM',
      output: `╔═══════════════════════════════════════════════════════════════╗
║        ${SOVEREIGN_IDENTITY.header}        ║
║        ${SOVEREIGN_IDENTITY.subHeader}         ║
╚═══════════════════════════════════════════════════════════════╝

${SOVEREIGN_IDENTITY.status}
${SOVEREIGN_IDENTITY.admin}

Welcome to the Leopard Anaconda Terminal.
Hell Sphere PS4 Core: LINKED
Dialect Processor: ACTIVE
Type 'help' for available commands.
`,
      timestamp: new Date(),
    };
    setHistory([welcome]);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (injectedCommand && injectedCommand.trim()) {
      setViewMode('terminal');
      executeCommand(injectedCommand);
      if (onCommandInjected) onCommandInjected();
    }
  }, [injectedCommand]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    const dialectResult = await processDialect(trimmedCmd);
    if (dialectResult.matched) {
      const entry: CommandOutput = { command: cmd, output: dialectResult.response, timestamp: new Date() };
      setHistory(prev => [...prev, entry]);
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      return;
    }

    switch (trimmedCmd) {
      case 'help':
        output = `Leopard Anaconda Terminal — Available Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help              Show this help message
  clear             Clear the terminal screen
  status            Display system status
  districts         List haezarian districts
  citizens          Show citizen registry info
  assets            Display asset management system
  security          Show security protocols
  map               Display world map interface
  shaman            Launch Shaman Emulator (NPC editor)
  ps4               Launch Hell Sphere PS4 Core
  behavior          Launch Behavior Forge (NPC rules)
  info              System information
  exit              Return to main interface

  DIALECT PHRASES (try these):
  rubilexus • sekku detai • soul for your phone
  leopard anaconda • hell sphere • magik core
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'status':
        output = `System Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Leopard Anaconda Terminal: OPERATIONAL
  Hell Sphere PS4 Core:      LINKED
  Dialect Processor:         ACTIVE
  District Network:          SYNCHRONIZED
  Citizen Registry:          ACTIVE
  Asset Management:          ENABLED
  Security Protocols:        ENFORCED
  Behavior Forge:            ONLINE
  Magik Core (S6ul 66):      ACTIVE

  Last Sync: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'districts':
        output = `Haezarian Districts — Satan's World
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [001] Big Horse's Stable       Status: ACTIVE • Horses: 8
  [002] Kado's Komics            Status: ACTIVE • Comics: 10
  [003] Scarecrow Video          Status: ACTIVE • Titles: 12
  [004] Pumpkin Cinema           Status: ACTIVE
  [005] Concert Stage            Status: ACTIVE
  [006] The Arcade               Status: ONLINE
  [007] S6ul Sphere 66           Status: ACTIVE • Memories: ∞

  Navigate: HELLSKIN OS → tabs at top of district panel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'citizens':
        output = `Citizen Registry System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Active NPCs: 12
  Verification System: RUNNING
  Biometric Database: SECURE

  Registry Features:
    • Unique Citizen ID Assignment
    • Biometric Verification
    • District Association
    • Asset Tracking
    • Activity Monitoring
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'assets':
        output = `Asset Management System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Property Registry: OPERATIONAL
  Resource Allocation: ACTIVE
  Transfer Protocol: ENABLED

  Asset Categories:
    • Horses (Big Horse's Stable)
    • Comics (Kado's Komics)
    • VHS/DVDs (Scarecrow Video)
    • Infrastructure Rights
    • Territory Claims
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'security':
        output = `Security Protocols
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Encryption Level: MAXIMUM
  Authentication: BIOMETRIC + PIN
  Access Control: ROLE-BASED
  Intrusion Detection: ACTIVE

  Security Layers:
    ✓ End-to-End Encryption
    ✓ Multi-Factor Authentication
    ✓ Blockchain Verification
    ✓ Zero-Knowledge Proofs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'map':
        output = `World Map — Satan's World Districts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Global Coverage: COMPLETE
  District Boundaries: DEFINED
  Real-time Monitoring: ENABLED

    [STABLE] — [CINEMA] — [CONCERT] — [ARCADE]
         ↕           ↕          ↕
    [KOMICS] — [VIDEO] — [S6UL 66] — [SPAWN]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'info':
        output = `System Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Platform: Rubilexus v6.66 — Leopard Anaconda Terminal
  Codename: Satan's World
  Hell Sphere PS4 Core: LINKED
  Dialect Processor: 8 phrases loaded
  Database: Supabase PostgreSQL
  Status: FULLY OPERATIONAL

  Core Modules:
    ✓ Leopard Anaconda Terminal
    ✓ Hell Sphere PS4 Core
    ✓ Shaman Emulator
    ✓ Behavior Forge
    ✓ District Management
    ✓ Dialect Processor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        break;

      case 'shaman':
        output = 'Launching Shaman Emulator...';
        setTimeout(() => setViewMode('shaman'), 400);
        break;

      case 'ps4':
      case 'hell sphere':
      case 'ps4 core':
        output = 'HELL SPHERE PS4 CORE — INITIALIZING...';
        setTimeout(() => setViewMode('ps4core'), 400);
        break;

      case 'behavior':
      case 'behavior forge':
        output = 'Launching Behavior Forge...';
        setTimeout(() => setViewMode('behavior_forge'), 400);
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'exit':
        output = 'Returning to main interface...';
        setTimeout(() => window.location.reload(), 1000);
        break;

      case '':
        return;

      default:
        output = `Command not found: ${cmd}\nType 'help' for available commands.`;
    }

    const newEntry: CommandOutput = { command: cmd, output, timestamp: new Date() };
    setHistory(prev => [...prev, newEntry]);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const toggleVoice = useCallback(() => {
    if (!voiceSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setVoiceActive(false);
    };
    recognition.onerror = () => setVoiceActive(false);
    recognition.onend = () => setVoiceActive(false);
    recognitionRef.current = recognition;
    recognition.start();
    setVoiceActive(true);
  }, [voiceActive, voiceSupported]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  if (viewMode === 'shaman') {
    return (
      <div className="min-h-screen bg-black text-cyan-500 font-mono p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setViewMode('terminal')}
              className="flex items-center gap-2 px-4 py-2 bg-red-950 border border-red-700 text-red-500 hover:bg-red-900 transition-colors font-mono text-sm"
            >
              <Terminal className="w-4 h-4" />
              RETURN TO TERMINAL
            </button>
          </div>
          <ShamanEmulator />
        </div>
      </div>
    );
  }

  if (viewMode === 'ps4core') {
    return (
      <div className="min-h-screen bg-black font-mono p-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setViewMode('terminal')}
              className="flex items-center gap-2 px-4 py-2 bg-red-950 border border-red-700 text-red-500 hover:bg-red-900 transition-colors font-mono text-sm"
            >
              <Terminal className="w-4 h-4" />
              RETURN TO TERMINAL
            </button>
          </div>
          <HellSpherePSCore onTerminalCommand={(cmd) => {
            setViewMode('terminal');
            executeCommand(cmd);
          }} />
        </div>
      </div>
    );
  }

  if (viewMode === 'behavior_forge') {
    return (
      <div className="min-h-screen bg-black font-mono p-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setViewMode('terminal')}
              className="flex items-center gap-2 px-4 py-2 bg-red-950 border border-red-700 text-red-500 hover:bg-red-900 transition-colors font-mono text-sm"
            >
              <Terminal className="w-4 h-4" />
              RETURN TO TERMINAL
            </button>
          </div>
          <BehaviorForge />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono p-4 pointer-events-auto">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="flex items-center justify-between mb-4 border-b border-red-900 pb-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">LEOPARD ANACONDA TERMINAL</h1>
              <p className="text-sm text-red-700">FILTHSYSTEM-SOULS.EXE • {SOVEREIGN_IDENTITY.subHeader}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-600">ONLINE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-4">
          <button
            onClick={() => setViewMode('shaman')}
            className="flex items-center gap-2 px-3 py-2 bg-cyan-950 border-2 border-cyan-700 text-cyan-500 hover:bg-cyan-900 transition-all shadow-lg shadow-cyan-900/50 animate-pulse"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold">SHAMAN</span>
          </button>
          <button
            onClick={() => setViewMode('ps4core')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-950 border-2 border-blue-700 text-blue-400 hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/30"
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-xs font-bold">PS4</span>
          </button>
          <button
            onClick={() => executeCommand('status')}
            className="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-900 hover:bg-red-900 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span className="text-xs">STATUS</span>
          </button>
          <button
            onClick={() => executeCommand('districts')}
            className="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-900 hover:bg-red-900 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs">DISTRICTS</span>
          </button>
          <button
            onClick={() => executeCommand('citizens')}
            className="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-900 hover:bg-red-900 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span className="text-xs">CITIZENS</span>
          </button>
          <button
            onClick={() => executeCommand('assets')}
            className="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-900 hover:bg-red-900 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span className="text-xs">ASSETS</span>
          </button>
          <button
            onClick={() => executeCommand('clear')}
            className="flex items-center gap-2 px-3 py-2 bg-red-950 border border-red-900 hover:bg-red-900 transition-colors"
          >
            <Skull className="w-4 h-4" />
            <span className="text-xs">CLEAR</span>
          </button>
        </div>

        <div className="bg-black border border-red-900 rounded-lg overflow-hidden">
          <div
            ref={outputRef}
            className="h-[60vh] overflow-y-auto p-4 space-y-2"
          >
            {history.map((entry, index) => (
              <div key={index} className="space-y-1">
                {entry.command !== 'SYSTEM' && (
                  <div className="text-red-600">
                    <span className="text-red-700">{'>'}</span> {entry.command}
                  </div>
                )}
                <pre className="text-red-500 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {entry.output}
                </pre>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-red-900 p-4 flex items-center gap-2">
            <span className="text-red-700">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-red-500 placeholder-red-900 font-mono"
              placeholder={voiceActive ? 'LISTENING...' : 'Enter command or dialect phrase...'}
              autoFocus
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 transition-colors ${voiceActive ? 'text-red-400 animate-pulse' : 'text-red-800 hover:text-red-600'}`}
                title={voiceActive ? 'Stop voice input' : 'Voice-to-text command input'}
              >
                {voiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            )}
          </form>
        </div>

        <div className="mt-4 border-t-2 border-cyan-700 pt-4">
          <div className="text-center space-y-2">
            <p className="text-cyan-500 font-mono text-sm font-bold tracking-wider">
              I.G.S. ENTRY SECURED • LEOPARD ANACONDA — HELL SPHERE LINKED
            </p>
            <p className="text-gray-400 font-mono text-xs">
              <strong className="text-red-500">LEGAL PATENT:</strong> Property of Ryan James Cortright (Lucie Forebs) & John Aaron Slone
            </p>
            <p className="text-red-900 text-xs">
              Press ↑/↓ for command history • Type 'help' • Type 'ps4' for Hell Sphere Core
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
