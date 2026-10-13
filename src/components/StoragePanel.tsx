import { useStore } from '../store/useStore';
import './StoragePanel.css';

export function StoragePanel() {
  const pets = useStore((s) => s.pets);
  const points = useStore((s) => s.points);
  const brainRotActive = useStore((s) => s.brainRotActive);
  const incubatingEgg = useStore((s) => s.incubatingEgg);
  const eggHatched = useStore((s) => s.eggHatched);
  const eggProgress = useStore((s) => s.eggProgress);

  const items = [
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
            name: incubatingEgg.name,
            detail: `Incubating in nest — ${Math.round((eggProgress / 1000) * 100)}%`,
          },
        ]
      : []),
    ...pets.map((pet) => ({
      id: pet.id,
      icon: '☁',
      name: pet.name,
      detail: brainRotActive ? 'Feeling sick — needs Meadow Mist' : `Energy ${pet.energy}%`,
    })),
  ];

  return (
    <div className="storage-panel">
      <h2 className="storage-title">Storage</h2>
      <p className="storage-text">Things you&apos;re carrying in the meadow.</p>

      <ul className="storage-list">
        {items.map((item) => (
          <li key={item.id} className="storage-item">
            <span className="storage-item-icon" aria-hidden>
              {item.icon}
            </span>
            <div className="storage-item-info">
              <span className="storage-item-name">{item.name}</span>
              <span className="storage-item-detail">{item.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="storage-hint">Care items from the store will show up here too.</p>
    </div>
  );
}
