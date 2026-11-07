import type { Pet } from '../types';

export type MilestoneId = 'first_focus' | 'steady_sprout' | 'cozy_scholar' | 'task_champion' | 'pet_pal';

export const MILESTONES: Record<MilestoneId, { title: string; note: string; icon: string }> = {
  first_focus: { title: 'First Sprout', note: 'Your first focused minute nourished the meadow.', icon: '🌱' },
  steady_sprout: { title: 'Steady Sprout', note: 'You have focused for 30 gentle minutes.', icon: '🌿' },
  cozy_scholar: { title: 'Cozy Scholar', note: 'Two hours of care and curiosity—beautiful work.', icon: '📚' },
  task_champion: { title: 'Task Champion', note: 'Three checklist goals completed.', icon: '⭐' },
  pet_pal: { title: 'Pet Pal', note: 'One of your mochi grew to level 3.', icon: '🐾' },
};

/** XP needed to reach the next level. The curve is deliberately slow and forgiving. */
export function petXpForNextLevel(level: number) {
  return 12 + Math.max(0, level - 1) * 8;
}

export function levelPet(pet: Pet, xpGain: number): Pet {
  let level = pet.level;
  let experience = (pet.experience ?? 0) + xpGain;
  while (experience >= petXpForNextLevel(level)) {
    experience -= petXpForNextLevel(level);
    level += 1;
  }
  return { ...pet, level, experience };
}

export function petLevelProgress(pet: Pet) {
  const required = petXpForNextLevel(pet.level);
  const experience = pet.experience ?? 0;
  return { experience, required, percent: Math.min(100, Math.round((experience / required) * 100)) };
}
