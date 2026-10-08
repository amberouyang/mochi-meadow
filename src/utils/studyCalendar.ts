const STORAGE_KEY = 'mochiMeadow.studyStreak.v2';

export type StudyStreakSave = {
  lastStudyDate: string | null;
  brainRotActive: boolean;
};

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole calendar days between two YYYY-MM-DD keys (b - a). */
export function calendarDaysBetween(fromKey: string, toKey: string): number {
  const from = new Date(`${fromKey}T12:00:00`);
  const to = new Date(`${toKey}T12:00:00`);
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

export function loadStudyStreak(): StudyStreakSave {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastStudyDate: null, brainRotActive: false };
    const parsed = JSON.parse(raw) as Partial<StudyStreakSave>;
    return {
      lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : null,
      brainRotActive: Boolean(parsed.brainRotActive),
    };
  } catch {
    return { lastStudyDate: null, brainRotActive: false };
  }
}

export function saveStudyStreak(save: StudyStreakSave): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    /* ignore quota / private mode */
  }
}

/** Missed at least one full calendar day since last study. */
export function shouldActivateBrainRot(lastStudyDate: string | null, now = new Date()): boolean {
  if (!lastStudyDate) return false;
  return calendarDaysBetween(lastStudyDate, todayKey(now)) >= 2;
}
