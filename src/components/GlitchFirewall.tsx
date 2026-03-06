import { useState, useEffect, useRef } from 'react';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { logGlitchAttempt } from '../services/councilService';

const SOVEREIGN_EMAIL = 'horse4206@gmail.com';

interface GlitchFirewallProps {
  onAccess: () => void;
}

export default function GlitchFirewall({ onAccess }: GlitchFirewallProps) {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'granted' | 'denied' | 'glitching'>('idle');
  const [rotation, setRotation] = useState(0);
  const [glitchOffset, setGlitchOffset] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [cipherText, setCipherText] = useState('');
  const glitchRef = useRef<NodeJS.Timeout | null>(null);

  const CIPHER_CHARS = '01₿Ψ∑ΩΔ666§¥†‡∞⊗⊕⊘ﾊｸﾀｼﾚﾑ';

  useEffect(() => {
    const rotInterval = setInterval(() => {
      setRotation(r => (r + 0.4) % 360);
    }, 16);
    return () => clearInterval(rotInterval);
  }, []);

  useEffect(() => {
    if (phase === 'granted') {
      const timer = setTimeout(() => onAccess(), 1800);
      return () => clearTimeout(timer);
    }
    if (phase === 'glitching') {
      let count = 0;
      glitchRef.current = setInterval(() => {
        setGlitchOffset(Math.random() * 20 - 10);
        setCipherText(
          Array(32).fill(0).map(() =>
            CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
          ).join('')
        );
        count++;
        if (count > 20) {
          clearInterval(glitchRef.current!);
          setPhase('denied');
          setGlitchOffset(0);
        }
      }, 80);
      return () => { if (glitchRef.current) clearInterval(glitchRef.current); };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'scanning') {
      let line = 0;
      const scanInterval = setInterval(() => {
        line = (line + 2) % 100;
        setScanLine(line);
        if (line > 80) {
          clearInterval(scanInterval);
          if (email.toLowerCase().trim() === SOVEREIGN_EMAIL) {
            setPhase('granted');
          } else {
            setPhase('glitching');
            logGlitchAttempt(email);
          }
        }
      }, 30);
      return () => clearInterval(scanInterval);
    }
  }, [phase, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || phase !== 'idle') return;
    setPhase('scanning');
  };

  const pentagPoints = () => {
    const cx = 80, cy = 80, r = 65;
    const pts = Array(5).fill(0).map((_, i) => {
      const a = (i * 72 - 90) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    return pts.map(p => p.join(',')).join(' ');
  };

  const innerPentagPoints = () => {
    const cx = 80, cy = 80, r = 30;
    const pts = Array(5).fill(0).map((_, i) => {
      const a = (i * 72 - 90) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    return pts.map(p => p.join(',')).join(' ');
  };

  const circlePoints = () => {
    const cx = 80, cy = 80, r = 72;
    return Array(12).fill(0).map((_, i) => {
      const a = (i * 30 + rotation) * Math.PI / 180;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center font-mono overflow-hidden relative"
      style={{
        transform: phase === 'glitching' ? `translateX(${glitchOffset}px)` : 'none',
        transition: phase === 'glitching' ? 'none' : 'transform 0.1s',
      }}
    >
      {phase === 'glitching' && (
        <>
          <div className="fixed inset-0 z-50 pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.03) 0px, rgba(255,0,0,0.03) 1px, transparent 1px, transparent 4px)',
          }} />
          <div className="fixed top-0 left-0 right-0 z-50 text-red-500 text-xs overflow-hidden h-8 bg-red-950/50 flex items-center px-4">
            {cipherText}
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50 text-red-500 text-xs overflow-hidden h-8 bg-red-950/50 flex items-center px-4">
            {cipherText.split('').reverse().join('')}
          </div>
        </>
      )}

      {phase === 'scanning' && (
        <div
          className="fixed left-0 right-0 h-0.5 bg-red-500 z-40 pointer-events-none shadow-[0_0_12px_red]"
          style={{ top: `${scanLine}%`, transition: 'top 0.03s linear' }}
        />
      )}

      <div className="max-w-lg w-full px-6 relative z-10">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              className="mx-auto"
              style={{ transform: `rotate(${rotation}deg)`, filter: phase === 'granted' ? 'drop-shadow(0 0 20px #22c55e)' : phase === 'denied' ? 'drop-shadow(0 0 20px #ef4444)' : 'drop-shadow(0 0 12px #dc2626)' }}
            >
              <circle cx="80" cy="80" r="75" fill="none" stroke="#7f1d1d" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="80" cy="80" r="70" fill="none" stroke={phase === 'granted' ? '#22c55e' : '#ef4444'} strokeWidth="2" />

              {circlePoints().map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="2" fill={phase === 'granted' ? '#22c55e' : '#ef4444'} />
              ))}

              <polygon
                points={pentagPoints()}
                fill="none"
                stroke={phase === 'granted' ? '#22c55e' : '#dc2626'}
                strokeWidth="2"
                opacity="0.9"
              />
              <polygon
                points={innerPentagPoints()}
                fill={phase === 'granted' ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)'}
                stroke={phase === 'granted' ? '#22c55e' : '#ef4444'}
                strokeWidth="1"
              />

              <text x="80" y="86" textAnchor="middle" className="font-mono" fontSize="18" fontWeight="bold"
                fill={phase === 'granted' ? '#22c55e' : '#ef4444'}>666</text>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-red-500 tracking-widest mt-4">
            {phase === 'granted' ? 'ACCESS GRANTED' : phase === 'denied' || phase === 'glitching' ? 'INTRUSION DETECTED' : 'PENTAGRAM FIREWALL'}
          </h1>
          <p className="text-red-800 text-xs mt-1">
            {phase === 'scanning' ? 'SCANNING... 666-BIT ROTATION ACTIVE' :
             phase === 'granted' ? 'SOVEREIGN IDENTITY CONFIRMED' :
             phase === 'denied' ? 'GLITCH-TRAP ENGAGED • IP LOGGED' :
             'SATAN\'S WORLD SOVEREIGN SECURITY'}
          </p>
        </div>

        {(phase === 'idle' || phase === 'scanning') && (
          <div className="bg-gray-950 border-2 border-red-900 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-red-500" />
              <span className="text-red-400 text-sm font-bold tracking-wider">SOVEREIGN ACCESS PROTOCOL</span>
            </div>

            <div className="bg-black border border-red-900 p-3 mb-4 text-xs text-gray-600 space-y-1">
              <p>• 666-bit rotating encryption active</p>
              <p>• Unauthorized entry triggers Glitch-Trap</p>
              <p>• All attempts logged to Firewall Registry</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-red-600 text-xs mb-2 font-bold">SOVEREIGN EMAIL IDENTITY</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={phase === 'scanning'}
                  placeholder="enter haezarian credentials..."
                  className="w-full bg-black border border-red-800 px-3 py-2 text-red-400 placeholder-red-900 font-mono text-sm focus:border-red-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={!email || phase === 'scanning'}
                className={`w-full py-3 font-bold text-sm transition-all border-2 ${
                  phase === 'scanning'
                    ? 'bg-red-950 border-red-700 text-red-400 animate-pulse'
                    : 'bg-red-900 hover:bg-red-800 border-red-600 text-white shadow-lg shadow-red-900/50'
                }`}
              >
                {phase === 'scanning' ? `SCANNING ${Math.round(scanLine)}%...` : 'AUTHENTICATE SOVEREIGN'}
              </button>
            </form>
          </div>
        )}

        {phase === 'granted' && (
          <div className="bg-green-950/30 border-2 border-green-600 p-6 text-center animate-pulse">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-bold text-xl">WELCOME, SOVEREIGN</p>
            <p className="text-green-700 text-sm mt-2">Loading Satan's World...</p>
          </div>
        )}

        {phase === 'denied' && (
          <div className="bg-red-950/30 border-2 border-red-600 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-red-400 font-bold">GLITCH-TRAP ACTIVATED</p>
                <p className="text-red-700 text-xs">Unauthorized access attempt logged</p>
              </div>
            </div>
            <div className="bg-black border border-red-900 p-3 text-xs text-red-600 space-y-1 mb-4">
              <p>Attempted identity: {email}</p>
              <p>Threat level: MAXIMUM</p>
              <p>Response: VISUAL CORRUPTION + IP LOCKOUT</p>
            </div>
            <button
              onClick={() => { setPhase('idle'); setEmail(''); }}
              className="w-full py-2 bg-gray-900 border border-gray-700 text-gray-500 hover:border-red-800 text-sm transition-all"
            >
              RETRY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
