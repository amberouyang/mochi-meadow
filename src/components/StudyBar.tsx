import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import './StudyBar.css';

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
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function StudyBar() {
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const studyState = useStore((s) => s.studyState);
  const setStudyMinutesGoal = useStore((s) => s.setStudyMinutesGoal);
  const addStudyMinute = useStore((s) => s.addStudyMinute);
  const setStudyState = useStore((s) => s.setStudyState);
  const addPoints = useStore((s) => s.addPoints);
  const checkGardenAccess = useStore((s) => s.checkGardenAccess);

  const [secondsThisSession, setSecondsThisSession] = useState(0);
  const [showGoalOverlay, setShowGoalOverlay] = useState(false);

  const parts = goalParts(studyMinutesGoal);
  const [hoursDraft, setHoursDraft] = useState(String(parts.hours));
  const [minsDraft, setMinsDraft] = useState(String(parts.minutes));

  useEffect(() => {
    const next = goalParts(studyMinutesGoal);
    setHoursDraft(String(next.hours));
    setMinsDraft(String(next.minutes));
  }, [studyMinutesGoal]);

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

  useEffect(() => {
    if (studyState !== 'studying') return;
    const interval = setInterval(() => {
      setSecondsThisSession((s) => {
        const next = s + 1;
        if (next >= 60) {
          const updatedMinutes = studyMinutesToday + 1;
          addStudyMinute();
          addPoints(5);
          checkGardenAccess();
          if (updatedMinutes >= studyMinutesGoal) {
            setStudyState('idle');
            setShowGoalOverlay(true);
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [
    studyState,
    studyMinutesToday,
    studyMinutesGoal,
    addStudyMinute,
    addPoints,
    checkGardenAccess,
    setStudyState,
  ]);

  const totalSecondsGoal = studyMinutesGoal * 60;
  const totalSeconds = studyMinutesToday * 60 + secondsThisSession;
  const progress =
    totalSecondsGoal > 0 ? Math.min(100, (totalSeconds / totalSecondsGoal) * 100) : 0;

  const remainingSeconds = Math.max(0, totalSecondsGoal - totalSeconds);

  const reachedGoal = studyMinutesToday >= studyMinutesGoal;
  const hasProgress = studyMinutesToday > 0 || secondsThisSession > 0;

  const buttonLabel =
    studyState === 'studying'
      ? 'Stop'
      : reachedGoal
        ? 'Goal reached'
        : hasProgress
          ? 'Resume'
          : 'Start studying';

  return (
    <div className="study-bar">
      <p className="study-hint">
        Start the timer when you study. Meet your goal to unlock the garden and give your pets
        energy.
      </p>
      <div className="study-goal">
        <span className="study-goal-label">Daily goal</span>
        <div className="study-goal-fields">
          <label className="study-goal-field">
            <span>Hours</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={hoursDraft}
              onChange={(e) => setHoursDraft(e.target.value)}
              onBlur={commitGoalDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
            />
          </label>
          <label className="study-goal-field">
            <span>Minutes</span>
            <input
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              value={minsDraft}
              onChange={(e) => setMinsDraft(e.target.value)}
              onBlur={commitGoalDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
            />
          </label>
        </div>
      </div>
      <div className="study-timer">
        <div className="study-time">
          <span className="study-minutes">{formatRemaining(remainingSeconds)}</span>
          <span className="study-sep"> left</span>
        </div>
        <div className="study-session">
          This session:{' '}
          {studyState === 'studying' || hasProgress ? `${secondsThisSession}s` : '—'}
        </div>
        <button
          className={`study-toggle ${studyState === 'studying' ? 'studying' : ''}`}
          onClick={() => setStudyState(studyState === 'studying' ? 'idle' : 'studying')}
          disabled={reachedGoal && studyState !== 'studying'}
        >
          {buttonLabel}
        </button>
      </div>
      <div className="study-progress-wrap">
        <div className="study-progress-bar" style={{ width: `${progress}%` }} />
        <span className="study-progress-label">{Math.round(progress)}%</span>
      </div>
      {showGoalOverlay && (
        <div
          className="study-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowGoalOverlay(false);
            }
          }}
        >
          <div className="study-overlay-card">
            <p className="study-overlay-title">Study goal reached!</p>
            <p className="study-overlay-text">
              Nice work! You&apos;ve finished today&apos;s study time. Your garden and pets are proud of
              you.
            </p>
            <button className="study-overlay-btn" onClick={() => setShowGoalOverlay(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
