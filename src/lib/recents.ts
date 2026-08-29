import { MAX_RECENT_DURATIONS, TIMER_PRESETS_MS } from '@/lib/types';

/**
 * The "recent durations" rule, as a pure function.
 *
 * A duration earns a chip only if it is not already one of the fixed presets —
 * there is no point offering a second way to pick 5 minutes. The newest sits
 * first, repeats move back to the front rather than appearing twice, and the
 * list is capped.
 */
export function rememberDuration(
  recents: number[],
  durationMs: number,
  presets: readonly number[] = TIMER_PRESETS_MS,
  max: number = MAX_RECENT_DURATIONS
): number[] {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return recents;
  if (presets.includes(durationMs)) return recents;

  const next = [durationMs, ...recents.filter((value) => value !== durationMs)].slice(0, max);

  // Returning the original array when nothing moved lets callers skip a write
  // and a re-render.
  const unchanged =
    next.length === recents.length && next.every((value, i) => value === recents[i]);

  return unchanged ? recents : next;
}

/** Drops anything a corrupted or hand-edited storage entry might contain. */
export function sanitiseRecents(value: unknown, max: number = MAX_RECENT_DURATIONS): number[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (entry): entry is number => typeof entry === 'number' && Number.isFinite(entry) && entry > 0
    )
    .slice(0, max);
}
