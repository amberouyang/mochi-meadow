const STORAGE_KEY = 'mochiMeadow.soundMuted.v1';

export function loadSoundMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveSoundMuted(muted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    /* ignore quota / private mode */
  }
}
