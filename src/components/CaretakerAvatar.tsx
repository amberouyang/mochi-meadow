import type { PlayerProfile } from '../utils/playerProfileSave';
import { ACCESSORIES, HAIR_COLORS, SHIRT_COLORS, SKIN_TONES } from '../utils/playerProfileSave';

/** Compact, profile-driven portrait for the HUD. */
export function CaretakerAvatar({ profile }: { profile: PlayerProfile }) {
  const { avatar } = profile;
  const skin = SKIN_TONES[avatar.skinTone] ?? SKIN_TONES[0];
  const hair = HAIR_COLORS[avatar.hairColor] ?? HAIR_COLORS[0];
  const shirt = SHIRT_COLORS[avatar.shirtColor] ?? SHIRT_COLORS[0];
  const accessory = ACCESSORIES[avatar.accessory]?.id ?? 0;

  return <svg className="caretaker-avatar" viewBox="0 0 48 48" shapeRendering="crispEdges" aria-hidden>
    <rect width="48" height="48" rx="10" fill="#b8dce2" /><rect y="34" width="48" height="14" fill="#8bb875" />
    <ellipse cx="24" cy="41" rx="13" ry="3" fill="#659457" opacity=".45" />
    <rect x="17" y="29" width="14" height="11" rx="2" fill={shirt.color} />
    {avatar.shirtStyle === 1 && <><rect x="19" y="29" width="3" height="11" fill="#466989" /><rect x="26" y="29" width="3" height="11" fill="#466989" /></>}
    {avatar.shirtStyle === 3 && <><rect x="17" y="32" width="14" height="2" fill="#fff" opacity=".65" /><rect x="17" y="37" width="14" height="2" fill="#fff" opacity=".65" /></>}
    <rect x="15" y="16" width="18" height="16" rx="5" fill={skin.color} /><rect x="14" y="11" width="20" height="9" rx="4" fill={hair.color} />
    {avatar.hairStyle === 0 && <><circle cx="14" cy="13" r="5" fill={hair.color} /><circle cx="34" cy="13" r="5" fill={hair.color} /></>}
    {avatar.hairStyle === 1 && <><rect x="12" y="18" width="4" height="11" rx="2" fill={hair.color} /><rect x="32" y="18" width="4" height="11" rx="2" fill={hair.color} /></>}
    {avatar.hairStyle === 2 && <><rect x="12" y="18" width="4" height="15" rx="2" fill={hair.color} /><rect x="32" y="18" width="4" height="15" rx="2" fill={hair.color} /></>}
    {avatar.hairStyle === 3 && <rect x="33" y="9" width="7" height="16" rx="3" fill={hair.color} />}
    {avatar.hairStyle === 4 && <><circle cx="17" cy="10" r="4" fill={hair.color} /><circle cx="24" cy="8" r="4" fill={hair.color} /><circle cx="31" cy="10" r="4" fill={hair.color} /></>}
    {avatar.hairStyle === 5 && <><rect x="13" y="8" width="22" height="11" rx="5" fill="#a2d2ff" /><rect x="13" y="16" width="22" height="3" fill="#7db5e8" /></>}
    <rect x="19" y="23" width="2" height="3" fill="#382923" /><rect x="27" y="23" width="2" height="3" fill="#382923" /><rect x="21" y="28" width="6" height="1" fill="#9f634d" />
    {accessory === 1 && <><circle cx="32" cy="14" r="4" fill="#fff" /><circle cx="32" cy="14" r="1.5" fill="#f4d35e" /></>}
    {accessory === 2 && <><rect x="17" y="22" width="6" height="5" rx="2" fill="none" stroke="#b68555" strokeWidth="1" /><rect x="25" y="22" width="6" height="5" rx="2" fill="none" stroke="#b68555" strokeWidth="1" /></>}
    {accessory === 3 && <path d="M24 10c-4-4 0-7 0-7 0 3 4 3 0 7" fill="#71ad63" />}
    {accessory === 4 && <path d="M32 16l1.4 2.8 3 .4-2.2 2.1.5 3-2.7-1.5-2.7 1.5.5-3-2.2-2.1 3-.4z" fill="#f6d36c" />}
  </svg>;
}
