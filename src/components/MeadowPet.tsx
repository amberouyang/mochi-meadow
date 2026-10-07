import { useEffect, useRef, useState } from 'react';
import type { Pet } from '../types';
import { MochiCloud } from './MochiCloud';

type MeadowPetProps = {
  pet: Pet;
  points: number;
  canWander: boolean;
  /** Stagger bob/blink so pets don’t move in sync */
  animOffset: number;
  onFeed: () => void;
};

type Pos = { x: number; y: number };

function randomPos(avoid?: Pos): Pos {
  let next: Pos = {
    x: 12 + Math.random() * 76,
    y: 10 + Math.random() * 22,
  };
  // Prefer a spot that’s not almost on top of the last one
  if (avoid) {
    for (let i = 0; i < 6; i++) {
      const dx = next.x - avoid.x;
      const dy = next.y - avoid.y;
      if (dx * dx + dy * dy > 120) break;
      next = {
        x: 12 + Math.random() * 76,
        y: 10 + Math.random() * 22,
      };
    }
  }
  return next;
}

export function MeadowPet({ pet, points, canWander, animOffset, onFeed }: MeadowPetProps) {
  const [pos, setPos] = useState<Pos>(() => randomPos());
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [selected, setSelected] = useState(false);
  const [hop, setHop] = useState(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  useEffect(() => {
    if (!canWander) return;

    let cancelled = false;
    let timeoutId = 0;

    const schedule = () => {
      const idleMs = 2800 + Math.random() * 4200;
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const current = posRef.current;
        const next = randomPos(current);
        setFacing(next.x < current.x ? 'left' : 'right');
        setPos(next);
        schedule();
      }, idleMs);
    };

    timeoutId = window.setTimeout(schedule, 800 + animOffset * 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [canWander, animOffset]);

  const handleFeed = () => {
    if (points < 5) return;
    onFeed();
    setHop(true);
    window.setTimeout(() => setHop(false), 450);
  };

  const bobDuration = `${1.25 + animOffset * 0.22}s`;
  const blinkDuration = `${3.6 + animOffset * 0.7}s`;

  return (
    <div
      className={`meadow-pet pet-${pet.mood}${selected ? ' is-selected' : ''}${hop ? ' is-hop' : ''}${canWander ? '' : ' is-paused'}`}
      data-facing={facing}
      style={{
        left: `${pos.x}%`,
        bottom: `${pos.y}%`,
        ['--pet-bob-dur' as string]: bobDuration,
        ['--pet-blink-dur' as string]: blinkDuration,
        ['--pet-blink-delay' as string]: `${animOffset * 0.35}s`,
      }}
    >
      <button
        type="button"
        className="meadow-pet-hit"
        aria-label={`${pet.name}. Click for options.`}
        onClick={() => setSelected((s) => !s)}
      >
        <div className="meadow-pet-bob">
          <div className="meadow-pet-mochi">
            <MochiCloud />
          </div>
        </div>
        <span className="meadow-pet-name">{pet.name}</span>
      </button>

      {selected && (
        <div className="meadow-pet-bubble" role="dialog" aria-label={`${pet.name} care`}>
          <div className="meadow-pet-energy" aria-label={`Energy ${pet.energy}%`}>
            <div className="meadow-pet-energy-bar" style={{ width: `${pet.energy}%` }} />
          </div>
          <button
            type="button"
            className="meadow-pet-feed"
            disabled={points < 5}
            onClick={handleFeed}
          >
            Feed (5 pts) 🍡
          </button>
          <button
            type="button"
            className="meadow-pet-close"
            onClick={() => setSelected(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
