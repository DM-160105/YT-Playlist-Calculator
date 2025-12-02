/**
 * Parses an ISO 8601 duration string (e.g., "PT1H2M10S") into total seconds.
 * @param duration - The ISO 8601 duration string.
 * @returns The total number of seconds.
 */
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) {
    return 0;
  }

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats a number of seconds into a "HH:MM:SS" string.
 * Ensures two digits for each unit (e.g., "01:05:09").
 * @param totalSeconds - The total number of seconds.
 * @returns The formatted time string.
 */
export function formatSecondsToHHMMSS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
