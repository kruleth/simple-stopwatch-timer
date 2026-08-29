import { useCallback, useEffect, useState } from 'react';

import { useNow } from '@/hooks/use-now';
import {
  clearStopwatch,
  lapStopwatch,
  pauseStopwatch,
  startStopwatch,
  stopwatchElapsed,
} from '@/lib/clock';
import { readJSON, StorageKeys, writeJSON } from '@/lib/storage';
import { EMPTY_STOPWATCH, type StopwatchSnapshot } from '@/lib/types';

/** What a finished run hands back, ready to file into history. */
export type StopwatchResult = { durationMs: number; laps: number[] };

/**
 * Stopwatch state, persisted across launches.
 *
 * All the arithmetic lives in `@/lib/clock`; this hook only owns the React
 * state, the storage round-trip, and the repaint schedule.
 */
export function useStopwatch(refreshMs: number) {
  const [snapshot, setSnapshot] = useState<StopwatchSnapshot>(EMPTY_STOPWATCH);
  const [ready, setReady] = useState(false);

  // Restore any run that was in progress when the app was last closed.
  useEffect(() => {
    let active = true;

    readJSON<StopwatchSnapshot>(StorageKeys.stopwatch, EMPTY_STOPWATCH).then((stored) => {
      if (!active) return;
      setSnapshot({ ...EMPTY_STOPWATCH, ...stored });
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const running = snapshot.startedAt !== null;
  const now = useNow(running, refreshMs);
  const elapsedMs = stopwatchElapsed(snapshot, now);

  /** Applies a transition and mirrors the result to storage in one place. */
  const apply = useCallback(
    (transition: (current: StopwatchSnapshot, at: number) => StopwatchSnapshot) => {
      setSnapshot((current) => {
        const next = transition(current, Date.now());
        if (next !== current) void writeJSON(StorageKeys.stopwatch, next);
        return next;
      });
    },
    []
  );

  const start = useCallback(() => apply(startStopwatch), [apply]);
  const pause = useCallback(() => apply(pauseStopwatch), [apply]);
  const lap = useCallback(() => apply(lapStopwatch), [apply]);

  /**
   * Clears the stopwatch and returns what was on it, so the caller can decide
   * whether the run is worth keeping. Null when nothing had been timed.
   */
  const reset = useCallback((): StopwatchResult | null => {
    const total = stopwatchElapsed(snapshot, Date.now());
    const laps = snapshot.laps;

    apply(clearStopwatch);

    return total > 0 ? { durationMs: total, laps } : null;
  }, [apply, snapshot]);

  return { ready, running, elapsedMs, laps: snapshot.laps, start, pause, lap, reset };
}
