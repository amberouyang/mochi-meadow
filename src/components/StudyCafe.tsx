import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './StudyCafe.css';

interface StudyCafeProps {
  onBackToMeadow: () => void;
  onOpenNotebook: () => void;
}

type AudioMode = 'none' | 'lofi' | 'rain' | 'chimes' | 'cafe';
type CafeSeat = 'window' | 'counter' | 'fireplace';

interface Drink {
  id: string;
  name: string;
  desc: string;
  buffTitle: string;
  buffSummary: string;
  cost: number;
  color: string;
  bonusRate: number;
}

const DRINKS: Drink[] = [
  {
    id: 'matcha',
    name: 'Matcha Cloud Latte',
    desc: 'Sweet iced matcha with oat foam · Calms racing thoughts',
    buffTitle: 'Matcha Calm',
    buffSummary: '+2 bonus points every study minute',
    cost: 5,
    color: '#a8d5ba',
    bonusRate: 2,
  },
  {
    id: 'strawberry',
    name: 'Strawberry Boba Milk',
    desc: 'Fresh strawberry puree & tapioca · Boosts sweet mood',
    buffTitle: 'Sweet Boost',
    buffSummary: 'Passively restores pet energy while studying',
    cost: 5,
    color: '#ffccd5',
    bonusRate: 1,
  },
  {
    id: 'chamomile',
    name: 'Chamomile Honey Pot',
    desc: 'Steamed floral tea with lavender honey · Relieves study stress',
    buffTitle: 'Stress Relief',
    buffSummary: '+1 bonus point & warms incubating eggs',
    cost: 5,
    color: '#ffe599',
    bonusRate: 1,
  },
  {
    id: 'americano',
    name: 'Iced Meadow Americano',
    desc: 'Smooth cold drip coffee with clean finish · Sharpens deep focus',
    buffTitle: 'Deep Focus',
    buffSummary: '+2 bonus points during focus sessions',
    cost: 5,
    color: '#b08968',
    bonusRate: 2,
  },
  {
    id: 'caramel',
    name: 'Warm Caramel Macchiato',
    desc: 'Velvety espresso with vanilla bean & warm caramel swirl',
    buffTitle: 'Cozy Warmth',
    buffSummary: '+10 instant bonus points on first sip',
    cost: 5,
    color: '#d4a373',
    bonusRate: 1,
  },
];

export function StudyCafe({ onBackToMeadow, onOpenNotebook }: StudyCafeProps) {
  const points = useStore((s) => s.points);
  const spendPoints = useStore((s) => s.spendPoints);
  const addPoints = useStore((s) => s.addPoints);
  const studyState = useStore((s) => s.studyState);
  const setStudyState = useStore((s) => s.setStudyState);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const playerName = useStore((s) => s.playerName);
  const drinkBuff = useStore((s) => s.drinkBuff);
  const setDrinkBuff = useStore((s) => s.setDrinkBuff);

  const [activeSeat, setActiveSeat] = useState<CafeSeat>('window');
  const [audioMode, setAudioMode] = useState<AudioMode>('none');
  const [toast, setToast] = useState<string | null>(null);
  const [activeDrink, setActiveDrink] = useState<Drink>(DRINKS[0]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<{ stop: () => void } | null>(null);

  // Esc key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBackToMeadow();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToMeadow]);

  // Web Audio ambient audio & lo-fi beat synthesizer (100% offline, zero network requests)
  useEffect(() => {
    if (soundNodeRef.current) {
      soundNodeRef.current.stop();
      soundNodeRef.current = null;
    }

    if (audioMode === 'none') {
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (audioMode === 'lofi') {
        // Soothing Lo-Fi 7th Chords sequence on warm electric piano (Cmaj7 -> Am7 -> Dm7 -> G7)
        const chordProgression = [
          [261.63, 329.63, 392.0, 493.88], // Cmaj7: C4, E4, G4, B4
          [220.0, 261.63, 329.63, 392.0],  // Am7: A3, C4, E4, G4
          [293.66, 349.23, 440.0, 523.25], // Dm7: D4, F4, A4, C5
          [196.0, 246.94, 293.66, 349.23], // G7: G3, B3, D4, F4
        ];
        let chordIdx = 0;
        let isStopped = false;
        let timerId: number | null = null;

        const playNextChord = () => {
          if (isStopped) return;
          const chord = chordProgression[chordIdx % chordProgression.length];
          chordIdx++;

          chord.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = i === 0 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);

            const t = ctx.currentTime + i * 0.035;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.045, t + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 3.3);
          });

          timerId = window.setTimeout(playNextChord, 3400);
        };

        playNextChord();
        soundNodeRef.current = {
          stop: () => {
            isStopped = true;
            if (timerId) window.clearTimeout(timerId);
          },
        };
      } else if (audioMode === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.04;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 720;
        const gain = ctx.createGain();
        gain.gain.value = 0.16;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        soundNodeRef.current = {
          stop: () => {
            try {
              source.stop();
              source.disconnect();
            } catch {
              /* ignore */
            }
          },
        };
      } else if (audioMode === 'chimes') {
        let timerId: number | null = null;
        let isStopped = false;
        const notes = [523.25, 587.33, 659.25, 783.99, 880.0];

        const playChime = () => {
          if (isStopped) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const freq = notes[Math.floor(Math.random() * notes.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 3.6);
          timerId = window.setTimeout(playChime, 2200 + Math.random() * 2600);
        };
        playChime();
        soundNodeRef.current = {
          stop: () => {
            isStopped = true;
            if (timerId) window.clearTimeout(timerId);
          },
        };
      } else if (audioMode === 'cafe') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.value = 140;
        osc2.type = 'triangle';
        osc2.frequency.value = 175;
        gain.gain.value = 0.035;
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        soundNodeRef.current = {
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
              osc1.disconnect();
              osc2.disconnect();
            } catch {
              /* ignore */
            }
          },
        };
      }
    } catch {
      /* AudioContext not allowed before user interaction */
    }

    return () => {
      if (soundNodeRef.current) {
        soundNodeRef.current.stop();
        soundNodeRef.current = null;
      }
    };
  }, [audioMode]);

  const handleOrderDrink = (drink: Drink) => {
    setActiveDrink(drink);
    if (points >= drink.cost) {
      spendPoints(drink.cost);
    } else {
      addPoints(10);
    }

    // Activate the drink buff for 30 minutes!
    const newBuff = {
      drinkId: drink.id,
      name: drink.name,
      effectLabel: drink.buffSummary,
      bonusRate: drink.bonusRate,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };
    setDrinkBuff(newBuff);

    if (drink.id === 'caramel') {
      addPoints(10);
    }

    setToast(`Enjoy your ${drink.name}! Active buff: ${drink.buffTitle} (${drink.buffSummary}) for 30 min.`);
    window.setTimeout(() => setToast(null), 4000);
  };

  const buffRemainingMin = drinkBuff
    ? Math.max(0, Math.ceil((drinkBuff.expiresAt - Date.now()) / 60000))
    : 0;

  return (
    <div className="study-cafe-screen">
      {/* Top Bar */}
      <header className="cafe-top-bar">
        <button type="button" className="cafe-back-btn" onClick={onBackToMeadow}>
          ← Back to Meadow
        </button>
        <div className="cafe-brand">
          <span className="cafe-title">The Study Café</span>
          <span className="cafe-tagline">Fresh tea, lo-fi beats, and peaceful focus</span>
        </div>
        {/* Points live in the shared meadow top chips — avoid a second overlapping pill */}
        <div className="cafe-top-spacer" aria-hidden />
      </header>

      {/* Active Drink Buff Ribbon */}
      {drinkBuff && buffRemainingMin > 0 && (
        <div className="cafe-buff-banner">
          <span className="cafe-buff-badge">Active Sip:</span>
          <span className="cafe-buff-name">{drinkBuff.name}</span>
          <span className="cafe-buff-sep">·</span>
          <span className="cafe-buff-desc">{drinkBuff.effectLabel}</span>
          <span className="cafe-buff-time">({buffRemainingMin} min left)</span>
        </div>
      )}

      {/* Seating Picker Strip */}
      <div className="cafe-seat-strip">
        <span className="cafe-seat-label">Select Table:</span>
        <div className="cafe-seat-options">
          <button
            type="button"
            className={`cafe-seat-btn ${activeSeat === 'window' ? 'is-active' : ''}`}
            onClick={() => setActiveSeat('window')}
          >
            Window Booth
          </button>
          <button
            type="button"
            className={`cafe-seat-btn ${activeSeat === 'counter' ? 'is-active' : ''}`}
            onClick={() => setActiveSeat('counter')}
          >
            Barista Counter
          </button>
          <button
            type="button"
            className={`cafe-seat-btn ${activeSeat === 'fireplace' ? 'is-active' : ''}`}
            onClick={() => setActiveSeat('fireplace')}
          >
            Fireplace Corner
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="cafe-content-grid">
        {/* Left Column: Drink Menu */}
        <section className="cafe-card cafe-menu-card">
          <div className="cafe-card-header">
            <h2 className="cafe-card-title">Drink Menu</h2>
            <span className="cafe-card-hint">
              Each handcrafted study drink grants a 30-minute focus buff!
            </span>
          </div>

          <div className="cafe-drinks-list">
            {DRINKS.map((d) => (
              <div
                key={d.id}
                className={`cafe-drink-row ${activeDrink.id === d.id ? 'is-selected' : ''}`}
                onClick={() => handleOrderDrink(d)}
                role="button"
                tabIndex={0}
              >
                <div className="cafe-drink-swatch" style={{ background: d.color }} />
                <div className="cafe-drink-info">
                  <div className="cafe-drink-top">
                    <span className="cafe-drink-name">{d.name}</span>
                    <span className="cafe-drink-cost">{d.cost} pts</span>
                  </div>
                  <p className="cafe-drink-desc">{d.desc}</p>
                  <span className="cafe-drink-buff-tag">{d.buffTitle}: {d.buffSummary}</span>
                </div>
              </div>
            ))}
          </div>

          {toast && <div className="cafe-toast-bubble" role="status">{toast}</div>}
        </section>

        {/* Right Column: Table Study Station & Audio Player */}
        <div className="cafe-right-col">
          {/* Active Table Focus Station */}
          <section className="cafe-card cafe-study-station">
            <div className="cafe-card-header">
              <h2 className="cafe-card-title">
                {activeSeat === 'window'
                  ? 'Meadow Window Booth'
                  : activeSeat === 'counter'
                    ? 'Warm Barista Counter'
                    : 'Cozy Fireplace Corner'}
              </h2>
              <span className="cafe-card-hint">Table reserved for {playerName || 'Friend'}</span>
            </div>

            <div className="cafe-study-display">
              <div className="cafe-mug-preview" style={{ borderColor: activeDrink.color }}>
                <span className="cafe-mug-label">Currently Sipping:</span>
                <span className="cafe-mug-name">{activeDrink.name}</span>
              </div>

              <div className="cafe-study-meta">
                <span className="cafe-meta-label">Today&apos;s Focus Progress</span>
                <span className="cafe-meta-val">
                  {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)}
                </span>
              </div>

              <div className="cafe-actions-row">
                <button
                  type="button"
                  className={`cafe-action-btn ${studyState === 'studying' ? 'is-studying' : 'is-start'}`}
                  onClick={() => setStudyState(studyState === 'studying' ? 'idle' : 'studying')}
                >
                  {studyState === 'studying' ? 'Pause Café Study' : 'Start Studying at Table'}
                </button>
                <button
                  type="button"
                  className="cafe-action-btn cafe-notebook-btn"
                  onClick={onOpenNotebook}
                >
                  Open Notebook
                </button>
              </div>
            </div>
          </section>

          {/* Lo-Fi & Ambient Sound Controller */}
          <section className="cafe-card cafe-ambient-card">
            <div className="cafe-card-header">
              <h2 className="cafe-card-title">Background Ambience & Lo-Fi</h2>
              <span className="cafe-card-hint">
                Gentle audio synthesizer running locally in your browser
              </span>
            </div>

            <div className="cafe-ambient-buttons">
              <button
                type="button"
                className={`cafe-ambient-btn ${audioMode === 'lofi' ? 'is-active' : ''}`}
                onClick={() => setAudioMode('lofi')}
              >
                Lo-Fi Chords
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn ${audioMode === 'rain' ? 'is-active' : ''}`}
                onClick={() => setAudioMode('rain')}
              >
                Rain on Window
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn ${audioMode === 'chimes' ? 'is-active' : ''}`}
                onClick={() => setAudioMode('chimes')}
              >
                Soft Chimes
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn ${audioMode === 'cafe' ? 'is-active' : ''}`}
                onClick={() => setAudioMode('cafe')}
              >
                Café Murmur
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn cafe-mute-btn ${audioMode === 'none' ? 'is-active' : ''}`}
                onClick={() => setAudioMode('none')}
              >
                Mute
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
