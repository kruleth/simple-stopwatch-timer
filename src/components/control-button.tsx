import { Pressable, Text } from 'react-native';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'neutral' | 'danger';

type ControlButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  testID?: string;
};

const surface: Record<Variant, string> = {
  primary: 'bg-accent dark:bg-accent-dark',
  neutral: 'bg-surface dark:bg-surface-dark',
  danger: 'bg-surface dark:bg-surface-dark',
};

const text: Record<Variant, string> = {
  primary: 'text-white',
  neutral: 'text-ink dark:text-ink-dark',
  danger: 'text-danger dark:text-danger-dark',
};

/**
 * Primary transport control. Sized to the 44pt minimum touch target with room
 * to spare, since these get pressed in a hurry.
 */
export function ControlButton({
  label,
  onPress,
  variant = 'neutral',
  disabled = false,
  testID,
}: ControlButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={cn(
        'h-16 flex-1 items-center justify-center rounded-full',
        surface[variant],
        disabled && 'opacity-40'
      )}
      style={({ pressed }) => (pressed && !disabled ? { opacity: 0.75 } : null)}>
      <Text className={cn('text-[17px] font-semibold', text[variant])}>{label}</Text>
    </Pressable>
  );
}
