import { View } from 'react-native';

/** Thin fill showing how much of the countdown has run. `value` is 0 to 1. */
export function ProgressBar({ value }: { value: number }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className="h-1 w-full overflow-hidden rounded-full bg-surface dark:bg-surface-dark">
      <View
        className="h-full rounded-full bg-accent dark:bg-accent-dark"
        style={{ width: `${percent}%` }}
      />
    </View>
  );
}
