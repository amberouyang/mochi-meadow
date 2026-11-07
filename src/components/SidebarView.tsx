import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import './SidebarView.css';

export function SidebarView() {
  const studyMinutesGoal = useStore((s) => s.studyMinutesGoal);
  const studyMinutesToday = useStore((s) => s.studyMinutesToday);
  const tasks = useStore((s) => s.tasks);
  const gardenUnlocked = useStore((s) => s.gardenUnlocked);
  const checkGardenAccess = useStore((s) => s.checkGardenAccess);

  useEffect(() => {
    checkGardenAccess();
  }, [checkGardenAccess, tasks, studyMinutesToday]);

  const studyProgress = Math.min(100, (studyMinutesToday / studyMinutesGoal) * 100);
  const taskDone = tasks.filter((t) => t.done).length;
  const taskTotal = tasks.length;
  const taskProgress = taskTotal ? (taskDone / taskTotal) * 100 : 0;
  const allDone = gardenUnlocked;

  return (
    <div className="sidebar-view">
      <div className="sidebar-bar">
        <div className="sidebar-section">
          <span className="sidebar-label">Study</span>
          <div className="sidebar-progress-wrap">
            <div
              className="sidebar-progress study"
              style={{ height: `${100 - studyProgress}%` }}
            />
          </div>
          <span className="sidebar-pct">{Math.round(studyProgress)}%</span>
        </div>
        <div className="sidebar-section">
          <span className="sidebar-label">Tasks</span>
          <div className="sidebar-progress-wrap">
            <div
              className="sidebar-progress tasks"
              style={{ height: `${100 - taskProgress}%` }}
            />
          </div>
          <span className="sidebar-pct">{taskDone}/{taskTotal}</span>
        </div>
      </div>
      {allDone && (
        <div className="sidebar-done" title="Garden unlocked!">
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="2 6 5 9 10 3" />
          </svg>
        </div>
      )}
    </div>
  );
}
