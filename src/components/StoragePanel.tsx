import type { ReactNode } from 'react';
import { useStore } from '../store/useStore';
import { InfoTip } from './InfoTip';
import { SkyIconEgg } from './SkyHudPixelIcons';
import './StoragePanel.css';

export function StoragePanel() {
  const pets = useStore((s) => s.pets);
  const points = useStore((s) => s.points);
  const brainRotActive = useStore((s) => s.brainRotActive);
  const incubatingEgg = useStore((s) => s.incubatingEgg);
  const eggHatched = useStore((s) => s.eggHatched);
  const eggProgress = useStore((s) => s.eggProgress);

  const items: Array<{
    id: string;
    icon: ReactNode;
    artSrc?: string;
    name: string;
    detail: string;
  }> = [
    {
      id: 'points',
      icon: (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <polygon points="8,1 10,6 15,8 10,10 8,15 6,10 1,8 6,6" opacity="0.85" />
        </svg>
      ),
      name: 'Study points',
      detail: `${points} ready to spend`,
    },
    ...(incubatingEgg && !eggHatched
      ? [
          {
            id: 'incubating',
            icon: <SkyIconEgg />,
            artSrc: incubatingEgg.artSrc,
            name: incubatingEgg.name,
            detail: `Nest warmth ${Math.round((eggProgress / 1000) * 100)}%`,
          },
        ]
      : []),
    ...pets.map((pet) => ({
      id: pet.id,
      icon: (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <rect x="4" y="6" width="8" height="6" rx="3" opacity="0.8" />
          <rect x="5" y="8" width="1" height="2" fill="#fff" />
          <rect x="10" y="8" width="1" height="2" fill="#fff" />
        </svg>
      ),
      name: pet.name,
      detail: brainRotActive ? 'Needs Meadow Mist' : `Energy ${pet.energy}%`,
    })),
  ];

  return (
    <div className="storage-panel">
      <div className="panel-heading">
        <h2 className="panel-heading-title">Storage</h2>
        <InfoTip label="About storage">
          Your points, incubating egg, and mochi pets appear here.
        </InfoTip>
      </div>

      <ul className="storage-list">
        {items.map((item) => (
          <li key={item.id} className="storage-item">
            <span className="storage-item-icon" aria-hidden>
              {item.artSrc ? (
                <img className="storage-item-art" src={item.artSrc} alt="" />
              ) : (
                item.icon
              )}
            </span>
            <div className="storage-item-info">
              <span className="storage-item-name">{item.name}</span>
              <span className="storage-item-detail">{item.detail}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
