import { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { getAllAgents, type SentientAgent } from '../services/councilService';
import SigilMark from './SigilMark';

interface AgentPiPProps {
  agentSlug?: string;
}

function useLipSync(isActive: boolean) {
  const [mouthOpen, setMouthOpen] = useState(0);
  useEffect(() => {
    if (!isActive) { setMouthOpen(0); return; }
    const interval = setInterval(() => {
      setMouthOpen(Math.random() > 0.4 ? Math.random() * 8 : 0);
    }, 120);
    return () => clearInterval(interval);
  }, [isActive]);
  return mouthOpen;
}

function AgentFace({ agent, speaking }: { agent: SentientAgent; speaking: boolean }) {
  const mouth = useLipSync(speaking);
  const [blink, setBlink] = useState(false);
  const [eyeX, setEyeX] = useState(0);
  const [eyeY, setEyeY] = useState(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const trackInterval = setInterval(() => {
      setEyeX((Math.random() - 0.5) * 4);
      setEyeY((Math.random() - 0.5) * 3);
    }, 2000);
    return () => clearInterval(trackInterval);
  }, []);

  const c = agent.color_primary;
  const cx = 40;
  const cy = 40;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={36} fill={`${c}20`} stroke={c} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={28} fill={`${c}10`} />
      {[...Array(3)].map((_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={36 + (i + 1) * 6}
          fill="none"
          stroke={`${c}${30 - i * 8}`}
          strokeWidth="0.5"
        />
      ))}
      <ellipse cx={cx - 9 + eyeX} cy={cy - 5 + eyeY} rx={5} ry={blink ? 0.5 : 5} fill={c} />
      <ellipse cx={cx + 9 + eyeX} cy={cy - 5 + eyeY} rx={5} ry={blink ? 0.5 : 5} fill={c} />
      <circle cx={cx - 9 + eyeX * 0.5} cy={cy - 5 + eyeY * 0.5} r={2} fill="black" />
      <circle cx={cx + 9 + eyeX * 0.5} cy={cy - 5 + eyeY * 0.5} r={2} fill="black" />
      <ellipse
        cx={cx}
        cy={cy + 10}
        rx={8}
        ry={mouth > 0 ? mouth : 1}
        fill={mouth > 0 ? `${c}80` : 'none'}
        stroke={c}
        strokeWidth="1"
      />
    </svg>
  );
}

function SingleAgentPiP({ agent }: { agent: SentientAgent }) {
  const [speaking, setSpeaking] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pos, setPos] = useState({ x: 16, y: 80 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    const speakInterval = setInterval(() => {
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 1200 + Math.random() * 2000);
    }, 5000 + Math.random() * 8000);
    return () => clearInterval(speakInterval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPos({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed z-[9990] select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className="border rounded-lg overflow-hidden shadow-2xl"
        style={{
          borderColor: agent.color_primary,
          boxShadow: `0 0 20px ${agent.color_primary}40`,
          background: 'rgba(0,0,0,0.95)',
          width: minimized ? 48 : 96,
        }}
      >
        <div
          className="flex items-center justify-between px-1.5 py-0.5 cursor-move"
          style={{ background: `${agent.color_primary}20`, borderBottom: `1px solid ${agent.color_primary}40` }}
          onMouseDown={handleMouseDown}
        >
          <span className="text-xs font-bold truncate" style={{ color: agent.color_primary, maxWidth: minimized ? 0 : 60, overflow: 'hidden' }}>
            {!minimized && agent.display_name.split(' ')[0]}
          </span>
          <div className="flex gap-0.5 shrink-0">
            <button onClick={() => setMinimized(!minimized)} className="text-gray-600 hover:text-gray-400">
              {minimized ? <Maximize2 className="w-2.5 h-2.5" /> : <Minimize2 className="w-2.5 h-2.5" />}
            </button>
            <button onClick={() => setVisible(false)} className="text-gray-600 hover:text-red-400">
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="flex flex-col items-center p-1">
            <div className="relative">
              <AgentFace agent={agent} speaking={speaking} />
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <SigilMark size={16} color={agent.color_primary} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <div
                className={`w-1 h-1 rounded-full ${speaking ? 'animate-pulse' : ''}`}
                style={{ background: speaking ? agent.color_primary : '#374151' }}
              />
              <span className="text-xs" style={{ color: agent.color_primary + '80' }}>
                {speaking ? 'SPEAK' : '...' }
              </span>
            </div>
          </div>
        )}

        {minimized && (
          <div className="flex items-center justify-center p-1">
            <div className="w-5 h-5 rounded-full border animate-pulse" style={{ borderColor: agent.color_primary }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentPiP({ agentSlug }: AgentPiPProps) {
  const [agents, setAgents] = useState<SentientAgent[]>([]);

  useEffect(() => {
    getAllAgents().then(data => {
      setAgents(agentSlug ? data.filter(a => a.slug === agentSlug) : data.slice(0, 3));
    });
  }, [agentSlug]);

  return (
    <>
      {agents.map((agent, i) => (
        <div key={agent.slug} style={{ transform: `translateY(${i * 130}px)` }}>
          <SingleAgentPiP agent={agent} />
        </div>
      ))}
    </>
  );
}
