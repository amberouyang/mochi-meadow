import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import './SettingsPanel.css';

export function SettingsPanel() {
  const playerName = useStore((s) => s.playerName);
  const setPlayerName = useStore((s) => s.setPlayerName);

  const [nameDraft, setNameDraft] = useState(playerName);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setNameDraft(playerName);
  }, [playerName]);

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

      {message && <p className="settings-message">{message}</p>}
    </div>
  );
}
