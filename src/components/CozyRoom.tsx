import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import type { BedspreadStyle, DeskPlant, FloorRug, RoomTheme } from '../utils/roomDecorSave';
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
  const roomDecor = useStore((s) => s.roomDecor);
  const setRoomDecor = useStore((s) => s.setRoomDecor);

  const [lampOn, setLampOn] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCustomizer) {
          setShowCustomizer(false);
        } else {
          onBackToMeadow();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCustomizer, onBackToMeadow]);

  const handleCuddleBear = () => {
    setToast('You gave the plushie teddy bear a gentle hug. Feeling safe and loved.');
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleNap = () => {
    addPoints(5);
    setToast('You took a restorative 5-minute study nap on your cozy bed. Energy restored! (+5 pts)');
    window.setTimeout(() => setToast(null), 3500);
  };

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  return (
    <div className={`cozy-room-screen theme-${roomDecor.theme}`}>
      {/* Top Bar */}
      <header className="room-top-bar">
        <button type="button" className="room-back-btn" onClick={onBackToMeadow}>
          ← Back to Meadow
        </button>
        <div className="room-brand">
          <span className="room-title">
            {playerName ? `${playerName}'s Cozy Room` : 'Your Cozy Room'}
          </span>
          <span className="room-tagline">Personal pastel sanctuary for study, decor, and rest</span>
        </div>
        <div className="room-top-actions">
          <button
            type="button"
            className="room-customize-btn"
            onClick={() => setShowCustomizer(!showCustomizer)}
          >
            {showCustomizer ? 'Close Decor' : 'Customize Room'}
          </button>
          <div className="room-points-pill">
            <span className="room-points-label">Points</span>
            <span className="room-points-num">{points}</span>
          </div>
        </div>
      </header>

      {/* Main Room Stage */}
      <div className="room-stage">
        {/* Wall Backdrop & Arched Windows (Custom theme driven) */}
        <div className={`room-wall-backdrop wall-${roomDecor.theme}`}>
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
                {roomDecor.theme === 'night' ? (
                  <>
                    <span className="room-star s1" />
                    <span className="room-star s2" />
                  </>
                ) : (
                  <>
                    <span className="room-cloud c1" />
                    <span className="room-balloon b1" />
                  </>
                )}
              </div>
              <div className="room-arch-panes" />
            </div>

            <div className="room-arch-window">
              <div className="room-sky-scene">
                {roomDecor.theme === 'night' ? (
                  <>
                    <span className="room-crescent-moon" />
                    <span className="room-star s3" />
                  </>
                ) : (
                  <>
                    <span className="room-cloud c2" />
                    <span className="room-star s1" />
                  </>
                )}
              </div>
              <div className="room-arch-panes" />
            </div>

            <div className="room-arch-window">
              <div className="room-sky-scene">
                {roomDecor.theme === 'night' ? (
                  <>
                    <span className="room-star s1" />
                    <span className="room-star s4" />
                  </>
                ) : (
                  <>
                    <span className="room-cloud c3" />
                    <span className="room-balloon b2" />
                  </>
                )}
              </div>
              <div className="room-arch-panes" />
            </div>
          </div>
        </div>

        {/* Room Interactive Stations (Desk, Bed, Plushie, Companion) */}
        <div className="room-furniture-grid">
          {/* 1. Study Desk Station */}
          <div
            className={`room-station room-station--desk ${lampOn ? 'lamp-on' : ''}`}
            onClick={onOpenNotebook}
            role="button"
            tabIndex={0}
            aria-label="Study Desk. Click to open Study Notebook."
          >
            <div className="station-card">
              <div className="station-header-row">
                <span className="station-icon-chip">Study Desk</span>
                <button
                  type="button"
                  className={`station-lamp-toggle ${lampOn ? 'is-on' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLampOn(!lampOn);
                  }}
                  title="Toggle Desk Lamp"
                >
                  Lamp: {lampOn ? 'On' : 'Off'}
                </button>
              </div>

              <p className="station-title">Study Notebook</p>
              <p className="station-desc">
                Your desk has your study journal, assignments checklist, and focus timer ready.
              </p>

              <div className="station-item-details">
                <span className="station-meta-badge">
                  Plant: {roomDecor.plant === 'succulent' ? 'Jade Succulent' : roomDecor.plant === 'lavender' ? 'Fragrant Lavender' : 'Sprout Bonsai'}
                </span>
                <span className="station-action-tag">Open Notebook</span>
              </div>
            </div>
          </div>

          {/* 2. Cozy Bed Station */}
          <div
            className={`room-station room-station--bed bedstyle-${roomDecor.bedspread}`}
            onClick={handleNap}
            role="button"
            tabIndex={0}
            aria-label="Cozy Bed. Click to take a rest."
          >
            <div className="station-card">
              <span className="station-icon-chip">Resting Bed</span>
              <p className="station-title">
                {roomDecor.bedspread === 'moon'
                  ? 'Moon & Star Bed'
                  : roomDecor.bedspread === 'strawberry'
                    ? 'Strawberry Cloud Bed'
                    : 'Sage Linen Bed'}
              </p>
              <p className="station-desc">
                Take a mindful pause between study blocks to prevent fatigue.
              </p>
              <div className="station-item-details">
                <span className="station-meta-badge">
                  Rug: {roomDecor.rug === 'cloud' ? 'Cloud Rug' : roomDecor.rug === 'flower' ? 'Flower Petal' : 'Woven Pastel'}
                </span>
                <span className="station-action-tag">Rest (+5 pts)</span>
              </div>
            </div>
          </div>

          {/* 3. Teddy Bear & Pet Companion Corner */}
          <div
            className="room-station room-station--bear"
            onClick={handleCuddleBear}
            role="button"
            tabIndex={0}
            aria-label="Plushie Bear and Pet Corner."
          >
            <div className="station-card">
              <span className="station-icon-chip">Room Buddy</span>
              <p className="station-title">
                {activePet ? `${activePet.name} & Teddy` : 'Teddy Bear'}
              </p>
              <p className="station-desc">
                {activePet
                  ? `${activePet.name} is resting happily in your room beside your teddy bear.`
                  : 'Your quiet plushie friend who keeps you company while studying.'}
              </p>

              <div className="station-item-details">
                <span className="station-meta-badge">Mood: Content</span>
                <span className="station-action-tag">Cuddle Bear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Room Floor Progress Strip */}
        <div className="room-footer-strip">
          <div className="room-pet-tally">
            <span className="room-tally-label">Room Companion:</span>
            {pets.length > 0 ? (
              <select
                className="room-pet-select"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.energy}% energy)
                  </option>
                ))}
              </select>
            ) : (
              <span className="room-tally-val">No mochi pets yet</span>
            )}
          </div>
          <div className="room-study-tally">
            <span className="room-tally-label">Today&apos;s Focus:</span>
            <span className="room-tally-val">
              {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)}
            </span>
          </div>
        </div>

        {/* CUSTOMIZATION DRAWER / MODAL */}
        {showCustomizer && (
          <div className="room-customizer-panel">
            <div className="customizer-header">
              <h3 className="customizer-title">Room Decorator</h3>
              <button
                type="button"
                className="customizer-close"
                onClick={() => setShowCustomizer(false)}
                aria-label="Close customizer"
              >
                ×
              </button>
            </div>

            <div className="customizer-grid">
              {/* Option 1: Wall & Sky Theme */}
              <div className="customizer-group">
                <span className="customizer-label">Wall & Sky Theme</span>
                <div className="customizer-pills">
                  {(
                    [
                      ['morning', 'Morning Mint'],
                      ['sunset', 'Sunset Amber'],
                      ['night', 'Starlight Night'],
                      ['candy', 'Candy Dream'],
                    ] as [RoomTheme, string][]
                  ).map(([themeKey, label]) => (
                    <button
                      key={themeKey}
                      type="button"
                      className={`customizer-btn ${roomDecor.theme === themeKey ? 'is-active' : ''}`}
                      onClick={() => setRoomDecor({ theme: themeKey })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Bedspread & Pillows */}
              <div className="customizer-group">
                <span className="customizer-label">Bedspread Style</span>
                <div className="customizer-pills">
                  {(
                    [
                      ['moon', 'Moon & Star'],
                      ['strawberry', 'Strawberry Cloud'],
                      ['sage', 'Sage Meadow'],
                    ] as [BedspreadStyle, string][]
                  ).map(([styleKey, label]) => (
                    <button
                      key={styleKey}
                      type="button"
                      className={`customizer-btn ${roomDecor.bedspread === styleKey ? 'is-active' : ''}`}
                      onClick={() => setRoomDecor({ bedspread: styleKey })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Desk Companion Plant */}
              <div className="customizer-group">
                <span className="customizer-label">Desk Plant</span>
                <div className="customizer-pills">
                  {(
                    [
                      ['succulent', 'Jade Succulent'],
                      ['lavender', 'Sweet Lavender'],
                      ['bonsai', 'Sprout Bonsai'],
                    ] as [DeskPlant, string][]
                  ).map(([plantKey, label]) => (
                    <button
                      key={plantKey}
                      type="button"
                      className={`customizer-btn ${roomDecor.plant === plantKey ? 'is-active' : ''}`}
                      onClick={() => setRoomDecor({ plant: plantKey })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 4: Floor Rug */}
              <div className="customizer-group">
                <span className="customizer-label">Floor Rug</span>
                <div className="customizer-pills">
                  {(
                    [
                      ['cloud', 'Fluffy Cloud'],
                      ['flower', 'Daisy Flower'],
                      ['woven', 'Pastel Woven'],
                    ] as [FloorRug, string][]
                  ).map(([rugKey, label]) => (
                    <button
                      key={rugKey}
                      type="button"
                      className={`customizer-btn ${roomDecor.rug === rugKey ? 'is-active' : ''}`}
                      onClick={() => setRoomDecor({ rug: rugKey })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="customizer-footer">
              <span>Decorations save automatically to your room.</span>
            </div>
          </div>
        )}

        {toast && <div className="room-toast-popup" role="status">{toast}</div>}
      </div>
    </div>
  );
}
