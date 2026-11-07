import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatStudyMinutes } from '../utils/formatStudyTime';
import './SettingsPanel.css';

type SettingsTab = 'general' | 'atmosphere' | 'system';

function goalParts(totalMinutes: number) {
  return {
    hours: Math.floor(Math.max(0, totalMinutes) / 60),
    minutes: Math.max(0, totalMinutes) % 60,
  };
}

export function SettingsPanel({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const playerName = useStore((s) => s.playerName);
  const setPlayerName = useStore((s) => s.setPlayerName);
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const setStudyMinutesGoal = useStore((s) => s.setStudyMinutesGoal);
  const resetProgress = useStore((s) => s.resetProgress);
  const soundMuted = useStore((s) => s.soundMuted);
  const setSoundMuted = useStore((s) => s.setSoundMuted);
  const lightingMode = useStore((s) => s.lightingMode);
  const setLightingMode = useStore((s) => s.setLightingMode);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const saveName = () => {
    const next = nameDraft.trim();
    if (!next) {
      setMessage('Please enter a name to save.');
      return;
    }
    setPlayerName(next);
    setNameDraft(next);
    setMessage('Name updated successfully.');
  };

  const saveGoalDefault = () => {
    const hoursRaw = hoursDraft.trim() === '' ? 0 : Number.parseInt(hoursDraft, 10);
    const minsRaw = minsDraft.trim() === '' ? 0 : Number.parseInt(minsDraft, 10);
    if (!Number.isFinite(hoursRaw) || !Number.isFinite(minsRaw) || hoursRaw < 0 || minsRaw < 0) {
      const next = goalParts(studyMinutesGoal);
      setHoursDraft(String(next.hours));
      setMinsDraft(String(next.minutes));
      setMessage('Please enter a valid study goal.');
      return;
    }
    const total = Math.max(5, hoursRaw * 60 + minsRaw);
    setStudyMinutesGoal(total);
    setMessage(`Daily study goal set to ${formatStudyMinutes(total)}.`);
  };

  const adjustGoalMinutes = (delta: number) => {
    const hoursRaw = hoursDraft.trim() === '' ? 0 : Number.parseInt(hoursDraft, 10);
    const minsRaw = minsDraft.trim() === '' ? 0 : Number.parseInt(minsDraft, 10);
    const current = (Number.isFinite(hoursRaw) ? hoursRaw : 0) * 60 + (Number.isFinite(minsRaw) ? minsRaw : 0);
    const nextTotal = Math.max(5, current + delta);
    const nextParts = goalParts(nextTotal);
    setHoursDraft(String(nextParts.hours));
    setMinsDraft(String(nextParts.minutes));
    setStudyMinutesGoal(nextTotal);
    setMessage(`Daily study goal set to ${formatStudyMinutes(nextTotal)}.`);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setMessage('Click again to confirm. This will restart your meadow from the beginning.');
      return;
    }
    resetProgress();
  };

  return (
    <div className="desktop-settings-window" role="dialog" aria-modal="true" aria-labelledby="desktop-settings-title">
      {/* Desktop Window Titlebar */}
      <div className="desktop-settings-header">
        <div className="desktop-settings-title-group">
          <h2 id="desktop-settings-title" className="desktop-settings-title">Settings</h2>
          <span className="desktop-settings-subtitle">Preferences &amp; Meadow Configuration</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="desktop-settings-close-btn"
            onClick={onClose}
            aria-label="Close settings"
            title="Close (Esc)"
          >
            ✕
          </button>
        )}
      </div>

      <div className="desktop-settings-body">
        {/* Left Navigation Sidebar */}
        <nav className="desktop-settings-nav" aria-label="Settings categories">
          <button
            type="button"
            className={`desktop-settings-nav-item${activeTab === 'general' ? ' is-active' : ''}`}
            onClick={() => { setActiveTab('general'); setMessage(null); }}
          >
            <span className="desktop-settings-nav-dot" />
            <span className="desktop-settings-nav-label">General</span>
          </button>
          <button
            type="button"
            className={`desktop-settings-nav-item${activeTab === 'atmosphere' ? ' is-active' : ''}`}
            onClick={() => { setActiveTab('atmosphere'); setMessage(null); }}
          >
            <span className="desktop-settings-nav-dot" />
            <span className="desktop-settings-nav-label">Atmosphere</span>
          </button>
          <button
            type="button"
            className={`desktop-settings-nav-item${activeTab === 'system' ? ' is-active' : ''}`}
            onClick={() => { setActiveTab('system'); setMessage(null); }}
          >
            <span className="desktop-settings-nav-dot" />
            <span className="desktop-settings-nav-label">Audio &amp; Data</span>
          </button>
        </nav>

        {/* Right Content Area */}
        <div className="desktop-settings-content">
          {activeTab === 'general' && (
            <div className="desktop-settings-tab-pane">
              <section className="desktop-settings-card">
                <div className="desktop-settings-card-head">
                  <h3 className="desktop-settings-card-title">Profile Name</h3>
                  <p className="desktop-settings-card-desc">Your character&apos;s name displayed in the meadow sign and speech bubbles.</p>
                </div>
                <div className="desktop-settings-inline-form">
                  <input
                    id="settings-player-name"
                    className="desktop-settings-text-input"
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
                  <button type="button" className="desktop-settings-action-btn" onClick={saveName}>
                    Save Name
                  </button>
                </div>
              </section>

              <section className="desktop-settings-card">
                <div className="desktop-settings-card-head">
                  <h3 className="desktop-settings-card-title">Daily Study Goal</h3>
                  <p className="desktop-settings-card-desc">How long you aim to focus each day to unlock the meadow and keep mochi pets healthy.</p>
                </div>
                <div className="desktop-settings-goal-container">
                  <div className="desktop-settings-goal-inputs">
                    <label className="desktop-settings-number-box">
                      <input
                        inputMode="numeric"
                        value={hoursDraft}
                        aria-label="Goal hours"
                        onChange={(e) => {
                          setHoursDraft(e.target.value);
                          setMessage(null);
                        }}
                      />
                      <span>hours</span>
                    </label>
                    <span className="desktop-settings-goal-divider">:</span>
                    <label className="desktop-settings-number-box">
                      <input
                        inputMode="numeric"
                        value={minsDraft}
                        aria-label="Goal minutes"
                        onChange={(e) => {
                          setMinsDraft(e.target.value);
                          setMessage(null);
                        }}
                      />
                      <span>mins</span>
                    </label>
                  </div>
                  <div className="desktop-settings-stepper-row">
                    <button type="button" className="desktop-settings-stepper-btn" onClick={() => adjustGoalMinutes(-15)}>-15m</button>
                    <button type="button" className="desktop-settings-stepper-btn" onClick={() => adjustGoalMinutes(15)}>+15m</button>
                    <button type="button" className="desktop-settings-stepper-btn" onClick={() => adjustGoalMinutes(30)}>+30m</button>
                    <button type="button" className="desktop-settings-stepper-btn" onClick={() => adjustGoalMinutes(60)}>+1h</button>
                    <button type="button" className="desktop-settings-action-btn" onClick={saveGoalDefault}>
                      Save Goal
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'atmosphere' && (
            <div className="desktop-settings-tab-pane">
              <section className="desktop-settings-card">
                <div className="desktop-settings-card-head">
                  <h3 className="desktop-settings-card-title">Meadow Lighting</h3>
                  <p className="desktop-settings-card-desc">
                    Controls the environmental sky lighting. Auto mode continuously syncs with your local computer clock.
                  </p>
                </div>

                <div className="desktop-lighting-options">
                  <button
                    type="button"
                    className={`desktop-lighting-card${lightingMode === 'auto' ? ' is-selected' : ''}`}
                    onClick={() => {
                      setLightingMode('auto');
                      setMessage('Atmosphere set to Auto (tracks your local clock).');
                    }}
                  >
                    <div className="desktop-lighting-card-badge">Live</div>
                    <div className="desktop-lighting-card-title">Auto Clock</div>
                    <p className="desktop-lighting-card-info">
                      Sunny daytime, golden sunset from 5–7 PM, and glowing fireflies from 8 PM+.
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`desktop-lighting-card${lightingMode === 'day' ? ' is-selected' : ''}`}
                    onClick={() => {
                      setLightingMode('day');
                      setMessage('Atmosphere set to Sunny Day.');
                    }}
                  >
                    <div className="desktop-lighting-card-title">Sunny Day</div>
                    <p className="desktop-lighting-card-info">
                      Bright, vibrant sunlight over the green grass and sakura blossoms.
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`desktop-lighting-card${lightingMode === 'sunset' ? ' is-selected' : ''}`}
                    onClick={() => {
                      setLightingMode('sunset');
                      setMessage('Atmosphere set to Golden Sunset.');
                    }}
                  >
                    <div className="desktop-lighting-card-title">Golden Sunset</div>
                    <p className="desktop-lighting-card-info">
                      Cozy warm late-afternoon amber glow with soft elongated light.
                    </p>
                  </button>

                  <button
                    type="button"
                    className={`desktop-lighting-card${lightingMode === 'night' ? ' is-selected' : ''}`}
                    onClick={() => {
                      setLightingMode('night');
                      setMessage('Atmosphere set to Night with fireflies.');
                    }}
                  >
                    <div className="desktop-lighting-card-title">Night &amp; Fireflies</div>
                    <p className="desktop-lighting-card-info">
                      Deep twilight blue moonlight with animated glowing fireflies drifting lazily.
                    </p>
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="desktop-settings-tab-pane">
              <section className="desktop-settings-card">
                <div className="desktop-settings-card-head">
                  <h3 className="desktop-settings-card-title">Audio Effects</h3>
                  <p className="desktop-settings-card-desc">Master toggle for study timers and interface sound effects.</p>
                </div>
                <div className="desktop-settings-switch-row">
                  <div>
                    <span className="desktop-settings-switch-label">Mute All Sounds</span>
                    <span className="desktop-settings-switch-hint">
                      {soundMuted ? 'All sound effects are currently silenced' : 'Sounds will play on timers and actions'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`desktop-switch-btn${soundMuted ? ' is-on' : ''}`}
                    role="switch"
                    aria-checked={soundMuted}
                    onClick={() => {
                      const next = !soundMuted;
                      setSoundMuted(next);
                      setMessage(next ? 'Sounds muted.' : 'Sounds unmuted.');
                    }}
                  >
                    <span className="desktop-switch-thumb" />
                  </button>
                </div>
              </section>

              <section className="desktop-settings-card desktop-settings-card--danger">
                <div className="desktop-settings-card-head">
                  <h3 className="desktop-settings-card-title">Reset Progress</h3>
                  <p className="desktop-settings-card-desc">
                    Wipes local points, pets, and rock debris to let you restart the meadow from the opening tutorial. Your saved daily study goal preference will be preserved.
                  </p>
                </div>
                <button
                  type="button"
                  className="desktop-settings-danger-btn"
                  onClick={handleReset}
                  onBlur={() => setConfirmReset(false)}
                >
                  {confirmReset ? 'Confirm Full Reset' : 'Reset Meadow Progress'}
                </button>
              </section>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="desktop-settings-status-footer" role="status">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
