import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import type { BedspreadStyle, DeskPlant, FloorRug, RoomTheme } from '../utils/roomDecorSave';
import './CozyRoom.css';

interface CozyRoomProps {
  onBackToMeadow: () => void;
  onOpenNotebook: () => void;
}

function plantColor(plant: DeskPlant) {
  if (plant === 'lavender') return '#b39ad9';
  if (plant === 'bonsai') return '#5f8f5a';
  return '#6fba78';
}

function bedspreadColors(style: BedspreadStyle) {
  if (style === 'strawberry') return { quilt: '#ffb3c1', trim: '#f48aa0', pillow: '#ffe4ec' };
  if (style === 'sage') return { quilt: '#b7d4b4', trim: '#86b08a', pillow: '#e7f2e4' };
  return { quilt: '#c9c0ef', trim: '#9e93d4', pillow: '#ebe6ff' };
}

function rugColors(rug: FloorRug) {
  if (rug === 'flower') return { fill: '#f7c4d4', border: '#e895b0', accent: '#fff0f5' };
  if (rug === 'woven') return { fill: '#f0d7b8', border: '#d4b08a', accent: '#f8e9d4' };
  return { fill: '#f4c9d8', border: '#e29ab3', accent: '#ffe8f0' };
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
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCustomizer) setShowCustomizer(false);
        else onBackToMeadow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCustomizer, onBackToMeadow]);

  const handleCuddleBear = () => {
    setToast('You gave the plushie a gentle hug. Feeling safe and loved.');
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleNap = () => {
    addPoints(5);
    setToast('You took a restorative study nap. Energy restored! (+5 pts)');
    window.setTimeout(() => setToast(null), 3500);
  };

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const bed = bedspreadColors(roomDecor.bedspread);
  const rug = rugColors(roomDecor.rug);
  const leaf = plantColor(roomDecor.plant);

  return (
    <div className={`cozy-room-screen theme-${roomDecor.theme}${lampOn ? ' lamp-on' : ''}`}>
      <header className="room-top-bar">
        <button type="button" className="room-back-btn" onClick={onBackToMeadow}>
          ← Back to Meadow
        </button>
        <div className="room-brand">
          <span className="room-title">
            {playerName ? `${playerName}'s Room` : 'Your Room'}
          </span>
          <span className="room-tagline">A soft pixel hideaway for study, rest, and decor</span>
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

      <div className="room-stage">
        <div
          className={`room-pixel-stage wall-${roomDecor.theme}`}
          onMouseLeave={() => setHint(null)}
        >
          <svg
            className="room-pixel-art"
            viewBox="0 0 640 420"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {/* Wall — soft pink stripes */}
            <rect x="0" y="0" width="640" height="168" fill="#f7d6e2" />
            {Array.from({ length: 20 }, (_, i) => (
              <rect key={`stripe-${i}`} x={i * 32} y="0" width="16" height="168" fill="#fff6f9" opacity="0.9" />
            ))}
            <rect x="0" y="0" width="640" height="14" fill="#c9a27a" />
            <rect x="0" y="154" width="640" height="14" fill="#c9a27a" />
            <rect x="0" y="160" width="640" height="8" fill="#b48760" />

            {/* Wood floor planks */}
            <rect x="0" y="168" width="640" height="252" fill="#e2c49a" />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={`plank-${i}`}>
                <rect x="0" y={168 + i * 28} width="640" height="2" fill="#c9a36f" opacity="0.55" />
                <rect x={40 + (i % 3) * 180} y={178 + i * 28} width="4" height="4" fill="#b98b58" opacity="0.45" />
                <rect x={220 + (i % 2) * 160} y={184 + i * 28} width="4" height="4" fill="#b98b58" opacity="0.35" />
              </g>
            ))}

            {/* Center window with curtain */}
            <rect x="248" y="36" width="144" height="108" fill="#8b6a48" />
            <rect x="256" y="44" width="128" height="92" fill={roomDecor.theme === 'night' ? '#1a2744' : roomDecor.theme === 'sunset' ? '#f6b57a' : '#9ec9ef'} />
            {roomDecor.theme === 'night' ? (
              <>
                <circle cx="286" cy="62" r="2" fill="#f7f2c8" />
                <circle cx="312" cy="70" r="1.5" fill="#f7f2c8" />
                <circle cx="348" cy="58" r="2" fill="#f7f2c8" />
                <circle cx="360" cy="78" r="8" fill="#f3e6b0" opacity="0.85" />
              </>
            ) : (
              <>
                <ellipse cx="300" cy="70" rx="18" ry="8" fill="#ffffff" opacity="0.75" />
                <ellipse cx="340" cy="82" rx="22" ry="9" fill="#ffffff" opacity="0.65" />
              </>
            )}
            <rect x="318" y="44" width="4" height="92" fill="#8b6a48" />
            <rect x="256" y="88" width="128" height="4" fill="#8b6a48" />
            {/* Ruffled curtain pulled left */}
            <path d="M248 36 C236 52 238 78 248 96 C236 112 238 132 250 144 L262 144 C252 128 250 110 260 96 C250 78 252 54 262 36 Z" fill="#fff8fb" />
            <path d="M262 36 C256 54 258 78 266 96 C258 112 256 128 264 144" fill="none" stroke="#f0d5e2" strokeWidth="3" />

            {/* Rug */}
            <rect x="70" y="250" width="250" height="140" rx="6" fill={rug.border} />
            <rect x="82" y="260" width="226" height="120" rx="4" fill={rug.fill} />
            <rect x="98" y="274" width="194" height="92" fill={rug.accent} opacity="0.55" />

            {/* Checkered mat near vanity */}
            <g>
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2].map((col) => (
                  <rect
                    key={`mat-${row}-${col}`}
                    x={28 + col * 16}
                    y={300 + row * 16}
                    width="16"
                    height="16"
                    fill={(row + col) % 2 === 0 ? '#f7b7cb' : '#fff4f8'}
                  />
                )),
              )}
            </g>

            {/* Vanity / study desk */}
            <g className="room-furn-desk">
              <rect x="54" y="188" width="118" height="14" fill="#d7b48a" />
              <rect x="60" y="202" width="106" height="46" fill="#c9a27a" />
              <rect x="70" y="214" width="36" height="8" fill="#e8d2b0" />
              <rect x="118" y="214" width="36" height="8" fill="#e8d2b0" />
              {/* Mirror with bulbs */}
              <rect x="78" y="112" width="70" height="76" fill="#e8d2b0" />
              <rect x="88" y="122" width="50" height="56" fill="#d7ecf8" />
              {[0, 1, 2].map((i) => (
                <circle key={`bulb-l-${i}`} cx="78" cy={128 + i * 22} r="5" fill={lampOn ? '#ffe9a0' : '#f0e2c4'} />
              ))}
              {[0, 1, 2].map((i) => (
                <circle key={`bulb-r-${i}`} cx="148" cy={128 + i * 22} r="5" fill={lampOn ? '#ffe9a0' : '#f0e2c4'} />
              ))}
              {/* Notebook + plant on desk */}
              <rect x="88" y="196" width="28" height="18" fill="#f7f1e4" stroke="#c9b89a" strokeWidth="2" />
              <rect x="92" y="200" width="20" height="2" fill="#d7c4a8" />
              <rect x="92" y="205" width="16" height="2" fill="#d7c4a8" />
              <rect x="132" y="190" width="16" height="12" fill="#b98b58" />
              <ellipse cx="140" cy="186" rx="10" ry="8" fill={leaf} />
              <ellipse cx="134" cy="182" rx="6" ry="5" fill={leaf} opacity="0.85" />
              {/* Chair */}
              <rect x="92" y="248" width="42" height="10" fill="#f3a9bf" />
              <rect x="98" y="232" width="30" height="16" fill="#ef92af" />
              <rect x="96" y="258" width="8" height="14" fill="#d98aa3" />
              <rect x="122" y="258" width="8" height="14" fill="#d98aa3" />
            </g>

            {/* Nightstand + lamp under window */}
            <g>
              <rect x="292" y="198" width="56" height="48" fill="#d2ad82" />
              <rect x="298" y="214" width="44" height="10" fill="#e8d2b0" />
              <circle cx="320" cy="219" r="4" fill="#e0c070" />
              <rect x="312" y="164" width="16" height="34" fill="#f7f2ea" />
              <ellipse cx="320" cy="160" rx="22" ry="14" fill={lampOn ? '#fff1b8' : '#efe6d4'} />
              {lampOn && (
                <ellipse cx="320" cy="160" rx="34" ry="22" fill="#ffe9a0" opacity="0.28" />
              )}
            </g>

            {/* Canopy bed */}
            <g className="room-furn-bed">
              <rect x="430" y="150" width="170" height="12" fill="#c9a27a" />
              <rect x="438" y="100" width="10" height="160" fill="#c9a27a" />
              <rect x="582" y="100" width="10" height="160" fill="#c9a27a" />
              {/* Curtains with bows */}
              <path d="M438 100 C450 130 448 170 438 200 L458 200 C468 170 470 130 458 100 Z" fill="#f7b7cb" />
              <path d="M592 100 C580 130 582 170 592 200 L572 200 C562 170 560 130 572 100 Z" fill="#f7b7cb" />
              <circle cx="454" cy="148" r="7" fill="#ef92af" />
              <circle cx="576" cy="148" r="7" fill="#ef92af" />
              {/* Mattress + quilt */}
              <rect x="448" y="198" width="144" height="88" fill="#e8d2b0" />
              <rect x="454" y="208" width="132" height="70" fill={bed.quilt} />
              <rect x="454" y="208" width="132" height="10" fill={bed.trim} />
              <path d="M454 278 Q488 292 520 278 Q552 292 586 278" fill="none" stroke={bed.trim} strokeWidth="4" />
              <rect x="468" y="190" width="40" height="22" rx="4" fill={bed.pillow} />
              <rect x="520" y="190" width="40" height="22" rx="4" fill={bed.pillow} />
            </g>

            {/* Floor pillows + slippers (buddy corner) */}
            <g className="room-furn-buddy">
              <ellipse cx="210" cy="350" rx="22" ry="14" fill="#9ec5ef" />
              <ellipse cx="246" cy="358" rx="20" ry="13" fill="#f4a9c0" />
              <path d="M268 348 C276 338 292 338 298 348 C292 360 276 360 268 348 Z" fill="#fff8fb" stroke="#f0c9d8" strokeWidth="2" />
              <ellipse cx="360" cy="372" rx="14" ry="8" fill="#f3a9bf" />
              <ellipse cx="390" cy="372" rx="14" ry="8" fill="#f3a9bf" />
              {/* Tiny teddy */}
              <circle cx="300" cy="336" r="12" fill="#d2a074" />
              <circle cx="292" cy="326" r="5" fill="#d2a074" />
              <circle cx="308" cy="326" r="5" fill="#d2a074" />
              <circle cx="296" cy="334" r="1.5" fill="#5a3a28" />
              <circle cx="304" cy="334" r="1.5" fill="#5a3a28" />
              {activePet && (
                <>
                  <ellipse cx="330" cy="330" rx="16" ry="13" fill="#ffe8f2" />
                  <circle cx="324" cy="326" r="2" fill="#5a3a28" />
                  <circle cx="334" cy="326" r="2" fill="#5a3a28" />
                  <ellipse cx="329" cy="332" rx="3" ry="2" fill="#f4a9c0" />
                </>
              )}
            </g>

            {/* Soft lamp glow wash */}
            {lampOn && (
              <rect x="0" y="0" width="640" height="420" fill="#ffe9b8" opacity="0.08" />
            )}
          </svg>

          {/* Clickable hotspots */}
          <button
            type="button"
            className="room-hotspot room-hotspot--desk"
            aria-label="Study desk. Open notebook."
            onMouseEnter={() => setHint('Study desk · open notebook')}
            onFocus={() => setHint('Study desk · open notebook')}
            onClick={onOpenNotebook}
          />
          <button
            type="button"
            className="room-hotspot room-hotspot--lamp"
            aria-label={lampOn ? 'Turn lamp off' : 'Turn lamp on'}
            onMouseEnter={() => setHint(lampOn ? 'Lamp · turn off' : 'Lamp · turn on')}
            onFocus={() => setHint(lampOn ? 'Lamp · turn off' : 'Lamp · turn on')}
            onClick={() => setLampOn((v) => !v)}
          />
          <button
            type="button"
            className="room-hotspot room-hotspot--bed"
            aria-label="Cozy bed. Take a rest for 5 points."
            onMouseEnter={() => setHint('Bed · rest (+5 pts)')}
            onFocus={() => setHint('Bed · rest (+5 pts)')}
            onClick={handleNap}
          />
          <button
            type="button"
            className="room-hotspot room-hotspot--buddy"
            aria-label="Plushie corner. Cuddle bear."
            onMouseEnter={() => setHint(activePet ? `${activePet.name} & teddy · cuddle` : 'Teddy · cuddle')}
            onFocus={() => setHint(activePet ? `${activePet.name} & teddy · cuddle` : 'Teddy · cuddle')}
            onClick={handleCuddleBear}
          />

          {hint && <div className="room-pixel-hint">{hint}</div>}
        </div>

        <div className="room-footer-strip">
          <div className="room-pet-tally">
            <span className="room-tally-label">Room Companion:</span>
            {pets.length > 0 ? (
              <select
                className="room-pet-select"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
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
              <div className="customizer-group">
                <span className="customizer-label">Wall & Sky Theme</span>
                <div className="customizer-pills">
                  {(
                    [
                      ['morning', 'Morning Soft'],
                      ['sunset', 'Sunset Glow'],
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

        {toast && (
          <div className="room-toast-popup" role="status">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
