/**
 * Duration formatting helpers.
 *
 * Split into pure functions so they can be unit tested without a renderer —
 * see `src/lib/__tests__/format.test.ts`.
 */

export type TimeParts = {
  /** `MM:SS`, or `H:MM:SS` once the duration passes an hour. */
  main: string;
  /** Two-digit hundredths, without the separator. */
  hundredths: string;
};

const pad = (n: number, width = 2) => String(Math.floor(n)).padStart(width, '0');

/**
 * Break a duration in milliseconds into display parts.
 *
 * Negative input is clamped to zero: a countdown that overshoots its deadline
 * between ticks should read `00:00`, never `-00:01`.
 */
export function toTimeParts(ms: number): TimeParts {
  const total = Math.max(0, ms);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  const hundredths = Math.floor((total % 1000) / 10);

  const main =
    hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;

  return { main, hundredths: pad(hundredths) };
}

/** Flat string form, used for list rows and accessibility labels. */
export function formatDuration(ms: number, showHundredths = true): string {
  const { main, hundredths } = toTimeParts(ms);
  return showHundredths ? `${main}.${hundredths}` : main;
}

/** Spoken form for screen readers, e.g. "1 minute, 23 seconds". */
export function formatSpoken(ms: number): string {
  const total = Math.max(0, ms);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);

  const parts: string[] = [];
  if (hours) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (minutes) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  return parts.join(', ');
}

/** `2m 30s` — compact label for the timer preset chips. */
export function formatPreset(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  if (minutes && seconds) return `${minutes}m ${seconds}s`;
  if (minutes) return `${minutes}m`;
  return `${seconds}s`;
}

/** Relative day label for history rows, falling back to a short date. */
export function formatWhen(timestamp: number, now = Date.now()): string {
  const time = new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const startOfYesterday = startOfToday - 86_400_000;

  if (timestamp >= startOfToday) return `Today, ${time}`;
  if (timestamp >= startOfYesterday) return `Yesterday, ${time}`;

  const date = new Date(timestamp).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
  return `${date}, ${time}`;
}
