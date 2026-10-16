import { create } from 'zustand';
import type {
  Task,
  Pet,
  TutorialStage,
  GardenDebris,
  StorePurchase,
  IncubatingEgg,
} from '../types';
import {
  loadStudyStreak,
  saveStudyStreak,
  shouldActivateBrainRot,
  todayKey,
} from '../utils/studyCalendar';
import { loadStudyGoalDefault, saveStudyGoalDefault } from '../utils/studyGoalDefault';
import { loadSoundMuted, saveSoundMuted } from '../utils/soundSettings';
import {
  clearProgressSave,
  DEFAULT_PETS,
  DEFAULT_TASKS,
  loadProgress,
  saveProgress,
} from '../utils/progressSave';
import sesameMochiEggArt from '../assets/eggs/sesame-mochi-egg.png';

type StudyState = 'idle' | 'studying';

const EGG_ART_BY_ID: Record<string, string> = {
  egg4: sesameMochiEggArt,
};

function withEggArt(egg: IncubatingEgg | null): IncubatingEgg | null {
  if (!egg) return null;
  return { ...egg, artSrc: egg.artSrc ?? EGG_ART_BY_ID[egg.catalogId] };
}

const streakSave = loadStudyStreak();
const savedStudyGoal = loadStudyGoalDefault();
const savedSoundMuted = loadSoundMuted();
const savedProgress = loadProgress();

type NestSlice = {
  eggProgress: number;
  eggHatched: boolean;
  incubatingEgg: IncubatingEgg | null;
  pets: Pet[];
};

/** Warm the nest egg; at 100% hatch a new pet (original mochi stays). */
function advanceIncubation(s: NestSlice, delta: number): Partial<NestSlice> {
  if (!s.incubatingEgg || s.eggHatched) return {};
  const nextEggProgress = Math.min(1000, s.eggProgress + delta);
  if (nextEggProgress < 1000) {
    return { eggProgress: nextEggProgress };
  }

  const name = s.incubatingEgg.name;
  const alreadyOwned = s.pets.some((p) => p.name.toLowerCase() === name.toLowerCase());
  const pets = alreadyOwned
    ? s.pets
    : [
        ...s.pets,
        {
          id: crypto.randomUUID(),
          name,
          mood: 'happy' as const,
          energy: 80,
          level: 1,
        },
      ];

  return {
    eggProgress: 1000,
    eggHatched: true,
    pets,
  };
}

type Store = {
  // Study
  studyMinutesGoal: number;
  studyMinutesToday: number;
  studyState: StudyState;
  lastStudyDate: string | null;
  brainRotActive: boolean;
  setStudyMinutesGoal: (n: number) => void;
  setStudyMinutesToday: (n: number) => void;
  addStudyMinute: () => void;
  setStudyState: (s: StudyState) => void;
  recordStudyDay: () => void;
  evaluateBrainRot: () => void;
  buyMist: () => boolean;

  // Tasks
  tasks: Task[];
  addTask: (title: string, points?: number) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;

  // Points
  points: number;
  addPoints: (n: number) => void;
  spendPoints: (n: number) => boolean;

  // Pets
  pets: Pet[];
  setPetMood: (id: string, mood: Pet['mood']) => void;
  feedPet: (id: string) => void;
  setPetName: (id: string, name: string) => void;

  // Garden
  gardenUnlocked: boolean;
  unlockGarden: () => void;
  lockGarden: () => void;
  checkGardenAccess: () => void;

  // Onboarding / tutorial
  tutorialStage: TutorialStage;
  introStartedAt: number;
  debris: GardenDebris[];
  clearDebris: (id: string) => void;
  awardIntroPointsIfNeeded: () => void;
  setTutorialStage: (stage: TutorialStage) => void;

  // Egg sanctuary / hatching
  eggProgress: number;
  eggHatched: boolean;
  incubatingEgg: IncubatingEgg | null;
  incrementEggProgress: (delta: number) => void;
  /** Buy a store egg into the nest. Returns an error message, or null on success. */
  buyEgg: (catalogId: string) => string | null;

  // Store
  storeEggOptions: StorePurchase[];
  storeCareItems: StorePurchase[];
  lastEggChoiceName?: string;
  welcomeBonusClaimed: boolean;
  claimWelcomeBonus: () => void;

  // Player
  playerName: string;
  setPlayerName: (name: string) => void;

  // Audio prefs (ready for theme / SFX later)
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;

  /** Wipe progress and local meadow saves back to a fresh start. */
  resetProgress: () => void;
};

export const useStore = create<Store>((set, get) => ({
  studyMinutesGoal: savedStudyGoal,
  studyMinutesToday: 0,
  studyState: 'idle',
  lastStudyDate: streakSave.lastStudyDate,
  brainRotActive: streakSave.brainRotActive,
  setStudyMinutesGoal: (n) => {
    const next = Math.max(0, n);
    set({ studyMinutesGoal: next });
    saveStudyGoalDefault(next);
  },
  setStudyMinutesToday: (n) => set({ studyMinutesToday: Math.max(0, n) }),
  addStudyMinute: () => {
    get().recordStudyDay();
    set((s) => ({
      studyMinutesToday: s.studyMinutesToday + 1,
      ...advanceIncubation(s, 5),
    }));
  },
  setStudyState: (s) => {
    if (s === 'studying') get().recordStudyDay();
    set({ studyState: s });
  },
  recordStudyDay: () => {
    const today = todayKey();
    const { lastStudyDate, brainRotActive } = get();
    if (lastStudyDate === today) return;
    set({ lastStudyDate: today });
    saveStudyStreak({ lastStudyDate: today, brainRotActive });
  },
  evaluateBrainRot: () => {
    const { lastStudyDate, brainRotActive } = get();
    const missedDay = shouldActivateBrainRot(lastStudyDate);
    if (!missedDay && !brainRotActive) return;

    const nextRot = missedDay || brainRotActive;
    set((s) => ({
      brainRotActive: nextRot,
      pets: s.pets.map((p) => ({
        ...p,
        mood: nextRot ? ('sad' as const) : p.mood,
        energy: nextRot ? Math.min(p.energy, 25) : p.energy,
      })),
    }));
    saveStudyStreak({ lastStudyDate, brainRotActive: nextRot });
  },
  buyMist: () => {
    const mist = get().storeCareItems.find((i) => i.type === 'mist');
    if (!mist) return false;
    if (!get().spendPoints(mist.cost)) return false;
    set((s) => ({
      brainRotActive: false,
      pets: s.pets.map((p) => ({
        ...p,
        mood: 'happy' as const,
        energy: Math.min(100, p.energy + 30),
      })),
    }));
    saveStudyStreak({ lastStudyDate: get().lastStudyDate, brainRotActive: false });
    return true;
  },

  tasks: savedProgress.tasks,
  addTask: (title, points = 5) =>
    set((s) => ({
      tasks: [...s.tasks, { id: crypto.randomUUID(), title, done: false, points }],
    })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  points: savedProgress.points,
  addPoints: (n) =>
    set((s) => ({
      points: s.points + n,
      ...advanceIncubation(s, n),
    })),
  spendPoints: (n) => {
    const { points } = get();
    if (points < n) return false;
    set((s) => ({ points: s.points - n }));
    return true;
  },

  pets: savedProgress.pets,
  setPetMood: (id, mood) =>
    set((s) => ({
      pets: s.pets.map((p) => (p.id === id ? { ...p, mood } : p)),
    })),
  feedPet: (id) =>
    set((s) => ({
      pets: s.pets.map((p) => (p.id === id ? { ...p, energy: Math.min(100, p.energy + 20) } : p)),
    })),
  setPetName: (id, name) =>
    set((s) => ({
      pets: s.pets.map((p) => (p.id === id ? { ...p, name } : p)),
      lastEggChoiceName: name,
    })),

  gardenUnlocked: false,
  unlockGarden: () => set({ gardenUnlocked: true }),
  lockGarden: () => set({ gardenUnlocked: false }),
  checkGardenAccess: () => {
    const { tasks, studyMinutesToday, studyMinutesGoal } = get();
    const allDone = tasks.every((t) => t.done);
    const studyDone = studyMinutesToday >= studyMinutesGoal;
    set({ gardenUnlocked: allDone || studyDone });
  },

  // Onboarding / tutorial
  tutorialStage: 'introMeadow',
  introStartedAt: Date.now(),
  debris: [
    // Five separate rocks (one per sprite) so they clear one-by-one.
    // d1/d5 sit higher and more inward; d2–d4 form a lower row.
    { id: 'd1', kind: 'rock', cleared: false, assetIndex: 0, leftPct: 18, bottomPct: 56 },
    { id: 'd2', kind: 'rock', cleared: false, assetIndex: 1, leftPct: 28, bottomPct: 26 },
    { id: 'd3', kind: 'rock', cleared: false, assetIndex: 2, leftPct: 48, bottomPct: 22 },
    { id: 'd4', kind: 'rock', cleared: false, assetIndex: 3, leftPct: 68, bottomPct: 26 },
    { id: 'd5', kind: 'rock', cleared: false, assetIndex: 4, leftPct: 82, bottomPct: 48 },
  ],
  clearDebris: (id) =>
    set((s) => ({
      debris: s.debris.map((d) => (d.id === id ? { ...d, cleared: true } : d)),
    })),
  awardIntroPointsIfNeeded: () => {
    const { points, debris, tutorialStage } = get();
    const allCleared = debris.every((d) => d.cleared);
    if (!allCleared || tutorialStage !== 'clearDebris') return;
    // Meadow is clean — next beat reveals the first mochi who “moved in.”
    if (points >= 100) {
      set({ tutorialStage: 'mochiReveal' });
      return;
    }
    set((s) => ({
      points: s.points + 100,
      tutorialStage: 'mochiReveal',
    }));
  },
  setTutorialStage: (stage) => set({ tutorialStage: stage }),

  // Egg sanctuary / hatching
  eggProgress: savedProgress.eggProgress,
  eggHatched: savedProgress.eggHatched,
  incubatingEgg: withEggArt(savedProgress.incubatingEgg),
  incrementEggProgress: (delta) => set((s) => ({ ...advanceIncubation(s, delta) })),
  buyEgg: (catalogId) => {
    const egg = get().storeEggOptions.find((e) => e.id === catalogId && e.type === 'egg');
    if (!egg) return 'That egg is not in the store.';

    const { pets, incubatingEgg, eggHatched } = get();
    if (pets.some((p) => p.name.toLowerCase() === egg.name.toLowerCase())) {
      return `You already have ${egg.name} in your meadow.`;
    }
    if (incubatingEgg && !eggHatched) {
      return `${incubatingEgg.name} is still incubating. Finish hatching it first.`;
    }
    if (!get().spendPoints(egg.cost)) {
      return 'Not enough points for this egg.';
    }

    set({
      incubatingEgg: withEggArt({
        catalogId: egg.id,
        name: egg.name,
        artSrc: egg.artSrc ?? EGG_ART_BY_ID[egg.id],
      }),
      eggProgress: 0,
      eggHatched: false,
      lastEggChoiceName: egg.name,
    });
    return null;
  },

  // Store
  storeEggOptions: [
    { id: 'egg1', name: 'Sakura Mochi', cost: 50, description: 'A soft pink mochi who loves spring.', type: 'egg' },
    { id: 'egg2', name: 'Matcha Mochi', cost: 50, description: 'A calm green mochi who loves tea.', type: 'egg' },
    { id: 'egg3', name: 'Yuzu Mochi', cost: 50, description: 'A bright citrus mochi full of energy.', type: 'egg' },
    {
      id: 'egg4',
      name: 'Sesame Mochi',
      cost: 55,
      description: 'A toasted sesame mochi with marbled charcoal shell.',
      type: 'egg',
      artSrc: EGG_ART_BY_ID.egg4,
    },
  ],
  storeCareItems: [
    {
      id: 'mist1',
      name: 'Meadow Mist',
      cost: 35,
      description: 'Clears brain-rot fog and heals sick mochi pets after a missed study day.',
      type: 'mist',
    },
  ],
  lastEggChoiceName: savedProgress.incubatingEgg?.name,
  welcomeBonusClaimed: savedProgress.welcomeBonusClaimed,
  claimWelcomeBonus: () => {
    const { welcomeBonusClaimed } = get();
    if (welcomeBonusClaimed) return;
    set((s) => ({
      points: s.points + 50,
      welcomeBonusClaimed: true,
    }));
  },

  // Player
  playerName: savedProgress.playerName,
  setPlayerName: (name) => set({ playerName: name.trim().slice(0, 24) }),

  soundMuted: savedSoundMuted,
  setSoundMuted: (muted) => {
    set({ soundMuted: muted });
    saveSoundMuted(muted);
  },

  resetProgress: () => {
    const goal = loadStudyGoalDefault();
    set({
      studyMinutesGoal: goal,
      studyMinutesToday: 0,
      studyState: 'idle',
      lastStudyDate: null,
      brainRotActive: false,
      tasks: DEFAULT_TASKS.map((t) => ({ ...t })),
      points: 0,
      pets: DEFAULT_PETS.map((p) => ({ ...p })),
      gardenUnlocked: false,
      tutorialStage: 'introMeadow',
      introStartedAt: Date.now(),
      debris: [
        { id: 'd1', kind: 'rock', cleared: false, assetIndex: 0, leftPct: 18, bottomPct: 56 },
        { id: 'd2', kind: 'rock', cleared: false, assetIndex: 1, leftPct: 28, bottomPct: 26 },
        { id: 'd3', kind: 'rock', cleared: false, assetIndex: 2, leftPct: 48, bottomPct: 22 },
        { id: 'd4', kind: 'rock', cleared: false, assetIndex: 3, leftPct: 68, bottomPct: 26 },
        { id: 'd5', kind: 'rock', cleared: false, assetIndex: 4, leftPct: 82, bottomPct: 48 },
      ],
      eggProgress: 0,
      eggHatched: false,
      incubatingEgg: null,
      lastEggChoiceName: undefined,
      welcomeBonusClaimed: false,
      playerName: '',
    });
    saveStudyStreak({ lastStudyDate: null, brainRotActive: false });
    clearProgressSave();
    try {
      localStorage.removeItem('mochiMeadow.meadowIntro.v1');
      localStorage.removeItem('mochiMeadow.studyStreak.v1');
      localStorage.removeItem('mochiMeadow.studyStreak.v2');
      localStorage.removeItem('mochiMeadow.clearForcedBrainRot.v1');
    } catch {
      /* ignore */
    }
    // Intro / name / rubble live in App UI state — reload restarts that flow cleanly.
    window.location.reload();
  },
}));

useStore.subscribe((state, prev) => {
  if (
    state.points === prev.points &&
    state.playerName === prev.playerName &&
    state.welcomeBonusClaimed === prev.welcomeBonusClaimed &&
    state.tasks === prev.tasks &&
    state.pets === prev.pets &&
    state.eggProgress === prev.eggProgress &&
    state.eggHatched === prev.eggHatched &&
    state.incubatingEgg === prev.incubatingEgg
  ) {
    return;
  }
  saveProgress({
    points: state.points,
    playerName: state.playerName,
    welcomeBonusClaimed: state.welcomeBonusClaimed,
    tasks: state.tasks,
    pets: state.pets,
    eggProgress: state.eggProgress,
    eggHatched: state.eggHatched,
    incubatingEgg: state.incubatingEgg,
  });
});

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { __mochiStore: typeof useStore }).__mochiStore = useStore;
}
