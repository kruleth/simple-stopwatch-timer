import { useCallback, useEffect, useRef, useState } from 'react';

import { rememberDuration, sanitiseRecents } from '@/lib/recents';
import { readJSON, StorageKeys, writeJSON } from '@/lib/storage';

/**
 * The custom timer durations the user has actually run, newest first.
 *
 * Kept under its own storage key rather than inside the timer snapshot: the
 * snapshot describes the countdown currently on screen, this outlives it.
 */
export function useRecentDurations() {
  const [recents, setRecents] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  // Stops an early `remember` writing an empty list over stored data before the
  // initial read has resolved.
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;

    readJSON<unknown>(StorageKeys.recents, []).then((stored) => {
      if (!active) return;
      setRecents(sanitiseRecents(stored));
      loaded.current = true;
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const remember = useCallback((durationMs: number) => {
    setRecents((current) => {
      const next = rememberDuration(current, durationMs);
      if (next !== current && loaded.current) void writeJSON(StorageKeys.recents, next);
      return next;
    });
  }, []);

  return { recents, ready, remember };
}
