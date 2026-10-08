import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { MochiCloud } from './MochiCloud';
import './EggSanctuary.css';

type NestSlot = {
  id: string;
  name: string;
  unlocked: boolean;
  hint: string;
};

export function EggSanctuary() {
  const eggProgress = useStore((s) => s.eggProgress);
  const eggHatched = useStore((s) => s.eggHatched);
  const pets = useStore((s) => s.pets);
  const storeEggOptions = useStore((s) => s.storeEggOptions);
  const lastEggChoiceName = useStore((s) => s.lastEggChoiceName);
  const tutorialStage = useStore((s) => s.tutorialStage);
  const playerName = useStore((s) => s.playerName);

  const pct = Math.round((eggProgress / 1000) * 100);
  const mochiMovedIn =
    tutorialStage === 'mochiReveal' ||
    tutorialStage === 'showSanctuaryArrow' ||
    tutorialStage === 'done';

  const slots: NestSlot[] = useMemo(() => {
    const ownedNames = new Set(pets.map((p) => p.name.toLowerCase()));
    if (lastEggChoiceName) ownedNames.add(lastEggChoiceName.toLowerCase());

    const starter: NestSlot = {
      id: 'starter',
      name: pets[0]?.name || 'Mochi',
      unlocked: mochiMovedIn,
      hint: 'Shows up after the meadow is cleaned',
    };

    const fromStore: NestSlot[] = storeEggOptions.map((egg) => ({
      id: egg.id,
      name: egg.name,
      unlocked: ownedNames.has(egg.name.toLowerCase()),
      hint: egg.description,
    }));

    // Extra mystery slots for later collection growth
    const mystery: NestSlot[] = [
      { id: 'mystery-a', name: '???', unlocked: false, hint: 'Keep studying to discover more mochi' },
      { id: 'mystery-b', name: '???', unlocked: false, hint: 'Keep studying to discover more mochi' },
    ];

    // Avoid duplicating starter if their name matches a store egg
    const filteredStore = fromStore.filter(
      (s) => s.name.toLowerCase() !== (pets[0]?.name || 'mochi').toLowerCase(),
    );

    return [starter, ...filteredStore, ...mystery].slice(0, 8);
  }, [pets, storeEggOptions, lastEggChoiceName, mochiMovedIn]);

  const unlockedCount = slots.filter((s) => s.unlocked).length;
  const nestOwner = playerName ? `${playerName}'s Nest` : 'Meadow Nest';

  return (
    <div className="egg-sanctuary">
      <header className="nest-header">
        <h2 className="egg-title">{nestOwner}</h2>
        <p className="nest-stats">
          Pets {unlockedCount}/{slots.length}
        </p>
      </header>

      <p className="egg-text">
        Your collection lives here. Study to hatch eggs, adopt from the store, and fill empty
        perches over time.
      </p>

      <div className="nest-shelf" role="list" aria-label="Pet collection">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`nest-slot${slot.unlocked ? ' is-unlocked' : ' is-locked'}`}
            role="listitem"
            title={slot.hint}
          >
            <div className="nest-slot-art" aria-hidden>
              {slot.unlocked ? (
                <MochiCloud className="nest-slot-mochi" />
              ) : (
                <span className="nest-slot-silhouette" />
              )}
            </div>
            <span className="nest-slot-name">{slot.unlocked ? slot.name : 'Locked'}</span>
          </div>
        ))}
      </div>

      <section className="nest-hatch" aria-label="Hatching nest">
        <h3 className="nest-hatch-title">Hatching nest</h3>
        {!eggHatched ? (
          <>
            <p className="egg-text">
              Study and finish tasks to warm the egg. At 100% it hatches into a mochi.
            </p>
            <div className="egg-visual">
              <div className="egg-outer">
                <div className="egg-inner">
                  <span className="egg-face">・‿・</span>
                </div>
              </div>
              <div className="egg-progress">
                <div className="egg-progress-bar" style={{ width: `${pct}%` }} />
              </div>
              <span className="egg-progress-label">{pct}% to hatch</span>
            </div>
          </>
        ) : (
          <>
            <p className="egg-text">This egg already hatched. Visit the store to pick another type.</p>
            <div className="egg-hatched">
              <MochiCloud />
              <span className="egg-hatched-name">{pets[0]?.name ?? 'Your mochi'}</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
