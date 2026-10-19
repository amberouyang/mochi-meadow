import { useEffect, useId, useRef, useState } from 'react';
import './InfoTip.css';

type InfoTipProps = {
  label: string;
  children: string;
};

/** Compact “i” control that reveals a short tip on click. */
export function InfoTip({ label, children }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const tipId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <span className={`info-tip${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="info-tip-btn"
        aria-label={label}
        aria-expanded={open}
        aria-controls={tipId}
        onClick={() => setOpen((value) => !value)}
      >
        i
      </button>
      {open && (
        <span className="info-tip-bubble" id={tipId} role="tooltip">
          {children}
        </span>
      )}
    </span>
  );
}
