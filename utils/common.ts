export function toReadableHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
}
