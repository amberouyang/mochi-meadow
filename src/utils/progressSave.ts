import type { Task } from '../types';

const STORAGE_KEY = 'mochiMeadow.progress.v1';

/** Shape grows in later steps; always merge when saving. */
export type ProgressSave = {
  v: 1;
  points: number;
  playerName: string;
  tasks: Task[];
};

export const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Finish math homework', done: false, points: 10 },
  { id: '2', title: 'Read chapter 3', done: false, points: 15 },
];

const DEFAULTS: ProgressSave = {
  v: 1,
  points: 0,
  playerName: '',
  tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
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

export function loadProgress(): ProgressSave {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS, tasks: DEFAULT_TASKS.map((t) => ({ ...t })) };
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return { ...DEFAULTS, tasks: DEFAULT_TASKS.map((t) => ({ ...t })) };

    const points = typeof parsed.points === 'number' && Number.isFinite(parsed.points)
      ? Math.max(0, Math.floor(parsed.points))
      : 0;
    const playerName =
      typeof parsed.playerName === 'string' ? parsed.playerName.trim().slice(0, 24) : '';
    const tasks = parseTasks(parsed.tasks);

    return { v: 1, points, playerName, tasks };
  } catch {
    return { ...DEFAULTS, tasks: DEFAULT_TASKS.map((t) => ({ ...t })) };
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
