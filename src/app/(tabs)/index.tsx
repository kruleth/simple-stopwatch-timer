import { useCallback } from 'react';
import { Text, View } from 'react-native';

import { ControlButton } from '@/components/control-button';
import { LapList } from '@/components/lap-list';
import { Screen } from '@/components/screen';
import { TimeDisplay } from '@/components/time-display';
import { useHistory } from '@/context/history-context';
import { useSettings } from '@/context/settings-context';
import { useFeedback } from '@/hooks/use-feedback';
import { useKeepAwakeWhile } from '@/hooks/use-keep-awake-while';
import { useStopwatch } from '@/hooks/use-stopwatch';

/** Repaint rate: fast enough for hundredths, lazy when only seconds are shown. */
const REFRESH_PRECISE_MS = 33;
const REFRESH_COARSE_MS = 250;

export default function StopwatchScreen() {
  const { settings } = useSettings();
  const history = useHistory();
  const feedback = useFeedback();

  const stopwatch = useStopwatch(settings.showHundredths ? REFRESH_PRECISE_MS : REFRESH_COARSE_MS);

  useKeepAwakeWhile(stopwatch.running, 'stopwatch');

  const { running, elapsedMs, laps, start, pause, lap, reset } = stopwatch;
  const idle = !running && elapsedMs === 0;

  const toggle = useCallback(() => {
    feedback.toggle();
    if (running) pause();
    else start();
  }, [feedback, running, pause, start]);

  const onLap = useCallback(() => {
    feedback.tap();
    lap();
  }, [feedback, lap]);

  // Reset doubles as "finish": whatever was on the clock is filed into history
  // before it is cleared, so a run is never silently thrown away.
  const onReset = useCallback(() => {
    const result = reset();
    feedback.warn();

    if (result && settings.saveHistory) {
      history.add({ kind: 'stopwatch', durationMs: result.durationMs, laps: result.laps });
    }
  }, [reset, feedback, settings.saveHistory, history]);

  return (
    <Screen title="Stopwatch">
      <View className="px-6 pb-6 pt-10">
        <TimeDisplay ms={elapsedMs} showHundredths={settings.showHundredths} label="Elapsed" />

        <View className="mt-10 flex-row gap-3">
          {running ? (
            <ControlButton label="Lap" onPress={onLap} testID="stopwatch-lap" />
          ) : (
            <ControlButton
              label="Reset"
              variant="danger"
              onPress={onReset}
              disabled={idle}
              testID="stopwatch-reset"
            />
          )}

          <ControlButton
            label={running ? 'Stop' : idle ? 'Start' : 'Resume'}
            variant="primary"
            onPress={toggle}
            testID="stopwatch-toggle"
          />
        </View>
      </View>

      {laps.length > 0 ? (
        <LapList laps={laps} />
      ) : (
        <View className="px-6">
          <Text className="text-center text-[13px] text-muted dark:text-muted-dark">
            {idle ? 'Press start to begin timing.' : 'Press lap to record a split.'}
          </Text>
        </View>
      )}
    </Screen>
  );
}
