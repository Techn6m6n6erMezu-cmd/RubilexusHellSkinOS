import { useEffect, useRef, useState, useCallback } from 'react';
import { Gamepad2, RefreshCw, Zap, Trophy, ChevronRight } from 'lucide-react';

const CANVAS_W = 560;
const CANVAS_H = 320;
const PLAYER_SIZE = 20;
const PLAYER_SPEED = 3.5;
const GRID_SIZE = 32;
const COIN_RADIUS = 7;
const COIN_COUNT = 8;
const PARTICLE_MAX = 60;

interface Vec2 { x: number; y: number; }
interface Coin { id: number; x: number; y: number; pulse: number; collected: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }

function randCoinPos(exclude: Vec2[]): Vec2 {
  let pos: Vec2;
  let tries = 0;
  do {
    pos = {
      x: COIN_RADIUS * 2 + Math.random() * (CANVAS_W - COIN_RADIUS * 4),
      y: COIN_RADIUS * 2 + Math.random() * (CANVAS_H - COIN_RADIUS * 4),
    };
    tries++;
  } while (tries < 30 && exclude.some(e => Math.hypot(e.x - pos.x, e.y - pos.y) < 60));
  return pos;
}

function spawnCoins(count: number): Coin[] {
  const coins: Coin[] = [];
  for (let i = 0; i < count; i++) {
    const p = randCoinPos(coins.map(c => ({ x: c.x, y: c.y })));
    coins.push({ id: i, x: p.x, y: p.y, pulse: Math.random() * Math.PI * 2, collected: false });
  }
  return coins;
}

export default function GameStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    player: { x: CANVAS_W / 2 - PLAYER_SIZE / 2, y: CANVAS_H / 2 - PLAYER_SIZE / 2 },
    velocity: { x: 0, y: 0 },
    keys: new Set<string>(),
    coins: spawnCoins(COIN_COUNT),
    particles: [] as Particle[],
    score: 0,
    highScore: parseInt(localStorage.getItem('game_studio_hs') || '0'),
    frame: 0,
    glow: 0,
    running: false,
    coinIdCounter: COIN_COUNT,
  });
  const rafRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('game_studio_hs') || '0'));
  const [started, setStarted] = useState(false);
  const [fps, setFps] = useState(60);
  const fpsRef = useRef({ last: performance.now(), frames: 0, display: 60 });

  const addParticle = useCallback((x: number, y: number) => {
    const s = stateRef.current;
    for (let i = 0; i < 3; i++) {
      if (s.particles.length >= PARTICLE_MAX) s.particles.shift();
      s.particles.push({
        x: x + PLAYER_SIZE / 2,
        y: y + PLAYER_SIZE / 2,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        size: 2 + Math.random() * 3,
      });
    }
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#0a1a0a';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= CANVAS_W; x += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
  }, []);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, p: Vec2, glow: number) => {
    const cx = p.x + PLAYER_SIZE / 2;
    const cy = p.y + PLAYER_SIZE / 2;
    const glowSize = 12 + Math.sin(glow * 0.08) * 4;

    const radial = ctx.createRadialGradient(cx, cy, 2, cx, cy, glowSize * 2);
    radial.addColorStop(0, 'rgba(34,197,94,0.25)');
    radial.addColorStop(1, 'rgba(34,197,94,0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(cx, cy, glowSize * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = glowSize;
    ctx.shadowColor = '#22c55e';
    ctx.fillStyle = '#22c55e';
    const r = 3;
    const x = p.x, y = p.y, w = PLAYER_SIZE, h = PLAYER_SIZE;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x + 4, p.y + 4, PLAYER_SIZE - 8, PLAYER_SIZE - 8);
  }, []);

  const drawCoins = useCallback((ctx: CanvasRenderingContext2D, coins: Coin[], frame: number) => {
    coins.forEach(coin => {
      if (coin.collected) return;
      const pulse = Math.sin(frame * 0.04 + coin.pulse) * 2;
      const r = COIN_RADIUS + pulse * 0.5;

      ctx.shadowBlur = 10 + pulse * 2;
      ctx.shadowColor = '#f59e0b';

      const g = ctx.createRadialGradient(coin.x, coin.y, 1, coin.x, coin.y, r);
      g.addColorStop(0, '#fde68a');
      g.addColorStop(0.6, '#f59e0b');
      g.addColorStop(1, '#d97706');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = '#22c55e';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#22c55e';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    const now = performance.now();
    fpsRef.current.frames++;
    if (now - fpsRef.current.last >= 500) {
      fpsRef.current.display = Math.round(fpsRef.current.frames / ((now - fpsRef.current.last) / 1000));
      fpsRef.current.frames = 0;
      fpsRef.current.last = now;
      setFps(fpsRef.current.display);
    }

    s.frame++;
    s.glow++;

    let dx = 0, dy = 0;
    if (s.keys.has('ArrowLeft') || s.keys.has('a') || s.keys.has('A')) dx -= 1;
    if (s.keys.has('ArrowRight') || s.keys.has('d') || s.keys.has('D')) dx += 1;
    if (s.keys.has('ArrowUp') || s.keys.has('w') || s.keys.has('W')) dy -= 1;
    if (s.keys.has('ArrowDown') || s.keys.has('s') || s.keys.has('S')) dy += 1;

    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

    s.velocity.x = s.velocity.x * 0.8 + dx * PLAYER_SPEED * 0.2;
    s.velocity.y = s.velocity.y * 0.8 + dy * PLAYER_SPEED * 0.2;

    s.player.x = Math.max(0, Math.min(CANVAS_W - PLAYER_SIZE, s.player.x + s.velocity.x));
    s.player.y = Math.max(0, Math.min(CANVAS_H - PLAYER_SIZE, s.player.y + s.velocity.y));

    if (Math.abs(s.velocity.x) > 0.3 || Math.abs(s.velocity.y) > 0.3) {
      addParticle(s.player.x, s.player.y);
    }

    s.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.94; p.vy *= 0.94;
      p.life -= 0.016;
    });
    s.particles = s.particles.filter(p => p.life > 0);

    const pcx = s.player.x + PLAYER_SIZE / 2;
    const pcy = s.player.y + PLAYER_SIZE / 2;
    let collected = false;
    s.coins.forEach(coin => {
      if (coin.collected) return;
      if (Math.hypot(pcx - coin.x, pcy - coin.y) < PLAYER_SIZE / 2 + COIN_RADIUS - 2) {
        coin.collected = true;
        s.score++;
        collected = true;
        for (let i = 0; i < 8; i++) {
          s.particles.push({
            x: coin.x, y: coin.y,
            vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
            life: 1, maxLife: 1, size: 3 + Math.random() * 4,
          });
        }
      }
    });

    if (collected) {
      setScore(s.score);
      if (s.score > s.highScore) {
        s.highScore = s.score;
        localStorage.setItem('game_studio_hs', String(s.score));
        setHighScore(s.score);
      }
      const id = ++s.coinIdCounter;
      const pos = randCoinPos(s.coins.filter(c => !c.collected).map(c => ({ x: c.x, y: c.y })));
      s.coins.push({ id, x: pos.x, y: pos.y, pulse: Math.random() * Math.PI * 2, collected: false });
    }

    ctx.fillStyle = '#02050a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawGrid(ctx);
    drawParticles(ctx, s.particles);
    drawCoins(ctx, s.coins, s.frame);
    drawPlayer(ctx, s.player, s.glow);

    ctx.fillStyle = '#22c55e60';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`SCORE: ${s.score}`, 10, 18);
    ctx.fillText(`HI: ${s.highScore}`, 10, 32);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [addParticle, drawGrid, drawPlayer, drawCoins, drawParticles]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.player = { x: CANVAS_W / 2 - PLAYER_SIZE / 2, y: CANVAS_H / 2 - PLAYER_SIZE / 2 };
    s.velocity = { x: 0, y: 0 };
    s.coins = spawnCoins(COIN_COUNT);
    s.particles = [];
    s.score = 0;
    s.frame = 0;
    s.glow = 0;
    s.running = true;
    setScore(0);
    setStarted(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key)) {
        e.preventDefault();
        stateRef.current.keys.add(e.key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => stateRef.current.keys.delete(e.key);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#02050a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = '#0a1a0a';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= CANVAS_W; x += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
    ctx.fillStyle = '#22c55e30';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS START TO INITIALIZE', CANVAS_W / 2, CANVAS_H / 2);
    ctx.textAlign = 'left';
  }, []);

  return (
    <div
      className="rounded-xl border overflow-hidden flex flex-col"
      style={{ background: '#02050a', borderColor: '#052e16' }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 border-b"
        style={{ borderColor: '#052e16', background: '#030e06' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ background: '#052e1640', borderColor: '#22c55e40' }}
        >
          <Gamepad2 className="w-4 h-4" style={{ color: '#22c55e' }} />
        </div>
        <div>
          <div className="font-bold tracking-widest" style={{ color: '#e5e7eb', fontSize: 11 }}>GAME STUDIO</div>
          <div style={{ color: '#22c55e40', fontSize: 8 }}>60FPS CANVAS ENGINE — HAEZARIAN WASM FOUNDATION</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" style={{ color: started ? '#22c55e' : '#374151' }} />
            <span style={{ color: started ? '#22c55e' : '#374151', fontSize: 9 }}>{fps} FPS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3" style={{ color: '#f59e0b' }} />
            <span style={{ color: '#f59e0b', fontSize: 9 }}>HI: {highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center p-4" style={{ background: '#020508' }}>
        <div style={{ position: 'relative', lineHeight: 0 }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="rounded-lg block"
            style={{
              border: '1px solid #052e16',
              boxShadow: started ? '0 0 32px #22c55e18, 0 0 1px #22c55e60' : '0 0 16px #00000080',
              maxWidth: '100%',
              imageRendering: 'pixelated',
            }}
          />
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background: '#02050a80' }}>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all hover:scale-[1.04] active:scale-[0.98]"
                style={{ background: '#052e16', border: '2px solid #22c55e', color: '#22c55e', fontSize: 13, boxShadow: '0 0 24px #22c55e30' }}
              >
                <ChevronRight className="w-5 h-5" />
                START ENGINE
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-between px-5 py-2 border-t"
        style={{ borderColor: '#052e16', background: '#020508' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: '#22c55e' }} />
            <span style={{ color: '#22c55e80', fontSize: 8 }}>PLAYER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
            <span style={{ color: '#f59e0b80', fontSize: 8 }}>COINS</span>
          </div>
          <span style={{ color: '#374151', fontSize: 8 }}>WASD / ARROWS TO MOVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: '#22c55e80', fontSize: 9, fontWeight: 700 }}>SCORE: {score}</span>
          {started && (
            <button
              onClick={startGame}
              className="flex items-center gap-1 px-2 py-1 rounded border hover:opacity-80 transition-opacity"
              style={{ borderColor: '#1f2937', color: '#374151', fontSize: 8 }}
            >
              <RefreshCw className="w-2.5 h-2.5" />
              RESET
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
