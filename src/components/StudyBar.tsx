import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import './StudyBar.css';

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
  const [goalDraft, setGoalDraft] = useState(String(studyMinutesGoal));

  useEffect(() => {
    setGoalDraft(String(studyMinutesGoal));
  }, [studyMinutesGoal]);

  const commitGoalDraft = () => {
    const parsed = Number.parseInt(goalDraft, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      setGoalDraft(String(studyMinutesGoal));
      return;
    }
    setStudyMinutesGoal(parsed);
    setGoalDraft(String(parsed));
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
  const remainingMinutesPart = Math.floor(remainingSeconds / 60);
  const remainingSecondsPart = remainingSeconds % 60;

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
        <label>Daily goal (minutes)</label>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={goalDraft}
          onChange={(e) => setGoalDraft(e.target.value)}
          onBlur={commitGoalDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
        />
      </div>
      <div className="study-timer">
        <div className="study-time">
          <span className="study-minutes">
            {remainingMinutesPart}:{remainingSecondsPart.toString().padStart(2, '0')}
          </span>
          <span className="study-sep"> left</span>
        </div>
        <div className="study-session">
          This session:{' '}
          {studyState === 'studying' ? `${secondsThisSession}s` : hasProgress ? `${secondsThisSession}s` : '—'}
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
              Nice work! You&apos;ve finished today&apos;s study time. Your garden and pets are proud of you.
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
