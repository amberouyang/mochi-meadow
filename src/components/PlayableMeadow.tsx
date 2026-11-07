import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import meadowUrl from '../assets/meadow-background.png';
import { MeadowLighting } from './MeadowLighting';

type DustPuffData = {
  id: number;
  x: number;
  y: number;
  scale: number;
  flip: boolean;
};

function DustPuff({
  x,
  y,
  scale = 1,
  flip = false,
  onEnd,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  onEnd: () => void;
}) {
  return (
    <div
      className="meadow-dust-puff"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        ['--dust-flip' as string]: flip ? '-1' : '1',
        ['--dust-scale' as string]: `${scale}`,
      }}
      onAnimationEnd={onEnd}
      aria-hidden
    >
      <svg viewBox="0 0 16 12" className="meadow-dust-svg" shapeRendering="crispEdges">
        <rect x="2" y="9" width="10" height="2" fill="#8c754d" opacity="0.4" />
        <rect x="1" y="6" width="3" height="3" fill="#cfbd94" />
        <rect x="4" y="5" width="8" height="5" fill="#e8dac0" />
        <rect x="12" y="7" width="3" height="3" fill="#cfbd94" />
        <rect x="5" y="2" width="5" height="4" fill="#f7f0e0" />
        <rect x="6" y="3" width="2" height="2" fill="#ffffff" />
        <rect x="10" y="4" width="3" height="3" fill="#f7f0e0" />
        <rect x="3" y="4" width="2" height="2" fill="#f7f0e0" />
      </svg>
    </div>
  );
}

export type MeadowPlayerPos = { x: number; y: number };

type PlayableMeadowProps = {
  children: (playerPos: MeadowPlayerPos) => ReactNode;
};

const START_POS: MeadowPlayerPos = { x: 50, y: 58 };
const BOUNDS = { minX: 9, maxX: 91, minY: 24, maxY: 88 };

function clampPos(pos: MeadowPlayerPos): MeadowPlayerPos {
  return {
    x: Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, pos.x)),
    y: Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, pos.y)),
  };
}

function PixelBush({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} shapeRendering="crispEdges">
      <rect x="-38" y="16" width="76" height="8" fill="#4f8a4f" opacity="0.3" />
      <rect x="-30" y="-2" width="60" height="20" fill="#67b768" />
      <rect x="-18" y="-14" width="38" height="14" fill="#79c978" />
      <rect x="-24" y="-8" width="10" height="6" fill="#d9ffd2" />
      <rect x="10" y="-4" width="8" height="5" fill="#d9ffd2" />
    </g>
  );
}

function FarmPlot({ x, y, scale = 1, flip = false }: { x: number; y: number; scale?: number; flip?: boolean }) {
  const rows = [0, 1, 2, 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} shapeRendering="crispEdges">
      {/* fence */}
      <rect x="-104" y="-30" width="208" height="7" fill="#b98256" />
      <rect x="-104" y="-16" width="208" height="6" fill="#a06a42" />
      {[-96, -48, 0, 48, 96].map((fx) => (
        <rect key={fx} x={fx - 4} y="-38" width="8" height="34" fill="#8b5a32" />
      ))}
      {/* soil bed */}
      <rect x="-96" y="0" width="192" height="104" fill="#9b6b43" />
      <rect x="-96" y="0" width="192" height="10" fill="#b98256" />
      {rows.map((row) => (
        <g key={row}>
          <rect x="-84" y={18 + row * 22} width="168" height="7" fill="#6f472b" />
          {[-68, -34, 0, 34, 68].map((cx) => (
            <g key={cx}>
              <rect x={cx - 2} y={10 + row * 22} width="4" height="12" fill="#4f9b57" />
              <rect x={cx - 7} y={13 + row * 22} width="14" height="4" fill="#67bd6d" />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function FlowerPatch({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const flowers = [
    [0, 0, '#ff8fb5'],
    [22, 8, '#ffffff'],
    [44, 0, '#ffb45e'],
    [12, 18, '#ffffff'],
    [34, 19, '#ff8fb5'],
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} shapeRendering="crispEdges">
      {flowers.map(([fx, fy, color], i) => (
        <g key={i} transform={`translate(${fx} ${fy})`}>
          <rect x="-1" y="0" width="2" height="9" fill="#4f8a4f" />
          <rect x="-5" y="-7" width="10" height="7" fill={color} />
          <rect x="-2" y="-5" width="4" height="3" fill="#ffd94d" />
        </g>
      ))}
    </g>
  );
}

export function MeadowBackdrop() {
  return (
    <>
      <img src={meadowUrl} alt="" className="meadow-original-bg" draggable={false} />
      <svg className="meadow-game-backdrop" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {/* Farm plots tucked into both sides, echoing the original meadow art */}
        <FarmPlot x={148} y={302} scale={0.62} />
        <FarmPlot x={852} y={302} scale={0.62} flip />

        <PixelBush x={92} y={206} scale={0.85} />
        <PixelBush x={914} y={206} scale={0.88} />
        <PixelBush x={330} y={548} scale={0.78} />
        <PixelBush x={676} y={548} scale={0.8} />

        <FlowerPatch x={104} y={238} />
        <FlowerPatch x={852} y={238} flip />
        <FlowerPatch x={282} y={462} />
        <FlowerPatch x={676} y={462} flip />

        {/* scattered petals on grass */}
        <g fill="#ffc7da" opacity="0.8" shapeRendering="crispEdges">
          <rect x="238" y="224" width="11" height="6" />
          <rect x="692" y="260" width="10" height="5" />
          <rect x="348" y="420" width="10" height="5" />
          <rect x="646" y="430" width="11" height="6" />
          <rect x="486" y="198" width="8" height="5" />
        </g>
      </svg>
    </>
  );
}

function PlayerAvatar({ name, facing, walking }: { name: string; facing: 'left' | 'right'; walking: boolean }) {
  return (
    <div className={`meadow-player${walking ? ' is-walking' : ''}`} data-facing={facing} aria-label={`${name} avatar`}>
      <svg viewBox="0 0 48 58" className="meadow-player-svg" shapeRendering="crispEdges" aria-hidden>
        <rect x="10" y="52" width="28" height="4" fill="#4f7d43" opacity="0.35" />
        <g className="meadow-player-body">
          {/* shoes + legs */}
          <rect x="17" y="45" width="6" height="7" fill="#405a7a" />
          <rect x="25" y="45" width="6" height="7" fill="#405a7a" />
          <rect x="15" y="51" width="9" height="4" fill="#5a3428" />
          <rect x="24" y="51" width="9" height="4" fill="#5a3428" />
          {/* small top-down game outfit */}
          <rect x="14" y="30" width="20" height="16" fill="#63b7a6" />
          <rect x="14" y="30" width="20" height="4" fill="#8fd0c2" />
          <rect x="21" y="34" width="6" height="5" fill="#fff6d8" />
          <rect x="22" y="41" width="4" height="4" fill="#ffd94d" />
          <rect x="9" y="32" width="5" height="11" fill="#f2b98a" />
          <rect x="34" y="32" width="5" height="11" fill="#f2b98a" />
          {/* head: mostly dark hair from above, like a tiny map sprite */}
          <rect x="13" y="9" width="22" height="22" fill="#ffd9ae" />
          <rect x="11" y="3" width="26" height="9" fill="#4a2e26" />
          <rect x="9" y="10" width="30" height="9" fill="#4a2e26" />
          <rect x="11" y="19" width="6" height="9" fill="#4a2e26" />
          <rect x="31" y="19" width="6" height="9" fill="#4a2e26" />
          <rect x="18" y="12" width="5" height="4" fill="#6b4636" />
          {/* face peeking under hair */}
          <rect x="18" y="25" width="3" height="4" fill="#2a1d18" />
          <rect x="27" y="25" width="3" height="4" fill="#2a1d18" />
          <rect x="15" y="29" width="5" height="3" fill="#ffabbb" opacity="0.8" />
          <rect x="28" y="29" width="5" height="3" fill="#ffabbb" opacity="0.8" />
        </g>
      </svg>
      <span className="meadow-player-name">{name || 'Friend'}</span>
    </div>
  );
}

export function PlayableMeadow({ children }: PlayableMeadowProps) {
  const playerName = useStore((s) => s.playerName);
  const [playerPos, setPlayerPos] = useState<MeadowPlayerPos>(START_POS);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [walking, setWalking] = useState(false);
  const [dustPuffs, setDustPuffs] = useState<DustPuffData[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const targetRef = useRef<MeadowPlayerPos | null>(null);
  const posRef = useRef(playerPos);
  const lastPuffTimeRef = useRef(0);
  const puffIdRef = useRef(0);
  posRef.current = playerPos;

  const handleRemovePuff = useCallback((id: number) => {
    setDustPuffs((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        event.preventDefault();
        keysRef.current.add(key);
        targetRef.current = null;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };
    const onBlur = () => keysRef.current.clear();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;
      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;

      const current = posRef.current;
      let next = current;

      if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy) || 1;
        next = clampPos({
          x: current.x + (dx / length) * 24 * dt,
          y: current.y + (dy / length) * 20 * dt,
        });
        if (dx !== 0) setFacing(dx < 0 ? 'left' : 'right');
        setWalking(true);

        if (now - lastPuffTimeRef.current > 155) {
          lastPuffTimeRef.current = now;
          puffIdRef.current += 1;
          const puffOffsetX = dx !== 0 ? (dx > 0 ? -1.5 : 1.5) : (facing === 'right' ? -1.5 : 1.5);
          const newPuff: DustPuffData = {
            id: puffIdRef.current,
            x: next.x + puffOffsetX + (Math.random() * 0.4 - 0.2),
            y: next.y - 0.2 + (Math.random() * 0.3 - 0.15),
            scale: 0.85 + Math.random() * 0.3,
            flip: Math.random() > 0.5,
          };
          setDustPuffs((prev) => [...prev.slice(-14), newPuff]);
        }
      } else if (targetRef.current) {
        const target = targetRef.current;
        const tx = target.x - current.x;
        const ty = target.y - current.y;
        const distance = Math.hypot(tx, ty);
        if (distance < 1.2) {
          targetRef.current = null;
          setWalking(false);
        } else {
          const stepX = (tx / distance) * 22 * dt;
          const stepY = (ty / distance) * 19 * dt;
          next = clampPos({ x: current.x + stepX, y: current.y + stepY });
          if (Math.abs(tx) > 0.4) setFacing(tx < 0 ? 'left' : 'right');
          setWalking(true);

          if (now - lastPuffTimeRef.current > 155) {
            lastPuffTimeRef.current = now;
            puffIdRef.current += 1;
            const puffOffsetX = tx > 0 ? -1.5 : 1.5;
            const newPuff: DustPuffData = {
              id: puffIdRef.current,
              x: next.x + puffOffsetX + (Math.random() * 0.4 - 0.2),
              y: next.y - 0.2 + (Math.random() * 0.3 - 0.15),
              scale: 0.85 + Math.random() * 0.3,
              flip: Math.random() > 0.5,
            };
            setDustPuffs((prev) => [...prev.slice(-14), newPuff]);
          }
        }
      } else {
        setWalking(false);
      }

      if (next !== current && (next.x !== current.x || next.y !== current.y)) {
        posRef.current = next;
        setPlayerPos(next);
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSceneClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    targetRef.current = clampPos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="meadow-game-scene" onClick={handleSceneClick} role="application" aria-label="Playable meadow. Use WASD or arrow keys to walk.">
      <MeadowBackdrop />
      <MeadowLighting />
      <div className="meadow-game-sign" aria-hidden>
        <span>{playerName ? `${playerName}'s Meadow` : 'Mochi Meadow'}</span>
      </div>
      <div className="meadow-move-hint" aria-hidden>
        <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span>
        <span>to move</span>
      </div>

      {/* Walking dust puffs */}
      {dustPuffs.map((puff) => (
        <DustPuff
          key={puff.id}
          x={puff.x}
          y={puff.y}
          scale={puff.scale}
          flip={puff.flip}
          onEnd={() => handleRemovePuff(puff.id)}
        />
      ))}

      {children(playerPos)}

      <div
        className="meadow-player-anchor"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
      >
        <PlayerAvatar name={playerName} facing={facing} walking={walking} />
      </div>
    </div>
  );
}
