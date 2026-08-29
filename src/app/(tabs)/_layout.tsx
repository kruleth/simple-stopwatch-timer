import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettings } from '@/context/settings-context';
import { palette } from '@/lib/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Bar height above the home indicator / window edge.
 *
 * Has to clear the tab item's own 5px vertical padding, the 28px icon block,
 * and a 14px label line. Anything tighter and flex shrinks the label, which
 * clips its glyphs — the default web height does exactly that.
 */
const TAB_BAR_HEIGHT = 56;

/**
 * Bottom tab navigator — the app's primary navigation.
 *
 * Headers are off here because every screen renders its own title through
 * `<Screen>`, which keeps the type scale consistent across tabs and the
 * pushed session detail route.
 */
export default function TabsLayout() {
  const { scheme } = useSettings();
  const insets = useSafeAreaInsets();
  const colors = palette[scheme];

  const icon =
    (name: IconName, active: IconName) =>
    ({ color, focused }: { color: ColorValue; focused: boolean }) => (
      <Ionicons name={focused ? active : name} size={22} color={color} />
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        // Reserving the inset explicitly keeps the labels clear of the home
        // indicator on iOS and of the window edge on web, where there is no
        // inset to inherit.
        tabBarStyle: {
          backgroundColor: colors.canvas,
          borderTopColor: colors.line,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
        // flexShrink stops the label being compressed below its line height.
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14, flexShrink: 0 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Stopwatch',
          tabBarIcon: icon('stopwatch-outline', 'stopwatch'),
          tabBarButtonTestID: 'tab-stopwatch',
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: icon('hourglass-outline', 'hourglass'),
          tabBarButtonTestID: 'tab-timer',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: icon('time-outline', 'time'),
          tabBarButtonTestID: 'tab-history',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: icon('settings-outline', 'settings'),
          tabBarButtonTestID: 'tab-settings',
        }}
      />
    </Tabs>
  );
}
