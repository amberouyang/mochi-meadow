import type { ReactNode } from 'react';

/**
 * 16×16 pixel-grid icons scaled to ~20px inside sky chips.
 * Built from 1×1 rects + shape-rendering for a tight pixel look; uses currentColor.
 */
function PixelIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="main-sky-pixel-icon"
      viewBox="0 0 16 16"
      width={20}
      height={20}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function SkyIconTodo() {
  return (
    <PixelIcon>
      {/* paper */}
      <rect x="4" y="2" width="9" height="12" fill="currentColor" opacity="0.12" />
      <rect x="4" y="2" width="9" height="1" fill="currentColor" opacity="0.88" />
      <rect x="4" y="13" width="9" height="1" fill="currentColor" opacity="0.88" />
      <rect x="4" y="2" width="1" height="12" fill="currentColor" opacity="0.88" />
      <rect x="12" y="2" width="1" height="12" fill="currentColor" opacity="0.88" />
      <rect x="3" y="2" width="1" height="12" fill="currentColor" opacity="0.52" />
      <rect x="6" y="5" width="5" height="1" fill="currentColor" opacity="0.42" />
      <rect x="6" y="7" width="5" height="1" fill="currentColor" opacity="0.42" />
      <rect x="6" y="9" width="4" height="1" fill="currentColor" opacity="0.42" />
      {/* pencil */}
      <rect x="11" y="10" width="1" height="3" fill="currentColor" opacity="0.72" />
      <rect x="10" y="9" width="3" height="1" fill="currentColor" opacity="0.72" />
      <rect x="12" y="8" width="1" height="1" fill="currentColor" opacity="0.5" />
    </PixelIcon>
  );
}

export function SkyIconStudy() {
  return (
    <PixelIcon>
      {/* square clock face */}
      <rect x="3" y="3" width="10" height="1" fill="currentColor" opacity="0.88" />
      <rect x="3" y="12" width="10" height="1" fill="currentColor" opacity="0.88" />
      <rect x="3" y="4" width="1" height="8" fill="currentColor" opacity="0.88" />
      <rect x="12" y="4" width="1" height="8" fill="currentColor" opacity="0.88" />
      <rect x="7" y="4" width="2" height="1" fill="currentColor" opacity="0.65" />
      <rect x="7" y="11" width="2" height="1" fill="currentColor" opacity="0.65" />
      <rect x="4" y="7" width="1" height="2" fill="currentColor" opacity="0.65" />
      <rect x="11" y="7" width="1" height="2" fill="currentColor" opacity="0.65" />
      {/* hands */}
      <rect x="7" y="7" width="1" height="4" fill="currentColor" opacity="0.9" />
      <rect x="7" y="7" width="4" height="1" fill="currentColor" opacity="0.62" />
      <rect x="7" y="7" width="2" height="2" fill="currentColor" opacity="0.32" />
    </PixelIcon>
  );
}

export function SkyIconEgg() {
  return (
    <PixelIcon>
      <rect x="6" y="3" width="4" height="1" fill="currentColor" opacity="0.88" />
      <rect x="5" y="4" width="6" height="1" fill="currentColor" opacity="0.88" />
      <rect x="4" y="5" width="8" height="6" fill="currentColor" opacity="0.78" />
      <rect x="5" y="12" width="6" height="1" fill="currentColor" opacity="0.88" />
      <rect x="6" y="13" width="4" height="1" fill="currentColor" opacity="0.88" />
      <rect x="6" y="6" width="1" height="2" fill="currentColor" opacity="0.22" />
      <rect x="7" y="5" width="1" height="1" fill="currentColor" opacity="0.22" />
    </PixelIcon>
  );
}

export function SkyIconStore() {
  return (
    <PixelIcon>
      <rect x="3" y="6" width="10" height="1" fill="currentColor" opacity="0.9" />
      <rect x="3" y="7" width="10" height="5" fill="currentColor" opacity="0.52" />
      <rect x="4" y="8" width="8" height="3" fill="currentColor" opacity="0.18" />
      {/* handle — open top */}
      <rect x="6" y="4" width="4" height="1" fill="currentColor" opacity="0.82" />
      <rect x="6" y="5" width="1" height="1" fill="currentColor" opacity="0.82" />
      <rect x="9" y="5" width="1" height="1" fill="currentColor" opacity="0.82" />
      <rect x="4" y="12" width="2" height="2" fill="currentColor" opacity="0.78" />
      <rect x="10" y="12" width="2" height="2" fill="currentColor" opacity="0.78" />
    </PixelIcon>
  );
}

export function SkyIconGear() {
  return (
    <PixelIcon>
      <rect x="7" y="1" width="2" height="2" fill="currentColor" opacity="0.88" />
      <rect x="7" y="13" width="2" height="2" fill="currentColor" opacity="0.88" />
      <rect x="1" y="7" width="2" height="2" fill="currentColor" opacity="0.88" />
      <rect x="13" y="7" width="2" height="2" fill="currentColor" opacity="0.88" />
      <rect x="12" y="3" width="2" height="2" fill="currentColor" opacity="0.72" />
      <rect x="2" y="3" width="2" height="2" fill="currentColor" opacity="0.72" />
      <rect x="12" y="11" width="2" height="2" fill="currentColor" opacity="0.72" />
      <rect x="2" y="11" width="2" height="2" fill="currentColor" opacity="0.72" />
      <rect x="4" y="4" width="8" height="1" fill="currentColor" opacity="0.88" />
      <rect x="4" y="11" width="8" height="1" fill="currentColor" opacity="0.88" />
      <rect x="4" y="5" width="1" height="6" fill="currentColor" opacity="0.88" />
      <rect x="11" y="5" width="1" height="6" fill="currentColor" opacity="0.88" />
      <rect x="6" y="6" width="4" height="4" fill="currentColor" opacity="0.38" />
    </PixelIcon>
  );
}

export function SkyIconFriends() {
  return (
    <PixelIcon>
      <rect x="3" y="5" width="3" height="3" fill="currentColor" opacity="0.88" />
      <rect x="2" y="8" width="5" height="4" fill="currentColor" opacity="0.72" />
      <rect x="10" y="5" width="3" height="3" fill="currentColor" opacity="0.88" />
      <rect x="9" y="8" width="5" height="4" fill="currentColor" opacity="0.72" />
      <rect x="6" y="3" width="4" height="3" fill="currentColor" opacity="0.55" />
    </PixelIcon>
  );
}

export function SkyIconBoard() {
  return (
    <PixelIcon>
      <rect x="3" y="2" width="10" height="12" fill="currentColor" opacity="0.2" />
      <rect x="3" y="2" width="10" height="1" fill="currentColor" opacity="0.9" />
      <rect x="3" y="13" width="10" height="1" fill="currentColor" opacity="0.9" />
      <rect x="3" y="2" width="1" height="12" fill="currentColor" opacity="0.9" />
      <rect x="12" y="2" width="1" height="12" fill="currentColor" opacity="0.9" />
      <rect x="5" y="5" width="6" height="1" fill="currentColor" opacity="0.75" />
      <rect x="5" y="8" width="4" height="1" fill="currentColor" opacity="0.55" />
      <rect x="5" y="11" width="5" height="1" fill="currentColor" opacity="0.55" />
      <rect x="7" y="1" width="2" height="1" fill="currentColor" opacity="0.7" />
    </PixelIcon>
  );
}

export function SkyIconRooms() {
  return (
    <PixelIcon>
      <rect x="2" y="6" width="5" height="7" fill="currentColor" opacity="0.55" />
      <rect x="9" y="4" width="5" height="9" fill="currentColor" opacity="0.72" />
      <rect x="3" y="8" width="1" height="1" fill="currentColor" opacity="0.35" />
      <rect x="5" y="8" width="1" height="1" fill="currentColor" opacity="0.35" />
      <rect x="10" y="6" width="1" height="1" fill="currentColor" opacity="0.35" />
      <rect x="12" y="6" width="1" height="1" fill="currentColor" opacity="0.35" />
      <rect x="11" y="10" width="1" height="3" fill="currentColor" opacity="0.4" />
      <rect x="4" y="4" width="3" height="2" fill="currentColor" opacity="0.45" />
    </PixelIcon>
  );
}
