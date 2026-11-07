import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './StudyCafe.css';

interface StudyCafeProps {
  onBackToMeadow: () => void;
  onOpenNotebook: () => void;
}

type AudioMode = 'none' | 'lofi' | 'rain' | 'chimes' | 'waves' | 'park';
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

const SEAT_AMBIENCE: Record<CafeSeat, AudioMode> = {
  window: 'park',
  counter: 'waves',
  fireplace: 'chimes',
};

const SEAT_COPY: Record<
  CafeSeat,
  { title: string; hint: string; action: string }
> = {
  window: {
    title: 'Window Booth',
    hint: 'Meadow light, soft rain, and deep focus',
    action: 'Sit & study',
  },
  counter: {
    title: 'Barista Counter',
    hint: 'Order a study drink for a 30-minute buff',
    action: 'Order a drink',
  },
  fireplace: {
    title: 'Fireplace Corner',
    hint: 'Warm glow and gentle study energy',
    action: 'Cozy up & study',
  },
};

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
  const [audioMode, setAudioMode] = useState<AudioMode>('park');
  const [toast, setToast] = useState<string | null>(null);
  const [activeDrink, setActiveDrink] = useState<Drink>(DRINKS[0]);
  const [panelOpen, setPanelOpen] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBackToMeadow();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToMeadow]);

  // Seat choice sets the room vibe (ambience + open the matching panel)
  const chooseSeat = (seat: CafeSeat) => {
    setActiveSeat(seat);
    setAudioMode(SEAT_AMBIENCE[seat]);
    setPanelOpen(true);
    if (seat === 'window') {
      setToast('Window booth ready — park breeze and birds outside.');
    } else if (seat === 'counter') {
      setToast('Barista counter open — pick a study drink.');
    } else {
      setToast('Fireplace corner warmed up — cozy study time.');
    }
    window.setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    if (soundNodeRef.current) {
      soundNodeRef.current.stop();
      soundNodeRef.current = null;
    }

    if (audioMode === 'none') return;

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
        const chordProgression = [
          [261.63, 329.63, 392.0, 493.88],
          [220.0, 261.63, 329.63, 392.0],
          [293.66, 349.23, 440.0, 523.25],
          [196.0, 246.94, 293.66, 349.23],
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
        let b0 = 0,
          b1 = 0,
          b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
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
      } else if (audioMode === 'waves') {
        // Ocean waves — same noise path as rain, with slow swell automation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          data[i] = (b0 + b1 + b2) * 0.12;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 700;
        filter.Q.value = 0.7;

        const foam = ctx.createBiquadFilter();
        foam.type = 'highpass';
        foam.frequency.value = 180;

        const gain = ctx.createGain();
        gain.gain.value = 0.22;

        source.connect(filter);
        filter.connect(foam);
        foam.connect(gain);
        gain.connect(ctx.destination);
        source.start();

        let isStopped = false;
        let swellTimer: number | null = null;
        let phase = 0;

        const tickSwell = () => {
          if (isStopped) return;
          phase += 0.09;
          const swell = 0.5 + 0.5 * Math.sin(phase);
          const now = ctx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(Math.max(0.05, gain.gain.value), now);
          gain.gain.linearRampToValueAtTime(0.12 + swell * 0.3, now + 0.25);
          filter.frequency.cancelScheduledValues(now);
          filter.frequency.setValueAtTime(filter.frequency.value, now);
          filter.frequency.linearRampToValueAtTime(420 + swell * 780, now + 0.25);
          swellTimer = window.setTimeout(tickSwell, 220);
        };
        tickSwell();

        soundNodeRef.current = {
          stop: () => {
            isStopped = true;
            if (swellTimer) window.clearTimeout(swellTimer);
            try {
              source.stop();
              source.disconnect();
            } catch {
              /* ignore */
            }
          },
        };
      } else if (audioMode === 'park') {
        // Soft park breeze + occasional bird chirps
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          data[i] = (b0 + b1 + b2) * 0.05;
        }

        const master = ctx.createGain();
        master.gain.value = 0.4;
        master.connect(ctx.destination);

        // Wind / leaves bed
        const wind = ctx.createBufferSource();
        wind.buffer = buffer;
        wind.loop = true;
        const windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 380;
        windFilter.Q.value = 0.6;
        const windLow = ctx.createBiquadFilter();
        windLow.type = 'lowpass';
        windLow.frequency.value = 900;
        const windGain = ctx.createGain();
        windGain.gain.value = 0.22;
        wind.connect(windFilter);
        windFilter.connect(windLow);
        windLow.connect(windGain);
        windGain.connect(master);
        wind.start();

        let isStopped = false;
        const timers: number[] = [];

        const chirp = () => {
          if (isStopped) return;
          const now = ctx.currentTime;
          const notes = 1 + Math.floor(Math.random() * 3);
          let t = now;
          const base = 1800 + Math.random() * 1400;

          for (let i = 0; i < notes; i++) {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            const startF = base + Math.random() * 400;
            const endF = startF + 350 + Math.random() * 700;
            osc.frequency.setValueAtTime(startF, t);
            osc.frequency.linearRampToValueAtTime(endF, t + 0.07);
            osc.frequency.linearRampToValueAtTime(startF * 0.92, t + 0.12);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(0.055, t + 0.02);
            g.gain.linearRampToValueAtTime(0.0001, t + 0.14);
            osc.connect(g);
            g.connect(master);
            osc.start(t);
            osc.stop(t + 0.16);
            t += 0.11 + Math.random() * 0.08;
          }

          timers.push(window.setTimeout(chirp, 1400 + Math.random() * 3200));
        };
        timers.push(window.setTimeout(chirp, 600));

        soundNodeRef.current = {
          stop: () => {
            isStopped = true;
            for (const id of timers) window.clearTimeout(id);
            try {
              wind.stop();
              wind.disconnect();
            } catch {
              /* ignore */
            }
          },
        };
      }
    } catch {
      /* AudioContext blocked until gesture */
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

    setDrinkBuff({
      drinkId: drink.id,
      name: drink.name,
      effectLabel: drink.buffSummary,
      bonusRate: drink.bonusRate,
      expiresAt: Date.now() + 30 * 60 * 1000,
    });

    if (drink.id === 'caramel') {
      addPoints(10);
    }

    setToast(`Sipped ${drink.name} — ${drink.buffTitle} for 30 min.`);
    window.setTimeout(() => setToast(null), 3500);
  };

  const buffRemainingMin = drinkBuff
    ? Math.max(0, Math.ceil((drinkBuff.expiresAt - Date.now()) / 60000))
    : 0;

  const seat = SEAT_COPY[activeSeat];
  const studying = studyState === 'studying';

  return (
    <div className={`study-cafe-screen seat-${activeSeat}`}>
      <header className="cafe-top-bar">
        <button type="button" className="cafe-back-btn" onClick={onBackToMeadow}>
          ← Back to Meadow
        </button>
        <div className="cafe-brand">
          <span className="cafe-title">The Study Café</span>
          <span className="cafe-tagline">Pick a spot · sip · study</span>
        </div>
        <div className="cafe-top-spacer" aria-hidden />
      </header>

      {drinkBuff && buffRemainingMin > 0 && (
        <div className="cafe-buff-banner">
          <span className="cafe-buff-badge">Sipping</span>
          <span className="cafe-buff-name">{drinkBuff.name}</span>
          <span className="cafe-buff-sep">·</span>
          <span className="cafe-buff-desc">{drinkBuff.effectLabel}</span>
          <span className="cafe-buff-time">({buffRemainingMin}m left)</span>
        </div>
      )}

      <div className="cafe-stage">
        {/* Interactive café interior */}
        <div className="cafe-scene" aria-label="Study café interior">
          <div className="cafe-scene-sky" aria-hidden />
          <div className="cafe-scene-wall" aria-hidden />
          <div className="cafe-scene-floor" aria-hidden />

          {/* Window booth — left */}
          <button
            type="button"
            className={`cafe-hotspot cafe-hotspot--window ${activeSeat === 'window' ? 'is-active' : ''}`}
            onClick={() => chooseSeat('window')}
            aria-label="Window booth. Sit and study by the meadow view."
          >
            <div className="cafe-prop cafe-prop-window" aria-hidden>
              <div className="cafe-window-glass">
                <span className="cafe-window-cloud c1" />
                <span className="cafe-window-cloud c2" />
              </div>
              <div className="cafe-window-sill" />
              <div className="cafe-booth-table" />
              <div className="cafe-booth-seat" />
            </div>
            <span className="cafe-hotspot-label">Window Booth</span>
          </button>

          {/* Barista counter — center */}
          <button
            type="button"
            className={`cafe-hotspot cafe-hotspot--counter ${activeSeat === 'counter' ? 'is-active' : ''}`}
            onClick={() => chooseSeat('counter')}
            aria-label="Barista counter. Order a study drink."
          >
            <div className="cafe-prop cafe-prop-counter" aria-hidden>
              <div className="cafe-counter-top" />
              <div className="cafe-counter-front" />
              <div className="cafe-espresso" />
              <div className="cafe-menu-board" />
            </div>
            <span className="cafe-hotspot-label">Barista Counter</span>
          </button>

          {/* Fireplace — right */}
          <button
            type="button"
            className={`cafe-hotspot cafe-hotspot--fireplace ${activeSeat === 'fireplace' ? 'is-active' : ''}`}
            onClick={() => chooseSeat('fireplace')}
            aria-label="Fireplace corner. Cozy study spot."
          >
            <div className="cafe-prop cafe-prop-fireplace" aria-hidden>
              <div className="cafe-hearth" />
              <div className="cafe-fire" />
              <div className="cafe-mantel" />
              <div className="cafe-fire-chair" />
            </div>
            <span className="cafe-hotspot-label">Fireplace</span>
          </button>

          {toast && (
            <div className="cafe-scene-toast" role="status">
              {toast}
            </div>
          )}
        </div>

        {/* Context panel for the active seat */}
        {panelOpen && (
          <aside className="cafe-focus-panel" aria-label={`${seat.title} actions`}>
            <div className="cafe-focus-head">
              <div>
                <h2 className="cafe-focus-title">{seat.title}</h2>
                <p className="cafe-focus-hint">{seat.hint}</p>
              </div>
              <button
                type="button"
                className="cafe-focus-close"
                onClick={() => setPanelOpen(false)}
                aria-label="Hide panel"
              >
                ×
              </button>
            </div>

            {(activeSeat === 'window' || activeSeat === 'fireplace') && (
              <div className="cafe-study-block">
                <div className="cafe-mug-chip" style={{ borderColor: activeDrink.color }}>
                  <span>Sipping</span>
                  <strong>{activeDrink.name}</strong>
                </div>
                <div className="cafe-progress-row">
                  <span>Today</span>
                  <strong>
                    {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)}
                  </strong>
                </div>
                {activeSeat === 'fireplace' && (
                  <p className="cafe-cozy-note">
                    Soft chimes are on. Good for gentle review sessions, {playerName || 'friend'}.
                  </p>
                )}
                <div className="cafe-focus-actions">
                  <button
                    type="button"
                    className={`cafe-primary-btn ${studying ? 'is-on' : ''}`}
                    onClick={() => setStudyState(studying ? 'idle' : 'studying')}
                  >
                    {studying ? 'Pause study' : seat.action}
                  </button>
                  <button type="button" className="cafe-secondary-btn" onClick={onOpenNotebook}>
                    Open notebook
                  </button>
                  {activeSeat === 'window' && (
                    <button
                      type="button"
                      className="cafe-secondary-btn"
                      onClick={() => chooseSeat('counter')}
                    >
                      Get a drink
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSeat === 'counter' && (
              <div className="cafe-order-block">
                <p className="cafe-order-intro">
                  Tap a drink to order. Buffs last 30 minutes while you study anywhere in the meadow.
                </p>
                <div className="cafe-drinks-list">
                  {DRINKS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`cafe-drink-row ${activeDrink.id === d.id ? 'is-selected' : ''}`}
                      onClick={() => handleOrderDrink(d)}
                    >
                      <span className="cafe-drink-swatch" style={{ background: d.color }} />
                      <span className="cafe-drink-info">
                        <span className="cafe-drink-top">
                          <span className="cafe-drink-name">{d.name}</span>
                          <span className="cafe-drink-cost">{d.cost} pts</span>
                        </span>
                        <span className="cafe-drink-buff-tag">
                          {d.buffTitle}: {d.buffSummary}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="cafe-focus-actions">
                  <button
                    type="button"
                    className="cafe-primary-btn"
                    onClick={() => chooseSeat('window')}
                  >
                    Take it to the window
                  </button>
                  <button
                    type="button"
                    className="cafe-secondary-btn"
                    onClick={() => chooseSeat('fireplace')}
                  >
                    Sit by the fire
                  </button>
                </div>
              </div>
            )}

            <div className="cafe-ambience-row" aria-label="Background ambience">
              {(
                [
                  ['park', 'Park'],
                  ['lofi', 'Lo-fi'],
                  ['rain', 'Rain'],
                  ['chimes', 'Chimes'],
                  ['waves', 'Waves'],
                  ['none', 'Mute'],
                ] as [AudioMode, string][]
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={`cafe-ambience-chip ${audioMode === mode ? 'is-active' : ''}`}
                  onClick={() => setAudioMode(mode)}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>
        )}

        {!panelOpen && (
          <button
            type="button"
            className="cafe-reopen-panel"
            onClick={() => setPanelOpen(true)}
          >
            Show {seat.title}
          </button>
        )}
      </div>
    </div>
  );
}
