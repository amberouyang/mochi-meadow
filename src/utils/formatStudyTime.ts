/** Format a minute total as "2h 30m", "1h", or "45m". */
export function formatStudyMinutes(totalMinutes: number): string {
  const total = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
