import type { GardenDebris } from '../types';

/** Fresh tutorial rock layout (shared by store init + reset). */
export const DEFAULT_DEBRIS: GardenDebris[] = [
  // Keep this clear of the café's footprint so every tutorial rock stays clickable.
  { id: 'd1', kind: 'rock', cleared: false, assetIndex: 0, leftPct: 32, bottomPct: 54 },
  { id: 'd2', kind: 'rock', cleared: false, assetIndex: 1, leftPct: 28, bottomPct: 26 },
  { id: 'd3', kind: 'rock', cleared: false, assetIndex: 2, leftPct: 48, bottomPct: 22 },
  { id: 'd4', kind: 'rock', cleared: false, assetIndex: 3, leftPct: 68, bottomPct: 26 },
  // Keep clear of The Barn's footprint on the right.
  { id: 'd5', kind: 'rock', cleared: false, assetIndex: 4, leftPct: 80, bottomPct: 28 },
];

export function clearedDebris(): GardenDebris[] {
  return DEFAULT_DEBRIS.map((d) => ({ ...d, cleared: true }));
}
