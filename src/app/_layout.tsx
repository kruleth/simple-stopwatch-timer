import '../../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HistoryProvider } from '@/context/history-context';
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { navigationTheme, palette } from '@/lib/theme';

/**
 * Root layout.
 *
 * Providers are mounted above the navigator so both tabs and the pushed
 * session screen read the same settings and history state.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <HistoryProvider>
          <RootNavigator />
        </HistoryProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { ready, scheme } = useSettings();
  const colors = palette[scheme];

  // Hold on a plain canvas until the stored theme has been read, so the app
  // never opens light and then snaps to dark a frame later. `scheme` already
  // falls back to the system setting, so this matches the eventual background.
  if (!ready) {
    return <View className="flex-1 bg-canvas dark:bg-canvas-dark" />;
  }

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.canvas },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session/[id]" options={{ title: 'Session' }} />
      </Stack>
    </ThemeProvider>
  );
}
