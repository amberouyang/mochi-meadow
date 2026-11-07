import { useEffect, useRef, useState } from 'react';
import type { Pet } from '../types';
import { MochiBunny } from './MochiBunny';
import { MochiCloud } from './MochiCloud';
import { petLevelProgress } from '../utils/gamification';

function isBunnyPet(pet: Pet) {
  return pet.kind === 'bunny' || /bunny/i.test(pet.name);
}

type MeadowPetProps = {
  pet: Pet;
  points: number;
  canWander: boolean;
  /** Player position in left/bottom %; pets trail behind while exploring. */
  followTarget?: Pos;
  /** Stagger bob/blink so pets don’t move in sync */
  animOffset: number;
  sick?: boolean;
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

const FOLLOW_OFFSETS: Pos[] = [
  { x: -8, y: -5 },
  { x: 8, y: -6 },
  { x: -11, y: 2 },
  { x: 11, y: 1 },
  { x: 0, y: -10 },
];

export function MeadowPet({
  pet,
  points,
  canWander,
  followTarget,
  animOffset,
  sick = false,
  onFeed,
}: MeadowPetProps) {
  const [pos, setPos] = useState<Pos>(() => randomPos());
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [selected, setSelected] = useState(false);
  const [hop, setHop] = useState(false);
  const posRef = useRef(pos);
  const hopTimeoutRef = useRef<number | null>(null);
  posRef.current = pos;

  const bunny = isBunnyPet(pet);

  const triggerHop = () => {
    setHop(true);
    if (hopTimeoutRef.current != null) {
      window.clearTimeout(hopTimeoutRef.current);
    }
    hopTimeoutRef.current = window.setTimeout(() => {
      hopTimeoutRef.current = null;
      setHop(false);
    }, bunny ? 520 : 450);
  };

  useEffect(() => {
    if (!canWander || sick) return;

    if (followTarget) {
      const offset = FOLLOW_OFFSETS[animOffset % FOLLOW_OFFSETS.length];
      const target = {
        x: Math.min(92, Math.max(8, followTarget.x + offset.x)),
        y: Math.min(52, Math.max(7, followTarget.y + offset.y)),
      };
      const current = posRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      if (Math.hypot(dx, dy) < 1.4) return;
      const id = window.setTimeout(() => {
        setFacing(dx < 0 ? 'left' : 'right');
        setPos({
          x: current.x + dx * (bunny ? 0.55 : 0.42),
          y: current.y + dy * (bunny ? 0.55 : 0.42),
        });
        if (bunny) triggerHop();
      }, bunny ? 70 + animOffset * 50 : 90 + animOffset * 70);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    let timeoutId = 0;

    const schedule = () => {
      const idleMs = bunny ? 1400 + Math.random() * 2200 : 2800 + Math.random() * 4200;
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const current = posRef.current;
        const next = randomPos(current);
        setFacing(next.x < current.x ? 'left' : 'right');
        setPos(next);
        if (bunny) triggerHop();
        schedule();
      }, idleMs);
    };

    timeoutId = window.setTimeout(schedule, 800 + animOffset * 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [canWander, sick, animOffset, followTarget, bunny]);

  useEffect(() => {
    return () => {
      if (hopTimeoutRef.current != null) {
        window.clearTimeout(hopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selected || !sick) return;
    const id = window.setTimeout(() => setSelected(false), 2000);
    return () => window.clearTimeout(id);
  }, [selected, sick]);

  const handleFeed = () => {
    if (sick || points < 5) return;
    onFeed();
    triggerHop();
  };

  const bobDuration = `${1.25 + animOffset * 0.22}s`;
  const blinkDuration = `${3.6 + animOffset * 0.7}s`;
  const breatheDuration = `${2.4 + (animOffset % 3) * 0.35}s`;
  const breatheDelay = `${(animOffset * 0.45) % 1.6}s`;
  const moodClass = sick ? 'pet-sad' : `pet-${pet.mood}`;
  const levelProgress = petLevelProgress(pet);

  return (
    <div
      className={`meadow-pet ${moodClass}${selected ? ' is-selected' : ''}${hop ? ' is-hop' : ''}${sick ? ' is-sick' : ''}${bunny ? ' is-bunny' : ''}`}
      data-facing={facing}
      style={{
        left: `${pos.x}%`,
        bottom: `${pos.y}%`,
        ['--pet-bob-dur' as string]: bobDuration,
        ['--pet-blink-dur' as string]: blinkDuration,
        ['--pet-blink-delay' as string]: `${animOffset * 0.35}s`,
        ['--pet-breathe-dur' as string]: breatheDuration,
        ['--pet-breathe-delay' as string]: breatheDelay,
      }}
      onMouseEnter={() => !sick && setSelected(true)}
      onMouseLeave={() => setSelected(false)}
    >
      <button
        type="button"
        className="meadow-pet-hit"
        aria-label={sick ? `${pet.name} says I'm sick` : `${pet.name}. Click for options.`}
        onClick={() => setSelected((s) => !s)}
        onFocus={() => !sick && setSelected(true)}
      >
        <div className="meadow-pet-bob">
          <div className="meadow-pet-mochi">
            {bunny ? <MochiBunny /> : <MochiCloud />}
          </div>
        </div>
        <span className="meadow-pet-name">{pet.name}</span>
      </button>

      {selected && (
        <div
          className={`meadow-pet-bubble${sick ? ' is-sick-bubble' : ''}`}
          role="dialog"
          aria-label={sick ? `${pet.name} says I'm sick` : `${pet.name} care`}
        >
          {sick ? (
            <p className="meadow-pet-sick-note">I&apos;m sick :(</p>
          ) : (
            <>
              <p className="meadow-pet-level">Lv. {pet.level} · {levelProgress.experience}/{levelProgress.required} sparkle</p>
              <div className="meadow-pet-xp" aria-label={`${levelProgress.percent}% to next level`}>
                <div style={{ width: `${levelProgress.percent}%` }} />
              </div>
              <div className="meadow-pet-energy" aria-label={`Energy ${pet.energy}%`}>
                <div className="meadow-pet-energy-bar" style={{ width: `${pet.energy}%` }} />
              </div>
              <button
                type="button"
                className="meadow-pet-feed"
                disabled={points < 5}
                onClick={handleFeed}
              >
                Feed (5 pts)
              </button>
              <button
                type="button"
                className="meadow-pet-close"
                onClick={() => setSelected(false)}
                aria-label="Close"
              >
                ×
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
