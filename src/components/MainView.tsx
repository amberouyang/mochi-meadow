import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { getCalendarSeason } from '../utils/calendarSeason';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import { TodoList } from './TodoList';
import { StudyBar } from './StudyBar';
import { StudyTicker } from './StudyTicker';
import { Garden } from './Garden';
import { EggSanctuary } from './EggSanctuary';
import { StorePanel } from './StorePanel';
import { StoragePanel } from './StoragePanel';
import { SettingsPanel } from './SettingsPanel';
import {
  SkyIconBoard,
  SkyIconEgg,
  SkyIconFriends,
  SkyIconGear,
  SkyIconRooms,
  SkyIconStorage,
  SkyIconStore,
  SkyIconStudy,
  SkyIconTodo,
} from './SkyHudPixelIcons';
import './MainView.css';

type Panel = 'none' | 'todo' | 'study' | 'store' | 'storage' | 'settings';
type Screen = 'meadow' | 'nest';

export function MainView() {
  const [screen, setScreen] = useState<Screen>('meadow');
  const [panel, setPanel] = useState<Panel>('none');
  const [soonToast, setSoonToast] = useState<string | null>(null);
  const soonTimeoutRef = useRef<number | null>(null);
  const points = useStore((s) => s.points);
  const gardenUnlocked = useStore((s) => s.gardenUnlocked);
  const checkGardenAccess = useStore((s) => s.checkGardenAccess);
  const tutorialStage = useStore((s) => s.tutorialStage);
  const setTutorialStage = useStore((s) => s.setTutorialStage);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const studyState = useStore((s) => s.studyState);
  const studyGoalOverlay = useStore((s) => s.studyGoalOverlay);
  const clearStudyGoalOverlay = useStore((s) => s.clearStudyGoalOverlay);
  const playerName = useStore((s) => s.playerName);
  const evaluateBrainRot = useStore((s) => s.evaluateBrainRot);

  const season = useMemo(() => getCalendarSeason(), []);

  useEffect(() => {
    evaluateBrainRot();
  }, [evaluateBrainRot]);

  const openPanel = (next: Panel) => {
    setSoonToast(null);
    setScreen('meadow');
    setPanel((current) => (current === next ? 'none' : next));
  };

  const openNest = () => {
    if (tutorialStage === 'showSanctuaryArrow') {
      setTutorialStage('done');
    }
    setSoonToast(null);
    setPanel('none');
    setScreen((current) => (current === 'nest' ? 'meadow' : 'nest'));
  };

  useEffect(() => {
    return () => {
      if (soonTimeoutRef.current != null) {
        window.clearTimeout(soonTimeoutRef.current);
      }
    };
  }, []);

  const showComingSoon = (label: string) => {
    setPanel('none');
    setSoonToast(`${label} — coming soon!`);
    if (soonTimeoutRef.current != null) {
      window.clearTimeout(soonTimeoutRef.current);
    }
    soonTimeoutRef.current = window.setTimeout(() => {
      soonTimeoutRef.current = null;
      setSoonToast(null);
    }, 2200);
  };

  const showSanctuaryArrow = tutorialStage === 'showSanctuaryArrow';

  const focusLabel =
    studyState === 'studying'
      ? 'Focusing…'
      : studyMinutesToday >= studyMinutesGoal
        ? 'Goal met today!'
        : 'Ready to study';

  return (
    <div className="main-view" data-season={season}>
      <StudyTicker />
      <section className={`main-garden-area${screen === 'nest' ? ' is-nest-page' : ''}`}>
        <div className="main-top-chip" aria-label={`Points: ${points}`}>
          <span className="main-points-label">Points</span>
          <span className="main-points-value">{points}</span>
        </div>

        {screen === 'nest' ? (
          <EggSanctuary onBackToMeadow={() => setScreen('meadow')} />
        ) : (
          <Garden locked={!gardenUnlocked && tutorialStage === 'done'} onUnlockHint={checkGardenAccess} />
        )}
      </section>

      {panel !== 'none' && screen === 'meadow' && (
        <div className="main-panel">
          {panel === 'todo' && <TodoList />}
          {panel === 'study' && <StudyBar />}
          {panel === 'store' && <StorePanel />}
          {panel === 'storage' && <StoragePanel />}
          {panel === 'settings' && <SettingsPanel />}
        </div>
      )}

      {soonToast && (
        <div className="main-soon-toast" role="status">
          {soonToast}
        </div>
      )}

      {studyGoalOverlay && (
        <div
          className="main-study-goal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="study-goal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) clearStudyGoalOverlay();
          }}
        >
          <div className="main-study-goal-card">
            <p id="study-goal-title" className="main-study-goal-title">
              Study goal reached!
            </p>
            <p className="main-study-goal-text">
              Nice work! You&apos;ve finished today&apos;s study time. Your garden and pets are proud of
              you.
            </p>
            <button type="button" className="main-study-goal-btn" onClick={clearStudyGoalOverlay}>
              Close
            </button>
          </div>
        </div>
      )}

      <nav className="main-dock" aria-label="Mochi Meadow controls">
        <div className="main-dock-inner">
          <div className="main-dock-group" aria-label="Study tools">
            <button
              type="button"
              className={`main-dock-btn ${panel === 'todo' ? 'is-active' : ''}`}
              onClick={() => openPanel('todo')}
            >
              <span className="main-dock-icon">
                <SkyIconTodo />
              </span>
              <span className="main-dock-label">Tasks</span>
            </button>
            <button
              type="button"
              className={`main-dock-btn ${panel === 'study' ? 'is-active' : ''}`}
              onClick={() => openPanel('study')}
            >
              <span className="main-dock-icon">
                <SkyIconStudy />
              </span>
              <span className="main-dock-label">Study</span>
            </button>
            <div className="main-dock-btn-wrap">
              <button
                type="button"
                className={`main-dock-btn ${screen === 'nest' ? 'is-active' : ''}`}
                onClick={openNest}
              >
                <span className="main-dock-icon">
                  <SkyIconEgg />
                </span>
                <span className="main-dock-label">Nest</span>
              </button>
              {showSanctuaryArrow && (
                <div className="egg-hint egg-hint--dock" aria-hidden>
                  <span className="egg-hint-text">Open your nest</span>
                  <span className="egg-hint-arrow">⬇︎</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`main-dock-btn ${panel === 'store' ? 'is-active' : ''}`}
              onClick={() => openPanel('store')}
            >
              <span className="main-dock-icon">
                <SkyIconStore />
              </span>
              <span className="main-dock-label">Store</span>
            </button>
            <button
              type="button"
              className={`main-dock-btn ${panel === 'storage' ? 'is-active' : ''}`}
              onClick={() => openPanel('storage')}
              title="Open storage"
            >
              <span className="main-dock-icon">
                <SkyIconStorage />
              </span>
              <span className="main-dock-label">Storage</span>
            </button>
          </div>

          <div className="main-dock-center" aria-live="polite">
            <span className="main-dock-focus-name">{playerName || 'Friend'}</span>
            <span className="main-dock-focus-status">{focusLabel}</span>
            <span className="main-dock-focus-time">
              {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)}
            </span>
          </div>

          <div className="main-dock-group" aria-label="Social and settings">
            <button
              type="button"
              className="main-dock-btn main-dock-btn--soon"
              onClick={() => showComingSoon('Friends')}
              title="Connect with friends online (coming soon)"
            >
              <span className="main-dock-icon">
                <SkyIconFriends />
              </span>
              <span className="main-dock-label">Friends</span>
            </button>
            <button
              type="button"
              className="main-dock-btn main-dock-btn--soon"
              onClick={() => showComingSoon('Scoreboard')}
              title="See who studied the most (coming soon)"
            >
              <span className="main-dock-icon">
                <SkyIconBoard />
              </span>
              <span className="main-dock-label">Board</span>
            </button>
            <button
              type="button"
              className="main-dock-btn main-dock-btn--soon"
              onClick={() => showComingSoon('Study rooms')}
              title="Study together online (coming soon)"
            >
              <span className="main-dock-icon">
                <SkyIconRooms />
              </span>
              <span className="main-dock-label">Rooms</span>
            </button>
            <button
              type="button"
              className={`main-dock-btn ${panel === 'settings' ? 'is-active' : ''}`}
              onClick={() => openPanel('settings')}
              aria-label="Settings"
            >
              <span className="main-dock-icon">
                <SkyIconGear />
              </span>
              <span className="main-dock-label">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
