import Constants from 'expo-constants';
import { useCallback } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Segmented } from '@/components/segmented';
import { ActionRow, SettingGroup, SettingRow, ToggleRow } from '@/components/setting-row';
import { useHistory } from '@/context/history-context';
import { useSettings } from '@/context/settings-context';
import { useFeedback } from '@/hooks/use-feedback';
import type { ThemeChoice } from '@/lib/types';

const THEME_OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { settings, set, reset } = useSettings();
  const { sessions, clear } = useHistory();
  const feedback = useFeedback();

  const confirmClearHistory = useCallback(() => {
    feedback.warn();

    Alert.alert('Clear history?', `This deletes all ${sessions.length} saved runs.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);
  }, [feedback, sessions.length, clear]);

  const confirmReset = useCallback(() => {
    feedback.warn();

    Alert.alert('Reset settings?', 'Preferences go back to their defaults. History is kept.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: reset },
    ]);
  }, [feedback, reset]);

  return (
    <Screen title="Settings">
      <ScrollView contentContainerClassName="pb-12" showsVerticalScrollIndicator={false}>
        <SettingGroup title="Appearance">
          <SettingRow label="Theme">
            <Segmented
              options={THEME_OPTIONS}
              value={settings.theme}
              onChange={(next) => {
                feedback.tap();
                set('theme', next);
              }}
              accessibilityLabel="Theme"
            />
          </SettingRow>

          <ToggleRow
            label="Show hundredths"
            hint="Off ticks once a second and redraws less often."
            value={settings.showHundredths}
            onChange={(next) => set('showHundredths', next)}
            testID="setting-hundredths"
          />
        </SettingGroup>

        <SettingGroup title="While running">
          <ToggleRow
            label="Haptic feedback"
            hint="Vibrate on start, lap, and when a timer finishes."
            value={settings.haptics}
            onChange={(next) => set('haptics', next)}
            testID="setting-haptics"
          />

          <ToggleRow
            label="Keep screen awake"
            hint="Stop the display sleeping while the clock is running."
            value={settings.keepAwake}
            onChange={(next) => set('keepAwake', next)}
            testID="setting-keep-awake"
          />
        </SettingGroup>

        <SettingGroup title="Data">
          <ToggleRow
            label="Save runs to history"
            hint="Finished runs are stored on this device only."
            value={settings.saveHistory}
            onChange={(next) => set('saveHistory', next)}
            testID="setting-save-history"
          />

          <ActionRow
            label="Clear history"
            hint={
              sessions.length === 0
                ? 'Nothing saved yet.'
                : `${sessions.length} run${sessions.length === 1 ? '' : 's'} saved.`
            }
            onPress={confirmClearHistory}
            destructive
            disabled={sessions.length === 0}
            testID="setting-clear-history"
          />

          <ActionRow
            label="Reset settings"
            onPress={confirmReset}
            destructive
            testID="setting-reset"
          />
        </SettingGroup>

        <View className="px-6 pt-8">
          <Text className="text-[13px] text-muted dark:text-muted-dark">
            Lapse {Constants.expoConfig?.version ?? '1.0.0'} · works fully offline
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
