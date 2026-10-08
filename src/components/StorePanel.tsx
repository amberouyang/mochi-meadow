import { useState } from 'react';
import { useStore } from '../store/useStore';
import './StorePanel.css';

export function StorePanel() {
  const points = useStore((s) => s.points);
  const spendPoints = useStore((s) => s.spendPoints);
  const pets = useStore((s) => s.pets);
  const setPetName = useStore((s) => s.setPetName);
  const eggOptions = useStore((s) => s.storeEggOptions);
  const careItems = useStore((s) => s.storeCareItems);
  const brainRotActive = useStore((s) => s.brainRotActive);
  const buyMist = useStore((s) => s.buyMist);

  const [selectedId, setSelectedId] = useState<string | null>(eggOptions[0]?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);

  const active = eggOptions.find((e) => e.id === selectedId) ?? eggOptions[0];
  const mist = careItems.find((i) => i.type === 'mist');

  const handleAdopt = () => {
    if (!active) return;
    if (!pets.length) return;
    if (!spendPoints(active.cost)) {
      setMessage('Not enough points to adopt this egg.');
      return;
    }
    setPetName(pets[0].id, active.name);
    setMessage(`You picked a ${active.name} egg! It will hatch as you study.`);
  };

  const handleBuyMist = () => {
    if (!mist) return;
    if (!brainRotActive) {
      setMessage('Your meadow is clear. Mist is only needed after a missed study day.');
      return;
    }
    if (!buyMist()) {
      setMessage('Not enough points for Meadow Mist.');
      return;
    }
    setMessage('Mist settles over the meadow. Your mochi pets feel better!');
  };

  return (
    <div className="store-panel">
      <h2 className="store-title">Mochi store</h2>
      <p className="store-text">
        Spend points on eggs and care items. Miss a full day of studying and brain-rot fog rolls in.
        Meadow Mist clears it.
      </p>

      <h3 className="store-section-title">Care</h3>
      {mist && (
        <div className={`store-care${brainRotActive ? ' is-urgent' : ''}`}>
          <div className="store-care-info">
            <span className="store-egg-name">{mist.name}</span>
            <span className="store-egg-desc">{mist.description}</span>
            <span className="store-egg-cost">{mist.cost} pts</span>
          </div>
          <button type="button" className="store-adopt-btn store-mist-btn" onClick={handleBuyMist}>
            {brainRotActive ? 'Buy mist' : 'Mist ready'}
          </button>
        </div>
      )}

      <h3 className="store-section-title">Eggs</h3>
      <div className="store-options">
        {eggOptions.map((egg) => (
          <button
            key={egg.id}
            type="button"
            className={`store-egg ${egg.id === active?.id ? 'active' : ''}`}
            onClick={() => setSelectedId(egg.id)}
          >
            <div className="store-egg-icon">🥚</div>
            <div className="store-egg-info">
              <span className="store-egg-name">{egg.name}</span>
              <span className="store-egg-desc">{egg.description}</span>
              <span className="store-egg-cost">{egg.cost} pts</span>
            </div>
          </button>
        ))}
      </div>
      <button className="store-adopt-btn" type="button" onClick={handleAdopt}>
        Adopt this egg
      </button>
      <p className="store-points">You have {points} points.</p>
      {message && <p className="store-message">{message}</p>}
    </div>
  );
}
