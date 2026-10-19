import { useStore } from '../store/useStore';
import { InfoTip } from './InfoTip';
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
    icon: string;
    artSrc?: string;
    name: string;
    detail: string;
  }> = [
    {
      id: 'points',
      icon: '✦',
      name: 'Study points',
      detail: `${points} ready to spend`,
    },
    ...(incubatingEgg && !eggHatched
      ? [
          {
            id: 'incubating',
            icon: '🥚',
            artSrc: incubatingEgg.artSrc,
            name: incubatingEgg.name,
            detail: `Nest warmth ${Math.round((eggProgress / 1000) * 100)}%`,
          },
        ]
      : []),
    ...pets.map((pet) => ({
      id: pet.id,
      icon: '☁',
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
