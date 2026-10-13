import type { Pet, Task } from '../types';

const STORAGE_KEY = 'mochiMeadow.progress.v1';

/** Shape grows in later steps; always merge when saving. */
export type ProgressSave = {
  v: 1;
  points: number;
  playerName: string;
  tasks: Task[];
  pets: Pet[];
};

export const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Finish math homework', done: false, points: 10 },
  { id: '2', title: 'Read chapter 3', done: false, points: 15 },
];

export const DEFAULT_PETS: Pet[] = [
  { id: 'm1', name: 'Mochi', mood: 'neutral', energy: 50, level: 1 },
];

const DEFAULTS: ProgressSave = {
  v: 1,
  points: 0,
  playerName: '',
  tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
  pets: DEFAULT_PETS.map((p) => ({ ...p })),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseTask(value: unknown): Task | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || !value.id) return null;
  if (typeof value.title !== 'string') return null;
  if (typeof value.done !== 'boolean') return null;
  const points =
    typeof value.points === 'number' && Number.isFinite(value.points)
      ? Math.max(0, Math.floor(value.points))
      : 5;
  return {
    id: value.id,
    title: value.title.slice(0, 120),
    done: value.done,
    points,
  };
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) return DEFAULT_TASKS.map((t) => ({ ...t }));
  const tasks = value.map(parseTask).filter((t): t is Task => t != null);
  return tasks.length > 0 ? tasks : DEFAULT_TASKS.map((t) => ({ ...t }));
}

function parseMood(value: unknown): Pet['mood'] {
  if (value === 'happy' || value === 'sad' || value === 'neutral') return value;
  return 'neutral';
}

function parsePet(value: unknown): Pet | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || !value.id) return null;
  if (typeof value.name !== 'string' || !value.name.trim()) return null;
  const energy =
    typeof value.energy === 'number' && Number.isFinite(value.energy)
      ? Math.min(100, Math.max(0, Math.floor(value.energy)))
      : 50;
  const level =
    typeof value.level === 'number' && Number.isFinite(value.level)
      ? Math.max(1, Math.floor(value.level))
      : 1;
  return {
    id: value.id,
    name: value.name.trim().slice(0, 24),
    mood: parseMood(value.mood),
    energy,
    level,
  };
}

function parsePets(value: unknown): Pet[] {
  if (!Array.isArray(value)) return DEFAULT_PETS.map((p) => ({ ...p }));
  const pets = value.map(parsePet).filter((p): p is Pet => p != null);
  return pets.length > 0 ? pets : DEFAULT_PETS.map((p) => ({ ...p }));
}

function cloneDefaults(): ProgressSave {
  return {
    ...DEFAULTS,
    tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
    pets: DEFAULT_PETS.map((p) => ({ ...p })),
  };
}

export function loadProgress(): ProgressSave {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return cloneDefaults();

    const points = typeof parsed.points === 'number' && Number.isFinite(parsed.points)
      ? Math.max(0, Math.floor(parsed.points))
      : 0;
    const playerName =
      typeof parsed.playerName === 'string' ? parsed.playerName.trim().slice(0, 24) : '';
    const tasks = parseTasks(parsed.tasks);
    const pets = parsePets(parsed.pets);

    return { v: 1, points, playerName, tasks, pets };
  } catch {
    return cloneDefaults();
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
      tasks: patch.tasks !== undefined ? patch.tasks.map((t) => ({ ...t })) : current.tasks,
      pets: patch.pets !== undefined ? patch.pets.map((p) => ({ ...p })) : current.pets,
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
