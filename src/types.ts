export type Task = {
  id: string;
  title: string;
  done: boolean;
  points: number;
};

export type Pet = {
  id: string;
  name: string;
  mood: 'happy' | 'sad' | 'neutral';
  energy: number;
  level: number;
};

export type GardenAccess = 'locked' | 'unlocked';

export type ShopItem = {
  id: string;
  name: string;
  cost: number;
  type: 'food' | 'mist' | 'shelter' | 'decoration';
};

export type TutorialStage =
  | 'introMeadow'
  | 'clearDebris'
  | 'mochiReveal'
  | 'showSanctuaryArrow'
  | 'done';

export type GardenDebris = {
  id: string;
  kind: 'rock' | 'tree' | 'rubble';
  cleared: boolean;
  /** Placement in the meadow overlay, as % of the container. */
  leftPct?: number;
  bottomPct?: number;
  /** For rocks: which sprite to use (0..4). */
  assetIndex?: number;
};

export type StorePurchase = {
  id: string;
  name: string;
  cost: number;
  description: string;
  type: 'egg' | 'mist';
  /** Optional egg / item art (imported asset URL). */
  artSrc?: string;
};

/** Egg currently warming in the nest (bought from the store). */
export type IncubatingEgg = {
  catalogId: string;
  name: string;
  artSrc?: string;
};
