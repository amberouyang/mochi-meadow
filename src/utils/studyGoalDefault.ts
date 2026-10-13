const STORAGE_KEY = 'mochiMeadow.studyGoalDefault.v1';
const FALLBACK_MINUTES = 60;

export function loadStudyGoalDefault(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return FALLBACK_MINUTES;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) return FALLBACK_MINUTES;
    return n;
  } catch {
    return FALLBACK_MINUTES;
  }
}

export function saveStudyGoalDefault(minutes: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(minutes))));
  } catch {
    /* ignore quota / private mode */
  }
}
