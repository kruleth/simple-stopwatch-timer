import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />

      <View className="flex-1 items-center justify-center bg-canvas px-10 dark:bg-canvas-dark">
        <Text className="text-center text-[15px] text-ink dark:text-ink-dark">
          That screen does not exist.
        </Text>

        <Link href="/" className="mt-3">
          <Text className="text-[15px] text-accent dark:text-accent-dark">Go to the stopwatch</Text>
        </Link>
      </View>
    </>
  );
}
