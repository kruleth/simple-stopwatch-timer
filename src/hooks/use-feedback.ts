import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Platform } from 'react-native';

import { useSettings } from '@/context/settings-context';

/**
 * Haptic feedback that honours the user's setting and never breaks a press.
 *
 * Vibration is unavailable on web and on some Android hardware, so every call
 * is fire-and-forget with the rejection swallowed — feedback is a nicety, not
 * something worth failing an interaction over.
 */
export function useFeedback() {
  const { settings } = useSettings();
  const enabled = settings.haptics && Platform.OS !== 'web';

  return useMemo(() => {
    const fire = (run: () => Promise<void>) => {
      if (!enabled) return;
      run().catch(() => {});
    };

    return {
      /** Lap, and other incidental presses. */
      tap: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
      /** Start and pause. */
      toggle: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
      /** Reset, and anything that discards state. */
      warn: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
      /** Timer reaching zero. */
      done: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
    };
  }, [enabled]);
}
