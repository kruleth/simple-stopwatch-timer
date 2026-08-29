import { Text, View } from 'react-native';

/** Placeholder for a list with nothing in it yet. */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View className="flex-1 items-center justify-center px-10 py-16">
      <Text className="text-center text-[15px] text-ink dark:text-ink-dark">{title}</Text>
      {hint ? (
        <Text className="mt-1 text-center text-[13px] text-muted dark:text-muted-dark">{hint}</Text>
      ) : null}
    </View>
  );
}
