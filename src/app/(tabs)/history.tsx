import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useHistory } from '@/context/history-context';
import { useFeedback } from '@/hooks/use-feedback';
import { formatDuration, formatWhen } from '@/lib/format';
import { monoFont } from '@/lib/theme';
import type { Session } from '@/lib/types';

export default function HistoryScreen() {
  const { sessions, ready, clear } = useHistory();
  const feedback = useFeedback();

  const confirmClear = useCallback(() => {
    feedback.warn();

    Alert.alert('Clear history?', `This deletes all ${sessions.length} saved runs.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);
  }, [feedback, sessions.length, clear]);

  return (
    <Screen
      title="History"
      action={
        sessions.length > 0 ? (
          <Pressable
            onPress={confirmClear}
            accessibilityRole="button"
            accessibilityLabel="Clear history"
            testID="history-clear"
            style={({ pressed }) => (pressed ? { opacity: 0.6 } : null)}>
            <Text className="text-[15px] text-danger dark:text-danger-dark">Clear</Text>
          </Pressable>
        ) : null
      }>
      {!ready ? null : sessions.length === 0 ? (
        <EmptyState
          title="No saved runs yet"
          hint="Finished stopwatch and timer runs are kept here, on this device."
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(session) => session.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 pb-10"
          renderItem={({ item }) => <SessionRow session={item} />}
        />
      )}
    </Screen>
  );
}

function SessionRow({ session }: { session: Session }) {
  const detail =
    session.kind === 'stopwatch'
      ? session.laps.length === 0
        ? 'Stopwatch'
        : `Stopwatch · ${session.laps.length} lap${session.laps.length === 1 ? '' : 's'}`
      : `Timer · ${session.completed ? 'completed' : 'stopped early'}`;

  return (
    <Link href={`/session/${session.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${detail}, ${formatDuration(session.durationMs)}, ${formatWhen(session.endedAt)}`}
        style={({ pressed }) => (pressed ? { opacity: 0.6 } : null)}>
        <View className="flex-row items-center justify-between border-b border-line/60 py-4 dark:border-line-dark/60">
          <View className="flex-1 pr-4">
            <Text className="text-[15px] text-ink dark:text-ink-dark">{detail}</Text>
            <Text className="mt-0.5 text-[13px] text-muted dark:text-muted-dark">
              {formatWhen(session.endedAt)}
            </Text>
          </View>

          <Text
            style={{ fontFamily: monoFont }}
            className="text-[16px] text-ink dark:text-ink-dark">
            {formatDuration(session.durationMs, false)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
