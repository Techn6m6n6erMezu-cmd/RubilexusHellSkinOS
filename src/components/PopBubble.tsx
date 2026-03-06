import { useState, useEffect, useRef } from 'react';
import { X, Send, Minus } from 'lucide-react';
import { getBubbleConfig } from '../services/solessService';

type BubbleEntity = {
  id: string;
  name: string;
  color: string;
  initials: string;
  status: 'online' | 'busy' | 'idle';
};

type ChatMessage = {
  id: string;
  from: 'user' | 'entity';
  text: string;
  ts: number;
};

const BUBBLE_ENTITIES: BubbleEntity[] = [
  { id: 'npc-iffy', name: 'IFFY-9', color: '#ef4444', initials: 'IF', status: 'online' },
  { id: 'npc-kado', name: 'KADO', color: '#f97316', initials: 'KD', status: 'idle' },
  { id: 'npc-lyria', name: 'LYRIA 3', color: '#3b82f6', initials: 'LY', status: 'busy' },
  { id: 'ai-council', name: 'COUNCIL', color: '#eab308', initials: 'SC', status: 'online' },
];

const ENTITY_REPLIES: Record<string, string[]> = {
  'npc-iffy': [
    'Surveillance confirmed. All sectors nominal.',
    'Your presence has been logged.',
    'System integrity: 99.66%',
    'I see everything in this world.',
  ],
  'npc-kado': [
    'Got a new kard cooking. Fire stuff.',
    'Ink and soul. That is the formula.',
    'Come by the Stable. New drops incoming.',
    'The Void Rider series is almost done.',
  ],
  'npc-lyria': [
    'Track render complete. Sending waveform.',
    'The frequency matches your soul signature.',
    'BPM synced. Production engaged.',
    'Music is just organized darkness.',
  ],
  'ai-council': [
    'The council has deliberated. Verdict: proceed.',
    'Seven voices. One truth.',
    'Your request is acknowledged.',
    'Order is maintained. The world persists.',
  ],
};

function useDrag(initialPos: { x: number; y: number }) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const start = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    start.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPos({
      x: start.current.px + (e.clientX - start.current.mx),
      y: start.current.py + (e.clientY - start.current.my),
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  return { pos, onMouseDown };
}

function ChatWindow({
  entity,
  size,
  opacity,
  onClose,
}: {
  entity: BubbleEntity;
  size: number;
  opacity: number;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', from: 'entity', text: `${entity.name} connected.`, ts: Date.now() - 5000 },
  ]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const { pos, onMouseDown } = useDrag({ x: window.innerWidth - 320, y: window.innerHeight - 360 });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), from: 'user', text: input.trim(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const replies = ENTITY_REPLIES[entity.id] ?? ['...'];
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: 'entity',
        text: replies[Math.floor(Math.random() * replies.length)],
        ts: Date.now(),
      };
      setMessages(prev => [...prev, reply]);
    }, 800 + Math.random() * 1200);
  };

  const windowWidth = minimized ? 200 : 280;
  const windowHeight = minimized ? 40 : 320;

  return (
    <div
      className="fixed z-[9980] select-none rounded-xl overflow-hidden shadow-2xl border"
      style={{
        left: pos.x,
        top: pos.y,
        width: windowWidth,
        height: windowHeight,
        borderColor: entity.color + '60',
        background: `rgba(0,0,0,${opacity})`,
        boxShadow: `0 0 24px ${entity.color}30`,
        transition: 'width 0.2s, height 0.2s',
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-move select-none"
        style={{ background: entity.color + '20', borderBottom: `1px solid ${entity.color}30` }}
        onMouseDown={onMouseDown}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
          style={{ background: entity.color }}
        >
          {entity.initials.slice(0, 1)}
        </div>
        <span className="text-xs font-bold truncate flex-1" style={{ color: entity.color }}>
          {entity.name}
        </span>
        <div className="flex gap-1">
          <button onClick={() => setMinimized(!minimized)} className="text-gray-600 hover:text-gray-400">
            <Minus className="w-3 h-3" />
          </button>
          <button onClick={onClose} className="text-gray-600 hover:text-red-400">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5" style={{ height: 240 }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] px-2.5 py-1.5 rounded-xl text-xs leading-relaxed"
                  style={{
                    background: msg.from === 'entity' ? entity.color + '20' : '#374151',
                    color: msg.from === 'entity' ? entity.color : '#e5e7eb',
                    borderRadius: msg.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div
            className="flex items-center gap-1 px-2 py-2"
            style={{ borderTop: `1px solid ${entity.color}20` }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Message..."
              className="flex-1 bg-transparent text-white text-xs outline-none placeholder-gray-700"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="shrink-0"
              style={{ color: input.trim() ? entity.color : '#374151' }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FloatingBubble({
  entity,
  index,
  size,
  opacity,
  onOpen,
}: {
  entity: BubbleEntity;
  index: number;
  size: number;
  opacity: number;
  onOpen: () => void;
}) {
  const { pos, onMouseDown } = useDrag({
    x: 20 + index * (size + 12),
    y: window.innerHeight - size - 120,
  });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = entity.status === 'online' ? '#22c55e' : entity.status === 'busy' ? '#ef4444' : '#f59e0b';

  return (
    <div
      className="fixed z-[9970] cursor-pointer select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className="rounded-full flex items-center justify-center font-bold text-black relative"
        style={{
          width: size,
          height: size,
          background: entity.color,
          opacity,
          boxShadow: pulse ? `0 0 20px ${entity.color}80, 0 0 40px ${entity.color}40` : `0 4px 12px ${entity.color}40`,
          transition: 'box-shadow 0.3s',
          fontSize: size * 0.32,
        }}
        onMouseDown={onMouseDown}
        onClick={onOpen}
      >
        {entity.initials}
        <div
          className="absolute bottom-0.5 right-0.5 rounded-full border-2 border-black"
          style={{ width: size * 0.22, height: size * 0.22, background: statusColor }}
        />
      </div>
    </div>
  );
}

export default function PopBubble() {
  const [bubbleSize, setBubbleSize] = useState(48);
  const [bubbleOpacity, setBubbleOpacity] = useState(0.9);
  const [openChats, setOpenChats] = useState<string[]>([]);

  useEffect(() => {
    getBubbleConfig().then(cfg => {
      const sizeMap = { small: 36, medium: 48, large: 64 };
      setBubbleSize(sizeMap[cfg.bubble_size as keyof typeof sizeMap] ?? 48);
      setBubbleOpacity(cfg.bubble_opacity);
    });
  }, []);

  const openChat = (entityId: string) => {
    if (!openChats.includes(entityId)) {
      setOpenChats(prev => [...prev, entityId]);
    }
  };

  const closeChat = (entityId: string) => {
    setOpenChats(prev => prev.filter(id => id !== entityId));
  };

  return (
    <>
      {BUBBLE_ENTITIES.map((entity, i) => (
        <FloatingBubble
          key={entity.id}
          entity={entity}
          index={i}
          size={bubbleSize}
          opacity={bubbleOpacity}
          onOpen={() => openChat(entity.id)}
        />
      ))}
      {openChats.map(entityId => {
        const entity = BUBBLE_ENTITIES.find(e => e.id === entityId);
        if (!entity) return null;
        return (
          <ChatWindow
            key={entityId}
            entity={entity}
            size={bubbleSize}
            opacity={bubbleOpacity}
            onClose={() => closeChat(entityId)}
          />
        );
      })}
    </>
  );
}
