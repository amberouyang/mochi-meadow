/** Crisp pixel-art egg for nest / store — matches SkyHud icon language. */

export type PixelEggVariant = 'sakura' | 'matcha' | 'yuzu' | 'sesame' | 'bunny' | 'default';

type PixelEggProps = {
  variant?: PixelEggVariant;
  className?: string;
  title?: string;
};

const PALETTES: Record<
  PixelEggVariant,
  { shell: string; mid: string; deep: string; shine: string; spot: string; face: string }
> = {
  sakura: {
    shell: '#ffe4ef',
    mid: '#ffc2d4',
    deep: '#e89ab0',
    shine: '#fff7fa',
    spot: '#f5a3b8',
    face: '#8a4a5c',
  },
  matcha: {
    shell: '#e5f5d8',
    mid: '#c5e6a8',
    deep: '#8fbf6a',
    shine: '#f4fbeb',
    spot: '#9fc97a',
    face: '#3f5e2e',
  },
  yuzu: {
    shell: '#fff4c8',
    mid: '#ffe08a',
    deep: '#e0b84c',
    shine: '#fffced',
    spot: '#f0c65a',
    face: '#7a5a18',
  },
  sesame: {
    shell: '#f0ebe3',
    mid: '#d4c4a8',
    deep: '#5a5048',
    shine: '#faf7f2',
    spot: '#3a342e',
    face: '#2a2420',
  },
  bunny: {
    shell: '#ffe8f2',
    mid: '#ffd0e4',
    deep: '#e8a0bc',
    shine: '#fff6fa',
    spot: '#ffb8d2',
    face: '#7a4060',
  },
  default: {
    shell: '#fff6dc',
    mid: '#ffe9b0',
    deep: '#d4a86a',
    shine: '#fffcef',
    spot: '#e8c878',
    face: '#6a4a28',
  },
};

/** Map store / incubating egg ids or names → palette. */
export function eggVariantFromId(idOrName?: string): PixelEggVariant {
  const key = (idOrName || '').toLowerCase();
  if (key.includes('egg1') || key.includes('sakura')) return 'sakura';
  if (key.includes('egg2') || key.includes('matcha')) return 'matcha';
  if (key.includes('egg3') || key.includes('yuzu')) return 'yuzu';
  if (key.includes('egg4') || key.includes('sesame')) return 'sesame';
  if (key.includes('egg5') || key.includes('bunny')) return 'bunny';
  return 'default';
}

export function PixelEgg({ variant = 'default', className, title }: PixelEggProps) {
  const c = PALETTES[variant];

  return (
    <svg
      className={className}
      viewBox="0 0 32 40"
      width="32"
      height="40"
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      {/* Outline */}
      <rect x="12" y="2" width="8" height="2" fill={c.deep} />
      <rect x="8" y="4" width="4" height="2" fill={c.deep} />
      <rect x="20" y="4" width="4" height="2" fill={c.deep} />
      <rect x="6" y="6" width="2" height="4" fill={c.deep} />
      <rect x="24" y="6" width="2" height="4" fill={c.deep} />
      <rect x="4" y="10" width="2" height="16" fill={c.deep} />
      <rect x="26" y="10" width="2" height="16" fill={c.deep} />
      <rect x="6" y="26" width="2" height="4" fill={c.deep} />
      <rect x="24" y="26" width="2" height="4" fill={c.deep} />
      <rect x="8" y="30" width="4" height="2" fill={c.deep} />
      <rect x="20" y="30" width="4" height="2" fill={c.deep} />
      <rect x="12" y="32" width="8" height="2" fill={c.deep} />

      {/* Shell body */}
      <rect x="12" y="4" width="8" height="2" fill={c.shell} />
      <rect x="8" y="6" width="16" height="4" fill={c.shell} />
      <rect x="6" y="10" width="20" height="16" fill={c.mid} />
      <rect x="8" y="26" width="16" height="4" fill={c.mid} />
      <rect x="12" y="30" width="8" height="2" fill={c.deep} opacity="0.55" />

      {/* Top highlight */}
      <rect x="10" y="8" width="4" height="2" fill={c.shine} />
      <rect x="8" y="10" width="2" height="4" fill={c.shine} opacity="0.85" />

      {/* Speckles / marble */}
      <rect x="18" y="12" width="2" height="2" fill={c.spot} opacity="0.75" />
      <rect x="12" y="16" width="2" height="2" fill={c.spot} opacity="0.55" />
      <rect x="20" y="20" width="2" height="2" fill={c.spot} opacity="0.65" />
      <rect x="10" y="22" width="2" height="2" fill={c.spot} opacity="0.45" />
      {variant === 'sesame' && (
        <>
          <rect x="14" y="10" width="2" height="2" fill={c.spot} />
          <rect x="22" y="14" width="2" height="2" fill={c.spot} />
          <rect x="8" y="18" width="2" height="2" fill={c.spot} />
          <rect x="16" y="24" width="2" height="2" fill={c.spot} />
        </>
      )}

      {/* Tiny face */}
      <rect x="12" y="18" width="2" height="2" fill={c.face} />
      <rect x="18" y="18" width="2" height="2" fill={c.face} />
      <rect x="14" y="22" width="4" height="2" fill={c.face} opacity="0.7" />

      {/* Soft shadow under egg */}
      <rect x="10" y="34" width="12" height="2" fill="#000000" opacity="0.18" />
      <rect x="12" y="36" width="8" height="2" fill="#000000" opacity="0.1" />
    </svg>
  );
}
