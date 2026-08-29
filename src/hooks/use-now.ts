import { useEffect, useState } from 'react';

/**
 * Re-renders the caller on an interval while `active`, returning the current
 * epoch time.
 *
 * The running clocks are derived from `Date.now()` rather than counted up per
 * tick, so a dropped or delayed interval costs nothing in accuracy — this hook
 * only decides how often the screen repaints.
 */
export function useNow(active: boolean, intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;

    // Re-read the clock immediately on activation rather than waiting a whole
    // interval. Without this, a timer resumed after a long pause would briefly
    // render against the timestamp from before the pause — a visible jump.
    // Both updates happen in timer callbacks, never synchronously in the effect
    // body or during render.
    const kick = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), intervalMs);

    return () => {
      clearTimeout(kick);
      clearInterval(id);
    };
  }, [active, intervalMs]);

  return now;
}
