import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import meadowUrl from '../assets/meadow-background.png';

type MeadowPanBackgroundProps = {
  /** Rendered inside the panning layer so decor moves with the meadow art. */
  children?: ReactNode;
};

/**
 * Full-bleed meadow image that pans horizontally with the mouse, bounded so you can
 * look from one side of the art to the other (not infinite scroll).
 * Scaled with a CSS “cover” so the viewport never shows empty side strips.
 */
export function MeadowPanBackground({ children }: MeadowPanBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const maxPanRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const recalc = useCallback(() => {
    const c = containerRef.current;
    const img = imgRef.current;
    if (!c || !img || !img.naturalWidth || !img.naturalHeight) return;

    const cw = c.clientWidth;
    const ch = c.clientHeight;
    if (cw <= 0 || ch <= 0) return;

    // Cover: scale so the image always fills both axes (may overflow one side).
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const maxPan = Math.max(0, w - cw);

    maxPanRef.current = maxPan;
    setSize({ w, h });
    setOffset((prev) => Math.max(-maxPan, Math.min(0, prev)));
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => recalc());
    ro.observe(c);
    return () => ro.disconnect();
  }, [recalc]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }
      const ratio = (e.clientX - rect.left) / rect.width;
      const r = Math.max(0, Math.min(1, ratio));
      const maxPan = maxPanRef.current;
      setOffset(-r * maxPan);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="meadow-pan" ref={containerRef}>
      <div
        className="meadow-pan-track"
        style={{
          width: size.w || '100%',
          height: size.h || '100%',
          /* -50% Y keeps cover-scaled art vertically centered in the viewport */
          transform: `translate3d(${offset}px, -50%, 0)`,
        }}
      >
        <img
          ref={imgRef}
          src={meadowUrl}
          alt=""
          className="meadow-pan-img"
          style={
            size.w
              ? { width: size.w, height: size.h }
              : { width: '100%', height: '100%', objectFit: 'cover' }
          }
          onLoad={recalc}
          draggable={false}
        />
        {children}
      </div>
    </div>
  );
}
