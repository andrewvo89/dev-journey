export function toReadableHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export const isMac = isClient && navigator.userAgent.toLowerCase().includes('mac');

export const modKey = isMac ? '⌘' : 'Ctrl';

export const githubUrl = process.env.NEXT_PUBLIC_GH_DATASET_URL;

export const issuesUrl = `${githubUrl}/issues`;

export const bmacUrl = process.env.NEXT_PUBLIC_BMAC_URL;
