import { EMPTY_STOPWATCH, type StopwatchSnapshot, type TimerSnapshot } from '@/lib/types';

/**
 * The timing rules, as pure functions of (state, now).
 *
 * Keeping them out of the hooks means the arithmetic can be tested directly
 * against a fixed clock — see `src/lib/__tests__/clock.test.ts` — instead of
 * having to render a component and wait on real timers.
 */

export const sumLaps = (laps: number[]) => laps.reduce((total, lap) => total + lap, 0);

/* -------------------------------------------------------------------------- */
/* Stopwatch                                                                   */
/* -------------------------------------------------------------------------- */

export function stopwatchElapsed(snapshot: StopwatchSnapshot, now: number): number {
  const current = snapshot.startedAt === null ? 0 : Math.max(0, now - snapshot.startedAt);
  return snapshot.accumulatedMs + current;
}

/** Starting an already-running stopwatch is a no-op, not a restart. */
export function startStopwatch(snapshot: StopwatchSnapshot, now: number): StopwatchSnapshot {
  if (snapshot.startedAt !== null) return snapshot;
  return { ...snapshot, startedAt: now };
}

/** Banks the current segment into `accumulatedMs` and stops the clock. */
export function pauseStopwatch(snapshot: StopwatchSnapshot, now: number): StopwatchSnapshot {
  if (snapshot.startedAt === null) return snapshot;

  return {
    ...snapshot,
    accumulatedMs: stopwatchElapsed(snapshot, now),
    startedAt: null,
  };
}

/**
 * Appends the time since the previous lap.
 *
 * A lap of zero or less means nothing has run since the last one, so the press
 * is ignored rather than recording an empty row.
 */
export function lapStopwatch(snapshot: StopwatchSnapshot, now: number): StopwatchSnapshot {
  const split = stopwatchElapsed(snapshot, now) - sumLaps(snapshot.laps);
  if (split <= 0) return snapshot;

  return { ...snapshot, laps: [...snapshot.laps, split] };
}

export const clearStopwatch = (): StopwatchSnapshot => EMPTY_STOPWATCH;

/* -------------------------------------------------------------------------- */
/* Timer                                                                       */
/* -------------------------------------------------------------------------- */

export function timerRemaining(snapshot: TimerSnapshot, now: number): number {
  if (snapshot.endsAt === null) return Math.max(0, snapshot.remainingMs);
  return Math.max(0, snapshot.endsAt - now);
}

/**
 * Starts, or resumes from where it was paused. A timer sitting at zero starts
 * a fresh full-length countdown rather than finishing instantly.
 */
export function startTimer(snapshot: TimerSnapshot, now: number): TimerSnapshot {
  if (snapshot.endsAt !== null) return snapshot;

  const from = snapshot.remainingMs > 0 ? snapshot.remainingMs : snapshot.durationMs;
  return { ...snapshot, remainingMs: from, endsAt: now + from };
}

export function pauseTimer(snapshot: TimerSnapshot, now: number): TimerSnapshot {
  if (snapshot.endsAt === null) return snapshot;

  return {
    ...snapshot,
    remainingMs: timerRemaining(snapshot, now),
    endsAt: null,
  };
}

export function resetTimer(snapshot: TimerSnapshot): TimerSnapshot {
  return { ...snapshot, remainingMs: snapshot.durationMs, endsAt: null };
}

/** True once the deadline has passed. */
export function timerHasFinished(snapshot: TimerSnapshot, now: number): boolean {
  return snapshot.endsAt !== null && now >= snapshot.endsAt;
}

/** How far through the countdown we are, 0 to 1, for the progress bar. */
export function timerProgress(snapshot: TimerSnapshot, now: number): number {
  if (snapshot.durationMs <= 0) return 0;
  return 1 - timerRemaining(snapshot, now) / snapshot.durationMs;
}
