import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { MochiCloud } from './MochiCloud';
import { InfoTip } from './InfoTip';
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
  const dismissHatchedEgg = useStore((s) => s.dismissHatchedEgg);
  const pets = useStore((s) => s.pets);
  const storeEggOptions = useStore((s) => s.storeEggOptions);
  const tutorialStage = useStore((s) => s.tutorialStage);
  const playerName = useStore((s) => s.playerName);

  const handleBack = () => {
    if (incubatingEgg && eggHatched) dismissHatchedEgg();
    onBackToMeadow?.();
  };

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

  let nestCaption = 'Empty nest';
  if (isIncubating && incubatingEgg) {
    nestCaption = incubatingEgg.name;
  } else if (justHatched && incubatingEgg) {
    nestCaption = `${incubatingEgg.name} hatched!`;
  }

  return (
    <div className="nest-scene" role="region" aria-label={nestOwner}>
      <div className="nest-scene-sky" aria-hidden />
      <div className="nest-scene-room">
        {onBackToMeadow && (
          <button type="button" className="nest-scene-exit" onClick={handleBack}>
            <span className="nest-scene-exit-icon" aria-hidden>
              ⌂
            </span>
            Exit
          </button>
        )}

        <div className="nest-scene-signboard" aria-label="Nest stats">
          <div className="nest-scene-sign-top">
            <p className="nest-scene-sign-title">{nestOwner}</p>
            <InfoTip label="About the nest">
              Buy an egg in the Store. Study or finish tasks to warm it. Hatching usually takes about
              100 study minutes. Watch the warmth bar under the egg.
            </InfoTip>
          </div>
          <p className="nest-scene-sign-meta">
            Pets {unlockedCount}/{slots.length}
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
                  <div className="nest-scene-warm" aria-label={`Warmth ${pct} percent`}>
                    <span className="nest-scene-warm-label">Warmth {pct}%</span>
                    <div className="nest-scene-warm-bar">
                      <div className="nest-scene-warm-fill" style={{ width: `${pct}%` }} />
                    </div>
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
