import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ControlButton } from '@/components/control-button';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { TimeDisplay } from '@/components/time-display';
import { useHistory } from '@/context/history-context';
import { useSettings } from '@/context/settings-context';
import { useFeedback } from '@/hooks/use-feedback';
import { useKeepAwakeWhile } from '@/hooks/use-keep-awake-while';
import { useRecentDurations } from '@/hooks/use-recent-durations';
import { MAX_DURATION_MS, MIN_DURATION_MS, useTimer } from '@/hooks/use-timer';
import { cn } from '@/lib/cn';
import { formatPreset } from '@/lib/format';
import { TIMER_PRESETS_MS } from '@/lib/types';

const NUDGE_MS = 60_000;

const REFRESH_PRECISE_MS = 33;
const REFRESH_COARSE_MS = 250;

export default function TimerScreen() {
  const { settings } = useSettings();
  const history = useHistory();
  const feedback = useFeedback();

  // Fires the instant the countdown hits zero. The run itself is filed into
  // history on reset, alongside the abandoned ones, so both paths go through
  // a single place.
  const onComplete = useCallback(() => {
    feedback.done();
  }, [feedback]);

  const timer = useTimer(
    settings.showHundredths ? REFRESH_PRECISE_MS : REFRESH_COARSE_MS,
    onComplete
  );

  const { recents, remember } = useRecentDurations();

  useKeepAwakeWhile(timer.running, 'timer');

  const { running, finished, remainingMs, durationMs, progress, start, pause, reset, setDuration } =
    timer;

  const canEdit = !running;

  const toggle = useCallback(() => {
    feedback.toggle();

    if (running) {
      pause();
      return;
    }

    // Recorded on start rather than on every duration change, so nudging from
    // 5m up to 7m remembers the 7m that was actually run and not the 6m passed
    // through on the way.
    remember(durationMs);
    start();
  }, [feedback, running, pause, start, remember, durationMs]);

  // Reset also records the outcome: a countdown that reached zero is logged as
  // completed, one abandoned partway through is logged as not.
  const onReset = useCallback(() => {
    feedback.warn();

    if (settings.saveHistory && (finished || remainingMs < durationMs)) {
      history.add({
        kind: 'timer',
        durationMs,
        laps: [],
        completed: finished,
      });
    }

    reset();
  }, [feedback, settings.saveHistory, finished, remainingMs, durationMs, history, reset]);

  const nudge = useCallback(
    (delta: number) => {
      feedback.tap();
      setDuration(durationMs + delta);
    },
    [feedback, setDuration, durationMs]
  );

  return (
    <Screen title="Timer">
      <ScrollView contentContainerClassName="px-6 pb-10" showsVerticalScrollIndicator={false}>
        <View className="pt-10">
          <TimeDisplay
            ms={remainingMs}
            showHundredths={settings.showHundredths}
            tone={finished ? 'danger' : 'default'}
            label="Remaining"
          />

          <View className="mt-6">
            <ProgressBar value={progress} />
          </View>

          <Text className="mt-3 text-center text-[13px] text-muted dark:text-muted-dark">
            {finished ? "Time's up" : `Set for ${formatPreset(durationMs)}`}
          </Text>
        </View>

        <View className="mt-10 flex-row gap-3">
          <ControlButton
            label="Reset"
            variant="danger"
            onPress={onReset}
            disabled={!finished && remainingMs === durationMs}
            testID="timer-reset"
          />
          <ControlButton
            label={running ? 'Pause' : finished ? 'Restart' : 'Start'}
            variant="primary"
            onPress={toggle}
            testID="timer-toggle"
          />
        </View>

        <View className={cn('mt-10', !canEdit && 'opacity-40')}>
          <Text className="pb-3 text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
            Duration
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {TIMER_PRESETS_MS.map((preset) => (
              <DurationChip
                key={preset}
                durationMs={preset}
                selected={preset === durationMs}
                disabled={!canEdit}
                onPress={() => {
                  feedback.tap();
                  setDuration(preset);
                }}
              />
            ))}
          </View>

          {recents.length > 0 ? (
            <View className="mt-6">
              <Text className="pb-3 text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
                Recent
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {recents.map((recent) => (
                  <DurationChip
                    key={recent}
                    durationMs={recent}
                    selected={recent === durationMs}
                    disabled={!canEdit}
                    onPress={() => {
                      feedback.tap();
                      setDuration(recent);
                    }}
                    testID={`timer-recent-${recent}`}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <View className="mt-4 flex-row gap-2">
            <NudgeButton
              label="−1 min"
              onPress={() => nudge(-NUDGE_MS)}
              disabled={!canEdit || durationMs <= MIN_DURATION_MS}
            />
            <NudgeButton
              label="+1 min"
              onPress={() => nudge(NUDGE_MS)}
              disabled={!canEdit || durationMs >= MAX_DURATION_MS}
            />
          </View>

          {!canEdit ? (
            <Text className="mt-3 text-[13px] text-muted dark:text-muted-dark">
              Pause the timer to change its duration.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

/** One duration pill. Shared by the fixed presets and the recent durations. */
function DurationChip({
  durationMs,
  selected,
  disabled,
  onPress,
  testID,
}: {
  durationMs: number;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
  testID?: string;
}) {
  const label = formatPreset(durationMs);

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      className={cn(
        'rounded-full border px-4 py-2',
        selected
          ? 'border-accent bg-accent dark:border-accent-dark dark:bg-accent-dark'
          : 'border-line dark:border-line-dark'
      )}>
      <Text
        className={cn(
          'text-[14px]',
          selected ? 'font-semibold text-white' : 'text-ink dark:text-ink-dark'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

function NudgeButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={cn(
        'flex-1 items-center rounded-full bg-surface py-3 dark:bg-surface-dark',
        disabled && 'opacity-40'
      )}>
      <Text className="text-[15px] text-ink dark:text-ink-dark">{label}</Text>
    </Pressable>
  );
}
