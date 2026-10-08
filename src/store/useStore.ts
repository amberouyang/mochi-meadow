import { create } from 'zustand';
import type { Task, Pet, TutorialStage, GardenDebris, StorePurchase } from '../types';
import {
  loadStudyStreak,
  saveStudyStreak,
  shouldActivateBrainRot,
  todayKey,
} from '../utils/studyCalendar';

type StudyState = 'idle' | 'studying';

const streakSave = loadStudyStreak();

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
  incrementEggProgress: (delta: number) => void;

  // Store
  storeEggOptions: StorePurchase[];
  storeCareItems: StorePurchase[];
  lastEggChoiceName?: string;
  welcomeBonusClaimed: boolean;
  claimWelcomeBonus: () => void;

  // Player
  playerName: string;
  setPlayerName: (name: string) => void;
};

export const useStore = create<Store>((set, get) => ({
  studyMinutesGoal: 60,
  studyMinutesToday: 0,
  studyState: 'idle',
  lastStudyDate: streakSave.lastStudyDate,
  brainRotActive: streakSave.brainRotActive,
  setStudyMinutesGoal: (n) => set({ studyMinutesGoal: Math.max(0, n) }),
  setStudyMinutesToday: (n) => set({ studyMinutesToday: Math.max(0, n) }),
  addStudyMinute: () => {
    get().recordStudyDay();
    set((s) => {
      const nextMinutes = s.studyMinutesToday + 1;
      const nextEggProgress = Math.min(1000, s.eggProgress + 5);
      const eggHatched = s.eggHatched || nextEggProgress >= 1000;
      return {
        studyMinutesToday: nextMinutes,
        eggProgress: nextEggProgress,
        eggHatched,
      };
    });
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

  tasks: [
    { id: '1', title: 'Finish math homework', done: false, points: 10 },
    { id: '2', title: 'Read chapter 3', done: false, points: 15 },
  ],
  addTask: (title, points = 5) =>
    set((s) => ({
      tasks: [...s.tasks, { id: crypto.randomUUID(), title, done: false, points }],
    })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  points: 0,
  addPoints: (n) =>
    set((s) => {
      const nextPoints = s.points + n;
      const nextEggProgress = Math.min(1000, s.eggProgress + n);
      const eggHatched = s.eggHatched || nextEggProgress >= 1000;
      return { points: nextPoints, eggProgress: nextEggProgress, eggHatched };
    }),
  spendPoints: (n) => {
    const { points } = get();
    if (points < n) return false;
    set((s) => ({ points: s.points - n }));
    return true;
  },

  pets: [{ id: 'm1', name: 'Mochi', mood: 'neutral', energy: 50, level: 1 }],
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
    { id: 'd1', kind: 'rock', cleared: false, assetIndex: 0, leftPct: 18, bottomPct: 20 },
    { id: 'd2', kind: 'rock', cleared: false, assetIndex: 1, leftPct: 34, bottomPct: 16 },
    { id: 'd3', kind: 'rock', cleared: false, assetIndex: 2, leftPct: 50, bottomPct: 22 },
    { id: 'd4', kind: 'rock', cleared: false, assetIndex: 3, leftPct: 66, bottomPct: 15 },
    { id: 'd5', kind: 'rock', cleared: false, assetIndex: 4, leftPct: 70, bottomPct: 28 },
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
  eggProgress: 0,
  eggHatched: false,
  incrementEggProgress: (delta) =>
    set((s) => {
      const next = Math.min(1000, s.eggProgress + delta);
      const eggHatched = s.eggHatched || next >= 1000;
      return { eggProgress: next, eggHatched };
    }),

  // Store
  storeEggOptions: [
    { id: 'egg1', name: 'Sakura Mochi', cost: 50, description: 'A soft pink mochi who loves spring.', type: 'egg' },
    { id: 'egg2', name: 'Matcha Mochi', cost: 50, description: 'A calm green mochi who loves tea.', type: 'egg' },
    { id: 'egg3', name: 'Yuzu Mochi', cost: 50, description: 'A bright citrus mochi full of energy.', type: 'egg' },
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
  lastEggChoiceName: undefined,
  welcomeBonusClaimed: false,
  claimWelcomeBonus: () => {
    const { welcomeBonusClaimed } = get();
    if (welcomeBonusClaimed) return;
    set((s) => ({
      points: s.points + 50,
      welcomeBonusClaimed: true,
    }));
  },

  // Player
  playerName: '',
  setPlayerName: (name) => set({ playerName: name.trim().slice(0, 24) }),
}));

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { __mochiStore: typeof useStore }).__mochiStore = useStore;
}
