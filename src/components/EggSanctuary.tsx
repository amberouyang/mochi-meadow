import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { MochiCloud } from './MochiCloud';
import strawNestArt from '../assets/nest/straw-nest.png';
import './EggSanctuary.css';

type NestSlot = {
  id: string;
  name: string;
  unlocked: boolean;
  hint: string;
};

type EggSanctuaryProps = {
  onBackToMeadow?: () => void;
};

export function EggSanctuary({ onBackToMeadow }: EggSanctuaryProps) {
  const eggProgress = useStore((s) => s.eggProgress);
  const eggHatched = useStore((s) => s.eggHatched);
  const incubatingEgg = useStore((s) => s.incubatingEgg);
  const pets = useStore((s) => s.pets);
  const storeEggOptions = useStore((s) => s.storeEggOptions);
  const tutorialStage = useStore((s) => s.tutorialStage);
  const playerName = useStore((s) => s.playerName);

  const pct = Math.round((eggProgress / 1000) * 100);
  const mochiMovedIn =
    tutorialStage === 'mochiReveal' ||
    tutorialStage === 'showSanctuaryArrow' ||
    tutorialStage === 'done';

  const slots: NestSlot[] = useMemo(() => {
    const ownedNames = new Set(pets.map((p) => p.name.toLowerCase()));

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

    const mystery: NestSlot[] = [
      { id: 'mystery-a', name: '???', unlocked: false, hint: 'Keep studying to discover more mochi' },
      { id: 'mystery-b', name: '???', unlocked: false, hint: 'Keep studying to discover more mochi' },
    ];

    const filteredStore = fromStore.filter(
      (s) => s.name.toLowerCase() !== (pets[0]?.name || 'mochi').toLowerCase(),
    );

    return [starter, ...filteredStore, ...mystery].slice(0, 8);
  }, [pets, storeEggOptions, mochiMovedIn]);

  const unlockedCount = slots.filter((s) => s.unlocked).length;
  const nestOwner = playerName ? `${playerName}'s Nest` : 'Meadow Nest';
  const isIncubating = Boolean(incubatingEgg && !eggHatched);
  const justHatched = Boolean(incubatingEgg && eggHatched);

  const topRow = slots.slice(0, 4);
  const bottomRow = slots.slice(4, 8);

  let nestCaption = 'Buy an egg in the Store to warm it here.';
  if (isIncubating && incubatingEgg) {
    nestCaption = `${incubatingEgg.name} is incubating — ${pct}% warm. Keep studying!`;
  } else if (justHatched && incubatingEgg) {
    nestCaption = `${incubatingEgg.name} hatched and joined the meadow!`;
  }

  return (
    <div className="nest-scene" role="region" aria-label={nestOwner}>
      <div className="nest-scene-sky" aria-hidden />
      <div className="nest-scene-room">
        {onBackToMeadow && (
          <button type="button" className="nest-scene-exit" onClick={onBackToMeadow}>
            <span className="nest-scene-exit-icon" aria-hidden>
              ⌂
            </span>
            Exit
          </button>
        )}

        <div className="nest-scene-signboard" aria-label="Nest stats">
          <p className="nest-scene-sign-title">{nestOwner}</p>
          <p className="nest-scene-sign-meta">
            Pets collected: {unlockedCount}/{slots.length}
          </p>
        </div>

        <div className="nest-scene-shelf-unit" role="list" aria-label="Pet collection shelf">
          <div className="nest-scene-shelf-plank">
            {topRow.map((slot) => (
              <div
                key={slot.id}
                className={`nest-scene-perch${slot.unlocked ? ' is-unlocked' : ' is-locked'}`}
                role="listitem"
                title={slot.hint}
              >
                <div className="nest-scene-perch-art" aria-hidden>
                  {slot.unlocked ? (
                    <MochiCloud className="nest-scene-perch-mochi" />
                  ) : (
                    <span className="nest-scene-perch-ghost" />
                  )}
                </div>
                <span className="nest-scene-perch-name">{slot.unlocked ? slot.name : '· · ·'}</span>
              </div>
            ))}
          </div>
          <div className="nest-scene-shelf-plank">
            {bottomRow.map((slot) => (
              <div
                key={slot.id}
                className={`nest-scene-perch${slot.unlocked ? ' is-unlocked' : ' is-locked'}`}
                role="listitem"
                title={slot.hint}
              >
                <div className="nest-scene-perch-art" aria-hidden>
                  {slot.unlocked ? (
                    <MochiCloud className="nest-scene-perch-mochi" />
                  ) : (
                    <span className="nest-scene-perch-ghost" />
                  )}
                </div>
                <span className="nest-scene-perch-name">{slot.unlocked ? slot.name : '· · ·'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="nest-scene-floor">
          <div
            className={`nest-scene-bed${isIncubating ? ' is-warming' : ''}${justHatched ? ' is-hatched' : ''}`}
            aria-label="Hatching nest"
          >
            <img className="nest-scene-bed-art" src={strawNestArt} alt="" aria-hidden />
            <div className="nest-scene-bed-inner">
              {!incubatingEgg && <span className="nest-scene-bed-empty">empty nest</span>}
              {isIncubating && incubatingEgg && (
                <div className="nest-scene-egg-wrap">
                  {incubatingEgg.artSrc ? (
                    <img
                      className="nest-scene-egg-art"
                      src={incubatingEgg.artSrc}
                      alt={incubatingEgg.name}
                    />
                  ) : (
                    <div className="egg-outer nest-scene-egg">
                      <div className="egg-inner">
                        <span className="egg-face">・‿・</span>
                      </div>
                    </div>
                  )}
                  <div className="nest-scene-warm-bar" aria-hidden>
                    <div className="nest-scene-warm-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
              {justHatched && incubatingEgg && (
                <div className="nest-scene-hatchling">
                  <MochiCloud className="nest-scene-hatchling-mochi" />
                  <span>{incubatingEgg.name}</span>
                </div>
              )}
            </div>
          </div>
          <p className="nest-scene-caption">{nestCaption}</p>
        </div>
      </div>
    </div>
  );
}
