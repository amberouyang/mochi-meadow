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
 */
export function MeadowPanBackground({ children }: MeadowPanBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const maxPanRef = useRef(0);
  const [offset, setOffset] = useState(0);

  const recalcMaxPan = useCallback(() => {
    const c = containerRef.current;
    const img = imgRef.current;
    if (!c || !img || !img.complete) return;
    maxPanRef.current = Math.max(0, img.offsetWidth - c.clientWidth);
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => recalcMaxPan());
    ro.observe(c);
    return () => ro.disconnect();
  }, [recalcMaxPan]);

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
      <div className="meadow-pan-track" style={{ transform: `translate3d(${offset}px, 0, 0)` }}>
        <img
          ref={imgRef}
          src={meadowUrl}
          alt=""
          className="meadow-pan-img"
          onLoad={recalcMaxPan}
          draggable={false}
        />
        {children}
      </div>
    </div>
  );
}
