import type { ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { useSettings } from '@/context/settings-context';
import { palette } from '@/lib/theme';

type RowProps = {
  label: string;
  hint?: string;
  children?: ReactNode;
};

/** A labelled row inside a settings group. */
export function SettingRow({ label, hint, children }: RowProps) {
  return (
    <View className="flex-row items-center justify-between gap-4 border-b border-line/60 px-6 py-4 dark:border-line-dark/60">
      <View className="flex-1">
        <Text className="text-[16px] text-ink dark:text-ink-dark">{label}</Text>
        {hint ? (
          <Text className="mt-0.5 text-[13px] text-muted dark:text-muted-dark">{hint}</Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Row whose control is a boolean switch. */
export function ToggleRow({
  label,
  hint,
  value,
  onChange,
  testID,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
  testID?: string;
}) {
  const { scheme } = useSettings();
  const colors = palette[scheme];

  return (
    <SettingRow label={label} hint={hint}>
      <Switch
        testID={testID}
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.line, true: colors.accent }}
        thumbColor={colors.canvas}
      />
    </SettingRow>
  );
}

/** Row that behaves as a button, used for destructive actions. */
export function ActionRow({
  label,
  hint,
  onPress,
  destructive = false,
  disabled = false,
  testID,
}: {
  label: string;
  hint?: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => (pressed && !disabled ? { opacity: 0.6 } : null)}>
      <View className="border-b border-line/60 px-6 py-4 dark:border-line-dark/60">
        <Text
          className={
            destructive
              ? 'text-[16px] text-danger dark:text-danger-dark'
              : 'text-[16px] text-ink dark:text-ink-dark'
          }
          style={disabled ? { opacity: 0.4 } : undefined}>
          {label}
        </Text>
        {hint ? (
          <Text className="mt-0.5 text-[13px] text-muted dark:text-muted-dark">{hint}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/** Small caps heading that separates settings groups. */
export function SettingGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="mt-6">
      <Text className="px-6 pb-2 text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
        {title}
      </Text>
      <View className="border-t border-line/60 dark:border-line-dark/60">{children}</View>
    </View>
  );
}
