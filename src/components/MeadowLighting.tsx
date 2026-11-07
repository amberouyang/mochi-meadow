import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export type TimeOfDay = 'day' | 'sunset' | 'night' | 'dawn';

export function getSystemTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  // Late afternoon / sunset: 5 PM – 7:59 PM (17:00 – 19:59)
  if (hour >= 17 && hour < 20) return 'sunset';
  // Night: 8 PM – 4:59 AM (20:00 – 04:59)
  if (hour >= 20 || hour < 5) return 'night';
  // Early morning dawn: 5 AM – 6:59 AM
  if (hour >= 5 && hour < 7) return 'dawn';
  // Daytime: 7 AM – 4:59 PM
  return 'day';
}

interface FireflyData {
  id: number;
  x: number;
  y: number;
  floatDuration: string;
  glowDuration: string;
  delay: string;
  scale: number;
}

const STATIC_FIREFLIES: FireflyData[] = [
  { id: 1, x: 18, y: 35, floatDuration: '5.2s', glowDuration: '2.8s', delay: '0.2s', scale: 0.9 },
  { id: 2, x: 26, y: 55, floatDuration: '4.4s', glowDuration: '2.4s', delay: '1.1s', scale: 1.1 },
  { id: 3, x: 38, y: 42, floatDuration: '6.0s', glowDuration: '3.2s', delay: '0.7s', scale: 0.8 },
  { id: 4, x: 48, y: 68, floatDuration: '4.8s', glowDuration: '2.2s', delay: '1.8s', scale: 1.2 },
  { id: 5, x: 58, y: 38, floatDuration: '5.5s', glowDuration: '3.0s', delay: '0.4s', scale: 0.85 },
  { id: 6, x: 72, y: 52, floatDuration: '4.6s', glowDuration: '2.6s', delay: '2.2s', scale: 1.05 },
  { id: 7, x: 82, y: 32, floatDuration: '5.8s', glowDuration: '3.4s', delay: '1.4s', scale: 0.95 },
  { id: 8, x: 14, y: 72, floatDuration: '4.9s', glowDuration: '2.5s', delay: '0.9s', scale: 1.0 },
  { id: 9, x: 68, y: 78, floatDuration: '5.4s', glowDuration: '2.9s', delay: '1.7s', scale: 1.15 },
  { id: 10, x: 86, y: 64, floatDuration: '4.2s', glowDuration: '2.3s', delay: '0.5s', scale: 0.75 },
  { id: 11, x: 30, y: 28, floatDuration: '5.6s', glowDuration: '3.1s', delay: '2.5s', scale: 0.9 },
  { id: 12, x: 52, y: 82, floatDuration: '4.7s', glowDuration: '2.7s', delay: '1.3s', scale: 1.0 },
];

export function MeadowLighting() {
  const lightingMode = useStore((s) => s.lightingMode);
  const [systemTime, setSystemTime] = useState<TimeOfDay>(getSystemTimeOfDay);

  useEffect(() => {
    // Check every 30 seconds to adjust lighting in real-time
    const interval = window.setInterval(() => {
      setSystemTime(getSystemTimeOfDay());
    }, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const activeLighting = lightingMode === 'auto' ? systemTime : lightingMode;

  return (
    <>
      {/* Ambient lighting tint overlay */}
      <div
        className={`meadow-lighting-overlay meadow-lighting--${activeLighting}`}
        aria-hidden
      />

      {/* Glowing fireflies layer - active during night mode */}
      {activeLighting === 'night' && (
        <div className="meadow-fireflies-layer" aria-hidden>
          {STATIC_FIREFLIES.map((ff) => (
            <div
              key={ff.id}
              className="meadow-firefly"
              style={{
                left: `${ff.x}%`,
                top: `${ff.y}%`,
                ['--ff-float-dur' as string]: ff.floatDuration,
                ['--ff-glow-dur' as string]: ff.glowDuration,
                ['--ff-delay' as string]: ff.delay,
                ['--ff-scale' as string]: `${ff.scale}`,
              }}
            >
              <div className="meadow-firefly-glow" />
              <div className="meadow-firefly-spark" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
