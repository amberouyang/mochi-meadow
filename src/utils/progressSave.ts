const STORAGE_KEY = 'mochiMeadow.progress.v1';

/** Shape grows in later steps; always merge when saving. */
export type ProgressSave = {
  v: 1;
  points: number;
  playerName: string;
};

const DEFAULTS: ProgressSave = {
  v: 1,
  points: 0,
  playerName: '',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function loadProgress(): ProgressSave {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return { ...DEFAULTS };

    const points = typeof parsed.points === 'number' && Number.isFinite(parsed.points)
      ? Math.max(0, Math.floor(parsed.points))
      : 0;
    const playerName =
      typeof parsed.playerName === 'string' ? parsed.playerName.trim().slice(0, 24) : '';

    return { v: 1, points, playerName };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveProgress(patch: Partial<Omit<ProgressSave, 'v'>>): void {
  try {
    const current = loadProgress();
    const next: ProgressSave = {
      v: 1,
      points: patch.points !== undefined ? Math.max(0, Math.floor(patch.points)) : current.points,
      playerName:
        patch.playerName !== undefined
          ? patch.playerName.trim().slice(0, 24)
          : current.playerName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearProgressSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
