import { useEffect } from 'react';
import type { MeadowPlayerPos } from './PlayableMeadow';
import './MeadowBuildings.css';

export type MeadowBuildingId = 'cafe' | 'room' | 'nest';

interface MeadowBuildingsProps {
  playerPos: MeadowPlayerPos;
  onEnterBuilding: (id: MeadowBuildingId) => void;
}

interface BuildingDef {
  id: MeadowBuildingId;
  name: string;
  subtitle: string;
  x: number; // percentage
  y: number; // percentage
  doorX: number;
  doorY: number;
  radius: number;
}

const BUILDINGS: BuildingDef[] = [
  {
    id: 'cafe',
    name: 'Study Café',
    subtitle: 'Tea, lo-fi & focus',
    x: 17,
    y: 38,
    doorX: 17,
    doorY: 48,
    radius: 11,
  },
  {
    id: 'room',
    name: 'Your Room',
    subtitle: 'Cozy study haven',
    x: 50,
    y: 32,
    doorX: 50,
    doorY: 43,
    radius: 11,
  },
  {
    id: 'nest',
    name: 'The Barn',
    subtitle: 'Warm pet sanctuary',
    x: 83,
    y: 38,
    doorX: 83,
    doorY: 48,
    radius: 11,
  },
];

export function MeadowBuildings({ playerPos, onEnterBuilding }: MeadowBuildingsProps) {
  // Determine which building player is closest to
  let nearest: BuildingDef | null = null;
  let nearestDist = Infinity;

  for (const b of BUILDINGS) {
    const dist = Math.hypot(playerPos.x - b.doorX, playerPos.y - b.doorY);
    if (dist < b.radius && dist < nearestDist) {
      nearest = b;
      nearestDist = dist;
    }
  }

  // Keyboard listener: Press 'E' or 'Enter' when near doorway to enter
  useEffect(() => {
    if (!nearest) return;
    const currentNearest = nearest;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = (e.target as HTMLElement)?.closest?.('input, textarea, select');
      if (isTyping) return;
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        e.preventDefault();
        onEnterBuilding(currentNearest.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearest, onEnterBuilding]);

  return (
    <div className="meadow-buildings-layer" aria-label="Meadow study locations">
      {/* 1. STUDY CAFE (Left) */}
      <div
        className={`meadow-building-spot cafe-spot ${nearest?.id === 'cafe' ? 'is-active' : ''}`}
        style={{ left: '17%', top: '38%' }}
        onClick={() => onEnterBuilding('cafe')}
        role="button"
        tabIndex={0}
        aria-label="Study Café. Click or walk up to enter."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEnterBuilding('cafe');
          }
        }}
      >
        <svg
          viewBox="0 0 140 130"
          className="meadow-building-svg"
          shapeRendering="crispEdges"
          aria-hidden
        >
          {/* Ground shadow */}
          <ellipse cx="70" cy="120" rx="60" ry="8" fill="#426b3b" opacity="0.32" />

          {/* Main Building Wall (Soft Cream / Pastel Peach) */}
          <rect x="22" y="44" width="96" height="74" fill="#fff6ee" />
          <rect x="22" y="44" width="96" height="4" fill="#fbdcd0" />
          <rect x="22" y="114" width="96" height="4" fill="#eed5c5" />
          <rect x="22" y="44" width="4" height="74" fill="#eed5c5" />
          <rect x="114" y="44" width="4" height="74" fill="#eed5c5" />

          {/* Roof Gable */}
          <polygon points="12,46 70,12 128,46" fill="#f7b7a3" />
          <polygon points="18,44 70,16 122,44" fill="#ffd5c7" />

          {/* Striped Pastel Awning (Pastel Mint & Soft Coral) */}
          <polygon points="16,56 124,56 128,68 12,68" fill="#a8e6cf" />
          <polygon points="26,56 36,56 38,68 24,68" fill="#ffd3b6" />
          <polygon points="48,56 58,56 60,68 46,68" fill="#ffd3b6" />
          <polygon points="70,56 80,56 82,68 68,68" fill="#ffd3b6" />
          <polygon points="92,56 102,56 104,68 90,68" fill="#ffd3b6" />
          <polygon points="114,56 122,56 124,68 112,68" fill="#ffd3b6" />
          {/* Scalloped edge */}
          <rect x="12" y="68" width="116" height="3" fill="#88d8b0" />

          {/* Café Sign */}
          <rect x="42" y="24" width="56" height="15" fill="#ffffff" rx="2" />
          <rect x="44" y="26" width="52" height="11" fill="#fff2e2" />
          <rect x="47" y="30" width="46" height="3" fill="#d97d54" />

          {/* Display Window (Warm Glow) */}
          <rect x="29" y="74" width="30" height="28" fill="#4a5568" />
          <rect x="31" y="76" width="26" height="24" fill="#fff6c8" />
          <rect x="43" y="76" width="2" height="24" fill="#ffffff" />
          <rect x="31" y="87" width="26" height="2" fill="#ffffff" />
          {/* Coffee cup on sill */}
          <rect x="36" y="89" width="6" height="6" fill="#f7a072" />
          <rect x="38" y="87" width="2" height="2" fill="#ffffff" opacity="0.8" />

          {/* Café Doorway */}
          <rect x="74" y="72" width="32" height="46" fill="#75523c" />
          <rect x="76" y="74" width="28" height="44" fill="#9c7a5f" />
          {/* Door glass pane */}
          <rect x="80" y="78" width="20" height="18" fill="#e8f4f8" />
          <rect x="82" y="80" width="16" height="14" fill="#bae8e8" />
          {/* Brass handle */}
          <rect x="99" y="99" width="3" height="5" fill="#fbd38d" />

          {/* Welcome mat */}
          <rect x="72" y="117" width="36" height="4" fill="#c49769" />

          {/* Outdoor bistro table with drinks */}
          <rect x="110" y="100" width="16" height="2" fill="#ffffff" />
          <rect x="117" y="102" width="2" height="14" fill="#ffffff" />
          <rect x="112" y="96" width="4" height="4" fill="#a8e6cf" />
        </svg>

        <div className="meadow-building-label">
          <span className="meadow-b-title">Study Café</span>
        </div>
      </div>

      {/* 2. YOUR COZY ROOM (Center - Fantage inspired) */}
      <div
        className={`meadow-building-spot room-spot ${nearest?.id === 'room' ? 'is-active' : ''}`}
        style={{ left: '50%', top: '32%' }}
        onClick={() => onEnterBuilding('room')}
        role="button"
        tabIndex={0}
        aria-label="Your Cozy Room. Click or walk up to enter."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEnterBuilding('room');
          }
        }}
      >
        <svg
          viewBox="0 0 150 140"
          className="meadow-building-svg"
          shapeRendering="crispEdges"
          aria-hidden
        >
          {/* Shadow */}
          <ellipse cx="75" cy="130" rx="66" ry="8" fill="#426b3b" opacity="0.32" />

          {/* Cottage Walls (Pastel Lilac / Cream) */}
          <rect x="24" y="52" width="102" height="76" fill="#fbf8f5" />
          <rect x="24" y="52" width="102" height="3" fill="#e8ded1" />
          <rect x="24" y="125" width="102" height="3" fill="#d9cbba" />
          <rect x="24" y="52" width="3" height="76" fill="#e8ded1" />
          <rect x="123" y="52" width="3" height="76" fill="#e8ded1" />

          {/* Fantage Mint-Teal Roof */}
          <polygon points="12,56 75,10 138,56" fill="#68b2a0" />
          <polygon points="18,53 75,14 132,53" fill="#88c5b5" />
          <polygon points="26,50 75,18 124,50" fill="#a0d8c9" />

          {/* Chimney */}
          <rect x="100" y="16" width="14" height="24" fill="#d6a782" />
          <rect x="98" y="14" width="18" height="4" fill="#eed5be" />
          {/* Smoke puff */}
          <ellipse cx="108" cy="8" rx="5" ry="4" fill="#ffffff" opacity="0.75" />

          {/* Moon Crescent Emblem (Fantage Signature) */}
          <ellipse cx="75" cy="34" rx="8" ry="8" fill="#ffe082" />
          <ellipse cx="78" cy="33" rx="7" ry="7" fill="#88c5b5" />

          {/* Decorative Pastel Bunting Under Roof */}
          <polygon points="30,56 36,56 33,63" fill="#ffb4a2" />
          <polygon points="38,56 44,56 41,63" fill="#b5e2fa" />
          <polygon points="46,56 52,56 49,63" fill="#ffeaa7" />
          <polygon points="54,56 60,56 57,63" fill="#c7f9cc" />
          <polygon points="90,56 96,56 93,63" fill="#c7f9cc" />
          <polygon points="98,56 104,56 101,63" fill="#ffeaa7" />
          <polygon points="106,56 112,56 109,63" fill="#b5e2fa" />
          <polygon points="114,56 120,56 117,63" fill="#ffb4a2" />

          {/* Upstairs Window */}
          <circle cx="75" cy="48" r="9" fill="#ffffff" />
          <circle cx="75" cy="48" r="7" fill="#e2f3f5" />
          <rect x="74" y="41" width="2" height="14" fill="#88c5b5" />
          <rect x="68" y="47" width="14" height="2" fill="#88c5b5" />

          {/* Left Arched Window with Flowers */}
          <rect x="34" y="70" width="26" height="28" rx="12" fill="#9fd8cb" />
          <rect x="36" y="72" width="22" height="24" rx="10" fill="#e8f7f5" />
          <rect x="46" y="72" width="2" height="24" fill="#9fd8cb" />
          <rect x="36" y="84" width="22" height="2" fill="#9fd8cb" />
          {/* Flower box */}
          <rect x="32" y="98" width="30" height="6" fill="#eed7c5" />
          <rect x="36" y="95" width="6" height="5" fill="#ffb4a2" />
          <rect x="44" y="94" width="6" height="6" fill="#ffd166" />
          <rect x="52" y="95" width="6" height="5" fill="#ffb4a2" />

          {/* Right Arched Window with Flowers */}
          <rect x="90" y="70" width="26" height="28" rx="12" fill="#9fd8cb" />
          <rect x="92" y="72" width="22" height="24" rx="10" fill="#e8f7f5" />
          <rect x="102" y="72" width="2" height="24" fill="#9fd8cb" />
          <rect x="92" y="84" width="22" height="2" fill="#9fd8cb" />
          {/* Flower box */}
          <rect x="88" y="98" width="30" height="6" fill="#eed7c5" />
          <rect x="92" y="95" width="6" height="5" fill="#ffd166" />
          <rect x="100" y="94" width="6" height="6" fill="#ffb4a2" />
          <rect x="108" y="95" width="6" height="5" fill="#ffd166" />

          {/* Front Door */}
          <rect x="62" y="80" width="26" height="46" rx="4" fill="#68b2a0" />
          <rect x="64" y="82" width="22" height="44" rx="3" fill="#88c5b5" />
          {/* Door window crescent */}
          <ellipse cx="75" cy="94" rx="5" ry="5" fill="#fff4cf" />
          <ellipse cx="77" cy="94" rx="4" ry="4" fill="#88c5b5" />
          {/* Golden handle */}
          <rect x="82" y="104" width="3" height="5" fill="#ffe082" />
          {/* Stone step */}
          <rect x="58" y="126" width="34" height="4" rx="2" fill="#d9cbba" />
        </svg>

        <div className="meadow-building-label">
          <span className="meadow-b-title">Your Room</span>
        </div>
      </div>

      {/* 3. THE NEST BARN (Right) */}
      <div
        className={`meadow-building-spot barn-spot ${nearest?.id === 'nest' ? 'is-active' : ''}`}
        style={{ left: '83%', top: '38%' }}
        onClick={() => onEnterBuilding('nest')}
        role="button"
        tabIndex={0}
        aria-label="The Nest Barn. Click or walk up to enter."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEnterBuilding('nest');
          }
        }}
      >
        <svg
          viewBox="0 0 140 130"
          className="meadow-building-svg"
          shapeRendering="crispEdges"
          aria-hidden
        >
          {/* Shadow */}
          <ellipse cx="70" cy="120" rx="58" ry="8" fill="#426b3b" opacity="0.32" />

          {/* Barn walls (Pastel Lavender-Rose) */}
          <rect x="20" y="44" width="100" height="74" fill="#fcf6f9" />
          <rect x="20" y="44" width="100" height="3" fill="#e9d3e0" />
          <rect x="20" y="115" width="100" height="3" fill="#e9d3e0" />
          <rect x="20" y="44" width="3" height="74" fill="#e9d3e0" />
          <rect x="117" y="44" width="3" height="74" fill="#e9d3e0" />

          {/* Barn Gambrel Roof (Pastel Rose) */}
          <polygon points="12,50 40,24 100,24 128,50" fill="#e898ac" />
          <polygon points="16,48 42,26 98,26 124,48" fill="#f2b5c4" />
          <polygon points="22,46 44,30 96,30 118,46" fill="#ffd1dc" />

          {/* Weathervane (Egg / Bird) */}
          <rect x="69" y="10" width="2" height="15" fill="#b07d8d" />
          <ellipse cx="70" cy="9" rx="4" ry="5" fill="#ffeaa7" />

          {/* Hayloft Door / Window */}
          <rect x="56" y="36" width="28" height="22" rx="4" fill="#8c5867" />
          <rect x="58" y="38" width="24" height="20" rx="3" fill="#ffeaa7" />
          {/* Hay sticking out */}
          <rect x="60" y="54" width="20" height="6" fill="#f6d365" />
          <rect x="62" y="58" width="5" height="4" fill="#f6d365" />
          <rect x="72" y="58" width="6" height="3" fill="#f6d365" />

          {/* Barn Double Doors with X-Brace */}
          <rect x="52" y="70" width="36" height="48" fill="#8c5867" />
          <rect x="54" y="72" width="15" height="46" fill="#d88299" />
          <rect x="71" y="72" width="15" height="46" fill="#d88299" />
          {/* X braces */}
          <line x1="55" y1="73" x2="68" y2="94" stroke="#ffffff" strokeWidth="2" opacity="0.65" />
          <line x1="55" y1="94" x2="68" y2="73" stroke="#ffffff" strokeWidth="2" opacity="0.65" />
          <line x1="72" y1="73" x2="85" y2="94" stroke="#ffffff" strokeWidth="2" opacity="0.65" />
          <line x1="72" y1="94" x2="85" y2="73" stroke="#ffffff" strokeWidth="2" opacity="0.65" />

          {/* Hanging Lantern */}
          <rect x="42" y="74" width="2" height="8" fill="#694d58" />
          <rect x="39" y="82" width="8" height="10" rx="2" fill="#ffeaa7" />
          <rect x="41" y="84" width="4" height="6" fill="#ffffff" />

          {/* Hay bale next to barn */}
          <rect x="96" y="98" width="18" height="14" rx="3" fill="#f6d365" />
          <rect x="98" y="102" width="14" height="2" fill="#e0b84c" />
          <rect x="98" y="108" width="14" height="2" fill="#e0b84c" />
        </svg>

        <div className="meadow-building-label">
          <span className="meadow-b-title">The Barn</span>
        </div>
      </div>

      {/* FLOATING PROXIMITY SPEECH BUBBLE */}
      {nearest && (
        <div
          className="meadow-door-prompt"
          style={{
            left: `${nearest.doorX}%`,
            top: `${nearest.doorY + 2}%`,
          }}
          onClick={() => onEnterBuilding(nearest!.id)}
        >
          <div className="meadow-prompt-bubble">
            <span className="meadow-prompt-name">{nearest.name}</span>
            <span className="meadow-prompt-sep">·</span>
            <span className="meadow-prompt-action">
              Press <kbd>E</kbd> or Walk In
            </span>
          </div>
          <div className="meadow-prompt-pointer" />
        </div>
      )}
    </div>
  );
}
