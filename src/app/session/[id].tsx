import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { LapList } from '@/components/lap-list';
import { useHistory } from '@/context/history-context';
import { useFeedback } from '@/hooks/use-feedback';
import { formatDuration, formatWhen } from '@/lib/format';
import { monoFont } from '@/lib/theme';

/**
 * Detail for one saved run, pushed onto the stack from the History tab.
 *
 * This is the second navigation pattern in the app: tabs for the top level,
 * a stack push for drilling into a record.
 */
export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions, ready, remove } = useHistory();
  const feedback = useFeedback();

  const session = sessions.find((entry) => entry.id === id);

  const confirmDelete = useCallback(() => {
    if (!session) return;
    feedback.warn();

    Alert.alert('Delete this run?', 'It will be removed from history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          remove(session.id);
          router.back();
        },
      },
    ]);
  }, [session, feedback, remove]);

  // `ready` distinguishes "history still loading" from "this id is genuinely
  // gone", which happens if the run is deleted from another screen.
  if (!ready) return null;

  if (!session) {
    return (
      <View className="flex-1 bg-canvas dark:bg-canvas-dark">
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState title="That run is no longer saved" hint="It may have been deleted." />
      </View>
    );
  }

  const title = session.kind === 'stopwatch' ? 'Stopwatch run' : 'Timer run';

  return (
    <View className="flex-1 bg-canvas dark:bg-canvas-dark">
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <Pressable
              onPress={confirmDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete run"
              testID="session-delete"
              // Native insets its header controls; the web header does not, and
              // without this the button sits flush against the window edge.
              className={Platform.OS === 'web' ? 'pr-4' : undefined}
              style={({ pressed }) => (pressed ? { opacity: 0.6 } : null)}>
              <Text className="text-[15px] text-danger dark:text-danger-dark">Delete</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="border-b border-line/60 px-6 pb-6 pt-4 dark:border-line-dark/60">
          <Text
            style={{ fontFamily: monoFont }}
            className="text-[44px] text-ink dark:text-ink-dark">
            {formatDuration(session.durationMs)}
          </Text>
          <Text className="mt-1 text-[13px] text-muted dark:text-muted-dark">
            {formatWhen(session.endedAt)}
          </Text>
        </View>

        {session.kind === 'timer' ? (
          <View className="px-6 py-5">
            <Text className="text-[15px] text-ink dark:text-ink-dark">
              {session.completed ? 'Ran to zero.' : 'Stopped before finishing.'}
            </Text>
          </View>
        ) : session.laps.length > 0 ? (
          <View className="pt-5">
            <LapList laps={session.laps} scrollEnabled={false} />
          </View>
        ) : (
          <View className="px-6 py-5">
            <Text className="text-[15px] text-muted dark:text-muted-dark">
              No laps were recorded.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
