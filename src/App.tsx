import { useMemo, useState, useCallback, useEffect } from 'react';
import { MainView } from './components/MainView';
import { SidebarView } from './components/SidebarView';
import { OverlayView } from './components/OverlayView';
import { IntroScreen } from './components/IntroScreen';
import { useStore } from './store/useStore';
import './App.css';

const MEADOW_INTRO_STORAGE_KEY = 'mochiMeadow.meadowIntro.v1';

function getRoute() {
  const raw = window.location.hash.slice(1) || 'main';
  const hash = raw.replace(/^\//, '');
  if (hash === 'sidebar') return 'sidebar';
  if (hash === 'overlay') return 'overlay';
  return 'main';
}

function hasSeenMeadowIntro(): boolean {
  try {
    return Boolean(localStorage.getItem(MEADOW_INTRO_STORAGE_KEY));
  } catch {
    return false;
  }
}

export default function App() {
  const route = useMemo(() => getRoute(), [window.location.hash]);
  const unlockGarden = useStore((s) => s.unlockGarden);
  const claimWelcomeBonus = useStore((s) => s.claimWelcomeBonus);
  const setPlayerName = useStore((s) => s.setPlayerName);
  const playerName = useStore((s) => s.playerName);
  const welcomeBonusClaimed = useStore((s) => s.welcomeBonusClaimed);

  const hasOnboarded = Boolean(playerName.trim()) && welcomeBonusClaimed;

  const [showIntro, setShowIntro] = useState(!hasOnboarded);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [showMeadowIntro, setShowMeadowIntro] = useState(false);
  const [pendingName, setPendingName] = useState('');

  // Returning players: skip Play / name / welcome and open the meadow.
  useEffect(() => {
    if (!hasOnboarded) return;
    unlockGarden();
    setShowIntro(false);
    setShowNamePopup(false);
    setShowBonusPopup(false);
  }, [hasOnboarded, unlockGarden]);

  const onIntroComplete = useCallback(() => {
    setShowIntro(false);
    unlockGarden();
    setShowNamePopup(true);
  }, [unlockGarden]);

  const onConfirmName = useCallback(() => {
    const name = pendingName.trim();
    if (!name) return;
    setPlayerName(name);
    setShowNamePopup(false);
    setShowBonusPopup(true);
  }, [pendingName, setPlayerName]);

  const onCollectBonus = useCallback(() => {
    claimWelcomeBonus();
    setShowBonusPopup(false);
    if (!hasSeenMeadowIntro()) {
      setShowMeadowIntro(true);
    }
  }, [claimWelcomeBonus]);

  const onDismissMeadowIntro = useCallback(() => {
    try {
      localStorage.setItem(MEADOW_INTRO_STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowMeadowIntro(false);
  }, []);

  if (route === 'sidebar') return <SidebarView />;
  if (route === 'overlay') return <OverlayView />;

  return (
    <>
      <MainView />
      {showIntro && <IntroScreen onPlay={onIntroComplete} />}
      {showNamePopup && (
        <div className="bonus-popup-overlay">
          <div className="bonus-popup">
            <p className="bonus-popup-text">What’s your name?</p>
            <input
              className="name-popup-input"
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && onConfirmName()}
            />
            <button
              type="button"
              className="bonus-popup-btn"
              onClick={onConfirmName}
              disabled={!pendingName.trim()}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {showBonusPopup && (
        <div className="bonus-popup-overlay">
          <div className="bonus-popup">
            <p className="bonus-popup-text">
              Welcome {playerName || 'friend'}! Here is 50 points to get you started!
            </p>
            <button type="button" className="bonus-popup-btn" onClick={onCollectBonus}>
              Collect
            </button>
          </div>
        </div>
      )}
      {showMeadowIntro && (
        <div className="bonus-popup-overlay">
          <div
            className="bonus-popup meadow-intro-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meadow-intro-title"
          >
            <h2 id="meadow-intro-title" className="meadow-intro-title">
              How Mochi Meadow works
            </h2>
            <ul className="meadow-intro-list">
              <li>
                <strong>Toolbar</strong> — Use the icons above: to-do (📝), study timer (⏱), egg
                sanctuary (🥚), and store (🛒).
              </li>
              <li>
                <strong>Points</strong> — Completing tasks and studying earns points. Spend them on
                pets and items in the store.
              </li>
              <li>
                <strong>The meadow</strong> — You earn visits by finishing today&apos;s tasks{' '}
                <em>or</em> reaching your study goal. When the meadow is locked, use &quot;See if the
                garden is open&quot; to check your progress.
              </li>
            </ul>
            <button type="button" className="bonus-popup-btn meadow-intro-btn" onClick={onDismissMeadowIntro}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
