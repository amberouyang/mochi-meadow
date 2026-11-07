export type RoomTheme = 'morning' | 'sunset' | 'night' | 'candy';
export type DeskPlant = 'succulent' | 'lavender' | 'bonsai';
export type BedspreadStyle = 'moon' | 'strawberry' | 'sage';
export type FloorRug = 'cloud' | 'flower' | 'woven';

export type RoomDecor = {
  theme: RoomTheme;
  plant: DeskPlant;
  bedspread: BedspreadStyle;
  rug: FloorRug;
};

export type ActiveDrinkBuff = {
  drinkId: string;
  name: string;
  effectLabel: string;
  bonusRate: number; // e.g. +1 bonus pt per minute or per 5 min
  expiresAt: number; // unix timestamp ms
};

const ROOM_DECOR_KEY = 'mochiMeadow.roomDecor.v1';
const DRINK_BUFF_KEY = 'mochiMeadow.activeDrinkBuff.v1';

export const DEFAULT_ROOM_DECOR: RoomDecor = {
  theme: 'morning',
  plant: 'succulent',
  bedspread: 'moon',
  rug: 'cloud',
};

export function loadRoomDecor(): RoomDecor {
  try {
    const raw = localStorage.getItem(ROOM_DECOR_KEY);
    if (!raw) return DEFAULT_ROOM_DECOR;
    const parsed = JSON.parse(raw);
    return {
      theme: ['morning', 'sunset', 'night', 'candy'].includes(parsed.theme) ? parsed.theme : 'morning',
      plant: ['succulent', 'lavender', 'bonsai'].includes(parsed.plant) ? parsed.plant : 'succulent',
      bedspread: ['moon', 'strawberry', 'sage'].includes(parsed.bedspread) ? parsed.bedspread : 'moon',
      rug: ['cloud', 'flower', 'woven'].includes(parsed.rug) ? parsed.rug : 'cloud',
    };
  } catch {
    return DEFAULT_ROOM_DECOR;
  }
}

export function saveRoomDecor(decor: RoomDecor): void {
  try {
    localStorage.setItem(ROOM_DECOR_KEY, JSON.stringify(decor));
  } catch {
    /* ignore */
  }
}

export function loadActiveDrinkBuff(): ActiveDrinkBuff | null {
  try {
    const raw = localStorage.getItem(DRINK_BUFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveDrinkBuff;
    if (parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveActiveDrinkBuff(buff: ActiveDrinkBuff | null): void {
  try {
    if (!buff) {
      localStorage.removeItem(DRINK_BUFF_KEY);
    } else {
      localStorage.setItem(DRINK_BUFF_KEY, JSON.stringify(buff));
    }
  } catch {
    /* ignore */
  }
}
