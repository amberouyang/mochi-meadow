import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { getCalendarSeason } from '../utils/calendarSeason';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import { StudyTicker } from './StudyTicker';
import { Garden } from './Garden';
import { EggSanctuary } from './EggSanctuary';
import { StudyCafe } from './StudyCafe';
import { CozyRoom } from './CozyRoom';
import { NotebookModal, type NotebookTab } from './NotebookModal';
import { type MeadowBuildingId } from './MeadowBuildings';
import { getCaretakerRank } from '../utils/playerProfileSave';
import { MILESTONES } from '../utils/gamification';
import { getSystemTimeOfDay, type TimeOfDay } from './MeadowLighting';
import { CaretakerAvatar } from './CaretakerAvatar';
import { StorePanel } from './StorePanel';
import { StoragePanel } from './StoragePanel';
import { SettingsPanel } from './SettingsPanel';
import {
  SkyIconCafe,
  SkyIconEgg,
  SkyIconGear,
  SkyIconMeadow,
  SkyIconNotebook,
  SkyIconRoom,
  SkyIconStorage,
  SkyIconStore,
} from './SkyHudPixelIcons';
import './MainView.css';

type Panel = 'none' | 'notebook' | 'store' | 'storage' | 'settings';
type Screen = 'meadow' | 'cafe' | 'room' | 'nest';

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
  const milestoneNotice = useStore((s) => s.milestoneNotice);
  const dismissMilestoneNotice = useStore((s) => s.dismissMilestoneNotice);
  const playerName = useStore((s) => s.playerName);
  const playerProfile = useStore((s) => s.playerProfile);
  const lightingMode = useStore((s) => s.lightingMode);
  const evaluateBrainRot = useStore((s) => s.evaluateBrainRot);

  const season = useMemo(() => getCalendarSeason(), []);
  const [systemTime, setSystemTime] = useState<TimeOfDay>(getSystemTimeOfDay);

  useEffect(() => {
    const interval = window.setInterval(() => setSystemTime(getSystemTimeOfDay()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const activeLighting = lightingMode === 'auto' ? systemTime : lightingMode;

  useEffect(() => {
    evaluateBrainRot();
  }, [evaluateBrainRot]);

  const rank = useMemo(
    () => getCaretakerRank(playerProfile.totalStudyMinutesAllTime),
    [playerProfile.totalStudyMinutesAllTime],
  );

  const [notebookTab, setNotebookTab] = useState<NotebookTab>('timer');

  const openNotebook = (tab: NotebookTab = 'timer') => {
    setSoonToast(null);
    if (panel === 'notebook' && notebookTab === tab) {
      setPanel('none');
    } else {
      setNotebookTab(tab);
      setPanel('notebook');
    }
  };

  const openPanel = (next: Panel) => {
    setSoonToast(null);
    setPanel((current) => (current === next ? 'none' : next));
  };

  const handleEnterBuilding = (id: MeadowBuildingId) => {
    setSoonToast(null);
    setPanel('none');
    if (id === 'cafe') setScreen('cafe');
    else if (id === 'room') setScreen('room');
    else if (id === 'nest') {
      if (tutorialStage === 'showSanctuaryArrow') {
        setTutorialStage('done');
      }
      setScreen('nest');
    }
  };

  useEffect(() => {
    return () => {
      if (soonTimeoutRef.current != null) {
        window.clearTimeout(soonTimeoutRef.current);
      }
    };
  }, []);

  const showSanctuaryArrow = tutorialStage === 'showSanctuaryArrow';

  const focusLabel =
    studyState === 'studying'
      ? 'Focusing…'
      : studyMinutesToday >= studyMinutesGoal
        ? 'Goal met today!'
        : 'Ready to study';

  return (
    <div className="main-view" data-season={season} data-lighting={activeLighting}>
      <StudyTicker />
      <section className={`main-garden-area${screen !== 'meadow' ? ' is-indoor-page' : ''}`}>
        <div className="main-top-chips-cluster">
          <div className="main-top-chip" aria-label={`Points: ${points}`}>
            <span className="main-points-label">Points</span>
            <span className="main-points-value">{points}</span>
          </div>

          <button
            type="button"
            className="main-top-chip main-passport-chip"
            onClick={() => openNotebook('profile')}
            title="Open Caretaker Passport & Stats"
            aria-label="Open Caretaker Passport"
          >
            <CaretakerAvatar profile={playerProfile} />
            <span className="passport-chip-name">{playerProfile.name || 'Passport'}</span>
            <span className="passport-chip-lvl">Lv. {rank.level}</span>
          </button>
        </div>

        {screen === 'cafe' && (
          <StudyCafe
            onBackToMeadow={() => setScreen('meadow')}
            onOpenNotebook={() => openNotebook('timer')}
          />
        )}
        {screen === 'room' && (
          <CozyRoom
            onBackToMeadow={() => setScreen('meadow')}
            onOpenNotebook={() => openNotebook('timer')}
          />
        )}
        {screen === 'nest' && (
          <EggSanctuary onBackToMeadow={() => setScreen('meadow')} />
        )}
        {screen === 'meadow' && (
          <Garden
            locked={!gardenUnlocked && tutorialStage === 'done'}
            onUnlockHint={checkGardenAccess}
            onEnterBuilding={handleEnterBuilding}
          />
        )}
      </section>

      {panel === 'notebook' && (
        <NotebookModal onClose={() => setPanel('none')} initialTab={notebookTab} />
      )}

      {panel !== 'none' && panel !== 'notebook' && (
        <>
          {panel === 'settings' && (
            <div
              className="main-panel-backdrop"
              onClick={() => setPanel('none')}
              aria-hidden
            />
          )}
          <div className={`main-panel ${panel === 'settings' ? 'main-panel--settings' : ''}`}>
            {panel === 'settings' ? (
              <SettingsPanel onClose={() => setPanel('none')} />
            ) : (
              <div className="main-panel-scroll">
                {panel === 'store' && <StorePanel />}
                {panel === 'storage' && <StoragePanel />}
              </div>
            )}
          </div>
        </>
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

      {milestoneNotice && (
        <div className="main-milestone-toast" role="status">
          <span className="main-milestone-icon" aria-hidden>{MILESTONES[milestoneNotice].icon}</span>
          <div>
            <strong>Milestone unlocked: {MILESTONES[milestoneNotice].title}</strong>
            <span>{MILESTONES[milestoneNotice].note}</span>
          </div>
          <button type="button" onClick={dismissMilestoneNotice} aria-label="Dismiss milestone">×</button>
        </div>
      )}

      <nav className="main-dock" aria-label="Mochi Meadow controls">
        <div className="main-dock-inner">
          <div className="main-dock-group" aria-label="Locations and Notebook">
            <button
              type="button"
              className={`main-dock-btn ${screen === 'meadow' && panel === 'none' ? 'is-active' : ''}`}
              onClick={() => {
                setPanel('none');
                setScreen('meadow');
              }}
              title="Return to Meadow"
            >
              <span className="main-dock-icon">
                <SkyIconMeadow />
              </span>
              <span className="main-dock-label">Meadow</span>
            </button>
            <button
              type="button"
              className={`main-dock-btn ${screen === 'cafe' ? 'is-active' : ''}`}
              onClick={() => {
                setPanel('none');
                setScreen('cafe');
              }}
              title="Enter Study Café"
            >
              <span className="main-dock-icon">
                <SkyIconCafe />
              </span>
              <span className="main-dock-label">Café</span>
            </button>
            <button
              type="button"
              className={`main-dock-btn ${screen === 'room' ? 'is-active' : ''}`}
              onClick={() => {
                setPanel('none');
                setScreen('room');
              }}
              title="Enter Your Cozy Room"
            >
              <span className="main-dock-icon">
                <SkyIconRoom />
              </span>
              <span className="main-dock-label">Room</span>
            </button>
            <div className="main-dock-btn-wrap">
              <button
                type="button"
                className={`main-dock-btn ${screen === 'nest' ? 'is-active' : ''}`}
                onClick={() => {
                  setPanel('none');
                  if (tutorialStage === 'showSanctuaryArrow') {
                    setTutorialStage('done');
                  }
                  setScreen('nest');
                }}
                title="Enter The Barn"
              >
                <span className="main-dock-icon">
                  <SkyIconEgg />
                </span>
                <span className="main-dock-label">Barn</span>
              </button>
              {showSanctuaryArrow && (
                <div className="egg-hint egg-hint--dock" aria-hidden>
                  <span className="egg-hint-text">Open barn</span>
                  <span className="egg-hint-arrow">
                    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 2v6M2 5l3 3 3-3" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              className={`main-dock-btn ${panel === 'notebook' ? 'is-active' : ''}`}
              onClick={() => openNotebook('timer')}
              title="Open Study Notebook"
            >
              <span className="main-dock-icon">
                <SkyIconNotebook />
              </span>
              <span className="main-dock-label">Notebook</span>
            </button>
          </div>

          <div
            className="main-dock-center"
            aria-live="polite"
            onClick={() => openNotebook('profile')}
            title="Click to view Caretaker Passport & Stats"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openNotebook('profile');
              }
            }}
          >
            <span className="main-dock-focus-name">
              {playerProfile.name || playerName || 'Little Friend'} · Lv.{rank.level}
            </span>
            <span className="main-dock-focus-status">{focusLabel}</span>
            <span className="main-dock-focus-time">
              {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)}
            </span>
          </div>

          <div className="main-dock-group" aria-label="Inventory and settings">
            <button
              type="button"
              className={`main-dock-btn ${panel === 'store' ? 'is-active' : ''}`}
              onClick={() => openPanel('store')}
              title="Meadow Shop"
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
