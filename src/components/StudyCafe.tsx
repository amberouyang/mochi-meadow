import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './StudyCafe.css';

interface StudyCafeProps {
  onBackToMeadow: () => void;
  onOpenNotebook: () => void;
}

type AmbientSound = 'none' | 'rain' | 'chimes' | 'cafe';

interface Drink {
  id: string;
  name: string;
  desc: string;
  cost: number;
  color: string;
}

const DRINKS: Drink[] = [
  {
    id: 'matcha',
    name: 'Matcha Cloud Latte',
    desc: 'Sweet iced matcha with oat foam · Calms racing thoughts',
    cost: 5,
    color: '#a8d5ba',
  },
  {
    id: 'strawberry',
    name: 'Strawberry Boba Milk',
    desc: 'Fresh strawberry puree & tapioca · Boosts sweet mood',
    cost: 5,
    color: '#ffccd5',
  },
  {
    id: 'chamomile',
    name: 'Chamomile Honey Pot',
    desc: 'Steamed floral tea with lavender honey · Relieves study stress',
    cost: 5,
    color: '#ffe599',
  },
  {
    id: 'americano',
    name: 'Iced Meadow Americano',
    desc: 'Smooth cold drip coffee with clean finish · Sharpens deep focus',
    cost: 5,
    color: '#b08968',
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

  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
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

  // Web Audio ambient sound synthesizer (100% offline, zero network dependencies)
  useEffect(() => {
    if (soundNodeRef.current) {
      soundNodeRef.current.stop();
      soundNodeRef.current = null;
    }

    if (ambientSound === 'none') {
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (ambientSound === 'rain') {
        // Soft low-passed pink noise buffer
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
        filter.frequency.value = 750;
        const gain = ctx.createGain();
        gain.gain.value = 0.18;
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
      } else if (ambientSound === 'chimes') {
        // Periodic gentle soothing bell tones
        let timerId: number | null = null;
        let isStopped = false;
        const notes = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5, D5, E5, G5, A5 pentatonic

        const playChime = () => {
          if (isStopped) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const freq = notes[Math.floor(Math.random() * notes.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 3.6);
          timerId = window.setTimeout(playChime, 2200 + Math.random() * 2800);
        };
        playChime();
        soundNodeRef.current = {
          stop: () => {
            isStopped = true;
            if (timerId) window.clearTimeout(timerId);
          },
        };
      } else if (ambientSound === 'cafe') {
        // Warm low coffee shop murmur
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
  }, [ambientSound]);

  const handleOrderDrink = (drink: Drink) => {
    setActiveDrink(drink);
    if (points >= drink.cost) {
      spendPoints(drink.cost);
      setToast(`Enjoy your ${drink.name}! You feel calm and focused.`);
    } else {
      // First order on the house!
      addPoints(10);
      setToast(`Barista treat: Here is your free ${drink.name}! (+10 pts)`);
    }
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="study-cafe-screen">
      {/* Top Navigation Bar */}
      <header className="cafe-top-bar">
        <button type="button" className="cafe-back-btn" onClick={onBackToMeadow}>
          ← Back to Meadow
        </button>
        <div className="cafe-brand">
          <span className="cafe-title">The Study Café</span>
          <span className="cafe-tagline">Fresh tea, ambient rain, and peaceful focus</span>
        </div>
        <div className="cafe-points-pill">
          <span className="cafe-points-label">Points</span>
          <span className="cafe-points-num">{points}</span>
        </div>
      </header>

      {/* Main Café Interior Layout */}
      <div className="cafe-content-grid">
        {/* Left Side: Counter & Study Menu */}
        <section className="cafe-card cafe-menu-card">
          <div className="cafe-card-header">
            <h2 className="cafe-card-title">Drink Menu</h2>
            <span className="cafe-card-hint">Order a calm sip for your study session</span>
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
                </div>
              </div>
            ))}
          </div>

          {toast && <div className="cafe-toast-bubble" role="status">{toast}</div>}
        </section>

        {/* Right Side: Cozy Study Station */}
        <div className="cafe-right-col">
          {/* Focus Station Card */}
          <section className="cafe-card cafe-study-station">
            <div className="cafe-card-header">
              <h2 className="cafe-card-title">Your Café Table</h2>
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

          {/* Ambient Sound Controller */}
          <section className="cafe-card cafe-ambient-card">
            <div className="cafe-card-header">
              <h2 className="cafe-card-title">Background Ambience</h2>
              <span className="cafe-card-hint">Synthesized audio to block distractions</span>
            </div>

            <div className="cafe-ambient-buttons">
              <button
                type="button"
                className={`cafe-ambient-btn ${ambientSound === 'none' ? 'is-active' : ''}`}
                onClick={() => setAmbientSound('none')}
              >
                Mute
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn ${ambientSound === 'rain' ? 'is-active' : ''}`}
                onClick={() => setAmbientSound('rain')}
              >
                Rain on Window
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn ${ambientSound === 'chimes' ? 'is-active' : ''}`}
                onClick={() => setAmbientSound('chimes')}
              >
                Soft Chimes
              </button>
              <button
                type="button"
                className={`cafe-ambient-btn ${ambientSound === 'cafe' ? 'is-active' : ''}`}
                onClick={() => setAmbientSound('cafe')}
              >
                Café Murmur
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
