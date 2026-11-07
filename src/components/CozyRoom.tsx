import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './CozyRoom.css';

interface CozyRoomProps {
  onBackToMeadow: () => void;
  onOpenNotebook: () => void;
}

export function CozyRoom({ onBackToMeadow, onOpenNotebook }: CozyRoomProps) {
  const playerName = useStore((s) => s.playerName);
  const pets = useStore((s) => s.pets);
  const points = useStore((s) => s.points);
  const addPoints = useStore((s) => s.addPoints);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);

  const [toast, setToast] = useState<string | null>(null);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBackToMeadow();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToMeadow]);

  const handleCuddleBear = () => {
    setToast('You gave the teddy bear a soft hug. Feeling warm and safe.');
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleNap = () => {
    addPoints(5);
    setToast('You took a cozy 5-minute study rest on your moon bed. Energy restored! (+5 pts)');
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="cozy-room-screen">
      {/* Top Bar */}
      <header className="room-top-bar">
        <button type="button" className="room-back-btn" onClick={onBackToMeadow}>
          ← Back to Meadow
        </button>
        <div className="room-brand">
          <span className="room-title">{playerName ? `${playerName}'s Room` : 'Your Cozy Room'}</span>
          <span className="room-tagline">Pastel sanctuary for quiet study and rest</span>
        </div>
        <div className="room-points-pill">
          <span className="room-points-label">Points</span>
          <span className="room-points-num">{points}</span>
        </div>
      </header>

      {/* Fantage-Inspired Pastel Room Interior */}
      <div className="room-stage">
        {/* Pastel Wall Arches & Windows with Clouds and Hot Air Balloons */}
        <div className="room-wall-backdrop" aria-hidden>
          {/* Ceiling Bunting Flags */}
          <div className="room-bunting">
            {['#ffb3ba', '#bae1ff', '#ffffba', '#baffc9', '#ffdfba', '#e8dff5', '#ffb3ba', '#bae1ff', '#ffffba', '#baffc9', '#ffdfba', '#e8dff5'].map((color, i) => (
              <span key={i} className="room-flag" style={{ borderTopColor: color }} />
            ))}
          </div>

          {/* Arched Sky Windows */}
          <div className="room-arches-row">
            <div className="room-arch-window">
              <div className="room-sky-scene">
                <span className="room-cloud c1" />
                <span className="room-balloon b1" />
              </div>
              <div className="room-arch-panes" />
            </div>
            <div className="room-arch-window">
              <div className="room-sky-scene">
                <span className="room-cloud c2" />
                <span className="room-star s1" />
              </div>
              <div className="room-arch-panes" />
            </div>
            <div className="room-arch-window">
              <div className="room-sky-scene">
                <span className="room-cloud c3" />
                <span className="room-balloon b2" />
              </div>
              <div className="room-arch-panes" />
            </div>
          </div>
        </div>

        {/* Room Interactive Furniture & Stations */}
        <div className="room-furniture-grid">
          {/* 1. Study Desk Station */}
          <div
            className="room-station room-station--desk"
            onClick={onOpenNotebook}
            role="button"
            tabIndex={0}
            aria-label="Study Desk. Click to open your Notebook."
          >
            <div className="station-card">
              <div className="station-icon-chip">Study Desk</div>
              <p className="station-title">Open Study Notebook</p>
              <p className="station-desc">
                Organize assignments, checklist, and focus timer on your desk.
              </p>
              <div className="station-action-tag">Click to write</div>
            </div>
          </div>

          {/* 2. Cozy Moon Bed */}
          <div
            className="room-station room-station--bed"
            onClick={handleNap}
            role="button"
            tabIndex={0}
            aria-label="Cozy Bed. Click to take a rest."
          >
            <div className="station-card">
              <div className="station-icon-chip">Moon Bed</div>
              <p className="station-title">Rest & Recharge</p>
              <p className="station-desc">
                Take a mindful pause between study blocks to prevent burnout.
              </p>
              <div className="station-action-tag">Click to rest (+5 pts)</div>
            </div>
          </div>

          {/* 3. Teddy Bear Corner */}
          <div
            className="room-station room-station--bear"
            onClick={handleCuddleBear}
            role="button"
            tabIndex={0}
            aria-label="Plushie Bear. Click to cuddle."
          >
            <div className="station-card">
              <div className="station-icon-chip">Teddy Bear</div>
              <p className="station-title">Mochi Plushie</p>
              <p className="station-desc">
                Your quiet study buddy who sits beside you while you work.
              </p>
              <div className="station-action-tag">Click to cuddle</div>
            </div>
          </div>
        </div>

        {/* Room Floor Note / Progress Strip */}
        <div className="room-footer-strip">
          <div className="room-pet-tally">
            <span className="room-tally-label">Room Companions:</span>
            <span className="room-tally-val">
              {pets.length} {pets.length === 1 ? 'mochi pet' : 'mochi pets'} relaxing here
            </span>
          </div>
          <div className="room-study-tally">
            <span className="room-tally-label">Today&apos;s Focus:</span>
            <span className="room-tally-val">
              {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)}
            </span>
          </div>
        </div>

        {toast && <div className="room-toast-popup" role="status">{toast}</div>}
      </div>
    </div>
  );
}
