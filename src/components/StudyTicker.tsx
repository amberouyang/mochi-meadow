import { useEffect } from 'react';
import { useStore } from '../store/useStore';

/**
 * Keeps the study clock running even when the Study panel is closed.
 * Mount once under MainView.
 */
export function StudyTicker() {
  const studyState = useStore((s) => s.studyState);
  const tickStudySecond = useStore((s) => s.tickStudySecond);

  useEffect(() => {
    if (studyState !== 'studying') return;
    const id = window.setInterval(() => {
      tickStudySecond();
    }, 1000);
    return () => window.clearInterval(id);
  }, [studyState, tickStudySecond]);

  return null;
}
