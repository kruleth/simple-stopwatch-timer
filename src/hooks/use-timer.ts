import { useCallback, useEffect, useRef, useState } from 'react';

import { useNow } from '@/hooks/use-now';
import {
  pauseTimer,
  resetTimer,
  startTimer,
  timerHasFinished,
  timerProgress,
  timerRemaining,
} from '@/lib/clock';
import { readJSON, StorageKeys, writeJSON } from '@/lib/storage';
import { EMPTY_TIMER, type TimerSnapshot } from '@/lib/types';

export const MIN_DURATION_MS = 1_000;
export const MAX_DURATION_MS = 99 * 3_600_000;

/**
 * Countdown state, persisted across launches.
 *
 * `onComplete` fires once, at the moment the deadline passes while the app is
 * open. A countdown that elapsed while the app was closed is restored as
 * finished but does not fire it.
 */
export function useTimer(refreshMs: number, onComplete?: () => void) {
  const [snapshot, setSnapshot] = useState<TimerSnapshot>(EMPTY_TIMER);
  const [ready, setReady] = useState(false);
  /** True once a countdown has reached zero, until the timer is touched again. */
  const [finished, setFinished] = useState(false);

  // Kept in a ref, refreshed after each render, so a caller passing an inline
  // arrow does not restart the completion timeout on every render.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    let active = true;

    readJSON<TimerSnapshot>(StorageKeys.timer, EMPTY_TIMER).then((stored) => {
      if (!active) return;
      const restored = { ...EMPTY_TIMER, ...stored };

      // A countdown that elapsed while the app was closed is shown as finished,
      // but silently — firing the completion alert on launch would be startling.
      if (timerHasFinished(restored, Date.now())) {
        setSnapshot({ ...restored, endsAt: null, remainingMs: 0 });
        setFinished(true);
      } else {
        setSnapshot(restored);
      }

      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const running = snapshot.endsAt !== null;
  const now = useNow(running, refreshMs);
  const remainingMs = timerRemaining(snapshot, now);

  const apply = useCallback((transition: (current: TimerSnapshot, at: number) => TimerSnapshot) => {
    setSnapshot((current) => {
      const next = transition(current, Date.now());
      if (next !== current) void writeJSON(StorageKeys.timer, next);
      return next;
    });
  }, []);

  /**
   * Completion is a single timeout aimed at the deadline rather than a check on
   * every repaint, so it fires once and at the right moment regardless of how
   * often the screen is redrawing. Clearing `endsAt` is what stops it re-arming.
   */
  useEffect(() => {
    const { endsAt } = snapshot;
    if (endsAt === null) return;

    const id = setTimeout(
      () => {
        apply((current) => ({ ...current, endsAt: null, remainingMs: 0 }));
        setFinished(true);
        onCompleteRef.current?.();
      },
      Math.max(0, endsAt - Date.now())
    );

    return () => clearTimeout(id);
  }, [snapshot, apply]);

  const start = useCallback(() => {
    setFinished(false);
    apply(startTimer);
  }, [apply]);

  const pause = useCallback(() => apply(pauseTimer), [apply]);

  const reset = useCallback(() => {
    setFinished(false);
    apply(resetTimer);
  }, [apply]);

  /** Changing the duration always stops the clock — editing a running timer is confusing. */
  const setDuration = useCallback(
    (durationMs: number) => {
      const clamped = Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, Math.round(durationMs)));
      setFinished(false);
      apply(() => ({ durationMs: clamped, remainingMs: clamped, endsAt: null }));
    },
    [apply]
  );

  return {
    ready,
    running,
    finished,
    remainingMs,
    durationMs: snapshot.durationMs,
    progress: timerProgress(snapshot, now),
    start,
    pause,
    reset,
    setDuration,
  };
}
