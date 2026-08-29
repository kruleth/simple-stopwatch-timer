import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type Option<T extends string> = { value: T; label: string };

type SegmentedProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
  accessibilityLabel?: string;
};

/** Compact single-choice control, used for the theme picker and timer presets. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedProps<T>) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      className="flex-row rounded-full bg-surface p-1 dark:bg-surface-dark">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            className={cn('rounded-full px-4 py-1.5', selected && 'bg-canvas dark:bg-canvas-dark')}>
            <Text
              className={cn(
                'text-[14px]',
                selected
                  ? 'font-semibold text-ink dark:text-ink-dark'
                  : 'text-muted dark:text-muted-dark'
              )}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
