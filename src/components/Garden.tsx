import { useEffect, useState } from 'react';
import { ROCK_ASSETS } from '../meadowRocks';
import { useStore } from '../store/useStore';
import { MeadowPanBackground } from './MeadowPanBackground';
import { MeadowPet } from './MeadowPet';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './Garden.css';

function debrisRockSrc(kind: 'rock' | 'tree' | 'rubble', assetIndex?: number) {
  // rubble is no longer used for tutorial debris, but keep it safe.
  if (kind === 'rock' || kind === 'rubble') return ROCK_ASSETS[assetIndex ?? 0];
  return ROCK_ASSETS[3];
}

type GardenProps = { locked: boolean; onUnlockHint: () => void };

export function Garden({ locked, onUnlockHint }: GardenProps) {
  const pets = useStore((s) => s.pets);
  const feedPet = useStore((s) => s.feedPet);
  const points = useStore((s) => s.points);
  const spendPoints = useStore((s) => s.spendPoints);

  const tutorialStage = useStore((s) => s.tutorialStage);
  const debris = useStore((s) => s.debris);
  const clearDebris = useStore((s) => s.clearDebris);
  const awardIntroPointsIfNeeded = useStore((s) => s.awardIntroPointsIfNeeded);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const welcomeBonusClaimed = useStore((s) => s.welcomeBonusClaimed);
  const brainRotActive = useStore((s) => s.brainRotActive);

  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [hideTutorialCard, setHideTutorialCard] = useState(false);
  const [hideBrainRotBanner, setHideBrainRotBanner] = useState(false);

  useEffect(() => {
    if (tutorialStage === 'introMeadow') {
      // Only start the tutorial after the user collects their first 50 points.
      if (welcomeBonusClaimed) {
        useStore.setState({ tutorialStage: 'clearDebris' });
      }
    }
  }, [tutorialStage, welcomeBonusClaimed]);

  useEffect(() => {
    if (brainRotActive) setHideBrainRotBanner(false);
  }, [brainRotActive]);

  const isClearingTutorial = tutorialStage === 'clearDebris';
  const isMochiReveal = tutorialStage === 'mochiReveal';
  const showPets =
    tutorialStage === 'mochiReveal' ||
    tutorialStage === 'showSanctuaryArrow' ||
    tutorialStage === 'done';
  const setTutorialStage = useStore((s) => s.setTutorialStage);

  useEffect(() => {
    if (!isClearingTutorial) {
      setHideTutorialCard(false);
    }
  }, [isClearingTutorial]);

  if (locked) {
    return (
      <div className="garden garden-locked">
        <div className="garden-meadow-bg" aria-hidden>
          <MeadowPanBackground />
        </div>
        <div className="garden-lock-message">
          <span className="garden-lock-emojis">🌿 🌸 ✨ 🌿</span>
          <p className="garden-lock-title">Your meadow is waiting ~</p>
          <p className="garden-lock-text">
            Finish your tasks or meet your study goal to unlock the garden and visit your mochi pets.
          </p>
          <button className="garden-lock-btn" onClick={() => setShowAccessDialog(true)}>
            See if the garden is open
          </button>
        </div>
        {showAccessDialog && (
          <div className="garden-access-overlay">
            <div className="garden-access-card">
              <p className="garden-access-title">Garden access</p>
              <p className="garden-access-text">
                Today&apos;s study goal: {formatStudyMinutes(studyMinutesGoal)}.
                <br />
                Studied so far: {formatStudyMinutes(studyMinutesToday)}.
              </p>
              <div className="garden-access-actions">
                <button
                  type="button"
                  className="garden-access-btn garden-access-btn-secondary"
                  onClick={() => setShowAccessDialog(false)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="garden-access-btn"
                  onClick={() => {
                    onUnlockHint();
                    setShowAccessDialog(false);
                  }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`garden garden-unlocked${brainRotActive ? ' has-brain-rot' : ''}`}>
      <div className="garden-meadow-bg">
        <MeadowPanBackground>
          {isClearingTutorial &&
            debris
              .filter((d) => !d.cleared)
              .map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`garden-debris garden-debris-${d.kind}`}
                  style={{
                    left: `${d.leftPct ?? 0}%`,
                    bottom: `${d.bottomPct ?? 0}%`,
                  }}
                  onClick={() => {
                    clearDebris(d.id);
                    awardIntroPointsIfNeeded();
                  }}
                >
                  <span className="garden-debris-arrow" aria-hidden>
                    ⬇︎
                  </span>
                  <img
                    src={debrisRockSrc(d.kind, d.assetIndex)}
                    alt=""
                    className="garden-debris-img"
                    draggable={false}
                  />
                </button>
              ))}

          {showPets &&
            pets.map((p, i) => (
              <MeadowPet
                key={p.id}
                pet={p}
                points={points}
                canWander={!isMochiReveal && !brainRotActive}
                sick={brainRotActive}
                animOffset={i}
                onFeed={() => {
                  if (spendPoints(5)) feedPet(p.id);
                }}
              />
            ))}
        </MeadowPanBackground>
        {brainRotActive && (
          <div className="garden-brain-rot" aria-live="polite">
            <div className="garden-brain-rot-fog" aria-hidden />
            {!hideBrainRotBanner && (
              <div className="garden-tutorial-card garden-brain-rot-banner" role="status">
                <div className="garden-tutorial-card-chrome">
                  <button
                    type="button"
                    className="garden-tutorial-close"
                    onClick={() => setHideBrainRotBanner(true)}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                  <p className="garden-tutorial-message">
                    Brain-rot fog rolled in after a missed study day. Your mochi pets feel sick. Buy
                    Meadow Mist in the store to clear it.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isClearingTutorial && !hideTutorialCard && (
        <div className="garden-tutorial-overlay">
          <div className="garden-tutorial-card">
            <div className="garden-tutorial-card-chrome">
              <button
                type="button"
                className="garden-tutorial-close"
                onClick={() => setHideTutorialCard(true)}
                aria-label="Close tutorial"
              >
                ×
              </button>
              <p className="garden-tutorial-message">
                <strong>Oh no!</strong>{' '}
                Some rumbly rubble is blocking the way! Clear the rocks to tidy the meadow and earn
                100 starter points.
              </p>
            </div>
          </div>
        </div>
      )}

      {isMochiReveal && (
        <div className="garden-tutorial-overlay">
          <div className="garden-tutorial-card garden-reveal-card">
            <div className="garden-tutorial-card-chrome">
              <p className="garden-tutorial-message">
                <strong>Look who showed up!</strong>
                <br />
                A little mochi decided to move in now that the meadow is clean.
              </p>
              <button
                type="button"
                className="garden-reveal-btn"
                onClick={() => setTutorialStage('showSanctuaryArrow')}
              >
                Say hi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
