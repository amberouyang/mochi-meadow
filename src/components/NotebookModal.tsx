import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { calendarDaysBetween, todayKey } from '../utils/studyCalendar';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './NotebookModal.css';

type NotebookTab = 'timer' | 'tasks' | 'log';

interface NotebookModalProps {
  onClose: () => void;
  initialTab?: NotebookTab;
}

function goalParts(totalMinutes: number) {
  return {
    hours: Math.floor(Math.max(0, totalMinutes) / 60),
    minutes: Math.max(0, totalMinutes) % 60,
  };
}

function formatRemaining(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function NotebookModal({ onClose, initialTab = 'timer' }: NotebookModalProps) {
  const [activeTab, setActiveTab] = useState<NotebookTab>(initialTab);

  // Store state
  const tasks = useStore((s) => s.tasks);
  const addTask = useStore((s) => s.addTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const removeTask = useStore((s) => s.removeTask);
  const addPoints = useStore((s) => s.addPoints);
  const checkGardenAccess = useStore((s) => s.checkGardenAccess);
  const points = useStore((s) => s.points);

  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const studySessionSeconds = useStore((s) => s.studySessionSeconds);
  const studyState = useStore((s) => s.studyState);
  const setStudyMinutesGoal = useStore((s) => s.setStudyMinutesGoal);
  const setStudyState = useStore((s) => s.setStudyState);
  const lastStudyDate = useStore((s) => s.lastStudyDate);
  const incubatingEgg = useStore((s) => s.incubatingEgg);
  const eggProgress = useStore((s) => s.eggProgress);

  // Task input state
  const [taskInput, setTaskInput] = useState('');

  // Goal input draft
  const parts = goalParts(studyMinutesGoal);
  const [hoursDraft, setHoursDraft] = useState(String(parts.hours));
  const [minsDraft, setMinsDraft] = useState(String(parts.minutes));

  useEffect(() => {
    const next = goalParts(studyMinutesGoal);
    setHoursDraft(String(next.hours));
    setMinsDraft(String(next.minutes));
  }, [studyMinutesGoal]);

  // Esc key listener to close notebook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const commitGoalDraft = () => {
    const hoursRaw = hoursDraft.trim() === '' ? 0 : Number.parseInt(hoursDraft, 10);
    const minsRaw = minsDraft.trim() === '' ? 0 : Number.parseInt(minsDraft, 10);
    if (!Number.isFinite(hoursRaw) || !Number.isFinite(minsRaw) || hoursRaw < 0 || minsRaw < 0) {
      const next = goalParts(studyMinutesGoal);
      setHoursDraft(String(next.hours));
      setMinsDraft(String(next.minutes));
      return;
    }
    const minsClamped = Math.min(59, minsRaw);
    const total = hoursRaw * 60 + minsClamped;
    if (total < 1) {
      const next = goalParts(studyMinutesGoal);
      setHoursDraft(String(next.hours));
      setMinsDraft(String(next.minutes));
      return;
    }
    setStudyMinutesGoal(total);
    const saved = goalParts(total);
    setHoursDraft(String(saved.hours));
    setMinsDraft(String(saved.minutes));
  };

  const setPresetGoal = (totalMinutes: number) => {
    setStudyMinutesGoal(totalMinutes);
    const next = goalParts(totalMinutes);
    setHoursDraft(String(next.hours));
    setMinsDraft(String(next.minutes));
  };

  const handleAddTask = () => {
    const title = taskInput.trim();
    if (!title) return;
    addTask(title);
    setTaskInput('');
  };

  const handleToggleTask = (id: string, done: boolean, taskPoints: number) => {
    toggleTask(id);
    if (!done) {
      addPoints(taskPoints);
      checkGardenAccess();
    }
  };

  // Timer math
  const totalSecondsGoal = studyMinutesGoal * 60;
  const totalSeconds = studyMinutesToday * 60 + studySessionSeconds;
  const progressPercent =
    totalSecondsGoal > 0 ? Math.min(100, Math.round((totalSeconds / totalSecondsGoal) * 100)) : 0;
  const remainingSeconds = Math.max(0, totalSecondsGoal - totalSeconds);
  const reachedGoal = studyMinutesToday >= studyMinutesGoal;
  const hasProgress = studyMinutesToday > 0 || studySessionSeconds > 0;

  // Streak calculation
  const today = todayKey();
  const daysDiff = lastStudyDate ? calendarDaysBetween(lastStudyDate, today) : null;
  const streakStatus =
    lastStudyDate === today
      ? 'Studied today'
      : daysDiff === 1
        ? 'Active streak (study today to continue)'
        : 'Start a new study streak';

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="notebook-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="notebook-frame" onClick={(e) => e.stopPropagation()}>
        {/* Top Bookmark Tabs (Stardew Valley Style) */}
        <div className="notebook-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'timer'}
            className={`notebook-tab ${activeTab === 'timer' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <span className="notebook-tab-stitch" />
            <span className="notebook-tab-text">Timer</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tasks'}
            className={`notebook-tab ${activeTab === 'tasks' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <span className="notebook-tab-stitch" />
            <span className="notebook-tab-text">
              Checklist {tasks.length > 0 ? `(${doneCount}/${tasks.length})` : ''}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'log'}
            className={`notebook-tab ${activeTab === 'log' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            <span className="notebook-tab-stitch" />
            <span className="notebook-tab-text">Log & Streak</span>
          </button>

          {/* Close button at top right */}
          <button
            type="button"
            className="notebook-close-btn"
            onClick={onClose}
            aria-label="Close notebook"
            title="Close (Esc)"
          >
            ×
          </button>
        </div>

        {/* Parchment Inner Page */}
        <div className="notebook-parchment">
          {/* TAB 1: TIMER */}
          {activeTab === 'timer' && (
            <div className="notebook-pane notebook-pane--timer">
              <div className="notebook-section-header">
                <div>
                  <h3 className="notebook-heading">Focus Timer</h3>
                  <p className="notebook-subheading">
                    Timer continues running in the background when you explore the meadow.
                  </p>
                </div>
                <div className="notebook-points-pill">
                  <span className="notebook-points-label">Total Points</span>
                  <span className="notebook-points-val">{points}</span>
                </div>
              </div>

              {/* Big Timer Display */}
              <div className="notebook-timer-hero">
                <div className="notebook-digits-block">
                  <span className="notebook-digits">{formatRemaining(remainingSeconds)}</span>
                  <span className="notebook-digits-unit">remaining</span>
                </div>
                <div className="notebook-timer-status">
                  {studyState === 'studying' ? (
                    <span className="notebook-status-tag is-studying">Currently Focusing</span>
                  ) : reachedGoal ? (
                    <span className="notebook-status-tag is-complete">Goal Met for Today</span>
                  ) : hasProgress ? (
                    <span className="notebook-status-tag is-paused">Paused Session</span>
                  ) : (
                    <span className="notebook-status-tag is-ready">Ready to Begin</span>
                  )}
                  <span className="notebook-timer-sub">
                    Current minute: {studyState === 'studying' || hasProgress ? `${studySessionSeconds}s` : '0s'}
                  </span>
                </div>

                <div className="notebook-timer-actions">
                  <button
                    type="button"
                    className={`notebook-main-cta ${studyState === 'studying' ? 'is-stop' : ''}`}
                    onClick={() => setStudyState(studyState === 'studying' ? 'idle' : 'studying')}
                    disabled={reachedGoal && studyState !== 'studying'}
                  >
                    {studyState === 'studying'
                      ? 'Pause Session'
                      : reachedGoal
                        ? 'Goal Achieved'
                        : hasProgress
                          ? 'Resume Session'
                          : 'Start Studying'}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="notebook-progress-container">
                <div className="notebook-progress-meta">
                  <span className="notebook-meta-title">Daily Progress</span>
                  <span className="notebook-meta-num">
                    {formatStudyMinutes(studyMinutesToday)} / {formatStudyMinutes(studyMinutesGoal)} ({progressPercent}%)
                  </span>
                </div>
                <div className="notebook-progress-track">
                  <div
                    className="notebook-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Goal Configuration & Quick Presets */}
              <div className="notebook-goal-row">
                <div className="notebook-goal-inputs">
                  <span className="notebook-field-title">Daily Goal Target</span>
                  <div className="notebook-field-group">
                    <label className="notebook-num-input">
                      <span>Hours</span>
                      <input
                        type="number"
                        min={0}
                        value={hoursDraft}
                        onChange={(e) => setHoursDraft(e.target.value)}
                        onBlur={commitGoalDraft}
                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      />
                    </label>
                    <label className="notebook-num-input">
                      <span>Minutes</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={minsDraft}
                        onChange={(e) => setMinsDraft(e.target.value)}
                        onBlur={commitGoalDraft}
                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      />
                    </label>
                  </div>
                </div>

                <div className="notebook-presets-wrap">
                  <span className="notebook-field-title">Quick Presets</span>
                  <div className="notebook-presets">
                    <button
                      type="button"
                      className="notebook-preset-btn"
                      onClick={() => setPresetGoal(15)}
                    >
                      15 min
                    </button>
                    <button
                      type="button"
                      className="notebook-preset-btn"
                      onClick={() => setPresetGoal(25)}
                    >
                      25 min
                    </button>
                    <button
                      type="button"
                      className="notebook-preset-btn"
                      onClick={() => setPresetGoal(45)}
                    >
                      45 min
                    </button>
                    <button
                      type="button"
                      className="notebook-preset-btn"
                      onClick={() => setPresetGoal(60)}
                    >
                      1 hour
                    </button>
                  </div>
                </div>
              </div>

              {/* Cozy egg incubation notice */}
              {incubatingEgg && (
                <div className="notebook-cozy-note">
                  <span className="notebook-note-title">Sanctuary Warmth:</span>
                  <span className="notebook-note-desc">
                    Studying warms your {incubatingEgg.name} ({Math.round(eggProgress / 10)}% incubated).
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TASKS */}
          {activeTab === 'tasks' && (
            <div className="notebook-pane notebook-pane--tasks">
              <div className="notebook-section-header">
                <div>
                  <h3 className="notebook-heading">To-Do Checklist</h3>
                  <p className="notebook-subheading">
                    Check off assignments and to-dos to earn meadow points and unlock new areas.
                  </p>
                </div>
                <div className="notebook-points-pill">
                  <span className="notebook-points-label">Completed</span>
                  <span className="notebook-points-val">
                    {doneCount} of {tasks.length}
                  </span>
                </div>
              </div>

              {/* Add task bar */}
              <div className="notebook-task-entry">
                <input
                  type="text"
                  className="notebook-task-input"
                  placeholder="Write a study task or homework..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button
                  type="button"
                  className="notebook-task-add-btn"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
              </div>

              {/* Task list with parchment styling */}
              <div className="notebook-tasks-scroll">
                {tasks.length === 0 ? (
                  <div className="notebook-empty-tasks">
                    <p className="notebook-empty-title">All caught up!</p>
                    <p className="notebook-empty-sub">
                      Add your study tasks above to stay organized and earn points.
                    </p>
                  </div>
                ) : (
                  <ul className="notebook-task-list">
                    {tasks.map((t) => (
                      <li
                        key={t.id}
                        className={`notebook-task-row ${t.done ? 'is-done' : ''}`}
                      >
                        <label className="notebook-task-label">
                          <input
                            type="checkbox"
                            className="notebook-checkbox"
                            checked={t.done}
                            onChange={() => handleToggleTask(t.id, t.done, t.points)}
                          />
                          <span className="notebook-task-text">{t.title}</span>
                          <span className="notebook-task-pts">+{t.points} pts</span>
                        </label>
                        <button
                          type="button"
                          className="notebook-task-del-btn"
                          onClick={() => removeTask(t.id)}
                          aria-label={`Remove task ${t.title}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="notebook-tasks-footer">
                <span>Earned points are saved to your total automatically.</span>
              </div>
            </div>
          )}

          {/* TAB 3: LOG & STREAK */}
          {activeTab === 'log' && (
            <div className="notebook-pane notebook-pane--log">
              <div className="notebook-section-header">
                <div>
                  <h3 className="notebook-heading">Study Journal & Streak</h3>
                  <p className="notebook-subheading">
                    Keep your streak alive by studying every day to keep the meadow vibrant.
                  </p>
                </div>
                <div className="notebook-points-pill">
                  <span className="notebook-points-label">Total Points</span>
                  <span className="notebook-points-val">{points}</span>
                </div>
              </div>

              <div className="notebook-stats-grid">
                <div className="notebook-stat-card">
                  <span className="notebook-stat-label">Today&apos;s Focus Time</span>
                  <span className="notebook-stat-value">
                    {formatStudyMinutes(studyMinutesToday)}
                  </span>
                  <span className="notebook-stat-sub">
                    Goal: {formatStudyMinutes(studyMinutesGoal)}
                  </span>
                </div>

                <div className="notebook-stat-card">
                  <span className="notebook-stat-label">Streak Status</span>
                  <span className="notebook-stat-value">
                    {lastStudyDate ? lastStudyDate : 'Not started'}
                  </span>
                  <span className="notebook-stat-sub">{streakStatus}</span>
                </div>

                <div className="notebook-stat-card">
                  <span className="notebook-stat-label">Tasks Completed</span>
                  <span className="notebook-stat-value">
                    {doneCount} / {tasks.length}
                  </span>
                  <span className="notebook-stat-sub">Assignments finished</span>
                </div>

                <div className="notebook-stat-card">
                  <span className="notebook-stat-label">Meadow Standing</span>
                  <span className="notebook-stat-value">
                    {reachedGoal ? 'Flourishing' : 'In Progress'}
                  </span>
                  <span className="notebook-stat-sub">
                    {reachedGoal ? 'All gates open' : 'Finish study goal to explore'}
                  </span>
                </div>
              </div>

              <div className="notebook-lore-box">
                <h4 className="notebook-lore-title">Caretaker&apos;s Field Notes</h4>
                <p className="notebook-lore-text">
                  In Mochi Meadow, every minute of focus nourishes the land. Studying warms dormant
                  eggs in the sanctuary, clears morning mist, and keeps your pets energized and
                  happy. Taking calm, regular breaks helps prevent burnout.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
