import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  SHIRT_STYLES,
  SHIRT_COLORS,
  ACCESSORIES,
  COMPANIONS,
  getCaretakerRank,
  rollRandomProfile,
} from '../utils/playerProfileSave';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './PlayerProfileTab.css';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 8 8" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M5 1L2 4L5 7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 8 8" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M3 1L6 4L3 7" />
    </svg>
  );
}

interface PlayerProfileTabProps {
  onConfirm?: () => void;
}

export function PlayerProfileTab({ onConfirm }: PlayerProfileTabProps) {
  const profile = useStore((s) => s.playerProfile);
  const setProfile = useStore((s) => s.setPlayerProfile);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const drinkBuff = useStore((s) => s.drinkBuff);
  const pets = useStore((s) => s.pets);

  const [nameDraft, setNameDraft] = useState(profile.name);
  const [meadowDraft, setMeadowDraft] = useState(profile.meadowName);
  const [favDraft, setFavDraft] = useState(profile.favoriteThing);
  const [savedToast, setSavedToast] = useState(false);

  const avatar = profile.avatar;
  const rank = getCaretakerRank(profile.totalStudyMinutesAllTime);

  const cycle = (key: keyof typeof avatar, delta: number, max: number) => {
    const nextVal = (avatar[key] + delta + max) % max;
    setProfile({ avatar: { [key]: nextVal } as any });
  };

  const cycleCompanion = (delta: number) => {
    const idx = COMPANIONS.findIndex((c) => c.id === profile.companionPreference);
    const nextIdx = (idx + delta + COMPANIONS.length) % COMPANIONS.length;
    setProfile({ companionPreference: COMPANIONS[nextIdx].id });
  };

  const handleRandomize = () => {
    const rolled = rollRandomProfile();
    setProfile(rolled);
    if (rolled.meadowName) setMeadowDraft(rolled.meadowName);
    if (rolled.favoriteThing) setFavDraft(rolled.favoriteThing);
  };

  const handleSaveAndConfirm = () => {
    setProfile({
      name: nameDraft.trim() || 'Little Caretaker',
      meadowName: meadowDraft.trim() || 'Sunnybloom Meadow',
      favoriteThing: favDraft.trim() || 'Warm Matcha Lattes',
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
    if (onConfirm) onConfirm();
  };

  const currentSkin = SKIN_TONES[avatar.skinTone] || SKIN_TONES[0];
  const currentHair = HAIR_STYLES[avatar.hairStyle] || HAIR_STYLES[0];
  const currentHairColor = HAIR_COLORS[avatar.hairColor] || HAIR_COLORS[0];
  const currentShirt = SHIRT_STYLES[avatar.shirtStyle] || SHIRT_STYLES[0];
  const currentShirtColor = SHIRT_COLORS[avatar.shirtColor] || SHIRT_COLORS[0];
  const currentAcc = ACCESSORIES[avatar.accessory] || ACCESSORIES[0];
  const currentComp = COMPANIONS.find((c) => c.id === profile.companionPreference) || COMPANIONS[0];

  const totalHours = Math.floor(profile.totalStudyMinutesAllTime / 60);
  const totalMinsRem = profile.totalStudyMinutesAllTime % 60;

  return (
    <div className="profile-sheet-container">
      {/* LEFT COLUMN: Character Portrait Box & Customization Steppers */}
      <div className="profile-character-column">
        <div className="profile-portrait-card">
          <div className="portrait-header-bar">
            <button
              type="button"
              className="dice-randomize-btn"
              onClick={handleRandomize}
              title="Roll random look & favorite things!"
              aria-label="Randomize appearance"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <rect x="2" y="2" width="12" height="12" rx="2" fill="#fffdfa" stroke="#b08968" strokeWidth="1.5" />
                <circle cx="5" cy="5" r="1.2" fill="#b08968" />
                <circle cx="11" cy="5" r="1.2" fill="#b08968" />
                <circle cx="8" cy="8" r="1.2" fill="#b08968" />
                <circle cx="5" cy="11" r="1.2" fill="#b08968" />
                <circle cx="11" cy="11" r="1.2" fill="#b08968" />
              </svg>
              <span>Random</span>
            </button>
            <span className="portrait-level-chip">Lv. {rank.level}</span>
          </div>

          {/* Framed Picture Window */}
          <div className="portrait-frame-window">
            <svg
              viewBox="0 0 120 140"
              className="portrait-avatar-svg"
              shapeRendering="crispEdges"
              aria-label="Character preview"
            >
              {/* Sky background */}
              <rect x="0" y="0" width="120" height="140" fill="#cdebf9" />
              {/* Cloud puff */}
              <ellipse cx="28" cy="24" rx="16" ry="8" fill="#ffffff" opacity="0.85" />
              <ellipse cx="40" cy="22" rx="14" ry="10" fill="#ffffff" opacity="0.85" />
              <ellipse cx="95" cy="35" rx="14" ry="7" fill="#ffffff" opacity="0.75" />
              {/* Meadow grass hill */}
              <path d="M0,110 Q60,95 120,110 L120,140 L0,140 Z" fill="#9ece6a" />
              <path d="M0,122 Q60,112 120,122 L120,140 L0,140 Z" fill="#88b857" />

              {/* Character Shadow */}
              <ellipse cx="60" cy="126" rx="22" ry="5" fill="#5b8535" opacity="0.45" />

              {/* Legs / Pants */}
              <rect x="52" y="104" width="7" height="18" fill="#52617a" />
              <rect x="61" y="104" width="7" height="18" fill="#52617a" />
              {/* Cute shoes */}
              <rect x="50" y="120" width="9" height="6" rx="2" fill="#754f3b" />
              <rect x="61" y="120" width="9" height="6" rx="2" fill="#754f3b" />

              {/* Body / Shirt */}
              <rect x="47" y="78" width="26" height="28" rx="3" fill={currentShirtColor.color} />
              {/* Shirt style accents */}
              {avatar.shirtStyle === 1 && (
                <>
                  {/* Overalls straps */}
                  <rect x="50" y="78" width="4" height="24" fill="#3d5a80" />
                  <rect x="66" y="78" width="4" height="24" fill="#3d5a80" />
                  <rect x="50" y="90" width="20" height="16" fill="#3d5a80" />
                  {/* Brass button */}
                  <circle cx="52" cy="88" r="1.5" fill="#f4d35e" />
                  <circle cx="68" cy="88" r="1.5" fill="#f4d35e" />
                </>
              )}
              {avatar.shirtStyle === 2 && (
                <>
                  {/* Sailor collar */}
                  <polygon points="48,78 60,88 72,78 68,78 60,85 52,78" fill="#ffffff" />
                  <rect x="58" y="87" width="4" height="6" fill="#e63946" />
                </>
              )}
              {avatar.shirtStyle === 3 && (
                <>
                  {/* Stripes */}
                  <rect x="47" y="84" width="26" height="3" fill="#ffffff" opacity="0.6" />
                  <rect x="47" y="92" width="26" height="3" fill="#ffffff" opacity="0.6" />
                  <rect x="47" y="100" width="26" height="3" fill="#ffffff" opacity="0.6" />
                </>
              )}
              {avatar.shirtStyle === 4 && (
                <>
                  {/* Cottage apron */}
                  <rect x="51" y="82" width="18" height="24" fill="#fdfaf6" />
                  <rect x="54" y="94" width="12" height="8" rx="1" fill="#eddcd2" />
                </>
              )}

              {/* Arms */}
              <rect x="42" y="82" width="5" height="18" rx="2" fill={currentShirtColor.accent} />
              <rect x="73" y="82" width="5" height="18" rx="2" fill={currentShirtColor.accent} />
              {/* Hands */}
              <rect x="42" y="98" width="5" height="5" rx="2" fill={currentSkin.color} />
              <rect x="73" y="98" width="5" height="5" rx="2" fill={currentSkin.color} />

              {/* Neck */}
              <rect x="56" y="72" width="8" height="7" fill={currentSkin.shadow} />

              {/* Head / Face */}
              <rect x="46" y="44" width="28" height="30" rx="6" fill={currentSkin.color} />
              {/* Rosy cheeks */}
              <ellipse cx="50" cy="62" rx="3" ry="2" fill="#ff99a8" opacity="0.6" />
              <ellipse cx="70" cy="62" rx="3" ry="2" fill="#ff99a8" opacity="0.6" />
              {/* Eyes */}
              <rect x="52" y="55" width="3" height="5" rx="1.5" fill="#382923" />
              <rect x="65" y="55" width="3" height="5" rx="1.5" fill="#382923" />
              <rect x="53" y="55" width="1" height="2" fill="#ffffff" />
              <rect x="66" y="55" width="1" height="2" fill="#ffffff" />
              {/* Sweet smile */}
              <path d="M58,64 Q60,67 62,64" stroke="#754f3b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Hair Back & Front based on style */}
              {avatar.hairStyle === 0 && (
                <>
                  {/* Twin Buns */}
                  <circle cx="44" cy="40" r="7" fill={currentHairColor.color} />
                  <circle cx="76" cy="40" r="7" fill={currentHairColor.color} />
                  {/* Bun ribbon */}
                  <rect x="46" y="44" width="4" height="2" fill="#ffb5a7" />
                  <rect x="70" y="44" width="4" height="2" fill="#ffb5a7" />
                  {/* Bangs */}
                  <path d="M44,46 Q60,34 76,46 Q60,42 44,46 Z" fill={currentHairColor.color} />
                  <rect x="45" y="44" width="30" height="8" rx="3" fill={currentHairColor.color} />
                </>
              )}
              {avatar.hairStyle === 1 && (
                <>
                  {/* Messy Bob */}
                  <rect x="43" y="40" width="34" height="12" rx="5" fill={currentHairColor.color} />
                  <rect x="42" y="48" width="6" height="16" rx="3" fill={currentHairColor.color} />
                  <rect x="72" y="48" width="6" height="16" rx="3" fill={currentHairColor.color} />
                  <polygon points="46,48 54,54 58,48 64,53 74,48" fill={currentHairColor.color} />
                </>
              )}
              {avatar.hairStyle === 2 && (
                <>
                  {/* Wavy Locks */}
                  <rect x="43" y="40" width="34" height="14" rx="6" fill={currentHairColor.color} />
                  <rect x="40" y="50" width="7" height="26" rx="3" fill={currentHairColor.color} />
                  <rect x="73" y="50" width="7" height="26" rx="3" fill={currentHairColor.color} />
                  <circle cx="43" cy="74" r="4" fill={currentHairColor.color} />
                  <circle cx="77" cy="74" r="4" fill={currentHairColor.color} />
                </>
              )}
              {avatar.hairStyle === 3 && (
                <>
                  {/* High Ponytail */}
                  <rect x="44" y="40" width="32" height="12" rx="4" fill={currentHairColor.color} />
                  <rect x="74" y="34" width="10" height="24" rx="4" fill={currentHairColor.color} />
                  <rect x="72" y="38" width="4" height="3" fill="#ffc6ff" />
                </>
              )}
              {avatar.hairStyle === 4 && (
                <>
                  {/* Sprout Curls */}
                  <rect x="44" y="40" width="32" height="12" rx="4" fill={currentHairColor.color} />
                  <circle cx="48" cy="38" r="4" fill={currentHairColor.color} />
                  <circle cx="60" cy="36" r="4" fill={currentHairColor.color} />
                  <circle cx="72" cy="38" r="4" fill={currentHairColor.color} />
                </>
              )}
              {avatar.hairStyle === 5 && (
                <>
                  {/* Slouchy Beanie */}
                  <rect x="43" y="34" width="34" height="16" rx="8" fill="#a2d2ff" />
                  <rect x="42" y="44" width="36" height="5" rx="2" fill="#7db5e8" />
                  {/* Hair peeking */}
                  <rect x="44" y="48" width="6" height="10" fill={currentHairColor.color} />
                  <rect x="70" y="48" width="6" height="10" fill={currentHairColor.color} />
                </>
              )}

              {/* Accessories */}
              {avatar.accessory === 1 && (
                /* Daisy Flower */
                <g transform="translate(68, 38)">
                  <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
                  <circle cx="0" cy="0" r="1.5" fill="#f4d35e" />
                </g>
              )}
              {avatar.accessory === 2 && (
                /* Wire Glasses */
                <g transform="translate(48, 54)">
                  <rect x="2" y="0" width="8" height="6" rx="2" fill="none" stroke="#d4a373" strokeWidth="1.2" />
                  <rect x="14" y="0" width="8" height="6" rx="2" fill="none" stroke="#d4a373" strokeWidth="1.2" />
                  <line x1="10" y1="3" x2="14" y2="3" stroke="#d4a373" strokeWidth="1.2" />
                </g>
              )}
              {avatar.accessory === 3 && (
                /* Tiny Sprout Leaf */
                <g transform="translate(60, 32)">
                  <path d="M0,0 Q-4,-5 -2,-8 Q2,-5 0,0" fill="#80b918" />
                  <path d="M0,0 Q4,-4 5,-7 Q2,-6 0,0" fill="#aacc00" />
                </g>
              )}
              {avatar.accessory === 4 && (
                /* Starry hairpin */
                <g transform="translate(47, 44)">
                  <polygon points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1" fill="#ffe066" />
                </g>
              )}
            </svg>
          </div>

          <div className="portrait-character-title">
            <span className="profile-hero-name">{profile.name}</span>
            <span className="profile-hero-tagline">{rank.title}</span>
          </div>
        </div>

        {/* Stardew-Style Steppers */}
        <div className="profile-steppers-card">
          <div className="stardew-stepper-row">
            <span className="stepper-label">Skin</span>
            <div className="stepper-control">
              <button type="button" onClick={() => cycle('skinTone', -1, SKIN_TONES.length)} aria-label="Previous skin tone"><ChevronLeft /></button>
              <span className="stepper-val-chip" style={{ background: currentSkin.color, color: '#382923' }}>
                {currentSkin.label}
              </span>
              <button type="button" onClick={() => cycle('skinTone', 1, SKIN_TONES.length)} aria-label="Next skin tone"><ChevronRight /></button>
            </div>
          </div>

          <div className="stardew-stepper-row">
            <span className="stepper-label">Hair</span>
            <div className="stepper-control">
              <button type="button" onClick={() => cycle('hairStyle', -1, HAIR_STYLES.length)} aria-label="Previous hairstyle"><ChevronLeft /></button>
              <span className="stepper-val-text">{currentHair.label}</span>
              <button type="button" onClick={() => cycle('hairStyle', 1, HAIR_STYLES.length)} aria-label="Next hairstyle"><ChevronRight /></button>
            </div>
          </div>

          <div className="stardew-stepper-row">
            <span className="stepper-label">Hair Color</span>
            <div className="stepper-control">
              <button type="button" onClick={() => cycle('hairColor', -1, HAIR_COLORS.length)} aria-label="Previous hair color"><ChevronLeft /></button>
              <span className="stepper-val-chip" style={{ background: currentHairColor.color, color: '#fff' }}>
                {currentHairColor.label}
              </span>
              <button type="button" onClick={() => cycle('hairColor', 1, HAIR_COLORS.length)} aria-label="Next hair color"><ChevronRight /></button>
            </div>
          </div>

          <div className="stardew-stepper-row">
            <span className="stepper-label">Outfit</span>
            <div className="stepper-control">
              <button type="button" onClick={() => cycle('shirtStyle', -1, SHIRT_STYLES.length)} aria-label="Previous outfit"><ChevronLeft /></button>
              <span className="stepper-val-text">{currentShirt.label}</span>
              <button type="button" onClick={() => cycle('shirtStyle', 1, SHIRT_STYLES.length)} aria-label="Next outfit"><ChevronRight /></button>
            </div>
          </div>

          <div className="stardew-stepper-row">
            <span className="stepper-label">Outfit Color</span>
            <div className="stepper-control">
              <button type="button" onClick={() => cycle('shirtColor', -1, SHIRT_COLORS.length)} aria-label="Previous shirt color"><ChevronLeft /></button>
              <span className="stepper-val-chip" style={{ background: currentShirtColor.color, color: '#333' }}>
                {currentShirtColor.label}
              </span>
              <button type="button" onClick={() => cycle('shirtColor', 1, SHIRT_COLORS.length)} aria-label="Next shirt color"><ChevronRight /></button>
            </div>
          </div>

          <div className="stardew-stepper-row">
            <span className="stepper-label">Accessory</span>
            <div className="stepper-control">
              <button type="button" onClick={() => cycle('accessory', -1, ACCESSORIES.length)} aria-label="Previous accessory"><ChevronLeft /></button>
              <span className="stepper-val-text">{currentAcc.label}</span>
              <button type="button" onClick={() => cycle('accessory', 1, ACCESSORIES.length)} aria-label="Next accessory"><ChevronRight /></button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Stardew Character Info & Study Stats */}
      <div className="profile-details-column">
        {/* Passport Header Banner */}
        <div className="profile-parchment-card">
          <div className="parchment-stamp-header">
            <h3 className="stardew-passport-title">Caretaker License & Passport</h3>
            <span className="parchment-motto">Official Mochi Meadow Citizen</span>
          </div>

          <div className="stardew-fields-grid">
            <div className="stardew-input-group">
              <label htmlFor="prof-name" className="stardew-field-label">Name</label>
              <input
                id="prof-name"
                type="text"
                className="stardew-text-input"
                value={nameDraft}
                maxLength={24}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Your cute nickname..."
              />
            </div>

            <div className="stardew-input-group">
              <label htmlFor="prof-meadow" className="stardew-field-label">Meadow / Farm</label>
              <div className="stardew-farm-input-wrap">
                <input
                  id="prof-meadow"
                  type="text"
                  className="stardew-text-input"
                  value={meadowDraft}
                  maxLength={28}
                  onChange={(e) => setMeadowDraft(e.target.value)}
                  placeholder="Sanctuary name..."
                />
              </div>
            </div>

            <div className="stardew-input-group">
              <label htmlFor="prof-fav" className="stardew-field-label">Favorite Thing</label>
              <input
                id="prof-fav"
                type="text"
                className="stardew-text-input"
                value={favDraft}
                maxLength={30}
                onChange={(e) => setFavDraft(e.target.value)}
                placeholder="What brings you joy while studying?"
              />
            </div>

            <div className="stardew-input-group">
              <label className="stardew-field-label">Companion Preference</label>
              <div className="stepper-control stardew-companion-stepper">
                <button type="button" onClick={() => cycleCompanion(-1)} aria-label="Previous companion"><ChevronLeft /></button>
                <span className="stepper-val-chip companion-chip">
                  <span className="comp-dot" />
                  {currentComp.label}
                </span>
                <button type="button" onClick={() => cycleCompanion(1)} aria-label="Next companion"><ChevronRight /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Study Stats & Hours Studied (User's primary request!) */}
        <div className="profile-stats-card">
          <div className="stats-header-line">
            <h4 className="stats-section-title">Study Record & Focus Hours</h4>
            <span className="stats-rank-tag">{rank.title}</span>
          </div>

          <div className="study-stats-quad">
            <div className="study-stat-box primary-hours">
              <span className="stat-num">
                {totalHours > 0 ? `${totalHours}h ${totalMinsRem}m` : `${totalMinsRem} mins`}
              </span>
              <span className="stat-label">Total Time Focused</span>
              <div className="stat-subtext">All-time lifetime dedication</div>
            </div>

            <div className="study-stat-box">
              <span className="stat-num">{formatStudyMinutes(studyMinutesToday)}</span>
              <span className="stat-label">Today's Focus</span>
              <div className="stat-subtext">Daily Goal: {formatStudyMinutes(studyMinutesGoal)}</div>
            </div>

            <div className="study-stat-box">
              <span className="stat-num">{profile.totalTasksCompleted}</span>
              <span className="stat-label">Tasks Accomplished</span>
              <div className="stat-subtext">Checklist goals completed</div>
            </div>

            <div className="study-stat-box">
              <span className="stat-num">{pets.length} Mochi</span>
              <span className="stat-label">Sanctuary Pets</span>
              <div className="stat-subtext">Healthy companions in care</div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="level-progression-bar-wrap">
            <div className="progression-labels">
              <span>Level {rank.level} Caretaker</span>
              <span>Next Rank at {rank.nextThreshold} mins</span>
            </div>
            <div className="progression-track">
              <div
                className="progression-fill"
                style={{ width: `${rank.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Active Buff Notice */}
          <div className="profile-buff-strip">
            <span className="buff-strip-icon" aria-hidden>
              <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                <path d="M3 6h8v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z" fill="#88cfae" />
                <path d="M11 7h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2" stroke="#88cfae" strokeWidth="1.5" />
                <path d="M5 3c0 1 1 1 1 2M8 2c0 1 1 1 1 2" stroke="#6ab08f" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </span>
            <div className="buff-strip-info">
              <span className="buff-strip-title">
                {drinkBuff && drinkBuff.expiresAt > Date.now()
                  ? `${drinkBuff.name} (${drinkBuff.effectLabel})`
                  : 'No active café buff'}
              </span>
              <span className="buff-strip-sub">
                {drinkBuff && drinkBuff.expiresAt > Date.now()
                  ? `Active bonus rate +${drinkBuff.bonusRate} pts/min`
                  : 'Visit the Study Café to enjoy warm matcha or boba!'}
              </span>
            </div>
          </div>
        </div>

        {/* Achievement Stamps & Milestones */}
        <div className="profile-stamps-card">
          <h4 className="stamps-title">Meadow Milestone Stamps</h4>
          <div className="stamps-grid">
            <div className={`stamp-pill ${profile.totalStudyMinutesAllTime >= 1 ? 'earned' : 'locked'}`}>
              <span className="stamp-icon" aria-hidden>
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                  <path d="M8 14V8M8 8c0-3-3-5-6-5 0 4 3 6 6 5zM8 8c0-3 3-5 6-5 0 4-3 6-6 5z" fill="#88cfae" stroke="#529977" strokeWidth="1" />
                </svg>
              </span>
              <div className="stamp-details">
                <span className="stamp-name">First Sprout</span>
                <span className="stamp-desc">Finished first study session</span>
              </div>
            </div>

            <div className={`stamp-pill ${drinkBuff ? 'earned' : 'locked'}`}>
              <span className="stamp-icon" aria-hidden>
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                  <rect x="3" y="6" width="8" height="7" rx="2" fill="#d4a373" />
                  <path d="M11 7h2a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1-1.5 1.5h-2" stroke="#b08055" strokeWidth="1.2" />
                  <path d="M5 3v2M8 3v2" stroke="#d4a373" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="stamp-details">
                <span className="stamp-name">Café Regular</span>
                <span className="stamp-desc">Ordered a study drink</span>
              </div>
            </div>

            <div className={`stamp-pill ${profile.totalTasksCompleted >= 3 ? 'earned' : 'locked'}`}>
              <span className="stamp-icon" aria-hidden>
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                  <polygon points="8,2 10,6.5 15,7 11.2,10.5 12.3,15 8,12.5 3.7,15 4.8,10.5 1,7 6,6.5" fill="#fbd38d" stroke="#d69e2e" strokeWidth="1" />
                </svg>
              </span>
              <div className="stamp-details">
                <span className="stamp-name">Task Champion</span>
                <span className="stamp-desc">Completed 3+ checklist goals</span>
              </div>
            </div>

            <div className={`stamp-pill ${profile.totalStudyMinutesAllTime >= 60 ? 'earned' : 'locked'}`}>
              <span className="stamp-icon" aria-hidden>
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
                  <polygon points="8,3 15,6.5 8,10 1,6.5" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
                  <path d="M4 8.5v4c0 1.5 2 2.5 4 2.5s4-1 4-2.5v-4" stroke="#3b82f6" strokeWidth="1.2" fill="none" />
                  <line x1="13" y1="7" x2="13" y2="12" stroke="#60a5fa" strokeWidth="1.5" />
                </svg>
              </span>
              <div className="stamp-details">
                <span className="stamp-name">Century Scholar</span>
                <span className="stamp-desc">Focused for 60+ minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Stardew [OK] Button */}
        <div className="profile-bottom-actions">
          {savedToast && <span className="profile-saved-toast">Saved to Passport!</span>}
          <button
            type="button"
            className="stardew-ok-btn"
            onClick={handleSaveAndConfirm}
            aria-label="Confirm and save passport profile"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
