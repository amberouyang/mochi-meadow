export type LightingMode = 'auto' | 'day' | 'sunset' | 'night' | 'dawn';

const STORAGE_KEY = 'mochiMeadow.lightingMode.v1';

export function loadLightingMode(): LightingMode {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'day' || val === 'sunset' || val === 'night' || val === 'dawn' || val === 'auto') {
      return val;
    }
    return 'auto';
  } catch {
    return 'auto';
  }
}

export function saveLightingMode(mode: LightingMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
}
