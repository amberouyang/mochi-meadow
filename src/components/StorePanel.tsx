import { useState } from 'react';
import { useStore } from '../store/useStore';
import { InfoTip } from './InfoTip';
import './StorePanel.css';

export function StorePanel() {
  const points = useStore((s) => s.points);
  const eggOptions = useStore((s) => s.storeEggOptions);
  const careItems = useStore((s) => s.storeCareItems);
  const brainRotActive = useStore((s) => s.brainRotActive);
  const buyMist = useStore((s) => s.buyMist);
  const buyEgg = useStore((s) => s.buyEgg);
  const incubatingEgg = useStore((s) => s.incubatingEgg);
  const eggHatched = useStore((s) => s.eggHatched);

  const [selectedId, setSelectedId] = useState<string | null>(eggOptions[0]?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);

  const active = eggOptions.find((e) => e.id === selectedId) ?? eggOptions[0];
  const mist = careItems.find((i) => i.type === 'mist');
  const nestBusy = Boolean(incubatingEgg && !eggHatched);

  const handleBuyEgg = () => {
    if (!active) return;
    const error = buyEgg(active.id);
    if (error) {
      setMessage(error);
      return;
    }
    setMessage(`${active.name} is in your nest. Study to warm it.`);
  };

  const handleBuyMist = () => {
    if (!mist) return;
    if (!brainRotActive) {
      setMessage('Your meadow is clear right now.');
      return;
    }
    if (!buyMist()) {
      setMessage('Not enough points for Meadow Mist.');
      return;
    }
    setMessage('Mist cleared the fog. Your mochi feel better!');
  };

  return (
    <div className="store-panel">
      <div className="panel-heading">
        <h2 className="panel-heading-title">Store</h2>
        <InfoTip label="About the store">
          Buy an egg for your nest, then study to fill its warmth bar. Hatching usually takes about
          100 study minutes. Meadow Mist clears fog after a missed study day.
        </InfoTip>
      </div>

      <h3 className="store-section-title">Care</h3>
      {mist && (
        <div className={`store-care${brainRotActive ? ' is-urgent' : ''}`}>
          <div className="store-care-info">
            <span className="store-egg-name">{mist.name}</span>
            <span className="store-egg-cost">{mist.cost} pts</span>
          </div>
          <button type="button" className="store-adopt-btn store-mist-btn" onClick={handleBuyMist}>
            {brainRotActive ? 'Buy mist' : 'Mist ready'}
          </button>
        </div>
      )}

      <h3 className="store-section-title">Eggs</h3>
      {nestBusy && (
        <p className="store-message">Nest busy with {incubatingEgg?.name}. Hatch it first.</p>
      )}
      <div className="store-options">
        {eggOptions.map((egg) => (
          <button
            key={egg.id}
            type="button"
            className={`store-egg ${egg.id === active?.id ? 'active' : ''}`}
            onClick={() => setSelectedId(egg.id)}
            title={egg.description}
          >
            <div className="store-egg-icon" aria-hidden>
              {egg.artSrc ? (
                <img className="store-egg-art" src={egg.artSrc} alt="" />
              ) : (
                '🥚'
              )}
            </div>
            <div className="store-egg-info">
              <span className="store-egg-name">{egg.name}</span>
              <span className="store-egg-cost">{egg.cost} pts</span>
            </div>
          </button>
        ))}
      </div>
      <button
        className="store-adopt-btn"
        type="button"
        onClick={handleBuyEgg}
        disabled={nestBusy || !active}
      >
        Buy egg for nest
      </button>
      <p className="store-points">{points} points</p>
      {message && <p className="store-message">{message}</p>}
    </div>
  );
}
