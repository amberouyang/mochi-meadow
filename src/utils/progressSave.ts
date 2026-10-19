import type { GardenDebris, IncubatingEgg, Pet, Task, TutorialStage } from '../types';
import { clearedDebris, DEFAULT_DEBRIS } from './defaultDebris';

const STORAGE_KEY = 'mochiMeadow.progress.v1';

const TUTORIAL_STAGES: TutorialStage[] = [
  'introMeadow',
  'clearDebris',
  'mochiReveal',
  'showSanctuaryArrow',
  'done',
];

/** Shape grows in later steps; always merge when saving. */
export type ProgressSave = {
  v: 1;
  points: number;
  playerName: string;
  welcomeBonusClaimed: boolean;
  tasks: Task[];
  pets: Pet[];
  eggProgress: number;
  eggHatched: boolean;
  incubatingEgg: IncubatingEgg | null;
  tutorialStage: TutorialStage;
  debris: GardenDebris[];
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
  welcomeBonusClaimed: false,
  tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
  pets: DEFAULT_PETS.map((p) => ({ ...p })),
  eggProgress: 0,
  eggHatched: false,
  incubatingEgg: null,
  tutorialStage: 'introMeadow',
  debris: DEFAULT_DEBRIS.map((d) => ({ ...d })),
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

function parseIncubatingEgg(value: unknown): IncubatingEgg | null {
  if (!isRecord(value)) return null;
  if (typeof value.catalogId !== 'string' || !value.catalogId) return null;
  if (typeof value.name !== 'string' || !value.name.trim()) return null;
  // artSrc is runtime-only (Vite asset URLs); rehydrate from the store catalog.
  return {
    catalogId: value.catalogId,
    name: value.name.trim().slice(0, 24),
  };
}

function serializeIncubatingEgg(egg: IncubatingEgg | null): IncubatingEgg | null {
  if (!egg) return null;
  return { catalogId: egg.catalogId, name: egg.name };
}

function parseTutorialStage(value: unknown, welcomeBonusClaimed: boolean): TutorialStage {
  if (typeof value === 'string' && (TUTORIAL_STAGES as string[]).includes(value)) {
    return value as TutorialStage;
  }
  // Legacy saves: onboarded players should not replay rock clearing.
  return welcomeBonusClaimed ? 'done' : 'introMeadow';
}

function parseDebris(value: unknown, tutorialStage: TutorialStage): GardenDebris[] {
  if (!Array.isArray(value)) {
    return tutorialStage === 'done' || tutorialStage === 'mochiReveal' || tutorialStage === 'showSanctuaryArrow'
      ? clearedDebris()
      : DEFAULT_DEBRIS.map((d) => ({ ...d }));
  }

  const byId = new Map<string, GardenDebris>();
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (typeof item.id !== 'string' || !item.id) continue;
    const base = DEFAULT_DEBRIS.find((d) => d.id === item.id);
    if (!base) continue;
    byId.set(item.id, {
      ...base,
      cleared: Boolean(item.cleared),
    });
  }

  if (byId.size === 0) {
    return tutorialStage === 'done' || tutorialStage === 'mochiReveal' || tutorialStage === 'showSanctuaryArrow'
      ? clearedDebris()
      : DEFAULT_DEBRIS.map((d) => ({ ...d }));
  }

  return DEFAULT_DEBRIS.map((d) => byId.get(d.id) ?? { ...d });
}

function cloneDefaults(): ProgressSave {
  return {
    ...DEFAULTS,
    tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
    pets: DEFAULT_PETS.map((p) => ({ ...p })),
    debris: DEFAULT_DEBRIS.map((d) => ({ ...d })),
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
    // Legacy saves had a name but no welcome flag — treat named players as onboarded.
    const welcomeBonusClaimed =
      typeof parsed.welcomeBonusClaimed === 'boolean'
        ? parsed.welcomeBonusClaimed
        : Boolean(playerName);
    const tasks = parseTasks(parsed.tasks);
    const pets = parsePets(parsed.pets);
    const eggProgress =
      typeof parsed.eggProgress === 'number' && Number.isFinite(parsed.eggProgress)
        ? Math.min(1000, Math.max(0, Math.floor(parsed.eggProgress)))
        : 0;
    const eggHatched = Boolean(parsed.eggHatched);
    const incubatingEgg = parseIncubatingEgg(parsed.incubatingEgg);
    const tutorialStage = parseTutorialStage(parsed.tutorialStage, welcomeBonusClaimed);
    const debris = parseDebris(parsed.debris, tutorialStage);

    return {
      v: 1,
      points,
      playerName,
      welcomeBonusClaimed,
      tasks,
      pets,
      eggProgress,
      eggHatched,
      incubatingEgg,
      tutorialStage,
      debris,
    };
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
      welcomeBonusClaimed:
        patch.welcomeBonusClaimed !== undefined
          ? patch.welcomeBonusClaimed
          : current.welcomeBonusClaimed,
      tasks: patch.tasks !== undefined ? patch.tasks.map((t) => ({ ...t })) : current.tasks,
      pets: patch.pets !== undefined ? patch.pets.map((p) => ({ ...p })) : current.pets,
      eggProgress:
        patch.eggProgress !== undefined
          ? Math.min(1000, Math.max(0, Math.floor(patch.eggProgress)))
          : current.eggProgress,
      eggHatched: patch.eggHatched !== undefined ? patch.eggHatched : current.eggHatched,
      incubatingEgg: serializeIncubatingEgg(
        patch.incubatingEgg !== undefined ? patch.incubatingEgg : current.incubatingEgg,
      ),
      tutorialStage:
        patch.tutorialStage !== undefined ? patch.tutorialStage : current.tutorialStage,
      debris:
        patch.debris !== undefined
          ? patch.debris.map((d) => ({ ...d }))
          : current.debris.map((d) => ({ ...d })),
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
