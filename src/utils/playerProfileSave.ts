export type AvatarCustomization = {
  skinTone: number; // 0..4
  hairStyle: number; // 0..5
  hairColor: number; // 0..7
  shirtStyle: number; // 0..4
  shirtColor: number; // 0..5
  accessory: number; // 0..4
};

export type PlayerProfile = {
  name: string;
  meadowName: string;
  favoriteThing: string;
  companionPreference: string;
  avatar: AvatarCustomization;
  totalStudyMinutesAllTime: number;
  totalTasksCompleted: number;
  unlockedBadges: string[];
};

export const SKIN_TONES = [
  { id: 0, label: 'Fair Peach', color: '#ffd6be', shadow: '#e5b399' },
  { id: 1, label: 'Soft Cream', color: '#ffdfc4', shadow: '#e8bfa0' },
  { id: 2, label: 'Warm Honey', color: '#e8b88a', shadow: '#c79263' },
  { id: 3, label: 'Sweet Tan', color: '#c99166', shadow: '#a66d43' },
  { id: 4, label: 'Deep Mocha', color: '#8d5538', shadow: '#6b3c24' },
];

export const HAIR_STYLES = [
  { id: 0, label: 'Twin Buns', desc: 'Cute high puffs with soft ribbon ties' },
  { id: 1, label: 'Messy Bob', desc: 'Fluffy chin-length bangs' },
  { id: 2, label: 'Wavy Locks', desc: 'Gentle cascading waves' },
  { id: 3, label: 'High Ponytail', desc: 'Breezy ponytail with side bangs' },
  { id: 4, label: 'Sprout Curls', desc: 'Short playful shaggy curls' },
  { id: 5, label: 'Slouchy Beanie', desc: 'Soft knit cap with loose strands' },
];

export const HAIR_COLORS = [
  { id: 0, label: 'Chestnut Brown', color: '#6a432d', highlight: '#8a5c40' },
  { id: 1, label: 'Matcha Tea', color: '#688e6b', highlight: '#87af8a' },
  { id: 2, label: 'Honey Blonde', color: '#deb25b', highlight: '#f5ce7e' },
  { id: 3, label: 'Strawberry Pink', color: '#e07a93', highlight: '#fca1b7' },
  { id: 4, label: 'Midnight Navy', color: '#313f5c', highlight: '#4b5d82' },
  { id: 5, label: 'Lavender Mist', color: '#9782b8', highlight: '#b9a5da' },
  { id: 6, label: 'Milk Tea Tan', color: '#ad8b73', highlight: '#cca991' },
  { id: 7, label: 'Ginger Sunset', color: '#c7623a', highlight: '#e68159' },
];

export const SHIRT_STYLES = [
  { id: 0, label: 'Cozy Cardigan', desc: 'Oversized knit sweater with buttons' },
  { id: 1, label: 'Denim Overalls', desc: 'Stardew-inspired farming overalls' },
  { id: 2, label: 'Sailor Collar', desc: 'Charming pastel collar shirt' },
  { id: 3, label: 'Striped Pullover', desc: 'Warm two-tone horizontal stripes' },
  { id: 4, label: 'Cottage Apron', desc: 'Gardening apron with front pocket' },
];

export const SHIRT_COLORS = [
  { id: 0, label: 'Sage Mint', color: '#88cfae', accent: '#6ab08f' },
  { id: 1, label: 'Blush Peach', color: '#ffb5a7', accent: '#e89485' },
  { id: 2, label: 'Buttercup', color: '#ffe599', accent: '#e0c26c' },
  { id: 3, label: 'Sky Pastel', color: '#a2d2ff', accent: '#7db5e8' },
  { id: 4, label: 'Soft Lavender', color: '#cdb4db', accent: '#ab92b9' },
  { id: 5, label: 'Warm Cocoa', color: '#b08968', accent: '#8c6849' },
];

export const ACCESSORIES = [
  { id: 0, label: 'None', desc: 'Simple natural look' },
  { id: 1, label: 'Daisy Flower', desc: 'White flower with sunny center' },
  { id: 2, label: 'Gold Wire Glasses', desc: 'Round vintage reading spectacles' },
  { id: 3, label: 'Little Sprout', desc: 'Tiny leaf sprouting from hair' },
  { id: 4, label: 'Starry Hairpin', desc: 'Golden twinkle pin' },
];

export const COMPANIONS = [
  { id: 'sakura', label: 'Sakura Mochi', type: 'mochi', desc: 'Pink & gentle spring lover' },
  { id: 'matcha', label: 'Matcha Mochi', type: 'mochi', desc: 'Calm tea sipper' },
  { id: 'yuzu', label: 'Yuzu Mochi', type: 'mochi', desc: 'Zesty sunny ball of joy' },
  { id: 'sesame', label: 'Sesame Mochi', type: 'mochi', desc: 'Quiet midnight thinker' },
  { id: 'bunny', label: 'Bunny Mochi', type: 'mochi', desc: 'Soft pink hopper with fluffy ears' },
  { id: 'calico', label: 'Meadow Calico', type: 'cat', desc: 'Sleepy farm kitten' },
];

export const CUTE_FAVORITE_THINGS = [
  'Warm Matcha Lattes',
  'Gentle Morning Rain',
  'Fresh Strawberries',
  'Lo-Fi Piano Chords',
  'Cozy Fuzzy Blankets',
  'Starry Night Skies',
  'Sweet Cinnamon Buns',
  'Blooming Sunflowers',
  'Quiet Library Nooks',
  'Fluffy Purring Kittens',
];

export const CUTE_MEADOW_NAMES = [
  'Sunnybloom Meadow',
  'Starberry Farm',
  'Honey Clover Glen',
  'Mochi Whispers Sanctuary',
  'Dewdrop Blossom Field',
  'Cozy Acorn Hollow',
  'Sweetpea Valley',
];

const PROFILE_KEY = 'mochiMeadow.playerProfile.v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Little Caretaker',
  meadowName: 'Sunnybloom Meadow',
  favoriteThing: 'Warm Matcha Lattes',
  companionPreference: 'sakura',
  avatar: {
    skinTone: 1,
    hairStyle: 0,
    hairColor: 0,
    shirtStyle: 0,
    shirtColor: 0,
    accessory: 1,
  },
  totalStudyMinutesAllTime: 45,
  totalTasksCompleted: 3,
  unlockedBadges: ['first_focus', 'tea_master'],
};

export function loadPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim().slice(0, 24) : DEFAULT_PROFILE.name,
      meadowName: typeof parsed.meadowName === 'string' && parsed.meadowName.trim() ? parsed.meadowName.trim().slice(0, 30) : DEFAULT_PROFILE.meadowName,
      favoriteThing: typeof parsed.favoriteThing === 'string' && parsed.favoriteThing.trim() ? parsed.favoriteThing.trim().slice(0, 30) : DEFAULT_PROFILE.favoriteThing,
      companionPreference: typeof parsed.companionPreference === 'string' ? parsed.companionPreference : DEFAULT_PROFILE.companionPreference,
      avatar: {
        skinTone: typeof parsed.avatar?.skinTone === 'number' ? Math.max(0, Math.min(SKIN_TONES.length - 1, parsed.avatar.skinTone)) : DEFAULT_PROFILE.avatar.skinTone,
        hairStyle: typeof parsed.avatar?.hairStyle === 'number' ? Math.max(0, Math.min(HAIR_STYLES.length - 1, parsed.avatar.hairStyle)) : DEFAULT_PROFILE.avatar.hairStyle,
        hairColor: typeof parsed.avatar?.hairColor === 'number' ? Math.max(0, Math.min(HAIR_COLORS.length - 1, parsed.avatar.hairColor)) : DEFAULT_PROFILE.avatar.hairColor,
        shirtStyle: typeof parsed.avatar?.shirtStyle === 'number' ? Math.max(0, Math.min(SHIRT_STYLES.length - 1, parsed.avatar.shirtStyle)) : DEFAULT_PROFILE.avatar.shirtStyle,
        shirtColor: typeof parsed.avatar?.shirtColor === 'number' ? Math.max(0, Math.min(SHIRT_COLORS.length - 1, parsed.avatar.shirtColor)) : DEFAULT_PROFILE.avatar.shirtColor,
        accessory: typeof parsed.avatar?.accessory === 'number' ? Math.max(0, Math.min(ACCESSORIES.length - 1, parsed.avatar.accessory)) : DEFAULT_PROFILE.avatar.accessory,
      },
      totalStudyMinutesAllTime: typeof parsed.totalStudyMinutesAllTime === 'number' ? Math.max(0, parsed.totalStudyMinutesAllTime) : DEFAULT_PROFILE.totalStudyMinutesAllTime,
      totalTasksCompleted: typeof parsed.totalTasksCompleted === 'number' ? Math.max(0, parsed.totalTasksCompleted) : DEFAULT_PROFILE.totalTasksCompleted,
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : DEFAULT_PROFILE.unlockedBadges,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function rollRandomProfile(): Partial<PlayerProfile> {
  const randSkin = Math.floor(Math.random() * SKIN_TONES.length);
  const randHair = Math.floor(Math.random() * HAIR_STYLES.length);
  const randColor = Math.floor(Math.random() * HAIR_COLORS.length);
  const randShirt = Math.floor(Math.random() * SHIRT_STYLES.length);
  const randShirtColor = Math.floor(Math.random() * SHIRT_COLORS.length);
  const randAcc = Math.floor(Math.random() * ACCESSORIES.length);
  const randFav = CUTE_FAVORITE_THINGS[Math.floor(Math.random() * CUTE_FAVORITE_THINGS.length)];
  const randMeadow = CUTE_MEADOW_NAMES[Math.floor(Math.random() * CUTE_MEADOW_NAMES.length)];
  const randComp = COMPANIONS[Math.floor(Math.random() * COMPANIONS.length)].id;

  return {
    favoriteThing: randFav,
    meadowName: randMeadow,
    companionPreference: randComp,
    avatar: {
      skinTone: randSkin,
      hairStyle: randHair,
      hairColor: randColor,
      shirtStyle: randShirt,
      shirtColor: randShirtColor,
      accessory: randAcc,
    },
  };
}

export function getCaretakerRank(totalMinutes: number): {
  level: number;
  title: string;
  nextThreshold: number;
  progressPercent: number;
} {
  const RANKS = [
    { level: 1, title: 'Meadow Sprout', min: 0, max: 30 },
    { level: 2, title: 'Gentle Apprentice', min: 30, max: 90 },
    { level: 3, title: 'Cozy Scholar', min: 90, max: 180 },
    { level: 4, title: 'Bloom Botanist', min: 180, max: 360 },
    { level: 5, title: 'Master Caretaker', min: 360, max: 720 },
    { level: 6, title: 'Grand Meadow Guardian', min: 720, max: 1500 },
  ];

  const current = RANKS.find((r) => totalMinutes < r.max) ?? RANKS[RANKS.length - 1];
  const span = current.max - current.min;
  const inRank = Math.max(0, totalMinutes - current.min);
  const pct = Math.min(100, Math.round((inRank / span) * 100));

  return {
    level: current.level,
    title: current.title,
    nextThreshold: current.max,
    progressPercent: pct,
  };
}
