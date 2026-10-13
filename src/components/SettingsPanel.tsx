import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './SettingsPanel.css';

function goalParts(totalMinutes: number) {
  return {
    hours: Math.floor(Math.max(0, totalMinutes) / 60),
    minutes: Math.max(0, totalMinutes) % 60,
  };
}

export function SettingsPanel() {
  const playerName = useStore((s) => s.playerName);
  const setPlayerName = useStore((s) => s.setPlayerName);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const setStudyMinutesGoal = useStore((s) => s.setStudyMinutesGoal);
  const resetProgress = useStore((s) => s.resetProgress);

  const parts = goalParts(studyMinutesGoal);
  const [nameDraft, setNameDraft] = useState(playerName);
  const [hoursDraft, setHoursDraft] = useState(String(parts.hours));
  const [minsDraft, setMinsDraft] = useState(String(parts.minutes));
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setNameDraft(playerName);
  }, [playerName]);

  useEffect(() => {
    const next = goalParts(studyMinutesGoal);
    setHoursDraft(String(next.hours));
    setMinsDraft(String(next.minutes));
  }, [studyMinutesGoal]);

  const saveName = () => {
    const next = nameDraft.trim();
    if (!next) {
      setMessage('Enter a name to save.');
      return;
    }
    setPlayerName(next);
    setNameDraft(next);
    setMessage('Name updated.');
  };

  const saveGoalDefault = () => {
    const hoursRaw = hoursDraft.trim() === '' ? 0 : Number.parseInt(hoursDraft, 10);
    const minsRaw = minsDraft.trim() === '' ? 0 : Number.parseInt(minsDraft, 10);
    if (!Number.isFinite(hoursRaw) || !Number.isFinite(minsRaw) || hoursRaw < 0 || minsRaw < 0) {
      const next = goalParts(studyMinutesGoal);
      setHoursDraft(String(next.hours));
      setMinsDraft(String(next.minutes));
      setMessage('Enter a valid study goal.');
      return;
    }
    const total = hoursRaw * 60 + minsRaw;
    setStudyMinutesGoal(total);
    setMessage(`Daily study goal set to ${formatStudyMinutes(total)}.`);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setMessage('Press again to confirm reset. You will restart from the beginning.');
      return;
    }
    // Clears save data, then reloads so intro → name → rubble → first mochi run again.
    resetProgress();
  };

  return (
    <div className="settings-panel">
      <h2 className="settings-title">Settings</h2>
      <p className="settings-text">Tune your meadow study companion.</p>

      <section className="settings-section" aria-labelledby="settings-name-heading">
        <h3 id="settings-name-heading" className="settings-section-title">
          Profile
        </h3>
        <label className="settings-label" htmlFor="settings-player-name">
          Your name
        </label>
        <input
          id="settings-player-name"
          className="settings-input"
          value={nameDraft}
          maxLength={24}
          placeholder="Friend"
          onChange={(e) => {
            setNameDraft(e.target.value);
            setMessage(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveName();
          }}
        />
        <button type="button" className="settings-btn settings-btn-primary" onClick={saveName}>
          Save name
        </button>
      </section>

      <section className="settings-section" aria-labelledby="settings-goal-heading">
        <h3 id="settings-goal-heading" className="settings-section-title">
          Study goal
        </h3>
        <p className="settings-hint">Default daily goal. Saved for next time you open the app.</p>
        <div className="settings-goal-row">
          <label className="settings-goal-field">
            <input
              inputMode="numeric"
              value={hoursDraft}
              aria-label="Goal hours"
              onChange={(e) => {
                setHoursDraft(e.target.value);
                setMessage(null);
              }}
            />
            <span>hrs</span>
          </label>
          <label className="settings-goal-field">
            <input
              inputMode="numeric"
              value={minsDraft}
              aria-label="Goal minutes"
              onChange={(e) => {
                setMinsDraft(e.target.value);
                setMessage(null);
              }}
            />
            <span>min</span>
          </label>
        </div>
        <button type="button" className="settings-btn settings-btn-primary" onClick={saveGoalDefault}>
          Save goal
        </button>
      </section>

      <section className="settings-section" aria-labelledby="settings-reset-heading">
        <h3 id="settings-reset-heading" className="settings-section-title">
          Danger zone
        </h3>
        <p className="settings-hint">
          Clears progress and restarts from the intro (name, rubble, first mochi). Keeps your saved
          study goal default.
        </p>
        <button
          type="button"
          className="settings-btn settings-btn-danger"
          onClick={handleReset}
          onBlur={() => setConfirmReset(false)}
        >
          {confirmReset ? 'Confirm reset' : 'Reset progress'}
        </button>
      </section>

      {message && <p className="settings-message">{message}</p>}
    </div>
  );
}
