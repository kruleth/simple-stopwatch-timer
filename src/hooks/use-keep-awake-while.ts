import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';

import { useSettings } from '@/context/settings-context';

/**
 * Holds the screen on while `active`, if the user has that setting enabled.
 *
 * Each caller passes its own tag so the stopwatch and the timer can hold the
 * lock independently without one releasing the other's.
 *
 * Acquiring is asynchronous, and releasing a lock that has not finished
 * acquiring rejects — so the cleanup waits on the acquire and only releases a
 * lock it actually took. Failures are swallowed throughout: keeping the screen
 * on is a convenience, and the platform refuses it often enough (unsupported
 * hardware, a backgrounded browser tab) that it must never surface as an error.
 */
export function useKeepAwakeWhile(active: boolean, tag: string) {
  const { settings } = useSettings();
  const shouldHold = active && settings.keepAwake;

  useEffect(() => {
    if (!shouldHold) return;

    const acquired = activateKeepAwakeAsync(tag).then(
      () => true,
      () => false
    );

    return () => {
      void acquired
        .then(async (ok) => {
          if (ok) await deactivateKeepAwake(tag);
        })
        .catch(() => {});
    };
  }, [shouldHold, tag]);
}
